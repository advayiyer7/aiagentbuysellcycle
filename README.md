# The Stack — Agent-to-Agent Procurement Explainer

An immersive 3D website that walks a visitor down the layers of an autonomous
**agent-to-agent (A2A) procurement** transaction, told from the buyer agent's
perspective. The running scenario: a buyer agent **ATLAS** procuring 10 tons of
Grade-A wheat from a supplier agent **CERES**.

The visitor descends a vertical "protocol stack" — one layer at a time — and each
layer is both visualized in 3D and explained in a panel, with the real protocols
involved and an honest maturity tag.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
```

Build / preview a production bundle:

```bash
npm run build
npm run preview
```

## Stack

- **Vite + React + TypeScript**
- **React Three Fiber** + **drei** for all 3D
- **@react-three/postprocessing** for bloom
- **Motion** (Framer Motion) for 2D panel/HUD transitions
- **Tailwind CSS** for the overlay/HUD
- **three**, **zustand** for shared scroll/active-layer state

## How it works

- A single scroll-driven journey using drei `<ScrollControls>` with one snap
  point per station: **Intro → 7 layers (descending) → Outro**.
- A `CameraRig` reads the scroll offset each frame, eases the camera down the
  stack, and publishes the active station to a small zustand store. The 2D
  overlay (panels, navigator, HUD) reads that store.
- ATLAS travels down with the camera; CERES fades in from the Discovery layer.
- Inter-agent **data-flow particle streams** flow along bezier curves
  (`DataStream`). The negotiation **terms board converges** across rounds, the
  settlement **escrow vault locks**, and fulfillment **releases** on verification
  (`three/Features.tsx`).
- The clickable **navigator** (right) jumps to any station; the **HUD** shows the
  scenario badge, maturity legend, and a fading scroll hint.
- `prefers-reduced-motion` (and the in-app Motion toggle) cuts ambient motion and
  heavy postprocessing; use the navigator to step through layers.

## Editing content

All per-layer copy lives in **`src/data/layers.ts`** — titles, purpose, body,
protocol chips, the `Today vs. Gap` note, and the maturity tag. Edit there and
the 3D stack, navigator, and panels all update.

The maturity color system is the semantic spine:

- 🟢 Emerald `#34D399` — Buildable today
- 🟡 Amber `#FBBF24` — Emerging standard
- 🔴 Rose `#FB7185` — Open gap / frontier

## Project structure

```
src/
  data/layers.ts     all copy + maturity + agent metadata
  store.ts           zustand store (active station, offset, reduced motion)
  layout.ts          vertical stack geometry / station positions
  three/             R3F scene, platforms, agents, data streams, features
  ui/                HUD, navigator, panels, intro, outro (DOM overlay)
  App.tsx            Canvas + overlay
```
