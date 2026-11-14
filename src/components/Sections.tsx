import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { store } from '../lib/store'
import { price, type Frequency, type Service } from '../lib/pricing'

const planPrice = (service: Service, frequency: Frequency) =>
  '$' + price({ service, frequency, counts: { bedrooms: 2, bathrooms: 1, kitchen: 1, living: 1, laundry: 0 }, addOns: { oven: false, fridge: false, windows: false, baseboards: false, folding: false } }).total

/* ---------- Marquee ---------- */
export function Marquee({ items, tone = 'lemon', reverse = false }: { items: string[]; tone?: 'lemon' | 'navy'; reverse?: boolean }) {
  const list = [...items, ...items, ...items]
  return (
    <div className={`marquee ${tone}`} aria-hidden="true">
      <div className={`marquee-track ${reverse ? 'rev' : ''}`}>
        {list.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}
      </div>
    </div>
  )
}

/* ---------- Plans: flip cards ---------- */
const plans: { name: string; tag: string; service: Service; frequency: Frequency; per: string; front: string; back: string[]; tone: string }[] = [
  { name: 'Keep it fresh', tag: 'Most booked', service: 'standard', frequency: 'biweekly', per: 'per visit, every 2 weeks · 2 bed, 1 bath', front: 'The regular reset for busy weeks.', back: ['Every room dusted, wiped and vacuumed', 'Kitchen and bathrooms sanitized', 'Beds made, bins out', 'Same crew each visit when possible'], tone: 'lemon' },
  { name: 'Fresh start', tag: 'First visit', service: 'deep', frequency: 'once', per: 'one-time · 2 bed, 1 bath', front: 'The catch-up clean before a routine.', back: ['Everything in Keep it fresh', 'Grout, tile and fixtures scrubbed', 'Baseboards, door frames, switches', 'Behind and under movable furniture'], tone: 'coral' },
  { name: 'Move day', tag: 'Empty homes', service: 'moveout', frequency: 'once', per: 'one-time · 2 bed, 1 bath', front: 'Get your deposit back.', back: ['Inside every cupboard and drawer', 'Inside oven and fridge included', 'Walls spot-cleaned', 'Photo report sent to you'], tone: 'mint' },
]

