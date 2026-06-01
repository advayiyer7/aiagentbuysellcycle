import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AdaptiveDpr } from '@react-three/drei'
import { Scene } from './three/Scene'
import { Overlay } from './ui/Overlay'
import { useStore } from './store'

export default function App() {
  const setReduced = useStore((s) => s.setReducedMotion)

  // Respect the OS-level reduced-motion preference on load.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [setReduced])

  return (
    <div className="fixed inset-0 bg-void-900">
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        camera={{ position: [1.6, 1.3, 13.5], fov: 50, near: 0.1, far: 220 }}
      >
        <Suspense fallback={null}>
          <Scene />
          <AdaptiveDpr pixelated />
        </Suspense>
      </Canvas>
      <Overlay />
    </div>
  )
}
