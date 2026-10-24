'use client'

import { useState } from 'react'
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

type Classification = 'must' | 'performance' | 'delighter' | 'indifferent'
type Priority = 'Build first' | 'Build next' | 'Later'
type IconName = 'profile' | 'calendar' | 'video' | 'search' | 'chart' | 'chat' | 'people' | 'leaf' | 'mood' | 'sparkle'

interface FeatureItem {
  id: string
  icon: IconName
  title: string
  classification: Classification
  description: string
  why: string[]
  insight: string
  reach: number
  impact: number
  confidence: number
  effort: number
  score: number
  priority: Priority
}

// Shortlisted features evaluated with both frameworks below.
const FEATURES: FeatureItem[] = [
  {
    id: 'profiles', icon: 'profile', title: 'Therapist profiles', classification: 'must',
    description: 'Helps users find the right therapist based on preferences, specialisation and availability.',
    why: ['Essential for trust and informed choice.', 'Reduces drop-offs by providing transparency.', 'Important for both new and returning users.'],
    insight: 'Users see therapist profiles as a basic expectation. Without it, trust and adoption drop significantly.',
    reach: 9, impact: 8, confidence: 8, effort: 5, score: 11.5, priority: 'Build first',
  },
  {
    id: 'booking', icon: 'calendar', title: 'Session booking & scheduling', classification: 'must',
    description: 'Lets users pick a therapist, time slot and session type without back-and-forth messaging.',
    why: ['Core to turning interest into an actual session.', 'Removes friction that causes sign-up drop-off.', 'Therapists expect calendar control from day one.'],
    insight: 'Booking is the moment intent turns into action — any friction here directly costs conversions.',
    reach: 9, impact: 8, confidence: 7, effort: 5, score: 10.1, priority: 'Build first',
  },
  {
    id: 'video', icon: 'video', title: 'Secure video calls', classification: 'performance',
    description: 'Encrypted, in-app video sessions so users never have to share personal contact details.',
    why: ['Delivers the core service — the session itself.', 'Privacy builds trust for a sensitive use case.', 'Better quality increases satisfaction linearly.'],
    insight: 'The better and more reliable the call quality, the higher user satisfaction — a classic performance driver.',
    reach: 8, impact: 8, confidence: 7, effort: 6, score: 7.5, priority: 'Build next',
  },
  {
    id: 'matching', icon: 'search', title: 'Therapist matching', classification: 'performance',
    description: 'Recommends therapists based on concern, language and availability instead of a flat directory.',
    why: ['Saves users time spent manually filtering profiles.', 'More relevant matches increase booking confidence.', 'A visible lever as the algorithm improves.'],
    insight: 'Matching quality scales satisfaction — small improvements compound across every session booked.',
    reach: 7, impact: 7, confidence: 7, effort: 6, score: 5.7, priority: 'Build next',
  },
  {
    id: 'progress', icon: 'chart', title: 'Progress tracking', classification: 'performance',
    description: 'Lets users log how they feel over time and see patterns across sessions.',
    why: ['Reinforces ongoing value, not just one session.', 'Gives therapists useful context each call.', 'Encourages return visits and long-term retention.'],
    insight: 'Progress tracking turns single sessions into a visible journey, which keeps users coming back.',
    reach: 6, impact: 7, confidence: 6, effort: 6, score: 4.2, priority: 'Later',
  },
  {
    id: 'chat', icon: 'chat', title: 'In-app chat support', classification: 'indifferent',
    description: 'Lightweight messaging between sessions for quick questions or check-ins.',
    why: ['Useful for some, but not core to the therapy flow.', 'Most needs are already met by video sessions.', 'Low impact on satisfaction either way.'],
    insight: 'Users neither expect nor are delighted by this — nice to have, but not worth building early.',
    reach: 6, impact: 6, confidence: 6, effort: 6, score: 3.8, priority: 'Later',
  },
  {
    id: 'community', icon: 'people', title: 'Community support', classification: 'delighter',
    description: 'Optional peer groups and moderated discussions around shared experiences.',
    why: ['Not expected, but creates a sense of belonging.', 'Differentiates the product from a booking tool.', 'Adds value disproportionate to its visibility.'],
    insight: 'A delighter — absence goes unnoticed, but presence creates real emotional stickiness.',
    reach: 5, impact: 6, confidence: 6, effort: 7, score: 2.6, priority: 'Later',
  },
  {
    id: 'selfcare', icon: 'leaf', title: 'Self-care tools', classification: 'delighter',
    description: 'Guided breathing, journaling prompts and exercises to use between sessions.',
    why: ['Extends support beyond the scheduled call.', 'Signals the product cares about the whole journey.', 'Not expected by most users going in.'],
    insight: 'Small, thoughtful touches here create outsized goodwill relative to the effort involved.',
    reach: 5, impact: 5, confidence: 6, effort: 7, score: 2.3, priority: 'Later',
  },
  {
    id: 'mood', icon: 'mood', title: 'Mood tracker', classification: 'delighter',
    description: 'A quick daily check-in that visualises emotional trends alongside therapy sessions.',
    why: ['A lightweight way to feel progress day to day.', 'Pairs naturally with progress tracking later.', 'Adds personality and warmth to the product.'],
    insight: 'Delightful on its own, but only valuable once the core booking and session loop is solid.',
    reach: 4, impact: 5, confidence: 6, effort: 7, score: 2.1, priority: 'Later',
  },
  {
    id: 'ai', icon: 'sparkle', title: 'AI insights & recommendations', classification: 'delighter',
    description: 'Surfaces patterns from mood and progress data to suggest focus areas for upcoming sessions.',
    why: ['Depends entirely on data from other features.', 'Highest effort of the shortlist to build well.', 'A strong differentiator once the foundation exists.'],
    insight: 'High potential, but needs the rest of the product shipped first to have any data to learn from.',
    reach: 4, impact: 6, confidence: 5, effort: 8, score: 1.9, priority: 'Later',
  },
]

