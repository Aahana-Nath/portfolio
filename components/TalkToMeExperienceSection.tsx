'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ────────────────────────────────────────────────────────────────────────
// Content — one six-step journey per persona, grounded in the FIND /
// CONNECT / GROW moments and the therapist jobs-to-be-done covered earlier
// in the case study. Edit copy/screens here only.
// ────────────────────────────────────────────────────────────────────────
type ScreenKey = 'understand' | 'discover' | 'choose' | 'book' | 'connect' | 'continue' | 'setup' | 'requests'
type IconName = 'profile' | 'star' | 'calendar' | 'search' | 'lock' | 'chart' | 'message' | 'check' | 'graduation'
type Feature = { icon: IconName; title: string; description: string }
type Step = { number: string; title: string; subheading: string; description: string; features: Feature[]; screen: ScreenKey }

const USER_STEPS: Step[] = [
  {
    number: '01', title: 'Understand', screen: 'understand',
    subheading: 'Identify your needs and set preferences.',
    description: 'Start by sharing what\u2019s on your mind and what kind of support you\u2019re looking for, so every match actually fits.',
    features: [
      { icon: 'check', title: 'Share your concerns', description: 'Anxiety, stress, relationships and more.' },
      { icon: 'calendar', title: 'Set preferences', description: 'Session type, availability and budget.' },
      { icon: 'lock', title: 'Stay private', description: 'Your answers are confidential by default.' },
    ],
  },
  {
    number: '02', title: 'Discover', screen: 'discover',
    subheading: 'Explore therapists that match you.',
    description: 'Browse a curated list of therapists filtered to your needs, each with the context you need to feel confident.',
    features: [
      { icon: 'search', title: 'Smart matching', description: 'Ranked by fit, not just availability.' },
      { icon: 'profile', title: 'Specialities at a glance', description: 'See focus areas and approach.' },
      { icon: 'star', title: 'Compare easily', description: 'Shortlist a few before deciding.' },
    ],
  },
  {
    number: '03', title: 'Explore Profile', screen: 'choose',
    subheading: 'Understand who you’re choosing.',
    description: 'Users can review a therapist’s experience, specialities and approach before making a decision. This helps them find someone who feels right for their needs.',
    features: [
      { icon: 'graduation', title: 'Experience & specialty', description: 'Learn about their background, areas of focus and approach.' },
      { icon: 'star', title: 'Ratings & reviews', description: 'See real experiences from other clients.' },
      { icon: 'calendar', title: 'Availability', description: 'Check session types, timings and compatibility.' },
    ],
  },
  {
    number: '04', title: 'Book', screen: 'book',
    subheading: 'Pick a convenient time.',
    description: 'Book a session in a few taps, with scheduling that fits around your week, not the other way around.',
    features: [
      { icon: 'calendar', title: 'Flexible scheduling', description: 'Pick a date, time and session type.' },
      { icon: 'check', title: 'Easy rescheduling', description: 'Change plans without the back-and-forth.' },
      { icon: 'message', title: 'Instant confirmation', description: 'Know your session is locked in.' },
    ],
  },
  {
    number: '05', title: 'Connect', screen: 'connect',
    subheading: 'Start your session via chat or video.',
    description: 'Meet securely from wherever you are, in a space designed to feel calm, private and easy to focus in.',
    features: [
      { icon: 'lock', title: 'Secure sessions', description: 'Private video and chat, end to end.' },
      { icon: 'message', title: 'Stay in touch', description: 'Message your therapist between sessions.' },
      { icon: 'check', title: 'Low-friction start', description: 'Join with a single tap, no setup.' },
    ],
  },
  {
    number: '06', title: 'Continue', screen: 'continue',
    subheading: 'Track your progress and keep going.',
    description: 'See how far you\u2019ve come, reflect between sessions and keep building momentum on your own terms.',
    features: [
      { icon: 'chart', title: 'Progress tracking', description: 'Visualise your journey over time.' },
      { icon: 'message', title: 'Reflect & journal', description: 'Capture thoughts after each session.' },
      { icon: 'star', title: 'Ongoing support', description: 'Stay supported beyond a single session.' },
    ],
  },
]

