'use client'

import { motion } from 'framer-motion'

// ── Animation helper ──────────────────────────────────────────────────────
function fadeUp(delay = 0, duration = 0.42) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '140px' } as const,
    transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }
}

interface LearningItem { n: string; title: string; description: string }

const WHAT_I_LEARNED: LearningItem[] = [
  { n: '01', title: 'Start with real user problems', description: 'User research and conversations helped me move beyond assumptions and understand what people actually need from a mental health platform.' },
  { n: '02', title: 'Turn insights into simple, focused solutions', description: 'It was easy to get carried away with features. Using frameworks like KANO and RICE helped me prioritise what truly creates value for users.' },
  { n: '03', title: 'Designing end-to-end builds empathy', description: 'Thinking through the complete journey — from discovery to booking to post-session support — made me more user-centric and aware of edge cases.' },
  { n: '04', title: 'Collaboration makes the product stronger', description: 'Feedback from mentors, peers and potential users consistently improved my designs and helped me see different perspectives.' },
]

const WHAT_ID_DO_DIFFERENTLY: LearningItem[] = [
  { n: '01', title: 'Validate earlier with usability testing', description: 'I would test low-fidelity prototypes with real users earlier to catch usability issues and validate key assumptions before investing time in detailed screens.' },
  { n: '02', title: 'Explore scalability and operational challenges', description: 'I would dive deeper into platform scalability, therapist onboarding and session management to understand real-world execution constraints.' },
  { n: '03', title: 'Evaluate the business model with users', description: 'I would test willingness to pay and explore pricing and monetization options with users and therapists earlier in the process.' },
  { n: '04', title: 'Design for inclusivity from the start', description: 'I would spend more time on accessibility, regional language support and features for diverse user needs, including those from tier 2/3 cities.' },
]

// ── Scattered star field for the dark backdrop ───────────────────────────
const STARS = [
  { x: '8%', y: '12%', size: 8, delay: 0.2 },
  { x: '92%', y: '18%', size: 7, delay: 0.9 },
  { x: '20%', y: '85%', size: 7, delay: 0.5 },
  { x: '75%', y: '88%', size: 8, delay: 1.3 },
  { x: '48%', y: '6%', size: 6, delay: 1.6 },
  { x: '5%', y: '55%', size: 6, delay: 0.8 },
  { x: '95%', y: '60%', size: 6, delay: 1.1 },
]

function StarField() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {STARS.map((s, i) => (
        <svg key={i} className="absolute opacity-70" width={s.size * 2.2} height={s.size * 2.2} viewBox="0 0 12 12" fill="none"
          style={{ left: s.x, top: s.y, animation: `bgStarBright ${3.5 + (i % 3)}s ease-in-out ${s.delay}s infinite` }}>
          <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="#c4b5fd" />
        </svg>
      ))}
    </div>
  )
}

function LearningCard({ badge, aside, items, delay }: { badge: string; aside: string; items: LearningItem[]; delay: number }) {
  return (
    <motion.div {...fadeUp(delay)} className="rounded-[1.75rem] bg-white/5 border border-white/10 p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="inline-block rounded-full bg-violet-500/20 text-violet-200 text-[10.5px] font-semibold tracking-[0.12em] uppercase px-3 py-1">{badge}</span>
        <span className="hidden sm:flex items-center gap-2 text-[12px] italic text-white/40">
          <span className="w-5 h-px bg-white/20" />{aside}
        </span>
      </div>
      <ul className="flex flex-col">
        {items.map((it, i) => (
          <li key={it.n} className={`flex items-start gap-3 py-2.5 ${i < items.length - 1 ? 'border-b border-white/10' : ''}`}>
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/15 text-violet-300 text-[11px] font-semibold shrink-0">{it.n}</span>
            <div>
              <p className="font-sans text-[13.5px] font-semibold text-white leading-snug mb-0.5">{it.title}</p>
              <p className="font-sans text-[12px] text-white/50 leading-relaxed">{it.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function KeyLearningsSection() {
  return (
    <section id="talk-learnings" className="relative scroll-mt-16 overflow-hidden py-10 md:py-14 px-6" style={{ background: 'linear-gradient(160deg, #0a0916 0%, #15112b 45%, #1d1340 100%)' }}>
      <StarField />
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[480px] h-[480px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 72%)' }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 -left-16 w-[420px] h-[420px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 72%)' }} />

      <div className="relative z-10 mx-auto max-w-5xl text-center mb-8 md:mb-10">
        <motion.p {...fadeUp(0)} className="text-[12px] font-semibold tracking-[0.18em] text-violet-400 uppercase mb-3">09 — Key Learnings</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-serif text-[2.1rem] md:text-[2.7rem] font-medium text-white leading-[1.05] tracking-tightest mb-3">
          My first product.<br /><span className="italic" style={{ color: '#a78bfa' }}>A new way of thinking.</span>
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="font-sans text-[14.5px] text-white/55 leading-relaxed max-w-2xl mx-auto">
          Designing Talk to ME took me from a broad idea to a real, end-to-end product. It challenged me to think deeply about users, make trade-offs and stay focused on impact.
        </motion.p>
      </div>

      <div className="relative z-10 mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <LearningCard badge="What I learned" aside="Key takeaways from this journey" items={WHAT_I_LEARNED} delay={0.14} />
        <LearningCard badge="What I'd do differently" aside="If I were to work on this again..." items={WHAT_ID_DO_DIFFERENTLY} delay={0.2} />
      </div>

      <motion.div {...fadeUp(0.26)} className="relative z-10 mx-auto max-w-[1400px] rounded-[1.75rem] border border-violet-400/20 px-5 py-4 md:px-7 md:py-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-7" style={{ background: 'linear-gradient(135deg,#3b2a6e 0%,#1a1030 80%)' }}>
        <div className="md:flex-1">
          <span className="inline-block text-[11px] font-semibold tracking-[0.18em] text-violet-300 uppercase mb-1.5">Biggest learning</span>
          <p className="font-serif text-[1.25rem] md:text-[1.45rem] font-medium text-white leading-snug">
            Quality over quantity — don&rsquo;t turn a product into a feature factory, keep the <span className="italic" style={{ color: '#c4b5fd' }}>user experience</span> at its best.
          </p>
        </div>
        <div className="hidden md:block w-px self-stretch bg-white/15" />
        <p className="md:flex-1 font-sans text-[13px] text-white/60 leading-relaxed">
          Talk to ME taught me to slow down, listen, and design with empathy. It made me realise that meaningful products come from real user insights, thoughtful prioritisation and a clear focus on impact.
        </p>
      </motion.div>
    </section>
  )
}
