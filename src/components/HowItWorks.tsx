import { motion } from 'framer-motion'

/* Three steps, each with its own little 2D animation drawn in SVG. */

const draw = { hidden: { pathLength: 0 }, show: { pathLength: 1, transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] as const } } }

const N = '#1E2A7A'
const pop = (d: number) => ({ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { delay: d, type: 'spring' as const, stiffness: 260, damping: 14 } } })

function RowIcon({ k, x, y }: { k: number; x: number; y: number }) {
  // bed, bathtub, pot
  if (k === 0) return <g transform={`translate(${x} ${y})`}><rect x="-7" y="-1" width="14" height="5" rx="1.5" fill={N} /><rect x="-7" y="-5" width="5" height="4" rx="1.5" fill="#fff" stroke={N} strokeWidth="1.5" /><path d="M-7 4v2M7 4v2" stroke={N} strokeWidth="1.5" /></g>
  if (k === 1) return <g transform={`translate(${x} ${y})`}><path d="M-8 -1h16v2a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5z" fill="#9FD8FF" stroke={N} strokeWidth="1.5" /><path d="M-5 -1v-5a2 2 0 0 1 4 0" fill="none" stroke={N} strokeWidth="1.5" /></g>
  return <g transform={`translate(${x} ${y})`}><path d="M-7 -2h14l-1.5 7h-11z" fill="#FF7A59" stroke={N} strokeWidth="1.5" /><path d="M-9 -2h18M-3 -5h6" stroke={N} strokeWidth="1.5" /></g>
}

function TapArt() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      {/* confetti behind the phone */}
      {([[22, 30, '#FF7A59'], [196, 46, '#2D4BE0'], [30, 120, '#7FE0C2'], [200, 128, '#FF7A59']] as [number, number, string][]).map(([x, y, c], i) => (
        <motion.g key={i} variants={pop(0.9 + i * 0.1)}>
          <motion.rect x={x} y={y} width="8" height="8" rx="2" fill={c} animate={{ rotate: [0, 180] }} transition={{ repeat: Infinity, duration: 4 + i, ease: 'linear' }} style={{ originX: `${x + 4}px`, originY: `${y + 4}px` }} />
        </motion.g>
      ))}
      <motion.g variants={pop(0)} style={{ originX: '110px', originY: '80px' }}>
        <rect x="52" y="6" width="116" height="150" rx="18" fill={N} />
        <rect x="57" y="11" width="106" height="140" rx="14" fill="#fff" />
        <rect x="94" y="14" width="32" height="7" rx="3.5" fill={N} />
        <text x="66" y="34" fontSize="9" fontWeight="800" fill={N}>roomby</text>
        <rect x="140" y="26" width="16" height="9" rx="4.5" fill="#FFE14D" stroke={N} strokeWidth="1.2" />
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.g key={i} variants={{ hidden: { x: -20, opacity: 0 }, show: { x: 0, opacity: 1, transition: { delay: 0.3 + i * 0.15 } } }}>
          <rect x="64" y={42 + i * 28} width="92" height="22" rx="8" fill={i === 1 ? '#FFE14D' : '#F1F3FC'} stroke={i === 1 ? N : 'none'} strokeWidth="1.5" />
          <RowIcon k={i} x={76} y={52 + i * 28} />
          <rect x="88" y={48 + i * 28} width={i === 1 ? 30 : 36} height="4" rx="2" fill={N} opacity=".75" />
          <rect x="88" y={55 + i * 28} width="22" height="3" rx="1.5" fill={N} opacity=".3" />
          <rect x="132" y={47 + i * 28} width="18" height="11" rx="5.5" fill={i === 1 ? '#2D4BE0' : '#C9CEE6'} />
          <circle cx={i === 1 ? 144 : 138} cy={52.5 + i * 28} r="4" fill="#fff" />
        </motion.g>
      ))}
      <motion.g variants={pop(0.85)} style={{ originX: '110px', originY: '136px' }}>
        <rect x="64" y="128" width="92" height="16" rx="8" fill="#FF7A59" />
        <text x="110" y="139" textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fff">Book · $148</text>
      </motion.g>
      {/* tapping hand */}
      <motion.g variants={{ hidden: { x: 50, y: 40, opacity: 0 }, show: { x: 0, y: 0, opacity: 1, transition: { delay: 0.8, type: 'spring', stiffness: 120 } } }}>
        <motion.circle cx="150" cy="70" r="8" fill="none" stroke="#FF7A59" strokeWidth="2" animate={{ r: [8, 22], opacity: [0.9, 0] }} transition={{ repeat: Infinity, duration: 1.4, delay: 1.2 }} />
        <path d="M146 82 v-14 a4 4 0 0 1 8 0 v12 l4 -2 a4 4 0 0 1 6 3 l-4 18 a10 10 0 0 1 -10 8 h-6 a10 10 0 0 1 -9 -6 l-6 -12 a3.5 3.5 0 0 1 6 -3.5z" fill="#FFD3BF" stroke={N} strokeWidth="2.2" strokeLinejoin="round" />
        <path d="M154 86v8M160 88v7" stroke={N} strokeWidth="1.6" strokeLinecap="round" />
      </motion.g>
    </svg>
  )
}