const THERAPIST_STEPS: Step[] = [
  {
    number: '01', title: 'Set Up', screen: 'setup',
    subheading: 'Create your profile and set your approach.',
    description: 'Showcase your experience, specialities and style so the right clients can recognise a good fit immediately.',
    features: [
      { icon: 'profile', title: 'Build your profile', description: 'Experience, specialities and approach.' },
      { icon: 'calendar', title: 'Set your terms', description: 'Session types, pricing and availability.' },
      { icon: 'check', title: 'Verify credentials', description: 'Build trust with a verified badge.' },
    ],
  },
  {
    number: '02', title: 'Get Discovered', screen: 'discover',
    subheading: 'Appear in matches for the right clients.',
    description: 'Get surfaced to people whose needs genuinely match what you offer, instead of competing in a generic directory.',
    features: [
      { icon: 'search', title: 'Smart visibility', description: 'Matched by specialty and approach.' },
      { icon: 'chart', title: 'Reach more people', description: 'Grow your practice organically.' },
      { icon: 'lock', title: 'Stay in control', description: 'Choose who can reach out to you.' },
    ],
  },
  {
    number: '03', title: 'Review Requests', screen: 'requests',
    subheading: 'See who wants to connect and why.',
    description: 'Review new client requests with context, so you can accept the sessions that are the right fit for your practice.',
    features: [
      { icon: 'message', title: 'Client context', description: 'See concerns and preferences upfront.' },
      { icon: 'check', title: 'Accept or decline', description: 'Stay in control of your caseload.' },
      { icon: 'profile', title: 'Quick replies', description: 'Respond without leaving the app.' },
    ],
  },
  {
    number: '04', title: 'Schedule', screen: 'book',
    subheading: 'Manage your availability and bookings.',
    description: 'Set your hours once and let clients book directly, with everything synced to a single calendar.',
    features: [
      { icon: 'calendar', title: 'Flexible availability', description: 'Set hours that work for you.' },
      { icon: 'check', title: 'Automatic sync', description: 'Avoid double-bookings entirely.' },
      { icon: 'message', title: 'Easy rescheduling', description: 'Handle changes without friction.' },
    ],
  },
  {
    number: '05', title: 'Session', screen: 'connect',
    subheading: 'Connect with clients via chat or video.',
    description: 'Run sessions in a secure, distraction-free space built specifically for therapeutic conversations.',
    features: [
      { icon: 'lock', title: 'Secure by design', description: 'Private, encrypted video and chat.' },
      { icon: 'message', title: 'Session notes', description: 'Keep context between appointments.' },
      { icon: 'check', title: 'Dependable connection', description: 'Built for uninterrupted sessions.' },
    ],
  },
  {
    number: '06', title: 'Track', screen: 'continue',
    subheading: 'Monitor client progress and manage payments.',
    description: 'Keep a clear view of each client\u2019s journey and handle payments without leaving the platform.',
    features: [
      { icon: 'chart', title: 'Progress overview', description: 'Track outcomes across your caseload.' },
      { icon: 'star', title: 'Simple payments', description: 'Handle billing securely in-app.' },
      { icon: 'profile', title: 'Build your reputation', description: 'Grow through reviews and outcomes.' },
    ],
  },
]

const THERAPISTS = [
  { name: 'Dr. Neha Kapoor', role: 'Clinical Psychologist', exp: '7+ years experience', rating: '4.8', count: '120+ reviews', tags: ['Anxiety', 'Self Esteem', 'Relationships'] },
  { name: 'Dr. Rohan Mehta', role: 'Counselling Psychologist', exp: '5+ years experience', rating: '4.7', count: '98+ reviews', tags: ['Stress', 'Career', 'Life Transitions'] },
  { name: 'Dr. Aditi Sharma', role: 'Clinical Psychologist', exp: '6+ years experience', rating: '4.8', count: '84+ reviews', tags: ['Depression', 'Self Esteem', 'Anxiety'] },
]

