import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const GALLERY_IMAGES = [
  { src: '/images/paul_jeggels_design_1.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_2.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_3.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_4.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_5.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_6.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_7.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_8.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_9.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_10.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_11.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_12.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_13.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_14.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_15.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_16.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_17.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_18.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_19.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_20.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_design_21.jpg', label: 'Custom Shape' },
  { src: '/images/paul_jeggels_customs_1.jpg', label: 'Customs' },
  { src: '/images/paul_jeggels_customs_3.jpg', label: 'Customs' },
  { src: '/images/paul_jeggels_customer_1.jpg', label: 'Stoked Surfer' },
  { src: '/images/paul_jeggels_customer_2.jpg', label: 'Stoked Surfer' },
  { src: '/images/paul_jeggels_customer_3.jpg', label: 'Stoked Surfer' },
  { src: '/images/paul_jeggels_customer_4.jpg', label: 'Stoked Surfer' },
  { src: '/images/norden_1.jpg', label: 'Collaboration' },
  { src: '/images/norden_2.jpg', label: 'Collaboration' },
  { src: '/images/norden_3.jpg', label: 'Collaboration' },
  { src: '/images/norden_4.jpg', label: 'Collaboration' },
  { src: '/images/norden_5.jpg', label: 'Collaboration' },
  { src: '/images/paul_jeggels_glassing_1.jpg', label: 'In the Bay' },
  { src: '/images/paul_jeggels_glassing_2.jpg', label: 'In the Bay' },
  { src: '/images/paul_jeggels_shaping_1.jpg', label: 'Shaping' },
  { src: '/images/paul_jeggels_shaping_2.jpg', label: 'Shaping' },
  { src: '/images/paul_jeggels_shaping_4.jpg', label: 'Shaping' },
  { src: '/images/paul_jeggels_shaping_6.jpg', label: 'Shaping' },
];

const VIDEOS = [
  { src: '/images/paul_jeggels_glassing_2.mp4', label: 'Glassing Process' },
  { src: '/images/paul_jeggels_glassing_3.mp4', label: 'Glassing Process' },
  { src: '/images/paul_jeggels_glassing_4.mp4', label: 'Shaping Bay' },
];

const Gallery = () => {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-pjd-blue pt-24">
      <Helmet>
        <title>Gallery — 40 Years of Hand-Shaped Surfboards | Paul Jeggels Designs</title>
        <meta name="description" content="Browse 40+ years of custom surfboard designs hand-shaped by Paul Jeggels in Jeffreys Bay. Shortboards, fish, longboards & more." />
        <link rel="canonical" href="https://pauljeggelsdesigns.co.za/gallery" />
      </Helmet>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">The Work</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
          40 Years of Shapes.<br />Zero Compromises.
        </h1>
        <p className="text-white/50 max-w-xl leading-relaxed">
          Every board in this gallery was hand-shaped by Paul Jeggels in Jeffreys Bay. No templates. No shortcuts. Just craft.
        </p>
      </div>

      {/* Photo grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(img)}
              className="group relative aspect-square overflow-hidden bg-black/20 focus:outline-none focus:ring-2 focus:ring-pjd-gold"
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

      {/* Videos */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-8">Process Videos</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {VIDEOS.map((v, i) => (
            <div key={i} className="relative aspect-video overflow-hidden bg-black">
              <video
                src={v.src}
                controls
                playsInline
                preload="none"
                className="w-full h-full object-cover"
                poster="/images/paul_jeggels_glassing_1.jpg"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Like What You See?</h2>
          <p className="text-white/50 mb-8 font-body">Find your perfect board in 60 seconds — Paul will handle the rest.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors group cursor-pointer font-body"
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
