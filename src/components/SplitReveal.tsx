import { motion } from 'framer-motion'

/**
 * Splits text into words, each masked and revealed with a staggered
 * translateY + blur animation — the "agency site" hero text reveal
 * seen on motionsites.ai-style sites.
 */
export default function SplitReveal({
  text,
  delay = 0,
  className = '',
  wordDelay = 0.055,
  as: Tag = 'span',
}: {
  text: string
  delay?: number
  className?: string
  wordDelay?: number
  as?: 'span' | 'h1' | 'h2' | 'p'
}) {
  const words = text.split(' ')

  return (
    <Tag className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.12em' }}
        >
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            transition={{
              duration: 0.85,
              delay: delay + i * wordDelay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}
