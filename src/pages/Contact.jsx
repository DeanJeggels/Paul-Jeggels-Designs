import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Phone, Instagram, MapPin, CheckCircle, AlertCircle, Loader, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const N8N_WEBHOOK = 'https://n8n-uq4a.onrender.com/webhook/pjd-new-lead';

const INTERESTS = [
  { value: 'custom', label: 'Custom Surfboard' },
  { value: 'repair', label: 'Ding Repair' },
  { value: 'stock', label: 'Stock Board Enquiry' },
  { value: 'fins', label: 'Fin Manufacturing' },
  { value: 'general', label: 'General Enquiry' },
];

const inputClass =
  'w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 text-sm focus:outline-none focus:border-pjd-gold transition-colors font-body';

const selectClass =
  'w-full bg-pjd-blue border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-pjd-gold transition-colors appearance-none font-body';

const Contact = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const prefillInterest = location.state?.interest || 'custom';
  const prefillBoardName = location.state?.boardName || '';
  const prefillMessage = searchParams.get('message') || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: prefillInterest,
    message: prefillBoardName
      ? `I'm interested in: ${prefillBoardName}`
      : prefillMessage || '',
  });

  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const { data, error } = await supabase
        .from('pjd_leads')
        .insert([{ ...form, source: 'website' }])
        .select();

      if (error) throw new Error(error.message);

      try {
        await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: data?.[0]?.id }),
        });
      } catch {
        // Webhook failure is non-blocking
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again or call Paul directly.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-pjd-blue pt-24 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-pjd-gold mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4 font-display">You're On Paul's Radar.</h2>
          <p className="text-white/60 leading-relaxed mb-8 font-body">
            Paul will get back to you within 24 hours. If it's urgent, give him a call on{' '}
            <a href="tel:+27829609353" className="text-pjd-gold hover:underline">+27 82 960 9353</a>.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors font-body"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pjd-blue pt-24">
      <Helmet>
        <title>Get a Quote — Custom Surfboard Order | Paul Jeggels Designs</title>
        <meta name="description" content="Order your custom surfboard from Paul Jeggels in Jeffreys Bay. Free consultation. Response within 24 hours." />
        <link rel="canonical" href="https://pauljeggelsdesigns.co.za/contact" />
      </Helmet>

      {/* Header */}
      <div
        className="relative py-24 overflow-hidden"
        style={{ backgroundImage: "url('/images/paul_jeggels_surfboard_3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-pjd-blue/85" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4 font-body">Get in Touch</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight max-w-3xl font-display">
            Ready for Your<br />Best Session Yet?
          </h1>
          <p className="text-white/55 max-w-xl mt-6 leading-relaxed font-body">
            Send Paul a message and he'll get back to you within 24 hours. He'll ask the right questions to make sure your board is exactly what you need.
          </p>
        </div>
      </div>

      {/* Form + Contact info */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Simplified form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            <div>
              <label className="block text-white/70 text-xs font-bold tracking-widest uppercase mb-2 font-body">
                What are you after?<span className="text-pjd-gold ml-1">*</span>
              </label>
              <select className={selectClass} value={form.interest} onChange={set('interest')} required>
                {INTERESTS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-xs font-bold tracking-widest uppercase mb-2 font-body">
                  Your Name<span className="text-pjd-gold ml-1">*</span>
                </label>
                <input type="text" className={inputClass} placeholder="John Smith" value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="block text-white/70 text-xs font-bold tracking-widest uppercase mb-2 font-body">
                  Email Address<span className="text-pjd-gold ml-1">*</span>
                </label>
                <input type="email" className={inputClass} placeholder="john@example.com" value={form.email} onChange={set('email')} required />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-xs font-bold tracking-widest uppercase mb-2 font-body">Phone Number</label>
              <input type="tel" className={inputClass} placeholder="+27 82 000 0000" value={form.phone} onChange={set('phone')} />
            </div>

            <div>
              <label className="block text-white/70 text-xs font-bold tracking-widest uppercase mb-2 font-body">Message</label>
              <textarea
                className={`${inputClass} resize-none h-36`}
                placeholder="Tell Paul what you're looking for — your surfing level, local break, budget, anything that helps..."
                value={form.message}
                onChange={set('message')}
              />
            </div>

            {status === 'error' && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-3 bg-pjd-gold text-pjd-blue font-bold px-8 py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-body"
            >
              {status === 'loading' ? (
                <><Loader className="w-4 h-4 animate-spin" /> Sending...</>
              ) : (
                <>Send Message <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

          </form>

          <p className="text-white/30 text-xs mt-6 font-body">
            Want to spec out a custom board in detail? Use the{' '}
            <a href="/" className="text-pjd-gold hover:underline">board builder on our homepage</a>.
          </p>
        </div>

        {/* Contact info sidebar */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-6 font-body">Direct Contact</p>
            <div className="flex flex-col gap-5">
              <a href="tel:+27829609353" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group">
                <div className="w-10 h-10 bg-pjd-gold flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-pjd-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-0.5 font-body">Phone</p>
                  <p className="font-bold text-sm font-body">+27 82 960 9353</p>
                </div>
              </a>
              <a href="https://www.instagram.com/pauljeggelsdesigns" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                <div className="w-10 h-10 bg-pjd-gold flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4 text-pjd-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-0.5 font-body">Instagram</p>
                  <p className="font-bold text-sm font-body">@pauljeggelsdesigns</p>
                </div>
              </a>
              <div className="flex items-start gap-4 text-white/70">
                <div className="w-10 h-10 bg-pjd-gold flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-pjd-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-0.5 font-body">Workshop</p>
                  <p className="font-bold text-sm leading-relaxed font-body">15 Dageraad Street<br />Jeffreys Bay 6330</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-white/40 text-xs leading-relaxed font-body">
              Paul aims to respond within 24 hours. For urgent requests, call directly. Lead times on custom boards are typically 1–3 weeks depending on demand.
            </p>
          </div>

          <div>
            <img src="/images/paul_jeggels_shaping_6.jpg" alt="Paul in the shaping bay" className="w-full aspect-video object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
