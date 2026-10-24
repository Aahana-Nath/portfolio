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

// ── Small icons ───────────────────────────────────────────────────────────
function IconLowFi() {
  return (
    <svg width="15" height="15" viewBox="0 0 18 18" fill="none">
      <rect x="2" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <rect x="10" y="2" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <rect x="2" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
      <rect x="10" y="10" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}
function IconHighFi() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
      <rect x="3.5" y="1.5" width="9" height="13" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6.8 12.3h2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}
function IconChevronCircle({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: dir === 'right' ? 'rotate(180deg)' : undefined }}>
      <path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
// ── Phone chrome with a dynamic-island notch ─────────────────────────────
function MiniPhone({ children, width = 130, notch = false }: { children: React.ReactNode; width?: number; notch?: boolean }) {
  return (
    <div className="relative overflow-hidden" style={{ width, borderRadius: width * 0.13, border: `${Math.max(3, width * 0.028)}px solid #1c1917`, background: '#1c1917' }}>
      <div className="relative overflow-hidden bg-white" style={{ borderRadius: width * 0.1, aspectRatio: '9 / 20' }}>
        {notch && <span className="absolute left-1/2 -translate-x-1/2 top-1.5 h-2.5 rounded-full bg-[#1c1917] z-20" style={{ width: width * 0.28 }} />}
        {children}
      </div>
    </div>
  )
}

// ── A real product screenshot shown inside the phone chrome ─────────────
function ImagePhone({ src, width = 165 }: { src: string; width?: number }) {
  return (
    <MiniPhone width={width}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="w-full h-full object-cover object-top" />
    </MiniPhone>
  )
}

// ── Carousel slot transforms — items recede to the sides or wait off-screen ──
const CENTER_SLOT = { x: 0, y: 0, scale: 1.22, rotate: 0, zIndex: 30, opacity: 1 }
const LEFT_SLOT = { x: -122, y: 14, scale: 0.78, rotate: -8, zIndex: 10, opacity: 0.85 }
const RIGHT_SLOT = { x: 122, y: 14, scale: 0.78, rotate: 8, zIndex: 10, opacity: 0.85 }
const FAR_LEFT_SLOT = { x: -225, y: 19, scale: 0.55, rotate: -10, zIndex: 0, opacity: 0 }
const FAR_RIGHT_SLOT = { x: 225, y: 19, scale: 0.55, rotate: 10, zIndex: 0, opacity: 0 }

// shortest signed distance from `rotation` to index `i` around a ring of `count` items
function ringOffset(i: number, rotation: number, count: number) {
  let diff = (i - rotation) % count
  if (diff > count / 2) diff -= count
  if (diff < -count / 2) diff += count
  return diff
}
function slotForOffset(offset: number) {
  if (offset === 0) return CENTER_SLOT
  if (offset === -1) return LEFT_SLOT
  if (offset === 1) return RIGHT_SLOT
  return offset < 0 ? FAR_LEFT_SLOT : FAR_RIGHT_SLOT
}

// Low-fidelity shows the early, mostly-grayscale screens; high-fidelity
// cycles through the finished, full-colour product screenshots.
type Fidelity = 'low' | 'high'
const LOW_FI_SCREENS = [
  { id: 'chat', src: '/screens/chat.png' },
  { id: 'categories', src: '/screens/categories.png' },
  { id: 'profile-detail', src: '/screens/profile-detail.png' },
  { id: 'book-appointment', src: '/screens/book-appointment.png' },
] as const
const HIGH_FI_SCREENS = [
  { id: 'onboarding', src: '/screens/onboarding.png' },
  { id: 'splash', src: '/screens/splash.png' },
  { id: 'home-featured', src: '/screens/home-featured.png' },
  { id: 'home-tiles', src: '/screens/home-tiles.png' },
  { id: 'video-call', src: '/screens/video-call.png' },
] as const

function screenCount(fidelity: Fidelity) {
  return fidelity === 'high' ? HIGH_FI_SCREENS.length : LOW_FI_SCREENS.length
}

