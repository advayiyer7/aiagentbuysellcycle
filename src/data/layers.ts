// All per-layer copy lives here so content is trivial to edit.
// Written from the buyer agent's (ATLAS) point of view.

export type Maturity = 'foundation' | 'today' | 'emerging' | 'gap'

export interface MaturityMeta {
  label: string
  color: string
  dot: string
}

export const MATURITY: Record<Maturity, MaturityMeta> = {
  foundation: { label: 'Foundation', color: '#8A93A6', dot: '#8A93A6' },
  today: { label: 'Buildable today', color: '#34D399', dot: '#34D399' },
  emerging: { label: 'Emerging standard', color: '#FBBF24', dot: '#FBBF24' },
  gap: { label: 'Open gap / frontier', color: '#FB7185', dot: '#FB7185' },
}

export const AGENT = {
  atlas: { name: 'ATLAS', role: 'Buyer agent', color: '#22D3EE' },
  ceres: { name: 'CERES', role: 'Supplier agent', color: '#A78BFA' },
} as const

export interface Layer {
  /** Stable id / station key */
  id: string
  /** "Layer 0", "Layer 1", … (empty for intro/outro) */
  index: string
  title: string
  maturity: Maturity
  purpose: string
  body: string
  chips: string[]
  todayVsGap: string
  /** Short caption describing the layer's micro-animation. */
  visual: string
}

export const INTRO = {
  kicker: 'Agent-to-Agent Procurement',
  title: 'The Stack',
  subtitle:
    'An autonomous transaction, descended one layer at a time — told from the buyer agent’s point of view.',
  scenario:
    'You are ATLAS. Your mission: procure 10 tons of Grade-A wheat. Your counterparty will be a supplier agent named CERES.',
  hint: 'Scroll to descend the stack',
}

export const OUTRO = {
  headline: 'Shipment arrived.',
  body: 'The human, who only set the constraints at the top, sees one notification at the bottom. Nearly everything digital — identity, discovery, contract, settlement — is buildable or emerging. The two walls are the negotiation standard and physical attestation, with the meta-blocker being legal liability and the trust to run unattended.',
  closing:
    'Today this runs human-in-the-loop — approve the deal, inspect the goods. Full autonomy waits on the law and the loading dock.',
}

