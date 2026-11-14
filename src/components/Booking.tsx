import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { store, useStore } from '../lib/store'
import { addOns, frequencies, price, rooms, services, type AddOnKey, type RoomKey } from '../lib/pricing'

const schema = z.object({
  date: z.string().min(1, 'Pick a day.'),
  window: z.enum(['morning', 'midday', 'afternoon'], { message: 'Pick an arrival window.' }),
  postal: z.string().trim().regex(/^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/, 'Enter a full postal code, like M4M 1A1.'),
  entry: z.enum(['home', 'key', 'concierge']),
  name: z.string().trim().min(2, 'Enter your name.'),
  phone: z.string().trim().regex(/^[\d\s()+.-]{10,20}$/, 'Enter a phone number we can text.'),
  email: z.string().trim().email('Enter a valid email.'),
  notes: z.string().max(600).optional(),
})
type Form = z.infer<typeof schema>

const windows = [
  { v: 'morning', label: '8 to 10 am' },
  { v: 'midday', label: '11 am to 1 pm' },
  { v: 'afternoon', label: '2 to 4 pm' },
] as const

function nextDays(n: number) {
  const out: { iso: string; dow: string; day: number; mon: string }[] = []
  const d = new Date()
  d.setDate(d.getDate() + 2)
  while (out.length < n) {
    if (d.getDay() !== 0) {
      out.push({ iso: d.toISOString().slice(0, 10), dow: d.toLocaleDateString('en-CA', { weekday: 'short' }), day: d.getDate(), mon: d.toLocaleDateString('en-CA', { month: 'short' }) })
    }
    d.setDate(d.getDate() + 1)
  }
  return out
}

export function Booking() {
  const open = useStore((s) => s.bookingOpen)
  const counts = useStore((s) => s.counts)
  const service = useStore((s) => s.service)
  const frequency = useStore((s) => s.frequency)
  const extras = useStore((s) => s.addOns)
  const q = price({ counts, service, frequency, addOns: extras })
  const days = useMemo(() => nextDays(12), [])
  const [form, setForm] = useState<Partial<Form>>({ date: '', postal: '', entry: 'home', name: '', phone: '', email: '', notes: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [done, setDone] = useState<string | null>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prevFocus = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    setTimeout(() => panel.current?.querySelector<HTMLElement>('button, input')?.focus(), 350)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && store.openBooking(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      prevFocus?.focus()
    }
  }, [open])

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((e) => ({ ...e, [k]: '' }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const r = schema.safeParse(form)
    if (!r.success) {
      const errs: Record<string, string> = {}
      r.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message })
      setErrors(errs)
      panel.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      return
    }
    setDone(`RB-${Math.random().toString(36).slice(2, 7).toUpperCase()}`)
  }

  const summary = (Object.keys(rooms) as RoomKey[]).filter((k) => counts[k]).map((k) => `${counts[k]} ${counts[k] > 1 ? rooms[k].label.toLowerCase() : rooms[k].single.toLowerCase()}`).join(', ')
  const extraList = (Object.keys(addOns) as AddOnKey[]).filter((k) => extras[k]).map((k) => addOns[k].label.toLowerCase())
  const inv = (k: string) => (errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `${k}-e` } : {})
  const err = (k: string) => errors[k] && <span className="err" id={`${k}-e`}>{errors[k]}</span>
  const chosenDay = days.find((d) => d.iso === form.date)

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => store.openBooking(false)}>
          <motion.div ref={panel} className="drawer" role="dialog" aria-modal="true" aria-labelledby="book-title"
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 260, damping: 32 }}
            onClick={(e) => e.stopPropagation()}>
            <button className="drawer-close" aria-label="Close" onClick={() => store.openBooking(false)}>×</button>
            {done ? (
              <motion.div className="booked" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <motion.div className="booked-badge" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: -8 }} transition={{ type: 'spring', stiffness: 220, damping: 12 }}>Request sent</motion.div>
                <h2 id="book-title">Thanks, {form.name?.split(' ')[0]}!</h2>
                <p>Reference <strong>{done}</strong>. This is a request, not a confirmed booking yet.</p>
                <ol>
                  <li>We check crew availability for {chosenDay ? `${chosenDay.dow} ${chosenDay.mon} ${chosenDay.day}` : 'your day'}, {windows.find((w) => w.v === form.window)?.label}.</li>
                  <li>We text {form.phone} within 2 hours to confirm, or to offer the nearest open time.</li>
                  <li>Nothing is charged until the clean is done.</li>
                </ol>
                <button className="btn lemon" onClick={() => { store.openBooking(false); setDone(null) }}>Done</button>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate>
                <span className="eyebrow">Request a clean</span>
                <h2 id="book-title">When should we come?</h2>
                <div className="drawer-summary">
                  <div>
                    <strong>{services[service].label}</strong>
                    <span>{summary || 'No rooms yet'}{extraList.length ? ` + ${extraList.join(', ')}` : ''}</span>
                    <span>{service === 'moveout' ? 'One-time' : frequencies[frequency].label} · about {q.hours} hrs</span>
                  </div>
                  <b>${q.total}</b>
                </div>

                <fieldset>
                  <legend>Day</legend>
                  <div className="days" {...inv('date')} tabIndex={-1}>
                    {days.map((d) => (
                      <button key={d.iso} type="button" aria-pressed={form.date === d.iso} onClick={() => set('date', d.iso)}>
                        <small>{d.dow}</small><strong>{d.day}</strong><small>{d.mon}</small>
                      </button>
                    ))}
                  </div>
                  {err('date')}
                </fieldset>

                <fieldset>
                  <legend>Arrival window</legend>
                  <div className="seg small" role="radiogroup" aria-label="Arrival window" {...inv('window')} tabIndex={-1}>
                    {windows.map((w) => (
                      <button key={w.v} type="button" role="radio" aria-checked={form.window === w.v} onClick={() => set('window', w.v)}>
                        <span className="seg-label">{w.label}</span>
                      </button>
                    ))}
                  </div>
                  {err('window')}
                </fieldset>

                <div className="fields">
                  <label>Postal code<input value={form.postal ?? ''} onChange={(e) => set('postal', e.target.value.toUpperCase())} placeholder="M4M 1A1" autoComplete="postal-code" {...inv('postal')} />{err('postal')}</label>
                  <label>How do we get in?
                    <select value={form.entry} onChange={(e) => set('entry', e.target.value as Form['entry'])}>
                      <option value="home">I'll be home</option>
                      <option value="key">Key or lockbox code</option>
                      <option value="concierge">Concierge or front desk</option>
                    </select>
                  </label>
                  <label>Name<input value={form.name ?? ''} onChange={(e) => set('name', e.target.value)} autoComplete="name" {...inv('name')} />{err('name')}</label>
                  <label>Mobile<input type="tel" value={form.phone ?? ''} onChange={(e) => set('phone', e.target.value)} autoComplete="tel" placeholder="416 555 0100" {...inv('phone')} />{err('phone')}</label>
                  <label className="full">Email<input type="email" value={form.email ?? ''} onChange={(e) => set('email', e.target.value)} autoComplete="email" {...inv('email')} />{err('email')}</label>
                  <label className="full">Notes for the crew <small>(optional)</small><textarea rows={3} value={form.notes ?? ''} onChange={(e) => set('notes', e.target.value)} placeholder="Pets, parking, rooms to skip" /></label>
                </div>
                <button className="btn lemon block" type="submit">Send request · ${q.total}</button>
                <p className="fine">We confirm by text before anything is booked. Free changes up to 24 hours before.</p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
