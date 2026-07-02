import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageWrapper from '../components/PageWrapper'
import { profile, stats } from '../data/portfolio'

const container = {
  animate: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
}
const item = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } },
}

export default function Hero() {
  return (
    <PageWrapper>
      <section className="min-h-screen flex items-center pt-24 pb-16">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)] w-full grid lg:grid-cols-[1fr_auto] items-center gap-12">
          <motion.div variants={container} initial="initial" animate="animate" className="max-w-3xl">
            <motion.div variants={item}>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium tracking-widest uppercase text-[#4ade80] border border-[rgba(74,222,128,0.2)] bg-[rgba(74,222,128,0.05)] px-3.5 py-1.5 rounded-full mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
                {profile.availability}
              </span>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-3.5 mb-6">
              <span className="block w-9 h-px bg-gold" />
              <span className="font-mono text-[11px] tracking-widest uppercase text-gold">
                Portfolio Immersif — Business Analytics
              </span>
            </motion.div>

            <motion.h1
              variants={item}
              className="font-display font-bold leading-[0.95] tracking-[-0.04em] text-ink mb-4"
              style={{ fontSize: 'clamp(64px, 10vw, 128px)' }}
            >
              {profile.name}
              <br />
              <em className="not-italic italic text-gold block">{profile.lastName}</em>
            </motion.h1>

            <motion.p
              variants={item}
              className="font-display italic text-ink2 mb-9 max-w-xl"
              style={{ fontSize: 'clamp(17px, 2.4vw, 24px)' }}
            >
              {profile.tagline}
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-2.5 mb-11">
              {profile.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] tracking-wide uppercase text-ink2 px-3.5 py-1.5 glass rounded-sm hover:border-goldBorder hover:text-gold transition-colors"
                >
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-3.5">
              <Link to="/profil" className="btn btn-gold">
                Commencer la visite
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a href={profile.cv} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Télécharger CV
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={item}
              className="grid grid-cols-3 gap-px mt-14 max-w-xl rounded overflow-hidden border border-glass"
              style={{ background: 'rgba(255,255,255,0.08)' }}
            >
              {stats.map((s) => (
                <div key={s.l} className="glass px-4 py-5 text-center">
                  <div className="font-display text-[34px] font-bold text-gold leading-none mb-1.5">{s.n}</div>
                  <div className="font-mono text-[10px] tracking-wide uppercase text-ink3">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Portrait médaillon flottant */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="hidden lg:flex justify-center items-center relative"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative"
            >
              {/* Halo lumineux */}
              <div
                className="absolute -inset-8 rounded-full blur-3xl opacity-40"
                style={{ background: 'radial-gradient(circle, rgba(196,148,80,0.55), transparent 70%)' }}
              />
              {/* Anneau tournant */}
              <div
                className="absolute -inset-4 rounded-full animate-[spin_18s_linear_infinite]"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent, rgba(196,148,80,0.7), transparent 40%, rgba(196,148,80,0.35), transparent 75%)',
                  WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
                  mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))',
                }}
              />
              {/* Photo */}
              <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden border border-goldBorder shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)]">
                <img
                  src="/kenza-photo.jpg"
                  alt={`${profile.name} ${profile.lastName}`}
                  className="w-full h-full object-cover object-top"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(10,10,12,0.55))' }}
                />
              </div>
              {/* Badge signature */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full border border-goldBorder whitespace-nowrap"
              >
                <span className="font-mono text-[10px] tracking-widest uppercase text-gold">
                  Business Analytics
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="w-px h-9 bg-gradient-to-b from-gold to-transparent animate-pulse" />
          <span className="font-mono text-[9px] tracking-widest uppercase text-ink3">Explorer</span>
        </motion.div>
      </section>
    </PageWrapper>
  )
}
