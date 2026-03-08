import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import CustomBuilder from '../components/CustomBuilder';
import BoardQuiz from '../components/BoardQuiz';
import ChatAssistant from '../components/ChatAssistant';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import InlineContactForm from '../components/InlineContactForm';

// ─── HERO ────────────────────────────────────────────────────────────────────

const Hero = ({ onOpenQuiz, onOpenBuilder }) => (
    <section className="relative w-full min-h-screen bg-pjd-dark overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/paul_jeggels_shaping_5.jpg"
          alt="Paul Jeggels shaping a surfboard"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pjd-dark via-pjd-dark/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-16">
          <img
            src="/images/pjd_logo.jpeg"
            alt="PJD Logo"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 shadow-lg object-contain bg-white"
          />
          <div className="hidden sm:block">
            <p className="text-white font-bold text-sm tracking-widest uppercase leading-none font-body">Paul Jeggels</p>
            <p className="text-pjd-teal text-xs tracking-widest uppercase leading-none font-body">Designs</p>
          </div>
        </div>

        {/* Headline */}
        <div className="max-w-3xl mb-10">
          <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-5 font-body">
            Hand-Shaped in Jeffreys Bay
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.95] font-display">
            The Board That<br />
            Actually Fits You.
          </h1>
          <p className="text-lg md:text-xl text-white/65 font-light max-w-xl leading-relaxed font-body">
            Tell us about your surfing. Paul will design your perfect board.
          </p>
        </div>

        {/* AI Chat input */}
        <div className="mb-6">
          <ChatAssistant onOpenQuiz={onOpenQuiz} />
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-3 bg-pjd-teal text-pjd-cream font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors group shadow-xl cursor-pointer rounded-lg font-body"
          >
            Find My Board <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onOpenBuilder}
            className="text-white/50 text-sm font-bold tracking-widest uppercase hover:text-white transition-colors cursor-pointer font-body py-4"
          >
            I already know my specs →
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/30" />
      </div>
    </section>
  );

// ─── GALLERY TEASER ───────────────────────────────────────────────────────────

const GalleryTeaser = ({ onOpenQuiz }) => {
  const images = [
    '/images/paul_jeggels_design_1.jpg',
    '/images/paul_jeggels_design_4.jpg',
    '/images/paul_jeggels_design_7.jpg',
    '/images/paul_jeggels_design_10.jpg',
    '/images/paul_jeggels_design_13.jpg',
    '/images/paul_jeggels_design_16.jpg',
  ];

  return (
    <section className="bg-pjd-cream py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-3 font-body">The Work</p>
            <h2 className="text-4xl md:text-5xl font-bold text-pjd-dark leading-tight font-display">
              Every Shape Has<br />a Story.
            </h2>
          </div>
          <Link
            to="/gallery"
            className="flex items-center gap-2 text-pjd-teal text-sm font-bold tracking-widest uppercase hover:text-pjd-dark transition-colors group font-body"
          >
            View Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden group cursor-pointer">
              <img
                src={src}
                alt={`PJD surfboard design ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={onOpenQuiz}
            className="inline-flex items-center gap-2 text-pjd-teal text-sm font-bold tracking-widest uppercase hover:text-pjd-dark transition-colors cursor-pointer font-body"
          >
            Want something like this? Take the quiz <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── ABOUT TEASER ─────────────────────────────────────────────────────────────

const AboutTeaser = () => (
  <section className="bg-pjd-dark py-24">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <img
          src="/images/paul_jeggels_shaping_3.jpg"
          alt="Paul Jeggels in the shaping bay"
          className="w-full aspect-[4/5] object-cover"
          loading="lazy"
        />
        <div className="absolute -bottom-4 -right-4 bg-pjd-teal px-6 py-4">
          <p className="text-pjd-dark font-bold text-xs tracking-widest uppercase leading-none font-body">As featured in</p>
          <p className="text-pjd-dark font-bold text-xl tracking-tight font-display">Zigzag Magazine</p>
        </div>
      </div>

      <div>
        <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-5 font-body">The Shaper</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 font-display">
          Most Boards Are Built<br />
          for Everyone.<br />
          <span className="text-pjd-teal">Paul's Aren't.</span>
        </h2>
        <p className="text-white/60 leading-relaxed mb-4 font-body">
          For over 40 years, Paul Jeggels has been shaping surfboards from his workshop in Jeffreys Bay — one of the world's premier surf destinations. He knows every break in town and shapes every board himself.
        </p>
        <p className="text-white/60 leading-relaxed mb-10 font-body">
          No conveyor belt. No factory template. Just a craftsman who surfs what he makes, and makes it for the surfer standing in front of him.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 bg-pjd-teal text-pjd-cream font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors group cursor-pointer font-body"
        >
          Meet Paul <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </section>
);

// ─── PAGE EXPORT ──────────────────────────────────────────────────────────────

const Home = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>Paul Jeggels Designs — Custom Hand-Shaped Surfboards, Jeffreys Bay</title>
        <meta name="description" content="Custom surfboards hand-shaped by Paul Jeggels in Jeffreys Bay, South Africa. 40+ years experience. Shortboards, fish, longboards & more." />
        <link rel="canonical" href="https://pauljeggelsdesigns.co.za/" />
      </Helmet>
      {isQuizOpen && <BoardQuiz onClose={() => setIsQuizOpen(false)} />}
      {isBuilderOpen && <CustomBuilder onClose={() => setIsBuilderOpen(false)} />}

      <Hero onOpenQuiz={() => setIsQuizOpen(true)} onOpenBuilder={() => setIsBuilderOpen(true)} />
      <HowItWorks />
      <Testimonials />
      <GalleryTeaser onOpenQuiz={() => setIsQuizOpen(true)} />
      <AboutTeaser />
      <FAQ />
      <InlineContactForm />
    </>
  );
};

export default Home;
