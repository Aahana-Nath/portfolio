'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import SolutionSection from './SolutionSection'
import DesigningExperienceSection from './DesigningExperienceSection'
import ProductDecisionsSection from './ProductDecisionsSection'
import KeyLearningsSection from './KeyLearningsSection'

// ── Animation helper ──────────────────────────────────────────────────────
function fadeUp(delay = 0, duration = 0.42) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '180px' } as const,
    transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }
}

// ── Tiny icons ─────────────────────────────────────────────────────────────
function IconArrowUpRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 13 13" fill="none" className="inline-block">
      <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconChatBubble() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M2 4.5C2 3.4 2.9 2.5 4 2.5H16C17.1 2.5 18 3.4 18 4.5V12C18 13.1 17.1 14 16 14H8L4 17.5V14H4C2.9 14 2 13.1 2 12V4.5Z" fill="#7c3aed" />
      <circle cx="7" cy="8.2" r="1" fill="white" />
      <circle cx="10" cy="8.2" r="1" fill="white" />
      <circle cx="13" cy="8.2" r="1" fill="white" />
    </svg>
  )
}

// ── Top nav bar ─────────────────────────────────────────────────────────
function NavBar() {
  const links = ['Overview', 'Research', 'Users', 'Solution', 'Design', 'Impact']
  return (
    <div className="relative z-20 flex items-center justify-between border-b border-stone-200/70 bg-white/80 backdrop-blur-sm px-6 md:px-10 py-4">
      <div className="flex items-center gap-2">
        <IconChatBubble />
        <span className="font-serif text-[15px] font-semibold text-ink">Talk To ME</span>
      </div>

      <nav className="hidden md:flex items-center gap-7">
        {links.map((l, i) => (
          <span
            key={l}
            className={`text-[13px] font-medium tracking-wide transition-colors ${
              i === links.length - 2 ? 'text-violet-600' : 'text-muted hover:text-ink'
            }`}
          >
            {l}
          </span>
        ))}
      </nav>

      <button className="inline-flex items-center gap-1.5 rounded-full bg-ink text-white px-4 py-2 text-[12px] font-medium tracking-wide hover:bg-ink/85 transition-colors duration-150">
        View Full Prototype <IconArrowUpRight />
      </button>
    </div>
  )
}

// ── Reusable phone frame ───────────────────────────────────────────────────
function PhoneFrame({ children, width = 190, rotate = 0, className = '' }: { children: React.ReactNode; width?: number; rotate?: number; className?: string }) {
  return (
    <div
      className={`relative shrink-0 ${className}`}
      style={{ width, transform: `rotate(${rotate}deg)` }}
    >
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: width * 0.14,
          border: `${Math.max(3, Math.round(width * 0.03))}px solid #1c1917`,
          background: '#1c1917',
          boxShadow: '0 30px 70px rgba(76,29,149,0.22), 0 6px 18px rgba(0,0,0,0.12)',
        }}
      >
        <div className="relative overflow-hidden bg-white" style={{ borderRadius: width * 0.11, aspectRatio: '9 / 19.2' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

// ── Screens: real app screenshots ──────────────────────────────────────────
function BehavioralHealthScreen() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-26_at_14.25.29.png" alt="Talk To ME — Behavioral Health Service onboarding" className="w-full h-full object-cover object-top" />
  )
}
function MentalHealthScreen() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-26_at_14.25.47.png" alt="Talk To ME — Mental Health Service onboarding" className="w-full h-full object-cover object-top" />
  )
}
function SplashScreen() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-26_at_14.26.07.png" alt="Talk To ME — splash screen" className="w-full h-full object-cover object-top" />
  )
}

// ── Galaxy background (light violet variant) ───────────────────────────────
const HERO_DOTS = [
  { left: 8, top: 22 }, { left: 22, top: 44 }, { left: 14, top: 68 }, { left: 34, top: 16 },
  { left: 62, top: 20 }, { left: 78, top: 40 }, { left: 91, top: 58 }, { left: 88, top: 24 },
  { left: 46, top: 12 }, { left: 6, top: 48 }, { left: 96, top: 46 }, { left: 55, top: 34 },
  { left: 3, top: 12 }, { left: 18, top: 88 }, { left: 40, top: 72 }, { left: 50, top: 90 },
  { left: 68, top: 8 }, { left: 84, top: 76 }, { left: 98, top: 16 }, { left: 30, top: 52 },
  { left: 74, top: 62 }, { left: 42, top: 30 }, { left: 12, top: 32 }, { left: 58, top: 56 },
  { left: 2, top: 62 }, { left: 26, top: 6 }, { left: 36, top: 96 }, { left: 64, top: 44 },
  { left: 82, top: 8 }, { left: 94, top: 66 }, { left: 10, top: 78 }, { left: 48, top: 58 },
  { left: 20, top: 24 }, { left: 88, top: 92 }, { left: 60, top: 4 }, { left: 4, top: 92 },
  { left: 76, top: 90 }, { left: 38, top: 40 }, { left: 100, top: 30 }, { left: 52, top: 14 },
]
const HERO_SPARKLES = [
  { left: 27, top: 20 }, { left: 90, top: 30 }, { left: 60, top: 78 },
  { left: 16, top: 55 }, { left: 72, top: 14 }, { left: 44, top: 64 },
  { left: 6, top: 30 }, { left: 96, top: 76 },
]

// ── Constellations: a few connected star clusters ───────────────────────────
const CONSTELLATIONS = [
  { points: [[9, 20], [16, 13], [25, 18], [32, 9], [24, 30]], edges: [[0, 1], [1, 2], [2, 3], [2, 4]] },
  { points: [[68, 58], [77, 50], [86, 56], [93, 46], [80, 68]], edges: [[0, 1], [1, 2], [2, 3], [1, 4]] },
]

function IconSparkle({ size = 14, color = '#a78bfa' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 0 C10.5 6.5 13.5 9.5 20 10 C13.5 10.5 10.5 13.5 10 20 C9.5 13.5 6.5 10.5 0 10 C6.5 9.5 9.5 6.5 10 0Z" fill={color} />
    </svg>
  )
}

function GalaxyBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* Nebula haze */}
      <div className="absolute -top-20 left-1/3 w-[520px] h-[420px] rounded-full blur-3xl" style={{ background: 'radial-gradient(ellipse, rgba(167,139,250,0.2) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-0 w-[420px] h-[320px] rounded-full blur-3xl" style={{ background: 'radial-gradient(ellipse, rgba(244,114,182,0.14) 0%, transparent 70%)' }} />

      {/* Secondary crescent planet, upper right */}
      <div className="absolute rounded-full" style={{
        width: 70, height: 70, right: '6%', top: '14%',
        background: 'radial-gradient(circle at 34% 32%, rgba(255,255,255,0.95) 0%, rgba(167,139,250,0.65) 45%, rgba(124,58,237,0.25) 68%, transparent 80%)',
        boxShadow: '0 0 32px 6px rgba(167,139,250,0.18)',
      }} />

      {/* Rose planet, lower left */}
      <div className="absolute rounded-full" style={{
        width: 38, height: 38, left: '9%', bottom: '10%',
        background: 'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.9) 0%, rgba(244,114,182,0.7) 45%, rgba(190,24,93,0.3) 70%, transparent 82%)',
        boxShadow: '0 0 22px 4px rgba(244,114,182,0.2)',
      }} />

      {/* Mint moon with a tilted ring, mid-right */}
      <motion.div className="absolute" style={{ width: 30, height: 30, right: '20%', top: '62%' }}
        animate={{ y: [0, -6, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}>
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 34% 32%, rgba(255,255,255,0.95) 0%, rgba(153,246,228,0.75) 45%, rgba(13,148,136,0.25) 70%, transparent 82%)',
          boxShadow: '0 0 18px 3px rgba(153,246,228,0.2)',
        }} />
        <div className="absolute rounded-full border" style={{ inset: -6, borderColor: 'rgba(153,246,228,0.35)', transform: 'rotate(-18deg) scaleY(0.4)' }} />
      </motion.div>

      {/* Tiny moon beside the main crescent planet */}
      <div className="absolute rounded-full" style={{
        width: 12, height: 12, right: '14%', top: '9%',
        background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.95) 0%, rgba(196,181,253,0.6) 60%, transparent 85%)',
      }} />

      {/* Amber planet, upper left */}
      <motion.div className="absolute rounded-full" style={{ width: 26, height: 26, left: '22%', top: '6%' }}
        animate={{ y: [0, 7, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 34% 32%, rgba(255,255,255,0.95) 0%, rgba(253,186,116,0.75) 45%, rgba(194,65,12,0.28) 70%, transparent 82%)',
          boxShadow: '0 0 18px 3px rgba(253,186,116,0.2)',
        }} />
      </motion.div>

      {/* Pale blue dwarf planet, far bottom-right */}
      <div className="absolute rounded-full" style={{
        width: 46, height: 46, right: '4%', bottom: '4%',
        background: 'radial-gradient(circle at 32% 30%, rgba(255,255,255,0.92) 0%, rgba(147,197,253,0.65) 45%, rgba(29,78,216,0.25) 70%, transparent 82%)',
        boxShadow: '0 0 24px 4px rgba(147,197,253,0.18)',
      }} />

      {/* Small lilac planet, mid-left */}
      <motion.div className="absolute rounded-full" style={{ width: 18, height: 18, left: '4%', top: '38%' }}
        animate={{ y: [0, -5, 0] }} transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}>
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle at 34% 32%, rgba(255,255,255,0.95) 0%, rgba(216,180,254,0.75) 50%, rgba(126,34,206,0.28) 75%, transparent 85%)',
          boxShadow: '0 0 14px 2px rgba(216,180,254,0.2)',
        }} />
      </motion.div>

      {/* Orbit rings */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 800" fill="none" preserveAspectRatio="none">
        <ellipse cx="750" cy="240" rx="900" ry="190" stroke="rgba(139,92,246,0.16)" strokeWidth="1" fill="none" />
        <ellipse cx="850" cy="560" rx="760" ry="150" stroke="rgba(244,114,182,0.12)" strokeWidth="1" fill="none" />
      </svg>

      {/* Constellations: thin connecting lines + bright vertex stars */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {CONSTELLATIONS.map((c, ci) => (
          <g key={ci}>
            {c.edges.map(([a, b], ei) => (
              <line key={ei}
                x1={c.points[a][0]} y1={c.points[a][1]} x2={c.points[b][0]} y2={c.points[b][1]}
                stroke="rgba(167,139,250,0.35)" strokeWidth="0.15" vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        ))}
      </svg>
      {CONSTELLATIONS.flatMap((c, ci) => c.points.map(([left, top], pi) => (
        <motion.span key={`${ci}-${pi}`} className="absolute rounded-full bg-white"
          style={{ left: `${left}%`, top: `${top}%`, width: 3, height: 3, boxShadow: '0 0 6px 1px rgba(167,139,250,0.6)' }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3.5 + pi, repeat: Infinity, delay: pi * 0.4, ease: 'easeInOut' }} />
      )))}

      {/* Sparkle flares along the orbit */}
      {HERO_SPARKLES.map((s, i) => (
        <motion.span key={i} className="absolute" style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0.25, 0.85, 0.25], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}>
          <IconSparkle size={12} />
        </motion.span>
      ))}

      {/* Ambient star dots */}
      {HERO_DOTS.map((s, i) => (
        <motion.span key={i} className="absolute rounded-full bg-violet-400"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: 2.5, height: 2.5 }}
          animate={{ opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} />
      ))}
    </div>
  )
}

