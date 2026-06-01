import { motion } from 'motion/react'
import { INTRO } from '../data/layers'
import { useStore } from '../store'

export function Intro() {
  const active = useStore((s) => s.active)
  const offset = useStore((s) => s.offset)
  // Visible only at the very top; fade as the user starts descending.
  const opacity = active === 0 ? Math.max(0, 1 - offset * 7) : 0
  if (opacity <= 0.01) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-10 flex items-center"
      style={{ opacity }}
    >
      <div className="mx-auto max-w-3xl px-8 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="font-mono text-[12px] uppercase tracking-[0.32em] text-atlas">
            {INTRO.kicker}
          </div>
          <h1 className="mt-3 font-display text-6xl font-bold tracking-tight text-ink sm:text-7xl">
            {INTRO.title}
          </h1>
          <p className="mt-4 max-w-xl text-balance text-lg leading-relaxed text-ink/90">
            {INTRO.subtitle}
          </p>
          <p className="mt-5 max-w-xl rounded-lg border-l-2 border-atlas/60 bg-white/[0.03] px-4 py-3 text-[14px] leading-relaxed text-ink-muted">
            {INTRO.scenario}
          </p>
        </motion.div>
      </div>
    </div>
  )
}
