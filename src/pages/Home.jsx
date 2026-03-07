import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Image, Tag, User, Wrench, ChevronDown } from 'lucide-react';
import NavCard from '../components/NavCard';
import CustomBuilder from '../components/CustomBuilder';

// ─── HERO ────────────────────────────────────────────────────────────────────

const Hero = () => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <section className="relative w-full h-screen bg-pjd-blue overflow-hidden">
      {isBuilderOpen && <CustomBuilder onClose={() => setIsBuilderOpen(false)} />}

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/paul_jeggels_shaping_5.jpg"
          alt="Paul Jeggels shaping a surfboard"
          className="w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pjd-blue via-pjd-blue/50 to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between max-w-7xl mx-auto px-6 py-6 md:py-10">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/images/pjd_logo.jpeg"
            alt="PJD Logo"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 shadow-lg object-contain bg-white"
          />
          <div className="hidden sm:block">
            <p className="text-white font-black text-sm tracking-widest uppercase leading-none">Paul Jeggels</p>
            <p className="text-pjd-gold text-xs tracking-widest uppercase leading-none">Designs</p>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-8 lg:mb-6">

          {/* Headline */}
          <div className="max-w-4xl">
            <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">
              Hand-Shaped in Jeffreys Bay
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-5 tracking-tight leading-[0.95] drop-shadow-lg">
              The Board That<br />
              Actually Fits You.
            </h1>
            <p className="text-lg md:text-xl text-white/75 font-light max-w-xl leading-relaxed">
              Built for your exact height, weight, and the waves you actually surf — not the ones you wish for.
            </p>
          </div>

          {/* Action deck */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">

            {/* Primary CTA block */}
            <div className="col-span-1 lg:col-span-7 bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 rounded-sm shadow-2xl">
              <h2 className="text-pjd-gold text-xs font-bold tracking-[0.2em] uppercase mb-5">Start Your Journey</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setIsBuilderOpen(true)}
                  className="bg-pjd-gold text-pjd-blue font-black px-6 py-5 rounded-sm hover:bg-white transition-colors flex flex-col items-start gap-1 group shadow-lg"
                >
                  <span className="flex items-center gap-2 text-sm tracking-widest uppercase">
                    Custom Builder <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="text-xs font-normal opacity-70">I know my dimensions</span>
                </button>
                <Link
                  to="/contact"
                  className="bg-white/15 text-white border border-white/25 font-black px-6 py-5 rounded-sm hover:bg-white/25 transition-colors flex flex-col items-start gap-1 group shadow-lg"
                >
                  <span className="flex items-center gap-2 text-sm tracking-widest uppercase">
                    Help Me Choose <User className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-normal opacity-70">Talk to the shaper</span>
                </Link>
              </div>
            </div>

            {/* Nav cards */}
            <div className="col-span-1 lg:col-span-5 grid grid-cols-2 gap-3">
              <NavCard title="Gallery" subtitle="See the work" icon={Image} href="/gallery" />
              <NavCard title="Stock" subtitle="Ready to surf" icon={Tag} href="/stock" />
              <NavCard title="About" subtitle="The shaper" icon={User} href="/about" />
              <NavCard title="Repairs" subtitle="Ding service" icon={Wrench} href="/contact" />
            </div>

          </div>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/40" />
      </div>
    </section>
  );
};

// ─── SERVICES STRIP ──────────────────────────────────────────────────────────

const ServicesStrip = () => (
  <section className="bg-pjd-gold py-5">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-6">
      {[
        'Custom Surfboards',
        'Ding Repair',
        'Fin Manufacturing',
        'Second-Hand Boards',
      ].map((s) => (
        <span key={s} className="text-pjd-blue font-black text-xs tracking-widest uppercase">{s}</span>
      ))}
    </div>
  </section>
);

// ─── PROOF STRIP ─────────────────────────────────────────────────────────────

