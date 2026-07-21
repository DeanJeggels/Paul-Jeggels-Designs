import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

// Route-level code splitting — only Home ships in the initial bundle
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Stock = lazy(() => import('./pages/Stock'));
const Contact = lazy(() => import('./pages/Contact'));

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Pages that don't show the Navbar (Hero has its own logo)
const HIDE_NAV_ON = ['/'];

const Layout = () => {
  const { pathname } = useLocation();
  const showNav = !HIDE_NAV_ON.includes(pathname);

  return (
    <div className="min-h-screen w-full bg-pjd-dark">
      <ScrollToTop />
      {showNav && <Navbar />}
      <main>
        <Suspense fallback={<div className="min-h-screen bg-pjd-dark" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/stock" element={<Stock />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
