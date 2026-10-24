'use client'

import React, { useState } from 'react'
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

// ── Animation helper ──────────────────────────────────────────────────────
function fadeUp(delay = 0, duration = 0.42) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '180px' } as const,
    transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }
}

// ── Icons ──────────────────────────────────────────────────────────────────
function IconArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="inline-block">
      <path d="M2.5 10.5L10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Galaxy background (hero visual) ─────────────────────────────────────────
const HERO_DOTS = [
  { left: 8, top: 18 }, { left: 22, top: 38 }, { left: 14, top: 62 }, { left: 34, top: 12 },
  { left: 62, top: 15 }, { left: 78, top: 34 }, { left: 91, top: 55 }, { left: 88, top: 18 },
  { left: 46, top: 8 }, { left: 6, top: 42 }, { left: 96, top: 40 }, { left: 55, top: 30 },
]
const HERO_SPARKLES = [
  { left: 25, top: 25 }, { left: 91, top: 27 }, { left: 53, top: 92 },
]

function IconSparkle({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 0 C10.5 6.5 13.5 9.5 20 10 C13.5 10.5 10.5 13.5 10 20 C9.5 13.5 6.5 10.5 0 10 C6.5 9.5 9.5 6.5 10 0Z" fill="white" />
    </svg>
  )
}

function GalaxyBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Nebula haze */}
      <div className="absolute -top-24 -left-32 w-[560px] h-[560px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%)' }} />
      <div className="absolute top-4 right-0 w-[460px] h-[460px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)' }} />

      {/* Secondary crescent planet, upper right */}
      <div className="absolute rounded-full" style={{
        width: 84, height: 84, right: -18, top: '11%',
        background: 'radial-gradient(circle at 34% 32%, rgba(199,210,254,0.9) 0%, rgba(79,70,229,0.55) 45%, rgba(30,27,75,0.3) 68%, transparent 80%)',
        boxShadow: '0 0 40px 6px rgba(99,102,241,0.18)',
      }} />

      {/* Orbit ring — single sweeping ellipse across the whole scene */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1600 800" fill="none" preserveAspectRatio="none">
        <ellipse cx="800" cy="260" rx="920" ry="210" stroke="rgba(165,180,252,0.3)" strokeWidth="1" fill="none" />
      </svg>

      {/* Bright sparkle flares along the orbit */}
      {HERO_SPARKLES.map((s, i) => (
        <motion.span key={i} className="absolute" style={{ left: `${s.left}%`, top: `${s.top}%` }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.2, ease: 'easeInOut' }}>
          <IconSparkle size={12} />
        </motion.span>
      ))}

      {/* Ambient star dots */}
      {HERO_DOTS.map((s, i) => (
        <motion.span key={i} className="absolute rounded-full bg-white"
          style={{ left: `${s.left}%`, top: `${s.top}%`, width: 2, height: 2 }}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }} />
      ))}

      {/* Giant planet — full-width horizon at the bottom */}
      {/* Positioning lives on a static wrapper; framer-motion's `animate` prop
          takes over the `transform` CSS property, which would otherwise wipe
          out an inline translateX(-50%) centering hack after mount. */}
      <div className="absolute left-1/2 -translate-x-1/2 rounded-full overflow-hidden"
        style={{ width: 2300, height: 2300, bottom: -1950 }}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 0%, rgba(199,210,254,0.9) 0%, rgba(99,102,241,0.7) 4%, rgba(67,56,202,0.55) 12%, rgba(30,27,75,0.5) 26%, rgba(8,6,20,0.3) 42%, transparent 55%)',
          }}
          animate={{ scale: [1, 1.008, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 opacity-30"
            style={{ background: 'repeating-linear-gradient(0deg, transparent 0px 14px, rgba(224,231,255,0.06) 14px 16px)' }} />
          <div className="absolute inset-x-0 top-0 h-2 opacity-70"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(199,210,254,0.9) 45%, rgba(199,210,254,0.9) 55%, transparent)' }} />
        </motion.div>
      </div>
    </div>
  )
}

