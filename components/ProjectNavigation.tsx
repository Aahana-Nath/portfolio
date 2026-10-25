'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export interface ProjectSectionLink {
  id: string
  label: string
}

export default function ProjectNavigation({
  sections,
  theme = 'light',
}: {
  sections: ProjectSectionLink[]
  theme?: 'light' | 'dark'
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')
  const isDark = theme === 'dark'

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: 0 },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [sections])

  return (
    <header className={`sticky top-0 z-50 flex h-14 items-center gap-5 border-b px-4 backdrop-blur-md md:grid md:grid-cols-[9rem_minmax(0,1fr)_9rem] md:gap-3 md:px-7 ${isDark ? 'border-white/10 bg-[#080714]/90 text-white' : 'border-stone-200/70 bg-white/90 text-[#17152f]'}`}>
      <Link href="/" className={`inline-flex shrink-0 items-center justify-self-start gap-1.5 text-[12px] font-semibold transition-colors ${isDark ? 'text-white/75 hover:text-white' : 'text-[#514d5d] hover:text-[#17152f]'}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M11.5 7H2.5M2.5 7l4-4M2.5 7l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <span className="hidden sm:inline">Back to home</span>
        <span className="sm:hidden">Home</span>
      </Link>

      <nav aria-label="Project sections" className="flex min-w-0 flex-1 items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="mx-auto flex w-max shrink-0 items-center gap-1">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={activeId === section.id ? 'location' : undefined}
            className={`shrink-0 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors md:px-3 md:text-[12px] ${
              activeId === section.id
                ? isDark ? 'bg-white/12 text-white' : 'bg-violet-100 text-violet-700'
                : isDark ? 'text-white/55 hover:text-white' : 'text-[#77788f] hover:text-[#17152f]'
            }`}
          >
            {section.label}
          </a>
        ))}
        </div>
      </nav>
    </header>
  )
}
