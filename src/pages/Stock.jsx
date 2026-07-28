import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Phone } from 'lucide-react';

// Query the stock table over PostgREST directly, so this page (and the
// prerender/SSR build) doesn't pull in the full @supabase/supabase-js client.
const SUPABASE_URL = 'https://dplbfhwqbmnzmrncxain.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwbGJmaHdxYm1uem1ybmN4YWluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNjIxNjgsImV4cCI6MjA2MDgzODE2OH0.e1SJPplUC8izzANfVYT1VNNBAZT2Ki6kivDt6lYjxIY';

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
    <div className="aspect-[4/3] overflow-hidden bg-pjd-dark/50 relative">
      {board.image_urls && board.image_urls.length > 0 ? (
        <img
          src={board.image_urls[0]}
          alt={board.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <img src="/images/pjd_logo.webp" alt="PJD" className="w-20 h-20 object-contain opacity-20" />
        </div>
      )}
      {board.sold && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
          <span className="text-white font-black text-xl tracking-widest uppercase">Sold</span>
        </div>
      )}
      {board.featured && !board.sold && (
        <div className="absolute top-3 left-3 bg-pjd-teal px-3 py-1">
          <span className="text-pjd-dark font-black text-xs tracking-widest uppercase">Featured</span>
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
        <p className="text-pjd-teal text-xs font-bold tracking-widest uppercase mb-3">{board.dimensions}</p>
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
            to="/contact/"
            state={{ interest: 'stock', boardName: board.name }}
            className="flex items-center gap-2 bg-pjd-teal text-pjd-dark font-black text-xs tracking-widest uppercase px-5 py-3 hover:bg-pjd-cream transition-colors group"
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
    <img src="/images/pjd_logo.webp" alt="PJD" className="w-16 h-16 object-contain mx-auto mb-6 opacity-30" />
    <h3 className="text-white font-black text-xl mb-3">No stock boards listed right now.</h3>
    <p className="text-white/40 mb-8 max-w-sm mx-auto">
      Stock changes regularly. Get in touch and Paul will let you know when something suitable comes up.
    </p>
    <Link
      to="/contact/"
      className="inline-flex items-center gap-2 bg-pjd-teal text-pjd-dark font-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors"
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
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/pjd_stock_boards?select=*&order=featured.desc,created_at.desc`,
          { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
        );
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setBoards(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, []);

  const displayed = showSold ? boards : boards.filter((b) => !b.sold);

  return (
    <div className="min-h-screen bg-pjd-dark pt-24">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-4">Available Now</p>
        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
          Stock Boards.
        </h1>
        <p className="text-white/60 max-w-2xl leading-relaxed">
          Surfboards for sale, ready to ride today. Every board on this page was hand-shaped by Paul Jeggels in his Jeffreys Bay workshop, so you get the same shape and the same glassing as a custom order without the wait. Stock moves quickly and the list is updated as boards come and go.
        </p>
        <p className="text-white/60 max-w-2xl leading-relaxed mt-4">
          Collection is free from the workshop in Jeffreys Bay and we courier boards anywhere in South Africa. If nothing here fits, Paul can{' '}
          <Link to="/services/" className="text-pjd-teal underline hover:text-white transition-colors">shape you a custom board</Link>{' '}
          in one to three weeks.
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
            <a href="tel:+27829609353" className="inline-flex items-center gap-2 text-pjd-teal text-sm font-bold">
              <Phone className="w-4 h-4" /> Call Paul directly: +27 82 960 9353
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.length > 0 ? displayed.map((b) => <BoardCard key={b.id} board={b} />) : <EmptyState />}
          </div>
        )}
      </div>

      {/* Buying guide. Static on purpose: the board grid above is fetched from
          Supabase on the client, so without this the prerendered HTML that
          Google crawls would be almost empty. */}
      <div className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-4">Before You Buy</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-12 max-w-2xl leading-tight">
            What You're Actually Getting.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            <div>
              <h3 className="text-white font-black text-lg mb-3">Shaped by Paul, Not Imported</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Every stock board is a Paul Jeggels shape, hand-shaped and hand-glassed in Jeffreys Bay. These are not factory blanks or imported pop-outs sitting under someone else's logo. Same foam, same glassing schedule and same finish that goes into a full custom order.
              </p>
            </div>
            <div>
              <h3 className="text-white font-black text-lg mb-3">Checked and Repaired First</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                Nothing gets listed until it has been through the workshop. Dings are repaired, fin boxes and leash plugs are checked, and any pressure dents or delamination are sorted before the board goes up. Condition is then graded honestly.
              </p>
            </div>
            <div>
              <h3 className="text-white font-black text-lg mb-3">Ready to Ride Today</h3>
              <p className="text-white/60 text-sm leading-relaxed">
                A custom order takes one to three weeks. A stock board leaves the workshop the day you pay for it. If there is swell coming and you need something under your feet this weekend, this is the page to watch.
              </p>
            </div>
          </div>

          <h3 className="text-white font-black text-xl mb-6">How We Grade Condition</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              ['New', 'bg-emerald-500', 'Never surfed. Straight off the rack with no repairs and no marks.'],
              ['Like New', 'bg-teal-500', 'Surfed a handful of times. No repairs, maybe the odd light pressure dent.'],
              ['Good', 'bg-blue-500', 'Properly surfed and properly sorted. Repairs done cleanly and fully watertight.'],
              ['Fair', 'bg-amber-500', 'Plenty of life left and priced accordingly. Visible repairs, honest wear, still rides well.'],
            ].map(([label, color, copy]) => (
              <div key={label} className="border border-white/10 p-5">
                <span className={`inline-block ${color} px-3 py-1 mb-4`}>
                  <span className="text-white font-black text-xs tracking-widest uppercase">{label}</span>
                </span>
                <p className="text-white/60 text-sm leading-relaxed">{copy}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-white/10 pt-14">
            <div>
              <h3 className="text-white font-black text-xl mb-4">Stock Board or Custom Order?</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Buy stock if the dimensions suit you and you want a board now, or if you are after a second board without paying custom money. Everything is already shaped, glassed and finished, so the price is lower and there is no lead time.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                Order custom if you want the board built around your height, weight, ability and home break. Paul will spec the outline, rocker, volume and glassing with you. Custom boards start around R5,000 and take one to three weeks. See the full{' '}
                <Link to="/services/" className="text-pjd-teal underline hover:text-white transition-colors">shaping, glassing and repair services</Link>.
              </p>
            </div>
            <div>
              <h3 className="text-white font-black text-xl mb-4">Collection and Delivery</h3>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Collection is free from the workshop at 15 Dageraad Street, Jeffreys Bay. You are welcome to come and look at a board before you commit, and Paul will talk you through how it is going to surf for you.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                We courier boards nationwide to Cape Town, Durban, Gqeberha, East London and everywhere in between, boxed and insured. Ask for a delivery quote when you{' '}
                <Link to="/contact/" className="text-pjd-teal underline hover:text-white transition-colors">enquire about a board</Link>, or browse the{' '}
                <Link to="/gallery/" className="text-pjd-teal underline hover:text-white transition-colors">gallery of past shapes</Link> to see the range of work.
              </p>
            </div>
          </div>
        </div>
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
              className="inline-flex items-center gap-2 bg-pjd-teal text-pjd-dark font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors group cursor-pointer font-body"
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
