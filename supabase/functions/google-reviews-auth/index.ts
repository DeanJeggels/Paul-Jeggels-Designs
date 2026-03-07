/**
 * One-time OAuth helper for Google Business Profile API.
 *
 * Usage:
 *   1. Deploy this function
 *   2. Visit the function URL in your browser → redirects to Google consent
 *   3. After consent, you'll see your refresh token → store it as a Supabase secret
 *   4. Visit with ?discover=true to find your account/location IDs
 *   5. Delete this function once setup is complete
 *
 * Required Supabase secrets:
 *   GOOGLE_OAUTH_CLIENT_ID
 *   GOOGLE_OAUTH_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN (set after step 3, needed for step 4)
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SCOPES = 'https://www.googleapis.com/auth/business.manage'

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const clientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
  const clientSecret = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')

  if (!clientId || !clientSecret) {
    return new Response(
      '<h1>Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET</h1><p>Set these as Supabase secrets first.</p>',
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    )
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const discover = url.searchParams.get('discover')
  const redirectUri = 'https://dplbfhwqbmnzmrncxain.supabase.co/functions/v1/google-reviews-auth'

  // Step 4: Discovery mode — list accounts and locations
  if (discover) {
    const refreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN')
    if (!refreshToken) {
      return new Response(
        '<h1>No refresh token found</h1><p>Complete the OAuth flow first, then set GOOGLE_REFRESH_TOKEN as a Supabase secret.</p>',
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      )
    }

    try {
      // Get access token from refresh token
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        }),
      })
      const tokenData = await tokenRes.json()

      if (!tokenData.access_token) {
        return new Response(
          `<h1>Token refresh failed</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`,
          { status: 400, headers: { 'Content-Type': 'text/html' } }
        )
      }

      const accessToken = tokenData.access_token

      // List accounts
      const accountsRes = await fetch(
        'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      const accountsData = await accountsRes.json()

      let html = '<h1>Google Business Profile — Discovery</h1>'
      html += '<h2>Accounts</h2>'
      html += `<pre>${JSON.stringify(accountsData, null, 2)}</pre>`

      // For each account, list locations
      if (accountsData.accounts) {
        for (const account of accountsData.accounts) {
          const accountName = account.name // format: accounts/123456
          const locationsRes = await fetch(
            `https://mybusinessbusinessinformation.googleapis.com/v1/${accountName}/locations?readMask=name,title,storefrontAddress`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )
          const locationsData = await locationsRes.json()
          html += `<h2>Locations for ${account.accountName || accountName}</h2>`
          html += `<pre>${JSON.stringify(locationsData, null, 2)}</pre>`
        }
      }

      html += '<h2>Next Steps</h2>'
      html += '<p>Set these Supabase secrets:</p>'
      html += '<pre>supabase secrets set GOOGLE_BUSINESS_ACCOUNT_ID=accounts/YOUR_ACCOUNT_ID\nsupabase secrets set GOOGLE_BUSINESS_LOCATION_ID=locations/YOUR_LOCATION_ID</pre>'

      return new Response(html, { headers: { 'Content-Type': 'text/html' } })
    } catch (err) {
      return new Response(
        `<h1>Discovery Error</h1><pre>${err}</pre>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      )
    }
  }

  // Step 3: Exchange authorization code for tokens
  if (code) {
    try {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      })

      const tokenData = await tokenRes.json()

      if (tokenData.error) {
        return new Response(
          `<h1>Token Exchange Error</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`,
          { status: 400, headers: { 'Content-Type': 'text/html' } }
        )
      }

      const html = `
        <h1>OAuth Success!</h1>
        <h2>Your Refresh Token</h2>
        <p>Copy this and set it as a Supabase secret:</p>
        <pre style="background:#f0f0f0;padding:16px;word-break:break-all;">supabase secrets set GOOGLE_REFRESH_TOKEN=${tokenData.refresh_token}</pre>
        <h2>Access Token (temporary, for testing)</h2>
        <pre style="background:#f0f0f0;padding:16px;word-break:break-all;">${tokenData.access_token}</pre>
        <p>Expires in: ${tokenData.expires_in} seconds</p>
        <h2>Next Steps</h2>
        <ol>
          <li>Run the command above to store the refresh token</li>
          <li>Visit <a href="${redirectUri}?discover=true">this URL with ?discover=true</a> to find your account/location IDs</li>
          <li>Store those IDs as secrets too</li>
          <li>Deploy the updated google-reviews function</li>
          <li>Delete this auth function — you won't need it again</li>
        </ol>
      `
      return new Response(html, { headers: { 'Content-Type': 'text/html' } })
    } catch (err) {
      return new Response(
        `<h1>Error</h1><pre>${err}</pre>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      )
    }
  }

  // Step 1: Redirect to Google OAuth consent
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', SCOPES)
  authUrl.searchParams.set('access_type', 'offline')
  authUrl.searchParams.set('prompt', 'consent')

  return Response.redirect(authUrl.toString(), 302)
})