function VanArt() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      {/* skyline */}
      <motion.g variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }} fill="#E4E8F8">
        <rect x="8" y="58" width="26" height="70" rx="2" />
        <rect x="38" y="40" width="22" height="88" rx="2" />
        <path d="M70 128 V30 h3 V12 l2 -8 l2 8 V30 h3 V128z" />
        <circle cx="75" cy="34" r="6" />
        <rect x="88" y="50" width="30" height="78" rx="2" />
        <rect x="160" y="62" width="22" height="66" rx="2" />
        <rect x="186" y="46" width="28" height="82" rx="2" />
        {[0, 1, 2, 3, 4].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={42 + c * 9} y={48 + r * 14} width="5" height="7" fill="#fff" />))}
        {[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => <rect key={`b${r}${c}`} x={191 + c * 8} y={54 + r * 15} width="4" height="7" fill="#fff" />))}
      </motion.g>
      <motion.g variants={pop(0.2)} style={{ originX: '140px', originY: '30px' }}>
        <circle cx="140" cy="30" r="12" fill="#FFE14D" />
      </motion.g>
      <motion.g animate={{ x: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}>
        <path d="M108 42 a8 8 0 0 1 14 -4 a7 7 0 0 1 12 6 h-26z" fill="#fff" stroke={N} strokeWidth="2" />
      </motion.g>
      {/* road */}
      <rect x="0" y="128" width="220" height="22" fill="#C9CEE6" />
      <motion.path d="M0 139 H220" stroke="#fff" strokeWidth="3" strokeDasharray="12 10" animate={{ strokeDashoffset: [0, 44] }} transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }} />
      <path d="M0 128 H220" stroke={N} strokeWidth="3" />
      {/* tree */}
      <path d="M190 128 V104" stroke={N} strokeWidth="3" />
      <circle cx="190" cy="96" r="14" fill="#7FE0C2" stroke={N} strokeWidth="2.5" />
      <circle cx="185" cy="92" r="4" fill="#fff" opacity=".6" />
      <motion.g variants={{ hidden: { x: -170 }, show: { x: 0, transition: { delay: 0.2, duration: 1.1, ease: [0.22, 1, 0.36, 1] } } }}>
        <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.6 }}>
          {/* roof rack with a ladder */}
          <path d="M44 66 h80" stroke={N} strokeWidth="3" strokeLinecap="round" />
          <path d="M50 66 v-4 M118 66 v-4" stroke={N} strokeWidth="3" />
          <path d="M52 60 h70 M56 56 h62 M62 56 v4 M74 56 v4 M86 56 v4 M98 56 v4 M110 56 v4" stroke="#FFE14D" strokeWidth="2.5" />
          <path d="M36 70 h92 l28 22 v26 a4 4 0 0 1 -4 4 h-116 z" fill="#fff" stroke={N} strokeWidth="3" strokeLinejoin="round" />
          <path d="M130 74 v18 h22" fill="#9FD8FF" stroke={N} strokeWidth="3" strokeLinejoin="round" />
          <circle cx="140" cy="84" r="4.5" fill="#FFD3BF" stroke={N} strokeWidth="1.6" />
          <path d="M135 82 a5 5 0 0 1 10 0" fill="#FF7A59" stroke={N} strokeWidth="1.6" />
          <path d="M96 72 v46 M100 92 h6" stroke={N} strokeWidth="2.5" />
          <rect x="44" y="80" width="46" height="26" rx="6" fill="#2D4BE0" />
          <rect x="49" y="86" width="36" height="12" rx="6" fill="#FFE14D" />
          <text x="67" y="95.5" textAnchor="middle" fontSize="8.5" fontWeight="800" fill={N}>roomby</text>
          <path d="M150 104 h6 v6 h-6z" fill="#FFE14D" stroke={N} strokeWidth="2" />
          <path d="M34 112 h8 M150 116 h8" stroke={N} strokeWidth="4" strokeLinecap="round" />
        </motion.g>
        {[68, 134].map((cx) => (
          <g key={cx}>
            <circle cx={cx} cy="122" r="11" fill={N} />
            <motion.g animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }} style={{ originX: `${cx}px`, originY: '122px' }}>
              <circle cx={cx} cy="122" r="5" fill="#C9CEE6" />
              <path d={`M${cx - 5} 122 h10 M${cx} 117 v10`} stroke={N} strokeWidth="1.5" />
            </motion.g>
          </g>
        ))}
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} cx={24 - i * 8} cy={114 - i * 4} r={4 + i * 2} fill="#E4E8F8" stroke={N} strokeWidth="1.5"
          animate={{ x: [0, -8], opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }} />
      ))}
    </svg>
  )
}

