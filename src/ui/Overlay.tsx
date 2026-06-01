import { Hud } from './Hud'
import { Navigator } from './Navigator'
import { Intro } from './Intro'
import { Panel } from './Panel'
import { Outro } from './Outro'

/** All 2D HUD / panel UI that floats above the 3D canvas. */
export function Overlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <Intro />
      <Panel />
      <Outro />
      <Hud />
      <Navigator />
    </div>
  )
}
