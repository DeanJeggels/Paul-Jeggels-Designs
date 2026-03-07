import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const N8N_WEBHOOK = 'https://n8n-uq4a.onrender.com/webhook/pjd-new-lead';

const INTERESTS = [
  { value: 'custom', label: 'Custom Board' },
  { value: 'repair', label: 'Ding Repair' },
  { value: 'stock', label: 'Stock Board' },
  { value: 'fins', label: 'Fins' },
  { value: 'general', label: 'Just a Question' },
];

const InlineContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', interest: 'custom', message: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const { data, error } = await supabase
        .from('pjd_leads')
        .insert([{ ...form, source: 'website_inline' }])
        .select();
      if (error) throw new Error(error.message);

      try {
        await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: data?.[0]?.id }),
        });
      } catch {}

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Try calling Paul directly.');
    }
  };

  if (status === 'success') {
    return (
      <section className="relative py-24 overflow-hidden" style={{ backgroundImage: "url('/images/paul_jeggels_surfing.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-pjd-blue/85" />
        <div className="relative max-w-xl mx-auto px-6 text-center">
          <CheckCircle className="w-14 h-14 text-pjd-gold mx-auto mb-5" />
          <h2 className="text-3xl font-bold text-white mb-3 font-display">You're On Paul's Radar.</h2>
          <p className="text-white/55 leading-relaxed font-body">
            Paul will get back to you within 24 hours. For anything urgent, call{' '}
            <a href="tel:+27829609353" className="text-pjd-gold hover:underline">+27 82 960 9353</a>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ backgroundImage: "url('/images/paul_jeggels_surfing.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-pjd-blue/85" />
      <div className="relative max-w-2xl mx-auto px-6">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center font-body">
          Not ready for the quiz?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 font-display">
          Still Thinking? Just Ask.
        </h2>
        <p className="text-white/50 text-center mb-10 max-w-lg mx-auto font-body">
          Send Paul a quick message. No commitment, no pressure. He'll get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={set('name')}
            required
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors font-body"
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={set('email')}
            required
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors font-body"
          />
          <select
            value={form.interest}
            onChange={set('interest')}
            className="bg-pjd-blue border border-white/15 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors appearance-none sm:col-span-2 font-body"
          >
            {INTERESTS.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          <textarea
            placeholder="What's on your mind?"
            value={form.message}
            onChange={set('message')}
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors resize-none h-24 sm:col-span-2 font-body"
          />

          {status === 'error' && (
            <div className="flex items-start gap-2 text-red-400 text-sm sm:col-span-2 font-body">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="sm:col-span-2 flex items-center justify-center gap-3 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 cursor-pointer font-body"
          >
            {status === 'loading' ? (
              <><Loader className="w-4 h-4 animate-spin" /> Sending...</>
            ) : (
              <>Send Message <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default InlineContactForm;
