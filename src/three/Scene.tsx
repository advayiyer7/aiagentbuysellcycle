import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { ScrollControls, useScroll } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { LAYERS } from '../data/layers'
import { useStore } from '../store'
import {
  ATLAS_OFFSET_X,
  CERES_OFFSET_X,
  STATION_GAP,
  TOTAL_STATIONS,
  layerY,
} from '../layout'
import { Starfield } from './Starfield'
import { Platform } from './Platform'
import { Agent } from './Agent'
import { DataStream } from './DataStream'
import { LayerFeature } from './Features'

const DISCOVERY_STATION = 3 // intro(0) + layer index 2 + 1

/** Drives the descending camera from scroll offset and syncs the store. */
function CameraRig() {
  const scroll = useScroll()
  const camera = useThree((s) => s.camera)
  const reduced = useStore((s) => s.reducedMotion)
  const setActive = useStore((s) => s.setActive)
  const setOffset = useStore((s) => s.setOffset)
  const setScrolled = useStore((s) => s.setScrolled)
  const lastActive = useRef(-1)

  // Expose an imperative jump for the navigator.
  const setScrollTo = useStore((s) => s.setScrollTo)
  useEffect(() => {
    setScrollTo((index: number) => {
      const el = scroll.el
      if (!el) return
      const max = el.scrollHeight - el.clientHeight
      el.scrollTo({ top: (index / (TOTAL_STATIONS - 1)) * max, behavior: 'smooth' })
    })
  }, [scroll, setScrollTo])

  useFrame((_, dt) => {
    const offset = scroll.offset
    setOffset(offset)
    if (offset > 0.002) setScrolled(true)

    const continuous = offset * (TOTAL_STATIONS - 1)
    const targetY = -continuous * STATION_GAP

    const active = Math.round(continuous)
    if (active !== lastActive.current) {
      lastActive.current = active
      setActive(active)
    }

    // Eased descent. A touch of sideways drift to feel cinematic.
    const camTargetY = targetY + 1.3
    const k = reduced ? 1 : Math.min(1, dt * 2.2)
    camera.position.y += (camTargetY - camera.position.y) * k
    camera.position.z += (13.5 - camera.position.z) * k
    camera.position.x += (1.6 - camera.position.x) * k
    camera.lookAt(0, targetY, 0)
  })

  return null
}

/** Holds the agents + data stream and descends in lock-step with the camera. */
function AgentRig() {
  const scroll = useScroll()
  const group = useRef<THREE.Group>(null)
  const active = useStore((s) => s.active)

  useFrame(() => {
    if (!group.current) return
    const continuous = scroll.offset * (TOTAL_STATIONS - 1)
    group.current.position.y = -continuous * STATION_GAP + 1.3
  })

  const ceresShown = active >= DISCOVERY_STATION && active < TOTAL_STATIONS - 1
  const streamShown = active >= DISCOVERY_STATION && active <= 5
  const atlasPos = new THREE.Vector3(ATLAS_OFFSET_X, 0, 1.8)
  const ceresPos = new THREE.Vector3(CERES_OFFSET_X, 0, 0)

  return (
    <group ref={group}>
      <group position={atlasPos.toArray()}>
        <Agent color="#22D3EE" show scale={1} />
      </group>
      <group position={ceresPos.toArray()}>
        <Agent color="#A78BFA" show={ceresShown} scale={0.9} />
      </group>
      <DataStream
        from={atlasPos.clone().add(new THREE.Vector3(0.6, 0, -0.5))}
        to={ceresPos.clone().add(new THREE.Vector3(-0.6, 0, 0))}
        color="#7dd3fc"
        show={streamShown}
        speed={0.28}
        bow={1.6}
      />
      <DataStream
        from={ceresPos.clone().add(new THREE.Vector3(-0.6, 0.2, 0))}
        to={atlasPos.clone().add(new THREE.Vector3(0.6, 0.2, -0.5))}
        color="#c4b5fd"
        show={streamShown}
        speed={0.22}
        bow={-1.4}
      />
    </group>
  )
}

export function Scene() {
  const reduced = useStore((s) => s.reducedMotion)
  return (
    <>
      {/* Atmosphere + lighting (direct scene children so attach works) */}
      <color attach="background" args={['#05060a']} />
      <fog attach="fog" args={['#05060a', 18, 52]} />
      {/* Self-contained lighting (no external HDR dependency). */}
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#2a3a66', '#05060a', 0.5]} />
      <directionalLight position={[6, 10, 8]} intensity={0.7} color="#9fb2d8" />
      <directionalLight position={[-8, -4, -6]} intensity={0.25} color="#7dd3fc" />

      <Starfield />

      {LAYERS.map((layer, i) => (
        <group key={layer.id}>
          <Platform layer={layer} layerIndex={i} />
          <group position={[0, layerY(i), 0]}>
            <LayerFeature layer={layer} station={i + 1} />
          </group>
        </group>
      ))}

      {/* Scroll-driven rigs live inside ScrollControls so useScroll works. */}
      <ScrollControls pages={TOTAL_STATIONS} damping={0.18}>
        <AgentRig />
        <CameraRig />
      </ScrollControls>

      {!reduced && (
        <EffectComposer enableNormalPass={false}>
          <Bloom
            intensity={0.9}
            luminanceThreshold={0.35}
            luminanceSmoothing={0.4}
            mipmapBlur
            radius={0.7}
          />
        </EffectComposer>
      )}
    </>
  )
}
