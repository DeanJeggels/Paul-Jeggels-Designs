import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, Loader, AlertCircle } from 'lucide-react';

const SUBMIT_LEAD_URL = 'https://dplbfhwqbmnzmrncxain.supabase.co/functions/v1/submit-lead';

const QUESTIONS = [
  {
    id: 'experience',
    question: 'How long have you been surfing?',
    options: [
      { value: 'beginner', label: 'Just starting out', description: 'Less than a year in the water' },
      { value: 'intermediate', label: 'A few years', description: 'Comfortable catching waves and turning' },
      { value: 'experienced', label: 'Most of my life', description: 'Confident in all conditions' },
    ],
  },
  {
    id: 'waves',
    question: 'Where do you usually surf?',
    options: [
      { value: 'beach', label: 'Beach breaks', description: 'Sandy bottom, varied waves' },
      { value: 'point', label: 'Point or reef breaks', description: 'Longer, more powerful waves' },
      { value: 'all', label: 'A bit of everything', description: 'Wherever the swell is' },
    ],
  },
  {
    id: 'style',
    question: 'What matters most to you in a board?',
    options: [
      { value: 'stability', label: 'Easy paddling & stability', description: 'Catches waves easily, feels steady' },
      { value: 'speed', label: 'Speed & sharp turns', description: 'Responsive, quick off the mark' },
      { value: 'flow', label: 'Smooth, flowing style', description: 'Cruisy lines and relaxed surfing' },
    ],
  },
];

const BOARD_RECOMMENDATIONS = {
  shortboard: {
    name: 'Shortboard',
    image: '/images/paul_jeggels_design_4.jpg',
    description: 'Fast, responsive, and built for powerful surfing. Perfect for your experience level and the waves you ride.',
  },
  fish: {
    name: 'Fish',
    image: '/images/paul_jeggels_design_7.jpg',
    description: 'Quick and loose with great paddle power. Ideal for getting the most out of smaller waves while keeping things fun.',
  },
  longboard: {
    name: 'Longboard',
    image: '/images/paul_jeggels_design_13.jpg',
    description: 'Smooth, stable, and built for flowing turns. Catches everything and makes small days feel incredible.',
  },
};

function getRecommendation(answers) {
  const { experience, waves, style } = answers;

  if (experience === 'beginner') {
    if (style === 'speed') return 'fish';
    return 'longboard';
  }
  if (experience === 'intermediate') {
    if (style === 'speed') return waves === 'beach' ? 'fish' : 'shortboard';
    if (style === 'flow') return 'fish';
    return 'fish';
  }
  // experienced
  if (style === 'speed') return 'shortboard';
  if (style === 'flow') return 'fish';
  if (waves === 'beach') return 'fish';
  return 'shortboard';
}

