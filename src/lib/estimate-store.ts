import { useSyncExternalStore } from 'react'

import type { RenovationType } from './pricing'

export type SavedEstimate = {
  area: number
  type: RenovationType
  extras: string[]
  min: number
  max: number
}

let current: SavedEstimate | null = null
const listeners = new Set<() => void>()

export function saveEstimate(estimate: SavedEstimate | null) {
  current = estimate
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useSavedEstimate() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  )
}
