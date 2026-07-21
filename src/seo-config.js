// Central per-route SEO. Consumed by the prerender script (to inject <head>
// tags into the static HTML) and by AppShell (to keep document.title correct
// during client-side navigation). Metadata is NOT rendered through React, so
// server and client #root markup stay identical and hydration is clean.
import { FAQS } from './data/faqs';

export const SITE = 'https://pauljeggelsdesigns.co.za';
const ORG = `${SITE}/#organization`;
const abs = (p) => (p.startsWith('http') ? p : `${SITE}${p}`);
const DEFAULT_IMAGE = abs('/images/paul_jeggels_shaping_5.jpg');

// Netlify serves the prerendered index.html files at trailing-slash URLs
// (e.g. /about/) and 301s the non-slash form to them. Canonical, OG and the
// sitemap all use this same trailing-slash form so signals stay consistent.
export const canonicalUrl = (path) => `${SITE}${path === '/' ? '/' : `${path}/`}`;

const breadcrumb = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: canonicalUrl(t.path),
  })),
});

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
};

const website = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: SITE,
  name: 'Paul Jeggels Designs',
  publisher: { '@id': ORG },
  inLanguage: 'en-ZA',
};

const personPaul = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${SITE}/#paul`,
  name: 'Paul Jeggels',
  jobTitle: 'Master Surfboard Shaper',
  worksFor: { '@id': ORG },
  description:
    'Master surfboard shaper with over 40 years of experience and 4,000+ hand-shaped boards, based in Jeffreys Bay, South Africa. Featured in Zigzag Magazine.',
  knowsAbout: ['Surfboard shaping', 'Custom surfboards', 'Surfboard design', 'Ding repair', 'Surf fins'],
};

const surfboardService = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Custom Surfboard Shaping',
  serviceType: 'Custom surfboard shaping',
  provider: { '@id': ORG },
  areaServed: { '@type': 'Country', name: 'South Africa' },
  description:
    'Hand-shaped custom surfboards built to your height, weight, ability and local waves — shortboards, fish, hybrids, mid-lengths, longboards and fins.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'ZAR',
    priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'ZAR', minPrice: 5000, maxPrice: 15000 },
  },
};

// path -> { title, description, image?, jsonLd? }
export const ROUTES = {
  '/': {
    title: 'Custom Hand-Shaped Surfboards, Jeffreys Bay | Paul Jeggels Designs',
    description:
      'Custom surfboards hand-shaped in Jeffreys Bay by Paul Jeggels — 40+ years, 4,000+ boards. Shortboards, fish, longboards & fins built for your size and waves.',
    jsonLd: [website, surfboardService, faqPage],
  },
  '/about': {
    title: 'About Paul Jeggels — Master Surfboard Shaper, Jeffreys Bay',
    description:
      "Meet Paul Jeggels, Jeffreys Bay's master surfboard shaper — 40+ years and 4,000+ hand-shaped boards, featured in Zigzag Magazine. Every board shaped by hand.",
    jsonLd: [personPaul, breadcrumb([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])],
  },
  '/services': {
    title: 'Surfboard Services — Custom Boards, Ding Repair & Fins | Jeffreys Bay',
    description:
      'Custom surfboards from R5,000, ding repairs from R500 and custom fins — all hand-crafted in Jeffreys Bay by Paul Jeggels. Built for your surfing.',
    jsonLd: [surfboardService, breadcrumb([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])],
  },
  '/gallery': {
    title: 'Surfboard Gallery — Custom Shapes by Paul Jeggels, Jeffreys Bay',
    description:
      'Browse 40+ years of custom surfboards hand-shaped by Paul Jeggels in Jeffreys Bay — shortboards, fish, longboards, collaborations and stoked customers.',
    jsonLd: [breadcrumb([{ name: 'Home', path: '/' }, { name: 'Gallery', path: '/gallery' }])],
  },
  '/stock': {
    title: 'Surfboards for Sale — Stock & Pre-Shaped Boards | Jeffreys Bay',
    description:
      'Quality stock and pre-shaped surfboards by Paul Jeggels, ready to ride. Every board inspected and repaired. Based in Jeffreys Bay, delivery across South Africa.',
    jsonLd: [breadcrumb([{ name: 'Home', path: '/' }, { name: 'Stock', path: '/stock' }])],
  },
  '/contact': {
    title: 'Contact & Custom Board Quote — Paul Jeggels Designs, Jeffreys Bay',
    description:
      'Get a free quote for your custom surfboard from Paul Jeggels in Jeffreys Bay. Response within 24 hours. Call, email or visit the workshop.',
    jsonLd: [breadcrumb([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])],
  },
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const jsonScript = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;

export function metaFor(path) {
  return ROUTES[path] || ROUTES['/'];
}

// Full <head> HTML injected for a route at prerender time.
export function buildHead(path) {
  const m = metaFor(path);
  const url = canonicalUrl(path);
  const image = abs(m.image || DEFAULT_IMAGE);
  const tags = [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Paul Jeggels Designs" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${image}" />`,
    `<meta property="og:locale" content="en_ZA" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${image}" />`,
    ...(m.jsonLd || []).map(jsonScript),
  ];
  return tags.join('\n    ');
}
