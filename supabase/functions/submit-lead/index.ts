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

// Per-field length caps. Without these the table accepts arbitrarily large
// strings, so a single request could write megabytes.
const MAX_LENGTHS: Record<string, number> = {
  name: 120,
  email: 254, // RFC 5321 maximum
  phone: 32,
  interest: 40,
  message: 5000,
  source: 40,
  board_type: 40,
  height_cm: 10,
  weight_kg: 10,
  wave_type: 40,
  length_board: 20,
  width_board: 20,
  thickness_board: 20,
  fin_setup: 60,
  glass_job: 60,
  notes: 5000,
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Strip control characters, which have no business in a lead and are the usual
// vehicle for log injection and header smuggling. Newlines and tabs survive in
// free-text fields; everything else is collapsed to a space.
function stripControl(value: string, allowNewlines: boolean): string {
  const pattern = allowNewlines
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g
    : /[\u0000-\u001F\u007F]/g
  return value.replace(pattern, ' ')
}

function sanitise(key: string, value: string): string {
  const freeText = key === 'message' || key === 'notes'
  let cleaned = stripControl(value, freeText).trim()
  if (key === 'phone') cleaned = normalisePhone(cleaned)
  const cap = MAX_LENGTHS[key] ?? 200
  return cleaned.length > cap ? cleaned.slice(0, cap) : cleaned
}

// Structural phone check only. The browser does the real validation with full
// libphonenumber metadata and submits E.164; this is the backstop that keeps
// junk ("n/a", prose, 500 characters of padding) out of the table when that
// layer is bypassed or fails to load. Deliberately not country-aware: the
// server has no metadata, and guessing here would reject valid numbers.
// "+27 082 960 9353" keeps the national trunk zero, which is invalid in E.164
// but is how most people write their own number. Drop it so what we store is
// actually dialable. The browser normalises this too; this covers the path
// where the validation script was blocked and raw text arrived.
function normalisePhone(phone: string): string {
  return phone.replace(/[\s().\u2010-\u2015-]/g, '').replace(/^\+270/, '+27')
}

// Deliberately structural only. Country-aware length rules live in the browser
// where there is full metadata; duplicating them here without that metadata
// rejected real numbers (a 10-digit 0861 UAN, for one), and turning away a
// paying customer costs more than storing an occasional bad number.
function isValidPhone(phone: string): boolean {
  return /^\+?[0-9]{7,15}$/.test(normalisePhone(phone))
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

    // Phone is optional, but a present one must be structurally plausible.
    if (body.phone !== undefined && body.phone !== null && String(body.phone).trim().length > 0) {
      if (typeof body.phone !== 'string' || !isValidPhone(body.phone)) {
        return new Response(
          JSON.stringify({ error: 'That phone number does not look right. Include the country code, or leave the field empty.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Build sanitised payload — only allow known fields
    const payload: Record<string, string | null> = {}
    for (const [key, value] of Object.entries(body)) {
      if (ALLOWED_FIELDS.has(key)) {
        const cleaned = typeof value === 'string' ? sanitise(key, value) : ''
        payload[key] = cleaned.length > 0 ? cleaned : null
      }
    }

    // Ensure required fields aren't nulled out
    payload.name = sanitise('name', body.name)
    payload.email = sanitise('email', body.email).toLowerCase()

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
