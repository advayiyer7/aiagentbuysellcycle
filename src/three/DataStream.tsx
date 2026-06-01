import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

interface DataStreamProps {
  from: THREE.Vector3
  to: THREE.Vector3
  color: string
  /** Number of flowing pulse particles. */
  count?: number
  /** When false the stream fades out smoothly. */
  show?: boolean
  /** Flow speed; sign sets direction along the curve. */
  speed?: number
  /** How far the curve bows out sideways. */
  bow?: number
}

/**
 * A curved (quadratic-bezier) connecting line with a stream of light pulses
 * flowing along it — the signature inter-agent data-flow visual.
 */
export function DataStream({
  from,
  to,
  color,
  count = 36,
  show = true,
  speed = 0.25,
  bow = 2.4,
}: DataStreamProps) {
  const pulses = useRef<THREE.Points>(null)
  const lineRef = useRef<THREE.Line>(null)
  const vis = useRef(show ? 1 : 0)
  const reduced = useStore((s) => s.reducedMotion)

  const { curve, lineGeo, pulseGeo, offsets } = useMemo(() => {
    const mid = from.clone().lerp(to, 0.5)
    mid.x += bow
    mid.z += bow * 0.4
    const curve = new THREE.QuadraticBezierCurve3(from.clone(), mid, to.clone())
    const pts = curve.getPoints(60)
    const lineGeo = new THREE.BufferGeometry().setFromPoints(pts)

    const pulseGeo = new THREE.BufferGeometry()
    pulseGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(count * 3), 3),
    )
    const offsets = new Float32Array(count)
    for (let i = 0; i < count; i++) offsets[i] = i / count
    return { curve, lineGeo, pulseGeo, offsets }
  }, [from, to, bow, count])

  useFrame((state, dt) => {
    if (!pulses.current) return
    vis.current += ((show ? 1 : 0) - vis.current) * Math.min(1, dt * 3)
    const v = vis.current
    ;(pulses.current.material as THREE.PointsMaterial).opacity = 0.95 * v
    if (lineRef.current) {
      ;(lineRef.current.material as THREE.LineBasicMaterial).opacity = 0.18 * v
    }
    const t = reduced ? 0.0 : state.clock.elapsedTime * speed
    const pos = pulses.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = pos.array as Float32Array
    const p = new THREE.Vector3()
    for (let i = 0; i < offsets.length; i++) {
      let u = (offsets[i] + t) % 1
      if (u < 0) u += 1
      curve.getPoint(u, p)
      arr[i * 3] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    }
    pos.needsUpdate = true
  })

  return (
    <group>
      <line ref={lineRef as never}>
        <primitive object={lineGeo} attach="geometry" />
        <lineBasicMaterial color={color} transparent opacity={0.18} toneMapped={false} />
      </line>
      <points ref={pulses} geometry={pulseGeo}>
        <pointsMaterial
          size={0.16}
          color={color}
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
