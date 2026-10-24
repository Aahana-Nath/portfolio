'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useInViewport } from './useInViewport'

// ── Deterministic star data (no Math.random to avoid hydration mismatch) ──
const STARS = Array.from({ length: 40 }, (_, i) => ({
  w: 1 + (i * 7 % 2),
  left: (i * 37 % 100),
  top: (i * 53 % 100),
  opacity: 0.1 + (i * 13 % 4) * 0.08,
  dur: 3 + (i * 11 % 4),
  delay: (i * 7 % 3),
}))

// ── Deterministic paw trail data ────────────────────────────────────────────
const PAW_TRAILS = [
  { left: '40%', top: '11%', rot: 12,  dur: 7,  delay: 0.5, size: 14, op: 0.09 },
  { left: '56%', top: '79%', rot: -18, dur: 8,  delay: 2.2, size: 12, op: 0.07 },
  { left: '75%', top: '18%', rot: 28,  dur: 9,  delay: 1.1, size: 13, op: 0.08 },
  { left: '87%', top: '57%', rot: -10, dur: 6,  delay: 3.4, size: 11, op: 0.06 },
  { left: '47%', top: '91%', rot: 35,  dur: 10, delay: 0.8, size: 15, op: 0.07 },
  { left: '69%', top: '5%',  rot: -22, dur: 7,  delay: 4.1, size: 11, op: 0.06 },
  { left: '93%', top: '35%', rot: 16,  dur: 8,  delay: 1.7, size: 12, op: 0.08 },
]

// ── Animation helper ──────────────────────────────────────────────────────
function fadeUp(delay = 0, duration = 0.42) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '180px' } as const,
    transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }
}

// ── Phone Mockup wrapper ──────────────────────────────────────────────────
function PhoneMockup({ children, className = '', style, noBar, screenHeight }: { children: React.ReactNode; className?: string; style?: React.CSSProperties; noBar?: boolean; screenHeight?: number }) {
  const w = (style as React.CSSProperties & { width?: number })?.width ?? 190
  const notchW = Math.round(w * 0.36)
  const notchH = Math.round(w * 0.075)
  const sideButtonH = Math.round(w * 0.18)
  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: w, ...style }}>
      {/* Side volume buttons */}
      <div className="absolute bg-stone-700 rounded-l-sm z-20"
        style={{ left: -3, top: '18%', width: 3, height: sideButtonH - 10 }} />
      <div className="absolute bg-stone-700 rounded-l-sm z-20"
        style={{ left: -3, top: '30%', width: 3, height: sideButtonH }} />
      <div className="absolute bg-stone-700 rounded-l-sm z-20"
        style={{ left: -3, top: '44%', width: 3, height: sideButtonH }} />
      {/* Power button */}
      <div className="absolute bg-stone-700 rounded-r-sm z-20"
        style={{ right: -3, top: '28%', width: 3, height: sideButtonH + 10 }} />

      {/* Phone body */}
      <div className="relative overflow-hidden"
        style={{
          borderRadius: w * 0.13,
          border: `${Math.round(w * 0.025)}px solid #1c1917`,
          background: '#1c1917',
          boxShadow: '0 40px 100px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.08)',
        }}>
        {/* Inner screen clip */}
        <div className="relative overflow-hidden bg-white"
          style={{ borderRadius: w * 0.115 }}>
          {/* Dynamic Island */}
          <div className="absolute left-1/2 -translate-x-1/2 z-30 bg-stone-950"
            style={{ top: Math.round(w * 0.025), width: notchW, height: notchH, borderRadius: notchH / 2 }} />
          {/* Status bar */}
          <div className="relative flex items-center justify-between z-20 bg-white"
            style={{ height: Math.round(w * 0.13), paddingLeft: w * 0.07, paddingRight: w * 0.07, paddingTop: notchH + 4 }}>
            <span style={{ fontSize: w * 0.055, fontWeight: 700, color: '#1c1917' }}>9:41</span>
            <div className="flex items-center gap-0.5">
              {/* Signal bars */}
              {[3,5,7,9].map((h,i) => (
                <div key={i} className="bg-stone-900 rounded-[1px]"
                  style={{ width: w * 0.017, height: h * (w / 300), opacity: i < 3 ? 1 : 0.3 }} />
              ))}
              <div className="ml-1 bg-stone-900 rounded-[2px]"
                style={{ width: w * 0.065, height: w * 0.038, marginLeft: w * 0.02 }}>
                <div className="bg-green-500 rounded-[1px] h-full"
                  style={{ width: '70%' }} />
              </div>
            </div>
          </div>
          {/* Screen content */}
          <div className="overflow-hidden" style={{ height: screenHeight ?? (noBar ? 650 : 380) }}>{children}</div>
        </div>
      </div>
    </div>
  )
}

