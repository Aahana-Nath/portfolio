'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'

/**
 * Tracks whether an element is near the viewport so callers can skip
 * mounting/animating expensive decorative content while it's off-screen.
 * `margin` extends the detection area to avoid visible pop-in/out.
 */
export function useInViewport<T extends HTMLElement = HTMLElement>(margin: `${number}px` = '250px') {
  const ref = useRef<T>(null)
  const inView = useInView(ref, { once: false, margin: `${margin} 0px ${margin} 0px` as any })
  return { ref, inView }
}
