import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Gallery', href: '/gallery' },
  { label: 'Stock', href: '/stock' },
  { label: 'Services', href: '/services' },
  { label: 'About', href: '/about' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-pjd-dark/95 backdrop-blur-md shadow-xl border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/images/pjd_logo.jpeg"
            alt="PJD Logo"
            className="w-10 h-10 rounded-full border border-white/20 object-contain bg-white group-hover:border-pjd-teal transition-colors"
          />
          <div className="hidden sm:block">
            <p className="text-white font-black text-sm tracking-widest uppercase leading-none">Paul Jeggels</p>
            <p className="text-pjd-teal text-xs tracking-widest uppercase leading-none">Designs</p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-bold tracking-widest uppercase transition-colors ${location.pathname === link.href ? 'text-pjd-teal' : 'text-white/70 hover:text-white'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="bg-pjd-teal text-pjd-cream font-black text-sm tracking-widest uppercase px-6 py-3 hover:bg-pjd-cream transition-colors"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white p-2 cursor-pointer"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-pjd-dark border-t border-white/10 px-6 py-6 flex flex-col gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-bold tracking-widest uppercase ${location.pathname === link.href ? 'text-pjd-teal' : 'text-white'}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="bg-pjd-teal text-pjd-cream font-black text-sm tracking-widest uppercase px-6 py-4 text-center"
          >
            Get a Quote
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
