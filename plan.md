# Claude Code Prompt — Immersive 3D Agent-to-Agent Procurement Explainer

> Paste everything below the line into Claude Code, run from an **empty project directory**. It contains the full spec: stack, structure, every layer's content, the design system, and a definition of done. Build it incrementally and run it — don't just emit files.

---

## Objective

Build a **production-quality, immersive 3D website** that walks a visitor through the layers of an autonomous **agent-to-agent (A2A) procurement** transaction, told **from the buyer agent's perspective**. The visitor descends through a vertical "protocol stack" — one layer at a time — and each layer is both **visualized in 3D** and **explained** in a panel, with the **real-world protocols** involved and an honest **maturity tag** (buildable today / emerging / open gap).

The running scenario throughout: **a buyer agent procuring 10 tons of Grade-A wheat.** Give the agents flavor names — buyer = **ATLAS**, supplier = **CERES** — used consistently in the UI.

This must feel like a high-end systems visualization / premium developer-tool launch piece. Cinematic, precise, confident. **Not** a generic AI-template landing page.

## Tech stack — use exactly this

- **Vite + React + TypeScript**
- **React Three Fiber** (`@react-three/fiber`) + **`@react-three/drei`** for all 3D
- **`@react-three/postprocessing`** for bloom / depth-of-field
- **Framer Motion** (`motion`) for 2D UI/panel transitions
- **Tailwind CSS** for the 2D overlay/HUD
- **three**
- Google Fonts (or Fontshare) for type — see design system
- **No backend.** Fully static, deployable to any static host. No localStorage/sessionStorage needed.

Put all per-layer copy in a single typed data file (`src/data/layers.ts`) so content is trivial to edit. Keep components small and modular. Include a short `README.md`.

## Experience & structure

- **Single page, scroll-driven journey** using drei `<ScrollControls>` with **snap points per layer**. Scrolling drives a camera that **descends through a vertical stack** of layer platforms floating in a dark void (the protocol-stack metaphor: top = start of transaction, bottom = physical-world delivery).
- A **clickable side navigator** (vertical, fixed) lets the user jump to any layer; it shows each layer's name + a **maturity dot**.
- Flow: **Intro screen → 7 layer stations (descending) → Outro screen.**
- The **buyer agent ATLAS** is a recognizable glowing 3D construct that **travels down the stack with the camera** — the visitor follows it. The **supplier agent CERES** appears from the Discovery layer onward.
- **Data/messages between agents** render as **animated particle streams / light pulses** along curved (bezier) connecting lines. Make this a signature visual — prominent and beautiful.
- As the camera arrives at a layer, its **explanatory panel animates in** (Framer Motion, slight stagger) beside the 3D visual, and that layer's small **micro-animation** plays (described per layer).
- **Persistent HUD:** top-left = running scenario badge (`Procuring 10t Grade-A wheat · agent: ATLAS`); right = the layer navigator; bottom = **maturity legend** + a subtle scroll hint that fades after first scroll.
- Respect `prefers-reduced-motion`: cut the heavy ambient motion and let users step through layers via the navigator instead of scroll-tweened camera.

## The maturity color system (this is the semantic spine — use it everywhere)

- 🟢 **Emerald `#34D399` — Buildable today**
- 🟡 **Amber `#FBBF24` — Emerging standard**
- 🔴 **Rose `#FB7185` — Open gap / frontier**

Each layer's platform ring, navigator dot, and panel accent are keyed to its maturity. The legend explains the three.

## The 7 layers (stations) — embed this content

Write panel copy from **the buyer agent's POV** ("You, ATLAS, must now…"). Protocol names render as **monospace chips**. Each panel has: title, one-line purpose, a short body, protocol chips, and a `Today vs. Gap` note.

**Layer 0 — MISSION** · maturity: neutral/foundation
Purpose: The human defines the mission and hands you your authority. Everything below is bounded by this.
Body: You receive **hard constraints** (price ≤ $X/ton, delivery ≤ 10 days, quality = Grade A), **soft preferences** (sustainable farms, high reliability), a **budget cap**, and a **cryptographic power-of-attorney** to commit funds up to a limit.
Chips: `Mandate` `Hard constraints` `Soft preferences` `Spend cap`
Visual: ATLAS "wakes up"; a glowing mandate manifest docks into it; constraints float in as labeled chips and lock.
Today vs. Gap: Fully buildable today — structured intent + scoped authorization is standard engineering.

**Layer 1 — IDENTITY & TRUST** · maturity: 🟡 amber
Purpose: Before anyone transacts, each agent must prove who it is and that it's authorized to act for its company.
Body: You present a verifiable identity; CERES does the same. This is the bedrock the whole stack rests on — no trust, no transaction.
Chips: `DID` `Verifiable Credentials` `FIDO`
Visual: ATLAS presents a credential token; a trust handshake pulse; a faint structural "foundation" grid implies everything above depends on this.
Today vs. Gap: The credential/signing tech is emerging and usable. The **legal force** — that an agent's signature actually *binds* the principal — is unsettled.

