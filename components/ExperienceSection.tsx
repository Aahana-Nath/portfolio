'use client'

import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' } as const,
    transition: { duration: 0.6, delay, ease: 'easeOut' as const },
  }
}

function VideoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="1" y="3" width="13" height="16" rx="2.5" stroke="#7c3aed" strokeWidth="1.5" />
      <path d="M14 8L20 5.5V16.5L14 14V8Z" stroke="#7c3aed" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function StarBadgeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M4 6h14M4 11h10M4 16h7" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="17" cy="15" r="3.5" stroke="#d97706" strokeWidth="1.4" />
      <path d="M19.5 17.5L21 19" stroke="#d97706" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="9" cy="6" r="3.5" stroke="#0d9488" strokeWidth="1.5" />
      <path d="M2 19c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#0d9488" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17" cy="7" r="2.5" stroke="#0d9488" strokeWidth="1.3" />
      <path d="M19.5 13c1 .5 1.5 1.8 1.5 4" stroke="#0d9488" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function CheckViolet() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 mt-0.5">
      <circle cx="6.5" cy="6.5" r="6" stroke="#7c3aed" strokeWidth="0.8" opacity="0.35" />
      <path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="#7c3aed" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckAmber() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0 mt-0.5">
      <circle cx="6.5" cy="6.5" r="6" stroke="#d97706" strokeWidth="0.8" opacity="0.35" />
      <path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const dresmaFeatures = [
  {
    icon: <VideoIcon />,
    bg: 'rgba(124,58,237,0.1)',
    title: '0→1 GenAI Video Tool',
    desc: (
      <>
        Led design, prototyping and launch of an AI video creation workflow, reducing manual effort by{' '}
        <span className="font-semibold text-violet-600">90%</span> through accurate template replication.
      </>
    ),
  },
  {
    icon: (
      <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text x="13" y="15" fontFamily="Arial Black, sans-serif" fontSize="17" fontWeight="900" fill="#1a1a1a" textAnchor="middle">a</text>
        <path d="M4 20 Q13 24.5 22 20" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
        <path d="M20.5 19 L22 20 L21 21.5" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    ),
    bg: 'rgba(255,153,0,0.1)',
    title: 'AI Amazon Listing Optimizer',
    desc: (
      <>
        Built and launched an AI-powered listing optimization product that scores product listings and provides actionable
        recommendations, improving workflow completion by{' '}
        <span className="font-semibold text-violet-600">70%</span>.
      </>
    ),
  },
  {
    icon: <PeopleIcon />,
    bg: 'rgba(13,148,136,0.1)',
    title: 'Consumer Brand Discovery',
    desc: (
      <>
        Partnered with leading consumer brands to understand content requirements and translate success criteria into
        customized AI image and video workflows.
      </>
    ),
  },
]

const dresmaInternBullets: React.ReactNode[] = [
  'Managed product backlogs and helped define new features for a corporate software suite.',
  <>
    Collaborated with UX/UI designers to streamline product interfaces, contributing to a{' '}
    <span className="font-semibold text-violet-600">15% improvement</span> in user satisfaction.
  </>,
  'Built AI-powered applications using LLMs to automate marketing and design workflows.',
  'Designed end-to-end workflows spanning user experience, data handling and backend integrations.',
]

const airpayBullets = [
  'Defined and prioritized product features for a lending product in the Tanzanian market.',
  'Created PRDs, user stories, acceptance criteria and feature specifications across design, engineering and business teams.',
  'Coordinated feature readiness, testing and launch activities to ensure smooth releases.',
  'Managed and prioritized the product backlog for a key project through successful launch.',
]

