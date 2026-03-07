import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone } from 'lucide-react';
import { supabase } from '../lib/supabase';

const CONDITION_LABELS = {
  new: 'New',
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
};

const CONDITION_COLORS = {
  new: 'bg-emerald-500',
  like_new: 'bg-teal-500',
  good: 'bg-blue-500',
  fair: 'bg-amber-500',
};

const BoardCard = ({ board }) => (
  <div className={`group relative bg-black border border-white/10 flex flex-col overflow-hidden ${board.sold ? 'opacity-50' : ''}`}>
    {/* Image */}
    <div className="aspect-[4/3] overflow-hidden bg-pjd-blue/50 relative">
      {board.image_urls && board.image_urls.length > 0 ? (
        <img
          src={board.image_urls[0]}
          alt={board.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <img src="/images/pjd_logo.jpeg" alt="PJD" className="w-20 h-20 object-contain opacity-20" />
        </div>
      )}
      {board.sold && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-white font-black text-xl tracking-widest uppercase">Sold</span>
        </div>
      )}
      {board.featured && !board.sold && (
        <div className="absolute top-3 left-3 bg-pjd-gold px-3 py-1">
          <span className="text-pjd-blue font-black text-xs tracking-widest uppercase">Featured</span>
        </div>
      )}
      {board.condition && !board.sold && (
        <div className={`absolute top-3 right-3 ${CONDITION_COLORS[board.condition]} px-3 py-1`}>
          <span className="text-white font-black text-xs tracking-widest uppercase">{CONDITION_LABELS[board.condition]}</span>
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-white font-black text-lg mb-1">{board.name}</h3>
      {board.dimensions && (
        <p className="text-pjd-gold text-xs font-bold tracking-widest uppercase mb-3">{board.dimensions}</p>
      )}
      {board.description && (
        <p className="text-white/55 text-sm leading-relaxed mb-4 flex-1">{board.description}</p>
      )}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
        {board.price ? (
          <p className="text-white font-black text-2xl">R{Number(board.price).toLocaleString()}</p>
        ) : (
          <p className="text-white/40 text-sm">Price on request</p>
        )}
        {!board.sold && (
          <Link
            to="/contact"
            state={{ interest: 'stock', boardName: board.name }}
            className="flex items-center gap-2 bg-pjd-gold text-pjd-blue font-black text-xs tracking-widest uppercase px-5 py-3 hover:bg-white transition-colors group"
          >
            Enquire <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full py-24 text-center">
    <img src="/images/pjd_logo.jpeg" alt="PJD" className="w-16 h-16 object-contain mx-auto mb-6 opacity-30" />
    <h3 className="text-white font-black text-xl mb-3">No stock boards listed right now.</h3>
    <p className="text-white/40 mb-8 max-w-sm mx-auto">
      Stock changes regularly. Get in touch and Paul will let you know when something suitable comes up.
    </p>
    <Link
      to="/contact"
      className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors"
    >
      Contact Us
    </Link>
  </div>
);

const Stock = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSold, setShowSold] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('pjd_stock_boards')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBoards(data || []);
      }
      setLoading(false);
    };

    fetchBoards();
  }, []);

  const displayed = showSold ? boards : boards.filter((b) => !b.sold);

  return (
    <div className="min-h-screen bg-pjd-blue pt-24">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">Available Now</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
          Stock Boards.
        </h1>
        <p className="text-white/50 max-w-xl leading-relaxed">
          All boards shaped by Paul Jeggels. No exceptions. Updated as boards come and go — check back regularly or get in touch to be notified.
        </p>
      </div>

      {/* Filter toggle */}
      {boards.some((b) => b.sold) && (
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <button
            onClick={() => setShowSold(!showSold)}
            className={`text-xs font-bold tracking-widest uppercase px-5 py-3 border transition-colors ${showSold ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-white/40 hover:text-white'}`}
          >
            {showSold ? 'Hide Sold' : 'Show Sold Boards'}
          </button>
        </div>
      )}

      {/* Board grid */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white/5 aspect-[4/3] rounded-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-white/40 mb-4">Couldn't load boards right now.</p>
            <a href="tel:+27829609353" className="inline-flex items-center gap-2 text-pjd-gold text-sm font-bold">
              <Phone className="w-4 h-4" /> Call Paul directly: +27 82 960 9353
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.length > 0 ? displayed.map((b) => <BoardCard key={b.id} board={b} />) : <EmptyState />}
          </div>
        )}
      </div>

      {/* Contact strip */}
      <div className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-white font-black text-2xl md:text-3xl mb-2">Don't See What You're After?</h2>
            <p className="text-white/50">
              Get in touch. Paul may have something not yet listed, or can shape you a custom order.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <a
              href="tel:+27829609353"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-black px-8 py-4 text-sm tracking-widest uppercase hover:border-white transition-colors"
            >
              <Phone className="w-4 h-4" /> Call Paul
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors group cursor-pointer font-body"
            >
              Take the Board Quiz <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Stock;
