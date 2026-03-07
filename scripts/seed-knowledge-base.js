/**
 * Seed the PJD knowledge base for the AI chat assistant.
 *
 * Run: node scripts/seed-knowledge-base.js
 *
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
 * Embeddings are generated separately via Supabase or an external service.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://dplbfhwqbmnzmrncxain.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY env var');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const KNOWLEDGE = [
  // Board types
  {
    content: "Paul shapes four main types of surfboards: Shortboards for experienced surfers who want speed and sharp turns. Fish boards that are fast and fun in smaller waves, great for all levels. Hybrid boards (also called Mullets) that paddle well and handle most conditions — the best all-rounder. And Longboards for smooth, flowing surfing that catches everything.",
    category: 'board_types',
  },
  {
    content: "A Shortboard is best for experienced surfers who surf powerful waves and want maximum responsiveness. It's the go-to for point breaks and reef breaks. Not recommended for beginners.",
    category: 'board_types',
  },
  {
    content: "A Fish board is perfect for beach breaks and smaller waves. It paddles well, is fast and loose, and works for surfers of all levels. Great if you want to have fun in everyday conditions.",
    category: 'board_types',
  },
  {
    content: "A Hybrid or Mullet board is the ultimate daily driver. Wider nose, relaxed rocker, paddles well. Works in most conditions and suits intermediate to experienced surfers. If you're not sure what to get, this is often the best starting point.",
    category: 'board_types',
  },
  {
    content: "A Longboard is ideal for smooth, flowing surfing. Catches waves easily, feels stable, and is perfect for small wave days. Great for beginners and experienced surfers who enjoy a classic style.",
    category: 'board_types',
  },

  // Pricing
  {
    content: "Custom surfboards from Paul Jeggels typically range from R5,000 to R15,000 or more, depending on the size, materials, and design complexity. Paul will give you an exact quote after discussing what you need — there's no obligation.",
    category: 'pricing',
  },
  {
    content: "Ding repairs start from around R500 for minor fixes. More extensive repairs like rail rebuilds or full re-glass jobs cost more. Paul will assess the damage and give you a quote.",
    category: 'pricing',
  },
  {
    content: "Custom fins start from around R800. They're hand-made to match your specific board's rocker and flex. Available in FCS and Futures compatible setups.",
    category: 'pricing',
  },
  {
    content: "Second-hand boards are available at varying prices. Stock changes regularly. All second-hand boards were originally shaped by Paul and are inspected before listing.",
    category: 'pricing',
  },

  // Process & timeline
  {
    content: "The custom board process: First, you get in touch — take the quiz on the website, send a message, or call Paul directly. Then Paul calls you to discuss your surfing, your local waves, and what you want. He shapes your board by hand in his J-Bay workshop, which usually takes 1 to 3 weeks. Then you pick it up or get it delivered.",
    category: 'process',
  },
  {
    content: "Lead times on custom boards are typically 1 to 3 weeks depending on how busy Paul is. He'll give you a timeline when you chat. Paul responds to enquiries within 24 hours.",
    category: 'process',
  },
  {
    content: "Paul shapes every board himself by hand. No factory, no templates, no assembly line. Each board is built specifically for the surfer who ordered it.",
    category: 'process',
  },

  // Paul's background
  {
    content: "Paul Jeggels has been shaping surfboards for over 40 years from his workshop in Jeffreys Bay, South Africa — one of the world's best surf destinations. He's shaped over 4,000 boards and knows every break in J-Bay personally.",
    category: 'about',
  },
  {
    content: "Paul was featured in Zigzag Magazine, South Africa's premier surf publication. He surfs what he makes — he's not just a shaper, he's an experienced surfer who understands what works in the water.",
    category: 'about',
  },
  {
    content: "Paul works alongside his son Daniel in the workshop. The business is family-run, built on word-of-mouth reputation over four decades.",
    category: 'about',
  },

  // Beginners
  {
    content: "Beginners can absolutely get a custom board from Paul. In fact, a board built for your exact size and ability level will help you improve faster than anything off the rack. Paul shapes many boards for newer surfers. Take the quiz on the website and Paul will guide you to the right board.",
    category: 'beginners',
  },
  {
    content: "If you don't know what size or type of board you need, that's completely normal. Paul will ask you about your height, weight, surfing experience, and the waves you usually surf. He figures out the right board for you — that's his job.",
    category: 'beginners',
  },

  // Contact & location
  {
    content: "Paul's workshop is at 15 Dageraad Street, Jeffreys Bay 6330, South Africa. You're welcome to visit — just give him a call first to make sure he's in. Phone: +27 82 960 9353. Instagram: @pauljeggelsdesigns.",
    category: 'contact',
  },
  {
    content: "Paul can deliver boards anywhere in South Africa. Shipping cost depends on your location. Pick-up from the J-Bay workshop is always free.",
    category: 'contact',
  },

  // Materials (plain language)
  {
    content: "Surfboards are made from a foam core (the blank) that Paul shapes by hand, then covered with fibreglass and resin (called glassing). The glass job determines how strong and heavy the board is. Standard is light and responsive. Heavier glass jobs are more durable but a bit heavier. Paul can recommend what's best for you.",
    category: 'materials',
  },
  {
    content: "Fin setups: A thruster has 3 fins and is the most common — good for all conditions. Twin fins (2 fins) are fast and loose. A quad (4 fins) gives speed and hold. Single fins are classic longboard style. If you're not sure, Paul will recommend based on your board and surfing.",
    category: 'materials',
  },
];

async function seed() {
  console.log(`Seeding ${KNOWLEDGE.length} knowledge base entries...`);

  // Clear existing entries
  const { error: deleteError } = await supabase
    .from('pjd_knowledge_base')
    .delete()
    .neq('id', 0);

  if (deleteError) {
    console.error('Error clearing existing entries:', deleteError.message);
  }

  // Insert new entries
  const { data, error } = await supabase
    .from('pjd_knowledge_base')
    .insert(KNOWLEDGE)
    .select();

  if (error) {
    console.error('Error seeding:', error.message);
    process.exit(1);
  }

  console.log(`Successfully seeded ${data.length} entries.`);
  console.log('Note: Embeddings need to be generated separately for vector search.');
}

seed();