// ── SECTION: Hero ──────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(160deg,#f5f3ff 0%,#ede9fe 55%,#f7f6f3 100%)' }}>
      <NavBar />

      <GalaxyBackground />

      <div className="relative z-10 mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20 pt-12 pb-20 flex flex-col md:flex-row md:items-center gap-12">
        {/* Left — content */}
        <div className="relative z-10 md:w-[46%] shrink-0">
          <motion.div {...fadeUp(0)}>
            <Link href="/" className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-muted hover:text-ink transition-colors tracking-wide mb-6 group">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform duration-200">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Work
            </Link>
          </motion.div>

          <motion.p {...fadeUp(0.05)} className="text-[13px] font-semibold tracking-[0.18em] text-muted/70 uppercase mb-4">
            03 — Product Design
          </motion.p>

          <motion.h1 {...fadeUp(0.1)} className="font-serif text-[4.2rem] md:text-[5.2rem] font-medium leading-[1.02] tracking-tightest mb-4">
            <span style={{ color: '#7c3aed' }}>Talk</span> <span className="text-ink">To</span> <span style={{ color: '#7c3aed' }}>ME</span>
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="font-serif text-[1.7rem] font-medium text-ink mb-5 leading-snug">
            Your safe space to talk &amp; heal.
          </motion.p>

          <motion.p {...fadeUp(0.22)} className="font-sans text-[17px] text-muted leading-relaxed mb-7 max-w-[440px]">
            A therapist–user platform designed to make finding the right therapist, scheduling sessions and accessing support more accessible.
          </motion.p>

          <motion.div {...fadeUp(0.28)} className="flex flex-wrap gap-2 mb-7">
            {['UX Research', 'Product Design', 'Product Strategy'].map(tag => (
              <span key={tag} className="text-[13px] font-medium px-3.5 py-1.5 rounded-full border border-violet-200/70 bg-violet-50/70 text-violet-700">{tag}</span>
            ))}
          </motion.div>
        </div>

        {/* Right — phone mockups */}
        <div className="relative z-10 flex-1 min-h-[460px] md:min-h-[540px] flex items-center justify-center">

          <div className="relative flex items-center justify-center" style={{ width: 600, maxWidth: '100%' }}>
            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -8 }}
              whileInView={{ opacity: 1, y: 0, rotate: -8 }}
              viewport={{ once: true, margin: '180px' }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute z-10"
              style={{ left: '2%', top: '10%' }}
            >
              <PhoneFrame width={200}>
                <BehavioralHealthScreen />
              </PhoneFrame>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '180px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative z-20"
            >
              <PhoneFrame width={240}>
                <SplashScreen />
              </PhoneFrame>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotate: 8 }}
              whileInView={{ opacity: 1, y: 0, rotate: 8 }}
              viewport={{ once: true, margin: '180px' }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute z-30"
              style={{ right: '0%', top: '16%' }}
            >
              <PhoneFrame width={210}>
                <MentalHealthScreen />
              </PhoneFrame>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Stat card icons ─────────────────────────────────────────────────────
function IconUsers() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="7" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 17c.6-3.2 2.7-5 5-5s4.4 1.8 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.5" cy="7" r="2.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M13 12c2 .1 3.7 1.6 4.2 4.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconQuestion() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M7.6 7.6c.3-1.4 1.5-2.3 2.9-2 1.3.2 2.2 1.3 2 2.6-.2 1.2-1.6 1.6-2.1 2.6-.2.4-.3.9-.3 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="10" cy="14.4" r="0.9" fill="currentColor" />
    </svg>
  )
}
function IconChartDollar() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <path d="M2 17h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="4" y="11" width="3" height="6" rx="0.8" fill="currentColor" />
      <rect x="8.5" y="7" width="3" height="10" rx="0.8" fill="currentColor" />
      <rect x="13" y="12.5" width="3" height="4.5" rx="0.8" fill="currentColor" />
    </svg>
  )
}

// ── Stat card ───────────────────────────────────────────────────────────
function StatCard({ icon, iconTint, value, label, delay = 0 }: { icon: React.ReactNode; iconTint: 'violet' | 'ink'; value: string; label: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '180px' }}
      transition={{ duration: 0.42, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-2xl border border-stone-200/70 bg-white/70 pt-7 pb-7 px-10"
    >
      <span className={`flex items-center justify-center w-12 h-12 rounded-xl mb-5 ${iconTint === 'violet' ? 'bg-violet-100 text-violet-600' : 'bg-stone-100 text-ink'}`}>
        {icon}
      </span>
      <p className="font-serif text-[2.5rem] font-medium text-ink tracking-tightest leading-none mb-3">{value}</p>
      <p className="font-sans text-[14px] text-muted leading-relaxed">{label}</p>
    </motion.div>
  )
}