export const LAYERS: Layer[] = [
  {
    id: 'mission',
    index: 'Layer 0',
    title: 'Mission',
    maturity: 'foundation',
    purpose:
      'The human defines the mission and hands you your authority. Everything below is bounded by this.',
    body: 'You, ATLAS, wake up to a mandate. You receive hard constraints (price ≤ $X/ton, delivery ≤ 10 days, quality = Grade A), soft preferences (sustainable farms, high reliability), a budget cap, and a cryptographic power-of-attorney to commit funds up to a limit.',
    chips: ['Mandate', 'Hard constraints', 'Soft preferences', 'Spend cap'],
    todayVsGap:
      'Fully buildable today — structured intent plus scoped authorization is standard engineering.',
    visual:
      'ATLAS wakes; a glowing mandate manifest docks into it; constraints float in as labeled chips and lock.',
  },
  {
    id: 'identity',
    index: 'Layer 1',
    title: 'Identity & Trust',
    maturity: 'emerging',
    purpose:
      'Before anyone transacts, each agent must prove who it is and that it is authorized to act for its company.',
    body: 'You present a verifiable identity; CERES does the same. This is the bedrock the whole stack rests on — no trust, no transaction.',
    chips: ['DID', 'Verifiable Credentials', 'FIDO'],
    todayVsGap:
      'The credential and signing tech is emerging and usable. The legal force — that an agent’s signature actually binds the principal — is unsettled.',
    visual:
      'ATLAS presents a credential token; a trust handshake pulse; a faint structural foundation grid implies everything above depends on this.',
  },
  {
    id: 'discovery',
    index: 'Layer 2',
    title: 'Discovery',
    maturity: 'emerging',
    purpose: 'You find candidate supplier agents and their catalogs.',
    body: 'You scan a field of suppliers, filter by your constraints, and shortlist. Each agent reaches its own company’s systems (ERP, inventory, pricing) over MCP; agents find each other over A2A via published agent cards. Think SEO, but for agents.',
    chips: ['A2A', 'Agent cards', 'Registry', 'MCP (own tools)'],
    todayVsGap:
      'A2A transport and agent cards are emerging. Most suppliers today still run conventional systems, not agents; open-market discovery and portable reputation is early.',
    visual:
      'ATLAS emits a scan; a field of supplier nodes; non-matching ones dim, a few light up; CERES emerges as the chosen counterparty.',
  },
  {
    id: 'negotiation',
    index: 'Layer 3',
    title: 'Negotiation',
    maturity: 'gap',
    purpose:
      'You and CERES bargain over the full terms — not just price, but quality tolerances, delivery (Incoterms), penalties, force majeure.',
    body: 'A negotiation state machine runs: RFQ_SENT → QUOTED → COUNTERED → {ACCEPTED | REVISED | REJECTED} → AGREED. Each of you is bounded by a private policy (you: max price, latest delivery, risk ceiling; CERES: margin floor, capacity). Rounds are asynchronous and can run long — which needs durable, stateful agent-host infrastructure.',
    chips: ['RFQ schema (JSON-LD)', 'State machine', 'Bounded policy', 'A2A transport'],
    todayVsGap:
      'You can build this bilaterally today. But there is no adopted cross-vendor standard for negotiating complex terms — that is the gap.',
    visual:
      'An animated multi-round exchange — proposal pulses flying between ATLAS and CERES; a live terms board where price, quantity and delivery converge across rounds until they lock.',
  },
  {
    id: 'agreement',
    index: 'Layer 4',
    title: 'Agreement & Contract',
    maturity: 'emerging',
    purpose:
      'The agreed terms become a signed, machine-readable contract you both commit to.',
    body: 'The converged terms are sealed into a contract that both agents sign. In the emerging stack this is AP2 mandates, carried as W3C Verifiable Credentials (Intent / Cart / Payment).',
    chips: ['AP2 mandates', 'W3C VC', 'Signed terms'],
    todayVsGap:
      'AP2 is emerging (announced 2025, 60+ partners incl. Mastercard, PayPal, Coinbase). Legal enforceability of an agent-signed contract is the open question.',
    visual:
      'The locked terms object gets cryptographically sealed — both signatures snap onto it; it becomes a glowing contract artifact.',
  },
  {
    id: 'settlement',
    index: 'Layer 5',
    title: 'Settlement',
    maturity: 'today',
    purpose: 'Payment is committed conditionally — held, released only on verified delivery.',
    body: 'Funds move into conditional escrow against the contract and wait. The rails already exist; AP2 wraps them with a cryptographic audit trail; stablecoin rails are available via an x402 extension.',
    chips: ['Card / bank rails', 'AP2 payment mandate', 'x402 (stablecoin)', 'Conditional escrow'],
    todayVsGap:
      'The most solved layer — rails, conditional release and audit trail all exist. The remaining gap is legal: an AI compliantly committing funds unattended.',
    visual:
      'Funds flow into an escrow vault that visibly locks; a pending-delivery state pulses.',
  },
  {
    id: 'fulfillment',
    index: 'Layer 6',
    title: 'Fulfillment & Attestation',
    maturity: 'gap',
    purpose:
      'Confirm the physical goods actually arrived and met spec — the trigger that releases payment.',
    body: 'Oracles report back from the physical world — third-party inspection, IoT sensor logs, a digital scale, a certificate of analysis (COA), the Bill of Lading (BoL). Only a verified result releases the escrow.',
    chips: ['Oracle', 'IoT attestation', 'COA / BoL', 'Dispute hook'],
    todayVsGap:
      'The open gap. There is no trustless, tamper-resistant way to verify physical reality that an agent can rely on unattended — today a human/inspector is in the loop. This is the contact-with-reality wall.',
    visual:
      'The digital stack meets the physical world at a membrane. The wheat arrives; an oracle verifies it; on success the escrow releases — a boundary ATLAS reaches but cannot fully cross alone today.',
  },
]

// Stations include the intro at the top and the outro at the bottom.
export const STATION_COUNT = LAYERS.length + 2 // intro + 7 layers + outro
