import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppShell from './AppShell';

// The route is prerendered to static HTML (great for crawlers + first paint);
// on load React mounts over it with createRoot. This "prerender + client
// render" model sidesteps React 19's resource-hoisting hydration mismatches
// while still shipping full HTML to search engines and AI crawlers.
const container = document.getElementById('root');
container.replaceChildren();
createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  </StrictMode>,
);