// ── SECTION 1: Hero ────────────────────────────────────────────────────────
function HeroSection() {
  const tags = ['Generative AI', 'E-commerce', 'Video Automation', 'Product Management']
  return (
    <section className="relative overflow-hidden flex flex-col sticky top-0 z-0"
      style={{ minHeight: '100vh', background: 'radial-gradient(ellipse 100% 80% at 50% 30%, #0d0b1f 0%, #050308 65%)' }}>

      <GalaxyBackground />

      <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 md:px-12 lg:px-20 pt-10 pb-16 flex-1 flex flex-col">

        {/* Top bar */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center mb-10 md:mb-12">
          <Link href="/" className="inline-flex justify-self-start items-center gap-2 rounded-full border border-white/15 px-3.5 py-2 text-[12px] font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M11.5 7H2.5M2.5 7l4-4M2.5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden sm:inline">Back to home</span>
            <span className="sm:hidden">Home</span>
          </Link>
          <motion.span {...fadeUp(0)} className="inline-flex text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
            01 — Overview
          </motion.span>
          <motion.span {...fadeUp(0)} className="inline-flex justify-self-end items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-white/40 uppercase">
            Dresma <span className="w-6 h-px bg-white/25" /> 2025
          </motion.span>
        </div>

        {/* Centered content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center pb-24 md:pb-32">
          <motion.p {...fadeUp(0.05)} className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-indigo-300 uppercase mb-6">
            Ideas <span className="text-indigo-300/50">→</span> Videos <span className="text-indigo-300/50">→</span> Real Impact
          </motion.p>
          <motion.h1 {...fadeUp(0.12)} className="font-sans text-[4.4rem] md:text-[6.8rem] lg:text-[7.6rem] font-bold leading-[1.0] tracking-tightest mb-5">
            <span className="text-white">AI </span>
            <span style={{ backgroundImage: 'linear-gradient(90deg, #a5b4fc 0%, #818cf8 55%, #6366f1 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Video</span>
            <br />
            <span style={{ backgroundImage: 'linear-gradient(180deg, #ffffff 0%, #ffffff 55%, #c7d2fe 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>Journey</span>
          </motion.h1>
          <motion.p {...fadeUp(0.16)} className="text-[1.5rem] md:text-[1.9rem] font-medium text-white/80 mb-7" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            From Reference to Results
          </motion.p>
          <motion.p {...fadeUp(0.2)} className="font-sans text-[18px] md:text-[20px] text-white/55 leading-relaxed mb-9 max-w-[620px]">
            Explore how we turn ideas into high-quality product videos using AI — faster, smarter, and at scale.
          </motion.p>

          <motion.div {...fadeUp(0.26)} className="flex flex-wrap items-center justify-center gap-2.5 mb-9">
            {tags.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-white/70">
                <span className="w-1 h-1 rounded-full bg-indigo-300" />
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.32)}>
            <motion.button
              whileHover={{ scale: 1.03, transition: { duration: 0.1 } }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold tracking-wide text-white"
              style={{ background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 8px 30px rgba(99,102,241,0.4)' }}
            >
              Start the journey <IconArrowUpRight />
            </motion.button>
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="flex flex-col items-center gap-3 mt-7">
            <span className="text-[12px] font-medium text-white/45">Scroll to explore</span>
            <svg width="16" height="22" viewBox="0 0 16 22" fill="none" className="text-white/45">
              <rect x="1" y="1" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="1.2" />
              <motion.rect x="7" y="5" width="2" height="5" rx="1" fill="currentColor"
                animate={{ y: [5, 10, 5], opacity: [0.6, 0.15, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ── Step-flow icons (flat, single-color) ───────────────────────────────────
function IconHourglass() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3.5 1.5H12.5M3.5 14.5H12.5M4 1.5C4 5 6 6.5 8 7.5C10 6.5 12 5 12 1.5M4 14.5C4 11 6 9.5 8 8.5C10 9.5 12 11 12 14.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconCoins() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <ellipse cx="8" cy="4.5" rx="5" ry="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 4.5V8C3 9.1 5.24 10 8 10C10.76 10 13 9.1 13 8V4.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M3 8V11.5C3 12.6 5.24 13.5 8 13.5C10.76 13.5 13 12.6 13 11.5V8" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
function IconWarning() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.8L14.8 13.5H1.2L8 1.8Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M8 6.2V9.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11.4" r="0.9" fill="currentColor" />
    </svg>
  )
}
function IconChart() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 13.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="3.2" y="8.5" width="2.4" height="5" rx="0.6" fill="currentColor" />
      <rect x="6.8" y="5.5" width="2.4" height="8" rx="0.6" fill="currentColor" />
      <rect x="10.4" y="9.8" width="2.4" height="3.7" rx="0.6" fill="currentColor" />
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.2" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.8 13.2C2.3 10.6 4 9 6 9C8 9 9.7 10.6 10.2 13.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="11.3" cy="5.6" r="1.7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.4 9.3C12.1 9.5 13.4 10.8 13.9 13.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 4.5V8L10.3 9.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconArrowRightSm() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Mini illustrative step thumbnails ──────────────────────────────────────
function ThumbFrame({ children, bg }: { children: React.ReactNode; bg?: string }) {
  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-stone-200/70" style={{ background: bg ?? '#fff', aspectRatio: '4/3' }}>
      {children}
    </div>
  )
}
function DarkPlayThumb() {
  return (
    <ThumbFrame bg="#000">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/tmp0rp9_a94.mp4"
        autoPlay muted loop playsInline
      />
    </ThumbFrame>
  )
}
const FRAME_IMAGES = [
  'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-17_at_17.24.43.png',
  'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-17_at_17.25.01.png',
  'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-17_at_17.25.21.png',
  'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-17_at_17.25.44.png',
]
const PRODUCT_IMAGES = [
  'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/ece653e0ad414583921df3ce20a67c97.webp',
  'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/4261620a1e724007b977b2b85156221a.webp',
]
function GridFramesThumb() {
  return (
    <ThumbFrame>
      <div className="grid grid-cols-2 gap-1 p-1.5 h-full">
        {FRAME_IMAGES.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" className="w-full h-full rounded-[3px] object-cover" />
        ))}
      </div>
    </ThumbFrame>
  )
}
function PromptLinesThumb() {
  const { ref, inView } = useInViewport<HTMLDivElement>('120px')
  const lines = ['"Close-up shot of the product..."', '"Hand picks up the product..."', '"Add text overlay..."']
  // Cumulative delay so each line starts typing right as the previous one finishes.
  const CHAR_SEC = 0.045
  let cumulative = 0
  const delays = lines.map(t => { const d = cumulative; cumulative += t.length * CHAR_SEC + 0.3; return d })
  return (
    <ThumbFrame bg="#1c1917">
      <div ref={ref} className="flex flex-col gap-0 p-2.5 h-full justify-center">
        {lines.map((t, i) => (
          <div key={t} className="overflow-hidden whitespace-nowrap leading-[1.15]"
            style={{
              width: inView ? `${t.length}ch` : 0,
              transition: `width ${t.length * CHAR_SEC}s steps(${t.length}, end) ${delays[i]}s`,
            }}>
            <span className="text-[8px] leading-[1.15] text-stone-300 italic whitespace-nowrap">{t}</span>
          </div>
        ))}
        <motion.span
          className="inline-block w-[1.5px] h-[8px] bg-indigo-300 mt-0.5"
          animate={inView ? { opacity: [0, 0, 1, 1, 0, 0] } : { opacity: 0 }}
          transition={{ duration: 0.9, repeat: Infinity, delay: cumulative, ease: 'linear', times: [0, 0.01, 0.02, 0.5, 0.51, 1] }}
        />
      </div>
    </ThumbFrame>
  )
}
function GenerateFramesThumb() {
  return (
    <ThumbFrame>
      <div className="flex flex-col gap-1 p-2 h-full justify-center">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="text-rose-400"><IconSparkle size={8} /></span>
            <span className="text-[7px] font-medium text-ink/80">Generating frames...</span>
          </span>
          <span className="text-[7px] font-semibold text-muted/70">3/10</span>
        </div>
        <div className="h-1 rounded-full bg-stone-100 overflow-hidden">
          <motion.div className="h-full bg-rose-400" initial={{ width: '10%' }}
            whileInView={{ width: '55%' }} viewport={{ once: true, margin: '180px' }} transition={{ duration: 0.8, delay: 0.2 }} />
        </div>
        <div className="grid grid-cols-4 gap-1">
          {FRAME_IMAGES.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="w-full aspect-square rounded-[2px] object-cover" style={{ opacity: i < 2 ? 1 : 0.4 }} />
          ))}
        </div>
      </div>
    </ThumbFrame>
  )
}
function TimelineThumb() {
  const tracks = [
    { color: '#818cf8', width: '88%' },
    { color: '#5eead4', width: '65%' },
    { color: '#f472b6', width: '48%' },
  ]
  return (
    <ThumbFrame bg="#1c1917">
      <div className="relative h-full p-1 flex flex-col gap-1">
        {/* Playhead */}
        <div className="absolute top-1 bottom-1 w-px bg-white/40 z-10" style={{ left: '46%' }} />

        {/* Filmstrip row */}
        <div className="flex h-[36%] shrink-0 overflow-hidden rounded-[2px]">
          <span className="flex items-center justify-center w-4 h-full bg-white shrink-0">
            <svg width="6" height="6" viewBox="0 0 8 8" fill="none"><path d="M2 1.2L7 4L2 6.8V1.2Z" fill="#1c1917" /></svg>
          </span>
          {FRAME_IMAGES.slice(0, 2).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="flex-1 h-full object-cover block" />
          ))}
          <div className="flex-1 h-full bg-amber-100 flex items-center justify-center text-[4.5px] font-semibold text-stone-700 text-center px-0.5 leading-none">GLOW</div>
        </div>

        {/* Tracks */}
        {tracks.map((t, i) => (
          <div key={i} className="h-1.5 rounded-full shrink-0 w-full" style={{ background: `${t.color}33` }}>
            <div className="h-full rounded-full" style={{ width: t.width, background: t.color }} />
          </div>
        ))}
      </div>
    </ThumbFrame>
  )
}

// ── Horizontal numbered step card ──────────────────────────────────────────
interface FlowStep { visual: React.ReactNode; title: string; desc: string }
function StepCardH({ step, index, delay = 0 }: { step: FlowStep; index: number; delay?: number }) {
  return (
    <motion.div {...fadeUp(delay)} className="flex flex-col gap-1.5 rounded-xl border border-rose-100/80 bg-white p-2.5">
      <div className="flex items-center gap-1.5">
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-rose-100 text-rose-600 text-[9px] font-bold shrink-0">
          {String(index).padStart(2, '0')}
        </span>
        <p className="text-[11px] font-semibold text-ink leading-snug">{step.title}</p>
      </div>
      {step.visual}
      <p className="text-[9.5px] text-muted leading-snug">{step.desc}</p>
    </motion.div>
  )
}

// ── Section top bar (mini dark header, mirrors hero's overview bar) ───────
function SectionTopBar({ index, label }: { index: string; label: string }) {
  return (
    <div className="relative z-10 bg-[#0d0c14] px-6 md:px-10 lg:px-16 py-4 flex items-center justify-between overflow-hidden">
      <svg className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-full h-6 opacity-30 pointer-events-none" viewBox="0 0 1000 40" preserveAspectRatio="none" fill="none">
        <path d="M0 30 Q500 -10 1000 25" stroke="rgba(165,180,252,0.5)" strokeWidth="1" fill="none" />
        <circle cx="500" cy="8" r="2" fill="#a5b4fc" />
      </svg>
      <span className="relative text-[11px] font-semibold tracking-[0.2em] text-white/60 uppercase">{index} — {label}</span>
      <span className="relative inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-white/40 uppercase">
        Dresma <span className="w-6 h-px bg-white/25" /> 2025
      </span>
    </div>
  )
}

