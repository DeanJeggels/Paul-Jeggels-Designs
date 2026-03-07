import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const {
      query_text,
      query_embedding,
      match_count = 10,
      filter = {},
      full_text_weight = 1,
      semantic_weight = 1,
      rrf_k = 50,
    } = body

    // Validation
    if (!query_text || !query_embedding) {
      return new Response(JSON.stringify({ error: 'Missing query_text or query_embedding' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (query_embedding.length !== 1536) {
      return new Response(JSON.stringify({ error: 'Embedding must be 1536 dimensions' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client with service role key to bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Call the hybrid search RPC function
    const { data, error } = await supabaseClient.rpc('hybrid_search_pjd', {
      query_text,
      query_embedding,
      match_count,
      filter,
      full_text_weight,
      semantic_weight,
      rrf_k,
    })

    if (error) {
      console.error('RPC Error:', error)
      throw error
    }

    return new Response(JSON.stringify({ results: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
