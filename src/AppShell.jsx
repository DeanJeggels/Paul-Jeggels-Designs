import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Services from './pages/Services';
import Stock from './pages/Stock';
import Contact from './pages/Contact';
import { metaFor } from './seo-config';

// Scroll to top + keep the document title correct on client-side navigation
// (prerender sets the initial <title>; this handles SPA route changes).
const RouteEffects = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = metaFor(pathname).title;
  }, [pathname]);
  return null;
};

// Pages that don't show the Navbar (Hero has its own logo)
const HIDE_NAV_ON = ['/'];

// The app tree WITHOUT a Router or HelmetProvider, so it can be wrapped by
// BrowserRouter on the client and StaticRouter during prerender.
const AppShell = () => {
  const { pathname } = useLocation();
  const showNav = !HIDE_NAV_ON.includes(pathname);

  return (
    <div className="min-h-screen w-full bg-pjd-dark">
      <RouteEffects />
      {showNav && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default AppShell;
