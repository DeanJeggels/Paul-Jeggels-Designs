import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-pjd-dark border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src="/images/pjd_logo.jpeg" alt="PJD Logo" className="w-10 h-10 rounded-full border border-white/20 object-contain bg-white" />
            <div>
              <p className="text-white font-black text-sm tracking-widest uppercase leading-none">Paul Jeggels</p>
              <p className="text-pjd-teal text-xs tracking-widest uppercase leading-none">Designs</p>
            </div>
          </div>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            Custom surfboards hand-shaped in Jeffreys Bay, South Africa. Every board shaped by Paul himself — built for the surfer, not the shelf.
          </p>
        </div>

        {/* Links */}
        <div>
          <p className="text-pjd-teal text-xs font-bold tracking-widest uppercase mb-5">Navigate</p>
          <div className="flex flex-col gap-3">
            {[
              ['Gallery', '/gallery'],
              ['Stock Boards', '/stock'],
              ['Services', '/services'],
              ['About', '/about'],
              ['Get a Quote', '/contact'],
            ].map(([label, href]) => (
              <Link key={href} to={href} className="text-white/60 hover:text-white text-sm transition-colors">
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-pjd-teal text-xs font-bold tracking-widest uppercase mb-5">Contact</p>
          <div className="flex flex-col gap-4">
            <a href="tel:+27829609353" className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors group">
              <Phone className="w-4 h-4 text-pjd-teal" />
              +27 82 960 9353
            </a>
            <a
              href="https://www.instagram.com/pauljeggelsdesigns"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/60 hover:text-white text-sm transition-colors"
            >
              <Instagram className="w-4 h-4 text-pjd-teal" />
              @pauljeggelsdesigns
            </a>
            <div className="flex items-start gap-3 text-white/60 text-sm">
              <MapPin className="w-4 h-4 text-pjd-teal mt-0.5 shrink-0" />
              <span>15 Dageraad Street<br />Jeffreys Bay 6330</span>
            </div>
          </div>
        </div>

      </div>

      <div className="border-t border-white/5 px-6 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-white/30 text-xs">© {new Date().getFullYear()} Paul Jeggels Designs. All rights reserved.</p>
        <p className="text-white/20 text-xs">
          Built by <a href="https://ch-ise.co.za" target="_blank" rel="noopener noreferrer" className="hover:text-white/40 transition-colors">CH-ISE</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
