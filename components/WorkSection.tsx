'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { motion } from 'framer-motion'
import { Orbit, Rocket, Sparkles } from 'lucide-react'

// ─── Tiny SVG icons ──────────────────────────────────────────────────────
function IconArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="inline-block">
      <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}


// ─── AI Video Journey: step card + arrow ─────────────────────────────────
function IconArrowRightSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
const FLOW_TINT = {
  violet: { border: 'border-violet-100', bg: 'bg-violet-50/50', badgeBg: 'bg-violet-100', badgeText: 'text-violet-600', iconBg: 'bg-violet-100', iconText: 'text-violet-600' },
  green: { border: 'border-emerald-100', bg: 'bg-emerald-50/50', badgeBg: 'bg-emerald-100', badgeText: 'text-emerald-600', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
  orange: { border: 'border-rose-100', bg: 'bg-rose-50/40', badgeBg: 'bg-rose-100', badgeText: 'text-rose-500', iconBg: 'bg-rose-100', iconText: 'text-rose-500' },
} as const
type FlowTint = keyof typeof FLOW_TINT

function FlowStepCard({ step, tint, icon, title, desc, delay = 0 }: { step: string; tint: FlowTint; icon: React.ReactNode; title: string; desc: string; delay?: number }) {
  const c = FLOW_TINT[tint]
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '180px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={`relative flex flex-col rounded-2xl border ${c.border} ${c.bg} p-3 flex-1 min-w-0 basis-0`}
    >
      <span className={`self-start inline-flex items-center rounded-full ${c.badgeBg} ${c.badgeText} text-[9.5px] font-semibold px-1.5 py-0.5 mb-2`}>{step}</span>
      <span className={`flex items-center justify-center w-8 h-8 rounded-full ${c.iconBg} ${c.iconText} mb-2`}>{icon}</span>
      <p className="font-serif text-[12.5px] font-semibold text-ink mb-1 leading-snug">{title}</p>
      <p className="text-[10px] text-muted leading-snug">{desc}</p>
    </motion.div>
  )
}

// ─── Flow Diagram: AI Video Journey (4-step loop) ─────────────────────────
function FlowDiagram() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 select-none py-4 px-3">
      <div className="flex items-stretch gap-1.5 w-full px-1">
        <FlowStepCard step="01" tint="violet" delay={0.1}
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3" /><path d="M6.5 5.5L11 8L6.5 10.5V5.5Z" fill="currentColor" /></svg>}
          title="Reference Video" desc="Provide a video or visual template as reference." />
        <span className="self-center shrink-0 text-violet-400"><IconArrowRightSm /></span>
        <FlowStepCard step="02" tint="green" delay={0.18}
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L14 4.5V11.5L8 14.5L2 11.5V4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M2 4.5L8 7.5L14 4.5M8 7.5V14.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>}
          title="Product Inputs" desc="Add your product images and key details." />
        <span className="self-center shrink-0 text-violet-400"><IconArrowRightSm /></span>
        <FlowStepCard step="03" tint="orange" delay={0.26}
          icon={<svg width="16" height="16" viewBox="0 0 20 20" fill="none"><path d="M10 0 C10.5 6.5 13.5 9.5 20 10 C13.5 10.5 10.5 13.5 10 20 C9.5 13.5 6.5 10.5 0 10 C6.5 9.5 9.5 6.5 10 0Z" fill="currentColor" /></svg>}
          title="AI Adapts" desc="Automatically adapts the scenes, style and environment to your product." />
        <span className="self-center shrink-0 text-violet-400"><IconArrowRightSm /></span>
        <FlowStepCard step="04" tint="violet" delay={0.34}
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3" /><path d="M6.5 5.5L11 8L6.5 10.5V5.5Z" fill="currentColor" /></svg>}
          title="Customised Output" desc="Get product-specific videos ready to use." />
      </div>
    </div>
  )
}

