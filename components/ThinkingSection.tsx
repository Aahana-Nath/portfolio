'use client'

import { Fragment } from 'react'
import { motion } from 'framer-motion'

// ── Types & content ──────────────────────────────────────────────────────────
type IconKey = 'planet' | 'moons' | 'galaxy' | 'constellation' | 'planet2' | 'crescent' | 'sparkle' | 'comet'
interface NStep { id: string; title: string; subtitle: string; bullets: string[]; icon: IconKey }

const ROW1: NStep[] = [
  {
    id: '01', title: 'Identify Essentials', subtitle: 'Find the problem worth solving.',
    bullets: ['Understand user needs', 'Align business goals', 'Map constraints', 'Focus on what matters'],
    icon: 'planet',
  },
  {
    id: '02', title: 'Eliminate Unnecessary', subtitle: 'Cut the noise before you build.',
    bullets: ['Challenge assumptions', 'Remove low-value ideas', 'Avoid gold-plating', 'Keep scope focused'],
    icon: 'moons',
  },
  {
    id: '03', title: 'Streamline Flow', subtitle: 'Create the clearest path to value.',
    bullets: ['Simplify user journeys', 'Reduce friction', 'Minimize decisions', 'Design for clarity'],
    icon: 'galaxy',
  },
  {
    id: '04', title: 'Build an Effective Roadmap', subtitle: 'Turn priorities into an executable plan.',
    bullets: ['Prioritize by impact', 'Sequence smartly', 'Balance effort & value', 'Plan for what’s next'],
    icon: 'constellation',
  },
]

const ROW2: NStep[] = [
  {
    id: '05', title: 'Prototype & Build MVP', subtitle: 'Turn ideas into a testable product.',
    bullets: ['Build a rough prototype', 'Test key assumptions early', 'Validate with real users', 'Refine before full build'],
    icon: 'comet',
  },
  {
    id: '06', title: 'Define Requirements & Build', subtitle: 'Turn priorities into something real.',
    bullets: ['Product requirements', 'Technical requirements', 'Align with design & eng', 'Iterate during build'],
    icon: 'planet2',
  },
  {
    id: '07', title: 'Deploy, Read & Assess', subtitle: 'Ship → measure → learn.',
    bullets: ['Track key metrics', 'Gather user feedback', 'Understand what worked', 'Identify gaps & opportunities'],
    icon: 'crescent',
  },
  {
    id: '08', title: 'Do It All Over Again', subtitle: 'Every release creates a better question.',
    bullets: ['Refine and reprioritize', 'Incorporate learnings', 'Explore new opportunities', 'Keep the loop alive'],
    icon: 'sparkle',
  },
]


// Deterministic sparkle positions — CSS-only twinkle, no JS animation loop
const SPARKLES = [
  { x: '5%', y: '28%', s: 5, delay: 0 },
  { x: '95%', y: '48%', s: 6, delay: 0.7 },
  { x: '68%', y: '6%', s: 5, delay: 1.3 },
  { x: '38%', y: '92%', s: 4, delay: 0.4 },
  { x: '3%', y: '78%', s: 5, delay: 1.8 },
  { x: '58%', y: '54%', s: 4, delay: 1.0 },
  { x: '97%', y: '86%', s: 4, delay: 0.5 },
]

