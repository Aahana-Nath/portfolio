'use client'

import { motion } from 'framer-motion'

/**
 * Lays out hero + work section without any sticky/z-index tricks.
 * The work section slides up into view as it enters the viewport.
 */
export default function ScrollTransition({ children }: { children: React.ReactNode }) {
  const childArray = Array.isArray(children)
    ? children as React.ReactNode[]
    : [children]

  // With a single child there's no "hero" to leave unanimated — animate it too.
  if (childArray.length === 1) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.04 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {childArray[0]}
      </motion.div>
    )
  }

  const [heroChild, ...restChildren] = childArray

  return (
    <div className="relative">
      {/* Hero — normal flow, no sticky */}
      <div>{heroChild}</div>

      {/* Remaining sections — each slides up on first enter */}
      {restChildren.map((child, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.04 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  )
}