**Layer 2 — DISCOVERY** · maturity: 🟡 amber
Purpose: You find candidate supplier agents and their catalogs.
Body: You scan a field of suppliers, filter by your constraints, and shortlist. Each agent reaches its *own* company's systems (ERP, inventory, pricing) over **MCP**; agents find *each other* over **A2A** via published "agent cards." Think SEO, but for agents.
Chips: `A2A` `Agent cards` `Registry` `MCP (own tools)`
Visual: ATLAS emits a scan; a field of supplier nodes; non-matching ones dim, a few light up; **CERES emerges** as the chosen counterparty.
Today vs. Gap: A2A transport + agent cards are emerging. Most suppliers today still run conventional systems, not agents; open-market discovery + portable reputation is early.

**Layer 3 — NEGOTIATION** · maturity: 🔴 rose (open gap)
Purpose: You and CERES bargain over the *full* terms — not just price, but quality tolerances, delivery (Incoterms), penalties, force majeure.
Body: A **negotiation state machine** runs: `RFQ_SENT → QUOTED → COUNTERED → {ACCEPTED | REVISED | REJECTED} → AGREED`. Each of you is bounded by a private policy (you: max price, latest delivery, risk ceiling; CERES: margin floor, capacity). Rounds are asynchronous and can run long — which needs durable, stateful "agent-host" infrastructure.
Chips: `RFQ schema (JSON-LD)` `State machine` `Bounded policy` `A2A transport`
Visual: animated multi-round exchange — proposal pulses flying between ATLAS and CERES; a live **terms board** where values (price, qty, delivery) converge across rounds until they **lock**.
Today vs. Gap: You can build this **bilaterally today**. But there is **no adopted cross-vendor standard** for negotiating complex terms — that's the gap.

**Layer 4 — AGREEMENT & CONTRACT** · maturity: 🟡 amber
Purpose: The agreed terms become a signed, machine-readable contract you both commit to.
Body: The converged terms are sealed into a contract that both agents sign. In the emerging stack this is **AP2 mandates**, carried as **W3C Verifiable Credentials** (Intent / Cart / Payment).
Chips: `AP2 mandates` `W3C VC` `Signed terms`
Visual: the locked terms object gets cryptographically sealed — both signatures snap onto it; it becomes a glowing contract artifact.
Today vs. Gap: AP2 is emerging (announced 2025, 60+ partners incl. Mastercard, PayPal, Coinbase). **Legal enforceability** of an agent-signed contract is the open question.

**Layer 5 — SETTLEMENT** · maturity: 🟢 emerald
Purpose: Payment is committed conditionally — held, released only on verified delivery.
Body: Funds move into conditional escrow against the contract and wait. The rails already exist; AP2 wraps them with a cryptographic audit trail; stablecoin rails are available via an **x402** extension.
Chips: `Card / bank rails` `AP2 payment mandate` `x402 (stablecoin)` `Conditional escrow`
Visual: funds flow into an escrow vault that visibly **locks**; a "pending delivery" state pulses.
Today vs. Gap: The most solved layer — rails, conditional release, and audit trail all exist. (The remaining gap is legal: an AI compliantly committing funds *unattended*.)

**Layer 6 — FULFILLMENT & ATTESTATION** · maturity: 🔴 rose (the wall)
Purpose: Confirm the physical goods actually arrived and met spec — the trigger that releases payment.
Body: Oracles report back from the physical world — third-party inspection, IoT sensor logs, a digital scale, a certificate of analysis (COA), the Bill of Lading (BoL). Only a verified result releases the escrow.
Chips: `Oracle` `IoT attestation` `COA / BoL` `Dispute hook`
Visual: the digital stack **meets the physical world** at a threshold/membrane. The wheat arrives; an inspector/oracle verifies it; on success the escrow **releases** and payment completes. Treat this as the frontier — render the boundary as something ATLAS reaches but **cannot fully cross alone** today.
Today vs. Gap: **The** open gap. There's no trustless, tamper-resistant way to verify physical reality that an agent can rely on unattended — today a human/inspector is in the loop. This is the "contact with reality" wall.

**Outro — TRANSACTION COMPLETE**
Headline: *"Shipment arrived."*
Body: The human, who only set the constraints at the top, sees one notification at the bottom. Recap: nearly everything digital — identity, discovery, contract, settlement — is buildable or emerging; the two **walls** are the **negotiation standard** and **physical attestation**, with the meta-blocker being **legal liability + the trust to run unattended**. Closing line: *Today this runs human-in-the-loop (approve the deal, inspect the goods). Full autonomy waits on the law and the loading dock.*
Include a compact maturity recap (the 7 layers with their colored dots) and a restart/scroll-to-top control.

