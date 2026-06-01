import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

interface AgentProps {
  color: string
  /** When false the agent fades/scales out smoothly (used for CERES). */
  show?: boolean
  scale?: number
}

/**
 * A glowing agent construct: a faceted core with an orbiting particle aura.
 * Used for ATLAS (cyan) and CERES (violet). Fades in/out via `show`.
 */
export function Agent({ color, show = true, scale = 1 }: AgentProps) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)
  const shell = useRef<THREE.Mesh>(null)
  const aura = useRef<THREE.Points>(null)
  const vis = useRef(show ? 1 : 0)
  const reduced = useStore((s) => s.reducedMotion)

  const auraGeo = useMemo(() => {
    const n = 90
    const positions = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const r = 0.95 + Math.random() * 0.7
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.cos(phi)
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    vis.current += ((show ? 1 : 0) - vis.current) * Math.min(1, dt * 4)
    const v = vis.current

    if (group.current) {
      group.current.visible = v > 0.02
      const s = scale * (0.5 + 0.5 * v)
      group.current.scale.setScalar(s)
    }
    if (core.current) {
      if (!reduced) core.current.rotation.y += dt * 0.5
      const mat = core.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = (1.6 + Math.sin(t * 2) * 0.4) * v
      mat.opacity = v
    }
    if (shell.current) {
      if (!reduced) {
        shell.current.rotation.y -= dt * 0.3
        shell.current.rotation.x += dt * 0.15
      }
      ;(shell.current.material as THREE.MeshBasicMaterial).opacity = 0.3 * v
    }
    if (aura.current) {
      if (!reduced) {
        aura.current.rotation.y += dt * 0.25
        aura.current.rotation.z += dt * 0.1
      }
      ;(aura.current.material as THREE.PointsMaterial).opacity = 0.9 * v
    }
  })

  return (
    <group ref={group}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.6}
          metalness={0.4}
          roughness={0.2}
          toneMapped={false}
          transparent
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.3} />
      </mesh>
      <points ref={aura} geometry={auraGeo}>
        <pointsMaterial
          size={0.07}
          color={color}
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <pointLight color={color} intensity={6} distance={9} />
    </group>
  )
}
