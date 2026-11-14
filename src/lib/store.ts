import { useSyncExternalStore } from 'react'
import type { AddOnKey, Frequency, Quote, RoomKey, Service } from './pricing'
import { rooms } from './pricing'

/** A tiny shared store: the 3D house in the hero and the estimator edit the same quote. */
type State = Quote & { bookingOpen: boolean; lastAdded: string | null }

let state: State = {
  service: 'standard',
  frequency: 'biweekly',
  counts: { bedrooms: 0, bathrooms: 0, kitchen: 0, living: 0, laundry: 0 },
  addOns: { oven: false, fridge: false, windows: false, baseboards: false, folding: false },
  bookingOpen: false,
  lastAdded: null,
}
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const set = (patch: Partial<State>) => {
  state = { ...state, ...patch }
  emit()
}

export const store = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l)
    return () => listeners.delete(l)
  },
  setService: (service: Service) => set({ service }),
  setFrequency: (frequency: Frequency) => set({ frequency }),
  setCount: (key: RoomKey, value: number) => {
    const v = Math.max(0, Math.min(rooms[key].max, value))
    set({ counts: { ...state.counts, [key]: v }, lastAdded: v > state.counts[key] ? rooms[key].single : state.lastAdded })
  },
  toggleAddOn: (key: AddOnKey) => set({ addOns: { ...state.addOns, [key]: !state.addOns[key] } }),
  openBooking: (open: boolean) => set({ bookingOpen: open }),
  reset: () => set({ counts: { bedrooms: 0, bathrooms: 0, kitchen: 0, living: 0, laundry: 0 } }),
}

export function useStore<T>(select: (s: State) => T): T {
  return useSyncExternalStore(store.subscribe, () => select(state), () => select(state))
}
