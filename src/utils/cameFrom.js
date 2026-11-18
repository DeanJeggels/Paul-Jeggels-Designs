// Where a visitor came from, saved with their enquiry so Paul can see which leads the Google ads and The Surf Journey's
// link bring in (Dean, 18 Nov 2026: "I would like to know which clients came through ads").
//
// Read once, when the visitor arrives. The ads' links carry utm_source=google_ads and the search keyword in utm_term (the
// campaign's final URL suffix), and Google adds gclid to every ad click. The Surf Journey links here with
// utm_source=thesurfjourney. What is found is kept in sessionStorage for this tab only, so a visitor who lands from an ad
// and enquires three pages later still counts. No cookie, and nothing leaves the browser until they send a form.

const KEY = 'pjd_came_from';

// The same shape the submit-lead function accepts (supabase/functions/submit-lead/adKeyword.ts).
const KEYWORD = /^[a-z0-9][a-z0-9 &'+.-]{0,79}$/;

/** A plain search keyword, or null. Google does not say whether phrase quotes or exact brackets come through, so both go. */
export function keywordFrom(raw) {
  if (typeof raw !== 'string' || raw.length > 100) return null;
  const k = raw.toLowerCase().replace(/\s+/g, ' ').trim().replace(/^["[]+|["\]]+$/g, '').trim();
  return KEYWORD.test(k) ? k : null;
}

/** Called once on page load. Private browsing can throw on storage: an enquiry must never fail over where it came from. */
export function noteArrival(search = window.location.search) {
  try {
    const q = new URLSearchParams(search);
    const utm = (q.get('utm_source') || '').toLowerCase();
    let found = null;
    if (utm === 'google_ads' || q.has('gclid')) found = { via: 'ad', keyword: keywordFrom(q.get('utm_term')) };
    else if (utm === 'thesurfjourney') found = { via: 'surfjourney' };
    if (found) sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    // Nothing to record.
  }
}

function cameFrom() {
  try {
    const c = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    return c && (c.via === 'ad' || c.via === 'surfjourney') ? c : null;
  } catch {
    return null;
  }
}

/** The form's own source name, with where the visitor came from added: website_inline_ad, website_quiz_surfjourney. */
export function leadSource(base) {
  const c = cameFrom();
  return c ? `${base}_${c.via}` : base;
}

/** The search keyword that showed the ad, or undefined, which JSON.stringify leaves out of the request. */
export function adKeyword() {
  const c = cameFrom();
  return c && c.via === 'ad' && keywordFrom(c.keyword) ? c.keyword : undefined;
}