// ── SECTION 2: Problem ─────────────────────────────────────────────────────
function ProblemSection() {
  const traditionalSteps: FlowStep[] = [
    { visual: <DarkPlayThumb />, title: 'Select a reference video', desc: 'Find a video style you like.' },
    { visual: <GridFramesThumb />, title: 'Divide it into frames', desc: 'Manually break the video into key frames.' },
    { visual: <PromptLinesThumb />, title: 'Write prompt for each frame', desc: 'Create custom prompts according to your product.' },
    { visual: <GenerateFramesThumb />, title: 'Generate each frame manually', desc: 'Use multiple tools to create and refine frames.' },
    { visual: <TimelineThumb />, title: 'Stitch, add music, voiceovers etc.', desc: 'Combine frames, add transitions, music, voiceovers, text, and make final edits.' },
  ]
  const painPoints: { icon: React.ReactNode; title: string; desc: string; tint: 'rose' | 'violet' }[] = [
    { icon: <IconHourglass />, title: 'Days of turnaround', desc: 'for a single short-form video', tint: 'rose' },
    { icon: <IconCoins />, title: 'Expensive', desc: 'footage, talent, and editing resources', tint: 'violet' },
    { icon: <IconChart />, title: 'Inconsistent quality', desc: 'across a growing content backlog', tint: 'violet' },
    { icon: <IconWarning />, title: 'Manual QC bottlenecks', desc: 'before anything ships', tint: 'rose' },
    { icon: <IconUsers />, title: 'Hard to scale', desc: 'output without scaling headcount', tint: 'violet' },
  ]
  const tintMap = {
    rose: { bg: 'bg-rose-100', text: 'text-rose-500' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-500' },
  } as const

  return (
    <>
      <SectionTopBar index="02" label="The Problem" />
      <section className="relative bg-[#faf9f7] py-10 overflow-hidden z-10" style={{ borderRadius: '24px 24px 0 0', boxShadow: '0 -8px 40px rgba(0,0,0,0.08)' }}>
        <div className="mx-auto max-w-[1320px] px-6 md:px-8 lg:px-10">
          <motion.div {...fadeUp(0)}
            className="relative bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.07)] border border-stone-100 p-6 lg:p-8 overflow-hidden">

            {/* Heading row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-5 lg:gap-7 items-center mb-6">
              <motion.h2 {...fadeUp(0)} className="font-serif text-[1.5rem] md:text-[1.7rem] font-medium leading-[1.15] tracking-tight text-ink">
                Great videos were easy to find, but{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #818cf8 0%, #7c3aed 100%)' }}>hard to recreate.</span>
              </motion.h2>
              <div className="hidden lg:block w-px h-12 bg-stone-200 justify-self-center" />
              <motion.p {...fadeUp(0.08)} className="text-[12px] text-muted leading-relaxed">
                Inspiration is everywhere, but turning it into a customized product video shouldn&#39;t be this hard. What should be a quick, creative process often turns into days of manual work, high costs, and inconsistent results.
              </motion.p>
            </div>

            {/* Traditional process card */}
            <motion.div {...fadeUp(0.14)} className="rounded-2xl border border-rose-100 bg-rose-50/40 p-4 md:p-5 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <span className="inline-block rounded-full bg-rose-100 text-rose-700 text-[11px] font-semibold px-2.5 py-0.5 mb-1.5">The traditional process</span>
                  <p className="text-[11.5px] text-muted">From a reference video to a customized product video — a long, manual process.</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-500 shrink-0">
                  <IconClock /> Days per video <IconArrowRightSm />
                </span>
              </div>

              <div className="flex flex-col lg:flex-row items-stretch gap-2.5">
                {traditionalSteps.map((step, i) => (
                  <React.Fragment key={step.title}>
                    <div className="flex-1 min-w-0"><StepCardH step={step} index={i + 1} delay={0.05 * i} /></div>
                    {i < traditionalSteps.length - 1 && (
                      <span className="hidden lg:flex items-center justify-center text-rose-300 shrink-0"><IconArrowRightSm /></span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* Key pain points */}
            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-5 items-start">
              <motion.div {...fadeUp(0.2)}>
                <p className="text-[13px] font-semibold text-violet-600 mb-1.5">Key pain points</p>
                <p className="text-[11.5px] text-muted leading-relaxed">These bottlenecks make it hard to recreate reference videos at scale.</p>
              </motion.div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {painPoints.map(({ icon, title, desc, tint }, i) => {
                  const c = tintMap[tint]
                  return (
                    <motion.div key={title} {...fadeUp(0.24 + i * 0.05)} className="flex flex-col gap-1.5 rounded-xl bg-violet-50/60 border border-violet-100/60 p-3">
                      <span className={`flex items-center justify-center w-7 h-7 rounded-full ${c.bg} ${c.text}`}>{icon}</span>
                      <p className="text-[11.5px] font-semibold text-ink leading-snug">{title}</p>
                      <p className="text-[10px] text-muted leading-snug">{desc}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>

          </motion.div>
        </div>
      </section>
    </>
  )
}


// ── SECTION 3: Vision (dark) ───────────────────────────────────────────────
function VisionSection() {
  const { ref, inView } = useInViewport<HTMLElement>('300px')
  return (
    <section ref={ref} className="relative py-40 bg-[#0d0c14] overflow-hidden flex items-center justify-center min-h-[70vh] z-10">
      {inView && STARS.map((s, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white" style={{ width: s.w, height: s.w, left: `${s.left}%`, top: `${s.top}%`, opacity: s.opacity }}
          animate={{ opacity: [s.opacity, s.opacity * 3.5, s.opacity] }} transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }} />
      ))}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[700px] h-[350px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.16) 0%, transparent 65%)' }} />
      </div>
      <div className="relative z-10 mx-auto max-w-[900px] px-6 md:px-12 text-center">
        <motion.p {...fadeUp(0)} className="text-[10.5px] font-semibold tracking-[0.22em] text-violet-400 uppercase mb-8">03 — The Vision</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="font-serif text-[2.3rem] md:text-[3.2rem] font-medium leading-[1.15] tracking-tightest text-white">
          Instead of a person operating each tool, an <span className="italic text-violet-300">AI agent orchestrates the entire flow</span> — planning, generating, checking, and delivering with almost no human intervention.
        </motion.h2>
      </div>
    </section>
  )
}

// ── Target Users: icons ─────────────────────────────────────────────────────
function IconLeaf() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M3 13C3 7 7 3 13 3C13 9 9 13 3 13Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3 13C6 10 8 8 11 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconBarsUp() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M2 13.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="3" y="9" width="2.2" height="4.5" rx="0.5" fill="currentColor" />
      <rect x="6.9" y="6" width="2.2" height="7.5" rx="0.5" fill="currentColor" />
      <rect x="10.8" y="3" width="2.2" height="10.5" rx="0.5" fill="currentColor" />
    </svg>
  )
}
function IconBuilding() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="2" width="10" height="12.5" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 5H6.5M9.5 5H10.5M5.5 8H6.5M9.5 8H10.5M5.5 11H6.5M9.5 11H10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconRocket() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5C10.5 3 11.5 6 11 9.5L8 12.5L5 9.5C4.5 6 5.5 3 8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <circle cx="8" cy="6.5" r="1.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M5 9.5L3 11.5M11 9.5L13 11.5M6.5 12.5L6 14.5M9.5 12.5L10 14.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}
function IconLayers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L14.5 5L8 8.5L1.5 5L8 1.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M1.5 8.5L8 12L14.5 8.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 11.5L8 15L14.5 11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── Target Users: card visuals + layout ─────────────────────────────────────
// Note: brand names are rendered as plain styled text (no third-party logo
// artwork is embedded), and the product photos are stylised placeholder
// illustrations since no real asset URLs were supplied for this section.
function TierVisual({ tint, video, icon }: { tint: 'green' | 'orange' | 'violet'; video?: string; icon: React.ReactNode }) {
  const bg = { green: 'bg-emerald-50', orange: 'bg-orange-50', violet: 'bg-violet-50' }[tint]
  if (video) {
    return (
      <div className="w-full h-full min-h-[130px] rounded-xl overflow-hidden bg-black">
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video className="w-full h-full object-cover" src={video} autoPlay muted loop playsInline />
      </div>
    )
  }
  return (
    <div className={`w-full h-full min-h-[130px] rounded-xl ${bg} flex items-center justify-center`}>
      {icon}
    </div>
  )
}

interface UserTier {
  tag: string
  tint: 'green' | 'orange' | 'violet'
  tagIcon: React.ReactNode
  brands: React.ReactNode
  title: string
  desc: string
  quote: string
  visualIcon: React.ReactNode
  visualVideo?: string
}

function TierCard({ tier, delay = 0 }: { tier: UserTier; delay?: number }) {
  const tintMap = {
    green: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-100/70', cardBg: 'bg-emerald-50/40' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-100/70', cardBg: 'bg-orange-50/40' },
    violet: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-100/70', cardBg: 'bg-violet-50/40' },
  } as const
  const c = tintMap[tier.tint]
  return (
    <motion.div {...fadeUp(delay)} className={`rounded-2xl border ${c.border} ${c.cardBg} p-5 flex flex-col gap-3.5`}>
      <span className={`inline-flex self-start items-center gap-1.5 rounded-full ${c.bg} ${c.text} text-[10.5px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1`}>
        {tier.tagIcon} {tier.tag}
      </span>
      <div className="flex items-center gap-3 flex-wrap min-h-[22px]">{tier.brands}</div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px] gap-4 items-start flex-1">
        <div className="flex flex-col gap-2.5">
          <p className="text-[14px] font-semibold text-ink leading-snug">{tier.title}</p>
          <p className="text-[11.5px] text-muted leading-relaxed">{tier.desc}</p>
          <div className="mt-1 rounded-lg border border-stone-200/70 bg-white/70 p-2.5">
            <p className="text-[11px] italic text-ink/80 leading-snug">&ldquo;{tier.quote}&rdquo;</p>
          </div>
        </div>
        <div className="hidden sm:block h-full">
          <TierVisual tint={tier.tint} video={tier.visualVideo} icon={tier.visualIcon} />
        </div>
      </div>
    </motion.div>
  )
}

function UserBenefit({ icon, tint, title, desc }: { icon: React.ReactNode; tint: 'green' | 'orange' | 'violet'; title: string; desc: string }) {
  const bg = { green: 'bg-emerald-100 text-emerald-600', orange: 'bg-orange-100 text-orange-600', violet: 'bg-violet-100 text-violet-600' }[tint]
  return (
    <div className="flex items-start gap-3 p-5">
      <span className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${bg}`}>{icon}</span>
      <div>
        <p className="text-[13px] font-semibold text-ink leading-snug mb-1">{title}</p>
        <p className="text-[11.5px] text-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

// ── SECTION 4: Target Users ──────────────────────────────────────────────────
function TargetUsersSection() {
  const tiers: UserTier[] = [
    {
      tag: 'Small Business', tint: 'green', tagIcon: <IconLeaf />,
      brands: (
        // eslint-disable-next-line @next/next/no-img-element
        <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/android-chrome-192x192.png" alt="DrKitchen" className="h-9 w-9 rounded-md object-contain" />
      ),
      title: 'A homegrown spice brand',
      desc: 'A small, family-run business used the tool to create product videos for their new range of spices, ready for their website and online listings.',
      quote: 'We created professional product videos without a production team.',
      visualVideo: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/DrKitchen_drkitchen.suradhuni_Instagram_photos_and_videos.mp4',
      visualIcon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <rect x="14" y="18" width="36" height="40" rx="6" fill="#0f5132" opacity="0.15" />
          <rect x="18" y="22" width="28" height="32" rx="4" fill="#0f5132" opacity="0.35" />
          <circle cx="32" cy="38" r="7" fill="#f59e0b" />
        </svg>
      ),
    },
    {
      tag: 'Medium Businesses', tint: 'orange', tagIcon: <IconBarsUp />,
      brands: (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-24_at_13.33.12.png" alt="CORT" className="h-8 w-auto object-contain" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-24_at_13.28.31.png" alt="Zalando" className="h-8 w-auto object-contain" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-24_at_13.32.45.png" alt="Altitude Sports" className="h-8 w-auto object-contain" />
        </>
      ),
      title: 'Growing D2C brands across categories',
      desc: 'Brands like Cort Furniture, Zalando and Altitude Sports use the tool across multiple SKUs to create consistent, on-brand videos for their websites, marketplaces and social channels.',
      quote: 'We can now create high-quality product videos for every SKU in minutes.',
      visualVideo: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/PMO-PMO0094_ecommerce_01.mp4',
      visualIcon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <path d="M18 48V30L32 20L46 30V48H18Z" fill="#d97706" opacity="0.2" />
          <rect x="24" y="34" width="16" height="14" rx="2" fill="#d97706" opacity="0.4" />
        </svg>
      ),
    },
    {
      tag: 'Large Brands & Marketplaces', tint: 'violet', tagIcon: <IconBuilding />,
      brands: (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-24_at_13.33.33.png" alt="Flipkart" className="h-8 w-auto object-contain" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Screenshot_2026-09-24_at_13.33.54.png" alt="Myntra" className="h-8 w-auto object-contain" />
        </>
      ),
      title: 'Creating high-quality content at scale',
      desc: 'Large brands and marketplaces like Flipkart and Myntra use the tool to generate high-quality product videos at scale, maintaining consistency across a wide catalog.',
      quote: 'Same workflow, 100s of videos. It scales with our catalog.',
      visualVideo: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/HY8vTwpi4MDts0MlTkOD-_b4e304128ea74effa3db0562864a5b05.mp4',
      visualIcon: (
        <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
          <rect x="20" y="10" width="24" height="44" rx="5" fill="#7c3aed" opacity="0.18" />
          <rect x="24" y="14" width="16" height="32" rx="2" fill="#7c3aed" opacity="0.4" />
          <circle cx="32" cy="49" r="2" fill="#7c3aed" />
        </svg>
      ),
    },
  ]

  const benefits = [
    { icon: <IconRocket />, tint: 'green' as const, title: 'Launch faster', desc: 'For businesses creating their first product videos.' },
    { icon: <IconBarsUp />, tint: 'orange' as const, title: 'Look marketplace-ready', desc: 'Create polished content for marketplaces, websites and social channels.' },
    { icon: <IconLayers />, tint: 'violet' as const, title: 'Scale without a production team', desc: 'As the catalog grows, the same workflow can support larger content volumes.' },
  ]

  return (
    <>
      <SectionTopBar index="04" label="Target Users" />
      <section className="relative bg-[#faf9f7] py-16 overflow-hidden z-10">
        <div className="mx-auto max-w-[1360px] px-6 md:px-10 lg:px-14">
          <motion.div {...fadeUp(0)} className="relative bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.07)] border border-stone-100 p-6 lg:p-10 overflow-hidden">

            {/* Heading */}
            <motion.h2 {...fadeUp(0.06)} className="font-serif text-[1.9rem] md:text-[2.3rem] font-medium leading-[1.15] tracking-tight text-ink mb-3 max-w-[640px]">
              Built for businesses <span className="italic" style={{ color: '#0f5132' }}>at every stage.</span>
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-[13px] text-muted leading-relaxed max-w-[640px] mb-10">
              From a family-run brand launching its first product to growing D2C brands and large marketplaces — the same simple DIY journey helps businesses create marketplace-ready videos, faster.
            </motion.p>

            {/* Tier cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
              {tiers.map((tier, i) => (
                <TierCard key={tier.tag} tier={tier} delay={0.1 + i * 0.06} />
              ))}
            </div>

          </motion.div>
        </div>
      </section>
    </>
  )
}

// ── Solution section decorative bits ───────────────────────────────────────
function SolutionPlanet({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <div className="absolute rounded-full pointer-events-none" style={{
      width: size, height: size,
      background: 'radial-gradient(circle at 32% 30%, rgba(199,210,254,0.9) 0%, rgba(99,102,241,0.65) 45%, rgba(30,27,75,0.35) 70%, transparent 82%)',
      boxShadow: '0 0 40px 8px rgba(99,102,241,0.15)',
      ...style,
    }} />
  )
}

// ── Solution step visuals ───────────────────────────────────────────────────
function SolutionVideoCard({ aspectRatio = '16/10' }: { aspectRatio?: string } = {}) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-stone-200/70" style={{ aspectRatio }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="absolute inset-0 w-full h-full object-cover"
        src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/tmp0rp9_a94.mp4" autoPlay muted loop playsInline />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <svg width="10" height="10" viewBox="0 0 8 8" fill="none"><path d="M2 1.2L7 4L2 6.8V1.2Z" fill="white" /></svg>
        </span>
      </div>
      <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1.5">
        <div className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
          <div className="h-full w-1/4 rounded-full bg-white/90" />
        </div>
        <span className="text-[8px] font-medium text-white/85">0:00 / 0:15</span>
      </div>
    </div>
  )
}
function SolutionUploadCard() {
  return (
    <div className="flex gap-1.5 w-full" style={{ aspectRatio: '16/10' }}>
      {PRODUCT_IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={src} alt="" className="basis-1/2 min-w-0 h-full rounded-lg object-cover border border-stone-200/70" />
      ))}
    </div>
  )
}
function SolutionAIHub() {
  return (
    <div className="relative w-20 h-20 mx-auto">
      <motion.div className="absolute -inset-3 rounded-full border border-dashed border-violet-200"
        animate={{ rotate: -360 }} transition={{ duration: 24, repeat: Infinity, ease: 'linear' }} />
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ background: 'conic-gradient(from 0deg, #c4b5fd, #fbcfe8, #fef9c3, #a5b4fc, #c4b5fd)' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-[3px] rounded-full bg-[#f7f6ff] flex items-center justify-center">
        <span className="font-serif text-lg font-semibold text-ink">AI</span>
      </div>
      <motion.span className="absolute -top-1 -right-1 text-violet-400"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 3, repeat: Infinity }}>
        <IconSparkle size={10} />
      </motion.span>
    </div>
  )
}
function SolutionCustomVideoCard({ aspectRatio = '16/10' }: { aspectRatio?: string } = {}) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-stone-200/70" style={{ aspectRatio }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="absolute inset-0 w-full h-full object-cover"
        src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Wh5whwzJ6La5ilj0JSIfz_3c76a172bd69494883f24149ce1034a6.mp4" autoPlay muted loop playsInline />
      <div className="absolute inset-0 flex flex-col justify-between p-2">
        <span className="self-end font-serif text-[11.5px] italic text-white text-right leading-tight" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
          Beauty<br />in every detail.
        </span>
        <span className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm shrink-0">
          <svg width="10" height="10" viewBox="0 0 8 8" fill="none"><path d="M2 1.2L7 4L2 6.8V1.2Z" fill="white" /></svg>
        </span>
      </div>
      <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1.5">
        <div className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
          <div className="h-full w-1/4 rounded-full bg-white/90" />
        </div>
        <span className="text-[8px] font-medium text-white/85">0:00 / 0:15</span>
        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className="text-white/85 shrink-0">
          <path d="M1 4V1H4M8 1H11V4M11 8V11H8M4 11H1V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}

interface SolutionStep { n: string; color: string; bg: string; title: string; desc: string; visual: React.ReactNode }
function SolutionArrow() {
  return (
    <span className="hidden lg:flex items-center justify-center text-violet-300 shrink-0 self-center">
      <svg width="20" height="10" viewBox="0 0 20 10" fill="none"><path d="M0 5Q10 -3 18 5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2.5 2.5" fill="none" /><path d="M14 2L18 5L14.5 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </span>
  )
}

// ── SECTION 4: Solution ─────────────────────────────────────────────────────
function SolutionSection() {
  const cardSteps: SolutionStep[] = [
    { n: '01', color: 'text-violet-600', bg: 'bg-violet-100', title: 'Upload reference', desc: 'Add any video that captures the style you like.', visual: <SolutionVideoCard /> },
    { n: '02', color: 'text-sky-600', bg: 'bg-sky-100', title: 'Upload products', desc: 'Add product images and key details.', visual: <SolutionUploadCard /> },
  ]
  const chips = [
    ['🎬', 'Style'], ['👥', 'Scenes'], ['📦', 'Product'], ['✦', 'Transitions'], ['🎵', 'Tone'],
  ] as const

  return (
    <>
      <SectionTopBar index="05" label="The Solution" />
      <section className="relative bg-[#05060f] py-16 overflow-hidden z-10">
      {/* Decorative galaxy corners */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(76,29,149,0.25) 0%, transparent 55%)' }} />
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{
            width: (i % 3) + 1, height: (i % 3) + 1,
            left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`,
            opacity: 0.15 + ((i % 5) * 0.12),
          }} />
        ))}
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1400 700" fill="none" preserveAspectRatio="none">
          <path d="M1400 40 Q950 -20 700 260 Q450 540 0 700" stroke="rgba(165,180,252,0.5)" strokeWidth="1" fill="none" />
        </svg>
        <SolutionPlanet size={120} style={{ right: -30, top: -20 }} />
        <SolutionPlanet size={220} style={{ left: -60, bottom: -140 }} />
        <span className="absolute rounded-full bg-violet-300" style={{ width: 6, height: 6, left: '17%', bottom: '24%' }} />

        <motion.span className="absolute text-violet-300" style={{ right: '15%', top: '6%' }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 3.5, repeat: Infinity }}>
          <IconSparkle size={14} />
        </motion.span>
        <motion.span className="absolute text-violet-300" style={{ right: '7%', bottom: '10%' }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 4, repeat: Infinity, delay: 1 }}>
          <IconSparkle size={12} />
        </motion.span>
      </div>

      <div className="relative mx-auto max-w-[1360px] px-6 md:px-10 lg:px-14">

        <motion.div {...fadeUp(0.04)} className="relative bg-white/3 rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.35)] border border-white/10 p-6 lg:p-8 overflow-hidden">

        {/* Heading row */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] gap-5 lg:gap-8 items-start mb-6">
          <div>
            <motion.h2 {...fadeUp(0.06)} className="font-serif text-[2rem] md:text-[2.4rem] font-medium leading-[1.15] tracking-tight text-white">
              One step.<br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #a5b4fc 0%, #a78bfa 100%)' }}>From inspiration to your video.</span>
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-[13px] text-white/55 mt-3">
              Upload a reference, add your product, and let AI do the rest.
            </motion.p>
          </div>
          <div className="hidden lg:block w-px h-14 bg-white/15 justify-self-center self-center" />
          <motion.p {...fadeUp(0.12)} className="text-[13.5px] text-white/55 leading-relaxed self-center">
            Dresma understands the style, adapts it to your product, and generates a high-quality, ready-to-publish video — in one step.
          </motion.p>
        </div>

        {/* Steps row */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4 lg:gap-3">
          {cardSteps.map((step, i) => (
            <React.Fragment key={step.n}>
              <motion.div {...fadeUp(0.1 + i * 0.06)} className="flex-1 min-w-0 rounded-2xl border border-stone-200/70 bg-white p-3.5 flex flex-col gap-2">
                <div className="flex items-center gap-2.5">
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 ${step.bg} ${step.color}`}>{step.n}</span>
                  <p className="text-[13px] font-semibold text-ink leading-snug">{step.title}</p>
                </div>
                <p className="text-[11.5px] text-muted leading-snug min-h-[22px]">{step.desc}</p>
                {step.visual}
              </motion.div>
              <SolutionArrow />
            </React.Fragment>
          ))}

          {/* Central AI hub */}
          <motion.div {...fadeUp(0.24)} className="flex-1 min-w-0 rounded-2xl border border-stone-200/70 bg-white p-3.5 flex flex-col items-center text-center gap-2">
            <div className="flex items-center gap-2.5 self-start">
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 bg-violet-100 text-violet-600">03</span>
              <p className="text-[13px] font-semibold text-ink leading-snug">AI analyses everything</p>
            </div>
            <p className="text-[11.5px] text-muted leading-snug min-h-[22px] self-start text-left">Understands style, scenes, transitions and adapts it to your product.</p>
            <div className="flex-1 flex items-center justify-center py-1">
              <SolutionAIHub />
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {chips.map(([icon, label]) => (
                <span key={label} className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50/70 px-2 py-1 text-[9.5px] font-medium text-ink">
                  <span>{icon}</span> {label}
                </span>
              ))}
            </div>
          </motion.div>

          <SolutionArrow />

          <motion.div {...fadeUp(0.32)} className="flex-1 min-w-0 rounded-2xl border border-stone-200/70 bg-white p-3.5 flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold shrink-0 bg-teal-100 text-teal-600">04</span>
              <p className="text-[13px] font-semibold text-ink leading-snug">Your custom video</p>
            </div>
            <p className="text-[11.5px] text-muted leading-snug min-h-[22px]">AI analysed the reference video and placed your uploaded product in the same setting.</p>
            <SolutionCustomVideoCard />
          </motion.div>
        </div>

        {/* CTA pill */}
        <motion.div {...fadeUp(0.5)} className="flex justify-center mt-8">
          <div className="flex items-center gap-4 rounded-full bg-[#0d0c14] text-white pl-6 pr-6 py-3">
            <span className="inline-flex items-center gap-2 text-[13.5px] font-semibold">
              Visit <span className="text-violet-300">app.dresma.com</span> <IconArrowUpRight />
            </span>
            <span className="w-px h-6 bg-white/15" />
            <span className="text-[12px] text-white/50">to see the complete DIY Journey</span>
          </div>
        </motion.div>

        </motion.div>
      </div>
    </section>
    </>
  )
}

// ── Behind-the-scenes tool chip ─────────────────────────────────────────────
function ToolLogoVision() {
  return (
    <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/images.png" alt="Google Vision" className="w-full h-full object-contain p-1" />
    </div>
  )
}
function ToolLogoCV() {
  return (
    <div className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="5.5" cy="5.5" r="3.2" stroke="#ef4444" strokeWidth="1.3" />
        <circle cx="10.5" cy="5.5" r="3.2" stroke="#22c55e" strokeWidth="1.3" />
        <circle cx="8" cy="10.5" r="3.2" stroke="#3b82f6" strokeWidth="1.3" />
      </svg>
    </div>
  )
}
function ToolLogoGemini() {
  return (
    <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/images__1_.png" alt="Gemini" className="w-full h-full object-contain p-1" />
    </div>
  )
}
function ToolLogoPython() {
  return (
    <div className="w-7 h-7 rounded-lg bg-yellow-50 flex items-center justify-center shrink-0">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5C5.5 1.5 5.6 2.6 5.6 2.6L5.6 3.7H8V4.2H4.4C4.4 4.2 2.5 4 2.5 6.6C2.5 9.2 4.2 9.1 4.2 9.1H5.2V7.9C5.2 7.9 5.1 6.2 6.9 6.2H9.3C9.3 6.2 11 6.2 11 4.6V3.1C11 3.1 11.3 1.5 8 1.5Z" fill="#3b82f6" />
        <path d="M8 14.5C10.5 14.5 10.4 13.4 10.4 13.4L10.4 12.3H7.9V11.8H11.6C11.6 11.8 13.5 12 13.5 9.4C13.5 6.8 11.8 6.9 11.8 6.9H10.8V8.1C10.8 8.1 10.9 9.8 9.1 9.8H6.7C6.7 9.8 5 9.8 5 11.4V12.9C5 12.9 4.7 14.5 8 14.5Z" fill="#eab308" />
      </svg>
    </div>
  )
}
function ToolChip({ logo, name, sub }: { logo: React.ReactNode; name: string; sub: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-stone-100 bg-stone-50/60 p-2.5">
      {logo}
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-ink leading-tight">{name}</p>
        <p className="text-[9.5px] text-muted/80 leading-tight">{sub}</p>
      </div>
    </div>
  )
}

function TechStackMarquee({ items }: { items: { logo: React.ReactNode; name: string; sub: string }[] }) {
  const [paused, setPaused] = useState(false)
  const doubled = [...items, ...items]
  return (
    <div
      className="overflow-hidden w-full"
      style={{
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex gap-2.5"
        style={{
          animation: 'marqueeRight 22s linear infinite',
          animationPlayState: paused ? 'paused' : 'running',
          width: 'max-content',
        }}
      >
        {doubled.map((t, i) => (
          <div key={`${t.name}-${i}`} className="w-56 shrink-0">
            <ToolChip {...t} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Behind-the-scenes: small helpers ────────────────────────────────────────
const TINT = {
  violet: { bg: 'bg-violet-50/60', border: 'border-violet-100', badgeBg: 'bg-violet-600', iconBg: 'bg-violet-100', iconText: 'text-violet-600', text: 'text-violet-700' },
  green: { bg: 'bg-emerald-50/60', border: 'border-emerald-100', badgeBg: 'bg-emerald-600', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600', text: 'text-emerald-700' },
  orange: { bg: 'bg-orange-50/60', border: 'border-orange-100', badgeBg: 'bg-orange-500', iconBg: 'bg-orange-100', iconText: 'text-orange-600', text: 'text-orange-700' },
} as const
type Tint = keyof typeof TINT

function PipelineSideCard({ tint, title, desc, children }: { tint: Tint; title: string; desc: string; children: React.ReactNode }) {
  const c = TINT[tint]
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-4 flex flex-col gap-2.5 flex-1`}>
      <p className="text-[13px] font-semibold text-ink leading-snug">{title}</p>
      <p className="text-[11px] text-muted leading-snug">{desc}</p>
      {children}
    </div>
  )
}

function PipelineVideoThumb({ src, duration }: { src: string; duration: string }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-stone-200/70" style={{ aspectRatio: '16/11' }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="absolute inset-0 w-full h-full object-cover" src={src} autoPlay muted loop playsInline />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <svg width="11" height="11" viewBox="0 0 8 8" fill="none"><path d="M2 1.2L7 4L2 6.8V1.2Z" fill="white" /></svg>
        </span>
      </div>
      <span className="absolute bottom-1.5 right-1.5 rounded bg-black/60 text-white text-[9px] font-medium px-1.5 py-0.5">{duration}</span>
    </div>
  )
}

function ApiFeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-stone-200/70 bg-white p-2 text-center">
      <span className="text-violet-500">{icon}</span>
      <span className="text-[9.5px] font-medium text-ink leading-tight">{label}</span>
    </div>
  )
}

interface ApiFeature { icon: React.ReactNode; label: string }
function ApiCard({ badge, tint, icon, title, desc, features, connector }: { badge: string; tint: Tint; icon: React.ReactNode; title: string; desc: string; features: ApiFeature[]; connector?: { icon: React.ReactNode; label: string } }) {
  const c = TINT[tint]
  return (
    <div className={`rounded-2xl border ${c.border} ${c.bg} p-3.5 flex flex-col gap-2`}>
      <div className="flex items-center gap-2.5">
        <span className={`inline-flex shrink-0 items-center rounded-full ${c.badgeBg} text-white text-[10px] font-semibold tracking-[0.06em] px-2.5 py-1`}>{badge}</span>
        <span className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${c.iconBg} ${c.iconText}`}>{icon}</span>
        <div className="min-w-0">
          <p className="text-[13.5px] font-semibold text-ink leading-snug">{title}</p>
          <p className="text-[11px] text-muted leading-snug">{desc}</p>
        </div>
        {connector && (
          <span className={`ml-auto shrink-0 hidden md:inline-flex items-center gap-1.5 rounded-full ${c.iconBg} ${c.text} text-[10.5px] font-semibold px-3 py-1.5`}>
            {connector.icon} {connector.label}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {features.map(f => <ApiFeatureChip key={f.label} icon={f.icon} label={f.label} />)}
      </div>
    </div>
  )
}

function ToolLogoVeo() {
  return (
    <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2.5" width="13" height="11" rx="2" stroke="#0284c7" strokeWidth="1.3" />
        <path d="M6.5 5.5L11 8L6.5 10.5V5.5Z" fill="#0284c7" />
      </svg>
    </div>
  )
}

// ── SECTION 6: Behind the Scenes ─────────────────────────────────────────────
function BehindScenesSection() {
  const api1Features: ApiFeature[] = [
    { label: 'Scene breakdown', icon: <IconLayers /> },
    { label: 'Duration per scene', icon: <IconClock /> },
    { label: 'Aspect ratio', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4.5 1.5V4.5H1.5M14.5 11.5V14.5H11.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /><rect x="4.5" y="4.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.3" /></svg> },
    { label: 'Key visual elements', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="5.5" cy="6" r="1.2" stroke="currentColor" strokeWidth="1.1" /><path d="M2 12L6 8L9 11L14 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { label: 'Scene-specific prompts', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M5.5 5H10.5M5.5 8H10.5M5.5 11H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg> },
  ]
  const api2Features: ApiFeature[] = [
    { label: 'Product context', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5L14 4.5V11.5L8 14.5L2 11.5V4.5L8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><path d="M2 4.5L8 7.5L14 4.5M8 7.5V14.5" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg> },
    { label: 'Environment & style', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 1.5C4.4 1.5 1.5 4.2 1.5 8C1.5 10.5 3.3 11.3 4.7 10.9C5.4 10.7 5.2 9.6 6.1 9.4C8.5 9 13.5 9.5 13.5 5.8C13.5 3 11 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /><circle cx="4.8" cy="5.8" r="0.8" fill="currentColor" /><circle cx="7.2" cy="3.9" r="0.8" fill="currentColor" /><circle cx="10.2" cy="4.9" r="0.8" fill="currentColor" /></svg> },
    { label: 'Product objective', icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" /><circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.2" /><circle cx="8" cy="8" r="0.7" fill="currentColor" /></svg> },
    { label: 'Customised prompts', icon: <IconSparkle size={13} /> },
  ]
  const techStack = [
    { logo: <ToolLogoVision />, name: 'Google Vision', sub: 'Video analysis & scene extraction' },
    { logo: <ToolLogoCV />, name: 'OpenCV', sub: 'Frame processing & scene detection' },
    { logo: <ToolLogoGemini />, name: 'Gemini 3.8 Flash', sub: 'Prompt generation' },
    { logo: <ToolLogoGemini />, name: 'Gemini Omni Flash 1.1', sub: 'Video generation' },
    { logo: <ToolLogoPython />, name: 'Python', sub: 'Core pipeline & orchestration' },
  ]

  return (
    <>
      <SectionTopBar index="06" label="Behind the Scenes" />
      <section className="relative bg-[#f7f6ff] py-16 overflow-hidden z-10">
      {/* Decorative galaxy corners */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1400 700" fill="none" preserveAspectRatio="none">
          <path d="M1400 40 Q950 -20 700 260 Q450 540 0 700" stroke="rgba(165,180,252,0.5)" strokeWidth="1" fill="none" />
        </svg>
        <SolutionPlanet size={120} style={{ right: -30, top: -20 }} />
        <SolutionPlanet size={220} style={{ left: -60, bottom: -140 }} />
      </div>

      <div className="relative mx-auto px-6 md:px-10 lg:px-14">

        <motion.div {...fadeUp(0.04)} className="relative bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.07)] border border-stone-100 p-6 lg:p-8 overflow-hidden">

        {/* Heading row */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <motion.h2 {...fadeUp(0.06)} className="font-serif text-[1.6rem] md:text-[1.9rem] font-medium leading-[1.2] tracking-tight text-ink">
            We didn&apos;t replicate the video.<br />
            <span className="italic" style={{ color: '#7c3aed' }}>We taught the system to understand and adapt it.</span>
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-[12px] text-muted leading-relaxed max-w-[300px] lg:text-right lg:pt-1 shrink-0">
            The goal was never to recreate a reference frame-for-frame. The system extracts the visual structure, then rebuilds it around the customer&apos;s product, environment, and objective.
          </motion.p>
        </div>

        {/* Pipeline grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_28px_1fr_28px_300px] gap-4 items-stretch mb-6">

          {/* Left column: inputs */}
          <div className="flex flex-col gap-3">
            <PipelineSideCard tint="violet" title="Reference Video" desc="Upload a video in the style you like (e.g. product ad)">
              <PipelineVideoThumb src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/tmp0rp9_a94.mp4" duration="0:28" />
            </PipelineSideCard>
            <PipelineSideCard tint="green" title="Product Images" desc="Upload product images for your brand">
              <div className="flex gap-1.5">
                {PRODUCT_IMAGES.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" className="w-9 h-9 rounded-md object-cover border border-stone-200/70" />
                ))}
                <div className="w-9 h-9 rounded-md border border-dashed border-stone-300 flex items-center justify-center text-muted text-sm shrink-0">+</div>
              </div>
            </PipelineSideCard>
          </div>

          {/* Connector arrows: reference video → API 01, product images → API 02 */}
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex-1 flex items-center justify-center text-violet-400"><IconArrowRightSm /></div>
            <div className="flex-1 flex items-center justify-center text-emerald-400"><IconArrowRightSm /></div>
          </div>

          {/* Middle column: the two API stages */}
          <div className="flex flex-col gap-2.5 justify-center">
            <ApiCard badge="API 01" tint="violet"
              icon={<svg width="17" height="17" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" strokeWidth="1.3" /><path d="M6.5 5.5L11 8L6.5 10.5V5.5Z" fill="currentColor" /></svg>}
              title="Understand the reference" desc="Analyses the reference video and extracts key details"
              features={api1Features}
              connector={{ icon: <IconLayers />, label: 'Structured visual blueprint' }} />
            <ApiCard badge="API 02" tint="green"
              icon={<svg width="17" height="17" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><circle cx="5.5" cy="6" r="1.2" stroke="currentColor" strokeWidth="1.1" /><path d="M2 12L6 8L9 11L14 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              title="Adapt and generate" desc="Creates product-specific prompts and generates videos"
              features={api2Features}
              connector={{ icon: <IconSparkle size={13} />, label: 'Video generation' }} />
          </div>

          {/* Connector arrows: API 01 / API 02 → generated product video */}
          <div className="hidden lg:flex flex-col gap-3">
            <div className="flex-1 flex items-center justify-center text-violet-400"><IconArrowRightSm /></div>
            <div className="flex-1 flex items-center justify-center text-emerald-400"><IconArrowRightSm /></div>
          </div>

          {/* Right column: output */}
          <div className="flex flex-col">
            <PipelineSideCard tint="orange" title="Generated Product Video" desc="New video with the same style, adapted for your product, brand environment and objective.">
              <PipelineVideoThumb src="https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Wh5whwzJ6La5ilj0JSIfz_3c76a172bd69494883f24149ce1034a6.mp4" duration="0:28" />
              <div className="flex gap-1">
                {FRAME_IMAGES.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={src} alt="" className={`flex-1 min-w-0 aspect-square rounded-md object-cover ${i === 0 ? 'ring-2 ring-violet-500' : 'border border-stone-200/70'}`} />
                ))}
              </div>
            </PipelineSideCard>
          </div>
        </div>

        {/* Footer: tech stack */}
        <div className="grid grid-cols-1 gap-3">
          <div className="rounded-2xl border border-stone-200/70 bg-white p-4">
            <p className="text-[12px] font-semibold text-ink mb-3">Tech Stack (Key Components)</p>
            <TechStackMarquee items={techStack} />
          </div>
        </div>

        </motion.div>
      </div>
    </section>
    </>
  )
}


// ── Results: small icons ─────────────────────────────────────────────────────
function IconScissors() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="4" cy="12" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 5.5L14 14M14 2L5.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}
function IconDocument() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="1.5" width="10" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 5H10.5M5.5 8H10.5M5.5 11H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}
function IconBolt() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M9 1.5L3.5 9H7.5L6.5 14.5L12.5 6.5H8.5L9 1.5Z" fill="currentColor" />
    </svg>
  )
}
function IconImageStack() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="5.5" cy="6" r="1.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M2 12L6 8L9 11L14 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconSparkleTint({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M10 0 C10.5 6.5 13.5 9.5 20 10 C13.5 10.5 10.5 13.5 10 20 C9.5 13.5 6.5 10.5 0 10 C6.5 9.5 9.5 6.5 10 0Z" fill="currentColor" />
    </svg>
  )
}

// ── Results: Before / After comparison panel ────────────────────────────────
function BeforeAfterPanel({ variant, subtitle, items }: { variant: 'before' | 'after'; subtitle: string; items: { icon: React.ReactNode; label: string }[] }) {
  const isBefore = variant === 'before'
  return (
    <div className={`flex-1 min-w-0 rounded-2xl border p-4 ${isBefore ? 'border-rose-100 bg-rose-50/50' : 'border-emerald-100 bg-emerald-50/50'}`}>
      <p className="font-serif text-[17px] font-medium text-ink mb-0.5">{isBefore ? 'Before' : 'After'}</p>
      <p className="text-[13px] text-muted mb-3">{subtitle}</p>
      <div className="flex flex-col gap-2.5">
        {items.map(it => (
          <div key={it.label} className="flex items-center gap-2.5">
            <span className={`shrink-0 ${isBefore ? 'text-rose-400' : 'text-emerald-600'}`}>{it.icon}</span>
            <span className="text-[14px] text-ink/80 leading-snug">{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Results: side insight card ──────────────────────────────────────────────
function ResultInsightCard({ icon, tint, title, desc }: { icon: React.ReactNode; tint: Tint; title: string; desc: string }) {
  const c = TINT[tint]
  return (
    <div className="rounded-2xl border border-stone-200/70 bg-white p-3 flex items-start gap-2.5">
      <span className={`flex items-center justify-center w-9 h-9 rounded-full shrink-0 ${c.iconBg} ${c.iconText}`}>{icon}</span>
      <div className="min-w-0">
        <p className="font-serif text-[15.5px] font-medium text-ink mb-0.5">{title}</p>
        <p className="text-[13px] text-muted leading-snug">{desc}</p>
      </div>
    </div>
  )
}

function ResultsSection() {
  const beforeItems = [
    { icon: <IconScissors />, label: 'Frame-by-frame editing' },
    { icon: <IconUsers />, label: 'Multiple tools & editors' },
    { icon: <IconClock />, label: 'Time-consuming' },
    { icon: <IconCoins />, label: 'High production cost' },
    { icon: <IconDocument />, label: 'Hard to scale for large catalogs' },
  ]
  const afterItems = [
    { icon: <IconBolt />, label: 'Analyse, adapt and generate' },
    { icon: <IconImageStack />, label: 'Product-aware customisation' },
    { icon: <IconSparkleTint size={13} />, label: '90% less manual effort' },
    { icon: <IconLayers />, label: 'Replaces multiple editing tools' },
    { icon: <IconBarsUp />, label: 'Easily scalable across catalogs' },
  ]

  return (
    <>
      <SectionTopBar index="07" label="Results" />
      <section className="relative bg-[#f7f6ff] py-10 overflow-hidden z-10">
        <div className="relative mx-auto px-6 md:px-10 lg:px-14">

          <motion.div {...fadeUp(0.04)} className="relative bg-white rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.07)] border border-stone-100 p-5 lg:p-6 overflow-hidden">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch mb-4">
              {/* Intro column */}
              <div className="lg:col-span-4 flex flex-col">
                <motion.h2 {...fadeUp(0.06)} className="font-serif text-[1.9rem] md:text-[2.2rem] font-medium leading-[1.15] tracking-tight text-ink mb-3">
                  From manual production to <span className="italic" style={{ color: '#7c3aed' }}>scalable creation.</span>
                </motion.h2>
                <motion.p {...fadeUp(0.1)} className="text-[14.5px] text-muted leading-relaxed mb-4">
                  The workflow reduced manual video production by 90%, while keeping a human-in-the-loop QC step for cases where regeneration or refinement was needed.
                </motion.p>
                <motion.div {...fadeUp(0.14)} className="flex-1 flex items-center gap-4">
                  <div>
                    <p className="font-serif text-[3.4rem] md:text-[3.8rem] font-medium text-emerald-600 leading-none tracking-tighter">90%</p>
                    <p className="text-[11px] text-emerald-700 mt-1">manual work reduced</p>
                  </div>
                  <span className="w-px self-stretch bg-stone-200 shrink-0" />
                  <div>
                    <p className="font-serif text-[2.2rem] font-medium text-violet-600 leading-none tracking-tighter">10%</p>
                    <p className="text-[11px] text-muted mt-1.5 max-w-[170px] leading-snug">accounts for human QC and occasional regeneration when a scene needs refinement.</p>
                  </div>
                </motion.div>
              </div>

              {/* Before / After */}
              <motion.div {...fadeUp(0.12)} className="lg:col-span-5 flex items-stretch gap-2.5">
                <BeforeAfterPanel variant="before" subtitle="Manual video production" items={beforeItems} />
                <span className="hidden md:flex items-center justify-center shrink-0 text-violet-400"><IconArrowRightSm /></span>
                <BeforeAfterPanel variant="after" subtitle="AI-powered workflow" items={afterItems} />
              </motion.div>

              {/* Insight cards */}
              <motion.div {...fadeUp(0.18)} className="lg:col-span-3 flex flex-col gap-2">
                <ResultInsightCard tint="violet" icon={<IconBarsUp />} title="Built to scale" desc="A single automated workflow can generate videos across large product catalogs without proportionally increasing production effort." />
                <ResultInsightCard tint="green" icon={<IconSparkleTint size={16} />} title="Story-driven, not replicated" desc="The system doesn't blindly copy the reference. It adapts the story, environment, product and visual style to the uploaded product." />
                <ResultInsightCard tint="violet" icon={<IconLayers />} title="Replaces repetitive production" desc="For brands working with fixed templates and storyboarded journeys, the workflow can reduce dependence on multiple expensive video-editing and production tools." />
              </motion.div>
            </div>

          </motion.div>
        </div>
      </section>
    </>
  )
}

// ── SECTION 6: Outcome (dark) ──────────────────────────────────────────────
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
        <motion.p {...fadeUp(0)} className="text-[10.5px] font-semibold tracking-[0.22em] text-violet-400 uppercase mb-8">08 — Outcome</motion.p>
        <motion.h2 {...fadeUp(0.1)} className="font-serif text-[2.6rem] md:text-[3.6rem] font-medium leading-[1.1] tracking-tightest text-white mb-10">
          What started as a scripted automation grew into a full AI production system — turning a single brief into publish-ready video with almost no manual work.
        </motion.h2>
        <motion.div {...fadeUp(0.3)} className="flex flex-wrap justify-center gap-12 mt-12">
          {[{ v: '70%', l: 'Time Saved' }, { v: '3x', l: 'Content Output' }, { v: '90%', l: 'Automation Rate' }].map(({ v, l }) => (
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

// ── "See the results" modal ─────────────────────────────────────────────────
function ModalVideoCard({ src, caption }: { src: string; caption?: string }) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-stone-200/70 bg-black" style={{ aspectRatio: '16/10' }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video className="absolute inset-0 w-full h-full object-contain" src={src} autoPlay muted loop playsInline />
      {caption && (
        <div className="absolute inset-0 flex items-center justify-end p-4">
          <span className="font-serif text-[16px] italic text-white text-right leading-tight" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.5)' }}>
            {caption}
          </span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 py-2 bg-linear-to-t from-black/70 to-transparent">
        <svg width="9" height="9" viewBox="0 0 8 8" fill="none" className="shrink-0"><path d="M2 1.2L7 4L2 6.8V1.2Z" fill="white" /></svg>
        <span className="text-[9px] font-medium text-white/90 shrink-0">0:00 / 0:15</span>
        <div className="flex-1 h-0.5 rounded-full bg-white/30 overflow-hidden">
          <div className="h-full w-1/4 rounded-full bg-white/90" />
        </div>
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="text-white/90 shrink-0"><path d="M4.5 5.5H2.5V8.5H4.5L7.5 11V3L4.5 5.5Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M9.5 4.5C10.3 5.3 10.3 8.7 9.5 9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
        <svg width="11" height="11" viewBox="0 0 14 14" fill="none" className="text-white/90 shrink-0"><path d="M1 5V2h3M10 2h3v3M13 9v3h-3M4 13H1v-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  )
}

function ModalFeatureItem({ icon, l1, l2 }: { icon: React.ReactNode; l1: string; l2: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex items-center justify-center w-9 h-9 rounded-full bg-violet-100 text-violet-600 shrink-0">{icon}</span>
      <p className="text-[11.5px] leading-tight text-ink">
        <span className="font-semibold">{l1}</span><br />{l2}
      </p>
    </div>
  )
}

interface ResultPair { ref: string; gen: string; genCaption?: string }
const RESULT_PAIRS: ResultPair[] = [
  {
    ref: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/tmp0rp9_a94.mp4',
    gen: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Wh5whwzJ6La5ilj0JSIfz_3c76a172bd69494883f24149ce1034a6.mp4',
    genCaption: 'Pure\nFlavour Naturally',
  },
  {
    ref: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/Buy_Sangria_Navy_Blue_Ethnic_Motifs_Embroidered_Thread_Work_Stra.mp4',
    gen: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/HY8vTwpi4MDts0MlTkOD-_b4e304128ea74effa3db0562864a5b05.mp4',
  },
  {
    ref: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/tmpjt2zkr43.mp4',
    gen: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/10b9e68d-9b7e-4d26-86a0-2b3fb52778d1_final_stitched_video.mp4',
  },
  {
    ref: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/tmpxs8r9c69.mp4',
    gen: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/ac009501-dd80-4c5e-a7f2-ccbeb0bd8db3_final_stitched_video.mp4',
  },
  {
    ref: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/tmpvzrcizwb__2_.mp4',
    gen: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/u8VmhEuyW7iZXb9m4o5x0_b65e6b6c93e74910b9d1afba016853f4.mp4',
  },
  {
    ref: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/7-eI8P4Gn-aQPnC9bVBt4_5edbe98f48b340eb8193b63232571164.mp4',
    gen: 'https://dresma-assets.s3.us-east-2.amazonaws.com/brandagent/M0yNdvBLni_BHBM5pXs5N_6944aeaf7f1a4805972a8dc6ec6d0f9b.mp4',
  },
]

function ResultsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Lock background scroll (and exempt the modal itself via data-lenis-prevent below)
  // while the modal is open, so scrolling only moves the popup, not the page behind it.
  React.useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prevOverflow }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
        >
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            data-lenis-prevent
            className="relative w-full max-w-[1000px] max-h-[92vh] overflow-y-auto rounded-[28px] bg-[#f7f6ff] p-6 md:p-12 shadow-2xl"
          >
            <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]">
              <SolutionPlanet size={160} style={{ left: -70, bottom: -110 }} />
              <motion.span className="absolute text-violet-400" style={{ left: '6%', top: '9%' }}
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 3.5, repeat: Infinity }}>
                <IconSparkle size={14} />
              </motion.span>
            </div>

            <button onClick={onClose} aria-label="Close" className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-muted transition-colors">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
            </button>

            <div className="relative flex justify-center mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 border border-violet-100 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.1em] text-violet-600 uppercase">
                <IconSparkle size={11} /> See the results yourself
              </span>
            </div>
            <h2 className="relative font-serif text-[1.7rem] md:text-[2.2rem] font-medium text-center leading-[1.15] tracking-tight text-ink mb-3">
              All these results were generated <span className="italic bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #818cf8 0%, #7c3aed 100%)' }}>in one step.</span>
            </h2>
            <p className="relative text-[13px] text-muted text-center max-w-[560px] mx-auto leading-relaxed mb-8">
              I uploaded a reference video and my product images, and the AI gave me a new video adapting to my products and the template I had selected.
            </p>

            <div className="relative flex flex-col gap-6 mb-8">
              {RESULT_PAIRS.map((pair, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center gap-4">
                  <div className="flex-1 min-w-0 w-full rounded-2xl border border-stone-200/70 bg-white p-4">
                    <p className="text-[13px] font-semibold text-ink mb-0.5">Reference Video</p>
                    <p className="text-[11px] text-muted mb-3">The style, pacing and template you provide</p>
                    <ModalVideoCard src={pair.ref} />
                  </div>

                  <span className="flex items-center justify-center w-11 h-11 rounded-full bg-violet-100 text-violet-600 shrink-0 rotate-90 md:rotate-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8H14M9 3L14 8L9 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>

                  <div className="flex-1 min-w-0 w-full rounded-2xl border border-stone-200/70 bg-white p-4">
                    <p className="text-[13px] font-semibold text-ink mb-0.5">Your Generated Video</p>
                    <p className="text-[11px] text-muted mb-3">Same template, your products</p>
                    <ModalVideoCard src={pair.gen} caption={pair.genCaption} />
                  </div>
                </div>
              ))}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Floating "See the results" CTA ──────────────────────────────────────────
function FloatingResultsCTA({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      whileHover={{ x: -4 }}
      className="fixed right-0 top-1/2 -translate-y-1/2 z-50 flex items-center gap-2 rounded-l-full bg-[#0d0c14] text-white pl-4 pr-3.5 py-3 shadow-[0_8px_30px_rgba(0,0,0,0.3)] border border-white/10 border-r-0"
    >
      <motion.span className="text-violet-300" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.4, repeat: Infinity }}>
        <IconSparkle size={13} />
      </motion.span>
      <span className="text-[11.5px] font-semibold tracking-wide whitespace-nowrap">See the results</span>
    </motion.button>
  )
}

// ── Main export ─────────────────────────────────────────────────────────────
export default function AIVideoCaseStudy() {
  const [resultsOpen, setResultsOpen] = useState(false)
  return (
    <div className="antialiased">
      <HeroSection />
      <ProblemSection />
      <VisionSection />
      <TargetUsersSection />
      <SolutionSection />
      <BehindScenesSection />
      <ResultsSection />
      <OutcomeSection />
      <FloatingResultsCTA onClick={() => setResultsOpen(true)} />
      <ResultsModal open={resultsOpen} onClose={() => setResultsOpen(false)} />
    </div>
  )
}