// ── Icons ─────────────────────────────────────────────────────────────────
function Icon({ name }: { name: IconName }) {
  const c = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'none' } as const
  switch (name) {
    case 'profile':
      return <svg {...c}><circle cx="8" cy="5.4" r="2.6" stroke="currentColor" strokeWidth="1.3" /><path d="M2.8 13.5c.7-3 2.6-4.6 5.2-4.6s4.5 1.6 5.2 4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'star':
      return <svg {...c}><path d="M8 1.6l1.9 4 4.4.5-3.3 3.1.9 4.4L8 11.5l-3.9 2.1.9-4.4-3.3-3.1 4.4-.5L8 1.6Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /></svg>
    case 'calendar':
      return <svg {...c}><rect x="2" y="3.2" width="12" height="10.6" rx="1.4" stroke="currentColor" strokeWidth="1.3" /><path d="M2 6.6h12M5.3 2v2.4M10.7 2v2.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'search':
      return <svg {...c}><circle cx="7" cy="7" r="4.4" stroke="currentColor" strokeWidth="1.3" /><path d="M10.2 10.2 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
    case 'lock':
      return <svg {...c}><rect x="3" y="7" width="10" height="7" rx="1.4" stroke="currentColor" strokeWidth="1.3" /><path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" /></svg>
    case 'chart':
      return <svg {...c}><path d="M2 14V2M2 14h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><rect x="4.2" y="9" width="2.2" height="3.6" rx="0.5" fill="currentColor" /><rect x="7.6" y="6" width="2.2" height="6.6" rx="0.5" fill="currentColor" /><rect x="11" y="7.8" width="2.2" height="4.8" rx="0.5" fill="currentColor" /></svg>
    case 'message':
      return <svg {...c}><path d="M2 4.2c0-1 .8-1.8 1.8-1.8h8.4c1 0 1.8.8 1.8 1.8v5.6c0 1-.8 1.8-1.8 1.8H7l-3 2.4v-2.4h-.2c-1 0-1.8-.8-1.8-1.8V4.2Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
    case 'check':
      return <svg {...c}><circle cx="8" cy="8" r="5.8" stroke="currentColor" strokeWidth="1.3" /><path d="M5.4 8.2 7.2 10l3.4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>
    case 'graduation':
      return <svg {...c}><path d="M8 2.2 1.6 5.4 8 8.6l6.4-3.2L8 2.2Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M4.3 7.1v3.1c0 1 1.7 1.9 3.7 1.9s3.7-.9 3.7-1.9V7.1" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" /><path d="M14 5.6v4" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" /></svg>
  }
}
function IconStarFilled() {
  return <svg width="10" height="10" viewBox="0 0 12 12" fill="#f59e0b"><path d="M6 .6l1.5 3.3 3.5.4-2.6 2.5.7 3.6L6 8.9 2.9 10.4l.7-3.6L1 4.3l3.5-.4L6 .6Z" /></svg>
}
function IconArrowRightSmall() {
  return <svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M2.5 10.5 10.5 2.5M10.5 2.5H4.5M10.5 2.5V8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
}
function IconChevronCircle({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: dir === 'right' ? 'rotate(180deg)' : undefined }}>
      <path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function IconPersonPill() {
  return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.4" r="2.6" stroke="currentColor" strokeWidth="1.3" /><path d="M2.8 13.5c.7-3 2.6-4.6 5.2-4.6s4.5 1.6 5.2 4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
}
function IconTherapistPill() {
  return <svg width="15" height="15" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="6.5" r="2.6" stroke="currentColor" strokeWidth="1.3" /><path d="M2.5 16c.6-3 2.4-4.6 4.5-4.6s3.9 1.6 4.5 4.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /><circle cx="14" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" /><path d="M12.7 11.8c1.8.2 3.3 1.5 3.8 3.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
}

// ── Phone chrome shared by every step screen ─────────────────────────────
function PhoneChrome({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="w-full h-full bg-white flex flex-col text-ink">
      <div className="flex items-center justify-between px-4 pt-2.5 pb-1 text-[9px] font-medium text-ink/70">
        <span>9:41</span>
        <span>•••</span>
      </div>
      <div className="px-4 pt-1 pb-2.5 flex items-center gap-2 border-b border-stone-100">
        <span className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none"><path d="M2 4.5C2 3.4 2.9 2.5 4 2.5H16C17.1 2.5 18 3.4 18 4.5V12C18 13.1 17.1 14 16 14H8L4 17.5V14H4C2.9 14 2 13.1 2 12V4.5Z" fill="#7c3aed" /></svg>
        </span>
        <p className="text-[12px] font-semibold flex-1 truncate">{title}</p>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
    </div>
  )
}

