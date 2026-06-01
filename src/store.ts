import { create } from 'zustand'
import { STATION_COUNT } from './data/layers'

interface AppState {
  /** Active station index: 0 = intro, 1..7 = layers, 8 = outro. */
  active: number
  setActive: (i: number) => void
  /** Continuous scroll offset 0..1 across the whole journey. */
  offset: number
  setOffset: (o: number) => void
  /** Whether the user has scrolled at all (used to fade the hint). */
  scrolled: boolean
  setScrolled: (v: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (v: boolean) => void
  /** Imperative jump used by the navigator + outro restart. */
  scrollTo: (index: number) => void
  setScrollTo: (fn: (index: number) => void) => void
}

export const useStore = create<AppState>((set) => ({
  active: 0,
  setActive: (i) => set({ active: i }),
  offset: 0,
  setOffset: (o) => set({ offset: o }),
  scrolled: false,
  setScrolled: (v) => set({ scrolled: v }),
  reducedMotion: false,
  setReducedMotion: (v) => set({ reducedMotion: v }),
  scrollTo: () => {},
  setScrollTo: (fn) => set({ scrollTo: fn }),
}))

export const STATIONS = STATION_COUNT
