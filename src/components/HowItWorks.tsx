import { motion } from 'framer-motion'

/* Three steps, each with its own little 2D animation drawn in SVG. */

const draw = { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] as const } } }

function TapArt() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      <motion.rect x="40" y="18" width="140" height="124" rx="16" fill="#fff" stroke="#1E2A7A" strokeWidth="3" variants={draw} />
      {[0, 1, 2].map((i) => (
        <motion.rect key={i} x="58" y={38 + i * 32} width="104" height="22" rx="8" fill={i === 1 ? '#FFE14D' : '#E4E8F8'}
          variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: 0.3 + i * 0.15, duration: 0.5 } } }} style={{ originX: 0 }} />
      ))}
      <motion.g variants={{ hidden: { x: 60, y: 40, opacity: 0 }, show: { x: 0, y: 0, opacity: 1, transition: { delay: 0.8, type: 'spring', stiffness: 120 } } }}>
        <circle cx="140" cy="82" r="10" fill="#FF7A59" />
        <motion.circle cx="140" cy="82" r="10" fill="none" stroke="#FF7A59" strokeWidth="2"
          animate={{ r: [10, 26], opacity: [0.9, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: 1.2 }} />
      </motion.g>
    </svg>
  )
}

function VanArt() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      <motion.path d="M10 128 H210" stroke="#1E2A7A" strokeWidth="3" strokeDasharray="10 10" variants={draw} />
      <motion.g variants={{ hidden: { x: -150 }, show: { x: 0, transition: { delay: 0.2, duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}>
        <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>
          <path d="M40 72 h88 l28 22 v26 h-116z" fill="#fff" stroke="#1E2A7A" strokeWidth="3" strokeLinejoin="round" />
          <path d="M128 76 v18 h24" fill="#9FD8FF" stroke="#1E2A7A" strokeWidth="3" />
          <rect x="52" y="86" width="56" height="14" rx="7" fill="#FFE14D" />
          <text x="80" y="97" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1E2A7A">roomby</text>
        </motion.g>
        <circle cx="68" cy="122" r="11" fill="#1E2A7A" /><circle cx="68" cy="122" r="4" fill="#fff" />
        <circle cx="134" cy="122" r="11" fill="#1E2A7A" /><circle cx="134" cy="122" r="4" fill="#fff" />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.path key={i} d={`M${14 + i * 4} ${84 + i * 12} h${16 - i * 3}`} stroke="#FF7A59" strokeWidth="3" strokeLinecap="round"
          animate={{ x: [0, -10, 0], opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }} />
      ))}
    </svg>
  )
}

function SparkleArt() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      <motion.path d="M30 140 V70 L110 22 L190 70 V140 Z" fill="#fff" stroke="#1E2A7A" strokeWidth="3" strokeLinejoin="round" variants={draw} />
      <motion.rect x="92" y="96" width="36" height="44" rx="4" fill="#FFE14D" stroke="#1E2A7A" strokeWidth="3"
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { delay: 0.6 } } }} style={{ originY: 1 }} />
      {[[54, 40, 1], [168, 34, 0.8], [176, 96, 0.6], [44, 92, 0.7]].map(([x, y, s], i) => (
        <motion.path key={i} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill={i % 2 ? '#FF7A59' : '#2D4BE0'}
          style={{ x, y }} animate={{ scale: [0, s, 0], rotate: [0, 90] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.9 + i * 0.35 }} />
      ))}
    </svg>
  )
}

const steps = [
  { n: '01', title: 'Pick your rooms', text: 'Tap rooms, add extras, choose how often. The price is the price you see.', art: <TapArt />, tone: 'lemon' },
  { n: '02', title: 'We show up', text: 'A two-person crew arrives in your window with every supply and tool. You do not need to be home.', art: <VanArt />, tone: 'white' },
  { n: '03', title: 'Come home to clean', text: 'Every room on the checklist, done. Not happy with a spot? We come back within 48 hours, free.', art: <SparkleArt />, tone: 'coral' },
]

export function HowItWorks() {
  return (
    <section className="section how" id="how">
      <div className="wrap">
        <div className="section-head">
          <span className="eyebrow">How it works</span>
          <h2>Three taps between you and a <mark>clean home.</mark></h2>
        </div>
        <div className="how-grid">
          {steps.map((s, i) => (
            <motion.article
              key={s.n}
              className={`how-card tone-${s.tone}`}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={{ hidden: { opacity: 0, y: 60, rotate: i === 1 ? 0 : i === 0 ? -3 : 3 }, show: { opacity: 1, y: 0, rotate: i === 1 ? 0 : i === 0 ? -1.5 : 1.5, transition: { delay: i * 0.12, type: 'spring', stiffness: 90, damping: 14 } } }}
              whileHover={{ y: -8, rotate: 0 }}
            >
              <span className="how-n">{s.n}</span>
              <div className="how-art">{s.art}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
