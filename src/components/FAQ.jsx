import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/faqs';

const FAQItem = ({ question, answer, isOpen, onToggle }) => (
  <div className="border-b border-pjd-dark/10">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-6 text-left group cursor-pointer"
      aria-expanded={isOpen}
    >
      <span className="text-pjd-dark font-bold text-base md:text-lg pr-4 group-hover:text-pjd-teal transition-colors font-body">
        {question}
      </span>
      <ChevronDown
        className={`w-5 h-5 text-pjd-teal shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
    >
      <p className="text-pjd-stone leading-relaxed text-sm md:text-base font-body">{answer}</p>
    </div>
  </div>
);

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-pjd-cream py-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-pjd-teal-ink text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center font-body">
          Common Questions
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-pjd-dark text-center mb-14 font-display">
          Everything You Need to Know
        </h2>

        <div className="border-t border-pjd-dark/10">
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
