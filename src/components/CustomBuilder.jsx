import React, { useState } from 'react';
import { X, ChevronLeft, ArrowRight, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const N8N_WEBHOOK = 'https://n8n-uq4a.onrender.com/webhook/pjd-new-lead';

const BOARD_TYPES = [
  {
    id: 'shortboard',
    name: 'Shortboard',
    category: 'High Performance',
    image: '/images/paul_jeggels_design_4.jpg',
    description: 'For experienced surfers chasing critical sections and powerful waves.',
  },
  {
    id: 'fish',
    name: 'Fish',
    category: 'Alternative',
    image: '/images/paul_jeggels_design_7.jpg',
    description: 'Fast and loose in small to medium waves. Great for all levels.',
  },
  {
    id: 'hybrid',
    name: 'Hybrid / Mullet',
    category: 'Daily Driver',
    image: '/images/paul_jeggels_design_10.jpg',
    description: 'Wider nose, relaxed rocker. Paddles well and handles most conditions.',
  },
  {
    id: 'longboard',
    name: 'Longboard',
    category: 'Classic',
    image: '/images/paul_jeggels_design_13.jpg',
    description: 'Smooth, flowing surfing. Ideal for small waves and classic style.',
  },
];

const FIN_SETUPS = ['Thruster (3 fins)', 'Twin fin (2 fins)', 'Quad (4 fins)', '2+1 (longboard)', 'Single fin', 'Not sure'];
const GLASS_JOBS = ['Standard (4oz)', '4+4oz deck (stronger)', '4+4+4oz (heavy duty)', "Paul's recommendation"];

const inputClass = 'w-full bg-white/5 border border-white/15 text-white placeholder-white/30 px-4 py-3 text-sm focus:outline-none focus:border-pjd-gold transition-colors';
const selectClass = 'w-full bg-[#0a192f] border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-pjd-gold transition-colors appearance-none';
const labelClass = 'block text-white/60 text-xs font-bold tracking-widest uppercase mb-2';

// ─── VIEW A: BOARD TYPE SELECTOR ─────────────────────────────────────────────

const BoardSelector = ({ onSelect, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-pjd-blue w-full max-w-7xl h-full md:h-[90vh] md:rounded-xl shadow-2xl overflow-hidden flex flex-col">

      <div className="p-6 md:p-8 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">What Are You After?</h2>
          <p className="text-white/40 text-sm mt-1">Pick a shape and we'll spec it out for you.</p>
        </div>
        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {BOARD_TYPES.map((board) => (
            <button
              key={board.id}
              onClick={() => onSelect(board)}
              className="group text-left bg-white/5 border border-white/10 hover:border-pjd-gold transition-all duration-300 overflow-hidden focus:outline-none focus:border-pjd-gold"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={board.image}
                  alt={board.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-pjd-blue/30 group-hover:bg-pjd-blue/10 transition-colors" />
              </div>
              <div className="p-5">
                <span className="text-pjd-gold text-xs font-bold tracking-widest uppercase">{board.category}</span>
                <h3 className="text-white font-black text-xl mt-1 mb-2">{board.name}</h3>
                <p className="text-white/50 text-xs leading-relaxed mb-4">{board.description}</p>
                <div className="flex items-center gap-2 text-pjd-gold text-xs font-bold tracking-widest uppercase group-hover:gap-3 transition-all">
                  Select <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  </div>
);

// ─── VIEW B: DIMENSIONS FORM ──────────────────────────────────────────────────

const DimensionsForm = ({ board, onBack, onClose }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    length: '',
    width: '',
    thickness: '',
    fin_setup: '',
    glass_job: '',
    height_cm: '',
    weight_kg: '',
    notes: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      interest: 'custom',
      board_type: board.id,
      height_cm: form.height_cm,
      weight_kg: form.weight_kg,
      length_board: form.length || null,
      width_board: form.width || null,
      thickness_board: form.thickness || null,
      fin_setup: form.fin_setup || null,
      glass_job: form.glass_job || null,
      notes: form.notes || null,
      message: `Custom builder request — ${board.name}`,
      source: 'website_builder',
    };

    try {
      const { data, error } = await supabase.from('pjd_leads').insert([payload]).select();
      if (error) throw new Error(error.message);

      try {
        await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: data?.[0]?.id }),
        });
      } catch {
        // Non-blocking
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-pjd-blue border border-white/10 p-12 max-w-md w-full text-center shadow-2xl">
          <CheckCircle className="w-14 h-14 text-pjd-gold mx-auto mb-5" />
          <h2 className="text-3xl font-black text-white mb-3">You're On Paul's Radar.</h2>
          <p className="text-white/55 leading-relaxed mb-8">
            Paul will get back to you within 24 hours with a quote based on your spec.
          </p>
          <button
            onClick={onClose}
            className="bg-pjd-gold text-pjd-blue font-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-pjd-blue w-full max-w-3xl h-full md:h-[90vh] md:rounded-xl shadow-2xl overflow-hidden flex flex-col">

        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="h-4 w-px bg-white/20" />
            <div>
              <span className="text-pjd-gold text-xs font-bold tracking-widest uppercase">{board.category}</span>
              <span className="text-white font-black ml-2">{board.name}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8">
          <p className="text-white/40 text-xs tracking-widest uppercase font-bold mb-6">Your Details</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div>
              <label className={labelClass}>Name <span className="text-pjd-gold">*</span></label>
              <input type="text" className={inputClass} placeholder="John Smith" value={form.name} onChange={set('name')} required />
            </div>
            <div>
              <label className={labelClass}>Email <span className="text-pjd-gold">*</span></label>
              <input type="email" className={inputClass} placeholder="john@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="tel" className={inputClass} placeholder="+27 82 000 0000" value={form.phone} onChange={set('phone')} />
            </div>
          </div>

          <p className="text-white/40 text-xs tracking-widest uppercase font-bold mb-6">Your Body</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div>
              <label className={labelClass}>Height</label>
              <input type="text" className={inputClass} placeholder="e.g. 180cm or 5ft 11in" value={form.height_cm} onChange={set('height_cm')} />
            </div>
            <div>
              <label className={labelClass}>Weight</label>
              <input type="text" className={inputClass} placeholder="e.g. 75kg or 165lbs" value={form.weight_kg} onChange={set('weight_kg')} />
            </div>
          </div>

          <p className="text-white/40 text-xs tracking-widest uppercase font-bold mb-2">Board Dimensions</p>
          <p className="text-white/35 text-xs mb-6">Leave blank if you'd prefer Paul to recommend based on your body and surfing level.</p>

          <div className="grid grid-cols-3 gap-4 mb-5">
            <div>
              <label className={labelClass}>Length</label>
              <input type="text" className={inputClass} placeholder={`6'2"`} value={form.length} onChange={set('length')} />
            </div>
            <div>
              <label className={labelClass}>Width</label>
              <input type="text" className={inputClass} placeholder={`19.5"`} value={form.width} onChange={set('width')} />
            </div>
            <div>
              <label className={labelClass}>Thickness</label>
              <input type="text" className={inputClass} placeholder={`2.5"`} value={form.thickness} onChange={set('thickness')} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className={labelClass}>Fin Setup</label>
              <select className={selectClass} value={form.fin_setup} onChange={set('fin_setup')}>
                <option value="">Select fin setup</option>
                {FIN_SETUPS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Glass Job</label>
              <select className={selectClass} value={form.glass_job} onChange={set('glass_job')}>
                <option value="">Select glass job</option>
                {GLASS_JOBS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-8">
            <label className={labelClass}>Any Other Notes</label>
            <textarea
              className={`${inputClass} resize-none h-24`}
              placeholder="Design ideas, wave conditions you surf, surfing level, anything else Paul should know..."
              value={form.notes}
              onChange={set('notes')}
            />
          </div>

          {status === 'error' && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-5">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full flex items-center justify-center gap-3 bg-pjd-gold text-pjd-blue font-black py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? (
              <><Loader className="w-4 h-4 animate-spin" /> Sending to Paul...</>
            ) : (
              <>Send My Spec to Paul <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

const CustomBuilder = ({ onClose }) => {
  const [selectedBoard, setSelectedBoard] = useState(null);

  if (!selectedBoard) {
    return <BoardSelector onSelect={setSelectedBoard} onClose={onClose} />;
  }

  return <DimensionsForm board={selectedBoard} onBack={() => setSelectedBoard(null)} onClose={onClose} />;
};

export default CustomBuilder;