// ── Custom space-themed glyphs, one per step ─────────────────────────────────
function PlanetGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <defs>
        <radialGradient id="tp-planet" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ede6ff" />
          <stop offset="55%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d4fd6" />
        </radialGradient>
      </defs>
      <ellipse cx="17" cy="19" rx="16" ry="5.2" fill="none" stroke="#c4b5fd" strokeWidth="1" opacity="0.75" transform="rotate(-16 17 19)" />
      <circle cx="16" cy="15" r="9" fill="url(#tp-planet)" />
    </svg>
  )
}
function PlanetGlyph2() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <defs>
        <radialGradient id="tp-planet2" cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#e4d9ff" />
          <stop offset="55%" stopColor="#8b7fd6" />
          <stop offset="100%" stopColor="#4c3d99" />
        </radialGradient>
      </defs>
      <ellipse cx="17" cy="16" rx="14" ry="4.6" fill="none" stroke="#c4b5fd" strokeWidth="1" opacity="0.7" transform="rotate(14 17 16)" />
      <circle cx="18" cy="18" r="8" fill="url(#tp-planet2)" />
    </svg>
  )
}
function MoonClusterGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="13" cy="17" r="8.5" fill="#8b7fd6" opacity="0.85" />
      <circle cx="24" cy="11" r="5" fill="#a78bfa" opacity="0.7" />
      <circle cx="23" cy="24" r="6" fill="#c4b5fd" opacity="0.6" />
    </svg>
  )
}
function GalaxyGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="14" fill="#c4b5fd" opacity="0.1" />
      <path d="M17 17 C17 11 23 10 25 13 C28 17 24 22 19 21 C14 20 13 15 17 12 C19 10.5 23 11.5 23 15"
        stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" fill="none" opacity="0.9" />
      <circle cx="17" cy="17" r="2.4" fill="#ede6ff" />
    </svg>
  )
}
function ConstellationGlyph() {
  const pts: [number, number][] = [[17, 3], [30, 15], [17, 27], [4, 18]]
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M17 3 L30 15 L17 27 L4 18 Z" stroke="#c4b5fd" strokeWidth="1.1" strokeLinejoin="round" opacity="0.85" />
      <path d="M17 3 L17 27" stroke="#c4b5fd" strokeWidth="0.8" opacity="0.4" />
      {pts.map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={2.3} fill="#ede6ff" />)}
    </svg>
  )
}
function CrescentGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="12" fill="#c4b5fd" opacity="0.12" />
      <path d="M21 7 A11 11 0 1 0 21 27 A8.5 8.5 0 0 1 21 7 Z" fill="#cabbfb" />
    </svg>
  )
}
function SparkleGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <circle cx="17" cy="17" r="13" fill="#c4b5fd" opacity="0.12" />
      <path d="M17 2 L19.6 14.4 L32 17 L19.6 19.6 L17 32 L14.4 19.6 L2 17 L14.4 14.4 Z" fill="#ede6ff" />
      <path d="M17 8 L18.2 16 L26 17 L18.2 18 L17 26 L15.8 18 L8 17 L15.8 16 Z" fill="#a78bfa" opacity="0.75" />
    </svg>
  )
}
function CometGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
      <path d="M22 10 C15 14, 9 20, 3 27" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" opacity="0.4" />
      <path d="M22 10 C17 13, 12 18, 8 24" stroke="#c4b5fd" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
      <circle cx="24" cy="9" r="6.5" fill="#ede6ff" />
      <circle cx="24" cy="9" r="6.5" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.5" />
    </svg>
  )
}

const ICON: Record<IconKey, () => React.ReactElement> = {
  planet: PlanetGlyph, moons: MoonClusterGlyph, galaxy: GalaxyGlyph,
  constellation: ConstellationGlyph, planet2: PlanetGlyph2, crescent: CrescentGlyph, sparkle: SparkleGlyph, comet: CometGlyph,
}