export default function ExperienceSection() {
  const [expanded, setExpanded] = useState<string | null>('apm')
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.3'],
  })

  const lineScaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

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
    <section id="experience" ref={sectionRef} onMouseMove={onMouseMove} className="relative scroll-mt-20 overflow-hidden px-6 md:px-12 lg:px-20 py-24" style={{ background: '#12131A', '--color-ink': '#ffffff', '--color-muted': 'rgba(255,255,255,0.5)', '--color-border': 'rgba(255,255,255,0.12)', '--color-surface': '#12131A' } as React.CSSProperties}>
      {/* Grain texture */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ opacity: 0.038, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`, backgroundSize: '200px 200px' }} />
      {/* Faint grid */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.028) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.028) 1px, transparent 1px)', backgroundSize: '52px 52px' }} />
      {/* Mouse-tracked violet glow */}
      <motion.div aria-hidden className="absolute pointer-events-none" style={{ left: glowLeft, top: glowTop, x: '-50%', y: '-50%', width: '70%', height: '80%', background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(139,92,246,0.18) 0%, rgba(167,139,250,0.07) 52%, transparent 74%)' }} />
      {/* Floating particles */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {[{x:'8%',y:'18%',s:2,dur:8,d:0},{x:'92%',y:'12%',s:1.5,dur:10,d:1.2},{x:'14%',y:'72%',s:1,dur:7,d:0.5},{x:'86%',y:'68%',s:2,dur:9,d:2},{x:'48%',y:'8%',s:1.5,dur:11,d:0.8},{x:'72%',y:'88%',s:1.5,dur:10,d:0.3}].map((p,i) => (
          <div key={i} className="absolute rounded-full bg-violet-400" style={{ left:p.x, top:p.y, width:p.s, height:p.s, animation:`ptcFloat ${p.dur}s ease-in-out ${p.d}s infinite`, opacity:0.18 }} />
        ))}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-12 lg:gap-20">

          {/* Left: sticky header */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div {...fadeUp(0)}>
              <p className="text-[10.5px] font-semibold tracking-[0.18em] text-muted uppercase mb-5">
                03 — Experience
              </p>
              <h2 className="font-serif text-[2.5rem] leading-[1.1] tracking-tightest text-ink mb-5">
                From fintech systems
                <br />to AI-powered
                <br />
                <em className="text-violet-400">products that scale.</em>
              </h2>
              <div className="w-10 h-0.5 bg-violet-400 mb-5" />
              <p className="text-[13.5px] text-white/35 leading-relaxed mb-8">
                My journey has been about solving real problems, building with the right technology, and creating impact at every step.
              </p>
            </motion.div>
          </div>

          {/* Right: Interactive Timeline */}
          <div className="relative pl-10">
            <div className="absolute left-5 top-5 bottom-5 w-[1.5px] bg-violet-500/20 rounded-full" />
            <motion.div
              className="absolute left-5 top-5 bottom-5 w-[1.5px] bg-linear-to-b from-violet-600 via-violet-400 to-violet-200 rounded-full"
              style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
            />

            <div className="space-y-8">

              {/* Entry 01: APM */}
              <motion.div className="relative" initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, ease: 'easeOut' }}>
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }} className="absolute -left-8 top-4.5 w-6 h-6 rounded-full bg-violet-600 border-[3px] border-surface z-10 flex items-center justify-center">
                  <motion.span className="absolute inset-0 rounded-full bg-violet-500" animate={{ scale: [1, 1.7, 1.7], opacity: [0.5, 0, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.8 }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-white relative z-10" />
                </motion.div>
                <motion.div whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(124,58,237,0.13)' }} transition={{ duration: 0.2 }} className="rounded-2xl bg-white border border-[#e2e2e0] shadow-[0_2px_24px_rgba(0,0,0,0.06)] overflow-hidden" style={{ '--color-ink': '#0a0a0a', '--color-muted': '#6b6b6b', '--color-border': '#e2e2e0' } as React.CSSProperties}>
                  <button onClick={() => setExpanded(expanded === 'apm' ? null : 'apm')} className="w-full text-left px-6 pt-5 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[9.5px] font-bold tracking-[0.16em] text-violet-500 uppercase">Current Role</span>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg overflow-hidden shadow-sm border border-border shrink-0">
                          <Image src="https://res.cloudinary.com/dvtf1ckaf/image/upload/v1784478173/Screenshot_2026-07-19_at_21.41.24_osqakq.png" alt="Dresma logo" width={100} height={30} className="object-cover" />
                        </div>
                        <motion.div animate={{ rotate: expanded === 'apm' ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-7 h-7 rounded-full bg-violet-900/30 border border-violet-500/20 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </motion.div>
                      </div>
                    </div>
                    <h3 className="font-serif text-[1.55rem] leading-tight tracking-tight text-ink mb-1">Associate Product Manager</h3>
                    <p className="text-[12px] text-muted"><span className="text-violet-600 font-medium">Dresma</span>{' · Jun 2025 – Present · Gurgaon'}</p>
                  </button>
                  <div className="px-6 pb-4">
                    <p className="text-[13px] text-ink/75 leading-relaxed">Leading 0→1 AI products that <strong className="text-ink font-semibold">help eCommerce brands</strong> create, optimize and scale high-quality content.</p>
                  </div>
                  <AnimatePresence initial={false}>
                    {expanded === 'apm' && (
                      <motion.div key="apm-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                        <div className="px-6 pb-6 pt-3 border-t border-border/40">
                          <div className="grid grid-cols-3 gap-5 mb-5 mt-2">
                            {dresmaFeatures.map((f, i) => (
                              <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }} className="flex items-start gap-3">
                                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: f.bg }}>{f.icon}</div>
                                <div>
                                  <p className="text-[11px] font-semibold text-ink leading-snug mb-1">{f.title}</p>
                                  <p className="text-[10.5px] text-muted leading-relaxed">{f.desc}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                          <div className="rounded-xl border border-violet-500/20 px-4 py-3 flex items-center">
                            {[{ stat: '90%', dir: '↓', label: 'reduction in\nmanual effort' }, { stat: '70%', dir: '↑', label: 'increase in workflow\ncompletion rate' }, { stat: '0→1', dir: '', label: 'AI products\nowned end-to-end' }].map((s, i) => (
                              <div key={i} className={`flex-1 ${i < 2 ? 'border-r border-violet-200/50 pr-4' : ''} ${i > 0 ? 'pl-4' : ''}`}>
                                <p className="text-[16px] font-semibold text-violet-600 leading-tight">{s.stat}{s.dir && <span className="text-[12px] ml-0.5">{s.dir}</span>}</p>
                                <p className="text-[9.5px] text-muted leading-snug whitespace-pre-line">{s.label}</p>
                              </div>
                            ))}
                            <div className="ml-5 shrink-0">
                              <Link href="/work/ai-video">
                                <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} className="inline-flex items-center gap-1.5 rounded-full bg-violet-600 hover:bg-violet-700 text-white text-[11.5px] font-medium px-4 py-2 transition-colors cursor-pointer whitespace-nowrap">
                                  View my work
                                  <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5H9.5M9.5 5.5L6.5 2.5M9.5 5.5L6.5 8.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                </motion.span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Entry 02: Intern Dresma */}
              <motion.div className="relative" initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}>
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }} className="absolute -left-8 top-4.5 w-6 h-6 rounded-full bg-[#120820] border-2 border-violet-400 z-10 flex items-center justify-center shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                </motion.div>
                <motion.div whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(0,0,0,0.08)' }} transition={{ duration: 0.2 }} className="rounded-2xl bg-white border border-[#e2e2e0] shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden" style={{ '--color-ink': '#0a0a0a', '--color-muted': '#6b6b6b', '--color-border': '#e2e2e0' } as React.CSSProperties}>
                  <button onClick={() => setExpanded(expanded === 'intern-dresma' ? null : 'intern-dresma')} className="w-full text-left px-6 pt-5 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-6 h-6 rounded-full border border-border flex items-center justify-center text-[10px] font-semibold text-muted">02</span>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg overflow-hidden shadow-sm border border-border shrink-0">
                          <Image src="https://res.cloudinary.com/dvtf1ckaf/image/upload/v1784478173/Screenshot_2026-07-19_at_21.41.24_osqakq.png" alt="Dresma logo" width={100} height={30} className="object-cover" />
                        </div>
                        <motion.div animate={{ rotate: expanded === 'intern-dresma' ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-7 h-7 rounded-full bg-violet-900/30 border border-violet-500/20 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="#7c3aed" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </motion.div>
                      </div>
                    </div>
                    <h3 className="font-serif text-[1.2rem] leading-tight text-ink mb-1">Product Management Intern</h3>
                    <p className="text-[11px] text-muted"><span className="text-violet-600 font-medium">Dresma</span>{' · Dec 2024 – Jun 2025 · Gurgaon'}</p>
                  </button>
                  <div className="px-6 pb-4"><p className="text-[11.5px] text-muted leading-relaxed">Worked closely with cross-functional teams to improve product experiences, build AI workflows and deliver measurable impact.</p></div>
                  <AnimatePresence initial={false}>
                    {expanded === 'intern-dresma' && (
                      <motion.div key="intern-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                        <div className="px-6 pb-6 pt-3 border-t border-border/40">
                          <div className="flex items-start gap-4 mt-2">
                            <ul className="flex-1 space-y-1.5">
                              {dresmaInternBullets.map((item, i) => (
                                <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }} className="flex gap-2">
                                  <CheckViolet /><span className="text-[11px] text-ink/70 leading-relaxed">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                            <div className="shrink-0 w-32 text-right pt-1">
                              <p className="text-[11px] text-ink/75 leading-relaxed">Promoted to <span className="font-semibold text-ink">Associate Product Manager</span> in just 6 months.</p>
                              <div className="mt-3 ml-auto w-6 h-[1.5px] bg-ink/20" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

              {/* Entry 03: Airpay */}
              <motion.div className="relative" initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}>
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }} className="absolute -left-8 top-4.5 w-6 h-6 rounded-full bg-[#120820] border-2 border-amber-400 z-10 flex items-center justify-center shadow-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </motion.div>
                <motion.div whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(217,119,6,0.1)' }} transition={{ duration: 0.2 }} className="rounded-2xl bg-white border border-[#e2e2e0] shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden" style={{ '--color-ink': '#0a0a0a', '--color-muted': '#6b6b6b', '--color-border': '#e2e2e0' } as React.CSSProperties}>
                  <button onClick={() => setExpanded(expanded === 'airpay' ? null : 'airpay')} className="w-full text-left px-6 pt-5 pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-6 h-6 rounded-full border border-amber-400/40 flex items-center justify-center text-[10px] font-semibold text-amber-400">03</span>
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg overflow-hidden shrink-0">
                          <Image src="/aipay-logo.png" alt="Airpay logo" width={80} height={28} className="object-cover" />
                        </div>
                        <motion.div animate={{ rotate: expanded === 'airpay' ? 180 : 0 }} transition={{ duration: 0.3 }} className="w-7 h-7 rounded-full bg-amber-900/20 border border-amber-400/20 flex items-center justify-center shrink-0">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5L7 9L11 5" stroke="#d97706" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </motion.div>
                      </div>
                    </div>
                    <h3 className="font-serif text-[1.2rem] leading-tight text-ink mb-1">Product Management Intern</h3>
                    <p className="text-[11px] text-muted"><span className="text-amber-600 font-medium">Airpay</span>{' · 2024 – 2025 · Gurgaon'}</p>
                  </button>
                  <div className="px-6 pb-4"><p className="text-[11.5px] text-muted leading-relaxed">Contributed to building and launching a lending product for the Tanzanian market.</p></div>
                  <AnimatePresence initial={false}>
                    {expanded === 'airpay' && (
                      <motion.div key="airpay-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                        <div className="px-6 pb-6 pt-3 border-t border-border/40">
                          <div className="flex items-start gap-4 mt-2">
                            <ul className="flex-1 space-y-1.5">
                              {airpayBullets.map((item, i) => (
                                <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08, duration: 0.3 }} className="flex gap-2">
                                  <CheckAmber /><span className="text-[11px] text-ink/70 leading-relaxed">{item}</span>
                                </motion.li>
                              ))}
                            </ul>
                            <div className="shrink-0 w-28 flex flex-col items-end gap-2 pt-1">
                              <div className="flex items-center gap-1">
                                <span className="font-bold text-[14px] text-amber-600 tracking-tight">airpay</span>
                                <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M4.5 0L5.5 3.4H9L6.3 5.2L7.2 8.8L4.5 7L1.8 8.8L2.7 5.2L0 3.4H3.5Z" fill="#d97706" /></svg>
                              </div>
                              <div className="flex flex-wrap gap-1 justify-end">
                                {['Fintech', 'Lending', 'Tanzania'].map((tag) => (
                                  <span key={tag} className="text-[9px] font-medium text-amber-300/70 bg-amber-900/20 border border-amber-400/20 rounded-full px-2 py-0.5">{tag}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