const ProofStrip = () => (
  <section className="bg-pjd-blue/80 py-16 border-y border-white/10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
      {[
        { number: '40+', label: 'Years Shaping' },
        { number: '4,000+', label: 'Boards Shaped' },
        { number: '1', label: 'Shaper — Paul' },
        { number: 'J-Bay', label: 'Jeffreys Bay, SA' },
      ].map(({ number, label }) => (
        <div key={label}>
          <p className="text-pjd-gold text-4xl md:text-5xl font-black leading-none mb-2">{number}</p>
          <p className="text-white/50 text-xs tracking-widest uppercase">{label}</p>
        </div>
      ))}
    </div>
  </section>
);

// ─── GALLERY TEASER ───────────────────────────────────────────────────────────

const GalleryTeaser = () => {
  const images = [
    '/images/paul_jeggels_design_1.jpg',
    '/images/paul_jeggels_design_4.jpg',
    '/images/paul_jeggels_design_7.jpg',
    '/images/paul_jeggels_design_10.jpg',
    '/images/paul_jeggels_design_13.jpg',
    '/images/paul_jeggels_design_16.jpg',
  ];

  return (
    <section className="bg-pjd-blue py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3">The Work</p>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Every Shape Has<br />a Story.
            </h2>
          </div>
          <Link
            to="/gallery"
            className="flex items-center gap-2 text-pjd-gold text-sm font-bold tracking-widest uppercase hover:text-white transition-colors group"
          >
            View Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden group">
              <img
                src={src}
                alt={`PJD surfboard design ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── ABOUT TEASER ─────────────────────────────────────────────────────────────

const AboutTeaser = () => (
  <section className="bg-black py-24">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

      <div className="relative">
        <img
          src="/images/paul_jeggels_shaping_3.jpg"
          alt="Paul Jeggels in the shaping bay"
          className="w-full aspect-[4/5] object-cover"
        />
        <div className="absolute -bottom-4 -right-4 bg-pjd-gold px-6 py-4">
          <p className="text-pjd-blue font-black text-xs tracking-widest uppercase leading-none">As featured in</p>
          <p className="text-pjd-blue font-black text-xl tracking-tight">Zigzag Magazine</p>
        </div>
      </div>

      <div>
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-5">The Shaper</p>
        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
          Most Boards Are Built<br />
          for Everyone.<br />
          <span className="text-pjd-gold">Paul's Aren't.</span>
        </h2>
        <p className="text-white/60 leading-relaxed mb-4">
          For over 40 years, Paul Jeggels has been shaping surfboards from his workshop in Jeffreys Bay — one of the world's premier surf destinations. He knows every break in town and shapes every board himself.
        </p>
        <p className="text-white/60 leading-relaxed mb-10">
          No conveyor belt. No factory template. Just a craftsman who surfs what he makes, and makes it for the surfer standing in front of him.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors group"
        >
          Meet Paul <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

    </div>
  </section>
);

// ─── CTA BANNER ───────────────────────────────────────────────────────────────

const CTABanner = () => (
  <section
    className="relative py-28 bg-pjd-blue overflow-hidden"
    style={{ backgroundImage: "url('/images/paul_jeggels_surfing.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
  >
    <div className="absolute inset-0 bg-pjd-blue/80" />
    <div className="relative max-w-7xl mx-auto px-6 text-center">
      <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">Ready to order?</p>
      <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
        Your Best Session Starts<br />with the Right Board.
      </h2>
      <p className="text-white/60 max-w-xl mx-auto mb-10 leading-relaxed">
        Get in touch and tell Paul what you're after. He'll get back to you within 24 hours.
      </p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-3 bg-pjd-gold text-pjd-blue font-black px-10 py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors group shadow-2xl"
      >
        Get Your Free Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  </section>
);

// ─── PAGE EXPORT ──────────────────────────────────────────────────────────────

const Home = () => (
  <>
    <Hero />
    <ServicesStrip />
    <ProofStrip />
    <GalleryTeaser />
    <AboutTeaser />
    <CTABanner />
  </>
);

export default Home;
