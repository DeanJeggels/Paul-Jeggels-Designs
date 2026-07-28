/**
 * Ping IndexNow so Bing (and Yandex, Seznam, Naver) re-crawl on demand rather
 * than waiting for their own schedule. Google does NOT participate in IndexNow,
 * so it changes nothing there.
 *
 * Run: npm run indexnow            (submits every URL in public/sitemap.xml)
 *      npm run indexnow -- /stock/ (submits only the paths you name)
 *
 * Ownership is proven by KEY being served as plain text at
 * https://pauljeggelsdesigns.co.za/<KEY>.txt — that file must stay in public/.
 * The key is public by design; it is not a secret.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KEY = '841306d37af86f012545d9b9c6f1f526';
const HOST = 'pauljeggelsdesigns.co.za';
const ORIGIN = `https://${HOST}`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function urlsFromSitemap() {
  const xml = readFileSync(join(root, 'public/sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((a) => (a.startsWith('http') ? a : `${ORIGIN}${a.startsWith('/') ? a : `/${a}`}`))
  : urlsFromSitemap();

if (!urlList.length) {
  console.error('No URLs to submit.');
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${ORIGIN}/${KEY}.txt`,
    urlList,
  }),
});

// 200 accepted, 202 accepted but key still being validated. Anything else is a
// real failure worth surfacing (403 = key file not reachable, 422 = URL/host
// mismatch, 429 = rate limited).
const body = await res.text();
console.log(`IndexNow ${res.status} ${res.statusText}`);
urlList.forEach((u) => console.log(`  ${u}`));
if (body.trim()) console.log(body.trim());

if (res.status !== 200 && res.status !== 202) {
  console.error('\nSubmission rejected.');
  process.exit(1);
}
console.log(`\n${urlList.length} URL(s) submitted.`);