function ProjectBubble({ children, comingSoon = false, placement = 'bottom' }: { children: React.ReactNode; comingSoon?: boolean; placement?: 'bottom' | 'right' }) {
  const [showBubble, setShowBubble] = useState(false)
  const tooltipId = useId()

  return (
    <div
      className={`relative h-full ${placement === 'right' ? 'mb-4' : 'pb-14'}`}
      aria-describedby={showBubble ? tooltipId : undefined}
      onMouseEnter={() => setShowBubble(true)}
      onMouseLeave={() => setShowBubble(false)}
      onFocus={() => setShowBubble(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setShowBubble(false)
      }}
      onClick={() => setShowBubble(true)}
      onKeyDown={(event) => { if (event.key === 'Escape') setShowBubble(false) }}
    >
      {children}
      {showBubble && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`pointer-events-none absolute z-20 inline-flex min-h-9 w-max max-w-[calc(100%_-_8px)] items-center gap-2 rounded-lg border border-cyan-300/40 bg-[#151923] px-3 py-2 text-center text-[11px] leading-tight text-white shadow-[0_4px_18px_rgba(34,211,238,0.14)] ${placement === 'right' ? 'right-3 top-1/2 -translate-y-1/2 2xl:left-full 2xl:right-auto 2xl:ml-3' : 'bottom-1 left-1/2 -translate-x-1/2'}`}
        >
          <span aria-hidden="true" className={`absolute bg-cyan-400/60 ${placement === 'right' ? '-left-2 top-1/2 h-px w-2' : '-top-2 left-1/2 h-2 w-px'}`} />
          {comingSoon ? <Orbit aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-300" /> : <Rocket aria-hidden="true" className="h-4 w-4 shrink-0 text-cyan-300" />}
          <span>{comingSoon ? 'In progress · Coming soon' : 'Click to explore'}</span>
          <Sparkles aria-hidden="true" className="h-3 w-3 shrink-0 text-amber-200" />
        </div>
      )}
    </div>
  )
}

// ─── Project Card (small bento) ──────────────────────────────────────────
interface SmallCardProps {
  title: string
  description: string
  tags: string[]
  tagColor: string
  delay?: number
  mockup?: React.ReactNode
  comingSoon?: boolean
}
function SmallCard({ title, description, tags, tagColor, delay = 0, mockup, comingSoon = false }: SmallCardProps) {
  return (
    <ProjectBubble comingSoon={comingSoon}>
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '180px' }}
      transition={{ duration: 0.38, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6, boxShadow: '0 24px 64px rgba(0,0,0,0.10)', transition: { duration: 0.12 } }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white/60 backdrop-blur-sm p-7 ${comingSoon ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* Mock visual strip */}
      {mockup ? (
        <div className="mb-6 h-40 w-full rounded-xl overflow-hidden bg-stone-50/80 border border-stone-100 flex items-center justify-center">
          {mockup}
        </div>
      ) : (
        <div className="mb-6 h-40 w-full rounded-xl bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-100" />
      )}

      <h3 className="font-serif text-[1.3rem] font-medium leading-snug text-ink mb-2.5">{title}</h3>
      <p className="font-sans text-[13.5px] text-muted leading-relaxed mb-5 flex-1">{description}</p>

      <div className="flex items-center justify-between">
        <span
          className="text-[11px] font-semibold tracking-wide px-3 py-1.5 rounded-full"
          style={{ background: `${tagColor}18`, color: tagColor }}
        >
          {tags[0]} / {tags[1]}
        </span>
        <motion.button
          type="button"
          aria-label={comingSoon ? `${title}: coming soon` : `View ${title} case study`}
          whileHover={{ scale: 1.12, transition: { duration: 0.1 } }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200/80 bg-white/80 text-muted hover:text-ink hover:border-stone-300 transition-colors duration-100"
        >
          <IconArrowUpRight />
        </motion.button>
      </div>
    </motion.div>
    </ProjectBubble>
  )
}

