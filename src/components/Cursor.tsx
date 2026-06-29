import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const dot = dotRef.current!
    const ring = ringRef.current!
    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my
    let raf = 0

    const move = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.left = mx + 'px'
      dot.style.top = my + 'px'
    }

    const loop = () => {
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      ring.style.left = rx + 'px'
      ring.style.top = ry + 'px'
      raf = requestAnimationFrame(loop)
    }

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, .interactive')) {
        dot.classList.add('active')
        ring.classList.add('active')
      }
    }
    const out = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('a, button, .interactive')) {
        dot.classList.remove('active')
        ring.classList.remove('active')
      }
    }

    window.addEventListener('mousemove', move)
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div className="cursor" ref={dotRef} />
      <div className="cursor-follower" ref={ringRef} />
    </>
  )
}
