import React from 'react';
import { MessageCircle, Phone, Hammer, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Tell Us About Your Surfing',
    description: 'Take our 60-second quiz or ask a question. No technical knowledge needed.',
  },
  {
    icon: Phone,
    number: '02',
    title: 'Paul Calls You',
    description: "He'll chat about your surfing, your local waves, and what you want from your board.",
  },
  {
    icon: Hammer,
    number: '03',
    title: 'Your Board Is Hand-Shaped',
    description: "Paul shapes your board by hand in his J-Bay workshop. Usually 1–3 weeks.",
  },
  {
    icon: Truck,
    number: '04',
    title: 'Pick Up or Delivery',
    description: 'Collect from the workshop in Jeffreys Bay or get it delivered to your door.',
  },
];

const HowItWorks = () => (
  <section className="bg-pjd-blue py-20 border-y border-white/10">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center font-body">
        How It Works
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16 font-display">
        From First Chat to First Session
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map(({ icon: Icon, number, title, description }) => (
          <div key={number} className="relative text-center group">
            <div className="w-14 h-14 bg-pjd-gold/10 border border-pjd-gold/30 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-pjd-gold/20 transition-colors">
              <Icon className="w-6 h-6 text-pjd-gold" />
            </div>
            <span className="text-pjd-gold/40 text-xs font-bold tracking-widest uppercase font-body">{number}</span>
            <h3 className="text-white font-bold text-lg mt-2 mb-3 font-display">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed font-body">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
