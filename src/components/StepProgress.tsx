import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { navItems } from '../data/portfolio'

// Vertical step indicator on the right side (desktop)
export default function StepProgress() {
  const location = useLocation()
  const currentIndex = navItems.findIndex((n) => n.path === location.pathname)

  return (
    <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-4">
      {navItems.map((item, i) => {
        const active = i === currentIndex
        return (
          <Link key={item.path} to={item.path} className="group relative flex items-center justify-end">
            <span
              className={`absolute right-7 whitespace-nowrap font-mono text-[10px] tracking-widest uppercase transition-all duration-300 ${
                active ? 'opacity-100 text-gold' : 'opacity-0 group-hover:opacity-100 text-ink2'
              }`}
            >
              {item.label}
            </span>
            <span className="relative flex items-center justify-center w-3 h-3">
              {active && (
                <motion.span
                  layoutId="step-ring"
                  className="absolute inset-[-5px] rounded-full border border-gold"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  active ? 'bg-gold' : 'bg-[rgba(28,25,23,0.15)] group-hover:bg-gold'
                }`}
              />
            </span>
          </Link>
        )
      })}
    </div>
  )
}

// Prev / Next stepper at bottom of each page
export function StepNav() {
  const location = useLocation()
  const idx = navItems.findIndex((n) => n.path === location.pathname)
  const prev = idx > 0 ? navItems[idx - 1] : null
  const next = idx < navItems.length - 1 ? navItems[idx + 1] : null

  return (
    <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)] pb-24 pt-8 flex items-center justify-between gap-4">
      {prev ? (
        <Link
          to={prev.path}
          className="group flex items-center gap-3 no-underline text-ink2 hover:text-gold transition-colors"
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:-translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          <span className="text-left">
            <span className="block font-mono text-[10px] tracking-widest uppercase opacity-60">Étape {prev.index}</span>
            <span className="font-display text-base">{prev.label}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          to={next.path}
          className="group flex items-center gap-3 no-underline text-ink2 hover:text-gold transition-colors text-right"
        >
          <span>
            <span className="block font-mono text-[10px] tracking-widest uppercase opacity-60">Étape {next.index}</span>
            <span className="font-display text-base">{next.label}</span>
          </span>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}