// ─── Mock visuals for small cards ────────────────────────────────────────
function MockScore() {
  return (
    <div className="flex items-center gap-4 px-4 w-full">
      <div className="flex flex-col items-center">
        <span className="font-serif text-2xl font-medium text-ink">86</span>
        <span className="text-[9px] text-muted font-medium">/100</span>
      </div>
      <div className="flex-1 space-y-1.5">
        {[['Title', '92'], ['Images', '78'], ['Keywords', '88'], ['Quality', '84']].map(([l, v]) => (
          <div key={l} className="flex items-center gap-2">
            <span className="text-[9px] text-muted w-12 shrink-0">{l}</span>
            <div className="flex-1 h-1.5 rounded-full bg-stone-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${v}%` }}
                viewport={{ once: true, margin: '180px' }}
                transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
                className="h-full rounded-full bg-violet-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MockMatchmaking() {
  return (
    <div className="flex flex-col gap-2 px-4 w-full">
      {[
        { name: 'Dr. Anaya S.', match: '96%', color: '#a5b4fc' },
        { name: 'Dr. Ravi M.', match: '88%', color: '#99f6e4' },
        { name: 'Dr. Priya K.', match: '81%', color: '#fda4af' },
      ].map(({ name, match, color }) => (
        <div key={name} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-stone-50/80 border border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full" style={{ background: `${color}55` }} />
            <span className="text-[10px] font-medium text-ink">{name}</span>
          </div>
          <span className="text-[10px] font-semibold" style={{ color }}>{match}</span>
        </div>
      ))}
    </div>
  )
}

function MockFintech() {
  return (
    <div className="flex items-end gap-2 px-4 w-full h-full pb-2">
      <div className="flex flex-col items-start mb-1">
        <span className="text-[10px] font-semibold text-emerald-600">+40%</span>
        <span className="text-[9px] text-muted">User Growth</span>
      </div>
      <svg viewBox="0 0 120 50" className="flex-1 h-16" fill="none">
        <motion.path
          d="M0 45 C20 40 35 38 50 28 C65 18 80 22 95 14 C105 9 115 8 120 5"
          stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" fill="none"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true, margin: '180px' }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
        />
        <motion.path
          d="M0 45 C20 40 35 38 50 28 C65 18 80 22 95 14 C105 9 115 8 120 5 L120 50 L0 50 Z"
          fill="url(#fintechGrad)" opacity="0.18"
          initial={{ opacity: 0 }} whileInView={{ opacity: 0.18 }} viewport={{ once: true, margin: '180px' }}
          transition={{ duration: 0.7, delay: 0.15 }}
        />
        <defs>
          <linearGradient id="fintechGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}

// ─── Chonkers Card ──────────────────────────────────────────────────────────
function MockChonkers() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Warm glow */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(251,191,36,0.08) 0%, transparent 70%)' }} />

      {/* Dog SVG illustration */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10"
      >
        <svg viewBox="0 0 120 100" width="120" height="100" fill="none">
          {/* Body */}
          <ellipse cx="60" cy="72" rx="28" ry="20" fill="#fde68a" stroke="#d97706" strokeWidth="1.2"/>
          {/* Head */}
          <ellipse cx="60" cy="46" rx="20" ry="18" fill="#fde68a" stroke="#d97706" strokeWidth="1.2"/>
          {/* Left ear */}
          <ellipse cx="43" cy="34" rx="9" ry="13" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" transform="rotate(-15 43 34)"/>
          {/* Right ear */}
          <ellipse cx="77" cy="34" rx="9" ry="13" fill="#fbbf24" stroke="#d97706" strokeWidth="1.2" transform="rotate(15 77 34)"/>
          {/* Eyes */}
          <circle cx="53" cy="44" r="3.5" fill="#1c1917"/>
          <circle cx="67" cy="44" r="3.5" fill="#1c1917"/>
          <circle cx="54.2" cy="43" r="1.2" fill="white"/>
          <circle cx="68.2" cy="43" r="1.2" fill="white"/>
          {/* Nose */}
          <ellipse cx="60" cy="51" rx="4" ry="2.8" fill="#92400e"/>
          {/* Mouth */}
          <path d="M56 54 Q60 57.5 64 54" stroke="#92400e" strokeWidth="1.1" strokeLinecap="round" fill="none"/>
          {/* Tail */}
          <path d="M88 65 Q100 50 96 42" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" fill="none"/>
          {/* Front legs */}
          <rect x="46" y="86" width="8" height="12" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="1"/>
          <rect x="66" y="86" width="8" height="12" rx="4" fill="#fde68a" stroke="#d97706" strokeWidth="1"/>
          {/* Paw pads */}
          <ellipse cx="50" cy="98" rx="4" ry="2" fill="#fbbf24"/>
          <ellipse cx="70" cy="98" rx="4" ry="2" fill="#fbbf24"/>
        </svg>
      </motion.div>

      {/* Floating health icons */}
      {[
        { icon: '❤️', x: -44, y: -10, delay: 0 },
        { icon: '✦', x: 40, y: -14, delay: 0.6 },
        { icon: '💊', x: -36, y: 20, delay: 1.1 },
      ].map(({ icon, x, y, delay }) => (
        <motion.span
          key={icon}
          animate={{ y: [y, y - 5, y], opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 3.5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
          className="absolute text-[11px] select-none pointer-events-none"
          style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
        >
          {icon}
        </motion.span>
      ))}
    </div>
  )
}

function ChonkersCard({ delay = 0 }: { delay?: number }) {
  return (
    <ProjectBubble>
    <Link href="/work/chonkers" className="block h-full">
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '180px' }}
      transition={{ duration: 0.38, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -7, boxShadow: '0 24px 60px rgba(251,191,36,0.12), 0 8px 24px rgba(0,0,0,0.08)', transition: { duration: 0.12 } }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-white/70 to-amber-50/40 backdrop-blur-sm p-7 cursor-default"
    >
      {/* Warm glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 30%, rgba(251,191,36,0.07) 0%, transparent 70%)' }}
      />

      {/* Sketch star top-right */}
      <motion.svg
        viewBox="0 0 24 24" className="absolute top-3 right-3 w-4 h-4 opacity-30 group-hover:opacity-60 transition-opacity duration-100" fill="none"
        animate={{ rotate: [0, 15, 0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path d="M12 2L13.8 9H21L15.1 13.3L17.3 20.5L12 16L6.7 20.5L8.9 13.3L3 9H10.2Z" stroke="#d97706" strokeWidth="1" fill="none"/>
      </motion.svg>

      {/* Mock visual */}
      <div className="mb-6 h-40 w-full rounded-xl overflow-hidden bg-stone-50/60 border border-amber-100/60 flex items-center justify-center">        <MockChonkers />
      </div>

      <h3 className="font-serif text-[1.15rem] font-medium leading-snug text-ink mb-2">Chonkers</h3>
      <p className="font-sans text-[13px] text-muted leading-relaxed mb-4 flex-1">
        Designed an AI-powered pet care platform that helps pet owners track health, automate routines, and receive personalized care insights through a contextual AI assistant.
      </p>

      <div className="flex items-center justify-between">
        <span
          className="text-[10.5px] font-semibold tracking-wide px-2.5 py-1 rounded-full"
          style={{ background: 'rgba(217,119,6,0.09)', color: '#b45309' }}
        >
          AI / Consumer Tech
        </span>
        <motion.button
          whileHover={{ scale: 1.12, transition: { duration: 0.1 } }}
          whileTap={{ scale: 0.94 }}
          className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-200/60 bg-white/80 text-muted hover:text-ink hover:border-amber-300 transition-colors duration-100"
        >
          <IconArrowUpRight />
        </motion.button>
      </div>
    </motion.div>
    </Link>
    </ProjectBubble>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────
export default function WorkSection() {
  return (
    <section
      id="work"
      className="relative w-full scroll-mt-20 bg-[#f7f6f3] overflow-hidden rounded-t-[2.5rem] shadow-[0_-8px_40px_rgba(0,0,0,0.07)]"
    >
      {/* Subtle dot grid background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: 'radial-gradient(circle, #6b6b6b 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glow blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[250px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(153,246,228,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20 pt-10 pb-28">

        {/* ── Section Header ── */}
        <div className="relative mb-8">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-4 flex items-center gap-2 font-sans text-xs font-semibold tracking-[0.18em] text-muted/60 uppercase"
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400"
            />
            02
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-serif text-[2.8rem] font-medium leading-[1.1] tracking-tightest text-ink mb-4"
          >
            Selected Work
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans text-base text-muted font-light max-w-[340px] leading-relaxed"
          >
            A selection of products, systems, and experiments I&#39;ve designed and shipped.
          </motion.p>

          {/* Section divider */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ originX: 0 }}
            className="mt-10 h-px bg-gradient-to-r from-border via-border/50 to-transparent"
          />
        </div>

        {/* ── Featured Flagship Card ── */}
        <ProjectBubble placement="right">
        <Link href="/work/ai-video" className="block">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          whileHover={{ boxShadow: '0 32px 80px rgba(0,0,0,0.09)', transition: { duration: 0.12 } }}
          className="relative overflow-hidden rounded-3xl border border-stone-200/90 bg-white/55 backdrop-blur-md p-6 md:p-7"
        >
          {/* Subtle gradient wash top-right */}
          <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[55%] h-full"
            style={{ background: 'radial-gradient(ellipse 80% 80% at 80% 30%, rgba(167,139,250,0.07) 0%, transparent 70%)' }} />

          {/* Featured label */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200/60 bg-violet-50/60 px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
            <span className="text-[10.5px] font-semibold tracking-[0.12em] text-violet-600 uppercase">Featured Project</span>
          </div>

          <div className="flex flex-col md:flex-row md:gap-8">
            {/* Left — content */}
            <div className="flex flex-col md:w-[34%]">
              <h3 className="font-serif text-[1.9rem] font-medium leading-[1.1] tracking-tightest text-ink mb-2">
                AI Video <span className="italic" style={{ color: '#7c3aed' }}>Journey</span>
              </h3>
              <p className="font-serif text-[1rem] font-medium text-ink mb-3">
                From reference to customised product videos.
              </p>

              <p className="font-sans text-[12.5px] text-muted leading-relaxed mb-5 max-w-[360px]">
                Turn a reference video into a product-specific video by adapting its scenes, style and environment to your product.
              </p>

              {/* Metrics */}
              <div className="flex items-start gap-5 mb-6">
                {[
                  { value: '90%', label: <>Manual work<br />reduced</>, color: '#059669' },
                  { value: '1-Step', label: <>DIY journey<br />for users</>, color: '#0f172a' },
                  { value: 'Custom', label: <>Product-specific<br />output</>, color: '#7c3aed' },
                ].map(({ value, label, color }, i) => (
                  <div key={i} className="flex items-center gap-5">
                    {i > 0 && <span className="w-px h-9 bg-stone-200 shrink-0" />}
                    <div className="flex flex-col">
                      <motion.span
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="font-serif text-[1.4rem] font-medium tracking-tighter"
                        style={{ color }}
                      >
                        {value}
                      </motion.span>
                      <span className="font-sans text-[10.5px] text-muted mt-1 leading-snug">{label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {['AI Video', 'Product Adaptation', 'Generative AI', 'Workflow Design'].map(tag => (
                  <span key={tag} className="rounded-full border border-stone-200/80 bg-stone-50/80 px-3 py-1 text-[11px] font-medium text-muted">
                    {tag}
                  </span>
                ))}
              </div>

              <motion.span
                whileHover={{ scale: 1.04, transition: { duration: 0.1 } }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.18 }}
                className="self-start inline-flex items-center gap-2 rounded-full bg-ink text-white px-5 py-2.5 text-[12.5px] font-medium tracking-wide hover:bg-ink/80 transition-colors duration-100"
              >
                View Case Study <IconArrowUpRight />
              </motion.span>
            </div>

            {/* Right — Flow diagram */}
            <div className="relative mt-8 md:mt-0 md:flex-1 min-h-[260px] md:min-h-0 rounded-2xl border border-stone-100 bg-stone-50/50 overflow-hidden">
              <FlowDiagram />
            </div>
          </div>
        </motion.div>
        </Link>
        </ProjectBubble>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ChonkersCard delay={0.05} />
          <Link href="/work/talk-to-me" className="block">
            <SmallCard
              title="Therapist Matchmaking Platform"
              description="Designed a matchmaking platform that connected users with therapists using behavioral and preference signals."
              tags={['Marketplace', 'HealthTech']}
              tagColor="#f9a8d4"
              delay={0.12}
              mockup={<MockMatchmaking />}
            />
          </Link>
          <SmallCard
            title="Tanzanian Fintech Expansion"
            description="Worked on localizing fintech lending workflows and GTM systems for product expansion into Tanzania."
            tags={['Fintech', 'Strategy']}
            tagColor="#34d399"
            delay={0.18}
            mockup={<MockFintech />}
            comingSoon
          />
          <SmallCard
            title="Amazon Listing Score System"
            description="Built an AI-assisted scoring engine that evaluated Amazon listings and generated optimization recommendations for sellers."
            tags={['AI', 'E-commerce']}
            tagColor="#818cf8"
            delay={0.24}
            mockup={<MockScore />}
            comingSoon
          />
        </div>

      </div>
    </section>
  )
}
