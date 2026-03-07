import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Paul shaped a board perfectly suited to my surfing. I've never had anything that paddles this well in J-Bay conditions.",
    name: 'Customer Name',
    location: 'Jeffreys Bay',
    image: '/images/paul_jeggels_customer_1.jpg',
  },
  {
    quote: "I had no idea what I needed. Paul asked me a few questions, and two weeks later I had the best board I've ever owned.",
    name: 'Customer Name',
    location: 'Cape Town',
    image: '/images/paul_jeggels_customer_2.jpg',
  },
  {
    quote: "Third board from Paul now. Each one better than the last. He remembers exactly what I ride and keeps improving on it.",
    name: 'Customer Name',
    location: 'Port Elizabeth',
    image: '/images/paul_jeggels_customer_3.jpg',
  },
];

const Testimonials = () => (
  <section className="bg-pjd-gold py-20">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-pjd-blue/60 text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center font-body">
        What Surfers Say
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-pjd-blue text-center mb-14 font-display">
        4,000+ Boards. Here's What They Think.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map(({ quote, name, location, image }, i) => (
          <div
            key={i}
            className="bg-white/20 backdrop-blur-sm border border-white/30 p-8 flex flex-col"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-pjd-blue text-pjd-blue" />
              ))}
            </div>
            <p className="text-pjd-blue/80 leading-relaxed flex-1 italic mb-6 font-body">"{quote}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-pjd-blue/10">
              <img
                src={image}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
                loading="lazy"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <p className="text-pjd-blue font-bold text-sm font-body">{name}</p>
                <p className="text-pjd-blue/50 text-xs font-body">{location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
