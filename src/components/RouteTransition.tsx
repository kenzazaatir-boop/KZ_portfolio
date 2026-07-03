import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { navItems } from '../data/portfolio'

// A sweeping gold panel that wipes across the screen on every route change,
// briefly showing the step number/label — the "step-by-step" immersive cue.
export default function RouteTransition() {
  const panelRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const panel = panelRef.current!
    const label = labelRef.current!
    const item = navItems.find((n) => n.path === location.pathname)
    label.querySelector('.rt-index')!.textContent = item?.index ?? ''
    label.querySelector('.rt-label')!.textContent = item?.label ?? ''

    const tl = gsap.timeline()
    tl.set(panel, { display: 'flex' })
      .fromTo(panel, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power3.inOut' })
      .fromTo(
        label,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
        '-=0.15'
      )
      .to(label, { opacity: 0, y: -20, duration: 0.3, ease: 'power2.in' }, '+=0.25')
      .to(panel, { yPercent: -100, duration: 0.55, ease: 'power3.inOut' }, '-=0.1')
      .set(panel, { display: 'none', yPercent: 100 })
  }, [location.pathname])

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[200] hidden items-center justify-center pointer-events-none"
      style={{ background: 'linear-gradient(160deg, #1C1917 0%, #2A2015 60%, #332612 100%)' }}
    >
      <div ref={labelRef} className="text-center">
        <div className="rt-index font-mono text-goldL text-sm tracking-[0.4em] mb-3" />
        <div className="rt-label font-display text-[#FAF7F2] text-5xl md:text-7xl font-semibold" />
        <div className="mt-5 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  )
}
