import PageWrapper, { Reveal } from '../components/PageWrapper'
import { StepNav } from '../components/StepProgress'
import { formation, experience, certifications } from '../data/portfolio'

type TItem = { date: string; org: string; role: string; desc: string }

function Timeline({ items, label }: { items: TItem[]; label: string }) {
  return (
    <div>
      <Reveal>
        <div className="font-mono text-[11px] font-semibold tracking-widest uppercase text-gold mb-7">{label}</div>
      </Reveal>
      <div className="relative flex flex-col">
        <span className="absolute left-[15px] top-6 bottom-0 w-px bg-soft" />
        {items.map((it, i) => (
          <Reveal key={i} delay={i * 0.1}>
            <div className="flex gap-6 pb-8 relative last:pb-0">
              <div className="w-[31px] h-[31px] min-w-[31px] rounded-full glass border border-goldBorder flex items-center justify-center z-[1] shrink-0">
                <span className="w-2 h-2 rounded-full bg-gold" />
              </div>
              <div className="flex-1 pt-0.5">
                <div className="font-mono text-[10px] font-medium tracking-wider uppercase text-gold mb-1.5">{it.date}</div>
                <div className="text-[15px] font-semibold text-ink mb-0.5">{it.org}</div>
                <div className="text-[13.5px] text-ink2 italic mb-2.5">{it.role}</div>
                <p className="text-[13px] leading-[1.7] text-ink3">{it.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

export default function Parcours() {
  return (
    <PageWrapper>
      <section className="pt-32 pb-12">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)]">
          <Reveal>
            <div className="label mb-4">Étape 05 — Parcours</div>
            <h2 className="stitle mb-14">
              Expérience <em>&amp; Formation</em>
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-[clamp(32px,5vw,64px)]">
            <Timeline items={formation} label="Formation Académique" />
            <Timeline items={experience} label="Expérience Professionnelle" />
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="pb-16 pt-4 border-t border-glass">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)] pt-16">
          <Reveal>
            <div className="label mb-4">Certifications</div>
            <h2 className="stitle mb-11">
              Développement <em>Professionnel</em>
            </h2>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4.5 gap-5">
            {certifications.map((c, i) => (
              <Reveal key={c.name} delay={i * 0.1} className="interactive">
                <article className="glass rounded p-7 flex flex-col gap-2.5 hover:border-goldBorder hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className="font-mono text-[10px] font-semibold tracking-widest uppercase text-gold">{c.iss}</div>
                  <div className="text-[15px] font-medium text-ink leading-snug">{c.name}</div>
                  <div className="font-mono text-[11px] text-ink3">{c.date}</div>
                  {c.id && <div className="font-mono text-[10px] text-ink3">{c.id}</div>}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <StepNav />
    </PageWrapper>
  )
}
