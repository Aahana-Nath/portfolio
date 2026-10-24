'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sun } from 'lucide-react'

const navLinks = [
  { label: 'Home', id: 'home' },
  { label: 'Toolkit', id: 'toolkit' },
  { label: 'Work', id: 'work' },
  { label: 'Experience', id: 'experience' },
  { label: 'Thinking', id: 'thinking' },
  { label: 'Contact', id: 'contact' },
]

export default function Navbar() {
  const [active, setActive] = useState('home')

  useEffect(() => {
    const sections = navLinks
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    const observer = new IntersectionObserver(
      entries => {
        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleSections[0]) setActive(visibleSections[0].target.id)
      },
      { rootMargin: '-25% 0px -65% 0px', threshold: [0, 0.1, 0.25, 0.5] },
    )

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-stone-100/60 md:px-10 lg:px-16">
      {/* Logo */}
      <a href="#home" onClick={() => scrollToSection('home')} className="flex items-center gap-1.5 font-sans text-sm font-bold tracking-[0.13em] text-stone-900 uppercase select-none">
        Aahana Nath
        <span className="text-violet-400 text-base leading-none">✦</span>
      </a>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-7">
        {navLinks.map(link => (
          <button
            key={link.id}
            type="button"
            onClick={() => scrollToSection(link.id)}
            className={`relative font-sans text-sm tracking-wide transition-colors duration-200 ${
              active === link.id ? 'text-stone-900 font-medium' : 'text-stone-400 hover:text-stone-700'
            }`}
          >
            {link.label}
            {active === link.id && (
              <motion.div
                layoutId="nav-dot"
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full bg-stone-900"
              />
            )}
          </button>
        ))}
      </div>

      {/* Right: CTA + theme toggle */}
      <div className="flex items-center gap-2.5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => scrollToSection('contact')}
          className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-stone-700"
        >
          Let&apos;s Connect
          <ArrowRight size={12} />
        </motion.button>
        <button className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200 text-stone-400 transition-colors hover:text-stone-700 hover:border-stone-300">
          <Sun size={14} />
        </button>
      </div>
    </nav>
  )
}
