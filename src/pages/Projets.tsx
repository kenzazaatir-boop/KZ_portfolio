import { useRef } from 'react'
import { motion } from 'framer-motion'
import PageWrapper, { Reveal } from '../components/PageWrapper'
import { StepNav } from '../components/StepProgress'
import { projects, Project } from '../data/portfolio'

const domainStyles: Record<string, string> = {
  gold: 'bg-[rgba(168,120,58,0.09)] text-gold border-[rgba(168,120,58,0.22)]',
  violet: 'bg-[rgba(107,95,196,0.08)] text-violet border-[rgba(107,95,196,0.22)]',
  teal: 'bg-[rgba(42,158,151,0.08)] text-teal border-[rgba(42,158,151,0.20)]',
  sky: 'bg-[rgba(58,132,212,0.07)] text-sky border-[rgba(58,132,212,0.20)]',
}

function TiltCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const MAX_TILT = 6

  const onMove = (e: React.MouseEvent) => {
    const card = ref.current!
    const rect = card.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    card.style.transform = `perspective(900px) rotateX(${-dy * MAX_TILT}deg) rotateY(${dx * MAX_TILT}deg) translateZ(6px)`
    if (shineRef.current) {
      const mx = ((e.clientX - rect.left) / rect.width) * 100
      const my = ((e.clientY - rect.top) / rect.height) * 100
      shineRef.current.style.background = `radial-gradient(circle at ${mx}% ${my}%, rgba(255,255,255,0.07), transparent 55%)`
    }
  }
  const onLeave = () => {
    const card = ref.current!
    card.style.transform = ''
    if (shineRef.current) shineRef.current.style.background = 'transparent'
  }

  return (
    <Reveal delay={index * 0.08} className="interactive">
      <article
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative overflow-hidden glass rounded p-[clamp(28px,4vw,44px)] flex flex-col gap-4.5 gap-y-5 transition-[transform,box-shadow] duration-300 will-change-transform hover:border-[rgba(168,120,58,0.22)] h-full"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div ref={shineRef} className="pointer-events-none absolute inset-0 rounded transition-opacity" />

        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <span className="font-mono text-[11px] tracking-wider text-ink3">{project.num}</span>
          <span className={`font-mono text-[10px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-sm border ${domainStyles[project.domainColor]}`}>
            {project.domain}
          </span>
        </div>

        <h3 className="font-display font-bold text-ink leading-tight" style={{ fontSize: 'clamp(22px,2.8vw,30px)' }}>
          <span className="block font-mono text-[10px] font-medium tracking-widest uppercase text-ink3 mb-1.5">
            {project.sub}
          </span>
          {project.title}
        </h3>

        {project.note && (
          <p className="text-[13px] italic text-ink3 border-l-2 border-l-[rgba(196,148,80,0.3)] pl-3 leading-[1.7]">
            {project.note}
          </p>
        )}

        <p className="text-sm leading-[1.8] text-ink2">{project.desc}</p>

        <ul className="list-none flex flex-col gap-2.5">
          {project.bullets.map((b, i) => (
            <li key={i} className="relative pl-4 text-[13px] leading-[1.55] text-ink2">
              <span className="absolute left-0 text-gold font-bold">—</span>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mt-1">
          {project.tools.map((t) => (
            <span key={t} className="font-mono text-[10.5px] text-ink3 px-2.5 py-1 bg-bg border border-soft rounded-sm">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2">
          {project.link ? (
            <a
              href={project.link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[13px] font-medium text-gold no-underline hover:text-goldL transition-colors"
            >
              {project.link.label}
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          ) : (
            <span className="text-[13px] text-ink3">Projet académique</span>
          )}
        </div>
      </article>
    </Reveal>
  )
}

export default function Projets() {
  return (
    <PageWrapper>
      <section className="pt-32 pb-16">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)]">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-14">
            <Reveal>
              <div className="label mb-4">Étape 03 — Études de Cas</div>
              <h2 className="stitle">
                Projets &amp; <em>Réalisations</em>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-[15px] leading-[1.75] text-ink2 max-w-[360px]">
                Des analyses approfondies conjuguant rigueur méthodologique, pensée systémique et impact business mesurable.
              </p>
            </Reveal>
          </div>

          <motion.div className="grid md:grid-cols-2 gap-5">
            {projects.map((p, i) => (
              <div key={p.title} className={i === 0 || i === 3 ? 'md:col-span-2' : ''}>
                <TiltCard project={p} index={i} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
      <StepNav />
    </PageWrapper>
  )
}
