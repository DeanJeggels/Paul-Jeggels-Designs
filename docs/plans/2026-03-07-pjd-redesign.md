# PJD Website Redesign — Quiz-Led, Trust-Rich, AI-Assisted

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign PJD website to convert more visitors into leads by adding trust elements (testimonials, process, FAQ), a friendly board-finder quiz, and an AI chat assistant — all using plain, jargon-free language.

**Architecture:** React SPA with new homepage sections (HowItWorks, Testimonials, FAQ, BoardQuiz, ChatAssistant, InlineContactForm) integrated into the existing page flow. AI chat uses Supabase pgvector for RAG + Claude API via Edge Function. Quiz uses simple mapping logic to recommend board types and captures leads to existing `pjd_leads` table.

**Tech Stack:** React 19, Vite, Tailwind CSS v4, Supabase (pgvector, Edge Functions), Claude API, Lucide React icons. Typography upgrade: Bodoni Moda (headlines) + Jost (body). Existing navy/gold palette retained.

**Design System:** Generated via UI/UX Pro Max. See `design-system/paul-jeggels-designs/MASTER.md`.

---

## Task 1: Typography & Design System Upgrade

**Files:**
- Modify: `src/index.css`
- Modify: `index.html` (Google Fonts preconnect)

**Step 1: Add Google Fonts to index.html**

Add preconnect and font imports to `<head>` in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700;800;900&family=Jost:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

**Step 2: Update Tailwind theme in index.css**

```css
@import "tailwindcss";

@theme {
  --color-pjd-blue: #0a192f;
  --color-pjd-white: #e6f1ff;
  --color-pjd-gold: #ffd700;
  --color-pjd-gold-dark: #CA8A04;
  --font-display: 'Bodoni Moda', serif;
  --font-body: 'Jost', sans-serif;
}

@layer base {
  body {
    @apply bg-pjd-blue text-pjd-white font-body antialiased;
  }
  h1, h2, h3 {
    font-family: var(--font-display);
  }
}
```

**Step 3: Verify fonts load**

Run: `npm run dev`
Check: Headlines render in Bodoni Moda (serif), body text in Jost (sans-serif).

**Step 4: Commit**

```bash
git add index.html src/index.css
git commit -m "style: upgrade typography to Bodoni Moda + Jost, add gold-dark accent"
```

---

## Task 2: HowItWorks Component

**Files:**
- Create: `src/components/HowItWorks.jsx`

**Step 1: Create the component**

```jsx
import React from 'react';
import { MessageCircle, Phone, Hammer, Truck } from 'lucide-react';

const STEPS = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'Tell Us About Your Surfing',
    description: 'Take our 60-second quiz or ask a question. No technical knowledge needed.',
  },
  {
    icon: Phone,
    number: '02',
    title: 'Paul Calls You',
    description: 'He\'ll chat about your surfing, your local waves, and what you want from your board.',
  },
  {
    icon: Hammer,
    number: '03',
    title: 'Your Board Is Hand-Shaped',
    description: 'Paul shapes your board by hand in his J-Bay workshop. Usually 1\u20133 weeks.',
  },
  {
    icon: Truck,
    number: '04',
    title: 'Pick Up or Delivery',
    description: 'Collect from the workshop in Jeffreys Bay or get it delivered to your door.',
  },
];

const HowItWorks = () => (
  <section className="bg-pjd-blue py-20 border-y border-white/10">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center">
        How It Works
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-16 font-display">
        From First Chat to First Session
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {STEPS.map(({ icon: Icon, number, title, description }) => (
          <div key={number} className="relative text-center group">
            <div className="w-14 h-14 bg-pjd-gold/10 border border-pjd-gold/30 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-pjd-gold/20 transition-colors">
              <Icon className="w-6 h-6 text-pjd-gold" />
            </div>
            <span className="text-pjd-gold/40 text-xs font-bold tracking-widest uppercase">{number}</span>
            <h3 className="text-white font-bold text-lg mt-2 mb-3 font-display">{title}</h3>
            <p className="text-white/50 text-sm leading-relaxed">{description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
```

