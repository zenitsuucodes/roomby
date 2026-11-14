import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Scoreboard } from './Scoreboard'
import { store, useStore } from '../lib/store'
import { addOns, frequencies, price, rooms, services, type AddOnKey, type Frequency, type RoomKey, type Service } from '../lib/pricing'

function Seg<T extends string>({ id, value, options, onChange, label }: { id: string; value: T; options: { v: T; label: string; note?: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div className="seg" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.v} type="button" role="radio" aria-checked={value === o.v} onClick={() => onChange(o.v)}>
          {value === o.v && <motion.span layoutId={`seg-${id}`} className="seg-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="seg-label">{o.label}{o.note && <small>{o.note}</small>}</span>
        </button>
      ))}
    </div>
  )
}

export function Estimator() {
  const s = useStore((x) => x.service)
  const f = useStore((x) => x.frequency)
  const counts = useStore((x) => x.counts)
  const extras = useStore((x) => x.addOns)
  const q = price({ service: s, frequency: f, counts, addOns: extras })
  const roomCount = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <section className="section build" id="build">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">Prices</span>
          <h2>Build your clean. <mark>Watch the price.</mark></h2>
          <p>Same numbers as the home up top. Change anything and the board updates instantly. No surprise fees at the door.</p>
        </div>
        <LayoutGroup>
          <div className="build-grid">
            <div className="build-controls">
              <fieldset>
                <legend>1 · Type of clean</legend>
                <Seg<Service> id="service" label="Type of clean" value={s} onChange={store.setService}
                  options={(Object.keys(services) as Service[]).map((k) => ({ v: k, label: services[k].label }))} />
                <p className="hint">{services[s].blurb}</p>
              </fieldset>

              <fieldset>
                <legend>2 · Rooms</legend>
                <div className="counters">
                  {(Object.keys(rooms) as RoomKey[]).map((k) => (
                    <div key={k} className={`counter ${counts[k] > 0 ? 'on' : ''}`}>
                      <div>
                        <strong>{rooms[k].label}</strong>
                        <small>${Math.round(rooms[k].price * services[s].factor)} each</small>
                      </div>
                      <div className="stepper">
                        <button type="button" aria-label={`Remove one ${rooms[k].single.toLowerCase()}`} onClick={() => store.setCount(k, counts[k] - 1)} disabled={counts[k] === 0}>−</button>
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.output key={counts[k]} initial={{ y: -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 14, opacity: 0 }} aria-label={`${counts[k]} ${rooms[k].label}`}>
                            {counts[k]}
                          </motion.output>
                        </AnimatePresence>
                        <button type="button" aria-label={`Add one ${rooms[k].single.toLowerCase()}`} onClick={() => store.setCount(k, counts[k] + 1)} disabled={counts[k] >= rooms[k].max}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>3 · Extras</legend>
                <div className="tags">
                  {(Object.keys(addOns) as AddOnKey[]).map((k, i) => (
                    <motion.button key={k} type="button" className="tag" aria-pressed={extras[k]} onClick={() => store.toggleAddOn(k)}
                      whileTap={{ scale: 0.92 }} style={{ rotate: extras[k] ? (i % 2 ? 2 : -2) : 0 }}>
                      <span className="tag-check" aria-hidden="true">{extras[k] ? '✓' : '+'}</span>
                      {addOns[k].label} <small>${addOns[k].price}</small>
                    </motion.button>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend>4 · How often</legend>
                <Seg<Frequency> id="freq" label="How often" value={f} onChange={store.setFrequency}
                  options={(Object.keys(frequencies) as Frequency[]).map((k) => ({ v: k, label: frequencies[k].label, note: s === 'moveout' ? undefined : frequencies[k].note }))} />
                {s === 'moveout' && <p className="hint">Move in / out cleans are one-time, so no repeat discount applies.</p>}
              </fieldset>
            </div>

            <aside className="receipt" aria-label="Your price">
              <div className="receipt-top">
                <span className="mini-label">{roomCount ? 'Your price per clean' : 'Add a room to start'}</span>
                <Scoreboard value={roomCount ? q.total : 0} label="Price per clean" />
              </div>
              <dl>
                <div><dt>Clean</dt><dd>{services[s].label}</dd></div>
                <div><dt>Rooms</dt><dd>{roomCount || '—'}</dd></div>
                <div><dt>Extras</dt><dd>{Object.values(extras).filter(Boolean).length || '—'}</dd></div>
                <div><dt>Crew time</dt><dd>{roomCount ? `${q.hours} hrs · 2 cleaners` : '—'}</dd></div>
                {q.discount > 0 && roomCount > 0 && <div className="save"><dt>Repeat saving</dt><dd>−{Math.round(q.discount * 100)}%</dd></div>}
              </dl>
              {q.minimumApplied && roomCount > 0 && <p className="hint">Includes our $99 minimum visit.</p>}
              <button className="btn lemon block" disabled={!roomCount} onClick={() => store.openBooking(true)}>
                {roomCount ? 'Request this clean' : 'Pick at least one room'}
              </button>
              <p className="fine">Taxes extra. You confirm a time with us before anything is charged.</p>
            </aside>
          </div>
        </LayoutGroup>
      </div>
    </section>
  )
}
