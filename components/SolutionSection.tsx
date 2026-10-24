'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'

type Moment = { number: string; title: string; headline: string; details: string[] }

const MOMENTS: Moment[] = [
  { number: '01', title: 'FIND', headline: 'Find someone who fits.', details: ['Therapist matching', 'Profiles', 'Assessment'] },
  { number: '02', title: 'CONNECT', headline: 'Start a session with confidence.', details: ['Booking + chat', 'Video sessions', 'Secure interaction'] },
  { number: '03', title: 'GROW', headline: 'Continue your journey.', details: ['Progress tracking', 'Feedback', 'Support'] },
]

function fadeUp(delay = 0, duration = 0.42) {
  return {
    initial: { opacity: 0, y: 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '140px' } as const,
    transition: { duration, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  }
}

// Scroll checkpoints (0–1) where each beat of the story is fully in focus.
// Adjust these to retime the choreography — gaps between them control pacing.
const BEATS = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9] as const

// How much scroll distance the pinned story plays out over, in viewport heights.
// Smaller = faster scroll through the story, larger = slower/longer.
const SCROLL_LENGTH_VH = 420

// Only play the pinned cinematic version on desktop, and only when the
// visitor hasn't asked for reduced motion.
function useCinematicMode() {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setEnabled(desktop.matches && !reduced.matches)
    update()
    desktop.addEventListener('change', update)
    reduced.addEventListener('change', update)
    return () => {
      desktop.removeEventListener('change', update)
      reduced.removeEventListener('change', update)
    }
  }, [])
  return enabled
}

// Give each beat its own scroll window; neighboring beats only overlap briefly at handoffs.
function useBeat(progress: MotionValue<number>, index: number) {
  const isFirst = index === 0
  const isLast = index === BEATS.length - 1
  const start = isFirst ? BEATS[0] : (BEATS[index - 1] + BEATS[index]) / 2
  const end = isLast ? BEATS[BEATS.length - 1] : (BEATS[index] + BEATS[index + 1]) / 2
  const fade = Math.min(0.018, (end - start) / 4)
  const input = [start, start + fade, end - fade, end]
  const opacityOut = isFirst ? [1, 1, 0, 0] : isLast ? [0, 1, 1, 1] : [0, 1, 1, 0]
  const yOut = isFirst ? [0, 0, 0, -10] : isLast ? [12, 0, 0, 0] : [12, 0, 0, -10]
  const opacity = useTransform(progress, input, opacityOut)
  const y = useTransform(progress, input, yOut)
  return { opacity, y }
}