function SparkleArt() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true">
      <motion.g variants={{ hidden: { rotate: -40, opacity: 0 }, show: { rotate: 0, opacity: 1, transition: { delay: 0.2, duration: 0.8 } } }} style={{ originX: '24px', originY: '22px' }}>
        <circle cx="24" cy="22" r="10" fill="#FFE14D" stroke={N} strokeWidth="2" />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => <path key={k} d="M24 5 v-4" stroke={N} strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${k * 45} 24 22)`} />)}
      </motion.g>
      {/* lawn */}
      <path d="M8 146 q20 -10 40 0 M172 146 q20 -10 40 0" fill="#7FE0C2" stroke={N} strokeWidth="2" />
      {/* house */}
      <motion.path d="M34 146 V74 L110 26 L186 74 V146 Z" fill="#fff" stroke={N} strokeWidth="3" strokeLinejoin="round" variants={draw} />
      <rect x="146" y="34" width="14" height="24" fill="#FF7A59" stroke={N} strokeWidth="2.5" />
      <path d="M26 80 L110 24 L194 80" fill="none" stroke="#FF7A59" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      <motion.g animate={{ y: [0, -6], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <circle cx="153" cy="26" r="4" fill="#E4E8F8" />
      </motion.g>
      <circle cx="110" cy="58" r="8" fill="#9FD8FF" stroke={N} strokeWidth="2.5" />
      <path d="M110 50 v16 M102 58 h16" stroke={N} strokeWidth="1.5" />
      {/* windows with curtains and flower boxes */}
      {[50, 140].map((x) => (
        <g key={x}>
          <rect x={x} y="86" width="30" height="26" rx="3" fill="#9FD8FF" stroke={N} strokeWidth="2.5" />
          <path d={`M${x + 15} 86 v26 M${x} 99 h30`} stroke={N} strokeWidth="1.8" />
          <path d={`M${x + 3} 88 q4 10 0 22 M${x + 27} 88 q-4 10 0 22`} stroke="#FFE14D" strokeWidth="4" fill="none" />
          <path d={`M${x + 6} 93 l6 -4`} stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          <circle cx={x + 6} cy="113" r="3" fill="#FF7A59" /><circle cx={x + 15} cy="112" r="3" fill="#FFE14D" /><circle cx={x + 24} cy="113" r="3" fill="#FF7A59" />
          <rect x={x - 3} y="114" width="36" height="8" rx="2" fill="#7FE0C2" stroke={N} strokeWidth="2" />
        </g>
      ))}
      {/* door, knob, wreath, mat */}
      <motion.rect x="92" y="100" width="36" height="46" rx="4" fill="#FFE14D" stroke={N} strokeWidth="3"
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { delay: 0.6 } } }} style={{ originY: 1 }} />
      <circle cx="121" cy="124" r="2.5" fill={N} />
      <circle cx="110" cy="114" r="7" fill="none" stroke="#3DBE8B" strokeWidth="3.5" />
      <circle cx="110" cy="107" r="2" fill="#FF7A59" />
      <path d="M0 146 H220" stroke={N} strokeWidth="3" />
      <rect x="88" y="147" width="44" height="5" rx="2" fill="#2D4BE0" />
      {/* bucket and mop by the door */}
      <path d="M199 132 L212 104" stroke="#C8955A" strokeWidth="3" strokeLinecap="round" />
      <path d="M190 130 h18 l-2 16 h-14z" fill="#2D4BE0" stroke={N} strokeWidth="2" />
      <path d="M192 130 q7 -8 14 0" fill="none" stroke={N} strokeWidth="1.8" />
      {([[54, 46, 1], [176, 40, 0.8], [204, 84, 0.7], [16, 104, 0.7], [132, 84, 0.5]] as [number, number, number][]).map(([x, y, sc], i) => (
        <motion.path key={i} d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill={i % 2 ? '#FF7A59' : '#2D4BE0'}
          style={{ x, y }} animate={{ scale: [0, sc, 0], rotate: [0, 90] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.9 + i * 0.35 }} />
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
