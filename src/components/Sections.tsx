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
const PN = '#1E2A7A'
function PlanArt({ k }: { k: number }) {
  if (k === 0) return (
    <svg className="plan-art" viewBox="0 0 200 90" aria-hidden="true">
      <rect x="6" y="10" width="110" height="74" rx="10" fill="#fff" stroke={PN} strokeWidth="3" />
      <path d="M6 30 h110" stroke={PN} strokeWidth="3" />
      <rect x="6" y="10" width="110" height="20" rx="10" fill="#FF7A59" />
      <path d="M6 30 h110" stroke={PN} strokeWidth="3" />
      <rect x="6" y="10" width="110" height="74" rx="10" fill="none" stroke={PN} strokeWidth="3" />
      <path d="M30 4 v12 M92 4 v12" stroke={PN} strokeWidth="4" strokeLinecap="round" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 16 + (i % 7) * 14
        const y = 40 + Math.floor(i / 7) * 20
        const on = i % 7 === 2 || i % 7 === 5
        return on
          ? <path key={i} d={`M${x - 4} ${y + 4} l3 4 l7 -9`} fill="none" stroke="#2D4BE0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          : <circle key={i} cx={x} cy={y + 4} r="2.5" fill={PN} opacity=".25" />
      })}
      <g transform="translate(150 6) rotate(18)">
        <path d="M8 0 V54" stroke="#C8955A" strokeWidth="5" strokeLinecap="round" />
        <path d="M-6 54 h28 l6 26 h-40z" fill="#FFE14D" stroke={PN} strokeWidth="3" strokeLinejoin="round" />
        <path d="M-2 62 l-4 18 M8 62 v18 M18 62 l4 18" stroke={PN} strokeWidth="2" />
      </g>
    </svg>
  )
  if (k === 1) return (
    <svg className="plan-art" viewBox="0 0 200 90" aria-hidden="true">
      <path d="M18 36 h64 l-8 50 h-48z" fill="#2D4BE0" stroke={PN} strokeWidth="3" strokeLinejoin="round" />
      <path d="M22 36 q28 -26 56 0" fill="none" stroke={PN} strokeWidth="3" />
      {[[30, 30, 9], [46, 26, 11], [62, 30, 8], [40, 16, 6], [58, 14, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" stroke={PN} strokeWidth="2" />)}
      <path d="M30 52 h40" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".5" />
      <g transform="translate(104 8)">
        <path d="M14 0 h22 l8 10 h-10 v8 h-20z" fill={PN} />
        <path d="M8 18 h36 l4 60 a6 6 0 0 1 -6 6 h-32 a6 6 0 0 1 -6 -6z" fill="#7FE0C2" stroke={PN} strokeWidth="3" strokeLinejoin="round" />
        <rect x="14" y="40" width="24" height="18" rx="4" fill="#fff" stroke={PN} strokeWidth="2" />
        <path d="M48 6 l8 -4 M48 10 h10 M48 14 l8 4" stroke={PN} strokeWidth="2" strokeLinecap="round" />
      </g>
      <path d="M176 22 l3 9 l9 3 l-9 3 l-3 9 l-3 -9 l-9 -3 l9 -3z" fill="#fff" stroke={PN} strokeWidth="2" strokeLinejoin="round" />
      <path d="M186 58 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2z" fill={PN} />
    </svg>
  )
  return (
    <svg className="plan-art" viewBox="0 0 200 90" aria-hidden="true">
      <rect x="10" y="44" width="58" height="42" rx="3" fill="#E9B872" stroke={PN} strokeWidth="3" />
      <path d="M10 56 h58 M39 44 v12" stroke={PN} strokeWidth="2.5" />
      <rect x="31" y="44" width="16" height="12" fill="#FFE14D" opacity=".8" />
      <rect x="72" y="52" width="48" height="34" rx="3" fill="#E9B872" stroke={PN} strokeWidth="3" />
      <path d="M72 62 h48" stroke={PN} strokeWidth="2.5" />
      <rect x="22" y="12" width="44" height="32" rx="3" fill="#F4CB8E" stroke={PN} strokeWidth="3" />
      <path d="M22 22 h44 M44 12 v10" stroke={PN} strokeWidth="2.5" />
      <path d="M80 70 h16 M80 76 h10" stroke={PN} strokeWidth="2" strokeLinecap="round" />
      <path d="M30 32 l6 4 l6 -4" fill="none" stroke={PN} strokeWidth="2" />
      <g transform="translate(140 18)">
        <path d="M0 0 h34 l12 14 l-12 14 h-34z" fill="#fff" stroke={PN} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="36" cy="14" r="3.5" fill={PN} />
        <path d="M6 9 h20 M6 17 h14" stroke={PN} strokeWidth="2" strokeLinecap="round" />
        <path d="M40 16 q8 26 -4 40" fill="none" stroke={PN} strokeWidth="2" />
        <circle cx="34" cy="60" r="7" fill="none" stroke="#2D4BE0" strokeWidth="3.5" />
        <path d="M30 66 l-6 14 l4 2 M27 74 l4 2" fill="none" stroke="#2D4BE0" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  )
}

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
                  <PlanArt k={i} />
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
        {b.shape !== 'cloth' && <>
          <path d={b.shape === 'jug' ? 'M28 84 q34 -8 64 0' : b.shape === 'squeeze' ? 'M36 70 q24 -8 48 0' : 'M32 86 q28 -8 56 0'} fill="none" stroke="#1E2A7A" strokeOpacity=".3" strokeWidth="2.5" />
          <path d={`M${b.shape === 'jug' ? 34 : 40} 92 v60`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".6" />
          <path d={`M${b.shape === 'jug' ? 34 : 40} 160 v8`} stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity=".6" />
          {[0, 1, 2].map((k) => (
            <motion.circle key={k} cx={52 + k * 10} cy={172} r={2.5 + (k % 2)} fill="#fff" opacity=".8"
              animate={{ cy: [174, 96], opacity: [0, 0.9, 0] }} transition={{ repeat: Infinity, duration: 2.4 + k * 0.5, delay: k * 0.7, ease: 'easeOut' }} />
          ))}
        </>}
        {b.shape === 'cloth' && <>
          <path d="M30 96 q30 -18 60 -4" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".6" />
          <path d="M60 170 l6 10 l6 -10" fill="#FFE14D" stroke="#1E2A7A" strokeWidth="2" strokeLinejoin="round" />
        </>}
        <rect x="36" y="112" width="48" height="40" rx="6" fill="#fff" stroke="#1E2A7A" strokeWidth="2" />
        <path d="M54 128 q3 -10 13 -9 q-1 9 -13 9z M54 128 l8 -6" fill="#3DBE8B" stroke="#1E2A7A" strokeWidth="1.2" strokeLinejoin="round" />
        <text x="60" y="144" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#1E2A7A">roomby</text>
        {b.shape === 'spray' && on && [0, 1, 2, 3, 4].map((k) => (
          <motion.circle key={k} r={2 + (k % 3)} fill={b.color} stroke="#1E2A7A" strokeWidth="1"
            initial={{ cx: 86, cy: 38, opacity: 1 }} animate={{ cx: 100 + k * 6, cy: 26 + (k % 3) * 9 - k * 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 0.7, delay: k * 0.08 }} />
        ))}
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
          <svg className="map-overlay" viewBox="0 0 120 80" preserveAspectRatio="none">
            <path d="M44 80 C 60 72, 80 76, 92 70 S 112 72, 120 66 V 80 Z" fill="#9FD8FF" opacity=".55" />
            <motion.path d="M54 77 q4 -2 8 0 t8 0 M84 75 q4 -2 8 0 t8 0 M100 70 q4 -2 8 0" fill="none" stroke="#2D4BE0" strokeWidth=".8" strokeLinecap="round" animate={{ x: [0, 3, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} />
            <path id="hw401" d="M0 22 C 30 20, 60 26, 120 20" fill="none" stroke="#1E2A7A" strokeWidth="1.6" strokeDasharray="3 2" opacity=".55" />
            <path d="M6 76 C 30 62, 50 58, 86 56" fill="none" stroke="#1E2A7A" strokeWidth="1.6" strokeDasharray="3 2" opacity=".55" />
          </svg>
          <svg className="map-tower" viewBox="0 0 20 60" aria-hidden="true">
            <path d="M9 0 h2 v16 l2 2 v4 l-1 1 l1 34 h-8 l1 -34 l-1 -1 v-4 l2 -2z" fill="#1E2A7A" />
            <ellipse cx="10" cy="20" rx="5" ry="3" fill="#FFE14D" stroke="#1E2A7A" strokeWidth="1.5" />
          </svg>
          <motion.span className="map-van" animate={{ left: ['2%', '92%'] }} transition={{ repeat: Infinity, duration: 9, ease: 'linear' }}>
            <svg viewBox="0 0 40 22" aria-hidden="true"><path d="M2 4 h24 l8 7 v7 h-32z" fill="#fff" stroke="#1E2A7A" strokeWidth="2" strokeLinejoin="round" /><path d="M26 6 v5 h7" fill="#9FD8FF" stroke="#1E2A7A" strokeWidth="2" /><rect x="6" y="9" width="14" height="5" rx="2.5" fill="#FFE14D" /><circle cx="9" cy="19" r="3" fill="#1E2A7A" /><circle cx="27" cy="19" r="3" fill="#1E2A7A" /></svg>
          </motion.span>
          <span className="map-label t-label">Toronto</span>
          <span className="map-label m-label">Mississauga</span>
        </div>
      </div>
    </section>
  )
}

/* ---------- FAQ: draggable sticky notes ---------- */
const D = '#1E2A7A'
const doodles = [
  <svg key="key" viewBox="0 0 60 40"><circle cx="14" cy="20" r="9" fill="none" stroke={D} strokeWidth="3" /><path d="M23 20 h30 M44 20 v8 M50 20 v6" stroke={D} strokeWidth="3" strokeLinecap="round" /></svg>,
  <svg key="shield" viewBox="0 0 60 40"><path d="M30 3 l16 6 v10 c0 10 -7 16 -16 19 c-9 -3 -16 -9 -16 -19 v-10z" fill="#fff" stroke={D} strokeWidth="3" strokeLinejoin="round" /><path d="M23 20 l5 5 l9 -10" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" /></svg>,
  <svg key="cal" viewBox="0 0 60 40"><rect x="12" y="7" width="36" height="30" rx="4" fill="#fff" stroke={D} strokeWidth="3" /><path d="M12 15 h36 M20 3 v8 M40 3 v8" stroke={D} strokeWidth="3" strokeLinecap="round" /><path d="M22 25 l12 0 M30 21 l4 4 l-4 4" fill="none" stroke="#FF7A59" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  <svg key="spray" viewBox="0 0 60 40"><path d="M22 3 h12 l5 5 h-5 v4 h-12z" fill={D} /><path d="M18 12 h20 v22 a4 4 0 0 1 -4 4 h-12 a4 4 0 0 1 -4 -4z" fill="#7FE0C2" stroke={D} strokeWidth="3" /><path d="M42 5 l6 -2 M42 9 h7 M42 13 l6 2" stroke={D} strokeWidth="2.5" strokeLinecap="round" /></svg>,
  <svg key="paw" viewBox="0 0 60 40"><ellipse cx="30" cy="27" rx="9" ry="8" fill={D} /><circle cx="18" cy="16" r="4" fill={D} /><circle cx="25" cy="9" r="4" fill={D} /><circle cx="35" cy="9" r="4" fill={D} /><circle cx="42" cy="16" r="4" fill={D} /></svg>,
  <svg key="card" viewBox="0 0 60 40"><rect x="8" y="6" width="44" height="28" rx="5" fill="#fff" stroke={D} strokeWidth="3" /><path d="M8 14 h44" stroke={D} strokeWidth="5" /><rect x="14" y="22" width="10" height="7" rx="1.5" fill="#FFE14D" stroke={D} strokeWidth="1.5" /><path d="M30 26 h16" stroke={D} strokeWidth="2.5" strokeLinecap="round" /></svg>,
]

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
              <span className="tape" aria-hidden="true" />
              <span className="note-doodle" aria-hidden="true">{doodles[i]}</span>
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
