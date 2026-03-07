import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
- Timeline: 1-3 weeks from chat to finished board
- Paul shapes every board himself — no factory, no templates
- Workshop: 15 Dageraad Street, Jeffreys Bay
- Phone: +27 82 960 9353
- Beginners welcome — Paul shapes boards for all levels`

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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

    // Search knowledge base using keyword search function
    const searchTerms = message
      .toLowerCase()
      .split(/\s+/)
      .filter((w: string) => w.length > 2)
      .slice(0, 6)
      .join(' ')

    let contextText = ''

    try {
      const { data: context } = await supabase
        .rpc('keyword_search_pjd', {
          query_text: searchTerms,
          match_count: 5,
        })

      contextText = context?.map((c: { content: string }) => c.content).join('\n\n') || ''
    } catch {
      // Fallback: direct table query if function not available yet
      const { data: context } = await supabase
        .from('documents_pjd')
        .select('content, metadata')
        .textSearch('fts', searchTerms, { config: 'english' })
        .limit(5)

      contextText = context?.map((c: { content: string }) => c.content).join('\n\n') || ''
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
