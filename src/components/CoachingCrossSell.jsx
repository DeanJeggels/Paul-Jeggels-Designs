import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// The coaching cross-sell (Dean, 18 Nov 2026: "got a board now you need intermediate or advanced lessons section in pjd").
// Daniel coaches through The Surf Journey (thesurfjourney.co.za) for intermediate and advanced surfers, 18 and over, so the
// copy says so and promises nothing to beginners. Every claim here is one The Surf Journey's own site makes; the ISA level
// number is left out on purpose, as it is there. The link carries utm_source=pjd (docs/UTM-LINKS.md in that repo), so an
// enquiry from here reaches Daniel's WhatsApp ending "(via Paul Jeggels Designs)".
const SURF_JOURNEY_URL = 'https://thesurfjourney.co.za/?utm_source=pjd&utm_medium=referral&utm_campaign=partner';

const CoachingCrossSell = () => (
  <section className="bg-pjd-dark py-24 border-t border-white/10">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="lg:order-2">
        <img
          src="/images/daniel_jeggels_2.jpg"
          alt="Daniel Jeggels on the beach in Jeffreys Bay, carrying his Paul Jeggels Designs surfboard"
          width="1200"
          height="1600"
          className="w-full aspect-[4/5] object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="lg:order-1">
        <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-5 font-body">Coaching in J-Bay</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 font-display">
          Got the Board.<br />
          <span className="text-pjd-teal">Now Get the Coaching.</span>
        </h2>
        <p className="text-white/60 leading-relaxed mb-4 font-body">
          Daniel Jeggels works alongside Paul in the workshop, and he coaches surfers in Jeffreys Bay through The Surf
          Journey. He is an ISA accredited surf coach with 16 years of coaching.
        </p>
        <p className="text-white/60 leading-relaxed mb-10 font-body">
          Private or small-group sessions of up to three surfers, video analysis of your surfing, and 3 to 10 day
          packages, with a board and wetsuit included. For intermediate and advanced surfers, 18 and over.
        </p>
        <a
          href={SURF_JOURNEY_URL}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 bg-pjd-teal text-pjd-dark font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors group cursor-pointer font-body"
        >
          See The Surf Journey
          <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" aria-hidden="true" />
        </a>
      </div>
    </div>
  </section>
);

export default CoachingCrossSell;
