import { motion } from 'motion/react'
import { LAYERS, MATURITY, OUTRO } from '../data/layers'
import { OUTRO_STATION } from '../layout'
import { useStore } from '../store'

export function Outro() {
  const active = useStore((s) => s.active)
  const scrollTo = useStore((s) => s.scrollTo)
  if (active !== OUTRO_STATION) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="scrim pointer-events-auto w-full max-w-2xl rounded-2xl border border-white/10 p-8 text-center shadow-2xl"
      >
        <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-maturity-today">
          Transaction complete
        </div>
        <h2 className="mt-3 font-display text-5xl font-bold tracking-tight text-ink">
          {OUTRO.headline}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-[14px] leading-relaxed text-ink-muted">
          {OUTRO.body}
        </p>

        {/* Compact maturity recap */}
        <div className="mx-auto mt-6 flex max-w-lg flex-wrap items-center justify-center gap-x-4 gap-y-2">
          {LAYERS.map((l) => {
            const m = MATURITY[l.maturity]
            return (
              <span key={l.id} className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: m.dot, boxShadow: `0 0 8px ${m.dot}` }}
                />
                <span className="font-mono text-[11px] text-ink/85">{l.title}</span>
              </span>
            )
          })}
        </div>

        <p className="mx-auto mt-6 max-w-lg text-balance text-[13px] font-medium italic leading-relaxed text-ink/90">
          {OUTRO.closing}
        </p>

        <button
          onClick={() => scrollTo(0)}
          className="mt-7 rounded-md border border-atlas/40 bg-atlas/10 px-5 py-2 font-mono text-[12px] uppercase tracking-wider text-atlas transition-colors hover:bg-atlas/20"
        >
          ↑ Restart from the top
        </button>
      </motion.div>
    </div>
  )
}