const CLASSIFICATION_META: Record<Classification, { label: string; sub: string; dot: string; chip: string }> = {
  must: { label: 'Must-have', sub: 'Basic expectation', dot: 'bg-rose-400', chip: 'bg-rose-500 text-white' },
  performance: { label: 'Performance', sub: 'More usage adds value', dot: 'bg-sky-400', chip: 'bg-sky-500 text-white' },
  delighter: { label: 'Delighter', sub: 'Unexpected but delightful', dot: 'bg-amber-400', chip: 'bg-amber-500 text-white' },
  indifferent: { label: 'Indifferent', sub: 'Little impact on satisfaction', dot: 'bg-stone-400', chip: 'bg-stone-500 text-white' },
}
const CLASSIFICATION_ORDER: Classification[] = ['must', 'performance', 'delighter', 'indifferent']

// ── Small icons ───────────────────────────────────────────────────────────
function FeatureIcon({ name }: { name: IconName }) {
  const c = { width: 15, height: 15, viewBox: '0 0 16 16', fill: 'none' } as const
  switch (name) {
    case 'profile':
      return <svg {...c}><circle cx="8" cy="5.4" r="2.6" stroke="currentColor" strokeWidth="1.3" /><path d="M2.8 13.6c.8-2.6 2.9-4 5.2-4s4.4 1.4 5.2 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'calendar':
      return <svg {...c}><rect x="2.2" y="3.2" width="11.6" height="10.2" rx="1.4" stroke="currentColor" strokeWidth="1.3" /><path d="M2.2 6.4h11.6M5.4 1.8v2.4M10.6 1.8v2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'video':
      return <svg {...c}><rect x="1.8" y="4.4" width="8.4" height="7.2" rx="1.3" stroke="currentColor" strokeWidth="1.3" /><path d="M10.2 7.2 14.2 5v6l-4-2.2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
    case 'search':
      return <svg {...c}><circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.3" /><path d="M10.4 10.4 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'chart':
      return <svg {...c}><path d="M2.5 13.5h11M4.6 13.5V8.6M8 13.5V4.2M11.4 13.5V9.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'chat':
      return <svg {...c}><path d="M1.8 3.8c0-.9.7-1.6 1.6-1.6h9.2c.9 0 1.6.7 1.6 1.6v5.2c0 .9-.7 1.6-1.6 1.6H6.2l-3.6 2.6v-2.6h-.8c-.9 0-1.6-.7-1.6-1.6V3.8Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
    case 'people':
      return <svg {...c}><circle cx="5.4" cy="5.6" r="2.1" stroke="currentColor" strokeWidth="1.2" /><circle cx="10.8" cy="5.6" r="2.1" stroke="currentColor" strokeWidth="1.2" /><path d="M1.6 13.4c.6-2.1 2.1-3.2 3.8-3.2s3.2 1.1 3.8 3.2M8.6 13.4c.5-1.9 1.8-2.9 3.3-2.9s2.9 1 3.3 2.9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
    case 'leaf':
      return <svg {...c}><path d="M13.4 2.6c.6 5.2-1.6 9-6.1 10.6-3.1 1.1-5-1-4-3.9C4.7 5.2 8.4 2.9 13.4 2.6Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M3.4 13.4c2-3 4.4-5 7.8-6.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
    case 'mood':
      return <svg {...c}><circle cx="8" cy="8" r="5.6" stroke="currentColor" strokeWidth="1.2" /><path d="M5.6 9.4c.6.9 1.4 1.4 2.4 1.4s1.8-.5 2.4-1.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /><circle cx="6" cy="6.6" r="0.7" fill="currentColor" /><circle cx="10" cy="6.6" r="0.7" fill="currentColor" /></svg>
    case 'sparkle':
    default:
      return <svg {...c}><path d="M8 1.6 9.2 6 13.6 7.2 9.2 8.4 8 12.8 6.8 8.4 2.4 7.2 6.8 6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
  }
}

function InfoIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4.3" stroke="currentColor" strokeWidth="1.1" /><path d="M5 4.4v3.1M5 2.9v.1" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
  )
}
function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M2.5 7.3 5.3 10 11.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  )
}
function BulbIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 16" fill="none"><path d="M7 1.5c-2.4 0-4.3 1.9-4.3 4.3 0 1.8 1 3.3 2.5 4v1.9h3.6v-1.9c1.5-.7 2.5-2.2 2.5-4C11.3 3.4 9.4 1.5 7 1.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M5.3 13.8h3.4M5.8 15h2.4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
  )
}

// ── Night-sky backdrop: a ringed planet behind the KANO panel ──
function CelestialDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* ringed planet */}
      <div className="absolute -bottom-4 -right-5 opacity-80" style={{ width: 72, height: 72 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 32%, #a78bfa, #2c1f55 70%)' }} />
        <div className="absolute left-1/2 top-1/2 rounded-full border-2 border-violet-200/70" style={{ width: 108, height: 30, transform: 'translate(-50%,-50%) rotate(-18deg)' }} />
      </div>
    </div>
  )
}

function PriorityPill({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    'Build first': 'bg-violet-600 text-white',
    'Build next': 'bg-violet-100 text-violet-700',
    'Later': 'bg-stone-100 text-stone-400',
  }
  return <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-semibold whitespace-nowrap ${styles[priority]}`}>{priority}</span>
}

// ── Explainer callout shown inside each panel ────────────────────────────
function Explainer({ title, body, tone, style }: { title: string; body: string; tone: 'dark' | 'light'; style?: React.CSSProperties }) {
  const isDark = tone === 'dark'
  return (
    <div style={style} className={`hidden md:flex items-start gap-2 absolute top-6 right-6 w-[220px] rounded-xl px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.12)] ${isDark ? 'bg-white text-ink' : 'bg-white border border-violet-100 text-ink'}`}>
      <span className={`mt-0.5 flex items-center justify-center w-4 h-4 rounded-full border shrink-0 ${isDark ? 'border-ink/30 text-ink/60' : 'border-violet-300 text-violet-500'}`}><InfoIcon /></span>
      <span className="text-[11px] leading-snug"><span className="font-semibold">{title}</span> {body}</span>
    </div>
  )
}

// ── KANO panel ────────────────────────────────────────────────────────────
function KanoPanel() {
  const [selected, setSelected] = useState(0)
  const feature = FEATURES[selected]
  const meta = CLASSIFICATION_META[feature.classification]

  return (
    <motion.div
      {...fadeUp(0.1)}
      className="relative rounded-[2rem] border border-white/10 overflow-hidden p-4 md:p-5 pt-6"
      style={{ background: 'linear-gradient(150deg,#241a42 0%,#140d28 70%)' }}
    >
      <span aria-hidden className="absolute -top-2.5 left-9 w-5 h-5 rounded-full" style={{ background: 'radial-gradient(circle at 35% 30%, #4c3b78, #140d28 75%)' }} />
      <div aria-hidden className="pointer-events-none absolute -right-10 -top-10 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 70%)' }} />
      <CelestialDecor />

      <div className="relative z-10">
      <span className="inline-block rounded-full bg-violet-500/20 text-violet-200 text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1 mb-2">User value</span>

      <Explainer tone="dark" title="The KANO model helps answer:" body="Which features will satisfy, delight or disappoint users?" />

      <h3 className="font-serif text-[1.5rem] md:text-[1.7rem] font-medium text-white leading-none mb-1.5">KANO</h3>
      <p className="font-sans text-[13px] text-white/70 mb-1.5">Understand what matters to users</p>
      <p className="font-sans text-[12px] text-white/45 leading-relaxed mb-3 max-w-[85%]">
        I mapped each potential feature to the KANO model to see which ones are essential expectations, performance drivers or delighters for both users and therapists.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-3">
        <ul data-lenis-prevent className="flex flex-col gap-1 max-h-[280px] md:max-h-[320px] overflow-y-auto pr-1">
          {FEATURES.map((f, i) => {
            const active = i === selected
            return (
              <li key={f.id}>
                <button
                  type="button"
                  onClick={() => setSelected(i)}
                  className={`w-full flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-left text-[13px] transition-colors ${active ? 'bg-violet-500/15 border-l-2 border-violet-400 text-white' : 'border-l-2 border-transparent text-white/50 hover:text-white/80'}`}
                >
                  <span className="flex items-center gap-2 truncate"><span className={active ? 'text-violet-300' : 'text-white/40'}><FeatureIcon name={f.icon} /></span><span className="truncate">{f.title}</span></span>
                  {active && <span className="text-violet-300 shrink-0">›</span>}
                </button>
              </li>
            )
          })}
        </ul>

        <motion.div key={feature.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl bg-white/5 border border-white/10 p-3.5">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-500/15 text-violet-300 shrink-0"><FeatureIcon name={feature.icon} /></span>
            <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${meta.chip}`}>{meta.label}</span>
          </div>
          <p className="font-sans text-[14px] font-semibold text-white mb-1">{feature.title}</p>
          <p className="font-sans text-[12px] text-white/50 leading-relaxed mb-2">{feature.description}</p>

          <p className="font-sans text-[10.5px] font-semibold tracking-wide uppercase text-white/50 mb-1">Why users expect this</p>
          <ul className="flex flex-col gap-0.5 mb-2">
            {feature.why.map(w => (
              <li key={w} className="flex items-start gap-2 text-[11.5px] text-white/65 leading-snug">
                <span className="mt-0.5 text-emerald-400 shrink-0"><CheckIcon /></span>{w}
              </li>
            ))}
          </ul>

          <p className="font-sans text-[10.5px] font-semibold tracking-wide uppercase text-white/50 mb-1">KANO classification</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 mb-2">
            {CLASSIFICATION_ORDER.map(key => {
              const c = CLASSIFICATION_META[key]
              const isActive = key === feature.classification
              return (
                <div key={key} className={`rounded-md px-1.5 py-1.5 text-center ${isActive ? c.chip : 'bg-white/5 text-white/40'}`}>
                  <p className="text-[10px] font-semibold leading-tight">{c.label}</p>
                  <p className={`text-[8.5px] leading-tight mt-0.5 ${isActive ? 'text-white/85' : 'text-white/35'}`}>{c.sub}</p>
                </div>
              )
            })}
          </div>

          <div className="flex items-start gap-2 rounded-lg bg-violet-500/10 border border-violet-400/20 px-2.5 py-2">
            <span className="mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-violet-500/20 text-violet-300 shrink-0"><BulbIcon /></span>
            <p className="text-[11px] text-white/70 leading-snug"><span className="font-semibold text-white">Key insight: </span>{feature.insight}</p>
          </div>
        </motion.div>
      </div>
      </div>
    </motion.div>
  )
}

