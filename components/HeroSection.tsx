'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInViewport } from './useInViewport'

// ── Helpers ─────────────────────────────────────────────────────
const EASE = [0.25, 0.1, 0.25, 1] as const
function fadeUp(delay: number) {
  return { initial:{opacity:0,y:22}, animate:{opacity:1,y:0}, transition:{duration:0.78,delay,ease:EASE} }
}
function fadeIn(delay: number) {
  return { initial:{opacity:0}, animate:{opacity:1}, transition:{duration:0.85,delay,ease:'easeOut' as const} }
}

// ── Verbs ────────────────────────────────────────────────────────
const VERBS = ['build','design','ideate','prototype','launch','scale']

// ── Icons ────────────────────────────────────────────────────────
const IconCrown  = () => (<svg viewBox="0 0 16 12" className="h-3 w-3.5 shrink-0" fill="none"><path d="M1.5 10 L1.5 4 L5.5 7 L8 1.5 L10.5 7 L14.5 4 L14.5 10 Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round"/><line x1="1.5" y1="10" x2="14.5" y2="10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>)
const IconBulb   = () => (<svg viewBox="0 0 12 16" className="h-3.5 w-3 shrink-0" fill="none"><path d="M6 1.5 C3.8 1.5 2 3.3 2 5.5 C2 7.1 2.9 8.5 4.2 9.2 L4.2 11 L7.8 11 L7.8 9.2 C9.1 8.5 10 7.1 10 5.5 C10 3.3 8.2 1.5 6 1.5 Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><line x1="4.5" y1="12" x2="7.5" y2="12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/><line x1="5" y1="13.2" x2="7" y2="13.2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>)
const IconGear   = () => (<svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none"><circle cx="7" cy="7" r="2.2" stroke="currentColor" strokeWidth="1.1"/><path d="M7 1 L7 2.5 M7 11.5 L7 13 M1 7 L2.5 7 M11.5 7 L13 7 M2.9 2.9 L4 4 M10 10 L11.1 11.1 M11.1 2.9 L10 4 M4 10 L2.9 11.1" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>)
const IconSearch = () => (<svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none"><circle cx="5.5" cy="5.5" r="3.8" stroke="currentColor" strokeWidth="1.2"/><line x1="8.5" y1="8.5" x2="12.5" y2="12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>)
const IconCube   = () => (<svg viewBox="0 0 14 14" className="h-3 w-3 shrink-0" fill="none"><path d="M7 1.5 L12 4.2 L12 9.8 L7 12.5 L2 9.8 L2 4.2 Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><line x1="7" y1="1.5" x2="7" y2="12.5" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1"/><line x1="2" y1="4.2" x2="12" y2="4.2" stroke="currentColor" strokeWidth="0.9" strokeDasharray="2 1"/></svg>)
const IconRocket = () => (<svg viewBox="0 0 12 16" className="h-3.5 w-3 shrink-0" fill="none"><path d="M6 13 C6 13 3 9.5 3 6.5 C3 3.8 4.3 2 6 1.2 C7.7 2 9 3.8 9 6.5 C9 9.5 6 13 6 13 Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round"/><circle cx="6" cy="6.5" r="1.3" stroke="currentColor" strokeWidth="1"/><path d="M3 8.5 L1.5 10.5 M9 8.5 L10.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>)

// ── Sketch border ────────────────────────────────────────────────
function SketchBorder({ rotate=0, strokeClass='text-stone-400/50' }: { rotate?: number; strokeClass?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 38" className="pointer-events-none absolute inset-0 h-full w-full" style={{ transform:`rotate(${rotate}deg)` }}>
      <rect x="2" y="2" width="116" height="34" rx="12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 1.2" className={strokeClass} />
    </svg>
  )
}

// ── Keyword pill ─────────────────────────────────────────────────
interface PillProps {
  label: string; delay: number; style?: React.CSSProperties
  floatY?: number; rotate?: number; floatX?: number
  pillBg?: string; strokeClass?: string; icon?: React.ReactNode
  desc?: string; featured?: boolean
}
function KeywordPill({ label, delay, style, floatY=5, rotate=0, floatX=0, pillBg='bg-white/70 text-stone-600', strokeClass='text-stone-400/50', icon, desc, featured }: PillProps) {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.7, y:16 }}
      animate={{ opacity:1, scale:1, y:0 }}
      whileHover={{ scale: featured ? 1.03 : 1.1, zIndex:30 }}
      transition={{ duration:0.55, delay, ease:[0.34,1.56,0.64,1] }}
      className="absolute z-20 pointer-events-auto cursor-default"
      style={{ ...style, rotate:`${rotate}deg` }}
    >
      <motion.div
        animate={{ y:[0,-floatY,0], x:[0,floatX,0] }}
        transition={{ duration: 4+delay*2.5, repeat:Infinity, ease:'easeInOut' }}
        className="relative px-3 py-1.5"
      >
        <div className={`relative z-10 ${featured
          ? 'rounded-xl bg-white border border-stone-100 shadow-[0_4px_24px_rgba(0,0,0,0.10)] px-4 py-3 flex flex-col gap-1.5'
          : `flex items-center gap-1.5 ${pillBg} backdrop-blur-sm rounded-full border border-white/85 px-3 py-1.5 shadow-[0_4px_22px_rgba(109,93,175,0.16)]`
        } text-[11.5px] font-medium tracking-[0.03em] whitespace-nowrap`}>
          <span className={`flex items-center gap-1.5 ${featured ? 'text-stone-800' : ''}`}>
            {icon}{label}
          </span>
          {featured && desc && (
            <span className="text-[10.5px] font-normal text-stone-500 leading-relaxed whitespace-normal max-w-38.75">
              {desc}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── AI intelligence backdrop data ───────────────────────────────



// Organic nodes scattered around the portrait area (viewBox 760×760, centre 380,380)
const ORB_NODES = [
  // inner zone
  {x:224,y:188,r:2.8,op:0.88,d:0.2},{x:432,y:156,r:2.5,op:0.82,d:0.8},
  {x:528,y:298,r:2.6,op:0.84,d:0.4},{x:502,y:462,r:2.3,op:0.76,d:1.1},
  {x:328,y:512,r:2.4,op:0.8,d:0.6},{x:198,y:424,r:2.7,op:0.86,d:0.3},
  {x:172,y:274,r:2.2,op:0.72,d:1.4},
  // mid zone
  {x:128,y:196,r:2.0,op:0.62,d:0.9},{x:342,y:116,r:2.1,op:0.64,d:0.5},
  {x:522,y:172,r:1.9,op:0.58,d:1.2},{x:602,y:344,r:2.0,op:0.60,d:0.7},
  {x:582,y:464,r:1.9,op:0.58,d:1.5},{x:402,y:574,r:2.1,op:0.62,d:0.4},
  {x:218,y:548,r:1.8,op:0.54,d:1.0},{x:108,y:382,r:2.0,op:0.60,d:0.8},
  {x:144,y:238,r:1.7,op:0.52,d:1.6},
  // outer scatter
  {x:62,y:200,r:1.5,op:0.38,d:0.3},{x:238,y:76,r:1.6,op:0.42,d:1.1},
  {x:502,y:72,r:1.4,op:0.36,d:0.7},{x:642,y:218,r:1.6,op:0.42,d:0.5},
  {x:664,y:424,r:1.5,op:0.38,d:1.3},{x:542,y:584,r:1.4,op:0.36,d:0.9},
  {x:278,y:624,r:1.6,op:0.40,d:0.4},{x:78,y:502,r:1.5,op:0.38,d:1.7},
  {x:56,y:308,r:1.4,op:0.34,d:0.6},{x:330,y:40,r:1.3,op:0.32,d:1.2},
  {x:626,y:148,r:1.4,op:0.36,d:0.8},{x:700,y:330,r:1.5,op:0.38,d:0.2},
  {x:458,y:48,r:1.3,op:0.30,d:1.5},{x:680,y:542,r:1.4,op:0.34,d:0.9},
]

// Constellation connections – organic, not a regular grid
const ORB_LINES = [
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],
  [0,7],[1,8],[2,9],[3,10],[4,11],[5,12],[6,13],[6,14],[0,15],
  [7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,7],
  [7,16],[8,17],[9,18],[10,19],[11,20],[12,21],[13,22],[14,23],[15,24],
  [16,17],[18,25],[19,26],[20,21],[22,23],
  [0,8],[2,10],[4,12],[9,18],[1,6],[7,15],
]

// Fragmented orbital arcs — broken orbital paths, no full circles
const FRAG_ARCS = [
  // Inner orbit — 3 fragments, rotating clockwise
  {r:118, s:8,   sw:95,  op:0.42, lw:1.1, dash:'',    spd:200, dir: 1},
  {r:118, s:148, sw:68,  op:0.32, lw:0.9, dash:'4 7', spd:200, dir: 1},
  {r:118, s:270, sw:54,  op:0.28, lw:0.8, dash:'',    spd:200, dir: 1},
  // Mid orbit — counter-clockwise
  {r:162, s:22,  sw:108, op:0.30, lw:0.9, dash:'',    spd:300, dir:-1},
  {r:162, s:178, sw:75,  op:0.24, lw:0.7, dash:'5 8', spd:300, dir:-1},
  {r:162, s:308, sw:62,  op:0.20, lw:0.7, dash:'',    spd:300, dir:-1},
  // Outer orbit — clockwise
  {r:208, s:48,  sw:98,  op:0.20, lw:0.8, dash:'',    spd:380, dir: 1},
  {r:208, s:188, sw:72,  op:0.16, lw:0.6, dash:'6 9', spd:380, dir: 1},
  {r:208, s:312, sw:84,  op:0.14, lw:0.6, dash:'2 7', spd:380, dir: 1},
  // Far outer — faint, counter-clockwise
  {r:252, s:15,  sw:74,  op:0.13, lw:0.5, dash:'7 11',spd:500, dir:-1},
  {r:252, s:145, sw:56,  op:0.10, lw:0.4, dash:'',    spd:500, dir:-1},
  {r:252, s:262, sw:90,  op:0.12, lw:0.5, dash:'3 13',spd:500, dir:-1},
]

// Particles [cx, cy, r, delay, duration, opacity]
const ORB_PARTICLES: [number,number,number,number,number,number][] = [
  [91,106,1.5,0,11,0.70],[167,61,1.0,0.4,14,0.55],[274,91,1.5,0.8,12,0.65],
  [365,46,1.8,1.2,15,0.60],[456,76,1.0,0.3,10,0.55],[562,53,1.5,1.6,13,0.62],
  [654,107,1.0,0.7,11,0.50],[699,198,1.8,0.2,14,0.65],
  [61,243,1.5,1.1,12,0.62],[46,365,1.0,0.5,15,0.50],[76,471,1.8,1.4,11,0.58],
  [107,578,1.0,0.9,13,0.52],[183,669,1.5,0.3,12,0.55],[304,699,1.0,1.7,14,0.50],
  [426,684,1.8,0.6,10,0.58],[532,654,1.0,1.3,13,0.52],[639,593,1.5,0.8,11,0.58],
  [699,471,1.0,0.4,14,0.50],[714,350,1.8,1.0,12,0.62],
  // inner dense
  [243,213,1.5,0.2,11,0.72],[395,167,1.8,0.7,13,0.68],[517,213,1.0,1.2,10,0.65],
  [578,319,1.5,0.4,12,0.70],[547,441,1.8,0.9,14,0.66],[456,547,1.0,1.5,11,0.62],
  [334,578,1.5,0.6,13,0.68],[213,517,1.0,0.3,10,0.64],[167,395,1.8,1.1,12,0.70],
  [198,289,1.0,0.8,14,0.66],[319,243,1.5,0.5,11,0.70],[441,274,1.0,1.4,13,0.64],
  [487,410,1.8,0.2,12,0.66],[380,502,1.5,1.0,10,0.68],[259,441,1.0,0.6,14,0.64],
  // outer extras
  [30,137,1.0,1.3,13,0.40],[137,30,1.5,0.4,11,0.42],[334,30,1.0,0.9,14,0.36],
  [471,30,1.5,0.2,12,0.38],[608,46,1.0,1.6,10,0.40],[729,107,1.5,0.7,13,0.38],
  [745,289,1.0,1.1,12,0.40],[745,426,1.8,0.3,11,0.38],[729,562,1.5,0.8,14,0.40],
  [669,699,1.0,1.4,12,0.38],[547,729,1.8,0.5,10,0.40],[395,729,1.0,1.9,13,0.36],
  [228,714,1.5,0.2,11,0.38],[107,669,1.0,0.6,14,0.40],[30,547,1.8,1.3,12,0.38],
  [15,395,1.5,0.9,10,0.36],[15,258,1.0,0.4,13,0.38],
]

// Sparkle crosses [cx, cy, arm-length, delay]
const ORB_SPARKLES: [number,number,number,number][] = [
  [150,150,6,0.5],[480,120,5,1.2],[622,282,7,0.8],[578,538,5,1.5],
  [260,558,6,0.3],[102,422,5,1.9],[320,182,6,0.7],[558,382,5,1.1],
  [202,382,6,0.4],[442,558,5,1.6],[680,162,5,0.9],[100,280,5,1.3],
  [600,200,6,0.6],[700,460,5,1.8],[280,660,6,0.2],
  // extra stars
  [380,80,7,0.4],[60,180,5,1.0],[710,320,6,0.6],[620,580,5,1.4],
  [180,620,6,0.8],[420,720,5,0.2],[520,460,7,1.7],[240,240,5,0.9],
  [660,420,6,0.5],[340,500,5,1.3],[500,300,6,0.1],[140,480,5,1.6],
  [560,660,6,0.7],[720,200,5,1.1],[80,560,6,0.3],
]

// Arc path helper
function arcPath(r:number, startDeg:number, sweepDeg:number):string {
  const toXY = (deg:number) => {
    const rad = (deg - 90) * Math.PI / 180
    return { x: 380 + r * Math.cos(rad), y: 380 + r * Math.sin(rad) }
  }
  const s = toXY(startDeg), e = toXY(startDeg + sweepDeg)
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${sweepDeg > 180 ? 1 : 0} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

// Data pulses — particles that travel along constellation edges
const DATA_PULSES: {a:number; b:number; dur:number; delay:number}[] = [
  {a:26, b:27,  dur:3.4, delay:0.0 },
  {a:28, b:29,  dur:4.2, delay:1.8 },
  {a:30, b:31,  dur:3.0, delay:3.5 },
  {a:0,  b:26,  dur:3.8, delay:0.6 },
  {a:4,  b:27,  dur:3.1, delay:2.4 },
  {a:9,  b:29,  dur:4.5, delay:1.2 },
  {a:12, b:30,  dur:3.3, delay:4.0 },
  {a:15, b:31,  dur:4.0, delay:0.3 },
]

function DataPulse({ x1,y1,x2,y2,duration,delay }: {x1:number;y1:number;x2:number;y2:number;duration:number;delay:number}) {
  return (
    <motion.circle r="2.0" fill="white" filter="url(#pulse-glow)"
      initial={{ opacity:0, cx:x1, cy:y1 }}
      animate={{ opacity:[0,0,0.95,0.95,0], cx:[x1,x1,x2,x2,x2], cy:[y1,y1,y2,y2,y2] }}
      transition={{ duration, delay, repeat:Infinity, repeatDelay:duration*1.8, ease:'linear', times:[0,0.08,0.88,0.95,1] }}
    />
  )
}

function IntelligenceField({
  glowX, glowY, arcX, arcY, netX, netY, particleX, particleY,
}: { glowX:any; glowY:any; arcX:any; arcY:any; netX:any; netY:any; particleX:any; particleY:any }) {
  return (
    <>
      {/* ── LAYER 1: AMBIENT GLOW — pulsing, multi-layer ─────── */}
      <motion.div aria-hidden className="absolute pointer-events-none"
        animate={{ scale:[1,1.032,1], opacity:[1,0.86,1] }}
        transition={{ duration:9, repeat:Infinity, ease:'easeInOut' }}
        style={{ top:'50%',left:'50%',transform:'translate(-50%,-50%)',
          width:'148%',height:'148%', x:glowX, y:glowY,
          background:'radial-gradient(ellipse 52% 50% at 50% 50%, rgba(168,142,255,0.20) 0%, rgba(160,132,255,0.07) 48%, transparent 72%)' }}
      />
      <motion.div aria-hidden className="absolute pointer-events-none"
        animate={{ scale:[1,1.024,1], opacity:[0.88,1,0.88] }}
        transition={{ duration:12, repeat:Infinity, ease:'easeInOut', delay:1.8 }}
        style={{ top:'50%',left:'50%',transform:'translate(-50%,-50%)',
          width:'92%',height:'92%', x:glowX, y:glowY,
          background:'radial-gradient(ellipse 48% 46% at 50% 50%, rgba(148,115,255,0.26) 0%, rgba(162,132,255,0.10) 40%, transparent 68%)',
          filter:'blur(3px)' }}
      />
      <motion.div aria-hidden className="absolute pointer-events-none"
        animate={{ scale:[1.02,1,1.02], opacity:[0.82,1,0.82] }}
        transition={{ duration:8, repeat:Infinity, ease:'easeInOut', delay:3.5 }}
        style={{ top:'50%',left:'50%',transform:'translate(-50%,-50%)',
          width:'48%',height:'48%', x:glowX, y:glowY,
          background:'radial-gradient(circle at 50% 50%, rgba(175,148,255,0.32) 0%, rgba(152,120,255,0.12) 44%, transparent 72%)',
          filter:'blur(12px)' }}
      />

      {/* ── SVG: LAYERS 2–6 ──────────────────────────────────── */}
      <motion.svg aria-hidden viewBox="0 0 760 760" className="absolute pointer-events-none"
        style={{ left:'-14%', top:'-14%', width:'128%', height:'128%', overflow:'visible', x:arcX, y:arcY }}
      >
        <defs>
          <filter id="pulse-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="2.5" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="node-glow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="1.8" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* LAYER 6: Ultra-faint geometric knowledge graph */}
        <g opacity="0.032">
          {Array.from({length:7},(_,i)=>(
            <g key={`g${i}`}>
              <line x1={0} y1={i*110+30} x2={760} y2={i*110+30} stroke="white" strokeWidth="0.5"/>
              <line x1={i*110+30} y1={0} x2={i*110+30} y2={760} stroke="white" strokeWidth="0.5"/>
            </g>
          ))}
          {/* Diagonal connections */}
          {[[0,0,380,380],[380,0,760,380],[0,380,380,760],[380,380,760,760],
            [0,0,760,760],[760,0,0,760]].map(([x1,y1,x2,y2],i)=>(
            <line key={`d${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="0.4"/>
          ))}
        </g>

        {/* LAYER 2: Fragmented orbital arcs — no full circles */}
        {FRAG_ARCS.map((arc,i) => (
          <motion.path key={`fa-${i}`}
            d={arcPath(arc.r, arc.s, arc.sw)}
            fill="none" stroke="white" strokeWidth={arc.lw}
            strokeDasharray={arc.dash || undefined} strokeLinecap="round"
            style={{ transformOrigin:'380px 380px', opacity: arc.op }}
            animate={{ rotate: arc.dir > 0 ? 360 : -360 }}
            transition={{ duration: arc.spd, repeat:Infinity, ease:'linear' }}
          />
        ))}

        {/* LAYER 3: Constellation lines — organic, asynchronous glow */}
        {ORB_LINES.map(([a,b],i) => {
          const na=ORB_NODES[a], nb=ORB_NODES[b]
          if(!na||!nb) return null
          const base = 0.22 + (i%4)*0.05
          return (
            <motion.line key={`ln-${i}`}
              x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke="white" strokeWidth={0.65}
              animate={{ opacity:[base, base*1.65, base] }}
              transition={{ duration:5+i%6, repeat:Infinity, ease:'easeInOut', delay:i*0.15 }}
            />
          )
        })}

        {/* LAYER 3: Constellation nodes — bloom + independent pulse */}
        {ORB_NODES.map((n,i) => (
          <g key={`nd-${i}`} filter="url(#node-glow)">
            <circle cx={n.x} cy={n.y} r={(n.r||2)*4.5} fill="white" opacity={n.op*0.10}/>
            <motion.circle cx={n.x} cy={n.y} r={n.r||2} fill="white"
              animate={{ opacity:[n.op*0.42, n.op, n.op*0.42], r:[n.r||2,(n.r||2)*1.14,n.r||2] }}
              transition={{ duration:3+(n.d||0)*0.7, delay:n.d||0, repeat:Infinity, ease:'easeInOut' }}
            />
          </g>
        ))}

        {/* LAYER 4: Data pulses — information traveling neural paths */}
        {DATA_PULSES.map((p,i) => {
          const na=ORB_NODES[p.a], nb=ORB_NODES[p.b]
          if(!na||!nb) return null
          return <DataPulse key={`dp-${i}`} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} duration={p.dur} delay={p.delay}/>
        })}

        {/* LAYER 4: Orbit travelers — glowing dots riding the arc paths */}
        {([
          {r:118, a:60,  spd:14, op:0.82, sz:2.8, d:0  },
          {r:118, a:240, spd:14, op:0.70, sz:2.2, d:4  },
          {r:162, a:130, spd:20, op:0.72, sz:2.5, d:2  },
          {r:162, a:310, spd:20, op:0.60, sz:2.0, d:7  },
          {r:208, a:50,  spd:28, op:0.58, sz:2.2, d:1  },
          {r:208, a:200, spd:28, op:0.48, sz:1.8, d:5  },
          {r:252, a:90,  spd:38, op:0.45, sz:1.8, d:3  },
          {r:252, a:280, spd:38, op:0.38, sz:1.5, d:9  },
        ] as {r:number;a:number;spd:number;op:number;sz:number;d:number}[]).map((t,i) => {
          const rad = (t.a - 90) * Math.PI / 180
          const sx = 380 + t.r * Math.cos(rad), sy = 380 + t.r * Math.sin(rad)
          return (
            <motion.g key={`ot-${i}`} style={{ transformOrigin:'380px 380px' }}
              animate={{ rotate: i%2===0 ? 360 : -360 }}
              transition={{ duration:t.spd, repeat:Infinity, ease:'linear', delay:t.d }}
            >
              <circle cx={sx} cy={sy} r={t.sz*2.2} fill="white" opacity={t.op*0.28}/>
              <circle cx={sx} cy={sy} r={t.sz} fill="white" opacity={t.op}/>
            </motion.g>
          )
        })}

        {/* LAYER 5: Particle field — micro dots drift independently */}
        {ORB_PARTICLES.map(([cx,cy,r,d,dur,op],i) => (
          <motion.circle key={`pt-${i}`} cx={cx} cy={cy} r={r} fill="white"
            animate={{ opacity:[op*0.28,op,op*0.28], cy:[cy,cy-(2+i%4),cy], cx:[cx,cx+(i%2?1.5:-1.5),cx] }}
            transition={{ duration:dur, delay:d, repeat:Infinity, ease:'easeInOut' }}
          />
        ))}

        {/* LAYER 5: Sparkle crosses — ✦ 4-pointed stars */}
        {ORB_SPARKLES.map(([sx,sy,sl,sd],i) => (
          <motion.g key={`sp-${i}`} style={{ transformOrigin:`${sx}px ${sy}px` }}
            animate={{ opacity:[0.22,0.72,0.22], scale:[0.88,1.06,0.88] }}
            transition={{ duration:4.5+(i%4)*1.0, delay:sd, repeat:Infinity, ease:'easeInOut' }}
          >
            <line x1={sx-sl} y1={sy} x2={sx+sl} y2={sy} stroke="white" strokeWidth="0.75" strokeLinecap="round"/>
            <line x1={sx} y1={sy-sl} x2={sx} y2={sy+sl} stroke="white" strokeWidth="0.75" strokeLinecap="round"/>
            <line x1={sx-sl*0.62} y1={sy-sl*0.62} x2={sx+sl*0.62} y2={sy+sl*0.62} stroke="white" strokeWidth="0.45" strokeLinecap="round" opacity="0.55"/>
            <line x1={sx+sl*0.62} y1={sy-sl*0.62} x2={sx-sl*0.62} y2={sy+sl*0.62} stroke="white" strokeWidth="0.45" strokeLinecap="round" opacity="0.55"/>
          </motion.g>
        ))}

        {/* LAYER 5: Outlined diamond shapes */}
        {([[290,140,5],[520,140,4],[660,300,5],[640,480,4],[440,640,5],
           [200,600,4],[80,440,5],[100,200,4],[380,700,4],[700,200,5],
        ] as [number,number,number][]).map(([dx,dy,ds],i) => (
          <motion.path key={`dm-${i}`}
            d={`M${dx} ${dy-ds} L${dx+ds} ${dy} L${dx} ${dy+ds} L${dx-ds} ${dy} Z`}
            fill="none" stroke="white" strokeWidth="0.55"
            style={{ transformOrigin:`${dx}px ${dy}px` }}
            animate={{ opacity:[0.10,0.42,0.10], scale:[0.92,1.05,0.92] }}
            transition={{ duration:6.5+i*0.45, delay:i*0.38, repeat:Infinity, ease:'easeInOut' }}
          />
        ))}
      </motion.svg>

      {/* ── LAYER 5: Floating div particle field (parallax) ──── */}
      <motion.div aria-hidden className="absolute inset-0 pointer-events-none" style={{ x:particleX, y:particleY }}>
        {([
          ['9%','12%',2.2],['82%','10%',1.8],['6%','60%',2.0],['88%','64%',2.4],
          ['46%','8%',2.0],['18%','48%',1.6],['70%','52%',1.8],['52%','86%',1.6],
          ['28%','22%',2.0],['64%','20%',1.8],['24%','76%',2.2],['74%','78%',1.6],
          ['38%','90%',1.5],['58%','6%',1.8],['12%','36%',1.6],['90%','42%',1.9],
        ] as [string,string,number][]).map(([lx,ly,ls],i) => (
          <motion.div key={`fp-${i}`} className="absolute rounded-full bg-white"
            style={{ left:lx, top:ly, width:ls, height:ls }}
            animate={{ opacity:[0.16,0.50,0.16], y:[0,-7,0], x:[0,i%2?2.5:-2.5,0] }}
            transition={{ duration:11+i*0.75, delay:i*0.42, repeat:Infinity, ease:'easeInOut' }}
          />
        ))}
      </motion.div>
    </>
  )
}

// ── Pill positions ───────────────────────────────────────────────
const KEYWORDS: PillProps[] = [
  { label:'Product Strategy', style:{ top:'10%', left:'calc(50% - 270px)' }, delay:0.04, rotate:-0.4, floatY:4, pillBg:'bg-white/88 text-violet-700', strokeClass:'text-violet-300/40', icon:<IconCrown /> },
  { label:'AI Workflows',     style:{ top:'26%', left:'calc(50% - 305px)' }, delay:0.12, floatY:5, rotate:0.2, pillBg:'bg-white/88 text-indigo-700', strokeClass:'text-indigo-300/40' },
  { label:'UX Thinking',      style:{ top:'26%', left:'calc(50% + 185px)' }, delay:0.18, floatY:4, rotate:-0.2, pillBg:'bg-white/88 text-stone-600', strokeClass:'text-stone-300/40', icon:<IconBulb /> },
  { label:'LLMs',             style:{ top:'56%', left:'calc(50% - 320px)' }, delay:0.08, floatY:4, rotate:-0.5, pillBg:'bg-white/88 text-violet-700', strokeClass:'text-violet-300/40' },
  { label:'Automation',       style:{ top:'52%', left:'calc(50% + 225px)' }, delay:0.2, floatY:5, rotate:0.4, pillBg:'bg-white/88 text-stone-600', strokeClass:'text-stone-300/40', icon:<IconGear /> },
  { label:'User Research',    style:{ top:'68%', left:'calc(50% - 300px)' }, delay:0.15, floatY:4, rotate:-0.4, pillBg:'bg-white/88 text-teal-700', strokeClass:'text-teal-300/40', icon:<IconSearch /> },
  { label:'Product Systems',  style:{ top:'74%', left:'calc(50% + 205px)' }, delay:0.1, floatY:4, rotate:0.2, pillBg:'bg-white/88 text-stone-600', strokeClass:'text-stone-300/40', icon:<IconCube /> },
]

// ── Hero Section ─────────────────────────────────────────────────
export default function HeroSection() {
  const [verbIdx, setVerbIdx]           = useState(0)
  const [portraitHovered, setPortrait]  = useState(false)
  const portraitRef = useRef<HTMLDivElement>(null)

  const cursorX = useMotionValue(-400)
  const cursorY = useMotionValue(-400)
  const mouseNX = useMotionValue(0)
  const mouseNY = useMotionValue(0)

  const glowX = useSpring(cursorX, {stiffness:80,damping:20,mass:0.6})
  const glowY = useSpring(cursorY, {stiffness:80,damping:20,mass:0.6})
  const smX   = useSpring(mouseNX, {stiffness:45,damping:16,mass:1})
  const smY   = useSpring(mouseNY, {stiffness:45,damping:16,mass:1})

  const textX    = useTransform(smX,[-0.5,0.5],[-7,  7])
  const textY    = useTransform(smY,[-0.5,0.5],[-4,  4])
  const canvasX  = useTransform(smX,[-0.5,0.5],[10,-10])
  const canvasY  = useTransform(smY,[-0.5,0.5],[ 7, -7])
  const popupX   = useTransform(smX,[-0.5,0.5],[ 6, -6])
  const popupY   = useTransform(smY,[-0.5,0.5],[ 4, -4])
  const glowLayerX = useTransform(smX,[-0.5,0.5],[-5, 5])
  const glowLayerY = useTransform(smY,[-0.5,0.5],[-4, 4])
  const arcLayerX = useTransform(smX,[-0.5,0.5],[-8, 8])
  const arcLayerY = useTransform(smY,[-0.5,0.5],[-6, 6])
  const netLayerX = useTransform(smX,[-0.5,0.5],[-10, 10])
  const netLayerY = useTransform(smY,[-0.5,0.5],[-8, 8])
  const particleLayerX = useTransform(smX,[-0.5,0.5],[-14, 14])
  const particleLayerY = useTransform(smY,[-0.5,0.5],[-10, 10])

  const localPX = useMotionValue(0)
  const localPY = useMotionValue(0)
  const tiltX   = useSpring(useTransform(localPY,[-0.5,0.5],[ 6,-6]),{stiffness:120,damping:18})
  const tiltY   = useSpring(useTransform(localPX,[-0.5,0.5],[-6, 6]),{stiffness:120,damping:18})

  useEffect(() => {
    const t = setInterval(() => setVerbIdx(p => (p+1) % VERBS.length), 2750)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX); cursorY.set(e.clientY)
      mouseNX.set(e.clientX/window.innerWidth - 0.5)
      mouseNY.set(e.clientY/window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', onMove, {passive:true})
    return () => window.removeEventListener('mousemove', onMove)
  }, [cursorX,cursorY,mouseNX,mouseNY])

  function onPortraitMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = portraitRef.current?.getBoundingClientRect()
    if (!r) return
    localPX.set((e.clientX-(r.left+r.width/2))/r.width)
    localPY.set((e.clientY-(r.top+r.height/2))/r.height)
  }
  function onPortraitLeave() { localPX.set(0); localPY.set(0); setPortrait(false) }

  // The decorative background below is ~200 concurrently-animating elements —
  // only render/animate it while the hero is actually near the viewport so it
  // stops costing CPU/GPU once the user has scrolled past it.
  const { ref: sectionRef, inView: heroInView } = useInViewport<HTMLElement>('300px')

  return (
    <section id="home" ref={sectionRef} className="relative min-h-screen w-full scroll-mt-20 overflow-hidden bg-[#eeeaf9] pt-17">

      {/* Ambient background — purple atmosphere across full section */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* Single reliable CSS multi-radial background — no blur/filter/transform issues */}
        {/* Big left atmosphere blob */}
        <div style={{ position:'absolute', left:'-6%', top:'18%', width:'44vw', height:'44vw', maxWidth:520, maxHeight:520, borderRadius:'9999px', background:'radial-gradient(circle, rgba(162,132,255,0.24) 0%, rgba(168,140,255,0.10) 44%, rgba(168,140,255,0) 74%)' }} />
        {/* Big right atmosphere blob */}
        <div style={{ position:'absolute', right:'-4%', top:'30%', width:'40vw', height:'40vw', maxWidth:480, maxHeight:480, borderRadius:'9999px', background:'radial-gradient(circle, rgba(162,132,255,0.20) 0%, rgba(168,140,255,0.09) 44%, rgba(168,140,255,0) 74%)' }} />
        {/* Bottom left atmosphere blob */}
        <div style={{ position:'absolute', left:'4%', bottom:'8%', width:'32vw', height:'32vw', maxWidth:380, maxHeight:380, borderRadius:'9999px', background:'radial-gradient(circle, rgba(158,128,255,0.16) 0%, rgba(165,136,255,0.07) 46%, rgba(165,136,255,0) 76%)' }} />
        <div style={{
          position: 'absolute',
          left: '68%',
          top: '54%',
          transform: 'translate(-50%, -50%)',
          width: 'min(62vw, 680px)',
          height: 'min(62vw, 680px)',
          borderRadius: '9999px',
          background: 'radial-gradient(circle, rgba(142,117,255,0.15) 0%, rgba(160,137,255,0.07) 42%, rgba(160,137,255,0) 74%)',
        }} />
        <div style={{position:'absolute',inset:0,opacity:0.022,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize:'200px 200px'}} />
        {/* Full-page glowing dots scattered across entire section */}
        {heroInView && ([
          ['5%','8%',3,0],['12%','22%',2,0.6],['22%','6%',2.5,1.2],['3%','45%',2,0.3],
          ['8%','62%',3,1.8],['15%','78%',2,0.9],['2%','88%',2.5,2.2],['18%','92%',2,0.4],
          ['28%','4%',3,1.5],['35%','88%',2.5,0.7],['42%','96%',2,2.0],
          ['72%','5%',3,0.5],['80%','18%',2,1.3],['92%','8%',2.5,0.2],['98%','28%',2,1.7],
          ['88%','42%',3,0.8],['95%','58%',2,2.4],['82%','72%',2.5,0.1],['90%','88%',2,1.1],
          ['76%','96%',3,1.9],['62%','92%',2,0.6],['55%','98%',2.5,1.4],
          ['48%','3%',2,0.9],['58%','8%',3,2.1],['65%','2%',2,0.4],
          ['25%','50%',2.5,1.6],['38%','38%',2,0.3],['10%','35%',3,1.0],
          ['85%','55%',2.5,1.5],['70%','45%',2,0.8],
        ] as [string,string,number,number][]).map(([x,y,s,d],i) => (
          <motion.div key={`gd-${i}`}
            className="absolute rounded-full"
            style={{ left:x, top:y, width:s, height:s,
              background:'radial-gradient(circle, rgba(200,180,255,0.9) 0%, rgba(180,155,255,0.4) 50%, transparent 70%)' }}
            animate={{ opacity:[0.15,0.55,0.15], scale:[0.8,1.2,0.8] }}
            transition={{ duration:6+i%5, delay:d, repeat:Infinity, ease:'easeInOut' }}
          />
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-68px)] max-w-350 flex-col px-6 md:flex-row md:px-12 lg:px-20">

        {/* ── LEFT ── */}
        <motion.div style={{x:textX,y:textY}}
          className="flex flex-col justify-center py-24 md:w-[46%] md:py-0 md:pr-8 lg:pr-14">

          <motion.p {...fadeUp(0.1)}
            className="mb-7 flex items-center gap-3 text-[10.5px] font-semibold tracking-[0.22em] text-muted uppercase">
            <span className="h-px w-7 bg-violet-400/70" />
            Hi, I&apos;m Aahana
          </motion.p>

          <motion.p {...fadeUp(0.22)} className="mb-10 text-[13px] font-light tracking-[0.06em] text-muted/65">
            Associate Product Manager
          </motion.p>

          {/* HEADLINE */}
          <motion.h1 {...fadeUp(0.36)} className="font-serif tracking-tightest text-ink">
            {/* Row 1: I [verb] */}
            <span className="block font-semibold leading-[0.96] mb-1"
              style={{fontSize:'clamp(3.2rem,5.5vw,4.8rem)',letterSpacing:'-0.04em'}}>
              <span style={{position:'relative', bottom:'0.17em'}}>I</span>&nbsp;<span className="inline-block overflow-hidden align-bottom" style={{height:'1.1em'}}>
                <AnimatePresence mode="wait">
                  <motion.span key={verbIdx}
                    initial={{y:'100%',opacity:0}} animate={{y:0,opacity:1}} exit={{y:'-100%',opacity:0}}
                    transition={{duration:0.44,ease:EASE}} className="block">
                    {VERBS[verbIdx]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>

            {/* Row 2: AI products in */}
            <span className="block font-semibold leading-[0.96] mb-1"
              style={{fontSize:'clamp(3.2rem,5.5vw,4.8rem)',letterSpacing:'-0.04em'}}>
              <span style={{color:'#7c5ce1'}}>AI</span>
              {' '}products in
            </span>

            {/* Row 3: Gurgaon. */}
            <span className="block font-semibold leading-[0.96]"
              style={{fontSize:'clamp(3.2rem,5.5vw,4.8rem)',letterSpacing:'-0.04em'}}>
              Gurgaon<span className="text-ink">.</span>
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.52)}
            className="mt-10 max-w-97.5 text-[13.5px] font-light leading-[1.88] text-muted">
            From idea to launch, I work across product, design, and technology
            to build thoughtful solutions that solve real problems and scale with users.
          </motion.p>

          {/* Buttons */}
          <motion.div {...fadeUp(0.66)} className="mt-10 flex flex-wrap gap-3">
            <motion.a
              href="/work/ai-video"
              whileHover={{scale:1.025,boxShadow:'0 10px 38px rgba(0,0,0,0.22)'}}
              whileTap={{scale:0.97}} transition={{duration:0.15}}
              className="group inline-flex items-center gap-2.5 rounded-full bg-ink text-white text-[12.5px] font-medium px-6 py-3.5 shadow-[0_4px_22px_rgba(0,0,0,0.16)] transition-shadow">
              View Recent Shipped Product
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <path d="M2.5 10.5L10.5 2.5M10.5 2.5H5M10.5 2.5V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
            <motion.a
              href="#thinking"
              whileHover={{backgroundColor:'rgba(0,0,0,0.033)',borderColor:'rgba(0,0,0,0.22)'}}
              whileTap={{scale:0.97}} transition={{duration:0.15}}
              className="group inline-flex items-center gap-2 rounded-full border border-stone-200/75 bg-transparent text-ink/62 text-[12.5px] font-medium px-6 py-3.5 hover:text-ink transition-colors">
              Explore Product Thinking
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                className="transition-transform duration-200 group-hover:translate-x-1">
                <path d="M1 6H11M11 6L7 2M11 6L7 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div {...fadeIn(0.84)} className="mt-14 flex items-start gap-10 border-t border-stone-200/60 pt-8">
            {[
              {v:'12+',l:'Products shipped'},
              {v:'3',  l:'Industry domains'},
              {v:'0→1',l:'Zero to launch'  },
            ].map(({v,l}) => (
              <div key={v} className="flex flex-col gap-1">
                <span className="font-serif text-[2rem] font-medium tracking-tightest text-ink leading-none">{v}</span>
                <div className="mt-1.5 mb-1 w-6 h-px bg-violet-400/55" />
                <span className="text-[11px] font-light text-muted/70">{l}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── RIGHT ── */}
        <motion.div
          initial={{opacity:0}} animate={{opacity:1}}
          transition={{duration:1.1,delay:0.25,ease:'easeOut'}}
          style={{x:canvasX,y:canvasY}}
          className="relative flex items-stretch md:w-[54%]">

          <div ref={portraitRef} onMouseMove={onPortraitMove}
            onMouseEnter={() => setPortrait(true)} onMouseLeave={onPortraitLeave}
            className="relative w-full" style={{minHeight:'calc(100vh - 68px)'}}>

            {/* Centered portrait + intelligence field */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[-52%] z-10">
              <div aria-hidden className="absolute pointer-events-none z-10" style={{ top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:0, height:0 }}>
                <div style={{ position:'absolute', top:0, left:0, transform:'translate(-50%,-50%)', width:'clamp(680px,84vh,920px)', height:'clamp(680px,84vh,920px)' }}>
                  {heroInView && (
                    <IntelligenceField
                      glowX={glowLayerX}
                      glowY={glowLayerY}
                      arcX={arcLayerX}
                      arcY={arcLayerY}
                      netX={netLayerX}
                      netY={netLayerY}
                      particleX={particleLayerX}
                      particleY={particleLayerY}
                    />
                  )}
                </div>
              </div>

              {/* Portrait illumination */}
              <motion.div
                aria-hidden
                className="absolute pointer-events-none"
                animate={{ opacity: portraitHovered ? 0.95 : 0.72, scale: portraitHovered ? 1.04 : 1 }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
                style={{
                  top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                  width:'112%',height:'112%',
                  background:'radial-gradient(ellipse 43% 41% at 50% 52%, rgba(136,112,255,0.42) 0%, rgba(159,134,255,0.24) 40%, transparent 72%)',
                }}
              />
              {/* Ring border — perfect circle, pulsing star glow (box-shadow animation is repaint-heavy, so only run it in view) */}
              <motion.div aria-hidden className="absolute pointer-events-none"
                animate={heroInView ? { boxShadow:[
                  '0 0 0 1.5px rgba(238,228,255,0.92), 0 0 16px rgba(255,255,255,0.65), 0 0 52px rgba(212,188,255,0.62), 0 0 105px rgba(185,155,255,0.38), 0 0 190px rgba(162,132,255,0.18)',
                  '0 0 0 1.5px rgba(255,250,255,0.98), 0 0 26px rgba(255,255,255,0.82), 0 0 72px rgba(225,200,255,0.72), 0 0 140px rgba(200,168,255,0.48), 0 0 240px rgba(175,142,255,0.26)',
                  '0 0 0 1.5px rgba(238,228,255,0.92), 0 0 16px rgba(255,255,255,0.65), 0 0 52px rgba(212,188,255,0.62), 0 0 105px rgba(185,155,255,0.38), 0 0 190px rgba(162,132,255,0.18)',
                ]} : {}}
                transition={{ duration:8, repeat:Infinity, ease:'easeInOut' }}
                style={{ top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                  width:'clamp(480px,70vh,680px)', height:'clamp(480px,70vh,680px)',
                  borderRadius:'999px', opacity:1,
                  boxShadow:'0 0 0 1.5px rgba(238,228,255,0.92), 0 0 16px rgba(255,255,255,0.65), 0 0 52px rgba(212,188,255,0.62), 0 0 105px rgba(185,155,255,0.38), 0 0 190px rgba(162,132,255,0.18)' }}
              />
              {/* White-to-purple inner glow — subtle lavender fill */}
              <div aria-hidden className="absolute pointer-events-none" style={{
                top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                width:'clamp(466px,68vh,660px)', height:'clamp(466px,68vh,660px)',
                borderRadius:'999px',
                background:'radial-gradient(circle at 50% 44%, rgba(215,205,255,0.40) 0%, rgba(195,178,255,0.18) 38%, rgba(170,150,255,0.06) 62%, transparent 80%)',
                opacity:1,
              }} />
              {/* Outer halo bloom */}
              <div aria-hidden className="absolute pointer-events-none" style={{
                top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                width:'clamp(570px,84vh,800px)', height:'clamp(570px,84vh,800px)',
                borderRadius:'999px',
                background:'radial-gradient(circle at 50% 50%, rgba(200,180,255,0.22) 0%, rgba(175,150,255,0.10) 50%, rgba(175,150,255,0) 75%)',
                filter:'blur(18px)',
                opacity:1,
              }} />

              {/* Portrait — no box, no rounding, blends into bg */}
              <motion.div
                animate={{scale: portraitHovered ? 1.02 : 1}}
                transition={{duration:0.65,ease:EASE}}
                className="relative z-20"
                initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}}
                viewport={{once:true}}
                //@ts-ignore
                transition={{duration:0.9,delay:0.42,ease:'easeOut'}}
                style={{
                  width:'clamp(600px,72vw,820px)',
                  height:'clamp(700px,90vh,980px)',
                  rotateX:tiltX, rotateY:tiltY,
                }}
              >
                <Image
                  src="/portrait.png"
                  alt="Aahana — Associate Product Manager"
                  fill
                  className="object-contain object-top"
                  style={{
                    WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 84%, rgba(0,0,0,0) 100%)',
                  }}
                  priority
                />
              </motion.div>
            </div>

            {/* Floating pills */}
            <motion.div style={{x:popupX,y:popupY}} className="absolute inset-0 z-20 pointer-events-none">
              {KEYWORDS.map(({label,style,delay,floatY,rotate,floatX,pillBg,strokeClass,icon,desc,featured}) => (
                <KeywordPill key={label} label={label} delay={delay} style={style}
                  floatY={floatY} rotate={rotate} floatX={floatX}
                  pillBg={pillBg} strokeClass={strokeClass} icon={icon}
                  desc={desc} featured={featured} />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        {...fadeIn(1.8)}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
      >
        <svg width="20" height="30" viewBox="0 0 22 34" fill="none" className="text-slate-500/65">
          <rect x="1.5" y="1.5" width="19" height="31" rx="9.5" stroke="currentColor" strokeWidth="1.2" />
          <motion.rect
            x="10"
            y="7"
            width="2"
            height="6"
            rx="1"
            fill="#9ca3af"
            animate={{ y: [7, 14, 7], opacity: [0.55, 0.15, 0.55] }}
            transition={{ duration: 2.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
        <span className="text-[8.5px] font-semibold tracking-[0.28em] text-slate-500/70 uppercase">
          Scroll to Explore
        </span>
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-violet-500"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, 2, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="w-px h-6 bg-linear-to-b from-violet-300/65 to-transparent" />
      </motion.div>
    </section>
  )
}
