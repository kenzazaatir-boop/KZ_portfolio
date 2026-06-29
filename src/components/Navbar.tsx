import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { navItems, profile } from '../data/portfolio'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
    document.body.style.overflow = ''
  }, [location.pathname])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3 bg-[rgba(10,10,12,0.85)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.08)]'
            : 'py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)] flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink no-underline">
            K<span className="text-gold">.</span>Zaatir
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8 list-none">
            {navItems.slice(1).map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-[13px] font-medium tracking-wide no-underline transition-colors ${
                    location.pathname === item.path ? 'text-gold' : 'text-ink2 hover:text-ink'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <a
              href={profile.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] font-semibold tracking-widest uppercase text-ink no-underline bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all"
            >
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              CV
            </a>

            {/* Burger */}
            <button
              aria-label="Menu"
              onClick={() => {
                setOpen((o) => {
                  document.body.style.overflow = !o ? 'hidden' : ''
                  return !o
                })
              }}
              className="md:hidden relative w-7 h-5 flex flex-col justify-between bg-transparent border-none z-[100]"
            >
              <span className={`block h-0.5 w-full bg-ink rounded transition-all ${open ? 'translate-y-[9px] rotate-45' : ''}`} />
              <span className={`block h-0.5 w-full bg-ink rounded transition-all ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-ink rounded transition-all ${open ? '-translate-y-[9px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[99] bg-[rgba(10,10,12,0.98)] backdrop-blur-lg flex flex-col items-center justify-center gap-7 md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06 }}
              >
                <Link
                  to={item.path}
                  className="font-display text-2xl text-ink no-underline hover:text-gold transition-colors"
                >
                  <span className="font-mono text-xs text-gold mr-3">{item.index}</span>
                  {item.label}
                </Link>
              </motion.div>
            ))}
            <a
              href={profile.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gold mt-4"
            >
              Télécharger CV
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
