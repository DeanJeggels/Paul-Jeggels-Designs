import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import AppShell from './AppShell';

// Re-exported so the prerender script can pull route list + head builder from
// the single SSR bundle.
export { ROUTES, buildHead } from './seo-config';

// Renders one route to a static HTML string (hydration-marker markup). No
// metadata is rendered through React — <head> tags are injected by the
// prerender script from seo-config — so server and client markup match.
export function render(url) {
  return renderToString(
    <StaticRouter location={url}>
      <AppShell />
    </StaticRouter>,
  );
}
