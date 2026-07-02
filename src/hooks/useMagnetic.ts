import { useRef, useEffect } from 'react'

/**
 * Magnetic hover effect — the element gently follows the cursor within
 * its bounds, then springs back on leave. Inspired by motionsites.ai / Dribbble
 * agency-style interactions.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.35) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const relX = e.clientX - (rect.left + rect.width / 2)
      const relY = e.clientY - (rect.top + rect.height / 2)
      tx = relX * strength
      ty = relY * strength
    }

    const onLeave = () => {
      tx = 0
      ty = 0
    }

    const loop = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform = `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)`
      raf = requestAnimationFrame(loop)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    raf = requestAnimationFrame(loop)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength])

  return ref
}
