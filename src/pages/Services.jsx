import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Sliders, Wrench, Fish, Tag } from 'lucide-react';

const SERVICES = [
  {
    icon: Sliders,
    title: 'Custom Surfboards',
    tagline: 'Your dimensions. Your wave. Your board.',
    price: 'From R5,000',
    description:
      "Every custom board starts with a conversation. Paul will ask about your height, weight, surfing level, and the specific breaks you ride. He takes that information and shapes a board that fits your surfing — not someone else's idea of it. From shortboard to longboard, fish to hybrid.",
    detail: [
      'Full custom consult with Paul',
      'Shaped to your exact dimensions',
      'Choose your glass job and fin setup',
      'Any design — airbrush or tint',
    ],
    image: '/images/paul_jeggels_shaping_5.jpg',
    cta: 'Order a Custom Board',
  },
  {
    icon: Wrench,
    title: 'Ding Repair',
    tagline: 'Back in the water, fast.',
    price: 'From R500',
    description:
      "Dings happen. What matters is getting your board sorted properly — not patched with a kit from a surf shop. Paul and Daniel handle repairs the right way, from minor pressure dents to full rail rebuilds. Your board gets the same care as a new shape.",
    detail: [
      'Minor dings and cracks',
      'Rail and nose repairs',
      'Full re-glass jobs',
      'Fin box repairs and replacements',
    ],
    image: '/images/paul_jeggels_glassing_1.jpg',
    cta: 'Book a Repair',
  },
  {
    icon: Fish,
    title: 'Fin Manufacturing',
    tagline: 'Fins built to match your board.',
    price: 'From R800',
    description:
      "Stock fins are made for every board. Paul's fins are made for yours. When your board was shaped with specific flex and foil in mind, it makes sense to match it with fins built the same way — by hand, in Jeffreys Bay.",
    detail: [
      'Custom fibreglass fins',
      'Matched to your board\'s rocker and flex',
      'FCS and Futures compatible',
      'Single, twin, thruster and quad setups',
    ],
    image: '/images/paul_jeggels_fin_1.jpg',
    cta: 'Enquire About Fins',
  },
  {
    icon: Tag,
    title: 'Second-Hand Boards',
    tagline: 'Quality shapes at a fraction of the price.',
    price: 'Prices vary',
    description:
      "Not every surfer needs a custom board on day one. Paul's second-hand stock gives you access to properly shaped boards — some ridden once, some lightly used — at prices that make sense. Every board in stock was shaped with the same care as a custom order.",
    detail: [
      'All boards Paul Jeggels shaped',
      'Inspected and repaired before listing',
      'Surfboard bags available',
      'Updated stock regularly',
    ],
    image: '/images/paul_jeggels_customs_1.jpg',
    cta: 'Browse Stock Boards',
    href: '/stock',
  },
];

const Services = () => (
  <div className="min-h-screen bg-pjd-blue pt-24">
    <Helmet>
      <title>Services — Custom Boards, Ding Repair & Fins | Paul Jeggels Designs</title>
      <meta name="description" content="Custom surfboards from R5,000, ding repairs from R500, custom fins from R800. Hand-shaped in Jeffreys Bay by Paul Jeggels." />
      <link rel="canonical" href="https://pauljeggelsdesigns.co.za/services" />
    </Helmet>

    {/* Header */}
    <div
      className="relative py-28 overflow-hidden"
      style={{ backgroundImage: "url('/images/paul_jeggels_banner_5.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-pjd-blue/80" />
      <div className="relative max-w-7xl mx-auto px-6">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">What We Offer</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight max-w-3xl">
          Whatever Your<br />Board Needs.
        </h1>
        <p className="text-white/55 max-w-xl mt-6 leading-relaxed">
          Custom boards, ding repairs, fin manufacturing, or a quality second-hand shape. Paul and Daniel have it covered — from blank to barrel.
        </p>
      </div>
    </div>

    {/* Services */}
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex flex-col gap-24">
        {SERVICES.map((s, i) => (
          <div
            key={s.title}
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}
          >
            {/* Image */}
            <div className={`relative ${i % 2 === 1 ? 'lg:col-start-2' : ''}`}>
              <img
                src={s.image}
                alt={s.title}
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute top-4 left-4 bg-pjd-gold p-3">
                <s.icon className="w-5 h-5 text-pjd-blue" />
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">{s.tagline}</p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight font-display">{s.title}</h2>
              {s.price && (
                <p className="text-pjd-gold text-sm font-bold mb-6 font-body">{s.price}</p>
              )}
              <p className="text-white/60 leading-relaxed mb-8">{s.description}</p>

              <ul className="flex flex-col gap-3 mb-10">
                {s.detail.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-white/70 text-sm">
                    <span className="w-1.5 h-1.5 bg-pjd-gold rounded-full mt-2 shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>

              <Link
                to={s.href || '/contact'}
                className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors group"
              >
                {s.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Process strip */}
    <div className="bg-black py-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-10 text-center">How It Works</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: '01', title: 'You Get in Touch', desc: 'Fill in the form or give Paul a call. Tell him what you need.' },
            { step: '02', title: 'Paul Asks the Right Questions', desc: "Height, weight, surfing level, local breaks. He needs the full picture." },
            { step: '03', title: 'The Board Gets Shaped', desc: 'Paul shapes every board by hand. Usually 2–4 weeks depending on demand.' },
            { step: '04', title: 'You Go Surf', desc: "Pick up your board and get in the water. That's the whole point." },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex flex-col gap-4">
              <p className="text-pjd-gold text-5xl font-black leading-none">{step}</p>
              <h3 className="text-white font-black text-lg">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
);

export default Services;