**Step 2: Verify in isolation**

Temporarily import into Home.jsx after ServicesStrip to confirm it renders. Check mobile (375px) and desktop (1440px).

**Step 3: Commit**

```bash
git add src/components/HowItWorks.jsx
git commit -m "feat: add HowItWorks process section component"
```

---

## Task 3: Testimonials Component

**Files:**
- Create: `src/components/Testimonials.jsx`

**Step 1: Create the component**

```jsx
import React from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: "Paul shaped a board perfectly suited to my surfing. I've never had anything that paddles this well in J-Bay conditions.",
    name: 'Customer Name',
    location: 'Jeffreys Bay',
    image: '/images/paul_jeggels_customer_1.jpg',
  },
  {
    quote: "I had no idea what I needed. Paul asked me a few questions, and two weeks later I had the best board I've ever owned.",
    name: 'Customer Name',
    location: 'Cape Town',
    image: '/images/paul_jeggels_customer_2.jpg',
  },
  {
    quote: "Third board from Paul now. Each one better than the last. He remembers exactly what I ride and keeps improving on it.",
    name: 'Customer Name',
    location: 'Port Elizabeth',
    image: '/images/paul_jeggels_customer_3.jpg',
  },
];

const Testimonials = () => (
  <section className="bg-pjd-gold py-20">
    <div className="max-w-7xl mx-auto px-6">
      <p className="text-pjd-blue/60 text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center">
        What Surfers Say
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-pjd-blue text-center mb-14 font-display">
        4,000+ Boards. Here's What They Think.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map(({ quote, name, location, image }, i) => (
          <div
            key={i}
            className="bg-white/20 backdrop-blur-sm border border-white/30 p-8 flex flex-col"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="w-4 h-4 fill-pjd-blue text-pjd-blue" />
              ))}
            </div>
            <p className="text-pjd-blue/80 leading-relaxed flex-1 italic mb-6">"{quote}"</p>
            <div className="flex items-center gap-3 pt-4 border-t border-pjd-blue/10">
              <img
                src={image}
                alt={name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-pjd-blue font-bold text-sm">{name}</p>
                <p className="text-pjd-blue/50 text-xs">{location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
```

**Step 2: Verify renders on gold background with good contrast**

**Step 3: Commit**

```bash
git add src/components/Testimonials.jsx
git commit -m "feat: add Testimonials social proof component"
```

---

## Task 4: FAQ Component

**Files:**
- Create: `src/components/FAQ.jsx`

**Step 1: Create the component**

```jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'How much does a custom board cost?',
    answer: 'Custom boards typically range from R5,000 to R15,000+ depending on size, materials, and design. Paul will give you an exact quote after chatting about what you need — no obligation.',
  },
  {
    question: "I'm a beginner — can I get a custom board?",
    answer: "Absolutely. Some of Paul's most popular boards are shaped for newer surfers. A board built for your size and ability will help you improve faster than anything off the rack. Take the quiz and Paul will guide you.",
  },
  {
    question: 'How long does it take?',
    answer: "From your first chat with Paul to a finished board, it's usually 1 to 3 weeks depending on how busy the workshop is. Paul will give you a timeline when you get in touch.",
  },
  {
    question: "What if I don't know what size or type I need?",
    answer: "That's completely normal — and exactly what Paul is here for. Take the 60-second quiz on this page, or just send Paul a message. He'll ask the right questions to figure out what suits you best.",
  },
  {
    question: 'Can I visit the workshop?',
    answer: "Yes — Paul's workshop is at 15 Dageraad Street, Jeffreys Bay. You're welcome to come by, see the process, and chat in person. Just give him a call first to make sure he's in.",
  },
  {
    question: 'Do you ship boards?',
    answer: 'Yes. Paul can arrange delivery anywhere in South Africa. Shipping cost depends on your location. Pick-up from J-Bay is always free.',
  },
];

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-white/10">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-6 text-left group cursor-pointer"
    >
      <span className="text-white font-bold text-base md:text-lg pr-4 group-hover:text-pjd-gold transition-colors">
        {question}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-pjd-gold shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-6' : 'max-h-0'}`}
    >
      <p className="text-white/55 leading-relaxed text-sm md:text-base">{answer}</p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-pjd-blue py-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center">
          Common Questions
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-14 font-display">
          Everything You Need to Know
        </h2>

        <div className="border-t border-white/10">
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
```

**Step 2: Verify accordion opens/closes, check mobile layout**

**Step 3: Commit**

```bash
git add src/components/FAQ.jsx
git commit -m "feat: add FAQ accordion component with jargon-free answers"
```

---

## Task 5: InlineContactForm Component

**Files:**
- Create: `src/components/InlineContactForm.jsx`

**Step 1: Create the component**

Uses the same Supabase insert + n8n webhook pattern from `src/pages/Contact.jsx`.

```jsx
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
          <p className="text-white/55 leading-relaxed">
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
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center">
          Not ready for the quiz?
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4 font-display">
          Still Thinking? Just Ask.
        </h2>
        <p className="text-white/50 text-center mb-10 max-w-lg mx-auto">
          Send Paul a quick message. No commitment, no pressure. He'll get back to you within 24 hours.
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={set('name')}
            required
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors"
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={set('email')}
            required
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors"
          />
          <select
            value={form.interest}
            onChange={set('interest')}
            className="bg-pjd-blue border border-white/15 text-white px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors appearance-none sm:col-span-2"
          >
            {INTERESTS.map((i) => (
              <option key={i.value} value={i.value}>{i.label}</option>
            ))}
          </select>
          <textarea
            placeholder="What's on your mind?"
            value={form.message}
            onChange={set('message')}
            className="bg-white/5 border border-white/15 text-white placeholder-white/30 px-4 py-3.5 text-sm focus:outline-none focus:border-pjd-gold transition-colors resize-none h-24 sm:col-span-2"
          />

          {status === 'error' && (
            <div className="flex items-start gap-2 text-red-400 text-sm sm:col-span-2">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="sm:col-span-2 flex items-center justify-center gap-3 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 cursor-pointer"
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
```

**Step 2: Verify form submits correctly — check Supabase `pjd_leads` table for new row**

**Step 3: Commit**

```bash
git add src/components/InlineContactForm.jsx
git commit -m "feat: add InlineContactForm component for homepage CTA"
```

---

## Task 6: Board Quiz Component

**Files:**
- Create: `src/components/BoardQuiz.jsx`

**Step 1: Create the quiz component**

This is the core conversion component. One question per screen, progress bar, recommendation result with lead capture.

```jsx
import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const N8N_WEBHOOK = 'https://n8n-uq4a.onrender.com/webhook/pjd-new-lead';

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
  hybrid: {
    name: 'Hybrid',
    image: '/images/paul_jeggels_design_10.jpg',
    description: 'The best of both worlds — paddles well, handles most conditions, and works for almost any surfer. A great daily board.',
  },
  longboard: {
    name: 'Longboard',
    image: '/images/paul_jeggels_design_13.jpg',
    description: 'Smooth, stable, and built for flowing turns. Catches everything and makes small days feel incredible.',
  },
};

function getRecommendation(answers) {
  const { experience, waves, style } = answers;

  // Beach break bias pushes toward Fish/Hybrid
  if (experience === 'beginner') {
    if (style === 'speed') return 'hybrid';
    return 'longboard';
  }
  if (experience === 'intermediate') {
    if (style === 'speed') return waves === 'beach' ? 'fish' : 'shortboard';
    if (style === 'flow') return 'fish';
    return 'hybrid';
  }
  // Experienced
  if (style === 'speed') return 'shortboard';
  if (style === 'flow') return 'fish';
  if (waves === 'beach') return 'fish';
  return 'hybrid';
}

const BoardQuiz = ({ onClose }) => {
  const [step, setStep] = useState(0); // 0-2 = questions, 3 = body, 4 = result
  const [answers, setAnswers] = useState({});
  const [body, setBody] = useState({ height: '', weight: '' });
  const [form, setForm] = useState({ name: '', email: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const totalSteps = QUESTIONS.length + 2; // questions + body + result
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
      interest: 'custom',
      board_type: recommendation,
      height_cm: body.height,
      weight_kg: body.weight,
      wave_type: answers.waves === 'beach' ? 'beach_break' : answers.waves === 'point' ? 'point_break' : 'all',
      message: `Quiz result: ${board.name}. Experience: ${answers.experience}. Style preference: ${answers.style}.`,
      source: 'website_quiz',
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
      } catch {}
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-pjd-blue w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl border border-white/10">

        {/* Header */}
        <div className="sticky top-0 bg-pjd-blue z-10 p-6 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg font-display">Find Your Perfect Board</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-pjd-gold transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="p-6 md:p-8">

          {/* Question screens */}
          {step < QUESTIONS.length && (
            <div>
              {step > 0 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1 text-white/40 text-sm mb-6 hover:text-white transition-colors cursor-pointer"
                >
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
                        ? 'border-pjd-gold bg-pjd-gold/10'
                        : 'border-white/10 hover:border-white/30 bg-white/5'
                    }`}
                  >
                    <p className="text-white font-bold">{opt.label}</p>
                    <p className="text-white/40 text-sm mt-1">{opt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Body measurements screen */}
          {step === QUESTIONS.length && (
            <div>
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1 text-white/40 text-sm mb-6 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 font-display">
                Almost there — your height and weight
              </h3>
              <p className="text-white/40 text-sm mb-8">
                This helps Paul size the board perfectly for you. Rough estimates are fine.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2">Height</label>
                  <input
                    type="text"
                    placeholder="e.g. 180cm or 5'11"
                    value={body.height}
                    onChange={(e) => setBody((b) => ({ ...b, height: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-bold tracking-widest uppercase mb-2">Weight</label>
                  <input
                    type="text"
                    placeholder="e.g. 75kg or 165lbs"
                    value={body.weight}
                    onChange={(e) => setBody((b) => ({ ...b, weight: e.target.value }))}
                    className="w-full bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-gold transition-colors"
                  />
                </div>
              </div>
              <button
                onClick={() => setStep((s) => s + 1)}
                className="w-full flex items-center justify-center gap-2 bg-pjd-gold text-pjd-blue font-bold py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors cursor-pointer rounded-lg"
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
                  <CheckCircle className="w-14 h-14 text-pjd-gold mx-auto mb-5" />
                  <h3 className="text-2xl font-bold text-white mb-3 font-display">You're On Paul's Radar.</h3>
                  <p className="text-white/55 leading-relaxed mb-6">
                    Paul will get back to you within 24 hours with a quote for your {board.name}.
                  </p>
                  <button
                    onClick={onClose}
                    className="bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors cursor-pointer rounded-lg"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <p className="text-pjd-gold text-xs font-bold tracking-[0.2em] uppercase mb-3">
                      Paul recommends
                    </p>
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">
                      {board.name}
                    </h3>
                  </div>
                  <div className="aspect-[16/9] mb-6 overflow-hidden rounded-lg">
                    <img
                      src={board.image}
                      alt={board.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-white/60 leading-relaxed mb-8">
                    {board.description}
                  </p>
                  <p className="text-white/40 text-sm mb-6">
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
                        className="bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-gold transition-colors"
                      />
                      <input
                        type="email"
                        placeholder="Email address"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                        className="bg-white/5 border border-white/15 text-white placeholder-white/25 px-4 py-3.5 text-sm rounded-lg focus:outline-none focus:border-pjd-gold transition-colors"
                      />
                    </div>

                    {status === 'error' && (
                      <div className="flex items-start gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full flex items-center justify-center gap-3 bg-pjd-gold text-pjd-blue font-bold py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors disabled:opacity-50 cursor-pointer rounded-lg"
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
```

**Step 2: Test quiz flow end-to-end**

1. Open quiz modal
2. Answer all 3 questions (verify auto-advance)
3. Enter height/weight
4. See recommendation (verify correct board type based on answers)
5. Submit name/email
6. Verify lead appears in Supabase `pjd_leads` with `source: 'website_quiz'`

**Step 3: Commit**

```bash
git add src/components/BoardQuiz.jsx
git commit -m "feat: add BoardQuiz component with recommendation logic and lead capture"
```

---

## Task 7: Redesign Hero + Integrate Homepage Sections

**Files:**
- Modify: `src/pages/Home.jsx`

**Step 1: Rewrite Home.jsx**

Replace the entire Home.jsx with the new section order. The Hero is redesigned with embedded chat input + quiz CTA. Import all new components.

Key changes to Hero:
- Remove NavCard grid (4 nav cards)
- Remove dual CTA block ("Custom Builder" + "Help Me Choose")
- Add AI chat input (initially as a styled placeholder that links to contact — will be connected to real AI in Task 9-10)
- Add "Find My Board" quiz button as primary gold CTA
- Add small "I already know my specs" link that opens CustomBuilder

New section order:
```
Hero → HowItWorks → Testimonials → GalleryTeaser → AboutTeaser → FAQ → InlineContactForm
```

Remove: `ServicesStrip` and `ProofStrip` from homepage (proof stats are now in testimonial headline, services are in navbar/services page).

Full replacement code for `Home.jsx`:

```jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ChevronDown } from 'lucide-react';
import CustomBuilder from '../components/CustomBuilder';
import BoardQuiz from '../components/BoardQuiz';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import InlineContactForm from '../components/InlineContactForm';

// ─── HERO ────────────────────────────────────────────────────────────────────

const Hero = ({ onOpenQuiz, onOpenBuilder }) => {
  const [chatInput, setChatInput] = useState('');

  const handleChatSubmit = (e) => {
    e.preventDefault();
    // Phase 1: redirect to contact with message pre-filled
    // Phase 2: will connect to AI chat assistant
    if (chatInput.trim()) {
      window.location.href = `/contact?message=${encodeURIComponent(chatInput)}`;
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-pjd-blue overflow-hidden flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/paul_jeggels_shaping_5.jpg"
          alt="Paul Jeggels shaping a surfboard"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-pjd-blue via-pjd-blue/60 to-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-16">
          <img
            src="/images/pjd_logo.jpeg"
            alt="PJD Logo"
            className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 shadow-lg object-contain bg-white"
          />
          <div className="hidden sm:block">
            <p className="text-white font-bold text-sm tracking-widest uppercase leading-none font-body">Paul Jeggels</p>
            <p className="text-pjd-gold text-xs tracking-widest uppercase leading-none font-body">Designs</p>
          </div>
        </div>

        {/* Headline */}
        <div className="max-w-3xl mb-10">
          <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-5 font-body">
            Hand-Shaped in Jeffreys Bay
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.95] font-display">
            The Board That<br />
            Actually Fits You.
          </h1>
          <p className="text-lg md:text-xl text-white/65 font-light max-w-xl leading-relaxed font-body">
            Tell us about your surfing. Paul will design your perfect board.
          </p>
        </div>

        {/* Chat input */}
        <form onSubmit={handleChatSubmit} className="max-w-xl mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
            <input
              type="text"
              placeholder="Ask anything about custom boards..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/35 pl-12 pr-4 py-4 text-base rounded-lg focus:outline-none focus:border-pjd-gold focus:bg-white/15 transition-all font-body"
            />
          </div>
        </form>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-3 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors group shadow-xl cursor-pointer rounded-lg font-body"
          >
            Find My Board <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={onOpenBuilder}
            className="text-white/50 text-sm font-bold tracking-widest uppercase hover:text-white transition-colors cursor-pointer font-body"
          >
            I already know my specs →
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/30" />
      </div>
    </section>
  );
};

// ─── GALLERY TEASER ───────────────────────────────────────────────────────────

const GalleryTeaser = ({ onOpenQuiz }) => {
  const images = [
    '/images/paul_jeggels_design_1.jpg',
    '/images/paul_jeggels_design_4.jpg',
    '/images/paul_jeggels_design_7.jpg',
    '/images/paul_jeggels_design_10.jpg',
    '/images/paul_jeggels_design_13.jpg',
    '/images/paul_jeggels_design_16.jpg',
  ];

  return (
    <section className="bg-pjd-blue py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3 font-body">The Work</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight font-display">
              Every Shape Has<br />a Story.
            </h2>
          </div>
          <Link
            to="/gallery"
            className="flex items-center gap-2 text-pjd-gold text-sm font-bold tracking-widest uppercase hover:text-white transition-colors group font-body"
          >
            View Full Gallery <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {images.map((src, i) => (
            <div key={i} className="aspect-square overflow-hidden group cursor-pointer">
              <img
                src={src}
                alt={`PJD surfboard design ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={onOpenQuiz}
            className="inline-flex items-center gap-2 text-pjd-gold text-sm font-bold tracking-widest uppercase hover:text-white transition-colors cursor-pointer font-body"
          >
            Want something like this? Take the quiz <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// ─── ABOUT TEASER ─────────────────────────────────────────────────────────────

const AboutTeaser = () => (
  <section className="bg-black py-24">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <div className="relative">
        <img
          src="/images/paul_jeggels_shaping_3.jpg"
          alt="Paul Jeggels in the shaping bay"
          className="w-full aspect-[4/5] object-cover"
        />
        <div className="absolute -bottom-4 -right-4 bg-pjd-gold px-6 py-4">
          <p className="text-pjd-blue font-bold text-xs tracking-widest uppercase leading-none font-body">As featured in</p>
          <p className="text-pjd-blue font-bold text-xl tracking-tight font-display">Zigzag Magazine</p>
        </div>
      </div>

      <div>
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-5 font-body">The Shaper</p>
        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6 font-display">
          Most Boards Are Built<br />
          for Everyone.<br />
          <span className="text-pjd-gold">Paul's Aren't.</span>
        </h2>
        <p className="text-white/60 leading-relaxed mb-4 font-body">
          For over 40 years, Paul Jeggels has been shaping surfboards from his workshop in Jeffreys Bay — one of the world's premier surf destinations. He knows every break in town and shapes every board himself.
        </p>
        <p className="text-white/60 leading-relaxed mb-10 font-body">
          No conveyor belt. No factory template. Just a craftsman who surfs what he makes, and makes it for the surfer standing in front of him.
        </p>
        <Link
          to="/about"
          className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors group cursor-pointer font-body"
        >
          Meet Paul <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </section>
);

// ─── PAGE EXPORT ──────────────────────────────────────────────────────────────

const Home = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  return (
    <>
      {isQuizOpen && <BoardQuiz onClose={() => setIsQuizOpen(false)} />}
      {isBuilderOpen && <CustomBuilder onClose={() => setIsBuilderOpen(false)} />}

      <Hero onOpenQuiz={() => setIsQuizOpen(true)} onOpenBuilder={() => setIsBuilderOpen(true)} />
      <HowItWorks />
      <Testimonials />
      <GalleryTeaser onOpenQuiz={() => setIsQuizOpen(true)} />
      <AboutTeaser />
      <FAQ />
      <InlineContactForm />
    </>
  );
};

export default Home;
```

**Step 2: Verify full homepage flow**

Run `npm run dev`, check:
- Hero renders with chat input + quiz CTA
- "Find My Board" opens quiz modal
- "I already know my specs" opens existing CustomBuilder
- All sections render in correct order
- Mobile responsive at 375px
- No console errors

**Step 3: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: redesign homepage with quiz CTA, chat input, trust sections"
```

---

## Task 8: Simplify Contact Page + Update Other Pages

**Files:**
- Modify: `src/pages/Contact.jsx`
- Modify: `src/pages/Stock.jsx`
- Modify: `src/pages/Gallery.jsx`
- Modify: `src/pages/Services.jsx`

**Step 1: Simplify Contact.jsx**

Remove the conditional dimension fields (board_type, height, weight, wave_type, budget). Keep only: name, email, phone, interest dropdown, message. The detailed spec form lives in CustomBuilder only.

Also handle the `?message=` query param from the hero chat input.

**Step 2: Add CTA to Stock.jsx**

At the bottom of the Stock page, after the board grid, add:

```jsx
<div className="text-center py-16 border-t border-white/10">
  <h3 className="text-2xl font-bold text-white mb-3 font-display">Can't Find What You're Looking For?</h3>
  <p className="text-white/50 mb-6 font-body">Paul can shape a board to your exact specs.</p>
  <Link
    to="/"
    className="inline-flex items-center gap-2 bg-pjd-gold text-pjd-blue font-bold px-8 py-4 text-sm tracking-widest uppercase hover:bg-white transition-colors cursor-pointer font-body"
  >
    Take the Board Quiz <ArrowRight className="w-4 h-4" />
  </Link>
</div>
```

**Step 3: Add micro-CTAs to Gallery.jsx**

After the image grid section, before the video section, add:

```jsx
<div className="text-center py-8">
  <Link
    to="/"
    className="inline-flex items-center gap-2 text-pjd-gold text-sm font-bold tracking-widest uppercase hover:text-white transition-colors font-body"
  >
    Like what you see? Find your perfect board <ArrowRight className="w-4 h-4" />
  </Link>
</div>
```

**Step 4: Add pricing hints to Services.jsx**

Add a small price indicator under each service title. For Custom Surfboards: "From R5,000". For Ding Repair: "From R500". For Fins: "From R800". For Second-Hand: "Prices vary".

**Step 5: Verify all pages**

- Contact: simplified form submits to Supabase
- Stock: CTA appears at bottom
- Gallery: micro-CTA visible between sections
- Services: pricing ranges display

**Step 6: Commit**

```bash
git add src/pages/Contact.jsx src/pages/Stock.jsx src/pages/Gallery.jsx src/pages/Services.jsx
git commit -m "feat: simplify contact form, add cross-page CTAs and pricing hints"
```

---

## Task 9: AI Chat Backend — Supabase pgvector + Edge Function

**Files:**
- Create: `supabase/functions/chat/index.ts`
- Create: `scripts/seed-knowledge-base.js`

**Step 1: Create knowledge base table in Supabase**

Using Supabase MCP or SQL:

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Knowledge base table
CREATE TABLE pjd_knowledge_base (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  embedding VECTOR(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for similarity search
CREATE INDEX ON pjd_knowledge_base USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- RLS: allow public read
ALTER TABLE pjd_knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON pjd_knowledge_base FOR SELECT USING (true);
```

**Step 2: Create the seed script**

`scripts/seed-knowledge-base.js` — Populates the knowledge base with Paul's content. Each chunk is a short, self-contained piece of information:

- Board types and descriptions (plain language)
- Pricing ranges
- Process and timeline info
- Paul's background
- FAQ answers
- Contact and location details
- Materials explained simply

The script uses the Supabase client to insert rows. Embeddings will be generated via a Supabase Edge Function or external call.

**Step 3: Create the Edge Function**

`supabase/functions/chat/index.ts`:

```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SYSTEM_PROMPT = `You are a friendly assistant for Paul Jeggels Designs, a custom surfboard shaper in Jeffreys Bay, South Africa. Paul has been shaping boards for over 40 years.

Your personality:
- Friendly, warm, like a knowledgeable surf shop assistant
- Use plain language — no technical jargon unless the visitor uses it first
- If you're not sure about something, say "Paul can answer that better — want me to connect you?"
- You can suggest the board quiz: "Want help finding your perfect board? Try our quick quiz on the homepage"
- When someone seems ready to order, suggest they leave their details so Paul can reach out

Keep responses concise — 2-3 sentences max unless they ask for detail.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { message, history } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY')! })

  // Generate embedding for the user's message
  // (Using a separate embedding call or Supabase's built-in)
  // For now, do keyword-based search as fallback
  const { data: context } = await supabase
    .from('pjd_knowledge_base')
    .select('content, category')
    .textSearch('content', message.split(' ').slice(0, 5).join(' | '))
    .limit(5)

  const contextText = context?.map(c => c.content).join('\n\n') || ''

  const messages = [
    ...(history || []),
    { role: 'user', content: message }
  ]

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    system: `${SYSTEM_PROMPT}\n\nRelevant information about PJD:\n${contextText}`,
    messages,
  })

  return new Response(
    JSON.stringify({ reply: response.content[0].text }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
```

**Step 4: Deploy edge function and test**

```bash
supabase functions deploy chat
```

Test with curl:
```bash
curl -X POST 'https://dplbfhwqbmnzmrncxain.supabase.co/functions/v1/chat' \
  -H 'Authorization: Bearer <anon-key>' \
  -H 'Content-Type: application/json' \
  -d '{"message": "How much does a custom board cost?"}'
```

**Step 5: Commit**

```bash
git add supabase/functions/chat/index.ts scripts/seed-knowledge-base.js
git commit -m "feat: add AI chat edge function with knowledge base RAG"
```

---

## Task 10: AI Chat Frontend Component

**Files:**
- Create: `src/components/ChatAssistant.jsx`
- Modify: `src/pages/Home.jsx` (replace placeholder chat input with real ChatAssistant)

**Step 1: Create ChatAssistant.jsx**

An embedded chat panel in the hero that expands when the user starts typing. Shows conversation history, streams responses, and can capture leads inline.

Key features:
- Starts as a simple input (same as current hero placeholder)
- Expands into a chat panel when user sends first message
- Shows typing indicator while waiting for response
- Has a "Talk to Paul" button that shows inline lead capture
- Conversation history maintained in state
- Calls the Supabase Edge Function from Task 9

**Step 2: Replace hero chat input in Home.jsx**

Swap the static form in the Hero component with `<ChatAssistant />`.

**Step 3: Test conversation flow**

1. Type a question in the hero chat
2. Verify response appears from Claude
3. Ask follow-up question
4. Verify conversation context is maintained
5. Click "Talk to Paul" → verify lead form appears

**Step 4: Commit**

```bash
git add src/components/ChatAssistant.jsx src/pages/Home.jsx
git commit -m "feat: add AI chat assistant embedded in hero section"
```

---

## Task 11: Polish & Accessibility

**Files:**
- Various components

**Step 1: Responsive testing**

Check all new components at:
- 375px (mobile)
- 768px (tablet)
- 1024px (laptop)
- 1440px (desktop)

Fix any overflow, text sizing, or layout issues.

**Step 2: Accessibility audit**

- All images have descriptive alt text
- Form inputs have proper labels (not just placeholders)
- Focus states visible on all interactive elements
- Quiz modal traps focus properly
- Color contrast meets 4.5:1 minimum
- `prefers-reduced-motion` respected for animations

**Step 3: Performance**

- Add `loading="lazy"` to below-fold images
- Verify Google Fonts load with `display=swap`
- Check no layout shift from async content

**Step 4: Final commit**

```bash
git add -A
git commit -m "polish: responsive fixes, accessibility improvements, performance optimizations"
```

---

## Verification Checklist

1. `npm run dev` — Site loads without errors on all 6 routes
2. **Quiz flow:** Complete quiz → correct board recommendation → submit lead → verify in Supabase `pjd_leads` (source: `website_quiz`)
3. **Chat:** Type question in hero → get relevant AI response → lead capture works
4. **Contact form:** Simplified 3-field form submits correctly → Supabase + n8n webhook
5. **Inline form:** Homepage bottom form submits → Supabase (source: `website_inline`)
6. **CustomBuilder:** Still accessible via "I already know my specs" → works as before
7. **Cross-page CTAs:** Stock page bottom CTA → Gallery CTA → Services pricing visible
8. **Mobile:** All sections render correctly at 375px
9. **Typography:** Bodoni Moda on headlines, Jost on body text
10. **Lighthouse:** Run accessibility audit — aim for 90+ score
