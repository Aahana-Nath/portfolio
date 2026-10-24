'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'

// ── Skill data ────────────────────────────────────────────────────
type Skill = { label: string; desc: string }

const ROW1: Skill[] = [
  { label: 'Product Strategy',   desc: 'North-star vision, OKRs and long-range roadmaps.' },
  { label: 'AI Workflows',       desc: 'Production-ready GenAI image and video pipelines.' },
  { label: 'Product Discovery',  desc: 'User interviews, problem framing, opportunity sizing.' },
  { label: 'User Research',      desc: 'Qual & quant methods to surface actionable insights.' },
  { label: 'Prompt Engineering', desc: 'Optimising prompts for reliable production AI outputs.' },
  { label: 'Computer Vision',    desc: 'Shipped CV-powered content workflows at scale.' },
  { label: 'Product Thinking',   desc: 'Systems thinking to solve complex, ambiguous problems.' },
]

const ROW2: Skill[] = [
  { label: 'UX Design',           desc: 'Wireframes to high-fidelity, user-centred interfaces.' },
  { label: 'Product Analytics',   desc: 'Metrics frameworks, dashboards and data-driven decisions.' },
  { label: 'Marketplace AI',      desc: 'AI optimisation tools for Amazon & eCommerce.' },
  { label: 'AI Video Generation', desc: 'Scalable video creation using generative AI models.' },
  { label: 'Experimentation',     desc: 'A/B testing, hypothesis validation, rapid iteration.' },
  { label: 'Roadmapping',         desc: 'Prioritisation frameworks and stakeholder alignment.' },
  { label: 'Go-to-Market',        desc: 'Launch strategy and cross-functional coordination.' },
]

const ROW3: Skill[] = [
  { label: 'Rapid Validation', desc: 'Fast prototypes and experiments to test assumptions.' },
  { label: 'Generative AI',    desc: 'End-to-end GenAI product ownership from 0 → 1.' },
  { label: 'Automation',       desc: 'Workflow automation reducing manual effort by 90%.' },
  { label: 'APIs',             desc: 'Integrating third-party services and API contract design.' },
  { label: 'Wireframing',      desc: 'Lo-fi and hi-fi wireframes to communicate product ideas.' },
  { label: 'Product Systems',  desc: 'Scalable systems for consistent product experiences.' },
  { label: 'Data Storytelling',desc: 'Translating complex data into compelling narratives.' },
]

// ── Floating particles (module-level) ────────────────────────────
const PTCLS = [
  { x: '8%',  y: '18%', s: 2,   dur: 8,  d: 0   },
  { x: '92%', y: '12%', s: 1.5, dur: 10, d: 1.2 },
  { x: '14%', y: '72%', s: 1,   dur: 7,  d: 0.5 },
  { x: '86%', y: '68%', s: 2,   dur: 9,  d: 2   },
  { x: '48%', y: '8%',  s: 1.5, dur: 11, d: 0.8 },
  { x: '28%', y: '82%', s: 1,   dur: 8,  d: 1.5 },
  { x: '72%', y: '88%', s: 1.5, dur: 10, d: 0.3 },
  { x: '19%', y: '44%', s: 1,   dur: 13, d: 2.5 },
  { x: '80%', y: '38%', s: 1,   dur: 9,  d: 1   },
  { x: '55%', y: '55%', s: 1,   dur: 12, d: 1.8 },
]