## Design system — make it premium and distinctive

**Mood:** cinematic systems visualization meets high-end dev-tool launch. Deep space void, precise neon-accented data structures, confident and engineered. No rounded-corner pastel SaaS clichés, no generic gradients-on-white.

**Background / environment:** very dark, deep navy-black gradient (`#05060A → #0A0D16`), faint volumetric fog for depth, a subtle drifting particle/star field. Layer platforms float in this void with clear depth separation.

**Color (semantic, used with restraint):**
- Buyer agent **ATLAS** = electric cyan `#22D3EE` (the protagonist color, the journey thread)
- Supplier agent **CERES** = violet `#A78BFA`
- Maturity = emerald `#34D399` / amber `#FBBF24` / rose `#FB7185` (kept distinct from the agent colors)
- Text = off-white `#E6EAF2`, muted `#8A93A6`
- Let emissive accents do the work against the dark; avoid large flat color fills.

**Typography:**
- Display/headings: **Space Grotesk** (geometric grotesk).
- Body: **Inter**.
- Technical/mono (protocol chips, state-machine states, data labels, numeric readouts): **JetBrains Mono** (or IBM Plex Mono). The mono is essential for the "wire-protocol" feel.

**3D materials & lighting:** stylized PBR — emissive glowing edges/rings, subtle glass/metallic platform surfaces, rim lighting, soft IBL/environment light. Each layer platform is a distinct geometric form (e.g., a faceted disc/hex with a wireframe + an emissive ring in its maturity color) labelled in mono. Agent constructs are glowing nodes with a particle aura (cyan for ATLAS, violet for CERES). Use **bloom** generously but tastefully on emissive elements; optional shallow **depth-of-field** to focus the active layer; fog for depth.

**Motion & feel:** weighty, eased camera descent (ease-in-out, never linear). Constant gentle ambient motion so nothing is static — slow float, slow rotation, pulsing emissives. Parallax on background layers. Data pulses travel along the bezier links between agents. UI panels slide+fade in with slight stagger. Target a smooth 60fps.

(Audio optional — if trivial, a subtle ambient hum + soft UI ticks behind a default-off toggle. Skip rather than ship something janky.)

## Performance, responsiveness, accessibility

- Use **instanced** geometry for particle fields; keep poly counts controlled; gate heavy postprocessing on capability (drei `<PerformanceMonitor>` / `<AdaptiveDpr>`).
- **Desktop-first** for the full 3D experience. On mobile, degrade gracefully — a simpler scene or a clean scroll-stacked layered explainer that preserves all content — rather than breaking or chugging.
- Honor `prefers-reduced-motion` (stop camera tweening + ambient motion; enable step navigation).
- All copy must be real and readable; provide sufficient contrast for text over the 3D background (use subtle backdrop blur/scrim behind panels).

## Definition of done

1. `npm install && npm run dev` runs with **no console errors**; `npm run build` succeeds.
2. All **7 layers + intro + outro** are present with the exact content and **correct maturity tags** above.
3. Scroll-driven descending camera works, with **snap points** and a working **clickable navigator**.
4. ATLAS + CERES constructs render; **data-flow particle streams** between them work; the negotiation **terms board converges** across rounds; settlement escrow **locks**; fulfillment **releases** on verification.
5. Cohesive premium visual identity per the design system — bloom, fog, mono technical labels, the agent/maturity color logic. **No placeholder lorem, no generic template look.**
6. Responsive + reduced-motion handled; reasonable performance on a mid-range laptop.
7. Content lives in `src/data/layers.ts`; components are modular; a short `README.md` documents how to run and how to edit content.

## Build process (do it in this order, verifying as you go)

1. Scaffold Vite + React + TS; install all deps; wire Tailwind + fonts.
2. Stand up the R3F canvas: dark environment, fog, particle starfield, camera, lighting. Verify it renders.
3. Build **one** layer platform + the ATLAS construct + one Framer-Motion panel **end to end** as the template. Verify.
4. Move all copy into `layers.ts`; generate all 7 platforms down the vertical stack from data; add CERES.
5. Add `<ScrollControls>` camera descent with snap points + the side navigator + HUD (scenario badge, maturity legend).
6. Add the signature interactions: inter-agent data-flow particles, the negotiation terms board, settlement lock, fulfillment release.
7. Add postprocessing (bloom, optional DoF), ambient motion, parallax, panel stagger.
8. Build intro + outro screens.
9. Pass on performance (instancing, adaptive dpr), responsiveness, reduced-motion, contrast.
10. Run dev + build, fix all errors, write the README.

You may refine the visual metaphor if you find something stronger — but you must hit the **content accuracy**, the **maturity honesty**, the **buyer-agent POV**, and the **premium bar**.