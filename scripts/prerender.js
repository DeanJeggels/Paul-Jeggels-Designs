// Static prerender: renders each route to real HTML at build time so search
// engines and AI crawlers get full content (and no 404s) without executing JS.
// Runs after `vite build` (client) and `vite build --ssr` (server bundle).
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const distDir = path.join(root, 'dist');

const { render, ROUTES, buildHead } = await import(url.pathToFileURL(path.join(root, 'dist-ssr/entry-server.js')).href);

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// AppShell's root element. React emits hoistable <link> image-preloads before
// it; those aren't part of the hydrated child tree, so they must be stripped
// from #root (they'd be extra DOM nodes → hydration mismatch). The canonical
// <head> is injected from seo-config instead.
const APP_MARKER = '<div class="min-h-screen';

for (const route of Object.keys(ROUTES)) {
  const html = render(route);
  const idx = html.indexOf(APP_MARKER);
  if (idx === -1) throw new Error(`prerender: app marker not found for route ${route}`);
  const body = html.slice(idx);

  const page = template
    .replace('</head>', `    ${buildHead(route)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);

  const outPath = route === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, route.replace(/^\//, ''), 'index.html');

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, page);
  console.log(`prerendered ${route.padEnd(10)} -> ${path.relative(root, outPath).padEnd(24)} (${(page.length / 1024).toFixed(1)}kb)`);
}

console.log(`\n✓ prerendered ${Object.keys(ROUTES).length} routes`);