function Beat({ progress, index, children }: { progress: MotionValue<number>; index: number; children: React.ReactNode }) {
  const { opacity, y } = useBeat(progress, index)
  const visibility = useTransform(opacity, value => value <= 0.01 ? 'hidden' : 'visible')
  return (
    <motion.div style={{ opacity, y, visibility }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
      {children}
    </motion.div>
  )
}

// ── Pinned, scroll-driven version (desktop, motion allowed) ─────────────────
function CinematicSolution() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const labelOpacity = useTransform(scrollYProgress, [0, BEATS[5], BEATS[6]], [1, 1, 0])

  return (
    <section ref={sectionRef} className="relative bg-[#faf9f7]" style={{ height: `${SCROLL_LENGTH_VH}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.p style={{ opacity: labelOpacity }} className="absolute top-10 left-6 md:left-12 text-[14px] font-semibold tracking-[0.18em] text-violet-600 uppercase">
          05 — The Solution
        </motion.p>

        {/* Beat 0 — Meet Talk To ME */}
        <Beat progress={scrollYProgress} index={0}>
          <h2 className="font-serif text-[3.5rem] md:text-[6rem] font-medium text-ink leading-[1.02] tracking-tightest">
            Meet<br />Talk To <span style={{ color: '#7c3aed' }}>ME.</span>
          </h2>
          <span className="mt-6 w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
        </Beat>

        {/* Beat 1 — the positioning statement */}
        <Beat progress={scrollYProgress} index={1}>
          <p className="font-serif italic text-[1.8rem] md:text-[2.5rem] text-ink leading-snug max-w-3xl">
            A safe space to <span style={{ color: '#7c3aed' }}>talk</span>, connect and <span style={{ color: '#7c3aed' }}>heal</span>.
          </p>
          <p className="mt-5 font-sans text-[17px] md:text-[19px] text-muted leading-relaxed max-w-xl">
            Talk To ME connects people with therapists who fit their needs, while giving therapists the tools to manage their practice and build meaningful client relationships.
          </p>
        </Beat>

        {/* Beat 2 — FIND */}
        <Beat progress={scrollYProgress} index={2}>
          <span className="font-serif font-medium text-ink tracking-tightest leading-none text-[4.5rem] md:text-[7rem]">FIND</span>
          <p className="mt-4 font-serif text-[1.5rem] md:text-[1.9rem] text-ink/70 leading-snug">Find someone<br />who fits.</p>
        </Beat>

        {/* Beat 3 — CONNECT */}
        <Beat progress={scrollYProgress} index={3}>
          <span className="font-serif font-medium text-ink tracking-tightest leading-none text-[3.4rem] md:text-[6rem]">CONNECT</span>
          <p className="mt-4 font-serif text-[1.5rem] md:text-[1.9rem] text-ink/70 leading-snug">Start a session<br />with confidence.</p>
        </Beat>

        {/* Beat 4 — GROW */}
        <Beat progress={scrollYProgress} index={4}>
          <span className="font-serif font-medium text-ink tracking-tightest leading-none text-[4.5rem] md:text-[7rem]">GROW</span>
          <p className="mt-4 font-serif text-[1.5rem] md:text-[1.9rem] text-ink/70 leading-snug">Continue<br />your journey.</p>
        </Beat>

        {/* Beat 5 — FIND → CONNECT → GROW, laid out as editorial columns */}
        <Beat progress={scrollYProgress} index={5}>
          <div className="w-full max-w-5xl">
            <p className="font-serif text-[1.3rem] md:text-[1.7rem] text-ink/50 tracking-tightest mb-8">
              FIND <span className="text-violet-400">→</span> CONNECT <span className="text-violet-400">→</span> GROW
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 md:gap-10 text-left">
              {MOMENTS.map(m => (
                <div key={m.title}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="block h-px bg-stone-300 w-5" />
                    <span className="text-[13px] tracking-[0.14em] uppercase text-muted/70">{m.number}</span>
                  </div>
                  <span className="block font-serif font-medium text-ink tracking-tightest leading-none text-[2rem] md:text-[2.5rem] mb-2">{m.title}</span>
                  <p className="font-serif text-[1.15rem] md:text-[1.3rem] text-ink/70 mb-3 leading-snug">{m.headline}</p>
                  <ul className="flex flex-col gap-1">
                    {m.details.map(d => <li key={d} className="font-sans text-[15px] text-muted leading-relaxed">{d}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Beat>

        {/* Beat 6 — the product opportunity */}
        <Beat progress={scrollYProgress} index={6}>
          <p className="text-[14px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-5">The Product Opportunity</p>
          <p className="font-serif text-[2rem] md:text-[2.8rem] font-medium text-ink leading-snug max-w-3xl mb-4">
            &ldquo;Make finding, starting and continuing therapy easier — for both sides.&rdquo;
          </p>
          <p className="font-sans text-[17px] md:text-[19px] text-muted leading-relaxed max-w-xl">
            One experience connecting the person seeking support with the professional providing it.
          </p>
        </Beat>

      </div>
    </section>
  )
}

// ── Static fallback for mobile and prefers-reduced-motion ──────────────────
function StaticSolution() {
  return (
    <section className="relative bg-[#faf9f7] py-20 md:py-28 px-6">
      <div className="mx-auto max-w-5xl text-center">
        <motion.p {...fadeUp(0)} className="text-[14px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-5">05 — The Solution</motion.p>
        <motion.h2 {...fadeUp(0.05)} className="font-serif text-[3rem] md:text-[4rem] font-medium text-ink leading-[1.05] tracking-tightest mb-5">
          Meet<br />Talk To <span style={{ color: '#7c3aed' }}>ME.</span>
        </motion.h2>
        <motion.p {...fadeUp(0.1)} className="font-serif italic text-[1.5rem] md:text-[1.8rem] text-ink mb-4 leading-snug">
          A safe space to <span style={{ color: '#7c3aed' }}>talk</span>, connect and <span style={{ color: '#7c3aed' }}>heal</span>.
        </motion.p>
        <motion.p {...fadeUp(0.14)} className="font-sans text-[17px] md:text-[18px] text-muted leading-relaxed max-w-2xl mx-auto mb-16">
          Talk To ME connects people with therapists who fit their needs, while giving therapists the tools to manage their practice and build meaningful client relationships.
        </motion.p>
      </div>

      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-left">
        {MOMENTS.map((m, i) => (
          <motion.div key={m.title} {...fadeUp(0.18 + i * 0.08)} className="flex flex-col items-start">
            <span className="block font-serif font-medium text-ink tracking-tightest leading-none text-[3rem] md:text-[3.5rem]">{m.title}</span>
            <span className="block h-[3px] w-12 bg-violet-500 mt-3" />
            <span className="block font-serif text-[1.45rem] md:text-[1.6rem] text-ink/80 mt-4 max-w-[280px] leading-snug">{m.headline}</span>
            <div className="mt-5">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="block h-px bg-stone-300 w-5" />
                <span className="text-[11px] tracking-[0.14em] uppercase text-muted/70">{m.number}</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {m.details.map(d => <li key={d} className="font-sans text-[16px] text-muted leading-relaxed">{d}</li>)}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mx-auto max-w-xl text-center mt-16 md:mt-20 pt-10 border-t border-stone-200/70">
        <motion.p {...fadeUp(0.3)} className="text-[14px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-4">The Product Opportunity</motion.p>
        <motion.p {...fadeUp(0.34)} className="font-serif text-[2rem] md:text-[2.3rem] font-medium text-ink leading-snug mb-4">
          &ldquo;Make finding, starting and continuing therapy easier — for both sides.&rdquo;
        </motion.p>
        <motion.p {...fadeUp(0.38)} className="font-sans text-[16px] md:text-[17px] text-muted leading-relaxed">
          One experience connecting the person seeking support with the professional providing it.
        </motion.p>
      </div>

    </section>
  )
}

export default function SolutionSection() {
  const cinematic = useCinematicMode()
  return cinematic ? <CinematicSolution /> : <StaticSolution />
}
