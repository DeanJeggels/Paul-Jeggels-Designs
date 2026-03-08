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
    answer: "From your first chat with Paul to a finished board, it's usually 2 to 4 weeks depending on how busy the workshop is. Paul will give you a timeline when you get in touch.",
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
  {
    question: "What's the difference between a custom and off-the-rack board?",
    answer: "An off-the-rack board is designed for a generic surfer at a generic weight. A custom board is shaped specifically for your body, your ability, and the waves you actually ride. Paul asks about your height, weight, fitness, local break, and surfing goals — then shapes a board that fits you perfectly. It's the difference between tailored and off-the-shelf.",
  },
  {
    question: 'What types of surfboards does Paul shape?',
    answer: "Paul shapes everything from shortboards, fish, and hybrids to mid-lengths and longboards. He also builds custom fins. Whether you need a high-performance shortboard for Supertubes or a cruisy longboard for mellow beach breaks, Paul shapes it by hand in his Jeffreys Bay workshop.",
  },
  {
    question: 'How are Paul\'s surfboards made?',
    answer: "Every board starts as a polyurethane blank (Clark or Burford). Paul hand-shapes it using planers, surforms, and sanding blocks — no CNC machines. The shaped blank is then laminated with fibreglass and resin, sanded smooth, and finished with a gloss or satin coat. The entire process is done by hand in J-Bay.",
  },
  {
    question: "What's the difference between a fish, shortboard, and longboard?",
    answer: "A shortboard (5'6–6'6) is built for speed, sharp turns, and powerful surfing — best for experienced surfers. A fish (5'4–6'2) is wider and flatter, quick and loose in smaller waves — great for intermediate to advanced surfers. A longboard (8'0–10'0) offers maximum stability and wave-catching — perfect for beginners and anyone who loves a cruisy style.",
  },
  {
    question: 'What board is best for surfing Jeffreys Bay?',
    answer: "J-Bay's long, fast, hollow right-handers need a board with good speed, a responsive tail for linking turns, and enough volume to paddle in early. Paul has surfed every break in J-Bay for over 40 years, so he knows exactly what works — whether you're riding Supertubes, Kitchen Windows, or Point.",
  },
  {
    question: 'Do custom boards come with a warranty?',
    answer: "Paul stands behind his work. If there's a manufacturing defect, he'll sort it out. Normal wear and tear — dings, pressure dents from surfing — isn't covered, but Paul offers ding repairs from R500. A well-cared-for custom board lasts years.",
  },
  {
    question: 'Can I choose my own design or artwork?',
    answer: "Yes. Paul does colour tints, resin swirls, and can arrange airbrushed designs. Bring your idea — a logo, a colour scheme, a pattern — and he'll work it in. Simple tints are included or minimal extra cost. Detailed airbrush work may add to the price depending on complexity.",
  },
  {
    question: 'What fin system should I choose — FCS or Futures?',
    answer: "Both are excellent systems. FCS II fins click in and out without screws, making them easy to swap. Futures use a single-tab system that some surfers prefer for a more solid connection. It's personal preference — Paul installs both and can advise based on the fins you already own.",
  },
  {
    question: 'Does Paul ship boards outside South Africa?',
    answer: "Paul primarily ships within South Africa. For international orders, he can help arrange shipping through a freight service, but the cost and logistics are handled separately. Get in touch to discuss your options.",
  },
  {
    question: 'What do I need to tell Paul to get a quote?',
    answer: "The more Paul knows, the better. Tell him your height, weight, surfing experience, how often you surf, where you surf, and what you're looking for in a board. Don't worry if you're not sure about dimensions — that's Paul's job. Just describe your surfing and he'll figure out the rest.",
  },
];

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
        <p className="text-pjd-teal text-xs font-bold tracking-[0.25em] uppercase mb-3 text-center font-body">
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