const BoardQuiz = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [body, setBody] = useState({ height: '', weight: '' });
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const totalSteps = QUESTIONS.length + 2;
  const progress = ((step + 1) / totalSteps) * 100;

  const selectAnswer = (questionId, value) => {
    setAnswers((a) => ({ ...a, [questionId]: value }));
    setTimeout(() => setStep((s) => s + 1), 300);
  };

  const recommendation = step >= QUESTIONS.length ? getRecommendation(answers) : null;
  const board = recommendation ? BOARD_RECOMMENDATIONS[recommendation] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      interest: 'custom',
      board_type: recommendation,
      height_cm: body.height,
      weight_kg: body.weight,
      wave_type: answers.waves === 'beach' ? 'beach_break' : answers.waves === 'point' ? 'point_break' : 'all',
      message: `Quiz result: ${board.name}. Experience: ${answers.experience}. Style preference: ${answers.style}.`,
      source: 'website_quiz',
    };

    try {
      const res = await fetch(SUBMIT_LEAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Something went wrong.');
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true" aria-label="Board finder quiz">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-pjd-dark w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border border-white/10">

        {/* Header */}
        <div className="sticky top-0 bg-pjd-dark z-10 p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg font-display">Find Your Perfect Board</h2>
            <button onClick={onClose} className="p-2 hover:bg-pjd-cream/10 rounded-full transition-colors cursor-pointer" aria-label="Close quiz">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-pjd-teal transition-all duration-500 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="p-6 md:p-8">

          {/* Question screens */}
          {step < QUESTIONS.length && (
            <div>
              {step > 0 && (
                <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1 text-white/40 text-sm mb-6 hover:text-white transition-colors cursor-pointer font-body">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 font-display">
                {QUESTIONS[step].question}
              </h3>
              <div className="flex flex-col gap-3">
                {QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => selectAnswer(QUESTIONS[step].id, opt.value)}
                    className={`text-left p-5 border rounded-lg transition-all cursor-pointer ${
                      answers[QUESTIONS[step].id] === opt.value
                        ? 'border-pjd-teal bg-pjd-teal/10'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <p className="text-white font-bold font-body">{opt.label}</p>
                    <p className="text-white/40 text-sm mt-1 font-body">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Body measurements screen */}
          {step === QUESTIONS.length && (
            <div>
              <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1 text-white/40 text-sm mb-6 hover:text-white transition-colors cursor-pointer font-body">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
                Almost there — your height and weight
              </h3>
              <p className="text-white/40 text-sm mb-8 font-body">
                This helps Paul size the board perfectly for you. Rough estimates are fine.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2 font-body">Height</label>
                  <input
                    type="text"
                    placeholder="e.g. 180cm or 5'11"
                    value={body.height}
                    onChange={(e) => setBody((b) => ({ ...b, height: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-teal transition-colors font-body"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2 font-body">Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 75kg or 165lbs"
                    value={body.weight}
                    onChange={(e) => setBody((b) => ({ ...b, weight: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-teal transition-colors font-body"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep((s) => s + 1)}
                className="w-full flex items-center justify-center gap-2 bg-pjd-teal text-pjd-cream font-bold py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors cursor-pointer rounded-lg font-body"
              >
                See My Recommendation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Result screen */}
          {step === QUESTIONS.length + 1 && board && (
            <div>
              {status === 'success' ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-14 h-14 text-pjd-teal mx-auto mb-5" />
                  <h3 className="text-2xl font-bold text-white mb-3 font-display">You're On Paul's Radar.</h3>
                  <p className="text-white/55 leading-relaxed mb-6 font-body">
                    Paul will get back to you within 24 hours with a quote for your {board.name}.
                  </p>
                  <button onClick={onClose} className="bg-pjd-teal text-pjd-cream font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors cursor-pointer rounded-lg font-body">
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <p className="text-pjd-teal text-xs font-bold tracking-[0.2em] uppercase mb-3 font-body">Paul recommends</p>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">{board.name}</h3>
                  </div>
                  <div className="aspect-[16/9] mb-6 overflow-hidden rounded-lg">
                    <img src={board.image} alt={board.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white/60 leading-relaxed mb-8 font-body">{board.description}</p>
                  <p className="text-white/40 text-sm mb-6 font-body">
                    Paul will dial in the exact size and shape for you. Enter your details to get a free quote.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        required
                        className="bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-teal transition-colors font-body"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                        className="bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-teal transition-colors font-body"
                      />
                      <input
                        type="tel"
                        placeholder="Phone number"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className="bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-teal transition-colors sm:col-span-2 font-body"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-start gap-2 text-red-400 text-sm font-body">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-3 bg-pjd-teal text-pjd-cream font-bold py-4 text-sm tracking-widest uppercase hover:bg-pjd-cream transition-colors disabled:opacity-50 cursor-pointer rounded-lg font-body"
                    >
                      {status === 'loading' ? (
                        <><Loader className="w-4 h-4 animate-spin" /> Sending...</>
                      ) : (
                        <>Get My Free Quote <ArrowRight className="w-4 h-4" /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BoardQuiz;
