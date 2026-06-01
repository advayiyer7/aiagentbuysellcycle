import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

/**
 * Drifting volumetric star/particle field that fills the void and gives depth.
 * Two layers move at different rates for parallax.
 */
export function Starfield({ count = 1400 }: { count?: number }) {
  const near = useRef<THREE.Points>(null)
  const far = useRef<THREE.Points>(null)
  const reduced = useStore((s) => s.reducedMotion)

  const [nearGeo, farGeo] = useMemo(() => {
    const make = (n: number, spread: number, depth: number) => {
      const positions = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spread
        positions[i * 3 + 1] = (Math.random() - 0.5) * depth
        positions[i * 3 + 2] = (Math.random() - 0.5) * spread
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      return g
    }
    return [make(count, 90, 220), make(Math.floor(count * 0.6), 140, 260)]
  }, [count])

  useFrame((_, dt) => {
    if (reduced) return
    if (near.current) near.current.rotation.y += dt * 0.012
    if (far.current) far.current.rotation.y -= dt * 0.006
  })

  return (
    <group>
      <points ref={near} geometry={nearGeo}>
        <pointsMaterial
          size={0.09}
          color="#9fb2d8"
          transparent
          opacity={0.85}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <points ref={far} geometry={farGeo}>
        <pointsMaterial
          size={0.14}
          color="#3a4665"
          transparent
          opacity={0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  )
}
