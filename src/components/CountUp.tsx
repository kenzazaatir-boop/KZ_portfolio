import { useEffect, useRef, useState } from 'react'
import { motion, useInView, animate } from 'framer-motion'

/**
 * Animates a numeric stat from 0 to its target value when scrolled into
 * view. Accepts strings like "918", "502K", "80%" — the numeric prefix
 * is counted up, any trailing letters/symbols stay static.
 */
export default function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const match = value.match(/^([\d.,]+)(.*)$/)
  const numeric = match ? parseFloat(match[1].replace(/,/g, '')) : null
  const suffix = match ? match[2] : ''
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0

  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(numeric === null ? value : '0')

  useEffect(() => {
    if (!inView || numeric === null) return
    const controls = animate(0, numeric, {
      duration: 1.4,
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(decimals ? v.toFixed(decimals) : Math.round(v).toString()),
    })
    return () => controls.stop()
  }, [inView, numeric, delay, decimals])

  return (
    <motion.span ref={ref} className="tabular-nums">
      {numeric === null ? value : display}
      {suffix}
    </motion.span>
  )
}
