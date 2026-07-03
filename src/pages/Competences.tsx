import { motion } from 'framer-motion'
import PageWrapper, { Reveal } from '../components/PageWrapper'
import { StepNav } from '../components/StepProgress'
import PagePhotoBackdrop from '../components/PagePhotoBackdrop'
import { skills } from '../data/portfolio'

export default function Competences() {
  return (
    <PageWrapper>
      <PagePhotoBackdrop
        src="/media/competences-panel-photo.jpg"
        width={2.7}
        height={1.8}
        corner="bottom-left"
        containerWidth={340}
        containerHeight={226}
      />
      <section className="pt-32 pb-16">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)]">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-[clamp(40px,6vw,90px)] items-start">
            <Reveal>
              <div className="label mb-4">Étape 04 — Compétences</div>
              <h2 className="stitle mb-4">
                Expertise <em>&amp; Outils</em>
              </h2>
              <p className="text-[15px] leading-[1.8] text-ink2 mt-4">
                Une boîte à outils hybride combinant maîtrise technique des données et frameworks de conseil
                stratégique — conçue pour opérer à l'interface entre business et technologie.
              </p>
            </Reveal>

            <div className="flex flex-col gap-11">
              {/* Technical bars */}
              <Reveal delay={0.1}>
                <div className="font-mono text-[11px] font-semibold tracking-widest uppercase text-gold mb-4.5 mb-5">
                  Outils Techniques
                </div>
                <div className="flex flex-col gap-4">
                  {skills.technical.map((s, i) => (
                    <div key={s.name} className="flex flex-col gap-1.5" title={s.tip}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-ink">{s.name}</span>
                        <span className="font-mono text-[10px] tracking-wide uppercase text-ink3">{s.level}</span>
                      </div>
                      <div className="h-[3px] bg-soft rounded overflow-hidden">
                        <motion.div
                          className="h-full rounded"
                          style={{
                            background: 'linear-gradient(90deg, var(--gold), var(--gold-l))',
                            boxShadow: '0 0 8px rgba(168,120,58,0.3)',
                          }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${s.w}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.1, delay: 0.1 + i * 0.08, ease: [0.4, 0, 0.2, 1] }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Frameworks */}
              <Reveal delay={0.15}>
                <div className="font-mono text-[11px] font-semibold tracking-widest uppercase text-gold mb-5">
                  Frameworks &amp; Méthodologies
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {skills.frameworks.map((f, i) => (
                    <motion.span
                      key={f}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.03 }}
                      className="interactive font-mono text-[11.5px] text-ink2 px-3 py-1.5 bg-bg border border-soft rounded-sm hover:border-goldBorder hover:text-gold hover:bg-goldD transition-colors"
                    >
                      {f}
                    </motion.span>
                  ))}
                </div>
              </Reveal>

              {/* Languages */}
              <Reveal delay={0.2}>
                <div className="font-mono text-[11px] font-semibold tracking-widest uppercase text-gold mb-5">
                  Langues
                </div>
                <div className="flex flex-col gap-2.5">
                  {skills.languages.map((lang) => (
                    <div
                      key={lang.n}
                      className="flex items-center gap-4 px-4 py-3 bg-bg border border-soft rounded"
                    >
                      <span className="text-sm font-medium text-ink flex-1">{lang.n}</span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((d) => (
                          <span
                            key={d}
                            className={`w-[5px] h-[5px] rounded-full ${d <= lang.dots ? 'bg-gold' : 'bg-soft'}`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] tracking-wide uppercase text-ink3 min-w-[110px] text-right">
                        {lang.l}
                      </span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
      <StepNav />
    </PageWrapper>
  )
}
