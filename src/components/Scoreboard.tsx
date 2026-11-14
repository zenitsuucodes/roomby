import { motion } from 'framer-motion'

/** Odometer-style price: each digit rolls to its new value. */
function Digit({ d }: { d: string }) {
  if (!/\d/.test(d)) return <span className="sb-sep">{d}</span>
  const n = Number(d)
  return (
    <span className="sb-digit" aria-hidden="true">
      <motion.span className="sb-roll" animate={{ y: `${-n * 10}%` }} transition={{ type: 'spring', stiffness: 140, damping: 18 }}>
        {Array.from({ length: 10 }, (_, i) => <span key={i}>{i}</span>)}
      </motion.span>
    </span>
  )
}

export function Scoreboard({ value, size = 'lg', label }: { value: number; size?: 'lg' | 'md'; label?: string }) {
  const text = `$${value.toLocaleString('en-CA')}`
  return (
    <div className={`scoreboard ${size}`} role="status" aria-live="polite" aria-label={label ? `${label}: ${text}` : text}>
      {text.split('').map((ch, i) => <Digit key={`${text.length}-${i}`} d={ch} />)}
    </div>
  )
}
