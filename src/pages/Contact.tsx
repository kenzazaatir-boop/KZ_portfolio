import { motion } from 'framer-motion'
import PageWrapper, { Reveal } from '../components/PageWrapper'
import { profile } from '../data/portfolio'

export default function Contact() {
  return (
    <PageWrapper>
      <section className="min-h-screen flex items-center justify-center pt-28 pb-16 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 60%, rgba(168,120,58,0.08), transparent 70%)',
          }}
        />
        <div className="max-w-[820px] mx-auto px-[clamp(20px,5vw,52px)] w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            className="relative overflow-hidden glass rounded-lg text-center px-[clamp(40px,6vw,80px)] py-[clamp(48px,7vw,80px)]"
            style={{ boxShadow: '0 20px 50px rgba(28,25,23,0.12), inset 0 1px 0 rgba(255,255,255,0.6)' }}
          >
            <span
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
            />

            <Reveal>
              <div className="label justify-center mb-5">Étape 07 — Contact</div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display font-bold leading-none mb-6 text-ink" style={{ fontSize: 'clamp(42px,7vw,72px)' }}>
                Travaillons
                <br />
                <em className="italic text-gold">ensemble.</em>
              </h2>
            </Reveal>

            <Reveal delay={0.15}>
              <p className="text-base leading-[1.8] text-ink2 mb-9 max-w-md mx-auto">
                Je réponds toujours à mes messages. Que ce soit pour une opportunité, une question sur mes projets,
                ou juste échanger autour de la data — je suis là.
              </p>
            </Reveal>

            <Reveal delay={0.22}>
              <div className="flex justify-center gap-4 flex-wrap mb-10">
                <a href={`mailto:${profile.email}`} className="btn btn-gold text-base px-8 py-4">
                  {profile.email}
                </a>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost text-base px-8 py-4"
                >
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="font-display italic text-ink2 max-w-md mx-auto leading-relaxed" style={{ fontSize: 'clamp(16px,2vw,22px)' }}>
                « {profile.quote} »
                <span className="block font-mono text-[11px] not-italic tracking-widest uppercase text-gold mt-3">
                  — {profile.name} {profile.lastName}
                </span>
              </p>
            </Reveal>
          </motion.div>

          <p className="text-center font-mono text-[11px] text-ink3 mt-10">
            © 2025 {profile.name} {profile.lastName} — Tous droits réservés.
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}