// ── The phone deck inside the tinted card — rotates circularly on prev/next ──
function PhoneDeck({ fidelity, rotation, onPrev, onNext }: { fidelity: Fidelity; rotation: number; onPrev: () => void; onNext: () => void }) {
  const screens = fidelity === 'high' ? HIGH_FI_SCREENS : LOW_FI_SCREENS
  const count = screens.length
  return (
    <div className="relative rounded-[2.25rem] overflow-hidden border border-white/10" style={{ background: 'linear-gradient(135deg,#241a42 0%,#160f2b 60%)' }}>
      <div aria-hidden className="pointer-events-none absolute -left-16 top-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.35) 0%, transparent 70%)' }} />
      <div className="relative z-10 flex items-center justify-center px-10 py-6 md:px-16 md:py-8" style={{ minHeight: 480 }}>
        {screens.map((screen, i) => {
          const slot = slotForOffset(ringOffset(i, rotation, count))
          return (
            <motion.div
              key={screen.id}
              className="absolute inset-0 m-auto h-fit w-fit"
              animate={{ x: slot.x, y: slot.y, scale: slot.scale, rotate: slot.rotate, opacity: slot.opacity, zIndex: slot.zIndex }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              <ImagePhone src={screen.src} />
            </motion.div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous screen"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full border border-white/15 bg-black/20 backdrop-blur flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
      ><IconChevronCircle dir="left" /></button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next screen"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full border border-white/15 bg-black/20 backdrop-blur flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
      ><IconChevronCircle dir="right" /></button>
    </div>
  )
}

export default function DesigningExperienceSection() {
  const [fidelity, setFidelity] = useState<Fidelity>('high')
  const [rotation, setRotation] = useState(0)

  return (
    <section className="relative pt-10 pb-16 md:pt-14 md:pb-20 overflow-hidden" style={{ background: 'linear-gradient(160deg, #0a0916 0%, #15112b 45%, #1d1340 100%)' }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: 'radial-gradient(1.5px 1.5px at 10% 20%, rgba(255,255,255,0.35) 0%, transparent 60%), radial-gradient(1.5px 1.5px at 85% 15%, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(1px 1px at 70% 70%, rgba(255,255,255,0.25) 0%, transparent 60%), radial-gradient(1.5px 1.5px at 25% 85%, rgba(255,255,255,0.2) 0%, transparent 60%), radial-gradient(1px 1px at 50% 45%, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
      <div aria-hidden className="pointer-events-none absolute top-0 right-0 w-[520px] h-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.24) 0%, transparent 72%)' }} />
      <div aria-hidden className="pointer-events-none absolute bottom-0 -left-20 w-[480px] h-[480px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 72%)' }} />

      <div className="relative z-10 mx-auto max-w-[1520px] px-6 md:px-8 lg:px-10">
        <div className="flex gap-8 lg:gap-14">
          <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-start">
            {/* Left — copy */}
            <div>
              <motion.p {...fadeUp(0)} className="text-[13px] font-semibold tracking-[0.18em] text-violet-400 uppercase mb-4">
                07 — Designing the Experience
              </motion.p>
              <motion.h2 {...fadeUp(0.06)} className="font-serif text-[3rem] md:text-[3.6rem] font-medium leading-[1.06] tracking-tightest text-white mb-5">
                From user needs to <span className="italic" style={{ color: '#a78bfa' }}>meaningful</span> interactions.
              </motion.h2>
              <motion.p {...fadeUp(0.12)} className="font-sans text-[18px] text-white/55 leading-relaxed max-w-[540px]">
                Every screen was designed to reduce friction across the therapy journey. This was my first hands-on experience designing an end-to-end product interface. I started with low-fidelity wireframes to map the structure and user flows, then, with guidance from YouTube tutorials and the incredible mentors in my IIT Roorkee programme, brought my vision to life through high-fidelity screens in Figma.
              </motion.p>
            </div>

            {/* Right — fidelity toggle + phone deck */}
            <div>
              <motion.div {...fadeUp(0.08)} className="flex items-center justify-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => { setFidelity('low'); setRotation(0) }}
                  className={`flex items-center gap-3 rounded-full pl-3 pr-5 py-2.5 transition-colors ${fidelity === 'low' ? 'bg-violet-600 text-white shadow-[0_10px_24px_rgba(124,58,237,0.35)]' : 'bg-white/5 border border-white/10 text-white'}`}
                >
                  <span className={`flex items-center justify-center w-9 h-9 rounded-full ${fidelity === 'low' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}><IconLowFi /></span>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[15px] font-semibold">Low-fidelity</span>
                    <span className={`text-[11.5px] ${fidelity === 'low' ? 'text-white/75' : 'text-white/45'}`}>Early structure &amp; flows</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => { setFidelity('high'); setRotation(0) }}
                  className={`flex items-center gap-3 rounded-full pl-3 pr-5 py-2.5 transition-colors ${fidelity === 'high' ? 'bg-violet-600 text-white shadow-[0_10px_24px_rgba(124,58,237,0.35)]' : 'bg-white/5 border border-white/10 text-white'}`}
                >
                  <span className={`flex items-center justify-center w-9 h-9 rounded-full ${fidelity === 'high' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}><IconHighFi /></span>
                  <span className="flex flex-col items-start leading-tight">
                    <span className="text-[15px] font-semibold">High-fidelity</span>
                    <span className={`text-[11.5px] ${fidelity === 'high' ? 'text-white/75' : 'text-white/45'}`}>Final visual design</span>
                  </span>
                </button>
              </motion.div>

              <motion.div {...fadeUp(0.14)}>
                <PhoneDeck
                  fidelity={fidelity}
                  rotation={rotation}
                  onPrev={() => setRotation(r => (r + screenCount(fidelity) - 1) % screenCount(fidelity))}
                  onNext={() => setRotation(r => (r + 1) % screenCount(fidelity))}
                />
              </motion.div>

              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="w-6 h-px bg-white/15" />
                <span className="text-[14px] tracking-wide text-white/50"><span className="font-semibold text-white">{String((rotation % screenCount(fidelity)) + 1).padStart(2, '0')}</span> / 0{screenCount(fidelity)}</span>
                <span className="w-6 h-px bg-white/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
