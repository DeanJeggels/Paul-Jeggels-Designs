import React, { useState } from 'react';
import { Link } from 'react-router';
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
  { src: '/images/paul_jeggels_customer_5.webp', label: 'Stoked Surfer' },
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

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-4">The Work</p>
        <h1 className="text-5xl md:text-7xl font-black text-pjd-dark leading-tight mb-6">
          40 Years of Shapes.<br />Zero Compromises.
        </h1>
        <p className="text-pjd-stone max-w-2xl leading-relaxed">
          Every board in this gallery was hand-shaped by Paul Jeggels in Jeffreys Bay. No templates. No CNC machine copying someone else's file. No shortcuts. Four decades of shapes, more than 4,000 boards, each one cut, glassed and finished by hand.
        </p>
        <p className="text-pjd-stone max-w-2xl leading-relaxed mt-4">
          What follows is a mix of custom orders, brand collaborations, resin and colour work, and customers on the boards Paul built for them. If something here catches your eye, he can build the same shape to your own dimensions.
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
                alt={`${img.label} — custom hand-shaped surfboard by Paul Jeggels, Jeffreys Bay`}
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

      {/* Board types. Static editorial content so the page carries real
          substance in the prerendered HTML rather than an image grid alone. */}
      <div className="border-t border-pjd-dark/10">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-4">The Range</p>
          <h2 className="text-3xl md:text-4xl font-black text-pjd-dark mb-6 max-w-2xl leading-tight">
            What Paul Shapes.
          </h2>
          <p className="text-pjd-stone max-w-2xl leading-relaxed mb-14">
            Forty years in the bay means Paul has shaped just about everything a South African surfer rides, from step-ups for solid J-Bay to logs for small summer days. These are the shapes that come out of the workshop most often.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
            {[
              ['Shortboards and Performance Thrusters', 'The everyday high-performance board, shaped around your weight and ability rather than a pro template, with the volume moved to where you actually need it. Most surfers land somewhere between 5\'8" and 6\'4" for beach breaks and points.'],
              ['Fish and Twin Fins', 'Wider, flatter and faster through the small stuff. A fish keeps you surfing on days a shortboard stays in the car, and a well-shaped keel twin holds a line through a J-Bay wall better than most people expect.'],
              ['Hybrids and Grovellers', 'The board most surfers actually need. Shortboard outline with extra width and volume so it paddles easily and still turns properly. If you surf a few times a month and want one board that covers everything, this is usually it.'],
              ['Mid-Lengths and Eggs', 'Six to eight foot, single fin or 2+1, built for glide. Ideal for surfers coming back to the water, longboarders who want something more manoeuvrable, or anyone chasing more waves without going full log.'],
              ['Longboards and Logs', 'Traditional nine foot and over with proper nose concave for noseriding, or lighter performance longboards. Shaped for how you actually want to ride: hang fives and trim, or step and turn.'],
              ['Step-Ups and Guns', 'For when it gets serious. Jeffreys Bay is on the doorstep, so Paul has shaped plenty of boards for solid Supertubes and Boneyards, plus guns for surfers heading to bigger waves further afield.'],
            ].map(([title, copy]) => (
              <div key={title}>
                <h3 className="text-pjd-dark font-black text-lg mb-3">{title}</h3>
                <p className="text-pjd-stone text-sm leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-14 border-t border-pjd-dark/10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-pjd-dark font-black text-xl mb-4">Colour, Resin and Glassing</h3>
              <p className="text-pjd-stone text-sm leading-relaxed">
                Plenty of the boards above are here for the finish rather than the outline. Resin tints, swirls, cut laps, opaque panels and gloss coats are all done by hand in the workshop. Glassing is where a board is won or lost, and Paul does it himself. If you want a specific colour, bring a photo and he will match it. Full detail on the{' '}
                <Link to="/services/" className="text-pjd-teal underline hover:text-pjd-dark transition-colors">glassing and repair services</Link> page.
              </p>
            </div>
            <div>
              <h3 className="text-pjd-dark font-black text-xl mb-4">Want One of These?</h3>
              <p className="text-pjd-stone text-sm leading-relaxed">
                Any shape in this gallery can be rebuilt to your own height, weight and home break. Custom orders start around R5,000 and take one to three weeks, shaped in Jeffreys Bay and couriered anywhere in South Africa. If you would rather not wait, see what is{' '}
                <Link to="/stock/" className="text-pjd-teal underline hover:text-pjd-dark transition-colors">in stock and ready to ride</Link>, or read{' '}
                <Link to="/about/" className="text-pjd-teal underline hover:text-pjd-dark transition-colors">Paul's story</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-pjd-dark py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">Like What You See?</h2>
          <p className="text-white/50 mb-8 font-body">Find your perfect board in 60 seconds — Paul will handle the rest.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-pjd-teal text-pjd-dark font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream hover:text-pjd-dark transition-colors group cursor-pointer font-body"
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