// ── RICE panel ────────────────────────────────────────────────────────────
function RicePanel() {
  return (
    <motion.div {...fadeUp(0.18)} className="relative rounded-[2rem] border border-violet-100 bg-white/90 p-4 md:p-5 pt-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)]">
      <span className="inline-block rounded-full bg-violet-100 text-violet-700 text-[10px] font-semibold tracking-[0.12em] uppercase px-3 py-1 mb-2">Build priority</span>

      <Explainer tone="light" title="RICE helps answer:" body="Which features give the highest value for the effort invested?" style={{ background: 'linear-gradient(150deg,#241a42 0%,#140d28 70%)', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }} />

      <h3 className="font-serif text-[1.5rem] md:text-[1.7rem] font-medium text-ink leading-none mb-1.5">RICE</h3>
      <p className="font-sans text-[13px] text-ink/80 mb-1.5">Decide what to build first</p>
      <p className="font-sans text-[12px] text-muted leading-relaxed mb-3 max-w-[90%]">
        I evaluated the shortlisted features using the RICE framework to compare their reach, impact, confidence and effort. This helped identify the MVP and plan what comes next.
      </p>

      <div data-lenis-prevent className="overflow-x-auto overflow-y-auto -mx-1 max-h-[280px] md:max-h-[320px]">
        <table className="w-full min-w-[600px] border-collapse">
          <thead className="sticky top-0 bg-white/95 backdrop-blur-sm">
            <tr className="border-b border-stone-200 text-left">
              <th className="pb-1.5 pr-2 font-sans text-[11px] font-bold tracking-wide uppercase text-ink">Feature</th>
              <th className="pb-1.5 px-2 font-sans text-[11px] font-bold tracking-wide uppercase text-ink">R<br /><span className="normal-case font-bold text-ink">(1-10)</span></th>
              <th className="pb-1.5 px-2 font-sans text-[11px] font-bold tracking-wide uppercase text-ink">I<br /><span className="normal-case font-bold text-ink">(1-10)</span></th>
              <th className="pb-1.5 px-2 font-sans text-[11px] font-bold tracking-wide uppercase text-ink">C<br /><span className="normal-case font-bold text-ink">(1-10)</span></th>
              <th className="pb-1.5 px-2 font-sans text-[11px] font-bold tracking-wide uppercase text-ink">E<br /><span className="normal-case font-bold text-ink">(1-10)</span></th>
              <th className="pb-1.5 px-2 font-sans text-[11px] font-bold tracking-wide uppercase text-ink">RICE Score</th>
              <th className="pb-1.5 pl-2 font-sans text-[11px] font-bold tracking-wide uppercase text-ink">Priority</th>
            </tr>
          </thead>
          <tbody>
            {FEATURES.map(f => (
              <tr key={f.id} className="border-b border-stone-100">
                <td className="py-1.5 pr-2">
                  <span className="flex items-center gap-2 text-[13px] font-medium text-ink whitespace-nowrap">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-violet-50 text-violet-500 shrink-0"><FeatureIcon name={f.icon} /></span>{f.title}
                  </span>
                </td>
                <td className="px-2 text-[13px] text-ink/70">{f.reach}</td>
                <td className="px-2 text-[13px] text-ink/70">{f.impact}</td>
                <td className="px-2 text-[13px] text-ink/70">{f.confidence}</td>
                <td className="px-2 text-[13px] text-ink/70">{f.effort}</td>
                <td className="px-2"><span className="inline-block rounded-md bg-stone-50 px-2 py-1 text-[12px] font-semibold text-ink">{f.score}</span></td>
                <td className="pl-2"><PriorityPill priority={f.priority} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// Scattered star positions (percent-based) across the whole section's light backdrop.
const SECTION_STARS = [
  { x: '6%', y: '10%', size: 9, delay: 0.2 },
  { x: '22%', y: '70%', size: 8, delay: 0.8 },
  { x: '48%', y: '6%', size: 8, delay: 1.3 },
  { x: '63%', y: '85%', size: 9, delay: 0.4 },
  { x: '92%', y: '60%', size: 8, delay: 1.0 },
  { x: '78%', y: '8%', size: 7, delay: 1.6 },
  { x: '35%', y: '40%', size: 7, delay: 0.6 },
  { x: '14%', y: '38%', size: 7, delay: 1.1 },
  { x: '55%', y: '62%', size: 8, delay: 0.3 },
  { x: '85%', y: '32%', size: 7, delay: 1.4 },
  { x: '3%', y: '85%', size: 8, delay: 0.7 },
  { x: '40%', y: '92%', size: 7, delay: 1.8 },
  { x: '97%', y: '12%', size: 8, delay: 0.5 },
  { x: '70%', y: '48%', size: 7, delay: 1.2 },
]

// ── Night-sky backdrop for the whole section: stars, constellations, planets and a nebula glow ──
function SectionCelestialDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute right-[18%] top-[20%] w-72 h-72 rounded-full opacity-70" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.5) 0%, transparent 70%)' }} />

      {SECTION_STARS.map((s, i) => (
        <svg key={i} className="absolute" width={s.size * 2.2} height={s.size * 2.2} viewBox="0 0 12 12" fill="none"
          style={{ left: s.x, top: s.y, animation: `bgStarMax ${3.5 + (i % 3)}s ease-in-out ${s.delay}s infinite` }}>
          <path d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z" fill="#7c3aed" />
        </svg>
      ))}

      {/* ringed planet — bottom left */}
      <div className="absolute left-[4%] bottom-[8%] opacity-90" style={{ width: 64, height: 64 }}>
        <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 35% 32%, #c4b5fd, #6d28d9 75%)' }} />
        <div className="absolute left-1/2 top-1/2 rounded-full border-2 border-violet-500/50" style={{ width: 96, height: 24, transform: 'translate(-50%,-50%) rotate(-16deg)' }} />
      </div>

      {/* small moon — top right */}
      <div className="absolute right-[3%] top-[14%] rounded-full opacity-80" style={{ width: 38, height: 38, background: 'radial-gradient(circle at 38% 34%, #fdf4ff, #a78bfa 70%)' }} />
    </div>
  )
}

export default function ProductDecisionsSection() {
  return (
    <section className="relative overflow-hidden py-8 md:py-10 px-6" style={{ background: 'linear-gradient(160deg,#fdf4ff 0%,#f5f3ff 40%,#fef6f0 100%)' }}>
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[480px] h-[480px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.14) 0%, transparent 72%)' }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 -left-16 w-[420px] h-[420px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 72%)' }} />
      <SectionCelestialDecor />

      <div className="relative z-10 mx-auto max-w-[1400px] flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5 md:mb-6">
        <div>
          <motion.p {...fadeUp(0)} className="text-[12px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-2">08 — Product Decisions</motion.p>
          <motion.h2 {...fadeUp(0.05)} className="font-serif text-[1.9rem] md:text-[2.3rem] font-medium text-ink leading-[1.05] tracking-tightest">
            Not every feature<br /><span className="italic" style={{ color: '#7c3aed' }}>makes the cut.</span>
          </motion.h2>
        </div>
        <motion.p {...fadeUp(0.1)} className="font-sans text-[14px] text-muted leading-relaxed max-w-[420px] lg:pt-4">
          With multiple ideas and two user groups, I used the KANO model to understand what matters to users and the RICE framework to prioritise what to build first.
        </motion.p>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <KanoPanel />
          <RicePanel />
        </div>
      </div>
    </section>
  )
}
