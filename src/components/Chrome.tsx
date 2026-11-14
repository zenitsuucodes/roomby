import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { store } from '../lib/store'

export const brand = { name: 'Roomby', phone: '(416) 555-0193', phoneHref: '+14165550193', credit: 'https://builtbydhanush.com' }

const links = [
  ['How it works', '#how'],
  ['Prices', '#build'],
  ["What's included", '#included'],
  ['Where we clean', '#area'],
  ['FAQ', '#faq'],
]

export function Logo() {
  return (
    <a href="#top" className="logo" aria-label="Roomby home">
      <svg viewBox="0 0 34 34" aria-hidden="true">
        <rect x="2" y="2" width="30" height="30" rx="9" fill="#FFE14D" stroke="#1E2A7A" strokeWidth="2.5" />
        <path d="M9 24V15l8-6 8 6v9" fill="none" stroke="#1E2A7A" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="24.5" cy="9.5" r="3" fill="#FF7A59" />
      </svg>
      <span>roomby</span>
    </a>
  )
}

export function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 30))
  return (
    <>
      <header className={`nav ${solid ? 'solid' : ''}`}>
        <div className="wrap nav-inner">
          <Logo />
          <nav aria-label="Main">
            {links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          </nav>
          <div className="nav-actions">
            <a className="nav-phone" href={`tel:${brand.phoneHref}`}>{brand.phone}</a>
            <a className="btn lemon small" href="#build">Get my price</a>
            <button className="burger" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}><span /><span /></button>
          </div>
        </div>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div className="sheet" role="dialog" aria-modal="true" aria-label="Menu" initial={{ y: '-100%' }} animate={{ y: 0 }} exit={{ y: '-100%' }} transition={{ type: 'spring', stiffness: 220, damping: 28 }}>
            <div className="sheet-top"><Logo /><button className="burger x" aria-label="Close menu" onClick={() => setOpen(false)}>×</button></div>
            <nav aria-label="Mobile">
              {links.map(([l, h], i) => (
                <motion.a key={h} href={h} onClick={() => setOpen(false)} initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>{l}</motion.a>
              ))}
            </nav>
            <a className="btn lemon block" href="#build" onClick={() => setOpen(false)}>Get my price</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function BigCta() {
  return (
    <section className="bigcta">
      <div className="wrap">
        <motion.h2 initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ type: 'spring', stiffness: 90, damping: 14 }}>
          Your Saturday<br />called. It wants <mark>itself back.</mark>
        </motion.h2>
        <div className="bigcta-actions">
          <a className="btn ink" href="#top">Pick rooms in the house</a>
          <button className="btn outline-ink" onClick={() => store.openBooking(true)}>Request a clean</button>
        </div>
      </div>
      {[...Array(7)].map((_, i) => (
        <motion.span key={i} className="bubble" aria-hidden="true" style={{ left: `${8 + i * 13}%`, width: 20 + (i % 3) * 18, height: 20 + (i % 3) * 18 }}
          animate={{ y: [40, -260], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 5 + i * 0.7, delay: i * 0.8, ease: 'easeOut' }} />
      ))}
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo />
            <p>Room-by-room home cleaning in Toronto and Mississauga. Vetted crews, plant-based products, a price you see before you book.</p>
          </div>
          <div>
            <h4>Talk to us</h4>
            <a href={`tel:${brand.phoneHref}`}>{brand.phone}</a>
            <span>Mon to Sat, 7 am to 7 pm</span>
          </div>
          <div>
            <h4>Explore</h4>
            {links.map(([l, h]) => <a key={h} href={h}>{l}</a>)}
          </div>
        </div>
        <div className="footer-word" aria-hidden="true">roomby</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Roomby Home Cleaning. Insured and bonded.</span>
          <a href={brand.credit}>Website by Dhanush</a>
        </div>
      </div>
    </footer>
  )
}
