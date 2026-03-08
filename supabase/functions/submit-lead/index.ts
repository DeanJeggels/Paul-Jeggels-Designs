import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting: 10 submissions per 15 minutes per IP
const RATE_LIMIT = 10
const RATE_WINDOW_MS = 15 * 60 * 1000
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const N8N_WEBHOOK = 'https://n8n-uq4a.onrender.com/webhook/pjd-new-lead'

// Allowed fields for pjd_leads table
const ALLOWED_FIELDS = new Set([
  'name', 'email', 'phone', 'interest', 'message', 'source',
  'board_type', 'height_cm', 'weight_kg', 'wave_type',
  'length_board', 'width_board', 'thickness_board',
  'fin_setup', 'glass_job', 'notes',
])

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (entry && now < entry.resetAt) {
    if (entry.count >= RATE_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'Too many submissions. Please try again later or call Paul directly at +27 82 960 9353.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    entry.count++
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
  }

  try {
    const body = await req.json()

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Name is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!body.email || typeof body.email !== 'string' || !isValidEmail(body.email)) {
      return new Response(
        JSON.stringify({ error: 'A valid email address is required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build sanitised payload — only allow known fields
    const payload: Record<string, string | null> = {}
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_FIELDS.has(key)) {
        payload[key] = typeof value === 'string' && value.trim().length > 0
          ? value.trim()
          : null
      }
    }

    // Ensure required fields aren't nulled out
    payload.name = body.name.trim()
    payload.email = body.email.trim().toLowerCase()

    // Insert using service role key (bypasses RLS)
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data, error } = await supabase
      .from('pjd_leads')
      .insert([payload])
      .select('id')

    if (error) {
      console.error('Supabase insert error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to submit. Please try again or call Paul at +27 82 960 9353.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const leadId = data?.[0]?.id

    // Fire N8N webhook (non-blocking)
    try {
      await fetch(N8N_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, id: leadId }),
      })
    } catch {
      // Non-blocking — webhook failure doesn't affect user
    }

    return new Response(
      JSON.stringify({ success: true, id: leadId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (err) {
    console.error('Submit lead error:', err)
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