export function Plans() {
  const [flipped, setFlipped] = useState<number | null>(null)
  return (
    <section className="section plans" id="plans">
      <div className="wrap">
        <div className="section-head light">
          <span className="eyebrow">Popular plans</span>
          <h2>Not sure where to start? <mark>Flip one.</mark></h2>
        </div>
        <div className="plan-grid">
          {plans.map((p, i) => (
            <motion.div key={p.name} className="plan" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ delay: i * 0.1, type: 'spring', stiffness: 90, damping: 15 }}>
              <motion.div className="plan-inner" animate={{ rotateY: flipped === i ? 180 : 0 }} transition={{ type: 'spring', stiffness: 120, damping: 16 }}>
                <div className={`plan-face front tone-${p.tone}`}>
                  <span className="sticker small">{p.tag}</span>
                  <h3>{p.name}</h3>
                  <p>{p.front}</p>
                  <div className="plan-price"><strong>{planPrice(p.service, p.frequency)}</strong><span>{p.per}</span></div>
                  <button type="button" className="btn ink" onClick={() => setFlipped(i)} aria-expanded={flipped === i}>What's included</button>
                </div>
                <div className={`plan-face back tone-${p.tone}`} aria-hidden={flipped !== i}>
                  <h3>{p.name}</h3>
                  <ul>{p.back.map((b) => <li key={b}>{b}</li>)}</ul>
                  <div className="plan-actions">
                    <button type="button" className="btn ink" tabIndex={flipped === i ? 0 : -1} onClick={() => {
                      store.setService(p.service); store.setFrequency(p.frequency)
                      store.setCount('bedrooms', 2); store.setCount('bathrooms', 1); store.setCount('kitchen', 1); store.setCount('living', 1)
                      document.getElementById('build')?.scrollIntoView({ behavior: 'smooth' })
                    }}>Use this plan</button>
                    <button type="button" className="btn ghost-ink" tabIndex={flipped === i ? 0 : -1} onClick={() => setFlipped(null)}>Back</button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Checklist: ticks itself as it scrolls in ---------- */
const lists: Record<string, string[]> = {
  Kitchen: ['Counters and backsplash degreased', 'Stovetop and hood wiped', 'Outside of appliances polished', 'Sink scrubbed and shined', 'Floors vacuumed and mopped', 'Bins emptied, new liners'],
  Bathroom: ['Toilet cleaned inside and out', 'Tub and shower scrubbed', 'Mirrors and glass streak-free', 'Taps and fixtures polished', 'Floors mopped behind the toilet', 'Towels folded or hung'],
  Bedroom: ['Surfaces and shelves dusted', 'Beds made, sheets changed on request', 'Mirrors cleaned', 'Floors vacuumed, under the bed too', 'Lamps and switches wiped', 'Tidied, not rearranged'],
  'Living areas': ['Dusting high and low', 'Sofa vacuumed and cushions fluffed', 'Glass tables streak-free', 'Floors vacuumed and mopped', 'Remote controls disinfected', 'Throws folded'],
}

export function Checklist() {
  const [tab, setTab] = useState('Kitchen')
  return (
    <section className="section checklist" id="included">
      <div className="wrap check-grid">
        <div className="section-head">
          <span className="eyebrow">What's included</span>
          <h2>"Clean" means <mark>this list.</mark></h2>
          <p>Every crew works from the same checklist and ticks it off in the app before they leave. You get a copy.</p>
          <div className="room-tabs" role="tablist" aria-label="Rooms">
            {Object.keys(lists).map((k) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>
                {tab === k && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                <span>{k}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="clipboard" role="tabpanel" aria-label={`${tab} checklist`}>
          <div className="clip" aria-hidden="true" />
          <AnimatePresence mode="wait">
            <motion.ul key={tab} initial="hidden" whileInView="show" exit={{ opacity: 0, x: -30 }} viewport={{ once: false, amount: 0.4 }}>
              {lists[tab].map((item, i) => (
                <motion.li key={item} variants={{ hidden: { opacity: 0.35 }, show: { opacity: 1, transition: { delay: 0.15 + i * 0.22 } } }}>
                  <svg viewBox="0 0 28 28" aria-hidden="true">
                    <rect x="2" y="2" width="24" height="24" rx="7" fill="#fff" stroke="#1E2A7A" strokeWidth="2" />
                    <motion.path d="M8 14.5l4 4 8-9" fill="none" stroke="#2D4BE0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      variants={{ hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { delay: 0.25 + i * 0.22, duration: 0.35 } } }} />
                  </svg>
                  <span>{item}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <div className="signoff">Checked by your crew lead<span>✎</span></div>
        </div>
      </div>
    </section>
  )
}

/* ---------- Supplies: bobbing 2D bottles ---------- */
const bottles = [
  { name: 'All-purpose', color: '#7FE0C2', cap: '#1E2A7A', note: 'Plant-based, unscented on request', shape: 'spray' },
  { name: 'Glass', color: '#9FD8FF', cap: '#FF7A59', note: 'Streak-free, ammonia-free', shape: 'spray' },
  { name: 'Floor', color: '#FFE14D', cap: '#1E2A7A', note: 'Safe for hardwood and pets', shape: 'jug' },
  { name: 'Bathroom', color: '#FFB3A1', cap: '#2D4BE0', note: 'Cuts limescale without bleach', shape: 'squeeze' },
  { name: 'Microfibre', color: '#C9CEE6', cap: '#FFE14D', note: 'Colour-coded per room, washed hot', shape: 'cloth' },
]

function Bottle({ b, i }: { b: (typeof bottles)[number]; i: number }) {
  const [on, setOn] = useState(false)
  return (
    <motion.button type="button" className={`bottle ${on ? 'on' : ''}`} onClick={() => setOn((v) => !v)} onHoverStart={() => setOn(true)} onHoverEnd={() => setOn(false)}
      aria-expanded={on} aria-label={`${b.name}: ${b.note}`}
      animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2.6 + i * 0.3, delay: i * 0.2, ease: 'easeInOut' }}>
      <motion.svg viewBox="0 0 120 200" animate={{ rotate: on ? (i % 2 ? 8 : -8) : 0 }} transition={{ type: 'spring', stiffness: 200, damping: 10 }}>
        {b.shape === 'spray' && <>
          <path d="M44 30 h30 l10 14 h-12 v12 h-28z" fill={b.cap} />
          <rect x="34" y="56" width="52" height="16" rx="4" fill={b.cap} />
          <path d="M30 72 h60 v104 a14 14 0 0 1 -14 14 h-32 a14 14 0 0 1 -14 -14z" fill={b.color} stroke="#1E2A7A" strokeWidth="3" />
        </>}
        {b.shape === 'jug' && <>
          <rect x="46" y="34" width="28" height="18" rx="4" fill={b.cap} />
          <path d="M24 70 q0 -18 22 -18 h28 q22 0 22 18 v106 a14 14 0 0 1 -14 14 h-44 a14 14 0 0 1 -14 -14z" fill={b.color} stroke="#1E2A7A" strokeWidth="3" />
          <path d="M84 74 q16 0 16 18 v24 q0 12 -12 12" fill="none" stroke="#1E2A7A" strokeWidth="3" />
        </>}
        {b.shape === 'squeeze' && <>
          <path d="M50 22 l10 -12 l10 12 v16 h-20z" fill={b.cap} />
          <path d="M34 50 q26 -14 52 0 v126 a14 14 0 0 1 -14 14 h-24 a14 14 0 0 1 -14 -14z" fill={b.color} stroke="#1E2A7A" strokeWidth="3" />
        </>}
        {b.shape === 'cloth' && <>
          <path d="M18 90 q42 -30 84 0 v80 q-42 26 -84 0z" fill={b.color} stroke="#1E2A7A" strokeWidth="3" />
          <path d="M18 112 q42 -26 84 0 M18 134 q42 -26 84 0" fill="none" stroke="#1E2A7A" strokeWidth="2" strokeDasharray="4 6" />
        </>}
        <rect x="36" y="112" width="48" height="40" rx="6" fill="#fff" stroke="#1E2A7A" strokeWidth="2" />
        <text x="60" y="137" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1E2A7A">roomby</text>
      </motion.svg>
      <span className="bottle-name">{b.name}</span>
      <AnimatePresence>
        {on && <motion.span className="bottle-note" initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.8 }}>{b.note}</motion.span>}
      </AnimatePresence>
    </motion.button>
  )
}

export function Supplies() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const shelfX = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])
  return (
    <section ref={ref} className="section supplies" id="supplies">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">We bring everything</span>
          <h2>Gentle on homes. <mark>Tough on grime.</mark></h2>
          <p>Plant-based products, colour-coded cloths and HEPA vacuums come with every crew. Hover a bottle to read the label.</p>
        </div>
        <motion.div className="shelf" style={{ x: shelfX }}>
          {bottles.map((b, i) => <Bottle key={b.name} b={b} i={i} />)}
        </motion.div>
        <div className="shelf-plank" aria-hidden="true" />
      </div>
    </section>
  )
}

/* ---------- Area check ---------- */
const served: Record<string, string> = {
  M4: 'East and central Toronto', M5: 'Downtown Toronto', M6: 'West Toronto', M2: 'North York', M3: 'North York', M8: 'Etobicoke', M9: 'Etobicoke and York', M1: 'Scarborough', M7: 'Toronto',
  L5: 'Mississauga', L4: 'Mississauga (north)',
}

export function AreaCheck() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<null | { ok: boolean; text: string }>(null)
  const [err, setErr] = useState('')
  const check = (e: React.FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase().replace(/\s+/g, '')
    if (!/^[A-Z]\d[A-Z](\d[A-Z]\d)?$/.test(c)) {
      setErr('Enter a postal code like M4M 1A1 or just the first three characters.')
      setResult(null)
      return
    }
    setErr('')
    const area = served[c.slice(0, 2)]
    if (c.startsWith('L4') && !['L4T', 'L4V', 'L4W', 'L4X', 'L4Y', 'L4Z'].includes(c.slice(0, 3))) {
      setResult({ ok: false, text: `Not yet. We cover Mississauga and Toronto right now, and we're growing.` })
      return
    }
    setResult(area ? { ok: true, text: `Yes, we clean in ${area}. Most weeks have openings within 3 days.` } : { ok: false, text: `Not yet. We cover Toronto and Mississauga right now, and we're growing.` })
  }
  const dots = Array.from({ length: 96 }, (_, i) => i)
  return (
    <section className="section area" id="area">
      <div className="wrap area-grid">
        <div>
          <span className="eyebrow">Where we clean</span>
          <h2>Are you in <mark>our patch?</mark></h2>
          <form className="area-form" onSubmit={check} noValidate>
            <label htmlFor="pc" className="visually-hidden">Postal code</label>
            <input id="pc" placeholder="M4M 1A1" value={code} autoComplete="postal-code" onChange={(e) => { setCode(e.target.value); setErr('') }} aria-invalid={!!err} aria-describedby={err ? 'pc-err' : undefined} />
            <button className="btn ink" type="submit">Check</button>
          </form>
          {err && <p id="pc-err" className="err">{err}</p>}
          <AnimatePresence mode="wait">
            {result && (
              <motion.p key={result.text} className={`area-result ${result.ok ? 'ok' : 'no'}`} role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <span aria-hidden="true">{result.ok ? '✓' : '✕'}</span> {result.text}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
        <div className="dotmap" aria-hidden="true">
          {dots.map((i) => {
            const col = i % 12
            const row = Math.floor(i / 12)
            const inTO = col > 3 && col < 11 && row > 1 && row < 7
            const inMiss = col < 5 && row > 3
            const lit = inTO || inMiss
            return (
              <motion.span key={i} className={lit ? (inMiss && !inTO ? 'm' : 't') : ''}
                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: (col + row) * 0.03, type: 'spring', stiffness: 260, damping: 14 }} />
            )
          })}
          <span className="map-label t-label">Toronto</span>
          <span className="map-label m-label">Mississauga</span>
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ: draggable sticky notes ---------- */
const faqs = [
  ['Do I need to be home?', 'No. Most clients leave a key, lockbox code or concierge note. We text when we arrive and when we leave.'],
  ['Are your cleaners insured?', 'Yes. Every crew member is background-checked, trained in-house and covered by our liability insurance.'],
  ['What if I need to reschedule?', 'Move or cancel any visit free up to 24 hours before. Inside 24 hours there is a $30 late fee.'],
  ['Do you bring supplies?', 'Everything: products, cloths, mops and HEPA vacuums. Tell us if you prefer we use yours.'],
  ['Pets?', 'Love them. Let us know about anyone shy or anyone who might escape out the door.'],
  ['How do I pay?', 'Card on file, charged the evening after each clean so you can tell us about anything first.'],
]

export function FaqNotes() {
  const board = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const tones = ['#FFE14D', '#FFB3A1', '#7FE0C2', '#FFFFFF', '#9FD8FF', '#FFE14D']
  return (
    <section className="section faq" id="faq">
      <div className="wrap">
        <div className="section-head light">
          <span className="eyebrow">Questions</span>
          <h2>Good questions, <mark>stuck to the wall.</mark></h2>
          <p>Drag the notes around. Tap one to read the answer.</p>
        </div>
        <div className="board" ref={board}>
          {faqs.map(([q, a], i) => (
            <motion.div key={q} className={`note ${open === i ? 'open' : ''}`} drag dragConstraints={board} dragElastic={0.15} dragMomentum={false}
              style={{ background: tones[i], rotate: [-4, 3, -2, 5, -3, 2][i] }}
              initial={{ opacity: 0, scale: 0.6 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 14 }}
              whileDrag={{ scale: 1.06, rotate: 0, zIndex: 10 }}>
              <span className="pin" aria-hidden="true" />
              <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                <strong>{q}</strong>
              </button>
              <AnimatePresence initial={false}>
                {open === i && <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>{a}</motion.p>}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
