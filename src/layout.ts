import { LAYERS } from './data/layers'

// Vertical spacing between stations in world units (negative = descending).
export const STATION_GAP = 18

/** World-space Y for a station index (0 = intro … last = outro). */
export function stationY(index: number): number {
  return -index * STATION_GAP
}

/** World-space Y for a given layer (0..6). Layers begin one station below intro. */
export function layerY(layerIndex: number): number {
  return stationY(layerIndex + 1)
}

/** Stations: intro (0), layers (1..N), outro (N+1). */
export const TOTAL_STATIONS = LAYERS.length + 2
export const INTRO_STATION = 0
export const OUTRO_STATION = TOTAL_STATIONS - 1

// CERES sits off to the side of ATLAS once it appears (Discovery onward).
export const CERES_OFFSET_X = 4.2
export const ATLAS_OFFSET_X = -2.4
