import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Full-screen looping video background for the Hero — replaces the abstract
 * 3D scene on this route only. A slow continuous "Ken Burns" zoom (scale
 * oscillating between 1.15 and 1.28 over 28s) keeps the footage alive without
 * ever revealing an edge, thanks to object-cover.
 */
export default function HeroVideoBackground({
  mp4,
  webm,
}: {
  mp4: string
  webm?: string
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    videoRef.current?.play().catch(() => {
      /* autoplay can be blocked before a user gesture on some mobile browsers — harmless for a muted bg video */
    })
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <motion.video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transformOrigin: '58% 42%' }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ opacity: 1, scale: [1.15, 1.28, 1.15] }}
        transition={{
          opacity: { duration: 1.4, ease: 'easeOut' },
          scale: { duration: 28, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {webm && <source src={webm} type="video/webm" />}
        <source src={mp4} type="video/mp4" />
      </motion.video>

      {/* Readability overlay — cream gradient consistent with the site's light palette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 60% at 18% 45%, rgba(250,247,242,0.82), transparent 65%), linear-gradient(180deg, rgba(250,247,242,0.4) 0%, transparent 30%, transparent 70%, rgba(250,247,242,0.6) 100%)',
        }}
      />
    </div>
  )
}
