import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { MATURITY, type Layer } from '../data/layers'
import { layerY } from '../layout'
import { useStore } from '../store'

/**
 * A single layer platform: a faceted hex disc with a wireframe shell and an
 * emissive ring keyed to the layer's maturity color. Labelled in the void.
 */
export function Platform({ layer, layerIndex }: { layer: Layer; layerIndex: number }) {
  const ring = useRef<THREE.Mesh>(null)
  const group = useRef<THREE.Group>(null)
  const reduced = useStore((s) => s.reducedMotion)
  const active = useStore((s) => s.active)
  const color = MATURITY[layer.maturity].color
  const y = layerY(layerIndex)
  const isActive = active === layerIndex + 1

  useFrame((state, dt) => {
    if (reduced || !group.current || !ring.current) return
    group.current.rotation.y += dt * 0.06
    const t = state.clock.elapsedTime
    const mat = ring.current.material as THREE.MeshStandardMaterial
    // Active platform pulses brighter.
    const target = isActive ? 2.4 : 0.9
    mat.emissiveIntensity += (target + Math.sin(t * 1.6) * 0.25 - mat.emissiveIntensity) * 0.06
    group.current.position.y = y + Math.sin(t * 0.5 + layerIndex) * 0.18
  })

  return (
    <group ref={group} position={[0, y, 0]}>
      {/* Faceted disc body */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[3.1, 3.1, 0.35, 6]} />
        <meshStandardMaterial
          color="#0c1018"
          metalness={0.7}
          roughness={0.35}
          emissive={color}
          emissiveIntensity={0.05}
        />
      </mesh>
      {/* Wireframe shell */}
      <mesh>
        <cylinderGeometry args={[3.25, 3.25, 0.4, 6]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
      </mesh>
      {/* Emissive maturity ring */}
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[3.55, 0.045, 16, 96]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
      {/* Inner glow disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.22, 0]}>
        <circleGeometry args={[2.9, 6]} />
        <meshBasicMaterial color={color} transparent opacity={0.05} />
      </mesh>

      {/* Mono labels */}
      <Text
        position={[0, 0.05, 3.95]}
        rotation={[0, 0, 0]}
        fontSize={0.34}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        outlineWidth={0.004}
        outlineColor="#05060a"
      >
        {layer.index.toUpperCase()}
      </Text>
      <Text
        position={[0, 0.05, -3.95]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.34}
        color={color}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        outlineWidth={0.004}
        outlineColor="#05060a"
      >
        {layer.index.toUpperCase()}
      </Text>
    </group>
  )
}
