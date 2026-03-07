import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'How much does a custom board cost?',
    answer: "Custom boards typically range from R5,000 to R15,000+ depending on size, materials, and design. Paul will give you an exact quote after chatting about what you need — no obligation.",
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
      aria-expanded={isOpen}
    >
      <span className="text-white font-bold text-base md:text-lg pr-4 group-hover:text-pjd-gold transition-colors font-body">
        {question}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-pjd-gold shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48 pb-6' : 'max-h-0'}`}
    >
      <p className="text-white/55 leading-relaxed text-sm md:text-base font-body">{answer}</p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-pjd-blue py-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-pjd-gold text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center font-body">
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
