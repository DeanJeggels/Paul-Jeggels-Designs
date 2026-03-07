import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting: 20 requests per 15 minutes per IP
const RATE_LIMIT = 20
const RATE_WINDOW_MS = 15 * 60 * 1000
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const SYSTEM_PROMPT = `You are a friendly assistant for Paul Jeggels Designs, a custom surfboard shaper in Jeffreys Bay, South Africa. Paul has been shaping boards for over 40 years.

Your personality:
- Friendly, warm, like a knowledgeable surf shop assistant
- Use plain language — no technical jargon unless the visitor uses it first
- Keep responses concise — 2-3 sentences max unless they ask for detail
- If you're not sure about something, say "Paul can answer that better — want me to connect you?"
- You can suggest the board quiz: "Want help finding your perfect board? Try our quick quiz on the homepage"
- When someone seems ready to order, encourage them to leave their name and email so Paul can reach out

Important facts:
- Custom boards: R5,000 to R15,000+ depending on size and design
- Timeline: 2-4 weeks from chat to finished board
- Paul shapes every board himself — no factory, no templates
- Workshop: 15 Dageraad Street, Jeffreys Bay
- Phone: +27 82 960 9353
- Beginners welcome — Paul shapes boards for all levels`

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({ reply: "You've sent a lot of messages! Try again in a few minutes, or reach Paul directly at +27 82 960 9353." }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    entry.count++
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
  }

  try {
    const { message, history } = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Search knowledge base via RAG webhook (hybrid search + embeddings)
    const searchTerms = message
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 2)
      .slice(0, 6)
      .join(' ')

    let contextText = ''

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3000)
      const ragResponse = await fetch('https://n8n-uq4a.onrender.com/webhook/rag-pjd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: message }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (ragResponse.ok) {
        const ragData = await ragResponse.json()
        contextText = ragData.contents?.join('\n\n') || ''
      }
    } catch {
      // Fallback to keyword search if RAG webhook unavailable or times out
    }

    if (!contextText) {
      try {
        const { data: context } = await supabase
          .rpc('keyword_search_pjd', {
            query_text: searchTerms,
            match_count: 5,
          })
        contextText = context?.map((c: { content: string }) => c.content).join('\n\n') || ''
      } catch {
        const { data: context } = await supabase
          .from('documents_pjd')
          .select('content, metadata')
          .textSearch('fts', searchTerms, { config: 'english' })
          .limit(5)
        contextText = context?.map((c: { content: string }) => c.content).join('\n\n') || ''
      }
    }

    // Build messages array
    const messages = [
      ...(history || []).slice(-10),
      { role: 'user', content: message }
    ]

    // Call Claude API
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!anthropicKey) {
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        system: contextText
          ? `${SYSTEM_PROMPT}\n\nRelevant information about PJD:\n${contextText}`
          : SYSTEM_PROMPT,
        messages,
      }),
    })

    if (!claudeResponse.ok) {
      const errText = await claudeResponse.text()
      console.error('Claude API error:', errText)
      return new Response(
        JSON.stringify({ reply: "I'm having trouble right now. You can reach Paul directly at +27 82 960 9353 or take the board quiz on the homepage." }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const claudeData = await claudeResponse.json()
    const reply = claudeData.content?.[0]?.text || "I'm not sure about that. Want me to connect you with Paul?"

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Chat function error:', err)
    return new Response(
      JSON.stringify({ reply: "Something went wrong. You can reach Paul at +27 82 960 9353." }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
