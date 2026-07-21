import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/images/paul_jeggels_design_1.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_2.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_3.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_4.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_5.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_6.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_7.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_8.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_9.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_10.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_11.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_12.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_13.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_14.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_15.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_16.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_17.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_18.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_19.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_20.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_21.webp', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_customs_1.webp', label: 'Customs' },
  { src: '/images/paul_jeggels_customs_3.webp', label: 'Customs' },
  { src: '/images/paul_jeggels_customer_1.webp', label: 'Stoked Surfer' },
  { src: '/images/paul_jeggels_customer_2.webp', label: 'Stoked Surfer' },
  { src: '/images/paul_jeggels_customer_3.webp', label: 'Stoked Surfer' },
  { src: '/images/paul_jeggels_customer_4.webp', label: 'Stoked Surfer' },
  { src: '/images/norden_1.webp', label: 'Collaboration' },
  { src: '/images/norden_2.webp', label: 'Collaboration' },
  { src: '/images/norden_3.webp', label: 'Collaboration' },
  { src: '/images/norden_4.webp', label: 'Collaboration' },
  { src: '/images/norden_5.webp', label: 'Collaboration' },
  { src: '/images/paul_jeggels_glassing_1.webp', label: 'In the Bay' },
  { src: '/images/paul_jeggels_glassing_2.webp', label: 'In the Bay' },
  { src: '/images/paul_jeggels_shaping_1.webp', label: 'Shaping' },
  { src: '/images/paul_jeggels_shaping_2.webp', label: 'Shaping' },
  { src: '/images/paul_jeggels_shaping_4.webp', label: 'Shaping' },
  { src: '/images/paul_jeggels_shaping_6.webp', label: 'Shaping' },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-pjd-cream pt-24">
      <Helmet>
        <title>Gallery — 40 Years of Hand-Shaped Surfboards | Paul Jeggels Designs</title>
        <meta name="description" content="Browse 40+ years of custom surfboard designs hand-shaped by Paul Jeggels in Jeffreys Bay. Shortboards, fish, longboards & more." />
        <link rel="canonical" href="https://pauljeggelsdesigns.co.za/gallery" />
      </Helmet>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-4">The Work</p>
        <h1 className="text-5xl md:text-7xl font-black text-pjd-dark leading-tight mb-6">
          40 Years of Shapes.<br />Zero Compromises.
        </h1>
        <p className="text-pjd-stone max-w-xl leading-relaxed">
          Every board in this gallery was hand-shaped by Paul Jeggels in Jeffreys Bay. No templates. No shortcuts. Just craft.
        </p>
      </div>

      {/* Photo grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(img)}
              className="group relative aspect-square overflow-hidden bg-black/20 focus:outline-none focus:ring-2 focus:ring-pjd-teal"
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-end p-3">
                <span className="text-white text-xs font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                  {img.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-pjd-dark py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Like What You See?</h2>
          <p className="text-white/50 mb-8 font-body">Find your perfect board in 60 seconds — Paul will handle the rest.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-pjd-teal text-pjd-cream font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream hover:text-pjd-dark transition-colors group cursor-pointer font-body"
          >
            Take the Board Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src}
            alt={lightbox.label}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white/60 hover:text-white text-xs font-bold tracking-widest uppercase"
          >
            Close
          </button>
        </div>
      )}

    </div>
  );
};

export default Gallery;