// ── Chip ─────────────────────────────────────────────────────────
function Chip({
  skill,
  onRowHover,
  onRowLeave,
}: {
  skill: Skill
  onRowHover: () => void
  onRowLeave: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative inline-flex flex-col items-start cursor-default mx-2 px-5 py-2.5 rounded-full shrink-0 select-none"
      style={{
        background: hovered ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: hovered ? '1px solid rgba(139,92,246,0.35)' : '1px solid rgba(255,255,255,0.09)',
        boxShadow: hovered
          ? '0 8px 32px rgba(139,92,246,0.28), 0 0 0 1px rgba(139,92,246,0.15)'
          : '0 2px 8px rgba(0,0,0,0.35)',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
      animate={{ scale: hovered ? 1.05 : 1, y: hovered ? -4 : 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onMouseEnter={() => { setHovered(true); onRowHover() }}
      onMouseLeave={() => { setHovered(false); onRowLeave() }}
    >
      <span className="flex items-center gap-2 whitespace-nowrap">
        <span className="text-violet-400 text-[9px] leading-none">✦</span>
        <span className="text-[12.5px] font-medium text-white/88 tracking-[0.02em]">
          {skill.label}
        </span>
      </span>
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18 }}
            className="block text-[10px] text-white/42 whitespace-nowrap overflow-hidden"
          >
            {skill.desc}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Marquee row ──────────────────────────────────────────────────
function MarqueeRow({
  skills,
  direction,
  duration,
}: {
  skills: Skill[]
  direction: 'left' | 'right'
  duration: number
}) {
  const [paused, setPaused] = useState(false)
  const doubled = [...skills, ...skills]

  return (
    <div
      className="overflow-hidden w-full"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div
        className="flex"
        style={{
          animation: `${direction === 'left' ? 'marqueeLeft' : 'marqueeRight'} ${duration}s linear infinite`,
          animationPlayState: paused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {doubled.map((skill, i) => (
          <Chip
            key={`${skill.label}-${i}`}
            skill={skill}
            onRowHover={() => setPaused(true)}
            onRowLeave={() => setPaused(false)}
          />
        ))}
      </div>
    </div>
  )
}

// ── Main section ─────────────────────────────────────────────────
export default function ToolkitSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const springX = useSpring(mouseX, { stiffness: 40, damping: 22 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22 })

  const glowLeft = useTransform(springX, [0, 1], ['25%', '75%'])
  const glowTop  = useTransform(springY, [0, 1], ['25%', '75%'])

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const r = sectionRef.current?.getBoundingClientRect()
    if (!r) return
    mouseX.set((e.clientX - r.left) / r.width)
    mouseY.set((e.clientY - r.top) / r.height)
  }

  return (
    <section
      id="toolkit"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative scroll-mt-20 overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: '#12131A',
        minHeight: '480px',
        maxHeight: '650px',
        height: '55vh',
      }}
    >
      {/* Grain texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.038,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      {/* Faint grid */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* Lavender radial glow — mouse-tracked */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          left: glowLeft,
          top: glowTop,
          x: '-50%',
          y: '-50%',
          width: '70%',
          height: '80%',
          background:
            'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(139,92,246,0.2) 0%, rgba(167,139,250,0.08) 52%, transparent 74%)',
        }}
      />

      {/* Floating particles */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {PTCLS.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-violet-400"
            style={{
              left: p.x,
              top: p.y,
              width: p.s,
              height: p.s,
              animation: `ptcFloat ${p.dur}s ease-in-out ${p.d}s infinite`,
              opacity: 0.22,
            }}
          />
        ))}
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Header */}
        <div className="text-center mb-8 px-6">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="text-[10px] font-semibold tracking-[0.22em] text-violet-400/75 uppercase mb-3"
          >
            My Toolkit
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.08, ease: 'easeOut' }}
            className="font-serif text-[clamp(1.9rem,3.5vw,2.6rem)] font-semibold tracking-tight text-white mb-3 leading-tight"
          >
            Things I Build With
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: 0.16, ease: 'easeOut' }}
            className="text-[13px] text-white/38 leading-relaxed max-w-130 mx-auto"
          >
            Everything I build sits at the intersection of product thinking, AI, design, and engineering.
          </motion.p>
        </div>

        {/* Marquees */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="w-full space-y-3"
        >
          <MarqueeRow skills={ROW1} direction="left"  duration={55} />
          <MarqueeRow skills={ROW2} direction="right" duration={65} />
          <div className="hidden md:block">
            <MarqueeRow skills={ROW3} direction="left" duration={48} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
