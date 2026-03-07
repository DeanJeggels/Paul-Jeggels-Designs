import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const FALLBACK_TESTIMONIALS = [
  {
    quote: "Paul shaped a board perfectly suited to my surfing. I've never had anything that paddles this well in J-Bay conditions.",
    name: 'Mike R.',
    location: 'Jeffreys Bay',
    image: '/images/paul_jeggels_customer_1.jpg',
    rating: 5,
  },
  {
    quote: "I had no idea what I needed. Paul asked me a few questions, and two weeks later I had the best board I've ever owned.",
    name: 'Sarah T.',
    location: 'Cape Town',
    image: '/images/paul_jeggels_customer_2.jpg',
    rating: 5,
  },
  {
    quote: "Third board from Paul now. Each one better than the last. He remembers exactly what I ride and keeps improving on it.",
    name: 'Johan V.',
    location: 'Port Elizabeth',
    image: '/images/paul_jeggels_customer_3.jpg',
    rating: 5,
  },
];

const StarRating = ({ rating }) => (
  <div className="flex gap-1 mb-4">
    {[...Array(5)].map((_, j) => (
      <Star
        key={j}
        className={`w-4 h-4 ${j < rating ? 'fill-pjd-blue text-pjd-blue' : 'text-pjd-blue/30'}`}
      />
    ))}
  </div>
);

const Testimonials = () => {
  const [reviews, setReviews] = useState(null);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('google-reviews');
        if (error || !data?.reviews?.length) return;
        setReviews(
          data.reviews
            .filter((r) => r.rating >= 4 && r.text.length > 0)
            .map((r) => ({
              quote: r.text,
              name: r.author,
              location: r.time,
              image: r.photo,
              rating: r.rating,
            }))
        );
        if (data.rating) {
          setMeta({ rating: data.rating, total: data.totalReviews });
        }
      } catch {
        // Fallback handled by null state
      }
    };
    fetchReviews();
  }, []);

  const allTestimonials = reviews?.length ? reviews : FALLBACK_TESTIMONIALS;
  const isGoogle = reviews?.length > 0;
  const perPage = 3;
  const totalPages = Math.ceil(allTestimonials.length / perPage);
  const testimonials = allTestimonials.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="bg-pjd-gold py-20">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-pjd-blue/60 text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center font-body">
          {isGoogle ? 'Google Reviews' : 'What Surfers Say'}
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-pjd-blue text-center mb-4 font-display">
          4,000+ Boards. Here's What They Think.
        </h2>
        {isGoogle && meta && (
          <div className="flex items-center justify-center gap-2 mb-10">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className={`w-4 h-4 ${j < Math.round(meta.rating) ? 'fill-pjd-blue text-pjd-blue' : 'text-pjd-blue/30'}`}
                />
              ))}
            </div>
            <span className="text-pjd-blue/70 text-sm font-body">
              {meta.rating} out of 5 ({meta.total} reviews)
            </span>
          </div>
        )}
        {!isGoogle && <div className="mb-10" />}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map(({ quote, name, location, image, rating }, i) => (
            <div
              key={i}
              className="bg-white/20 backdrop-blur-sm border border-white/30 p-8 flex flex-col"
            >
              <StarRating rating={rating || 5} />
              <p className="text-pjd-blue/80 leading-relaxed flex-1 italic mb-6 font-body">"{quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-pjd-blue/10">
                {image && (
                  <img
                    src={image}
                    alt={name}
                    className="w-10 h-10 rounded-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                )}
                <div>
                  <p className="text-pjd-blue font-bold text-sm font-body">{name}</p>
                  <p className="text-pjd-blue/50 text-xs font-body">{location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="p-2 rounded-full border border-pjd-blue/20 hover:bg-pjd-blue/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Previous reviews"
            >
              <ChevronLeft className="w-5 h-5 text-pjd-blue" />
            </button>
            <span className="text-pjd-blue/60 text-sm font-body">
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages - 1}
              className="p-2 rounded-full border border-pjd-blue/20 hover:bg-pjd-blue/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Next reviews"
            >
              <ChevronRight className="w-5 h-5 text-pjd-blue" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
