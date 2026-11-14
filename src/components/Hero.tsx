import { lazy, Suspense } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Scoreboard } from './Scoreboard'
import { store, useStore } from '../lib/store'
import { frequencies, price, rooms, type RoomKey } from '../lib/pricing'

const House3D = lazy(() => import('./House3D'))

export function Hero() {
  const reduced = useReducedMotion() ?? false
  const counts = useStore((s) => s.counts)
  const service = useStore((s) => s.service)
  const frequency = useStore((s) => s.frequency)
  const addOns = useStore((s) => s.addOns)
  const q = price({ counts, service, frequency, addOns })
  const picked = (Object.keys(rooms) as RoomKey[]).filter((k) => counts[k] > 0)
  const empty = picked.length === 0

  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap hero-inner">
        <div className="hero-copy">
          <motion.span className="sticker tilt-l" initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: -8 }} transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 14 }}>
            Toronto + Mississauga
          </motion.span>
          <h1>
            {['Pick a room.', 'We’ll do the rest.'].map((line, i) => (
              <span className="line" key={line}>
                <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ delay: 0.1 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                  {i === 1 ? <>We’ll do the <mark>rest.</mark></> : line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="lede" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            Click the rooms you want cleaned in the little home. Your price updates as you go, and a vetted two-person crew does the rest.
          </motion.p>

          <motion.div className="hero-price" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
            <div>
              <span className="mini-label">{empty ? 'Starting from' : service === 'moveout' || frequency === 'once' ? 'Your one-time clean' : 'Per clean, ' + frequencies[frequency].label.toLowerCase()}</span>
              <Scoreboard value={empty ? 99 : q.total} label="Estimated price" />
            </div>
            <div className="hero-picked" aria-live="polite">
              <AnimatePresence initial={false}>
                {empty ? (
                  <motion.span key="none" className="pill ghost" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>No rooms yet</motion.span>
                ) : (
                  picked.map((k) => (
                    <motion.span key={k} layout className="pill" initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
                      {counts[k] > 1 ? `${counts[k]} ${rooms[k].label.toLowerCase()}` : rooms[k].single}
                    </motion.span>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <button className="btn lemon" onClick={() => store.openBooking(true)} disabled={empty} title={empty ? 'Add a room first' : undefined}>
              {empty ? 'Add a room to book' : `Book this clean · ${q.hours} hrs`}
            </button>
            <a className="btn outline-light" href="#build">Fine-tune it</a>
          </motion.div>
        </div>

        <motion.div className="hero-stage" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
          <Suspense fallback={<div className="house-wrap" />}>
            <House3D reduced={reduced} />
          </Suspense>
          <span className="sticker round" aria-hidden="true">
            <svg viewBox="0 0 132 132" className="spin"><defs><path id="ring" d="M66 66 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" /></defs><text><textPath href="#ring" textLength="285" lengthAdjust="spacing">tap a room · tap a room ·</textPath></text></svg>
            <span className="arrowmark"><svg viewBox="0 0 24 24"><path d="M5 3l14 7-6 2-2 6z" fill="#fff" stroke="#1E2A7A" strokeWidth="1.8" strokeLinejoin="round" /></svg></span>
          </span>
        </motion.div>
      </div>
    </section>
  )
}
