export type Service = 'standard' | 'deep' | 'moveout'
export type Frequency = 'once' | 'weekly' | 'biweekly' | 'monthly'
export type RoomKey = 'bedrooms' | 'bathrooms' | 'kitchen' | 'living' | 'laundry'
export type AddOnKey = 'oven' | 'fridge' | 'windows' | 'baseboards' | 'folding'

export const services: Record<Service, { label: string; blurb: string; factor: number; minutes: number }> = {
  standard: { label: 'Standard', blurb: 'Dust, wipe, vacuum, mop. The weekly reset.', factor: 1, minutes: 1 },
  deep: { label: 'Deep clean', blurb: 'Standard plus grout, inside cabinets fronts, behind things.', factor: 1.6, minutes: 1.7 },
  moveout: { label: 'Move in / out', blurb: 'Empty home, every surface, inside every cupboard.', factor: 1.9, minutes: 2 },
}

export const rooms: Record<RoomKey, { label: string; single: string; price: number; minutes: number; max: number }> = {
  bedrooms: { label: 'Bedrooms', single: 'Bedroom', price: 25, minutes: 25, max: 6 },
  bathrooms: { label: 'Bathrooms', single: 'Bathroom', price: 32, minutes: 35, max: 5 },
  kitchen: { label: 'Kitchen', single: 'Kitchen', price: 45, minutes: 45, max: 1 },
  living: { label: 'Living areas', single: 'Living area', price: 22, minutes: 20, max: 3 },
  laundry: { label: 'Laundry room', single: 'Laundry room', price: 15, minutes: 15, max: 1 },
}

export const addOns: Record<AddOnKey, { label: string; price: number; minutes: number }> = {
  oven: { label: 'Inside the oven', price: 35, minutes: 30 },
  fridge: { label: 'Inside the fridge', price: 30, minutes: 25 },
  windows: { label: 'Interior windows', price: 40, minutes: 40 },
  baseboards: { label: 'Baseboards, hand-wiped', price: 25, minutes: 25 },
  folding: { label: 'Laundry wash and fold', price: 20, minutes: 30 },
}

export const frequencies: Record<Frequency, { label: string; discount: number; note: string }> = {
  once: { label: 'Just once', discount: 0, note: '' },
  weekly: { label: 'Weekly', discount: 0.2, note: 'Save 20%' },
  biweekly: { label: 'Every 2 weeks', discount: 0.15, note: 'Save 15%' },
  monthly: { label: 'Monthly', discount: 0.1, note: 'Save 10%' },
}

export const MINIMUM = 99
export const CREW = 2

export type Quote = {
  service: Service
  frequency: Frequency
  counts: Record<RoomKey, number>
  addOns: Record<AddOnKey, boolean>
}

export function price(q: Quote) {
  const s = services[q.service]
  let roomsTotal = 0
  let minutes = 0
  for (const k of Object.keys(rooms) as RoomKey[]) {
    roomsTotal += rooms[k].price * q.counts[k]
    minutes += rooms[k].minutes * q.counts[k]
  }
  roomsTotal *= s.factor
  minutes *= s.minutes
  let extras = 0
  for (const k of Object.keys(addOns) as AddOnKey[]) {
    if (q.addOns[k]) {
      extras += addOns[k].price
      minutes += addOns[k].minutes
    }
  }
  const subtotal = Math.max(MINIMUM, roomsTotal + extras)
  const discount = q.service === 'moveout' ? 0 : frequencies[q.frequency].discount
  const total = Math.round(subtotal * (1 - discount))
  const hours = Math.max(1.5, Math.round((minutes / CREW / 60) * 2) / 2)
  return { subtotal: Math.round(subtotal), discount, total, hours, minimumApplied: roomsTotal + extras < MINIMUM }
}
