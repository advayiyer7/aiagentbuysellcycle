import { motion, AnimatePresence } from 'motion/react'
import { MATURITY } from '../data/layers'
import { useStore } from '../store'

const LEGEND = [
  { key: 'today', ...MATURITY.today },
  { key: 'emerging', ...MATURITY.emerging },
  { key: 'gap', ...MATURITY.gap },
]

export function Hud() {
  const scrolled = useStore((s) => s.scrolled)
  const reduced = useStore((s) => s.reducedMotion)
  const setReduced = useStore((s) => s.setReducedMotion)

  return (
    <>
      {/* Top-left: running scenario badge */}
      <div className="pointer-events-none fixed left-5 top-5 z-20 max-w-[min(80vw,420px)]">
        <div className="scrim pointer-events-auto rounded-md border border-white/10 px-3.5 py-2.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Active transaction
          </div>
          <div className="mt-1 font-mono text-[12.5px] leading-snug text-ink">
            Procuring <span className="text-maturity-today">10t Grade-A wheat</span>
            <span className="text-ink-muted"> · agent: </span>
            <span className="text-atlas">ATLAS</span>
            <span className="text-ink-muted"> ⇄ </span>
            <span className="text-ceres">CERES</span>
          </div>
        </div>
      </div>

      {/* Bottom-left: maturity legend + motion toggle */}
      <div className="pointer-events-none fixed bottom-5 left-5 z-20">
        <div className="scrim pointer-events-auto rounded-md border border-white/10 px-3.5 py-2.5">
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Maturity
          </div>
          <div className="mt-2 flex flex-col gap-1.5">
            {LEGEND.map((m) => (
              <div key={m.key} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }}
                />
                <span className="text-[12px] text-ink/90">{m.label}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setReduced(!reduced)}
            className="mt-3 w-full rounded border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-muted transition-colors hover:text-ink"
          >
            Motion: {reduced ? 'reduced' : 'full'}
          </button>
        </div>
      </div>

      {/* Bottom-center: scroll hint, fades after first scroll */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none fixed bottom-6 left-1/2 z-20 -translate-x-1/2 text-center"
          >
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-muted">
              Scroll to descend the stack
            </div>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="mt-2 text-ink-muted"
            >
              ↓
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
