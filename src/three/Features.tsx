import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { MATURITY, type Layer } from '../data/layers'
import { useStore } from '../store'

/** Picks the right thematic micro-visual for a layer, sitting on its platform. */
export function LayerFeature({ layer, station }: { layer: Layer; station: number }) {
  switch (layer.id) {
    case 'mission':
      return <MandateManifest color={MATURITY[layer.maturity].color} station={station} />
    case 'identity':
      return <CredentialToken color={MATURITY[layer.maturity].color} station={station} />
    case 'discovery':
      return <SupplierField station={station} />
    case 'agreement':
      return <ContractArtifact color={MATURITY[layer.maturity].color} station={station} />
    case 'settlement':
      return <EscrowVault color={MATURITY[layer.maturity].color} station={station} />
    case 'fulfillment':
      return <FulfillmentMembrane color={MATURITY[layer.maturity].color} station={station} />
    default:
      return null
  }
}

function useActive(station: number) {
  return useStore((s) => s.active === station)
}

/** Layer 0 — a mandate manifest cube that docks down onto the platform. */
function MandateManifest({ color, station }: { color: string; station: number }) {
  const ref = useRef<THREE.Group>(null)
  const active = useActive(station)
  const reduced = useStore((s) => s.reducedMotion)
  useFrame((state, dt) => {
    if (!ref.current) return
    const target = active ? 1.6 : 4.5
    ref.current.position.y += (target - ref.current.position.y) * Math.min(1, dt * 2.5)
    if (!reduced) ref.current.rotation.y += dt * 0.4
    ref.current.position.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.05
  })
  return (
    <group ref={ref} position={[0, 4.5, 0]}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#0e1320"
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <mesh>
        <boxGeometry args={[1.15, 1.15, 1.15]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

/** Layer 1 — a credential token that pulses a trust handshake. */
function CredentialToken({ color, station }: { color: string; station: number }) {
  const ring = useRef<THREE.Mesh>(null)
  const active = useActive(station)
  useFrame((state) => {
    if (!ring.current) return
    const t = state.clock.elapsedTime
    const s = active ? 1 + (Math.sin(t * 2.5) * 0.5 + 0.5) * 0.6 : 1
    ring.current.scale.setScalar(s)
    ;(ring.current.material as THREE.MeshBasicMaterial).opacity = active
      ? 0.5 - (s - 1) * 0.6
      : 0.25
  })
  return (
    <group position={[0, 1.5, 0]}>
      <mesh>
        <octahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#0e1320"
          emissive={color}
          emissiveIntensity={0.8}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.02, 8, 64]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Layer 2 — a scattered field of supplier nodes; one lights up as CERES. */
function SupplierField({ station }: { station: number }) {
  const group = useRef<THREE.Group>(null)
  const active = useActive(station)
  const reduced = useStore((s) => s.reducedMotion)
  const nodes = useMemo(() => {
    const arr: { pos: [number, number, number]; chosen: boolean }[] = []
    const N = 14
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      const r = 1.8 + Math.random() * 0.9
      arr.push({
        pos: [Math.cos(a) * r, 1.4 + Math.random() * 0.8, Math.sin(a) * r],
        chosen: i === 3,
      })
    }
    return arr
  }, [])
  useFrame((_, dt) => {
    if (group.current && !reduced) group.current.rotation.y += dt * 0.1
  })
  return (
    <group ref={group}>
      {nodes.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <icosahedronGeometry args={[n.chosen ? 0.26 : 0.16, 0]} />
          <meshStandardMaterial
            color={n.chosen ? '#A78BFA' : '#28324a'}
            emissive={n.chosen ? '#A78BFA' : '#1a2336'}
            emissiveIntensity={n.chosen && active ? 2 : 0.3}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

/** Layer 4 — converged terms seal into a glowing contract artifact. */
function ContractArtifact({ color, station }: { color: string; station: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const sealA = useRef<THREE.Mesh>(null)
  const sealB = useRef<THREE.Mesh>(null)
  const active = useActive(station)
  const reduced = useStore((s) => s.reducedMotion)
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (ref.current) {
      if (!reduced) ref.current.rotation.y += dt * 0.5
      const mat = ref.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity += ((active ? 1.6 : 0.4) - mat.emissiveIntensity) * 0.05
    }
    // Two signatures snap inward when active.
    const target = active ? 0.62 : 1.6
    for (const [s, dir] of [
      [sealA, 1],
      [sealB, -1],
    ] as const) {
      if (s.current) {
        s.current.position.x += (target * dir - s.current.position.x) * Math.min(1, dt * 3)
        s.current.position.y = Math.sin(t * 1.5) * 0.05 + 1.5
      }
    }
  })
  return (
    <group position={[0, 1.5, 0]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.7, 0]} />
        <meshStandardMaterial
          color="#0e1320"
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      <mesh ref={sealA} position={[1.6, 1.5, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh ref={sealB} position={[-1.6, 1.5, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#A78BFA" emissive="#A78BFA" emissiveIntensity={2} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Layer 5 — funds flow into an escrow vault that visibly locks. */
function EscrowVault({ color, station }: { color: string; station: number }) {
  const lid = useRef<THREE.Mesh>(null)
  const ring = useRef<THREE.Mesh>(null)
  const active = useActive(station)
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (lid.current) {
      const target = active ? 1.05 : 1.7 // lid closes down when locked
      lid.current.position.y += (target - lid.current.position.y) * Math.min(1, dt * 2.5)
    }
    if (ring.current) {
      ring.current.rotation.z += dt * (active ? 1.2 : 0.2)
      const mat = ring.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = active ? 2 + Math.sin(t * 3) * 0.6 : 0.6
    }
  })
  return (
    <group position={[0, 1.2, 0]}>
      {/* vault body */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.85, 0.85, 0.9, 32]} />
        <meshStandardMaterial color="#0e1320" metalness={0.8} roughness={0.25} emissive={color} emissiveIntensity={0.2} />
      </mesh>
      {/* lid */}
      <mesh ref={lid} position={[0, 1.7, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.2, 32]} />
        <meshStandardMaterial color="#121828" metalness={0.85} roughness={0.2} emissive={color} emissiveIntensity={0.4} />
      </mesh>
      {/* lock ring */}
      <mesh ref={ring} position={[0, 0.5, 0.86]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.06, 12, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
      </mesh>
    </group>
  )
}

/** Layer 6 — a membrane between digital and physical; escrow releases on verify. */
function FulfillmentMembrane({ color, station }: { color: string; station: number }) {
  const membrane = useRef<THREE.Mesh>(null)
  const crate = useRef<THREE.Group>(null)
  const released = useRef<THREE.Mesh>(null)
  const active = useActive(station)
  const reduced = useStore((s) => s.reducedMotion)
  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    if (membrane.current) {
      const mat = membrane.current.material as THREE.MeshStandardMaterial
      mat.opacity = 0.12 + (active ? Math.sin(t * 1.5) * 0.06 + 0.1 : 0)
      mat.emissiveIntensity = active ? 0.9 : 0.3
    }
    if (crate.current) {
      // The wheat crate arrives toward the membrane when active.
      const target = active ? 0 : -3.5
      crate.current.position.x += (target - crate.current.position.x) * Math.min(1, dt * 1.5)
      if (!reduced) crate.current.rotation.y += dt * 0.3
    }
    if (released.current) {
      // A verified-release pulse rises once the crate has arrived.
      const mat = released.current.material as THREE.MeshBasicMaterial
      mat.opacity = active ? (Math.sin(t * 2) * 0.5 + 0.5) * 0.8 : 0
    }
  })
  return (
    <group position={[0, 1.5, 0]}>
      {/* the boundary membrane */}
      <mesh ref={membrane} position={[1.6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[4, 3, 1, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.14}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* arriving physical goods */}
      <group ref={crate} position={[-3.5, -0.2, 0]}>
        <mesh>
          <boxGeometry args={[0.9, 0.7, 0.9]} />
          <meshStandardMaterial color="#caa46a" emissive="#7a5a22" emissiveIntensity={0.2} metalness={0.1} roughness={0.8} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.98, 0.78, 0.98]} />
          <meshBasicMaterial color="#e7c98a" wireframe transparent opacity={0.4} />
        </mesh>
      </group>
      {/* verified-release pulse */}
      <mesh ref={released} position={[1.6, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#34D399" transparent opacity={0} toneMapped={false} />
      </mesh>
    </group>
  )
}