// ── SECTION: The Context ───────────────────────────────────────────────────
function ContextSection() {
  return (
    <section className="relative bg-[#faf9f7] pt-20 pb-10 md:pt-28 md:pb-14 overflow-hidden" style={{ borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.06)' }}>
      <div className="relative z-10 mx-auto max-w-[1520px] px-6 md:px-12 lg:px-20 grid grid-cols-1 lg:grid-cols-[0.55fr_1.45fr] gap-10 lg:gap-16 items-center">
        {/* Left — label, heading, description */}
        <div>
          <motion.p {...fadeUp(0)} className="text-[11px] font-semibold tracking-[0.18em] text-muted/70 uppercase mb-4">
            01 — The Context
          </motion.p>
          <motion.h2 {...fadeUp(0.06)} className="font-serif text-[2.4rem] md:text-[2.9rem] font-medium leading-[1.1] tracking-tightest text-ink mb-5">
            Therapy shouldn&#39;t be difficult to access.
          </motion.h2>
          <motion.p {...fadeUp(0.12)} className="font-sans text-[15px] text-muted leading-relaxed max-w-[420px]">
            Despite growing awareness, many people still hesitate to seek therapy due to uncertainty, lack of the right fit, and concerns around effectiveness and privacy.
          </motion.p>
        </div>

        {/* Right — stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard icon={<IconUsers />} iconTint="violet" value="70.16%" label="of respondents were not sure if they will find the right therapist." delay={0.05} />
          <StatCard icon={<IconQuestion />} iconTint="violet" value="25.6%" label="were not sure if therapy can help." delay={0.12} />
          <StatCard icon={<IconChartDollar />} iconTint="ink" value="$97.14B" label="Mental health market revenue expected to reach $97.14B by 2025." delay={0.19} />
        </div>
      </div>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ originX: 0.5 }}
        className="relative z-10 mx-auto max-w-[1520px] mt-14 md:mt-16 px-6 md:px-12 lg:px-20"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-stone-300/70 to-transparent" />
      </motion.div>
    </section>
  )
}

// ── Persona icons ───────────────────────────────────────────────────────
function IconQuote() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
      <path d="M0 8.2C0 3.6 2.5.9 6.6 0l.7 1.9C4.7 2.7 3.4 4.2 3.2 6.1c.4-.2.9-.3 1.4-.3 1.7 0 2.9 1.2 2.9 3s-1.3 3.2-3.1 3.2C1.9 12 0 10.4 0 8.2Zm8.4 0C8.4 3.6 10.9.9 15 0l.7 1.9c-2.6.8-3.9 2.3-4.1 4.2.4-.2.9-.3 1.4-.3 1.7 0 2.9 1.2 2.9 3s-1.3 3.2-3.1 3.2c-2.5 0-4.4-1.6-4.4-3.8Z" fill="#7c3aed" />
    </svg>
  )
}
// ── Small badge icons used inside the persona detail card ──────────────────
type BadgeIconName = 'user' | 'briefcase' | 'pin' | 'calendar' | 'lock' | 'heart' | 'search' | 'clock' | 'question'

function BadgeIcon({ name }: { name: BadgeIconName }) {
  const common = { width: 15, height: 15, viewBox: '0 0 16 16', fill: 'none' } as const
  switch (name) {
    case 'user':
      return <svg {...common}><circle cx="8" cy="5.4" r="2.6" stroke="currentColor" strokeWidth="1.3" /><path d="M2.8 13.5c.7-3 2.6-4.6 5.2-4.6s4.5 1.6 5.2 4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'briefcase':
      return <svg {...common}><rect x="2" y="5.5" width="12" height="8" rx="1.4" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 5.5V4.2c0-.7.6-1.2 1.2-1.2h2.6c.7 0 1.2.5 1.2 1.2v1.3" stroke="currentColor" strokeWidth="1.3" /><path d="M2 9.2h12" stroke="currentColor" strokeWidth="1.3" /></svg>
    case 'pin':
      return <svg {...common}><path d="M8 14.2s5-4.4 5-8a5 5 0 1 0-10 0c0 3.6 5 8 5 8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><circle cx="8" cy="6.2" r="1.7" stroke="currentColor" strokeWidth="1.2" /></svg>
    case 'calendar':
      return <svg {...common}><rect x="2" y="3.2" width="12" height="10.6" rx="1.4" stroke="currentColor" strokeWidth="1.3" /><path d="M2 6.6h12M5.3 2v2.4M10.7 2v2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'lock':
      return <svg {...common}><rect x="3" y="7" width="10" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.3" /><path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" /></svg>
    case 'heart':
      return <svg {...common}><path d="M8 13.6S2.2 10 2.2 6.2a2.8 2.8 0 0 1 5.1-1.6L8 5.4l.7-.8a2.8 2.8 0 0 1 5.1 1.6c0 3.8-5.8 7.4-5.8 7.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
    case 'search':
      return <svg {...common}><circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.3" /><path d="M10.2 10.2L14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'clock':
      return <svg {...common}><circle cx="8" cy="8" r="5.8" stroke="currentColor" strokeWidth="1.3" /><path d="M8 4.8V8l2.4 1.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'question':
      return <svg {...common}><circle cx="8" cy="8" r="5.8" stroke="currentColor" strokeWidth="1.3" /><path d="M6.1 6.3c.2-1.1 1.1-1.8 2.2-1.6 1 .1 1.7 1 1.6 2-.1.9-1.2 1.2-1.6 2-.1.3-.2.6-.2 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="8" cy="11.4" r="0.7" fill="currentColor" /></svg>
  }
}
function IconChevron({ dir = 'left' }: { dir?: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: dir === 'right' ? 'rotate(180deg)' : undefined }}>
      <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Persona data ────────────────────────────────────────────────────────
type PersonaPoint = { icon: BadgeIconName; title: string; desc: string }
type Persona = {
  name: string; initial: string; role: string; age: string; location: string; photo: string; photoImage?: string
  contextTitle: string; contextDesc: React.ReactNode; quote: string; note: string
  coreNeeds: PersonaPoint[]; frustrations: PersonaPoint[]
}

const USER_PERSONAS: Persona[] = [
  {
    name: 'Anjali', initial: 'A', role: 'Associate Director', age: '28 years old', location: 'Mohali',
    photo: 'linear-gradient(135deg,#c4b5fd,#818cf8)',
    photoImage: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/0085d5ed-d5a9-4a87-be4e-356ef02d1a88.png',
    contextTitle: 'Already aware and open to therapy, looking for the right fit in a new city.',
    contextDesc: <>Anjali has been in therapy before and <strong className="text-white">values the positive impact</strong> it has had on her life. After recently relocating to a new city, she&#8217;s looking for a therapist who understands her needs, offers flexible scheduling and maintains a high level of <strong className="text-white">privacy and confidentiality</strong>.</>,
    quote: 'I want to find a therapist who really understands my needs, with flexible scheduling and privacy.',
    note: 'Recently relocated to a new city and looking for continued mental health support.',
    coreNeeds: [
      { icon: 'user', title: 'Right therapist match', desc: 'Someone who understands her needs, preferences and communication style.' },
      { icon: 'calendar', title: 'Flexible scheduling', desc: 'Sessions that fit into her busy work life.' },
      { icon: 'lock', title: 'Privacy and confidentiality', desc: 'A safe and non-judgmental space.' },
      { icon: 'heart', title: 'Consistent support', desc: 'Long-term support for ongoing well-being.' },
    ],
    frustrations: [
      { icon: 'search', title: 'Difficulty finding the right therapist', desc: 'It\u2019s hard to find someone who truly understands her needs and preferences.' },
      { icon: 'clock', title: 'Work and lifestyle constraints', desc: 'Limited availability due to a demanding work schedule and adjusting to a new city.' },
      { icon: 'question', title: 'Uncertainty around fit', desc: 'Not sure if a therapist will be the right fit before starting sessions.' },
      { icon: 'lock', title: 'Privacy concerns', desc: 'Worries about the confidentiality of her information and maintaining anonymity.' },
    ],
  },
  {
    name: 'Rahul', initial: 'R', role: 'Product Manager', age: '30 years old', location: 'Delhi',
    photo: 'linear-gradient(135deg,#93c5fd,#60a5fa)',
    photoImage: 'https://res.cloudinary.com/dvtf1ckaf/image/upload/v1792230913/Screenshot_2026-10-17_at_15.23.18_qyulcp.png',
    contextTitle: 'Curious about therapy but unsure where to start.',
    contextDesc: <>Rahul has never been to therapy before and isn&#8217;t sure if it&#8217;s the right step for him. <strong className="text-white">Long working hours and constant career pressure</strong> have left him stressed, but he&#8217;s hesitant about committing time and money without knowing if it will actually help.</>,
    quote: 'I want to explore therapy but I\u2019m not sure how it can help or if I\u2019ll find the right therapist.',
    note: 'First-time therapy seeker, cautious about making the wrong choice.',
    coreNeeds: [
      { icon: 'user', title: 'Clear guidance', desc: 'Simple explanations of how therapy works and what to expect.' },
      { icon: 'calendar', title: 'Low-commitment entry point', desc: 'A way to try therapy without a long-term commitment.' },
      { icon: 'lock', title: 'Credible therapists', desc: 'Verified credentials and reviews he can trust.' },
      { icon: 'clock', title: 'Convenient scheduling', desc: 'Sessions that work around long working hours.' },
    ],
    frustrations: [
      { icon: 'question', title: 'Not sure it will help', desc: 'Skeptical about whether therapy addresses his specific stress.' },
      { icon: 'clock', title: 'Time pressure', desc: 'Long working hours leave little room for new commitments.' },
      { icon: 'search', title: 'Choice overload', desc: 'Too many therapist profiles with no clear way to compare.' },
      { icon: 'lock', title: 'Fear of judgment', desc: 'Worried about being seen as weak for seeking help.' },
    ],
  },
  {
    name: 'Samantha', initial: 'S', role: 'Teacher', age: '35 years old', location: 'Lucknow',
    photo: 'linear-gradient(135deg,#fda4af,#fb7185)',
    photoImage: 'https://res.cloudinary.com/dvtf1ckaf/image/upload/v1792230914/Screenshot_2026-10-17_at_15.24.26_uenrib.png',
    contextTitle: 'Navigating postpartum anxiety and searching for guidance.',
    contextDesc: <>Samantha recently became a mother and has been struggling with <strong className="text-white">postpartum anxiety</strong>. Between teaching and caring for her newborn, she has little time to search for support and needs <strong className="text-white">guidance she can trust quickly</strong>.</>,
    quote: 'I\u2019m not sure how therapy can help. I\u2019m dealing with postpartum anxiety and need guidance.',
    note: 'New mother balancing work and postpartum anxiety, seeking quick, trustworthy guidance.',
    coreNeeds: [
      { icon: 'user', title: 'Specialized support', desc: 'A therapist experienced with postpartum and maternal mental health.' },
      { icon: 'calendar', title: 'Quick access', desc: 'Fast way to book a session without long searches.' },
      { icon: 'heart', title: 'Emotional reassurance', desc: 'A compassionate, judgment-free space to talk.' },
      { icon: 'lock', title: 'Building confidence', desc: 'Guidance to help her feel confident as a new parent.' },
    ],
    frustrations: [
      { icon: 'clock', title: 'Limited time', desc: 'Balancing teaching and a newborn leaves very little free time.' },
      { icon: 'question', title: 'Not sure where to start', desc: 'Overwhelmed by choices and unsure who specializes in postpartum care.' },
      { icon: 'heart', title: 'Isolation', desc: 'Feels alone in what she\u2019s experiencing.' },
      { icon: 'lock', title: 'Privacy', desc: 'Wants to keep her mental health journey private from colleagues.' },
    ],
  },
]

const THERAPIST_PERSONAS: Persona[] = [
  {
    name: 'Dr. Meera Kapoor', initial: 'M', role: 'Clinical Psychologist', age: '34 years old', location: 'Bangalore',
    photo: 'linear-gradient(135deg,#c4b5fd,#a78bfa)',
    photoImage: 'https://res.cloudinary.com/dvtf1ckaf/image/upload/v1792230913/Screenshot_2026-10-17_at_15.24.03_ciw3zs.png',
    contextTitle: 'Wants to reduce no-shows and manage her practice more efficiently.',
    contextDesc: <>Dr. Meera runs an independent practice and spends significant time <strong className="text-white">manually coordinating schedules</strong> with clients. She wants a platform that <strong className="text-white">reduces no-shows</strong> and lets her focus more on client care and less on admin.</>,
    quote: 'I want a platform that reduces no-shows and lets me manage my schedule without back-and-forth calls.',
    note: 'Established therapist looking to streamline scheduling and reduce admin overhead.',
    coreNeeds: [
      { icon: 'calendar', title: 'Flexible scheduling tools', desc: 'Manage her calendar without constant back-and-forth.' },
      { icon: 'clock', title: 'Reduced no-shows', desc: 'Automated reminders and easy rescheduling.' },
      { icon: 'user', title: 'Right-fit client matching', desc: 'Clients who align with her specialization.' },
      { icon: 'lock', title: 'Secure record keeping', desc: 'A safe way to store client notes and history.' },
    ],
    frustrations: [
      { icon: 'clock', title: 'Manual scheduling', desc: 'Spends hours coordinating appointments by phone and messages.' },
      { icon: 'question', title: 'No-shows', desc: 'Frequent last-minute cancellations affect her income.' },
      { icon: 'search', title: 'Generic client matching', desc: 'Ends up with clients who aren\u2019t the right fit.' },
      { icon: 'lock', title: 'Admin overload', desc: 'Too much time spent on non-clinical tasks.' },
    ],
  },
  {
    name: 'Dr. Arjun Malhotra', initial: 'A', role: 'Therapist', age: '41 years old', location: 'Pune',
    photo: 'linear-gradient(135deg,#93c5fd,#60a5fa)',
    photoImage: 'https://res.cloudinary.com/dvtf1ckaf/image/upload/v1792230914/Screenshot_2026-10-17_at_15.24.16_renyhf.png',
    contextTitle: 'Needs visibility to reach the right clients for his specialization.',
    contextDesc: <>Dr. Arjun has years of experience in a niche specialization but struggles to reach clients who need exactly what he offers. He wants a platform that helps him <strong className="text-white">build trust and visibility</strong> with the right audience.</>,
    quote: 'I need to reach clients who are the right fit for my specialization, not just anyone who finds my number.',
    note: 'Niche specialist seeking better visibility and trust-building with the right clients.',
    coreNeeds: [
      { icon: 'search', title: 'Specialization visibility', desc: 'Being discoverable by clients who need his expertise.' },
      { icon: 'lock', title: 'Trust building', desc: 'Verified profile and reviews.' },
      { icon: 'calendar', title: 'Private practice tools', desc: 'Manage his independent practice easily.' },
      { icon: 'user', title: 'Quality over quantity', desc: 'Fewer, better-matched client leads.' },
    ],
    frustrations: [
      { icon: 'search', title: 'Low visibility', desc: 'Hard to be found by the right audience online.' },
      { icon: 'question', title: 'Generic platforms', desc: 'Existing platforms don\u2019t highlight his specialization.' },
      { icon: 'lock', title: 'Trust gap', desc: 'New clients are hesitant without social proof.' },
      { icon: 'clock', title: 'Time-consuming outreach', desc: 'Spends too much time marketing himself.' },
    ],
  },
  {
    name: 'Dr. Riya Sen', initial: 'R', role: 'Counseling Psychologist', age: '29 years old', location: 'Chennai',
    photo: 'linear-gradient(135deg,#fda4af,#fb7185)',
    photoImage: 'https://res.cloudinary.com/dvtf1ckaf/image/upload/v1792230913/Screenshot_2026-10-17_at_15.23.33_pxc6ov.png',
    contextTitle: 'Early in her career, needs visibility and credibility.',
    contextDesc: <>Dr. Riya recently started her private practice and is still building a client base. She needs a platform that helps new therapists like her <strong className="text-white">gain visibility and establish credibility</strong> quickly.</>,
    quote: 'Early-career therapists like me need visibility and a simple way to build credibility with new clients.',
    note: 'New practitioner focused on building a client base and professional credibility.',
    coreNeeds: [
      { icon: 'search', title: 'Visibility for new therapists', desc: 'A fair chance to be discovered alongside experienced therapists.' },
      { icon: 'lock', title: 'Credibility building', desc: 'Ways to showcase credentials and early client feedback.' },
      { icon: 'calendar', title: 'Simple onboarding', desc: 'An easy way to set up her practice profile.' },
      { icon: 'user', title: 'Supportive community', desc: 'Guidance from more experienced therapists on the platform.' },
    ],
    frustrations: [
      { icon: 'search', title: 'Low visibility', desc: 'New profiles get buried behind established therapists.' },
      { icon: 'lock', title: 'Building trust', desc: 'Hard to earn client trust without a track record.' },
      { icon: 'question', title: 'Client acquisition', desc: 'Struggles to find her first steady clients.' },
      { icon: 'clock', title: 'Limited resources', desc: 'Lacks marketing budget compared to bigger practices.' },
    ],
  },
]

// ── Persona point list (Core Needs / Frustrations column) ──────────────────
function PersonaPointList({ title, points, tone }: { title: string; points: PersonaPoint[]; tone: 'violet' | 'rose' }) {
  const badgeClass = tone === 'violet' ? 'bg-violet-500/20 text-violet-300' : 'bg-rose-500/20 text-rose-300'
  return (
    <div className="h-full flex flex-col rounded-xl border border-white/10 p-4">
      <p className="text-[11px] font-semibold tracking-[0.16em] text-white/40 uppercase mb-3">{title}</p>
      <div className="flex-1 flex flex-col justify-between gap-3">
        {points.map(pt => (
          <div key={pt.title} className="flex items-start gap-3">
            <span className={`flex items-center justify-center w-7 h-7 rounded-full shrink-0 ${badgeClass}`}>
              <BadgeIcon name={pt.icon} />
            </span>
            <div>
              <p className="text-[13px] font-medium text-white leading-snug">{pt.title}</p>
              <p className="text-[12px] text-white/45 leading-snug">{pt.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Persona detail card ─────────────────────────────────────────────────
function PersonaDetail({ persona, index, total }: { persona: Persona; index: number; total: number }) {
  return (
    <motion.div
      key={persona.name}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-3xl p-5 md:p-6"
      style={{ background: '#141119' }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[170px_1fr] gap-6 md:gap-7">
        {/* Left — photo + identity */}
        <div className="flex flex-col">
          {persona.photoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={persona.photoImage} alt={persona.name} className="rounded-xl w-full aspect-[4/3] mb-3 object-cover" />
          ) : (
            <div className="rounded-xl w-full aspect-[4/3] mb-3" style={{ background: persona.photo }} />
          )}
          <p className="text-[10px] text-white/40 mb-1.5">{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</p>
          <p className="font-serif text-[1.35rem] font-medium text-white leading-tight mb-1">{persona.name}</p>
          <p className="text-[12px] text-white/50 mb-3">{persona.role}</p>

          <div className="flex flex-col gap-2 text-white/70">
            <div className="flex items-center gap-2"><BadgeIcon name="user" /><span className="text-[12px]">{persona.age}</span></div>
            <div className="flex items-center gap-2"><BadgeIcon name="briefcase" /><span className="text-[12px]">{persona.role}</span></div>
            <div className="flex items-center gap-2"><BadgeIcon name="pin" /><span className="text-[12px]">{persona.location}</span></div>
          </div>

          <div className="my-3 h-px bg-white/10" />
          <p className="font-serif italic text-[12px] text-white/55 leading-relaxed">{persona.note}</p>
        </div>

        {/* Right — context, quote, needs / frustrations */}
        <div>
          <p className="text-[10.5px] font-semibold tracking-[0.16em] text-white/40 uppercase mb-2.5">Context</p>
          <h3 className="font-serif text-[1.4rem] md:text-[1.6rem] font-medium leading-[1.2] text-white mb-2.5">{persona.contextTitle}</h3>
          <p className="text-[13.5px] text-white/55 leading-relaxed mb-3.5">{persona.contextDesc}</p>

          <div className="flex gap-3 mb-3.5">
            <span className="shrink-0 text-violet-400"><IconQuote /></span>
            <p className="font-serif italic text-[15px] text-white leading-relaxed">&#8220;{persona.quote}&#8221;</p>
          </div>

          <div className="h-px bg-white/10 mb-3.5" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PersonaPointList title="Core Needs" points={persona.coreNeeds} tone="violet" />
            <PersonaPointList title="Frustrations" points={persona.frustrations} tone="rose" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── SECTION: Understanding the Users ───────────────────────────────────────
function UsersSection() {
  const [tab, setTab] = useState<'user' | 'therapist'>('user')
  const [index, setIndex] = useState(0)
  const personas = tab === 'user' ? USER_PERSONAS : THERAPIST_PERSONAS
  const active = personas[index]

  function selectTab(next: 'user' | 'therapist') {
    setTab(next)
    setIndex(0)
  }
  function step(dir: 1 | -1) {
    setIndex(i => (i + dir + personas.length) % personas.length)
  }

  return (
    <section className="relative py-5 md:py-6 overflow-hidden" style={{ background: '#141119' }}>
      <div className="relative z-10 mx-auto max-w-[1320px] px-6 md:px-9 lg:px-11">
        <div className="rounded-3xl bg-[#faf9f7] p-5 md:p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-5">
          <div>
            <motion.p {...fadeUp(0)} className="text-[11px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-3">
              02 — Understanding the Users
            </motion.p>
            <motion.h2 {...fadeUp(0.06)} className="font-serif text-[2.1rem] md:text-[2.5rem] font-medium leading-[1.05] tracking-tightest text-ink mb-2.5">
              {tab === 'user' ? 'User Persona' : 'Therapist Persona'}
            </motion.h2>
            <motion.p {...fadeUp(0.12)} className="font-sans text-[14px] text-muted leading-relaxed max-w-[380px]">
              We spoke to individuals seeking therapy and therapists to understand their goals, challenges and expectations.
            </motion.p>
          </div>

          <motion.p {...fadeUp(0.1)} className="font-sans text-[13.5px] text-muted leading-relaxed max-w-[360px] lg:pt-6">
            These personas are based on user interviews and research, and represent the key user types for Talk To ME. They helped us identify the core needs, barriers and motivations on both sides of the platform.
          </motion.p>
        </div>

        <motion.div {...fadeUp(0.16)} className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center rounded-full bg-stone-100 p-1">
            <button
              onClick={() => selectTab('user')}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${tab === 'user' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
            >
              User Personas
            </button>
            <button
              onClick={() => selectTab('therapist')}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${tab === 'therapist' ? 'bg-ink text-white' : 'text-muted hover:text-ink'}`}
            >
              Therapist Personas
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => step(-1)} className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 text-muted hover:text-ink hover:border-stone-300 transition-colors">
              <IconChevron dir="left" />
            </button>

            <div className="flex items-center gap-2">
              {personas.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => setIndex(i)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${
                    i === index ? 'bg-violet-100 text-violet-700' : 'text-muted hover:text-ink'
                  }`}
                >
                  <span className="opacity-60">{String(i + 1).padStart(2, '0')}</span> {p.name}
                </button>
              ))}
            </div>

            <button onClick={() => step(1)} className="flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 text-muted hover:text-ink hover:border-stone-300 transition-colors">
              <IconChevron dir="right" />
            </button>
          </div>
        </motion.div>

        <PersonaDetail persona={active} index={index} total={personas.length} />
        </div>
      </div>
    </section>
  )
}

