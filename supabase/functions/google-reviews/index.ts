/**
 * Fetches all Google reviews via the Business Profile API.
 *
 * Required Supabase secrets:
 *   GOOGLE_OAUTH_CLIENT_ID
 *   GOOGLE_OAUTH_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN
 *   GOOGLE_BUSINESS_ACCOUNT_ID   (e.g. "accounts/123456789")
 *   GOOGLE_BUSINESS_LOCATION_ID  (e.g. "locations/987654321")
 *
 * Falls back to Google Places API if Business Profile secrets are not set.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ReviewResponse {
  reviews: { author: string; rating: number; text: string; time: string; photo: string }[]
  rating: number | null
  totalReviews: number
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string | null> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  return data.access_token || null
}

async function fetchBusinessProfileReviews(
  accessToken: string,
  accountId: string,
  locationId: string
): Promise<ReviewResponse> {
  const allReviews: ReviewResponse['reviews'] = []
  let pageToken: string | undefined
  let totalRating = 0

  do {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/reviews`
    )
    if (pageToken) {
      url.searchParams.set('pageToken', pageToken)
    }
    url.searchParams.set('pageSize', '50')

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Business Profile API error:', res.status, errText)
      break
    }

    const data = await res.json()

    if (data.reviews) {
      for (const r of data.reviews) {
        const rating = ratingToNumber(r.starRating)
        allReviews.push({
          author: r.reviewer?.displayName || 'Anonymous',
          rating,
          text: r.comment || '',
          time: r.createTime ? formatRelativeTime(r.createTime) : '',
          photo: r.reviewer?.profilePhotoUrl || '',
        })
        totalRating += rating
      }
    }

    pageToken = data.nextPageToken
  } while (pageToken)

  const avgRating = allReviews.length > 0
    ? Math.round((totalRating / allReviews.length) * 10) / 10
    : null

  return {
    reviews: allReviews,
    rating: avgRating,
    totalReviews: allReviews.length,
  }
}

function ratingToNumber(starRating: string): number {
  const map: Record<string, number> = {
    ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
  }
  return map[starRating] || 0
}

function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays < 1) return 'today'
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} ago`
  }
  const years = Math.floor(diffDays / 365)
  return `${years} year${years > 1 ? 's' : ''} ago`
}

// Fallback: Google Places API (limited to 5 reviews)
async function fetchPlacesReviews(): Promise<ReviewResponse> {
  const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY')
  const placeId = Deno.env.get('GOOGLE_PLACE_ID')

  if (!apiKey || !placeId) {
    return { reviews: [], rating: null, totalReviews: 0 }
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`
  const response = await fetch(url)
  const data = await response.json()

  if (data.status !== 'OK' || !data.result?.reviews) {
    return { reviews: [], rating: null, totalReviews: 0 }
  }

  const reviews = data.result.reviews.map((r: {
    author_name: string
    rating: number
    text: string
    relative_time_description: string
    profile_photo_url: string
  }) => ({
    author: r.author_name,
    rating: r.rating,
    text: r.text,
    time: r.relative_time_description,
    photo: r.profile_photo_url,
  }))

  return {
    reviews,
    rating: data.result.rating,
    totalReviews: data.result.user_ratings_total,
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const clientId = Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')
    const clientSecret = Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')
    const refreshToken = Deno.env.get('GOOGLE_REFRESH_TOKEN')
    const accountId = Deno.env.get('GOOGLE_BUSINESS_ACCOUNT_ID')
    const locationId = Deno.env.get('GOOGLE_BUSINESS_LOCATION_ID')

    let result: ReviewResponse

    if (clientId && clientSecret && refreshToken && accountId && locationId) {
      // Use Business Profile API (all reviews)
      const accessToken = await getAccessToken(clientId, clientSecret, refreshToken)
      if (!accessToken) {
        console.error('Failed to get access token, falling back to Places API')
        result = await fetchPlacesReviews()
      } else {
        result = await fetchBusinessProfileReviews(accessToken, accountId, locationId)
      }
    } else {
      // Fallback to Places API (max 5 reviews)
      result = await fetchPlacesReviews()
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' } }
    )
  } catch (err) {
    console.error('Google Reviews error:', err)
    return new Response(
      JSON.stringify({ reviews: [], error: 'Failed to fetch reviews' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
