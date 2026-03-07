import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote } from 'lucide-react';

const About = () => (
  <div className="min-h-screen bg-pjd-blue pt-24">
    <Helmet>
      <title>About Paul Jeggels — Master Surfboard Shaper, Jeffreys Bay</title>
      <meta name="description" content="Meet Paul Jeggels, Jeffreys Bay's master surfboard shaper with 40+ years and 4,000+ hand-shaped boards. Featured in Zigzag Magazine." />
      <link rel="canonical" href="https://pauljeggelsdesigns.co.za/about" />
    </Helmet>

    {/* Hero */}
    <div className="relative h-[60vh] overflow-hidden">
      <img
        src="/images/paul_jeggels_shaping_4.jpg"
        alt="Paul Jeggels in the shaping bay"
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-pjd-blue via-pjd-blue/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 pb-16">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3">The Shaper</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
          Paul Jeggels.
        </h1>
      </div>
    </div>

    {/* Main story */}
    <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

      <div>
        <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-8">
          Most Boards Are Built<br />
          for Everyone.<br />
          <span className="text-pjd-gold">Paul's Aren't.</span>
        </h2>

        <div className="space-y-5 text-white/65 leading-relaxed">
          <p>
            Paul Jeggels has been shaping surfboards out of Jeffreys Bay for over 40 years. Not on an assembly line. Not from a factory in China. Right here in J-Bay — one of the best surf towns in the world.
          </p>
          <p>
            He shapes every single board himself. That's not a marketing line — that's just how he works. He's ridden every break in the Country, which means when he asks you about your surfing, he already knows what your board needs.
          </p>
          <p>
            You don't get a generic shape with a logo slapped on it. You get something built for your height, your weight, your surfing level, and the specific waves you actually ride week in, week out.
          </p>
          <p>
            Over 40 years and 4,000+ boards later, his reputation is built the old-fashioned way: word of mouth, surfer to surfer.
          </p>
        </div>

        <div className="mt-10 p-6 border border-pjd-gold/30 bg-pjd-gold/5">
          <Quote className="w-6 h-6 text-pjd-gold mb-3" />
          <p className="text-white/80 italic leading-relaxed mb-3">
            "You wouldn't wear someone else's prescription glasses in the water. Why ride someone else's board?"
          </p>
          <p className="text-pjd-gold text-xs font-bold tracking-widest uppercase">— Paul Jeggels</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <img
          src="/images/paul_jeggels_5.jpg"
          alt="Paul Jeggels"
          className="w-full aspect-[3/4] object-cover"
        />
        <div className="grid grid-cols-2 gap-4">
          <img
            src="/images/paul_jeggels_shaping_2.jpg"
            alt="Shaping process"
            className="w-full aspect-square object-cover"
          />
          <img
            src="/images/paul_jeggels_shaping_1.jpg"
            alt="Workshop"
            className="w-full aspect-square object-cover"
          />
        </div>
      </div>

    </div>

    {/* Zigzag feature */}
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block bg-pjd-gold px-4 py-2 mb-6">
            <p className="text-pjd-blue font-black text-xs tracking-widest uppercase">As Featured In</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Zigzag Magazine.
          </h2>
          <p className="text-white/55 leading-relaxed mb-6">
            Paul's craftsmanship has been recognised by South Africa's leading surf publication, Zigzag Magazine. When the country's top surf media come looking for a master shaper in J-Bay, they know where to find him.
          </p>
          <p className="text-white/55 leading-relaxed">
            It's the kind of recognition that only comes one way: by consistently making boards that surfers love to ride.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <img src="/images/ZIGZAG01.jpg" alt="Zigzag Magazine feature" className="w-full aspect-[16/10] object-cover" />
          <img src="/images/Zigzag02jpg.jpg" alt="Zigzag Magazine feature" className="w-full aspect-[16/10] object-cover" />
        </div>
      </div>
    </div>

    {/* Old shots / Heritage */}
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-6">The Archives</p>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-10">Where It All Started.</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="aspect-square overflow-hidden">
              <img
                src={`/images/paul_jeggels_old_${n}.jpg`}
                alt={`Archive photo ${n}`}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* CTA */}
    <div className="py-20 text-center bg-pjd-blue border-t border-white/10">
      <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">Ready to order?</p>
      <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Get Your Board Shaped by Paul.</h2>
      <p className="text-white/50 max-w-md mx-auto mb-10">He'll ask the right questions. You'll get the right board.</p>
      <Link
        to="/contact"
        className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-black px-10 py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors group"
      >
        Get a Quote <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>

  </div>
);

export default About;
