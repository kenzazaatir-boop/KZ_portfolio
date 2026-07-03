import PageWrapper, { Reveal } from '../components/PageWrapper'
import { StepNav } from '../components/StepProgress'
import PagePhotoBackdrop from '../components/PagePhotoBackdrop'
import { about } from '../data/portfolio'

export default function Profil() {
  return (
    <PageWrapper>
      <PagePhotoBackdrop
        src="/media/profil-panel-photo.jpg"
        width={1.7}
        height={3.0}
        corner="bottom-left"
        containerWidth={220}
        containerHeight={390}
      />
      <section className="pt-32 pb-16">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)]">
          <Reveal>
            <div className="label mb-4">Étape 02 — Profil</div>
            <h2 className="stitle mb-3">
              Analytique <em>&amp; Stratégique</em>
            </h2>
          </Reveal>

          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-[clamp(40px,7vw,90px)] items-start mt-14">
            {/* Left — bio */}
            <div>
              <Reveal>
                <div className="relative w-28 h-28 mb-7">
                  <img
                    src="/kenza-photo.jpg"
                    alt="Kenza Zaatir"
                    className="w-28 h-28 rounded-full object-cover object-top border-2 border-goldBorder"
                    style={{ boxShadow: '0 0 0 5px rgba(168,120,58,0.1), 0 10px 30px rgba(28,25,23,0.15)' }}
                  />
                  <span
                    className="absolute -inset-1.5 rounded-full border border-[rgba(196,148,80,0.25)]"
                    style={{ animation: 'ringPulse 3s ease-in-out infinite' }}
                  />
                </div>
              </Reveal>

              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={0.05 + i * 0.08}>
                  <p className="text-[15px] leading-[1.85] text-ink2 mb-5">{p}</p>
                </Reveal>
              ))}

              <Reveal delay={0.2}>
                <ul className="list-none flex flex-col gap-3.5 mt-8">
                  {about.meta.map((m) => (
                    <li key={m.k} className="flex items-start gap-4 text-sm text-ink2">
                      <span className="font-mono text-[10px] tracking-wider uppercase text-gold min-w-[88px] pt-0.5">
                        {m.k}
                      </span>
                      <span>{m.v}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* Right — pillars */}
            <div className="flex flex-col gap-4.5 gap-y-5">
              {about.pillars.map((pillar, i) => (
                <Reveal key={pillar.cat} delay={0.1 + i * 0.1}>
                  <article className="interactive glass border-l-2 border-l-gold rounded-sm px-7 py-6 hover:bg-bg2 hover:border-l-goldL hover:translate-x-1 transition-all duration-300">
                    <span className="block font-mono text-base text-gold mb-2.5">
                      {pillar.ico} {pillar.cat}
                    </span>
                    <h3 className="font-display text-lg font-semibold text-ink mb-2">{pillar.h}</h3>
                    <p className="text-[13.5px] leading-[1.75] text-ink2">{pillar.p}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
      <StepNav />
    </PageWrapper>
  )
}