function TherapistRow({ name, role, exp, rating, count, tags }: (typeof THERAPISTS)[number]) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-stone-100 bg-white px-2.5 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
      <span className="w-9 h-9 rounded-full bg-violet-100 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[10.5px] font-semibold truncate">{name}</p>
        <p className="text-[8px] text-muted truncate">{role} · {exp}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-0.5"><IconStarFilled /><span className="text-[8px] text-muted">{rating} ({count})</span></span>
        </div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {tags.slice(0, 2).map(t => <span key={t} className="text-[7px] px-1.5 py-0.5 rounded-full bg-stone-100 text-muted">{t}</span>)}
        </div>
      </div>
      <span className="w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center shrink-0"><IconArrowRightSmall /></span>
    </div>
  )
}

// ── Step-specific screen bodies ──────────────────────────────────────────
function StepScreen({ screen }: { screen: ScreenKey }) {
  switch (screen) {
    case 'understand':
      return (
        <PhoneChrome title="What's on your mind?">
          <div className="px-4 pt-3 flex flex-col gap-3 flex-1">
            <p className="text-[9.5px] font-semibold text-muted uppercase tracking-wide">Concerns</p>
            <div className="flex flex-wrap gap-1.5">
              {['Anxiety', 'Depression', 'Stress', 'Self Esteem', 'Relationships'].map((c, i) => (
                <span key={c} className={`text-[9.5px] px-2.5 py-1.5 rounded-full border ${i < 2 ? 'bg-violet-600 text-white border-violet-600' : 'border-stone-200 text-muted'}`}>{c}</span>
              ))}
            </div>
            <p className="text-[9.5px] font-semibold text-muted uppercase tracking-wide mt-1">Session type</p>
            <div className="flex gap-1.5">
              <span className="flex-1 text-center rounded-lg py-2 text-[9.5px] bg-violet-600 text-white font-medium">Video Call</span>
              <span className="flex-1 text-center rounded-lg py-2 text-[9.5px] border border-stone-200 text-muted">In Person</span>
            </div>
            <div className="mt-auto pb-4">
              <div className="rounded-lg bg-ink text-white text-[10.5px] font-medium py-2.5 flex items-center justify-center gap-1.5">Continue <IconArrowRightSmall /></div>
            </div>
          </div>
        </PhoneChrome>
      )
    case 'discover':
      return (
        <PhoneChrome title="Talk To ME">
          <div className="px-4 pt-3 flex flex-col gap-2.5 flex-1">
            <div className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-2">
              <span className="text-muted"><Icon name="search" /></span>
              <span className="text-[9.5px] text-muted">Search therapists, concerns…</span>
            </div>
            <div className="flex gap-1.5">
              {['Anxiety', 'Depression', 'Relationships'].map((t, i) => (
                <span key={t} className={`text-[8.5px] px-2 py-1 rounded-full whitespace-nowrap ${i === 0 ? 'bg-violet-600 text-white' : 'bg-stone-100 text-muted'}`}>{t}</span>
              ))}
            </div>
            <div className="flex flex-col gap-2 mt-1">
              {THERAPISTS.slice(0, 2).map(t => <TherapistRow key={t.name} {...t} />)}
            </div>
          </div>
        </PhoneChrome>
      )
    case 'choose':
      return (
        <PhoneChrome title="Talk To ME">
          <div className="px-4 pt-3 flex flex-col gap-2.5 flex-1">
            <p className="text-[9.5px] font-semibold text-muted uppercase tracking-wide">Top matches for you</p>
            <div className="flex flex-col gap-2">
              {THERAPISTS.map(t => <TherapistRow key={t.name} {...t} />)}
            </div>
          </div>
        </PhoneChrome>
      )
    case 'book': {
      const days = [{ d: 'Mon', n: 10 }, { d: 'Tue', n: 11 }, { d: 'Wed', n: 12, active: true }, { d: 'Thu', n: 13 }, { d: 'Fri', n: 14 }]
      const times = ['10:00 AM', '11:00 AM', '12:00 PM', '4:00 PM', '5:00 PM', '6:00 PM']
      return (
        <PhoneChrome title="Book a Session">
          <div className="px-4 pt-2 flex flex-col gap-2.5 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-[9.5px] font-semibold">Select a date</p>
              <span className="text-[8.5px] text-muted">June 2024</span>
            </div>
            <div className="flex gap-1.5">
              {days.map(d => (
                <div key={d.d} className={`flex-1 flex flex-col items-center gap-0.5 rounded-lg py-1.5 ${d.active ? 'bg-violet-600 text-white' : 'bg-stone-50 text-ink'}`}>
                  <span className="text-[7px] opacity-70">{d.d}</span>
                  <span className="text-[10px] font-semibold">{d.n}</span>
                </div>
              ))}
            </div>
            <p className="text-[9.5px] font-semibold mt-1">Select a time</p>
            <div className="grid grid-cols-3 gap-1.5">
              {times.map(t => (
                <span key={t} className={`text-[8px] text-center rounded-lg py-1.5 border ${t === '11:00 AM' ? 'bg-violet-50 border-violet-300 text-violet-700 font-semibold' : 'border-stone-100 text-muted'}`}>{t}</span>
              ))}
            </div>
            <div className="mt-auto pb-4">
              <div className="rounded-lg bg-violet-600 text-white text-[10.5px] font-medium py-2.5 flex items-center justify-center gap-1.5">Confirm <IconArrowRightSmall /></div>
            </div>
          </div>
        </PhoneChrome>
      )
    }
    case 'connect':
      return (
        <PhoneChrome title="Session with Dr. Kapoor">
          <div className="flex-1 flex flex-col px-3 pt-2 pb-3">
            <div className="flex-1 rounded-xl bg-violet-100 relative overflow-hidden flex items-center justify-center">
              <span className="w-14 h-14 rounded-full bg-violet-300" />
              <span className="absolute bottom-2 right-2 w-9 h-12 rounded-lg bg-ink/80" />
            </div>
            <div className="flex items-center justify-center gap-3 pt-3">
              <span className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-ink/60"><Icon name="message" /></span>
              <span className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M3 11c3-4 7-4 10 0" stroke="white" strokeWidth="1.6" strokeLinecap="round" /></svg>
              </span>
              <span className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-ink/60"><Icon name="lock" /></span>
            </div>
          </div>
        </PhoneChrome>
      )
    case 'continue':
      return (
        <PhoneChrome title="Your Progress">
          <div className="px-4 pt-3 flex flex-col gap-3 flex-1">
            <p className="text-[9.5px] font-semibold text-muted uppercase tracking-wide">This month</p>
            <div className="flex items-end gap-2 h-20">
              {[40, 65, 50, 80, 70, 90].map((h, i) => (
                <span key={i} className="flex-1 rounded-t-md bg-violet-400" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="rounded-xl bg-[#f6ede0] border border-[#eaddc7] px-3 py-2.5 mt-1">
              <p className="font-serif italic text-[10.5px] text-ink leading-snug">&ldquo;Feeling more in control this week.&rdquo;</p>
            </div>
          </div>
        </PhoneChrome>
      )
    case 'setup':
      return (
        <PhoneChrome title="Your Profile">
          <div className="px-4 pt-3 flex flex-col gap-3 flex-1">
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-full bg-violet-100 shrink-0" />
              <div className="min-w-0">
                <p className="text-[10.5px] font-semibold truncate">Dr. Abhay Sharma</p>
                <p className="text-[8.5px] text-muted truncate">Clinical Psychologist</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['Anxiety', 'Relationships', 'Stress'].map(s => (
                <span key={s} className="text-[8.5px] px-2 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700">{s}</span>
              ))}
            </div>
            <div className="rounded-lg border border-stone-200 px-3 py-2 text-[9px] text-muted">7+ years experience · Video &amp; in person</div>
            <div className="mt-auto pb-4">
              <div className="rounded-lg bg-ink text-white text-[10.5px] font-medium py-2.5 flex items-center justify-center">Save Profile</div>
            </div>
          </div>
        </PhoneChrome>
      )
    case 'requests':
      return (
        <PhoneChrome title="New Requests">
          <div className="px-4 pt-3 flex flex-col gap-2.5 flex-1">
            {[{ name: 'Anjali M.', note: 'Looking for support with anxiety' }, { name: 'Karan P.', note: 'Interested in relationship counselling' }].map(r => (
              <div key={r.name} className="rounded-xl border border-stone-100 px-3 py-2.5">
                <p className="text-[10px] font-semibold">{r.name}</p>
                <p className="text-[8.5px] text-muted mt-0.5">{r.note}</p>
                <div className="flex gap-1.5 mt-2">
                  <span className="flex-1 text-center rounded-md py-1.5 text-[8.5px] bg-violet-600 text-white">Accept</span>
                  <span className="flex-1 text-center rounded-md py-1.5 text-[8.5px] border border-stone-200 text-muted">Decline</span>
                </div>
              </div>
            ))}
          </div>
        </PhoneChrome>
      )
  }
}

// ── Vertical stepper (desktop left column) ───────────────────────────────
function Stepper({ steps, active, onSelect }: { steps: Step[]; active: number; onSelect: (i: number) => void }) {
  return (
    <ol className="relative hidden lg:flex flex-col gap-3 pl-1">
      <span className="absolute left-[6px] top-1.5 bottom-1.5 w-px bg-stone-200" aria-hidden />
      {steps.map((s, i) => (
        <li key={s.number} className="relative pl-6">
          <button
            type="button"
            onClick={() => onSelect(i)}
            className="text-left group"
            aria-current={active === i}
          >
            <span
              className={`absolute left-0 top-0.5 w-3 h-3 rounded-full border-2 transition-colors ${active === i ? 'border-violet-600 bg-violet-600' : 'border-stone-300 bg-white group-hover:border-violet-400'}`}
            >
              {active === i && <span className="absolute inset-[2px] rounded-full bg-white" />}
            </span>
            <p className={`text-[11px] font-medium mb-0.5 ${active === i ? 'text-violet-600' : 'text-muted/70'}`}>{s.number}</p>
            <p className={`font-serif text-[1.05rem] leading-tight ${active === i ? 'text-ink font-semibold' : 'text-ink/70'}`}>{s.title}</p>
            <p className="text-[12.5px] text-muted leading-snug mt-0.5 max-w-[170px]">{s.subheading}</p>
          </button>
        </li>
      ))}
    </ol>
  )
}

// ── Bottom pagination: prev/next arrows flanking a "03 / 06" counter ─────
function Pagination({ steps, active, onSelect }: { steps: Step[]; active: number; onSelect: (i: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 mt-5">
      <button
        type="button"
        onClick={() => onSelect(Math.max(0, active - 1))}
        disabled={active === 0}
        className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-ink/70 disabled:opacity-30 hover:border-violet-400 hover:text-violet-600 transition-colors"
        aria-label="Previous step"
      >
        <IconChevronCircle dir="left" />
      </button>

      <div className="flex items-center gap-2.5">
        <span className="w-5 h-px bg-stone-300" />
        <span className="text-[11px] tracking-wide text-muted">
          <span className="font-semibold text-ink">{String(active + 1).padStart(2, '0')}</span> / {String(steps.length).padStart(2, '0')}
        </span>
        <span className="w-5 h-px bg-stone-300" />
      </div>

      <button
        type="button"
        onClick={() => onSelect(Math.min(steps.length - 1, active + 1))}
        disabled={active === steps.length - 1}
        className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-ink/70 disabled:opacity-30 hover:border-violet-400 hover:text-violet-600 transition-colors"
        aria-label="Next step"
      >
        <IconChevronCircle dir="right" />
      </button>
    </div>
  )
}

// ── Back phone: a second, receded mockup for visual depth ────────────────
function BackPhone({ persona }: { persona: 'user' | 'therapist' }) {
  const screen: ScreenKey = persona === 'user' ? 'discover' : 'requests'
  return (
    <div aria-hidden className="absolute hidden md:block" style={{ width: 196, transform: 'translate(-86px, 20px) rotate(-8deg)', opacity: 0.92 }}>
      <div className="relative overflow-hidden" style={{ borderRadius: 22, border: '5px solid #1c1917', background: '#1c1917', boxShadow: '0 20px 50px rgba(0,0,0,0.16)' }}>
        <div className="relative overflow-hidden bg-white" style={{ borderRadius: 17, aspectRatio: '9 / 19.2' }}>
          <StepScreen screen={screen} />
        </div>
      </div>
    </div>
  )
}

export default function TalkToMeExperienceSection() {
  const [persona, setPersona] = useState<'user' | 'therapist'>('user')
  const [active, setActive] = useState(0)
  const steps = persona === 'user' ? USER_STEPS : THERAPIST_STEPS
  const step = steps[active]

  const selectPersona = (p: 'user' | 'therapist') => {
    setPersona(p)
    setActive(0)
  }

  return (
    <section className="relative bg-[#f3efe8] py-9 md:py-12 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }} />
      <div aria-hidden className="pointer-events-none absolute top-1/3 right-0 w-[520px] h-[520px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 72%)' }} />

      <div className="relative z-10 w-full px-[5%]">
        <div className="text-center max-w-xl mx-auto mb-5">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-2">06 — The Experience</p>
          <h2 className="font-serif text-[2rem] md:text-[2.4rem] font-medium leading-[1.08] tracking-tightest text-ink mb-2.5">
            Two journeys. One <span className="italic" style={{ color: '#7c3aed' }}>connected</span> experience.
          </h2>
          <p className="font-sans text-[13px] text-muted leading-relaxed">
            Talk To ME is designed around both sides of the relationship — helping people find and connect with the right therapist while giving therapists a simple way to manage their practice.
          </p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-white p-1 shadow-[0_4px_16px_rgba(0,0,0,0.05)]">
            <button
              type="button"
              onClick={() => selectPersona('user')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${persona === 'user' ? 'bg-violet-600 text-white' : 'text-muted hover:text-ink'}`}
            >
              <IconPersonPill />
              <span className="flex flex-col items-start leading-tight">
                User
                <span className={`text-[8.5px] font-normal ${persona === 'user' ? 'text-white/75' : 'text-muted/60'}`}>Find support &amp; heal</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => selectPersona('therapist')}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors ${persona === 'therapist' ? 'bg-violet-600 text-white' : 'text-muted hover:text-ink'}`}
            >
              <IconTherapistPill />
              <span className="flex flex-col items-start leading-tight">
                Therapist
                <span className={`text-[8.5px] font-normal ${persona === 'therapist' ? 'text-white/75' : 'text-muted/60'}`}>Manage practice</span>
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[190px_1fr_250px] gap-4 lg:gap-6 items-center">
          <Stepper steps={steps} active={active} onSelect={setActive} />

          <div className="relative flex items-center justify-center min-h-[220px]">
            <BackPhone persona={persona} />
            <AnimatePresence mode="wait">
              <motion.div
                key={`${persona}-${step.screen}-${active}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative z-10"
                style={{ width: 220 }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ borderRadius: 24, border: '5px solid #1c1917', background: '#1c1917', boxShadow: '0 25px 60px rgba(124,58,237,0.18), 0 6px 18px rgba(0,0,0,0.12)' }}
                >
                  <div className="relative overflow-hidden bg-white" style={{ borderRadius: 19, aspectRatio: '9 / 19.2' }}>
                    <StepScreen screen={step.screen} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${persona}-${active}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <p className="text-[11px] font-semibold tracking-[0.18em] text-violet-600 uppercase mb-1.5">Step {step.number}</p>
              <h3 className="font-serif text-[1.6rem] font-medium text-ink leading-[1.08] tracking-tightest mb-1">{step.title}</h3>
              <p className="font-serif italic text-[0.95rem] mb-2 leading-snug" style={{ color: '#7c3aed' }}>{step.subheading}</p>
              <p className="font-sans text-[12px] text-muted leading-relaxed mb-3">{step.description}</p>

              <div className="flex flex-col gap-2.5 pt-3 border-t border-stone-200/70">
                {step.features.map(f => (
                  <div key={f.title} className="flex gap-2.5">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 text-violet-600 shrink-0"><Icon name={f.icon} /></span>
                    <div>
                      <p className="font-sans text-[12px] font-semibold text-ink leading-snug">{f.title}</p>
                      <p className="font-sans text-[11px] text-muted leading-relaxed">{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <Pagination steps={steps} active={active} onSelect={setActive} />
      </div>
    </section>
  )
}
