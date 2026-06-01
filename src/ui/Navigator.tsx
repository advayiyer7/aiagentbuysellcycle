import { LAYERS, MATURITY } from '../data/layers'
import { useStore } from '../store'

export function Navigator() {
  const active = useStore((s) => s.active)
  const scrollTo = useStore((s) => s.scrollTo)

  const items = [
    { label: 'Intro', dot: '#8A93A6', station: 0, short: '··' },
    ...LAYERS.map((l, i) => ({
      label: l.title,
      dot: MATURITY[l.maturity].dot,
      station: i + 1,
      short: l.index.replace('Layer ', 'L'),
    })),
    { label: 'Complete', dot: '#34D399', station: LAYERS.length + 1, short: '✓' },
  ]

  return (
    <nav className="fixed right-4 top-1/2 z-20 -translate-y-1/2">
      <ul className="flex flex-col gap-1">
        {items.map((it) => {
          const isActive = active === it.station
          return (
            <li key={it.station}>
              <button
                onClick={() => scrollTo(it.station)}
                className="group flex w-full items-center justify-end gap-2.5 py-1"
                title={it.label}
              >
                <span
                  className={`whitespace-nowrap font-mono text-[11px] tracking-wide transition-all duration-200 ${
                    isActive
                      ? 'text-ink opacity-100'
                      : 'text-ink-muted opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <span className="text-ink-muted">{it.short} </span>
                  {it.label}
                </span>
                <span
                  className="block rounded-full transition-all duration-200"
                  style={{
                    width: isActive ? 12 : 8,
                    height: isActive ? 12 : 8,
                    background: it.dot,
                    boxShadow: isActive ? `0 0 10px ${it.dot}` : 'none',
                    opacity: isActive ? 1 : 0.55,
                  }}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