// ── Jobs-to-be-done icons ───────────────────────────────────────────────
function IconUsersGroup() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <circle cx="7" cy="6.5" r="2.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2 17c.6-3.2 2.7-5 5-5s4.4 1.8 5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.5" cy="7" r="2.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M13 12c2 .1 3.7 1.6 4.2 4.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconCalendarSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="3.2" width="12" height="10.6" rx="1.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.6h12M5.3 2v2.4M10.7 2v2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconHeartSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 13.6S2.2 10 2.2 6.2a2.8 2.8 0 0 1 5.1-1.6L8 5.4l.7-.8a2.8 2.8 0 0 1 5.1 1.6c0 3.8-5.8 7.4-5.8 7.4Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  )
}

// ── Job category group (Functional / Emotional / Social) ───────────────
type JobCategoryData = { icon: React.ReactNode; label: string; labelColor: string; iconBg: string; items: string[] }
function JobCategoryGroup({ icon, label, labelColor, iconBg, items }: JobCategoryData) {
  return (
    <div className="flex gap-3">
      <span className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${iconBg}`}>{icon}</span>
      <div>
        <p className="text-[10px] font-bold tracking-[0.1em] uppercase mb-1" style={{ color: labelColor }}>{label}</p>
        <div className="flex flex-col gap-0.5">
          {items.map(item => (
            <motion.p
              key={item}
              className="origin-left text-[12.5px] text-ink/80 leading-snug -mx-2 px-2 py-0.5 rounded-lg cursor-default"
              whileHover={{ scale: 1.08, backgroundColor: '#ffffff', boxShadow: '0 14px 32px rgba(0,0,0,0.12)', zIndex: 20 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ position: 'relative' }}
            >
              {item}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Center connector: dashed line + Talk To ME badge ────────────────────
function JobsConnector() {
  return (
    <div className="hidden lg:flex flex-col items-center relative w-[150px]">
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-violet-300" />
      <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-violet-400 mt-1" />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 flex flex-col items-center justify-center gap-2 rounded-full bg-violet-50 border border-violet-100 w-[150px] h-[150px] text-center px-5 my-auto"
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-600 text-white">
          <IconChatBubble />
        </span>
        <span className="font-serif text-[15px] font-semibold text-ink">Talk To ME</span>
        <span className="text-[10.5px] text-muted leading-snug">Connects the right people, for a healthier tomorrow.</span>
      </motion.div>
      <span className="relative z-10 w-2.5 h-2.5 rounded-full bg-violet-400 mb-1" />
    </div>
  )
}

// ── SECTION: Jobs to be done ────────────────────────────────────────────
function JobsSection() {
  const userJobs = {
    functional: ['Find the right therapist', 'Schedule sessions easily', 'Monitor my progress', 'Keep my information private'],
    emotional: ['Feel heard and understood', 'Stay in control of my mental health', 'Feel confident in the service'],
    social: ['Break the stigma around mental health', 'Celebrate milestones privately or with loved ones'],
  }
  const therapistJobs = {
    functional: ['Connect with suitable clients', 'Manage appointments efficiently', 'Handle payments easily', 'Track client progress securely'],
    emotional: ['Feel valued and respected', 'Be confident in the platform', 'Feel reassured about my impact'],
    social: ['Build my network and reputation', 'Promote mental health awareness'],
  }

  return (
    <section className="relative bg-[#faf9f7] py-10 md:py-12 overflow-hidden">
      <div className="relative z-10 mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.p {...fadeUp(0)} className="text-[11px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-3">
            04 — Jobs to be Done
          </motion.p>
          <motion.h2 {...fadeUp(0.06)} className="font-serif text-[2rem] md:text-[2.35rem] font-medium leading-[1.1] tracking-tightest text-ink mb-3">
            Different needs. One shared goal.
          </motion.h2>
          <motion.p {...fadeUp(0.12)} className="font-sans text-[14px] text-muted leading-relaxed max-w-[460px]">
            We mapped the key jobs-to-be-done for both users and therapists to understand what they need to accomplish — functionally, emotionally and socially, and where the product can create value.
          </motion.p>
        </div>

        {/* Photos + jobs grid with center connector */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.7fr_auto_1.7fr_1fr] gap-6 items-stretch">
          {/* Left photo — user */}
          <div className="hidden lg:block rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/0085d5ed-d5a9-4a87-be4e-356ef02d1a88.png" alt="Anjali" className="w-full h-full object-cover" />
          </div>

          {/* User column */}
          <motion.div {...fadeUp(0.1)} className="flex flex-col gap-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-1.5">User</p>
              <p className="font-serif text-[1.4rem] font-medium text-ink leading-tight">Anjali</p>
              <p className="text-[12.5px] text-muted mt-0.5">28 years old · Associate Director · Mohali</p>
            </div>
            <div className="flex gap-2.5 rounded-xl bg-violet-50/70 border border-violet-100 p-4">
              <span className="shrink-0 text-violet-400"><IconQuote /></span>
              <p className="font-serif italic text-[13.5px] text-ink leading-relaxed">
                I want to find a therapist who understands my needs, fits my schedule, and makes me feel comfortable.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <JobCategoryGroup icon={<IconCalendarSmall />} label="Functional Jobs" labelColor="#7c3aed" iconBg="bg-violet-100 text-violet-600" items={userJobs.functional} />
              <JobCategoryGroup icon={<IconHeartSmall />} label="Emotional Jobs" labelColor="#e11d48" iconBg="bg-rose-100 text-rose-500" items={userJobs.emotional} />
              <JobCategoryGroup icon={<IconUsersGroup />} label="Social Jobs" labelColor="#c2410c" iconBg="bg-amber-100 text-amber-600" items={userJobs.social} />
            </div>
          </motion.div>

          <JobsConnector />

          {/* Therapist column */}
          <motion.div {...fadeUp(0.16)} className="flex flex-col gap-5">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-muted/70 uppercase mb-1.5">Therapist</p>
              <p className="font-serif text-[1.4rem] font-medium text-ink leading-tight">Dr. Abhay Sharma</p>
              <p className="text-[12.5px] text-muted mt-0.5">34 years old · Clinical Psychologist · 7 years experience</p>
            </div>
            <div className="flex gap-2.5 rounded-xl bg-violet-50/70 border border-violet-100 p-4">
              <span className="shrink-0 text-violet-400"><IconQuote /></span>
              <p className="font-serif italic text-[13.5px] text-ink leading-relaxed">
                I want to reach the right clients, manage my practice smoothly, and create a meaningful impact.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <JobCategoryGroup icon={<IconCalendarSmall />} label="Functional Jobs" labelColor="#7c3aed" iconBg="bg-violet-100 text-violet-600" items={therapistJobs.functional} />
              <JobCategoryGroup icon={<IconHeartSmall />} label="Emotional Jobs" labelColor="#e11d48" iconBg="bg-rose-100 text-rose-500" items={therapistJobs.emotional} />
              <JobCategoryGroup icon={<IconUsersGroup />} label="Social Jobs" labelColor="#c2410c" iconBg="bg-amber-100 text-amber-600" items={therapistJobs.social} />
            </div>
          </motion.div>

          {/* Right photo — therapist */}
          <div className="hidden lg:block rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/cade8309-d340-4cfb-87f4-1f7be7b45cb5.png" alt="Dr. Abhay Sharma" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default function TalkToMeCaseStudy() {
  return (
    <div className="antialiased">
      <HeroSection />
      <ContextSection />
      <UsersSection />
      <JobsSection />
      <SolutionSection />
      <DesigningExperienceSection />
      <ProductDecisionsSection />
      <KeyLearningsSection />
    </div>
  )
}