// ── Screen content components ─────────────────────────────────────────────
function DashboardScreen() {
  return (
    <div className="h-full bg-[#f9f8ff] p-3.5 flex flex-col gap-2.5">
      <div className="flex items-center justify-between mb-0.5">
        <div>
          <p className="text-[8px] text-muted">Good morning,</p>
          <p className="font-serif text-[12.5px] font-semibold text-ink">Aahana! 🌟</p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-violet-100 flex items-center justify-center text-base">🐕</div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-violet-700 p-3 text-white">
        <p className="text-[7px] font-semibold uppercase tracking-wider opacity-60 mb-1">AI Insight</p>
        <p className="text-[9px] leading-relaxed">Activity decreased by 15% this week.</p>
      </div>
      <p className="text-[7px] font-semibold text-muted/60 uppercase tracking-wider">Today&apos;s Plan</p>
      {[{ l: 'Morning Walk', d: true }, { l: 'Breakfast', d: true }, { l: 'Omega 2 Tablet', d: false }].map(({ l, d }) => (
        <div key={l} className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${d ? 'bg-violet-500 border-violet-500' : 'border-stone-300'}`}>
            {d && <svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <span className={`text-[9px] ${d ? 'line-through text-muted/50' : 'text-ink'}`}>{l}</span>
        </div>
      ))}
      <div className="mt-auto rounded-xl border border-stone-200 bg-white p-2.5 flex items-center gap-2">
        <span className="text-sm">💉</span>
        <div><p className="text-[9px] font-semibold text-ink">Vaccination Due</p><p className="text-[7.5px] text-muted">In 2 days</p></div>
      </div>
    </div>
  )
}

function AIAssistantScreen() {
  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-3.5 pt-3 pb-2.5 border-b border-stone-100 flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-violet-100 flex items-center justify-center text-sm">🐾</div>
        <div><p className="text-[10px] font-semibold text-ink">Chonkers AI</p><p className="text-[7.5px] text-muted">Always context-aware</p></div>
      </div>
      <div className="flex-1 p-3 flex flex-col gap-2.5 overflow-hidden">
        <div className="self-end bg-violet-500 text-white text-[8.5px] rounded-2xl rounded-tr-sm px-2.5 py-1.5 max-w-[78%] leading-relaxed">
          Why is Sugar scratching a lot?
        </div>
        <div className="self-start flex gap-1.5">
          <div className="w-5 h-5 rounded-full bg-violet-100 flex items-center justify-center text-[8px] shrink-0 mt-0.5">🐾</div>
          <div className="bg-stone-100 text-[8.5px] text-ink rounded-2xl rounded-tl-sm px-2.5 py-1.5 max-w-[78%] leading-relaxed">
            Based on Sugar&apos;s history, it might be skin sensitivity.
          </div>
        </div>
        {['Keep fur moisturised', 'Check for diet triggers', 'Monitor for 2–3 days'].map(item => (
          <div key={item} className="self-start flex items-center gap-1.5 ml-6">
            <div className="w-1 h-1 rounded-full bg-violet-400 shrink-0" />
            <span className="text-[8px] text-muted">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

type DriftConfig = { x?: number[]; y: number[]; rotate?: number[]; duration?: number }
function FloatingCard({ icon, title, sub, className = '', delay = 0, style, drift }: {
  icon: string; title: string; sub: string; className?: string; delay?: number;
  style?: React.CSSProperties; drift?: DriftConfig
}) {
  const d: DriftConfig = drift ?? { y: [0, -8, 0], x: [0, 3, 0], rotate: [0, 0.4, 0], duration: 7 }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] }}
      style={style}
      className={className}
    >
      <motion.div
        animate={{ y: d.y, x: d.x ?? [0, 0, 0], rotate: d.rotate ?? [0, 0, 0] }}
        transition={{ duration: d.duration ?? 7, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: delay + 0.7 }}
        whileHover={{ scale: 1.05, transition: { duration: 0.25 } }}
        className="flex items-center gap-2.5 rounded-2xl border border-stone-200/70 bg-white/95 backdrop-blur-md px-3.5 py-2.5 shadow-[0_8px_28px_rgba(0,0,0,0.08)] hover:shadow-[0_14px_44px_rgba(124,58,237,0.15)] cursor-default"
      >
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-[11px] font-semibold text-ink leading-none mb-0.5">{title}</p>
          <p className="text-[9.5px] text-muted">{sub}</p>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Paw doodle SVG ────────────────────────────────────────────────────────────
function PawDoodle({ className = '', opacity = 0.18 }: { className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" style={{ opacity }}>
      <ellipse cx="16" cy="22" rx="7" ry="5.5" fill="#7c3aed"/>
      <ellipse cx="9" cy="15" rx="3.2" ry="4" fill="#7c3aed" transform="rotate(-20 9 15)"/>
      <ellipse cx="23" cy="15" rx="3.2" ry="4" fill="#7c3aed" transform="rotate(20 23 15)"/>
      <ellipse cx="13" cy="11" rx="2.8" ry="3.5" fill="#7c3aed" transform="rotate(-10 13 11)"/>
      <ellipse cx="19" cy="11" rx="2.8" ry="3.5" fill="#7c3aed" transform="rotate(10 19 11)"/>
    </svg>
  )
}

// ── Dog SVG (atmospheric, large) ─────────────────────────────────────────────
function AtmosphericDog() {
  return (
    <svg viewBox="0 0 340 300" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {/* Body */}
      <ellipse cx="170" cy="220" rx="100" ry="68" fill="#fbbf24" opacity="0.55"/>
      {/* Head */}
      <ellipse cx="170" cy="130" rx="72" ry="65" fill="#fbbf24" opacity="0.6"/>
      {/* Left ear */}
      <ellipse cx="112" cy="95" rx="32" ry="48" fill="#f59e0b" opacity="0.5" transform="rotate(-18 112 95)"/>
      {/* Right ear */}
      <ellipse cx="228" cy="95" rx="32" ry="48" fill="#f59e0b" opacity="0.5" transform="rotate(18 228 95)"/>
      {/* Eyes */}
      <circle cx="148" cy="122" r="10" fill="#1c1917" opacity="0.7"/>
      <circle cx="192" cy="122" r="10" fill="#1c1917" opacity="0.7"/>
      <circle cx="151" cy="119" r="3.5" fill="white" opacity="0.9"/>
      <circle cx="195" cy="119" r="3.5" fill="white" opacity="0.9"/>
      {/* Nose */}
      <ellipse cx="170" cy="148" rx="14" ry="9" fill="#92400e" opacity="0.55"/>
      {/* Mouth */}
      <path d="M156 158 Q170 170 184 158" stroke="#92400e" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.45"/>
      {/* Tongue */}
      <ellipse cx="170" cy="172" rx="10" ry="12" fill="#fda4af" opacity="0.5"/>
      {/* Tail */}
      <path d="M265 195 Q310 145 295 110" stroke="#fbbf24" strokeWidth="22" strokeLinecap="round" fill="none" opacity="0.4"/>
      {/* Front legs */}
      <rect x="128" y="268" width="28" height="40" rx="14" fill="#fbbf24" opacity="0.45"/>
      <rect x="184" y="268" width="28" height="40" rx="14" fill="#fbbf24" opacity="0.45"/>
    </svg>
  )
}

// ── SECTION 1: Hero ──────────────────────────────────────────────────────────
function HeroSection({ onOpenStory }: { onOpenStory: () => void }) {
  return (
    <section className="relative overflow-hidden flex items-stretch sticky top-0 z-0"
      style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #faf9f7 0%, rgba(245,243,255,0.3) 50%, #faf9f7 100%)' }}>

      <button
        type="button"
        onClick={onOpenStory}
        className="absolute right-5 top-5 z-40 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white/90 px-4 py-2.5 text-[12px] font-semibold text-violet-700 shadow-[0_6px_22px_rgba(76,29,149,0.12)] backdrop-blur-sm transition-colors hover:bg-violet-50 md:right-8 md:top-7"
      >
        <PawDoodle className="w-4" opacity={1} />
        The story behind Chonkers
        <span aria-hidden>→</span>
      </button>

      {/* ── Layer 1: Background blobs ── */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
        <motion.div className="absolute -top-40 right-0 rounded-full"
          style={{ width: 700, height: 700, background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 60%)' }}
          animate={{ scale: [1, 1.08, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="absolute bottom-0 left-1/3 rounded-full"
          style={{ width: 500, height: 360, background: 'radial-gradient(ellipse, rgba(251,191,36,0.06) 0%, transparent 65%)' }} />
      </div>

      {/* ── Layer 2: Paw trails ── */}
      {PAW_TRAILS.map((p, i) => (
        <motion.div key={i} aria-hidden
          className="absolute pointer-events-none z-[2]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, transform: `rotate(${p.rot}deg)` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, p.op, p.op * 0.5, p.op, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: 'easeInOut', delay: p.delay }}
        >
          <PawDoodle className="w-full h-full" opacity={1} />
        </motion.div>
      ))}

      {/* ── Static paw doodles left side ── */}
      <PawDoodle className="absolute top-[12%] left-[4%] w-9 rotate-[-20deg]" opacity={0.09} />
      <PawDoodle className="absolute bottom-[22%] left-[5%] w-7 rotate-15" opacity={0.07} />

      {/* ════ COL 1 — Text, fixed 400 px ════ */}
      <div className="relative z-10 flex flex-col justify-center shrink-0 py-20"
        style={{ width: 400, paddingLeft: 64, paddingRight: 24 }}>

        <motion.div {...fadeUp(0)}>
          <Link href="/" className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-muted hover:text-ink transition-colors tracking-wide mb-8 group">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:-translate-x-0.5 transition-transform duration-200">
              <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Work
          </Link>
        </motion.div>

        <motion.h1 {...fadeUp(0.08)} className="font-serif text-[5.5rem] md:text-[7rem] font-medium leading-[0.88] tracking-tightest text-ink mb-5">
          Chonkers
        </motion.h1>
        <motion.p {...fadeUp(0.16)} className="font-serif text-[1.45rem] font-medium text-violet-600 italic mb-5 leading-snug">
          The Operating System<br />for Pet Parenting.
        </motion.p>
        <motion.p {...fadeUp(0.22)} className="font-sans text-[15px] text-muted leading-relaxed mb-6" style={{ maxWidth: 340 }}>
          An AI-powered pet care platform that helps owners build healthier routines, centralize health records, and receive personalized guidance through contextual AI.
        </motion.p>

        {/* Tags below description */}
        <motion.div {...fadeUp(0.28)} className="flex flex-wrap gap-1.5 mb-8">
          {['AI', 'Health', 'Routines', 'Behavioral Design', 'Mobile'].map(tag => (
            <span key={tag} className="text-[10px] font-medium px-2.5 py-1 rounded-full border border-stone-300/60 text-muted">{tag}</span>
          ))}
        </motion.div>

        {/* Metrics */}
        <motion.div {...fadeUp(0.34)} className="flex gap-8 border-t border-border pt-7">
          {[
            { v: '85%+', l: 'Routine Completion' },
            { v: '12.4', l: 'AI Conversations / Day' },
            { v: '65%+', l: '30-Day Retention' },
          ].map(({ v, l }) => (
            <div key={l} className="flex flex-col gap-1">
              <span className="font-serif text-[2rem] font-medium text-violet-600 tracking-tighter leading-none">{v}</span>
              <span className="font-sans text-[10.5px] text-muted leading-tight mt-1">{l}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ════ COL 2 — Phones, flex-1 center ════ */}
      <div className="relative z-10 flex-1 flex items-center justify-center overflow-visible" style={{ minWidth: 420 }}>
        <div className="relative" style={{ width: 520, height: 680 }}>

          {/* Glow bloom — breathing */}
          <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center z-0">
            <motion.div
              animate={{ scale: [1, 1.07, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(124,58,237,0.13) 0%, rgba(196,181,253,0.05) 45%, transparent 70%)' }}
            />
          </div>

          {/* Left phone — gentle float up */}
          <motion.div
            className="absolute z-20"
            style={{ left: '-8%', top: '4%' }}
            animate={{ y: [18, 8, 18] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <PhoneMockup style={{ width: 280 }} noBar>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-05-29_at_18.16.18.png" alt="Chonkers dashboard" className="w-full h-full object-contain object-top bg-white" />
              </PhoneMockup>
            </motion.div>
          </motion.div>

          {/* Right phone — gentle float down (opposite phase) */}
          <motion.div
            className="absolute z-15"
            style={{ right: '-12%', top: '8%' }}
            animate={{ y: [-14, -4, -14] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 3.0 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 6 }}
              animate={{ opacity: 1, y: 0, rotate: 6 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <PhoneMockup style={{ width: 280 }} noBar>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-05-29_at_18.18.14.png" alt="Chonkers AI screen" className="w-full h-full object-contain object-top bg-white" />
              </PhoneMockup>
            </motion.div>
          </motion.div>

          {/* Floating cards with independent drift paths */}
          <FloatingCard icon="🍽️" title="Feeding Reminder" sub="In 30 min"
            className="absolute z-30" style={{ left: -180, bottom: '44%' } as React.CSSProperties}
            delay={0.9} drift={{ y: [0, -10, 0], x: [0, 6, 0], rotate: [0, 0.6, 0], duration: 8 }} />
          <FloatingCard icon="🤖" title="AI Insight" sub="Activity ↓10% this week"
            className="absolute z-30" style={{ left: -180, bottom: '22%' } as React.CSSProperties}
            delay={1.1} drift={{ y: [0, 8, 0], x: [0, -4, 0], rotate: [0, -0.5, 0], duration: 9 }} />
          <FloatingCard icon="💉" title="Vaccination Due" sub="In 3 days"
            className="absolute z-30" style={{ right: -170, bottom: '10%' } as React.CSSProperties}
            delay={1.3} drift={{ y: [0, -6, 4, 0], x: [0, 4, 2, 0], rotate: [0, 0.8, -0.4, 0], duration: 10 }} />
        </div>
      </div>


    </section>
  )
}

function ChonkersStoryModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousBodyOverflow
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm md:p-8"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="chonkers-story-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.99 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-stone-200 bg-[#faf7f2] shadow-[0_24px_90px_rgba(0,0,0,0.28)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close story"
          className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[#706b77] shadow-sm transition-colors hover:bg-white hover:text-[#17152f]"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 4 8 8m0-8-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
        </button>

        <div className="mx-5 mb-5 mt-16 grid min-h-0 flex-1 grid-cols-1 grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-xl border border-stone-200 bg-white/30 md:m-7 md:mt-7 md:grid-cols-[0.9fr_1.1fr] md:grid-rows-1">
          <div className="grid min-h-0 grid-cols-2 grid-rows-[minmax(160px,1.15fr)_minmax(100px,0.85fr)] gap-3 p-4 md:p-6">
            <div className="relative col-span-2 min-h-0 overflow-hidden rounded-xl border border-stone-200/70 bg-white">
              <video src="https://res.cloudinary.com/dvtf1ckaf/video/upload/v1792746354/WhatsApp_Video_2026-10-23_at_14.12.55_zbmywa.mp4" aria-label="Chonkers video" autoPlay muted loop playsInline preload="metadata" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="relative min-h-0 overflow-hidden rounded-xl border border-stone-200/70 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://res.cloudinary.com/dvtf1ckaf/image/upload/v1792746353/WhatsApp_Image_2026-10-23_at_14.10.58_vheqwk.jpg" alt="Aahana with Chonkers" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="relative min-h-0 overflow-hidden rounded-xl border border-stone-200/70 bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://res.cloudinary.com/dvtf1ckaf/image/upload/v1792746353/WhatsApp_Image_2026-10-23_at_14.11.51_ubjqfn.jpg" alt="Chonkers" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          </div>

          <div data-lenis-prevent className="min-h-0 overscroll-contain overflow-y-auto border-t border-stone-200 px-5 pb-6 pt-5 md:border-l md:border-t-0 md:px-8 md:py-8">
            <p className="mb-3 text-[10px] font-semibold tracking-[0.18em] text-violet-600 uppercase">The story behind Chonkers</p>
            <h2 id="chonkers-story-title" className="mb-2 max-w-lg font-serif text-[2rem] font-semibold leading-[1.04] text-[#17152f] md:text-[2.4rem]">
              It started with a very personal problem
            </h2>
            <p className="mb-4 font-serif text-[1.15rem] text-[#17152f]">Meet my Chonker, <span className="text-violet-700">Sugar.</span></p>
            <div className="space-y-3.5 font-sans text-[13px] leading-relaxed text-[#514d5d] md:text-[14px]">
              <p>During COVID, I became a pet parent, and that changed everything. Suddenly, I was responsible for another life, his health, his routine, his happiness.</p>
              <p>As a first-time pet parent, I found myself jumping between multiple apps for different services, vet consultations, vaccinations, grooming, food, and even simple questions.</p>
              <p>I often went to ChatGPT for advice, only to repeat my dog’s history again and again just to get a relevant answer. That’s when I wondered: why isn’t there one place for everything a pet parent needs?</p>
              <p>As a working professional, I constantly worried I might miss something important in his routine, a vaccination, a health check, or a daily task.</p>
              <p>I spoke with friends and other pet parents and realized these pain points were common, and solvable.</p>
              <p>Most existing apps were marketplaces or standalone service-booking platforms. I wanted to build something bigger: a complete pet ecosystem where everything a pet parent needs is at their fingertips.</p>
            </div>
            <p className="mt-5 font-sans text-[13px] font-semibold leading-relaxed text-violet-700">
              Chonkers is my attempt to make pet parenting simpler, more informed, and more loving, for every pet and every parent who wants the best for them.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}


// ── SECTION 2: Problem ────────────────────────────────────────────────────────
function ProblemSection() {
  const before = [
    'Pet Issue', 'Google Search', 'Conflicting Information', 'Forgotten Routine', 'Scattered Records',
  ]
  const after = [
    'Pet Issue', 'Ask Chonkers', 'Personalized Guidance', 'Routine Tracking', 'Health Insights',
  ]
  const painPoints = [
    { icon: '🍽️', text: 'Missed feeding, medication and exercise schedules' },
    { icon: '💉', text: 'Scattered vaccination and medical records' },
    { icon: '🔍', text: 'Generic advice from online searches' },
    { icon: '🤖', text: 'Lack of personalized care guidance' },
    { icon: '📋', text: 'No centralized system for daily pet management' },
  ]

  return (
    <section className="relative bg-[#faf9f7] pb-28 overflow-hidden z-10" style={{ borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.08)' }}>
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">

        {/* White card wrapper — bigger padding, max-width expanded */}
        <motion.div {...fadeUp(0)}
          className="relative bg-white rounded-3xl shadow-[0_8px_60px_rgba(0,0,0,0.07)] border border-stone-100 p-12 lg:p-20 overflow-hidden">

          {/* ── Sketchy corner doodles ── */}
          {/* Top-left bracket */}
          <svg className="absolute top-6 left-6 opacity-10" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M18 6 L6 6 L6 18" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Top-right bracket */}
          <svg className="absolute top-6 right-6 opacity-10" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M30 6 L42 6 L42 18" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Bottom-left bracket */}
          <svg className="absolute bottom-6 left-6 opacity-10" width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M18 42 L6 42 L6 30" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Bottom-right paw */}
          <div className="absolute bottom-8 right-8 opacity-[0.12]">
            <PawDoodle className="w-14" opacity={1} />
          </div>
          {/* Sketchy underline on heading area */}
          <svg className="absolute top-[88px] left-[68px] opacity-[0.08]" width="180" height="12" viewBox="0 0 180 12" fill="none">
            <path d="M2 8 Q30 3 60 7 Q90 11 120 6 Q150 2 178 7" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          {/* Mid curved arrow between Before and After cols */}
          <svg className="absolute opacity-20 pointer-events-none" style={{ left: '47%', top: '54%', transform: 'translateX(-50%)' }} width="80" height="50" viewBox="0 0 80 50" fill="none">
            <path d="M8 40 Q40 -10 72 40" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 3"/>
            <path d="M66 35 L72 40 L68 46" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* Floating tiny star sparkles */}
          {[[82,14],[91,72],[52,88],[18,55]].map(([l,t],i) => (
            <motion.svg key={i} className="absolute pointer-events-none" style={{ left:`${l}%`, top:`${t}%`, opacity: 0.12 }}
              width="14" height="14" viewBox="0 0 14 14" fill="none"
              animate={{ opacity: [0.08, 0.18, 0.08], scale: [1, 1.2, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, delay: i * 1.1 }}>
              <path d="M7 1 L8.2 5.5 L13 7 L8.2 8.5 L7 13 L5.8 8.5 L1 7 L5.8 5.5 Z" fill="#7c3aed"/>
            </motion.svg>
          ))}

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_1fr_260px] gap-12 lg:gap-10 items-start">

            {/* ── COL 1: Label + Heading + scribble ── */}
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold tracking-[0.18em] text-violet-500 uppercase flex items-center gap-2">
                <span className="font-normal text-muted/60">02</span> The Problem
              </p>
              <h2 className="font-serif text-[2.2rem] font-medium leading-[1.1] tracking-tight text-ink">
                Pet owners rely on fragmented tools to manage their pet&apos;s wellbeing.
              </h2>
              {/* tangled scribble — bigger */}
              <div className="mt-4 opacity-30">
                <svg viewBox="0 0 140 110" fill="none" className="w-36">
                  <path d="M70 55 C48 24 22 58 46 76 C63 88 95 82 108 64 C126 40 100 14 76 28 C52 42 34 72 58 84 C82 96 120 78 114 52 C108 28 78 14 58 30 C38 46 50 82 74 86 C98 90 124 68 118 44 C112 20 84 10 64 24 C44 38 30 68 50 80"
                    stroke="#9f3030" strokeWidth="1.4" strokeLinecap="round"/>
                  <path d="M65 50 C82 36 108 48 98 70 C88 88 60 90 48 72 C36 54 50 28 72 32 C94 36 104 66 88 80"
                    stroke="#9f3030" strokeWidth="1.4" strokeLinecap="round"/>
                  {[0,36,72,108,144,180,216,252,288,324].map((a, i) => (
                    <line key={i}
                      x1={70 + 32 * Math.cos(a * Math.PI / 180)}
                      y1={58 + 26 * Math.sin(a * Math.PI / 180)}
                      x2={70 + 44 * Math.cos(a * Math.PI / 180)}
                      y2={58 + 36 * Math.sin(a * Math.PI / 180)}
                      stroke="#9f3030" strokeWidth="1.1" strokeLinecap="round" opacity="0.55"/>
                  ))}
                </svg>
              </div>
              <PawDoodle className="w-7 mt-1" opacity={0.2} />
            </div>

            {/* ── COL 2: Before Chonkers ── */}
            <motion.div {...fadeUp(0.1)} className="flex flex-col items-center">
              <p className="text-[11px] font-bold text-rose-500 tracking-widest uppercase mb-6">Before Chonkers</p>
              <div className="flex flex-col items-center w-full">
                {before.map((step, i) => (
                  <div key={step} className="flex flex-col items-center w-full">
                    <motion.div
                      whileHover={{ scale: 1.07, boxShadow: '0 8px 24px rgba(248,113,113,0.18)' }}
                      transition={{ duration: 0.18 }}
                      className={`w-full px-4 py-2.5 rounded-xl text-[12px] font-medium border text-center cursor-default
                        ${i === 0 ? 'border-stone-300 bg-stone-50 text-ink shadow-sm' : 'border-stone-200 bg-white text-muted'}`}>
                      {step}
                    </motion.div>
                    {i < before.length - 1 && (
                      <div className="flex flex-col items-center gap-[3px] my-1">
                        {[0,1,2].map(d => (
                          <motion.div key={d} className="w-[1.5px] h-[4px] rounded-full bg-rose-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 + d * 0.12 }} />
                        ))}
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}>
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M4 6L0 0h8L4 6z" fill="#f87171"/>
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Terminal node */}
                <div className="mt-3 w-full px-4 py-2.5 rounded-xl text-[12px] font-semibold text-center border border-rose-200 bg-rose-50 text-rose-600 flex items-center justify-center gap-1.5">
                  <span>😟</span> Stress &amp; Uncertainty
                </div>
              </div>
            </motion.div>

            {/* ── COL 3: With Chonkers ── */}
            <motion.div {...fadeUp(0.18)} className="flex flex-col items-center">
              <p className="text-[11px] font-bold text-emerald-600 tracking-widest uppercase mb-6">With Chonkers</p>
              <div className="flex flex-col items-center w-full">
                {after.map((step, i) => (
                  <div key={step} className="flex flex-col items-center w-full">
                    <motion.div
                      whileHover={{ scale: 1.07, boxShadow: '0 8px 24px rgba(52,211,153,0.18)' }}
                      transition={{ duration: 0.18 }}
                      className={`w-full px-4 py-2.5 rounded-xl text-[12px] font-medium border text-center cursor-default
                        ${i === 0 ? 'border-stone-300 bg-stone-50 text-ink shadow-sm' : 'border-stone-200 bg-white text-muted'}`}>
                      {step}
                    </motion.div>
                    {i < after.length - 1 && (
                      <div className="flex flex-col items-center gap-[3px] my-1">
                        {[0,1,2].map(d => (
                          <motion.div key={d} className="w-[1.5px] h-[4px] rounded-full bg-emerald-400"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 + d * 0.12 }} />
                        ))}
                        <motion.div
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.2 }}>
                          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                            <path d="M4 6L0 0h8L4 6z" fill="#34d399"/>
                          </svg>
                        </motion.div>
                      </div>
                    )}
                  </div>
                ))}
                {/* Terminal node */}
                <div className="mt-3 w-full px-4 py-2.5 rounded-xl text-[12px] font-semibold text-center border border-emerald-200 bg-emerald-50 text-emerald-700 flex items-center justify-center gap-1.5">
                  <span>🐾</span> Peace of Mind
                </div>
              </div>
              {/* curved arrow between cols — decorative */}
            </motion.div>

            {/* ── COL 4: Key Pain Points ── */}
            <motion.div {...fadeUp(0.26)} className="flex flex-col gap-1">
              <p className="text-[13px] font-semibold text-violet-600 mb-4">Key Pain Points</p>
              {painPoints.map(({ icon, text }, i) => (
                <motion.div key={text} {...fadeUp(0.28 + i * 0.06)}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-violet-50/60 border border-violet-100/50 mb-2">
                  <span className="text-lg shrink-0 mt-0.5">{icon}</span>
                  <p className="text-[11.5px] text-muted leading-snug">{text}</p>
                </motion.div>
              ))}
              {/* paw doodle bottom right */}
              <div className="flex justify-end mt-2">
                <PawDoodle className="w-10" opacity={0.15} />
              </div>
            </motion.div>

          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── SECTION 3: Vision ─────────────────────────────────────────────────────────
function VisionSection() {
  const { ref, inView } = useInViewport<HTMLElement>('300px')
  return (
    <section ref={ref} className="relative py-40 bg-[#0d0c14] overflow-hidden flex items-center justify-center min-h-[70vh] z-10">
      {inView && STARS.map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white" style={{ width: s.w, height: s.w, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 4, s.opacity] }} transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }} />
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[300px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 65%)' }} />
      </div>
      <div className="relative z-10 text-center px-6 max-w-[920px] mx-auto">
        <motion.p {...fadeUp(0)} className="text-[10.5px] font-semibold tracking-[0.22em] text-violet-400 uppercase mb-8">02 — Our Vision</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '180px' }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-[3.5rem] md:text-[5.5rem] font-medium leading-[1.0] tracking-tightest text-white mb-8">
          Build the<br /><em className="text-violet-300 not-italic">operating system</em><br />for pet parenting.
        </motion.h2>
        <motion.p {...fadeUp(0.3)} className="text-[14px] text-white/45 leading-relaxed max-w-[500px] mx-auto">
          Instead of becoming another pet marketplace, Chonkers aims to become the primary interface through which owners manage and understand their pets.
        </motion.p>
      </div>
    </section>
  )
}

// ── SECTION 4: Research ───────────────────────────────────────────────────────
const RESEARCH = [
  { title: 'Health Tracking Exists', sub: 'Usually Passive', finding: "Most apps log data but don't act on it. Owners receive no intelligent recommendations or proactive nudges based on their pet's history." },
  { title: 'Marketplace Focus Dominates', sub: 'Care Management Underserved', finding: 'The pet industry is primarily product-focused. No dominant player owns the daily care experience between vet visits.' },
  { title: 'AI Usage Is Limited', sub: 'Mostly Static FAQs', finding: 'Existing AI in pet apps is superficial. Clear white space exists for a contextual AI that understands individual pet profiles.' },
  { title: 'Routine Management Is Basic', sub: 'Little Personalization', finding: "Generic reminder apps exist but none adapt to the pet's specific breed, health history, age, or behavioral patterns." },
]

function ResearchSection() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section className="relative bg-[#f7f6ff] py-24 z-10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">

        {/* Header row */}
        <motion.p {...fadeUp(0)} className="mb-10 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-violet-500 uppercase">
          <span className="text-muted/50 font-normal">04</span> Research &amp; Insights
        </motion.p>

        {/* 5-column grid: 4 cards + Core Insight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_260px] gap-4 items-stretch">

          {RESEARCH.map((card, i) => (
            <motion.div key={card.title} {...fadeUp(0.06 + i * 0.07)}
              onHoverStart={() => setActive(i)} onHoverEnd={() => setActive(null)}
              whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(124,58,237,0.10)', transition: { duration: 0.15 } }}
              className="relative flex flex-col justify-between rounded-2xl border border-stone-200/60 bg-white p-6 cursor-default overflow-hidden min-h-[220px]"
            >
              <div>
                <p className="font-sans text-[1rem] font-semibold text-ink mb-1.5 leading-snug">{card.title}</p>
                <p className="text-[11.5px] text-muted/70 mb-6">{card.sub}</p>
              </div>

              {/* Sketchy illustration — unique per card */}
              <div className="mt-auto">
                {i === 0 && (
                  /* Bar chart — passive tracking */
                  <svg viewBox="0 0 80 52" className="w-20 opacity-40" fill="none">
                    <rect x="6"  y="32" width="12" height="18" rx="2" stroke="#7c3aed" strokeWidth="1.2"/>
                    <rect x="22" y="22" width="12" height="28" rx="2" stroke="#7c3aed" strokeWidth="1.2"/>
                    <rect x="38" y="16" width="12" height="34" rx="2" stroke="#7c3aed" strokeWidth="1.2"/>
                    <rect x="54" y="26" width="12" height="24" rx="2" stroke="#7c3aed" strokeWidth="1.2"/>
                    <line x1="2" y1="50" x2="78" y2="50" stroke="#7c3aed" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                )}
                {i === 1 && (
                  /* Shopping cart — marketplace */
                  <svg viewBox="0 0 70 56" className="w-20 opacity-40" fill="none">
                    <path d="M6 8 L14 8 L22 36 L56 36 L62 16 L18 16" stroke="#7c3aed" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="26" cy="44" r="4" stroke="#7c3aed" strokeWidth="1.3"/>
                    <circle cx="50" cy="44" r="4" stroke="#7c3aed" strokeWidth="1.3"/>
                    <path d="M32 24 L32 30 M40 22 L40 30 M48 24 L48 30" stroke="#7c3aed" strokeWidth="1.1" strokeLinecap="round" opacity="0.6"/>
                  </svg>
                )}
                {i === 2 && (
                  /* Robot head — limited AI */
                  <svg viewBox="0 0 70 60" className="w-20 opacity-40" fill="none">
                    <rect x="14" y="18" width="42" height="32" rx="6" stroke="#7c3aed" strokeWidth="1.3"/>
                    <circle cx="26" cy="32" r="4" stroke="#7c3aed" strokeWidth="1.2"/>
                    <circle cx="44" cy="32" r="4" stroke="#7c3aed" strokeWidth="1.2"/>
                    <path d="M26 42 Q35 46 44 42" stroke="#7c3aed" strokeWidth="1.2" strokeLinecap="round"/>
                    <line x1="35" y1="10" x2="35" y2="18" stroke="#7c3aed" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="35" cy="8" r="3" stroke="#7c3aed" strokeWidth="1.2"/>
                    {/* dashed path to robot */}
                    <path d="M4 38 Q10 30 14 32" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
                    <path d="M4 22 Q8 28 14 26" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
                    <circle cx="4" cy="38" r="2" fill="#c4b5fd" opacity="0.5"/>
                    <circle cx="4" cy="22" r="2" fill="#c4b5fd" opacity="0.5"/>
                  </svg>
                )}
                {i === 3 && (
                  /* Checklist — basic routine */
                  <svg viewBox="0 0 70 56" className="w-20 opacity-40" fill="none">
                    <rect x="12" y="8" width="46" height="40" rx="5" stroke="#7c3aed" strokeWidth="1.3"/>
                    <line x1="22" y1="22" x2="48" y2="22" stroke="#7c3aed" strokeWidth="1.1" strokeLinecap="round"/>
                    <line x1="22" y1="30" x2="44" y2="30" stroke="#7c3aed" strokeWidth="1.1" strokeLinecap="round"/>
                    <line x1="22" y1="38" x2="40" y2="38" stroke="#7c3aed" strokeWidth="1.1" strokeLinecap="round"/>
                    <path d="M16 22 L19 25 L24 19" stroke="#7c3aed" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 30 L19 33 L24 27" stroke="#7c3aed" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                    {/* dashed arrow right */}
                    <path d="M58 28 Q64 28 66 28" stroke="#c4b5fd" strokeWidth="1" strokeDasharray="3 2" strokeLinecap="round"/>
                    <polygon points="64,25 68,28 64,31" fill="#c4b5fd" opacity="0.6"/>
                  </svg>
                )}

                {/* Show finding on hover */}
                <AnimatePresence>
                  {active === i && (
                    <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] text-muted leading-relaxed mt-3 border-t border-stone-100 pt-3">
                      {card.finding}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          {/* Core Insight — 5th column */}
          <motion.div {...fadeUp(0.34)} className="flex flex-col justify-between">
            <div>
              <p className="text-[13px] font-semibold text-violet-600 mb-4">Core Insight</p>
              <p className="font-serif text-[1.25rem] font-medium text-ink leading-snug">
                Pet owners don&apos;t just need information. They need help building and maintaining care habits.
              </p>
            </div>
            <div className="flex justify-end mt-6">
              <svg viewBox="0 0 48 48" fill="none" className="w-10 opacity-20">
                <path d="M24 8 C16 8 10 14 10 22 C10 30 16 36 24 38 C32 36 38 30 38 22 C38 14 32 8 24 8Z" stroke="#7c3aed" strokeWidth="1.5"/>
                <path d="M18 30 C18 26 20 24 24 24 C28 24 30 26 30 30" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="2" fill="#7c3aed" opacity="0.6"/>
                <circle cx="28" cy="20" r="2" fill="#7c3aed" opacity="0.6"/>
              </svg>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

// ── SECTION 5: Onboarding ──────────────────────────────────────────────────────
const ONBOARDING_SCREENS = [
  {
    id: 'signin',
    url: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-06-01_at_13.06.22.png',
    label: 'Sign In / Sign Up',
    stage: 'Owner',
    weight: 'small',
    objectives: ['owner'],
  },
  {
    id: 'owner',
    url: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-06-01_at_13.06.52.png',
    label: 'Owner Info',
    stage: 'Owner',
    weight: 'small',
    objectives: ['owner'],
  },
  {
    id: 'pet',
    url: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-06-01_at_13.07.02.png',
    label: 'Pet Info',
    stage: 'Pet',
    weight: 'large',
    objectives: ['pet', 'ai'],
  },
  {
    id: 'medical',
    url: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-06-01_at_13.07.12.png',
    label: 'Medical Records',
    stage: 'Health',
    weight: 'large',
    objectives: ['ai'],
  },
  {
    id: 'routine',
    url: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-06-01_at_13.07.32.png',
    label: 'Routine Setup',
    stage: 'Routine',
    weight: 'large',
    objectives: ['routine', 'ai'],
  },
  {
    id: 'vaccination',
    url: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-06-01_at_13.07.43.png',
    label: 'Vaccination',
    stage: 'AI Context Ready',
    weight: 'small',
    objectives: ['ai'],
  },
] as const

const JOURNEY_STAGES = ['Owner', 'Pet', 'Health', 'Routine', 'AI Context Ready'] as const

const ONBOARDING_OBJECTIVES = [
  { id: 'owner', index: '01', title: 'Understand the Owner', subtitle: 'Get to know the pet parent and their preferences.', linked: ['signin', 'owner'] },
  { id: 'pet', index: '02', title: 'Understand the Pet', subtitle: 'Collect key pet details to tailor recommendations.', linked: ['pet'] },
  { id: 'routine', index: '03', title: 'Build Initial Routines', subtitle: 'Set up routines that drive healthy habits from day one.', linked: ['routine'] },
  { id: 'ai', index: '04', title: 'Initialize AI Context', subtitle: 'Combine all context to power a personalized assistant.', linked: ['pet', 'medical', 'routine', 'vaccination', 'success'] },
] as const

type OnboardingScreenId = (typeof ONBOARDING_SCREENS)[number]['id']

function OnboardingSection() {
  const [hoveredObjective, setHoveredObjective] = useState<string | null>(null)
  const screenRowRef = useRef<HTMLDivElement>(null)

  function scrollScreens(direction: -1 | 1) {
    screenRowRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })
  }

  return (
    <section className="relative bg-white py-12 z-10 overflow-hidden">
      <style>{`
        #onboarding-screen-row { -ms-overflow-style: none; scrollbar-width: none; }
        #onboarding-screen-row::-webkit-scrollbar { display: none; }
        .onb-phone-scroll { scrollbar-width: thin; scrollbar-color: #c4b5fd transparent; }
        .onb-phone-scroll::-webkit-scrollbar { width: 3px; }
        .onb-phone-scroll::-webkit-scrollbar-track { background: transparent; }
        .onb-phone-scroll::-webkit-scrollbar-thumb { background: #c4b5fd; border-radius: 999px; }
      `}</style>



      <div className="relative mx-auto max-w-[1450px] px-5 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 xl:grid-cols-[300px_minmax(0,1fr)] gap-8 xl:gap-9 items-start">

          {/* LEFT: Editorial narrative */}
          <motion.aside {...fadeUp(0)} className="xl:pr-2">
            <p className="text-[10px] font-semibold tracking-[0.18em] text-violet-500 uppercase mb-3">05 / Personalization Foundation</p>
            <h2 className="font-serif text-[2rem] md:text-[2.2rem] leading-[0.95] text-[#151320] mb-5">
              Intelligent
              <span className="block text-violet-600 italic">Onboarding</span>
            </h2>

            <div className="rounded-2xl border border-violet-100 bg-white/80 backdrop-blur-sm px-4 py-4 shadow-[0_10px_26px_rgba(76,29,149,0.07)] mb-5">
              <p className="text-[15px] leading-relaxed text-[#322d4a] font-medium">The challenge wasn&apos;t collecting information.</p>
              <p className="text-[15px] leading-relaxed text-[#5a5176] mt-1.5">It was collecting enough context for personalization without creating onboarding fatigue.</p>
            </div>

            <div className="space-y-2.5">
              {ONBOARDING_OBJECTIVES.map((objective, i) => {
                const isActive = hoveredObjective === objective.id
                return (
                  <motion.button
                    key={objective.id}
                    type="button"
                    onMouseEnter={() => setHoveredObjective(objective.id)}
                    onMouseLeave={() => setHoveredObjective(null)}
                    onFocus={() => setHoveredObjective(objective.id)}
                    onBlur={() => setHoveredObjective(null)}
                    {...fadeUp(0.05 + i * 0.06)}
                    className={`w-full text-left rounded-2xl border px-3.5 py-3 transition-all duration-200 ${isActive ? 'border-violet-300 bg-violet-50/85 shadow-[0_8px_20px_rgba(124,58,237,0.15)]' : 'border-stone-200/80 bg-white/80 hover:border-violet-200 hover:bg-violet-50/55'}`}
                  >
                    <p className="text-[9px] tracking-wider uppercase font-semibold text-violet-500 mb-1">{objective.index}</p>
                    <p className="text-[16px] font-semibold text-[#1d1930] leading-tight mb-1">{objective.title}</p>
                    <p className="text-[11px] text-[#6a6681] leading-relaxed">{objective.subtitle}</p>
                  </motion.button>
                )
              })}
            </div>
          </motion.aside>

          {/* RIGHT: Strategy + journey visuals */}
          <div className="min-w-0">
            <div className="relative">
              <button
                type="button"
                onClick={() => scrollScreens(-1)}
                aria-label="Scroll onboarding screens left"
                className="absolute left-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-violet-100 bg-white/95 text-violet-700 shadow-md hover:bg-violet-50"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m10 3-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <motion.div
                {...fadeUp(0.12)}
                id="onboarding-screen-row"
                ref={screenRowRef}
                data-lenis-prevent
                className="onboarding-screen-row flex items-end gap-3 md:gap-4 overflow-x-auto pt-6 pb-4 pr-3"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                {ONBOARDING_SCREENS.map((screen, idx) => {
                  const isPrimary = screen.weight === 'large'
                  const isEarly = idx < 3
                  const objective = ONBOARDING_OBJECTIVES.find((o) => o.id === hoveredObjective) as
                    | (typeof ONBOARDING_OBJECTIVES)[number]
                    | undefined
                  const linkedIds = objective?.linked as readonly OnboardingScreenId[] | undefined
                  const highlighted = linkedIds ? linkedIds.includes(screen.id) : true
                  const w = isPrimary ? 200 : 154
                  const h = isPrimary ? 420 : 330
                  return (
                    <motion.div
                      key={screen.id}
                      initial={{ opacity: 0, y: 26 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-15% 0px -15% 0px' }}
                      transition={{ duration: 0.45, delay: idx * 0.08 }}
                      animate={{
                        opacity: highlighted ? (isEarly ? 0.62 : 1) : 0.28,
                        y: highlighted ? 0 : 8,
                        scale: highlighted ? 1 : 0.97,
                      }}
                      whileHover={{ y: -6, transition: { duration: 0.16 } }}
                      className="shrink-0"
                    >
                      <PhoneMockup
                        style={{
                          width: w,
                          filter: isPrimary ? 'drop-shadow(0 14px 30px rgba(124,58,237,0.18))' : 'drop-shadow(0 9px 18px rgba(124,58,237,0.12))',
                        }}
                        screenHeight={h}
                      >
                        <div
                          className="onb-phone-scroll overflow-y-auto bg-white"
                          style={{
                            height: h,
                            filter: highlighted
                              ? (isEarly ? 'blur(0.4px) saturate(0.9)' : 'none')
                              : 'blur(0.9px) saturate(0.8)',
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={screen.url} alt={screen.label} className="w-full h-auto block" draggable={false} />
                        </div>
                      </PhoneMockup>

                      <div className="flex items-center mt-2.5 px-1">
                        <span className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                        <span className={`ml-1.5 text-[11px] font-medium whitespace-nowrap ${isEarly ? 'text-[#8f89ac]' : 'text-[#6a6681]'}`}>{screen.label}</span>
                      </div>
                    </motion.div>
                  )
                })}
              </motion.div>
              <button
                type="button"
                onClick={() => scrollScreens(1)}
                aria-label="Scroll onboarding screens right"
                className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-violet-100 bg-white/95 text-violet-700 shadow-md hover:bg-violet-50"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>

            </div>

            {/* AI context visualization */}
            <motion.div
              {...fadeUp(0.16)}
              className="mt-6 rounded-[24px] border border-violet-100 bg-white/70 backdrop-blur-sm p-3.5 md:p-4 shadow-[0_12px_28px_rgba(124,58,237,0.08)]"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-5">
                <div className="lg:w-[180px] shrink-0">
                  <p className="text-[9px] font-semibold tracking-[0.16em] uppercase text-violet-500 mb-1">What We Build</p>
                  <p className="text-[11px] text-[#6f6a89] leading-relaxed">Behind the scenes, we turn answers into context.</p>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 md:gap-3.5 overflow-x-auto pb-1">
                    {['Owner Data', 'Pet Data', 'Health Data', 'Routine Data'].map((item, idx) => (
                      <div key={item} className="flex items-center gap-2.5 md:gap-3.5 shrink-0">
                    <motion.div
                      initial={{ opacity: 0.35, scale: 0.98 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
                      transition={{ duration: 0.36, delay: idx * 0.08 }}
                      className="rounded-full border border-violet-200 bg-violet-50/70 px-3 py-1.5 text-[10px] font-semibold text-violet-700"
                    >
                      {item}
                    </motion.div>
                      {idx < 3 && <span className="text-violet-300 text-sm">+</span>}
                      </div>
                    ))}
                    <span className="text-violet-300 text-sm shrink-0">→</span>
                    <motion.div
                      initial={{ boxShadow: '0 0 0 rgba(124,58,237,0)' }}
                      whileInView={{ boxShadow: ['0 0 0 rgba(124,58,237,0)', '0 0 0 12px rgba(124,58,237,0.10)', '0 0 0 rgba(124,58,237,0)'] }}
                      viewport={{ once: false, margin: '-10% 0px -10% 0px' }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="rounded-full border border-violet-300 bg-violet-100 px-3 py-1.5 text-[10px] font-bold text-violet-700 shrink-0"
                    >
                      AI Context Created
                    </motion.div>
                    <span className="text-violet-300 text-sm shrink-0">→</span>
                    <div className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-[10px] font-semibold text-violet-700 shrink-0">Personalized Assistant</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── SECTION 6: Dashboard ──────────────────────────────────────────────────────
function DashboardSection() {
  const WHY_ITEMS = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
          <path d="M12 2L3 7v5c0 5.25 3.75 10.14 9 11.25C17.25 22.14 21 17.25 21 12V7L12 2z"/>
        </svg>
      ),
      title: 'Everything in one place',
      desc: "From daily walks to vet visits, all your pet's care in a single view.",
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9"/><path d="M12 6v6l3.5 2" strokeLinecap="round"/>
        </svg>
      ),
      title: 'Proactive, not reactive',
      desc: 'Smart reminders and insights help you stay ahead of issues.',
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 3c-1 2-4 3-4 7 0 3.31 2.69 6 6 6s6-2.69 6-6c0-4-3-5-4-7"/>
          <path d="M12 14v4m-2 2h4"/>
        </svg>
      ),
      title: 'Personalized for Sugar',
      desc: "AI recommendations tailored to Sugar's unique needs and habits.",
    },
  ]

  const FEATURE_CARDS = [
    {
      num: '01',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-teal-600" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/>
        </svg>
      ),
      title: "Today's Task",
      desc: 'Daily routines create consistency and reinforce healthy habits.',
      circleBg: 'bg-teal-100',
    },
    {
      num: '02',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-amber-600" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
      ),
      title: 'Reminder',
      desc: 'Timely nudges reduce missed vaccinations, grooming appointments, and medication schedules.',
      circleBg: 'bg-amber-100',
    },
    {
      num: '03',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-violet-500" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      title: 'Pet Calendar',
      desc: "A centralized timeline for every important milestone in your pet's journey.",
      circleBg: 'bg-amber-50',
    },
    {
      num: '04',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-indigo-400" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      title: 'Pet Wisdom',
      desc: 'Context-aware AI guidance powered by profile, health history, and routine behavior.',
      circleBg: 'bg-violet-100',
    },
  ]

  const DATA_FLOW = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-amber-600" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
        </svg>
      ),
      bg: 'bg-amber-50',
      label: 'Sugar',
      sub: 'Profile & Identity',
      highlighted: false,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-rose-500" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      bg: 'bg-rose-50',
      label: 'Health History',
      sub: 'Conditions, records & medications',
      highlighted: false,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-600" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
      bg: 'bg-emerald-50',
      label: 'Routine Data',
      sub: 'Walks, meals, sleep & activities',
      highlighted: false,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-violet-500" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
        </svg>
      ),
      bg: 'bg-violet-50',
      label: 'AI Context',
      sub: 'Unified understanding of Sugar',
      highlighted: false,
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-violet-700" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      bg: 'bg-violet-100',
      label: 'Personalized Guidance',
      sub: 'Smarter insights for better care',
      highlighted: true,
    },
  ]

  return (
    <section className="relative bg-[#faf9f7] py-20 z-10 overflow-hidden">
      {/* Decorative paw prints */}
      <div aria-hidden className="pointer-events-none select-none absolute top-10 left-[260px] text-violet-200 text-2xl opacity-60 rotate-12">🐾</div>
      <div aria-hidden className="pointer-events-none select-none absolute bottom-20 left-[320px] text-violet-200 text-xl opacity-40 -rotate-6">🐾</div>
      <div aria-hidden className="pointer-events-none select-none absolute top-8 right-[380px] text-violet-200 text-xl opacity-40 rotate-6">♡</div>
      <div aria-hidden className="pointer-events-none select-none absolute bottom-24 right-[200px] text-violet-200 text-xl opacity-30 -rotate-12">♡</div>

      <div className="mx-auto max-w-[1400px] px-6 md:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-10 xl:gap-16 items-start">

          {/* ── LEFT: Editorial content ── */}
          <div className="relative">
            <motion.p {...fadeUp(0)} className="mb-4 flex items-center gap-2 text-[10px] font-semibold tracking-[0.18em] text-violet-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />06 — Personalized Pet Dashboard
            </motion.p>

            <motion.h2 {...fadeUp(0.06)} className="font-serif text-[2.5rem] md:text-[2.8rem] leading-[0.96] text-[#151320] mb-5">
              Designed around
              <span className="block italic">the moments</span>
              <span className="block italic">that matter.</span>
            </motion.h2>

            <motion.p {...fadeUp(0.1)} className="text-[13.5px] text-[#6a6681] leading-relaxed mb-8">
              A single destination for routines, reminders, health history, and personalized care guidance.
            </motion.p>

            {/* Why it matters */}
            <motion.div {...fadeUp(0.13)}>
              <p className="text-[12.5px] font-semibold text-[#151320] mb-4">
                Why it <span className="underline decoration-violet-400 decoration-2 underline-offset-2">matters</span>
              </p>
              <div className="flex flex-col gap-4">
                {WHY_ITEMS.map((item, i) => (
                  <motion.div key={item.title} {...fadeUp(0.15 + i * 0.06)} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg border border-violet-200 bg-violet-50 flex items-center justify-center text-violet-600 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[12px] font-semibold text-[#151320] mb-0.5">{item.title}</p>
                      <p className="text-[11px] text-[#9896a8] leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* ── RIGHT: Phone + Cards + Data Flow ── */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 xl:gap-8 items-start">

            {/* Phone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '150px' }}
              transition={{ duration: 0.45 }}
              className="flex justify-center"
            >
              <PhoneMockup style={{ width: 220, filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.18))' }} screenHeight={500}>
                <div className="overflow-y-auto h-full" style={{ scrollbarWidth: 'none' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/screen.png"
                    alt="Dashboard screen"
                    className="w-full h-auto block"
                    draggable={false}
                  />
                </div>
              </PhoneMockup>
            </motion.div>

            {/* Feature cards */}
            <div className="flex flex-col gap-3 justify-center h-full">
              {FEATURE_CARDS.map((card, i) => (
                <motion.div
                  key={card.num}
                  {...fadeUp(0.08 + i * 0.08)}
                  className="relative flex items-start gap-3 p-4 rounded-2xl border border-stone-200/60 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.05)]"
                >
                  {/* dashed arrow from left */}
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                    <div className="w-4 border-t-2 border-dashed border-violet-300/70" />
                    <svg width="5" height="7" viewBox="0 0 5 7" fill="none"><path d="M0 0L5 3.5L0 7V0Z" fill="#c4b5fd"/></svg>
                  </div>
                  {/* large circular icon */}
                  <div className={`w-11 h-11 rounded-full ${card.circleBg} flex items-center justify-center shrink-0 [&>svg]:w-5 [&>svg]:h-5`}>
                    {card.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9.5px] font-bold text-violet-500 tracking-wider mb-0.5">{card.num}</p>
                    <p className="text-[12.5px] font-semibold text-[#151320] mb-1">{card.title}</p>
                    <p className="text-[10.5px] text-[#9896a8] leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Data flow */}
            <div className="shrink-0 min-w-[160px]">
              <motion.p {...fadeUp(0.06)} className="font-serif italic text-[12px] text-violet-500 mb-5 leading-snug text-right">
                From data to<br />meaningful guidance
              </motion.p>
              <div className="flex flex-col">
                {DATA_FLOW.map((node, i) => (
                  <div key={node.label} className="flex flex-col items-start">
                    <motion.div
                      {...fadeUp(0.1 + i * 0.08)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border w-full ${node.highlighted ? 'border-violet-300 bg-violet-50 shadow-[0_4px_14px_rgba(124,58,237,0.12)]' : 'border-stone-200/70 bg-white'}`}
                    >
                      <div className={`w-9 h-9 rounded-full ${node.bg} flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4`}>
                        {node.icon}
                      </div>
                      <div>
                        <p className={`text-[11px] font-semibold leading-tight ${node.highlighted ? 'text-violet-700' : 'text-[#151320]'}`}>{node.label}</p>
                        <p className="text-[9px] text-[#9896a8] leading-tight mt-0.5">{node.sub}</p>
                      </div>
                    </motion.div>
                    {i < DATA_FLOW.length - 1 && (
                      <div className="flex flex-col items-center ml-[18px] py-0.5 gap-[2px]">
                        {[0,1,2].map(d => <div key={d} className="w-px h-1 bg-violet-300/70" />)}
                        <svg width="6" height="5" viewBox="0 0 6 5" fill="none"><path d="M3 5L0 0h6L3 5z" fill="#c4b5fd"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: cursive note + quote */}
        <motion.div {...fadeUp(0.38)} className="mt-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-serif italic text-[13px] text-violet-500/80 leading-relaxed shrink-0">
            Built to simplify care<br />and strengthen the bond.
          </p>
          <div className="flex items-start gap-2">
            <span className="font-serif text-5xl text-violet-200 leading-none select-none mt-1">&quot;</span>
            <p className="font-serif italic text-[14px] text-[#9896a8] mt-4 max-w-[520px] leading-relaxed">
              Our goal was simple: make pet care feel less overwhelming, and more connected.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ── SECTION 7: AI Assistant ───────────────────────────────────────────────────
const CONTEXT_NODES = [
  { id: 'profile', label: 'Pet Profile', icon: '🐾', info: 'Breed, age, weight, dietary needs, and behavioral traits' },
  { id: 'health', label: 'Health History', icon: '❤️', info: 'Vaccination records, past conditions, allergies, vet notes' },
  { id: 'routine', label: 'Routine Data', icon: '📋', info: 'Daily schedules, activity logs, feeding patterns' },
  { id: 'conv', label: 'Previous Convs', icon: '💬', info: 'Prior questions, identified patterns, flagged concerns' },
  { id: 'ai', label: 'AI Response', icon: '✦', info: 'Synthesizes all context to provide personalized, actionable guidance' },
]

function AIAssistantSection() {
  const [activeNode, setActiveNode] = useState<string | null>(null)
  return (
    <section className="relative bg-[#faf9f7] py-32 z-10">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12 lg:px-20">
        <motion.p {...fadeUp(0)} className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted/60 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />07 — AI Pet Assistant
        </motion.p>
        <motion.h2 {...fadeUp(0.08)} className="font-serif text-[2.2rem] font-medium tracking-tightest text-ink mb-3">Not a chatbot. A context engine.</motion.h2>
        <motion.p {...fadeUp(0.14)} className="text-[14px] text-muted mb-12 max-w-[420px]">Contextual AI that understands your pet&apos;s full history — not just your last question.</motion.p>
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '180px' }} transition={{ duration: 0.45 }} className="flex-shrink-0">
            <PhoneMockup><AIAssistantScreen /></PhoneMockup>
          </motion.div>
          <div className="flex-1">
            <p className="text-[10px] font-semibold text-violet-500 tracking-widest uppercase mb-8">Context Engine</p>
            <div className="flex flex-col gap-0">
              {CONTEXT_NODES.map((node, i) => (
                <div key={node.id} className="flex flex-col items-start">
                  <motion.div onHoverStart={() => setActiveNode(node.id)} onHoverEnd={() => setActiveNode(null)} whileHover={{ x: 6, transition: { duration: 0.1 } }}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border cursor-default transition-colors duration-100 min-w-[280px] ${activeNode === node.id ? 'border-violet-300 bg-violet-50 shadow-[0_4px_24px_rgba(124,58,237,0.12)]' : 'border-stone-200/70 bg-white/60'}`}>
                    <span className="text-xl shrink-0">{node.icon}</span>
                    <div className="flex-1">
                      <p className="text-[12.5px] font-semibold text-ink">{node.label}</p>
                      <AnimatePresence>
                        {activeNode === node.id && (
                          <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-[11px] text-muted mt-0.5 leading-relaxed overflow-hidden">
                            {node.info}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                  {i < CONTEXT_NODES.length - 1 && (
                    <motion.div animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                      className="ml-7 w-px h-6 bg-gradient-to-b from-violet-300 to-violet-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── SECTION 8: Behavioral Design ─────────────────────────────────────────────
const BEHAVIOR_NODES = [
  {
    index: '01',
    label: 'Reminder',
    sub: 'Triggers & Nudges',
    icon: '🔔',
    desc: 'Timely nudges bring important care tasks to the right moment.',
  },
  {
    index: '02',
    label: 'Action',
    sub: 'Core Activity',
    icon: '⚡',
    desc: 'Simple, guided actions make it easy to care and stay on track.',
  },
  {
    index: '03',
    label: 'Reward',
    sub: 'Positive Feedback',
    icon: '🏆',
    desc: 'Celebrating small wins builds motivation and satisfaction.',
  },
  {
    index: '04',
    label: 'Consistency',
    sub: 'Habit Reinforcement',
    icon: '🔁',
    desc: 'Repetition turns care into a habit that becomes second nature.',
  },
]

function BehavioralSection() {
  return (
    <section className="relative z-10 overflow-hidden border-y border-white/10 py-14 lg:flex lg:min-h-screen lg:items-center" style={{ background: 'radial-gradient(ellipse at 50% 0%, #171329 0%, #0b0912 62%, #07060b 100%)' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(1px 1px at 8% 18%, rgba(226,218,255,0.8) 0, transparent 1.5px), radial-gradient(1px 1px at 19% 73%, rgba(196,181,253,0.65) 0, transparent 1.5px), radial-gradient(1px 1px at 31% 34%, rgba(255,255,255,0.55) 0, transparent 1.5px), radial-gradient(1px 1px at 47% 12%, rgba(196,181,253,0.7) 0, transparent 1.5px), radial-gradient(1px 1px at 62% 81%, rgba(255,255,255,0.5) 0, transparent 1.5px), radial-gradient(1px 1px at 76% 26%, rgba(196,181,253,0.7) 0, transparent 1.5px), radial-gradient(1px 1px at 91% 64%, rgba(255,255,255,0.55) 0, transparent 1.5px)' }} />
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="rounded-3xl border border-stone-200/80 bg-[#faf9f7] px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <motion.p {...fadeUp(0)} className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted/60 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />08 — Behavioral Design System
        </motion.p>
        <motion.h2 {...fadeUp(0.08)} className="font-serif text-[2rem] md:text-[2.45rem] font-medium leading-[0.98] tracking-tightest text-ink mb-3 max-w-[520px]">
          Built using
          <span className="text-violet-500 italic"> habit loop </span>
          principles.
        </motion.h2>
        <motion.div {...fadeUp(0.12)} className="h-0.5 w-9 bg-violet-500/80 rounded-full mb-4" />
        <motion.p {...fadeUp(0.14)} className="text-[14px] text-muted mb-3 max-w-[420px] leading-relaxed">
          Every interaction is designed to create a loop that reinforces positive pet care habits.
        </motion.p>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 items-stretch">
            {BEHAVIOR_NODES.map((node, i) => (
              <div key={node.label} className="relative">
                <motion.div
                  {...fadeUp(0.18 + i * 0.07)}
                  className="h-full rounded-xl border border-white/10 bg-[#171522] px-4 py-3.5 shadow-[0_8px_22px_rgba(0,0,0,0.18)]"
                >
                  <p className="text-[10px] font-semibold text-violet-300 mb-1.5">{node.index}</p>
                  <p className="text-[30px] leading-none mb-2">{node.icon}</p>
                  <p className="font-serif text-[1.9rem] text-white mb-1.5">{node.label}</p>
                  <p className="inline-flex rounded-full bg-violet-400/15 px-2 py-0.5 text-[10px] text-violet-200 mb-2">{node.sub}</p>
                  <p className="text-[11.5px] text-white/65 leading-relaxed">{node.desc}</p>
                </motion.div>

                {i < BEHAVIOR_NODES.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 -translate-y-1/2 items-center gap-1 text-violet-300">
                    <div className="w-5 border-t border-dashed border-violet-300" />
                    <svg width="7" height="9" viewBox="0 0 8 10" fill="none"><path d="M0 0L8 5L0 10V0Z" fill="#a78bfa"/></svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom loop connector */}
          <div className="hidden md:block relative mt-4 px-10">
            <div className="h-7 border-b border-l border-r border-dashed border-violet-300 rounded-b-xl" />
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 rounded-lg border border-violet-200 bg-violet-100/60 px-3 py-1 text-[11px] text-violet-500">
              ◌◌ Loop repeats → building lasting habits
            </div>
            <div className="absolute left-0 top-0 -translate-x-1/2 -translate-y-[55%] text-violet-400 text-[10px]">▲</div>
          </div>
        </div>

        <motion.div {...fadeUp(0.32)} className="mt-6 rounded-xl border border-violet-100 bg-violet-50/45 px-5 md:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-500 text-base shrink-0">✦</div>
            <p className="font-serif text-[1.2rem] text-[#444056] leading-relaxed">
              The more pets thrive, the stronger the habit.
              <span className="block text-violet-600 font-semibold text-[1.15rem]">Better for pets. Easier for parents. Every day.</span>
            </p>
          </div>
          <div className="text-violet-200 text-4xl leading-none select-none">🐾</div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── SECTION 9: Ecosystem ──────────────────────────────────────────────────────
const ECO_NODES = [
  { id: 'home', label: 'Home', x: 50, y: 45, r: 14, color: '#7c3aed' },
  { id: 'ai', label: 'AI Assistant', x: 18, y: 18, r: 10, color: '#a5b4fc' },
  { id: 'profile', label: 'Pet Profile', x: 82, y: 18, r: 10, color: '#a5b4fc' },
  { id: 'health', label: 'Health Records', x: 12, y: 58, r: 9, color: '#c4b5fd' },
  { id: 'routines', label: 'Routines', x: 88, y: 58, r: 9, color: '#c4b5fd' },
  { id: 'calendar', label: 'Calendar', x: 28, y: 84, r: 8, color: '#ddd6fe' },
  { id: 'emergency', label: 'Emergency', x: 72, y: 84, r: 8, color: '#fda4af' },
  { id: 'settings', label: 'Settings', x: 50, y: 88, r: 7, color: '#d1d5db' },
]
const ECO_EDGES = [['home','ai'],['home','profile'],['home','health'],['home','routines'],['home','calendar'],['home','emergency'],['home','settings'],['ai','health'],['profile','routines']]

function EcosystemSection() {
  const [hover, setHover] = useState<string | null>(null)
  const connected = (id: string) => hover ? ECO_EDGES.some(([a, b]) => (a === hover && b === id) || (b === hover && a === id)) : false
  return (
    <section className="relative bg-[#f7f6ff] py-32 z-10">
      <div className="mx-auto max-w-[1300px] px-6 md:px-12 lg:px-20">
        <motion.p {...fadeUp(0)} className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted/60 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />09 — Product Ecosystem
        </motion.p>
        <motion.h2 {...fadeUp(0.08)} className="font-serif text-[2.2rem] font-medium tracking-tightest text-ink mb-3">A living information architecture.</motion.h2>
        <motion.p {...fadeUp(0.14)} className="text-[14px] text-muted mb-10 max-w-[380px]">Hover any node to reveal its relationships across the system.</motion.p>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: '180px' }} transition={{ duration: 0.4 }} className="relative w-full max-w-[640px] mx-auto" style={{ paddingBottom: '56%' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            {ECO_EDGES.map(([a, b]) => {
              const na = ECO_NODES.find(n => n.id === a)!; const nb = ECO_NODES.find(n => n.id === b)!
              const active = hover && (a === hover || b === hover)
              return <line key={`${a}-${b}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={active ? '#7c3aed' : '#e5e7eb'} strokeWidth={active ? 0.5 : 0.25} opacity={active ? 0.9 : 0.5} />
            })}
            {ECO_NODES.map((node) => {
              const isH = hover === node.id; const isConn = connected(node.id)
              return (
                <g key={node.id} onMouseEnter={() => setHover(node.id)} onMouseLeave={() => setHover(null)} style={{ cursor: 'default' }}>
                  <circle cx={node.x} cy={node.y} r={isH ? node.r * 1.15 : node.r} fill={node.color} opacity={hover && !isH && !isConn ? 0.2 : 0.9} style={{ transition: 'all 0.2s' }} />
                  <text x={node.x} y={node.y + node.r + 4} textAnchor="middle" fontSize="2.8" fill="#1c1917" opacity={hover && !isH && !isConn ? 0.2 : 0.85} fontFamily="system-ui" fontWeight="500">
                    {node.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  )
}

// ── SECTION 10: MVP ────────────────────────────────────────────────────────────
const MVP_LOOP_CARDS = [
  {
    id: '01',
    title: 'Understand My Pet',
    tag: 'Context-Aware AI Copilot',
    desc: 'Personalized guidance using pet history, routines, symptoms, and past conversations.',
    points: ['AI Copilot', 'Symptom Logging', 'AI Context Engine'],
    icon: '🧠',
    iconBg: 'bg-rose-100',
    position: 'xl:absolute xl:top-0 xl:left-1/2 xl:-translate-x-1/2',
  },
  {
    id: '02',
    title: 'Build Better Care Habits',
    tag: 'Daily Care Management',
    desc: 'Help owners stay consistent with routines, reminders, and progress tracking.',
    points: ['Routine Tracking', 'Notifications', 'Care Calendar'],
    icon: '🐾',
    iconBg: 'bg-amber-100',
    position: 'xl:absolute xl:right-0 xl:top-1/2 xl:-translate-y-1/2',
  },
  {
    id: '03',
    title: 'Maintain Health History',
    tag: 'Health Intelligence',
    desc: 'A centralized system for vaccinations, conditions, symptoms, and medical records.',
    points: ['Health Records', 'Symptom Tracking', 'Vaccination Tracking'],
    icon: '🛡️',
    iconBg: 'bg-emerald-100',
    position: 'xl:absolute xl:bottom-0 xl:left-1/2 xl:-translate-x-1/2',
  },
  {
    id: '04',
    title: 'Manage Every Pet',
    tag: 'Multi-Pet Profiles',
    desc: 'Separate care journeys, records, and AI context for each pet.',
    points: ['Authentication', 'Multi-Pet Support', 'Pet Profiles'],
    icon: '👥',
    iconBg: 'bg-sky-100',
    position: 'xl:absolute xl:left-0 xl:top-1/2 xl:-translate-y-1/2',
  },
]

const MVP_INCLUDED = [
  ['Context-Aware AI Copilot', 'Personalized insights and guidance'],
  ['Health Tracking', 'Records, symptoms, and vaccinations'],
  ['Routine & Habit Building', 'Routines, reminders, and streaks'],
  ['Multi-Pet Support', 'Manage multiple pets with ease'],
  ['Smart Notifications', 'Timely nudges that drive action'],
]

const MVP_EXCLUDED = [
  ['Vet Booking', 'Deferred to focus on core care loop'],
  ['Teleconsultation', 'Complex integration for later'],
  ['Insurance Integration', 'Not critical for early validation'],
  ['Marketplace', 'Outside the core user journey'],
  ['Wearable Integrations', 'Future enhancement'],
]

function MVPSection() {
  return (
    <section className="relative bg-[#faf9f7] pt-8 pb-16 z-10">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-12">
        <motion.p {...fadeUp(0)} className="mb-4 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted/60 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 inline-block" />10 — MVP Scope
        </motion.p>
        <div className="grid grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_290px] gap-6 items-start">
          <div>
            <motion.h2 {...fadeUp(0.08)} className="font-serif text-[2.2rem] md:text-[2.7rem] leading-[0.98] text-ink mb-4">
              Focused on validating
              <span className="block italic text-violet-500">the core pet care loop.</span>
            </motion.h2>
            <motion.div {...fadeUp(0.1)} className="h-0.5 w-12 bg-violet-500/80 rounded-full mb-5" />
            <motion.p {...fadeUp(0.12)} className="text-[14px] text-muted leading-relaxed max-w-[250px] mb-6">
              Instead of building every possible feature, the MVP focused on helping pet owners understand, track, and care for their pets more consistently.
            </motion.p>

            <motion.div {...fadeUp(0.16)} className="rounded-2xl border border-violet-100 bg-violet-50/35 p-4 mb-4">
              <p className="text-[13px] font-semibold text-violet-600 mb-2">✦ Why these features?</p>
              <p className="text-[12px] text-[#6c6689] leading-relaxed mb-4">We prioritized features that solve real care challenges and create a habit loop driving consistent engagement and long-term value.</p>
              <div className="h-px bg-violet-100 mb-4" />
              <p className="text-[12px] text-[#6c6689] leading-relaxed">
                MVP built for
                <span className="block text-violet-600 font-semibold text-[1.05rem] leading-snug">pet parents, by understanding them.</span>
              </p>
            </motion.div>
          </div>

          <div className="relative">
            <div className="hidden xl:block absolute inset-0 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 760 620" fill="none" preserveAspectRatio="none">
                <circle cx="380" cy="310" r="190" stroke="#c4b5fd" strokeDasharray="4 6" opacity="0.9" />
              </svg>
            </div>

            <div className="relative min-h-0 xl:min-h-[580px] grid grid-cols-1 md:grid-cols-2 gap-4 xl:block">
              <div className="hidden xl:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-violet-200 bg-white/85 items-center justify-center text-center p-5 shadow-[0_8px_28px_rgba(124,58,237,0.08)]">
                <div>
                  <p className="text-2xl mb-1">♡</p>
                  <p className="font-serif text-[1.05rem] leading-tight text-[#2b2740]">Consistent Pet Care</p>
                  <p className="text-[10px] text-muted mt-1">The outcome that drives every decision.</p>
                </div>
              </div>

              {MVP_LOOP_CARDS.map((card, i) => (
                <motion.div
                  key={card.id}
                  {...fadeUp(0.18 + i * 0.06)}
                  className={`${card.position} rounded-2xl border border-stone-200/80 bg-white/85 p-2.5 shadow-[0_8px_22px_rgba(0,0,0,0.04)] xl:w-[180px]`}
                >
                  <div className="flex items-start gap-1.5 mb-1">
                    <div className={`w-7 h-7 rounded-full ${card.iconBg} flex items-center justify-center text-sm shrink-0`}>{card.icon}</div>
                    <div>
                      <p className="text-[9px] font-semibold text-violet-500">{card.id}</p>
                      <p className="font-semibold text-[11px] text-[#242035] leading-snug">{card.title}</p>
                      <p className="inline-flex mt-0.5 rounded-full bg-violet-100/70 px-1.5 py-0.5 text-[8px] text-violet-600">{card.tag}</p>
                    </div>
                  </div>
                  <p className="text-[9px] text-muted leading-relaxed mb-1.5">{card.desc}</p>
                  <div className="pt-1 border-t border-stone-100">
                    <p className="text-[7.5px] font-semibold tracking-wide text-violet-400 mb-0.5">INCLUDED</p>
                    {card.points.map((p) => (
                      <p key={p} className="text-[8.5px] text-[#615c7e] leading-snug">• {p}</p>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <motion.div {...fadeUp(0.14)} className="rounded-2xl border border-emerald-100 bg-emerald-50/35 p-3">
              <p className="text-[9.5px] font-semibold tracking-[0.14em] text-emerald-600 uppercase mb-1.5">Included in MVP</p>
              <div className="space-y-1.5">
                {MVP_INCLUDED.map(([t, s]) => (
                  <div key={t} className="pb-1.5 border-b border-emerald-100/70 last:border-b-0 last:pb-0">
                    <p className="text-[10.5px] font-semibold text-[#1f1b30]">● {t}</p>
                    <p className="text-[9.5px] text-[#6b6783]">{s}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 rounded-xl bg-emerald-100/80 px-2.5 py-1 text-[9.5px] text-emerald-700 font-medium text-center">Focused. Intentional. Impactful.</p>
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="rounded-2xl border border-rose-100 bg-rose-50/35 p-3">
              <p className="text-[9.5px] font-semibold tracking-[0.14em] text-rose-600 uppercase mb-1.5">Deliberately Excluded</p>
              <div className="space-y-1.5">
                {MVP_EXCLUDED.map(([t, s]) => (
                  <div key={t} className="pb-1.5 border-b border-rose-100/70 last:border-b-0 last:pb-0">
                    <p className="text-[10.5px] font-semibold text-[#1f1b30]">✕ {t}</p>
                    <p className="text-[9.5px] text-[#6b6783]">{s}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp(0.24)} className="rounded-xl border border-violet-100 bg-violet-50/40 p-2.5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-500 text-sm shrink-0">✦</div>
              <p className="text-[9.5px] text-[#5e5a78] leading-relaxed"><span className="font-semibold text-violet-600">Our principle</span><br />We build less, but build what matters.</p>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}

// ── SECTION 12: Reflections ────────────────────────────────────────────────────
const REFLECTIONS = [
  {
    index: '01',
    icon: '🧠',
    title: 'Designing AI experiences that provide contextual value.',
    body: "AI only earns trust when it consistently understands the user's specific context — not just generic input.",
  },
  {
    index: '02',
    icon: '🔗',
    title: 'Building product ecosystems instead of isolated features.',
    body: 'The most impactful design decisions connect features into a coherent, reinforcing system.',
  },
  {
    index: '03',
    icon: '🔁',
    title: 'Using behavioral design to encourage habit formation.',
    body: 'Products that align with natural behavior loops are adopted faster and abandoned less.',
  },
  {
    index: '04',
    icon: '⚖️',
    title: 'Balancing user needs, business goals, and technical feasibility.',
    body: 'Great products live at the intersection of desirability, viability, and feasibility.',
  },
]

function ReflectionsSection() {
  return (
    <section className="relative bg-[#faf9f7] py-20 z-10">
      <div className="mx-auto max-w-[1360px] px-6 md:px-10 lg:px-14">
        <motion.p {...fadeUp(0)} className="mb-5 flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-muted/60 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />12 — Reflections
        </motion.p>
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-[620px_1fr] gap-5 lg:gap-8 items-start">
            <motion.h2 {...fadeUp(0.08)} className="font-serif text-[2.5rem] md:text-[3.2rem] leading-[0.98] tracking-tightest text-ink mb-2 max-w-[620px]">
              Key learnings from
              <span className="block italic text-violet-500">building Chonkers.</span>
            </motion.h2>
            <motion.p {...fadeUp(0.12)} className="lg:pt-3 lg:justify-self-start text-[14px] text-muted max-w-[340px] leading-relaxed">
              Design decisions rooted in empathy, research, and systems thinking.
            </motion.p>
          </div>
          <motion.div {...fadeUp(0.1)} className="h-0.5 w-12 bg-violet-500/80 rounded-full mt-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {REFLECTIONS.map((r, i) => {
            const active = i === 0
            return (
              <motion.div
                key={r.title}
                {...fadeUp(0.16 + i * 0.07)}
                whileHover={{ y: -3, boxShadow: '0 16px 44px rgba(0,0,0,0.06)', transition: { duration: 0.12 } }}
                className={`rounded-2xl border bg-white/80 px-7 py-6 ${active ? 'border-violet-300 shadow-[0_8px_28px_rgba(124,58,237,0.14)]' : 'border-stone-200/80 shadow-[0_6px_20px_rgba(0,0,0,0.04)]'}`}
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-full bg-violet-100/80 flex items-center justify-center text-[28px] shrink-0">{r.icon}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold text-violet-500 mb-1">• {r.index}</p>
                    <p className="font-serif text-[1.95rem] leading-tight text-ink mb-2">{r.title}</p>
                    <p className="text-[13px] text-muted leading-relaxed max-w-[460px]">{r.body}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

// ── SECTION 13: Outcome ────────────────────────────────────────────────────────
function OutcomeSection() {
  const { ref, inView } = useInViewport<HTMLElement>('300px')
  return (
    <section ref={ref} className="relative min-h-[70vh] bg-[#0d0c14] flex items-center overflow-hidden py-32 z-10">
      {inView && STARS.map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white" style={{ width: s.w, height: s.w, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 3.5, s.opacity] }} transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }} />
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[350px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.16) 0%, transparent 65%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-[1000px] px-6 md:px-12 text-center">
        <motion.p {...fadeUp(0)} className="text-[10.5px] font-semibold tracking-[0.22em] text-violet-400 uppercase mb-8">13 — Outcome</motion.p>
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '180px' }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-serif text-[2.6rem] md:text-[3.6rem] font-medium leading-[1.1] tracking-tightest text-white mb-10">
          Chonkers evolved from a pet care concept into an AI-first platform combining health management, routine automation, and intelligent assistance into a single product experience.
        </motion.h2>
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-12 mt-12">
          {[{ v: '85%+', l: 'Habit Completion Rate' }, { v: '12.4', l: 'AI Conversations / day' }, { v: '65%+', l: 'Day 30 Retention' }].map(({ v, l }) => (
            <div key={l} className="flex flex-col items-center gap-2">
              <span className="font-serif text-[2.4rem] font-medium text-violet-400">{v}</span>
              <span className="text-[11.5px] text-white/35 tracking-wide">{l}</span>
            </div>
          ))}
        </motion.div>
        <motion.div {...fadeUp(0.5)} className="mt-16">
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-colors text-[13px] font-medium tracking-wide">
            ← Back to Work
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ── Main export ────────────────────────────────────────────────────────────────
export default function ChonkersCaseStudy() {
  const [isStoryOpen, setIsStoryOpen] = useState(false)

  return (
    <div className="antialiased">
      <HeroSection onOpenStory={() => setIsStoryOpen(true)} />
      <ProblemSection />
      <VisionSection />
      <ResearchSection />
      <OnboardingSection />
      <DashboardSection />
      <BehavioralSection />
      <MVPSection />
      <ReflectionsSection />
      <OutcomeSection />
      <AnimatePresence>
        {isStoryOpen && <ChonkersStoryModal onClose={() => setIsStoryOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
