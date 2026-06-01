import { motion } from 'motion/react'
import { LAYERS, MATURITY } from '../data/layers'
import { useStore } from '../store'
import { TermsBoard } from './TermsBoard'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
}

export function Panel() {
  const active = useStore((s) => s.active)

  // Stations 1..LAYERS.length map to layers; intro/outro handled elsewhere.
  const layerIndex = active - 1
  if (layerIndex < 0 || layerIndex >= LAYERS.length) return null
  const layer = LAYERS[layerIndex]
  const m = MATURITY[layer.maturity]

  return (
    <div className="pointer-events-none fixed inset-y-0 right-0 z-10 flex w-full items-center justify-end pl-4 pr-12 sm:pr-16">
      <motion.div
        key={layer.id}
        variants={container}
        initial="hidden"
        animate="show"
        className="scrim pointer-events-auto w-full max-w-[420px] rounded-xl border border-white/10 p-6 shadow-2xl"
        style={{ borderTopColor: m.color, borderTopWidth: 2 }}
      >
        <motion.div variants={item} className="flex items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
            {layer.index}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/10 px-2 py-0.5">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: m.color, boxShadow: `0 0 8px ${m.color}` }}
            />
            <span className="font-mono text-[10px]" style={{ color: m.color }}>
              {m.label}
            </span>
          </span>
        </motion.div>

        <motion.h2
          variants={item}
          className="mt-2 font-display text-3xl font-semibold tracking-tight text-ink"
        >
          {layer.title}
        </motion.h2>

        <motion.p
          variants={item}
          className="mt-2 text-balance text-[13.5px] font-medium leading-relaxed text-ink/95"
        >
          {layer.purpose}
        </motion.p>

        <motion.p
          variants={item}
          className="mt-3 text-[13px] leading-relaxed text-ink-muted"
        >
          {layer.body}
        </motion.p>

        <motion.div variants={item} className="mt-4 flex flex-wrap gap-1.5">
          {layer.chips.map((c) => (
            <span key={c} className="chip">
              {c}
            </span>
          ))}
        </motion.div>

        {layer.id === 'negotiation' && (
          <motion.div variants={item}>
            <TermsBoard activeLayer={active === layerIndex + 1} />
          </motion.div>
        )}

        <motion.div
          variants={item}
          className="mt-4 rounded-md border-l-2 bg-white/[0.03] px-3 py-2.5"
          style={{ borderLeftColor: m.color }}
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
            Today vs. Gap
          </div>
          <div className="mt-1 text-[12.5px] leading-relaxed text-ink/90">
            {layer.todayVsGap}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
