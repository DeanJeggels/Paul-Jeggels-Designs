import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Phone, Instagram, MapPin, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

const N8N_WEBHOOK = 'https://n8n-uq4a.onrender.com/webhook/pjd-new-lead';

const INTERESTS = [
  { value: 'custom', label: 'Custom Surfboard' },
  { value: 'repair', label: 'Ding Repair' },
  { value: 'stock', label: 'Stock Board Enquiry' },
  { value: 'fins', label: 'Fin Manufacturing' },
  { value: 'general', label: 'General Enquiry' },
];

const BOARD_TYPES = [
  { value: 'shortboard', label: 'Shortboard' },
  { value: 'fish', label: 'Fish' },
  { value: 'hybrid', label: 'Hybrid / Mullet' },
  { value: 'longboard', label: 'Longboard' },
  { value: 'other', label: 'Other / Not Sure' },
];

const WAVE_TYPES = [
  { value: 'beach_break', label: 'Beach Break' },
  { value: 'reef', label: 'Reef Break' },
  { value: 'point_break', label: 'Point Break' },
  { value: 'all', label: 'All Conditions' },
];

const BUDGETS = [
  { value: 'under_5k', label: 'Under R5,000' },
  { value: '5k_10k', label: 'R5,000 – R10,000' },
  { value: '10k_15k', label: 'R10,000 – R15,000' },
  { value: '15k_plus', label: 'R15,000+' },
  { value: 'not_sure', label: 'Not sure yet' },
];

