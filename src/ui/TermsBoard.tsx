import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useStore } from '../store'

interface Round {
  state: string
  price: number // $ / ton
  delivery: number // days
  quality: string
}

// The negotiation converging across rounds toward AGREED terms.
const ROUNDS: Round[] = [
  { state: 'RFQ_SENT', price: 245, delivery: 8, quality: 'Grade A' },
  { state: 'QUOTED', price: 298, delivery: 12, quality: 'Grade A' },
  { state: 'COUNTERED', price: 262, delivery: 9, quality: 'Grade A' },
  { state: 'REVISED', price: 281, delivery: 10, quality: 'Grade A' },
  { state: 'AGREED', price: 274, delivery: 10, quality: 'Grade A' },
]

export function TermsBoard({ activeLayer }: { activeLayer: boolean }) {
  const reduced = useStore((s) => s.reducedMotion)
  const [round, setRound] = useState(0)

  // Step through rounds while this layer is active; reset when it leaves.
  useEffect(() => {
    if (!activeLayer) {
      setRound(0)
      return
    }
    if (reduced) {
      setRound(ROUNDS.length - 1)
      return
    }
    setRound(0)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setRound(i)
      if (i >= ROUNDS.length - 1) clearInterval(id)
    }, 1050)
    return () => clearInterval(id)
  }, [activeLayer, reduced])

  const r = ROUNDS[Math.min(round, ROUNDS.length - 1)]
  const agreed = r.state === 'AGREED'

  const rows = [
    { label: 'PRICE / TON', value: `$${r.price}`, target: '≤ $280' },
    { label: 'DELIVERY', value: `${r.delivery} days`, target: '≤ 10 days' },
    { label: 'QUALITY', value: r.quality, target: '= Grade A' },
    { label: 'QUANTITY', value: '10 t', target: '= 10 t' },
  ]

  return (
    <div className="mt-4 rounded-md border border-white/10 bg-black/30 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Terms board
        </span>
        <motion.span
          key={r.state}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          className={`font-mono text-[11px] ${agreed ? 'text-maturity-today' : 'text-maturity-gap'}`}
        >
          {r.state}
        </motion.span>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-3">
            <span className="font-mono text-[11px] text-ink-muted">{row.label}</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-ink-muted/60">{row.target}</span>
              <motion.span
                key={row.value}
                initial={{ opacity: 0.4, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                className={`min-w-[64px] rounded px-1.5 py-0.5 text-right font-mono text-[12px] ${
                  agreed
                    ? 'bg-maturity-today/15 text-maturity-today'
                    : 'bg-white/5 text-ink'
                }`}
              >
                {row.value}
              </motion.span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2.5 flex items-center gap-1">
        {ROUNDS.map((rr, i) => (
          <span
            key={rr.state}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{
              background:
                i <= round ? (agreed && i === round ? '#34D399' : '#22D3EE') : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
