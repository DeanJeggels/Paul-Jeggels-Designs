// The Google ad keyword sent with a lead (src/utils/cameFrom.js reads it from the ad's link). Anything that is not a plain
// keyword is dropped, never refused: a lead must never fail over where it came from. At most 80 characters: Google allows
// 10 words in a keyword and names no character limit. The pjd_leads column holds the same limit
// (supabase/migrations/003_pjd_leads_ad_keyword.sql).
export const AD_KEYWORD = /^[a-z0-9][a-z0-9 &'+.-]{0,79}$/

export function adKeyword(kw: unknown): string | null {
  // Longer than the browser ever sends: dropped before a pattern runs over it.
  if (typeof kw !== 'string' || kw.length > 100) return null
  // Google does not say whether a phrase keyword's quotes or an exact keyword's brackets come through, so either is taken off.
  const k = kw.toLowerCase().replace(/\s+/g, ' ').trim().replace(/^["[]+|["\]]+$/g, '').trim()
  return AD_KEYWORD.test(k) ? k : null
}