const InputField = ({ label, required, children }) => (
  <div>
    <label className="block text-white/70 text-xs font-bold tracking-widest uppercase mb-2">
      {label}{required && <span className="text-pjd-gold ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3 text-sm focus:outline-none focus:border-pjd-gold transition-colors';

const selectClass =
  'w-full bg-pjd-blue border border-white/15 text-white px-4 py-3 text-sm focus:outline-none focus:border-pjd-gold transition-colors appearance-none';

const Contact = () => {
  const location = useLocation();
  const prefillInterest = location.state?.interest || 'custom';
  const prefillBoardName = location.state?.boardName || '';

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    interest: prefillInterest,
    board_type: '',
    height_cm: '',
    weight_kg: '',
    wave_type: '',
    budget: '',
    message: prefillBoardName ? `I'm interested in: ${prefillBoardName}` : '',
  });

  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      // Insert into Supabase
      const { data, error } = await supabase
        .from('pjd_leads')
        .insert([{ ...form, source: 'website' }])
        .select();

      if (error) throw new Error(error.message);

      // Trigger n8n webhook for notification
      try {
        await fetch(N8N_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, id: data?.[0]?.id }),
        });
      } catch {
        // Webhook failure is non-blocking — lead is already in Supabase
      }

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong. Please try again or call Paul directly.');
    }
  };

  const showDimensions = form.interest === 'custom';

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-pjd-blue pt-24 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-pjd-gold mx-auto mb-6" />
          <h2 className="text-4xl font-black text-white mb-4">You're On Paul's Radar.</h2>
          <p className="text-white/60 leading-relaxed mb-8">
            Paul will get back to you within 24 hours. If it's urgent, give him a call on{' '}
            <a href="tel:+27829609353" className="text-pjd-gold hover:underline">+27 82 960 9353</a>.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-black px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pjd-blue pt-24">

      {/* Header */}
      <div
        className="relative py-24 overflow-hidden"
        style={{ backgroundImage: "url('/images/paul_jeggels_surfboard_3.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-pjd-blue/85" />
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-4">Get in Touch</p>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight max-w-3xl">
            Ready for Your<br />Best Session Yet?
          </h1>
          <p className="text-white/55 max-w-xl mt-6 leading-relaxed">
            Fill in the form and Paul will get back to you within 24 hours. He'll ask the right questions to make sure your board is exactly what you need.
          </p>
        </div>
      </div>

      {/* Form + Contact info */}
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-3 gap-16">

        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Interest */}
            <InputField label="What are you after?" required>
              <select className={selectClass} value={form.interest} onChange={set('interest')} required>
                {INTERESTS.map((i) => (
                  <option key={i.value} value={i.value}>{i.label}</option>
                ))}
              </select>
            </InputField>

            {/* Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Your Name" required>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="John Smith"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </InputField>
              <InputField label="Email Address" required>
                <input
                  type="email"
                  className={inputClass}
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </InputField>
            </div>

            {/* Phone */}
            <InputField label="Phone Number">
              <input
                type="tel"
                className={inputClass}
                placeholder="+27 82 000 0000"
                value={form.phone}
                onChange={set('phone')}
              />
            </InputField>

            {/* Custom board fields */}
            {showDimensions && (
              <>
                <InputField label="Board Type">
                  <select className={selectClass} value={form.board_type} onChange={set('board_type')}>
                    <option value="">Select board type</option>
                    {BOARD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </InputField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Your Height">
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 180cm or 5ft 11in"
                      value={form.height_cm}
                      onChange={set('height_cm')}
                    />
                  </InputField>
                  <InputField label="Your Weight">
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="e.g. 75kg / 165lbs"
                      value={form.weight_kg}
                      onChange={set('weight_kg')}
                    />
                  </InputField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField label="Wave Type">
                    <select className={selectClass} value={form.wave_type} onChange={set('wave_type')}>
                      <option value="">Select wave type</option>
                      {WAVE_TYPES.map((w) => (
                        <option key={w.value} value={w.value}>{w.label}</option>
                      ))}
                    </select>
                  </InputField>
                  <InputField label="Budget (approx.)">
                    <select className={selectClass} value={form.budget} onChange={set('budget')}>
                      <option value="">Select budget range</option>
                      {BUDGETS.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </InputField>
                </div>
              </>
            )}

            {/* Message */}
            <InputField label="Message / Any Other Details">
              <textarea
                className={`${inputClass} resize-none h-36`}
                placeholder="Tell Paul anything else that's relevant — your surfing level, local break, any specific design ideas..."
                value={form.message}
                onChange={set('message')}
              />
            </InputField>

            {/* Error */}
            {status === 'error' && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex items-center justify-center gap-3 bg-pjd-gold text-pjd-blue font-black px-8 py-5 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" /> Sending...
                </>
              ) : (
                'Send Enquiry'
              )}
            </button>

          </form>
        </div>

        {/* Contact info sidebar */}
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-6">Direct Contact</p>
            <div className="flex flex-col gap-5">
              <a
                href="tel:+27829609353"
                className="flex items-center gap-4 text-white/70 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 bg-pjd-gold flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-pjd-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-0.5">Phone</p>
                  <p className="font-bold text-sm">+27 82 960 9353</p>
                </div>
              </a>
              <a
                href="https://www.instagram.com/pauljeggelsdesigns"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-white/70 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 bg-pjd-gold flex items-center justify-center shrink-0">
                  <Instagram className="w-4 h-4 text-pjd-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-0.5">Instagram</p>
                  <p className="font-bold text-sm">@pauljeggelsdesigns</p>
                </div>
              </a>
              <div className="flex items-start gap-4 text-white/70">
                <div className="w-10 h-10 bg-pjd-gold flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-pjd-blue" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-white/40 mb-0.5">Workshop</p>
                  <p className="font-bold text-sm leading-relaxed">
                    15 Dageraad Street<br />Jeffreys Bay 6330
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8">
            <p className="text-white/40 text-xs leading-relaxed">
              Paul aims to respond within 24 hours. For urgent requests, call directly. Lead times on custom boards are typically 1–3 weeks depending on demand.
            </p>
          </div>

          <div>
            <img
              src="/images/paul_jeggels_shaping_6.jpg"
              alt="Paul in the shaping bay"
              className="w-full aspect-video object-cover"
            />
          </div>

        </div>
      </div>

    </div>
  );
};

export default Contact;