// ── One process step card ────────────────────────────────────────────────────
function StepCard({ step }: { step: NStep }) {
  const Icon = ICON[step.icon]
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="relative w-full lg:w-72 lg:flex-none lg:h-52 rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(160deg,#181527 0%,#0f0d1a 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 8px 22px rgba(0,0,0,0.2)',
      }}
    >
      <div className="p-3.5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <span className="font-sans font-medium" style={{ fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>{step.id}</span>
          <div style={{ width: 30, height: 30 }}><Icon /></div>
        </div>
        <h3 className="font-sans font-semibold leading-snug mb-1" style={{ fontSize: 15, color: '#fff' }}>{step.title}</h3>
        <p className="font-sans leading-snug mb-2" style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{step.subtitle}</p>
        <div className="h-px mb-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
        <ul className="flex flex-col gap-0.75">
          {step.bullets.map(b => (
            <li key={b} className="flex items-start gap-1.5">
              <span style={{ color: '#a78bfa', fontSize: 11, lineHeight: 1.4, marginTop: 1 }}>+</span>
              <span className="font-sans" style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.72)', lineHeight: 1.35 }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

// ── Solid arrow between two cards ────────────────────────────────────────────
function FlowArrow() {
  return (
    <div className="hidden lg:flex items-center justify-center shrink-0" style={{ width: 30 }}>
      <svg width="26" height="14" viewBox="0 0 26 14" fill="none">
        <line x1="0" y1="7" x2="19" y2="7" stroke="#8b7fd6" strokeWidth="1.4" />
        <path d="M15 2 L22 7 L15 12" stroke="#8b7fd6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    </div>
  )
}

// ── Dashed loop-back curve bridging the two rows ────────────────────────────
function LoopArc() {
  return (
    <div className="hidden lg:block relative pointer-events-none" style={{ height: 36 }} aria-hidden>
      <svg className="absolute inset-0" width="100%" height="36" viewBox="0 0 1000 36" preserveAspectRatio="none" fill="none">
        <path d="M960 3 C 760 29, 260 5, 40 33" stroke="#c4b5fd" strokeWidth="1.3" strokeDasharray="3 6" strokeLinecap="round" fill="none" opacity="0.6" />
      </svg>
      <span className="absolute rounded-full" style={{ right: '4%', top: 0, width: 8, height: 8, border: '1.5px solid #a78bfa' }} />
      <span className="absolute rounded-full" style={{ left: '4%', bottom: 0, width: 6, height: 6, background: '#a78bfa' }} />
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────────────────
export default function ThinkingSection() {
  return (
    <section id="thinking" className="relative scroll-mt-20 overflow-hidden bg-linear-to-b from-[#f8f6ff] to-[#efe9fb] pt-8 pb-12">
      {/* Decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-44 -top-56 rounded-full"
          style={{ width: 260, height: 260, background: 'radial-gradient(circle at 65% 65%, rgba(20,18,32,0.85) 0%, rgba(60,55,90,0.5) 45%, rgba(60,55,90,0) 75%)' }} />
        <div className="absolute -left-36 -bottom-40 rounded-full"
          style={{ width: 320, height: 320, background: 'radial-gradient(circle at 40% 35%, rgba(196,181,253,0.5) 0%, rgba(139,111,224,0.28) 55%, rgba(139,111,224,0) 78%)' }} />
        {SPARKLES.map((s, i) => (
          <svg key={i} className="absolute" width={s.s * 2.4} height={s.s * 2.4} viewBox="0 0 12 12" fill="none"
            style={{ left: s.x, top: s.y, animation: `bgStar ${4 + i % 3}s ease-in-out ${s.delay}s infinite` }}>
            <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="#a78bfa" />
          </svg>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 max-w-355 mx-auto px-6 mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <span className="block font-sans font-semibold uppercase mb-4" style={{ fontSize: 11, letterSpacing: '0.28em', color: '#8b7fd6' }}>
            05 — My Process
          </span>
          <h2 className="font-serif text-ink leading-[1.05]" style={{ fontSize: 'clamp(2.2rem,4vw,3rem)' }}>
            How I Think &amp;<br />
            <em className="italic" style={{ color: '#a78bfa' }}>Build.</em>
            <span className="inline-block ml-2" style={{ color: '#a78bfa' }}>✦</span>
          </h2>
        </div>
        <div className="lg:max-w-sm lg:text-right">
          <p className="text-muted leading-relaxed" style={{ fontSize: 14 }}>
            A continuous loop of questioning, simplifying, building and learning to turn uncertainty into meaningful products.
          </p>
          <div className="h-px mt-3 lg:ml-auto" style={{ width: 130, background: '#1a1523' }} />
        </div>
      </div>

      {/* Flow */}
      <div className="relative z-10 max-w-355 mx-auto px-6">
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:justify-center items-stretch gap-4 lg:gap-0">
            {ROW1.map((step, i) => (
              <Fragment key={step.id}>
                <StepCard step={step} />
                {i < ROW1.length - 1 && <FlowArrow />}
              </Fragment>
            ))}
          </div>
        </div>

        <LoopArc />

        <div className="flex flex-col lg:flex-row lg:justify-center items-stretch gap-4 lg:gap-0">
          {ROW2.map((step, i) => (
            <Fragment key={step.id}>
              <StepCard step={step} />
              {i < ROW2.length - 1 && <FlowArrow />}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}
