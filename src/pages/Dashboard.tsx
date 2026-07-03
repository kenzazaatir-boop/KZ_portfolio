import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import PageWrapper, { Reveal } from '../components/PageWrapper'
import { StepNav } from '../components/StepProgress'
import CountUp from '../components/CountUp'
import { kpis, revenueTrend, marketShare, profitability, insight, type PeriodKey } from '../data/dashboardData'

const periods: PeriodKey[] = ['2022', '2023', '2024']

// Shared tooltip style — matches the editorial gold/ink theme instead of Recharts' default
function ThemedTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#FAF7F2] border border-soft rounded px-3.5 py-2.5 shadow-lg text-[12px]">
      <div className="font-mono text-[10px] tracking-widest uppercase text-ink3 mb-1.5">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-ink">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-ink2">{p.name}</span>
          <span className="font-mono font-semibold ml-auto">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [period, setPeriod] = useState<PeriodKey>('2024')

  return (
    <PageWrapper>
      <section className="pt-32 pb-16">
        <div className="max-w-[1180px] mx-auto px-[clamp(20px,5vw,52px)]">
          {/* Header */}
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-14">
            <Reveal>
              <div className="label mb-4">Étape 04 — Analytics Dashboard</div>
              <h2 className="stitle mb-4">
                Du dataset <em>à la décision</em>
              </h2>
              <p className="text-[15px] leading-[1.8] text-ink2 mt-4 max-w-[620px]">
                Extrait interactif de l'analyse financière du secteur BTP tunisien (2010–2025) — cinq entreprises
                cotées à la BVMT, suivies sur leur rentabilité, leur solvabilité et leur trajectoire de croissance.
              </p>
            </Reveal>

            {/* Period filter — the "real interactivity" signal */}
            <Reveal delay={0.1}>
              <div className="flex items-center gap-1 bg-white/50 border border-soft rounded-full p-1">
                {periods.map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`interactive font-mono text-[11px] tracking-wide px-3.5 py-1.5 rounded-full transition-all ${
                      period === p ? 'bg-gold text-white shadow-sm' : 'text-ink2 hover:text-ink'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </Reveal>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {kpis.map((k, i) => (
              <Reveal key={k.label} delay={0.05 * i}>
                <div className="bg-card border border-soft rounded-lg px-5 py-5 h-full flex flex-col justify-between hover:border-goldBorder transition-colors">
                  <div className="font-mono text-[10px] tracking-widest uppercase text-ink3 mb-3">{k.label}</div>
                  <div className="font-display text-3xl text-ink">
                    <CountUp value={k.value} /> <span className="text-gold text-2xl">{k.suffix}</span>
                  </div>
                  <div className="text-[11px] text-ink2 mt-2">{k.note}</div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 mb-6">
            {/* Line chart — CA & EBITDA trend, filtered by period */}
            <Reveal delay={0.1}>
              <div className="bg-card border border-soft rounded-lg p-6 h-full">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-1">
                      Trajectoire {period}
                    </div>
                    <div className="font-display text-lg text-ink">CA &amp; EBITDA agrégés (M TND)</div>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={revenueTrend[period]} margin={{ left: -18, right: 10 }}>
                    <CartesianGrid stroke="rgba(28,25,23,0.08)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#8A847A' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#8A847A' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<ThemedTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="ca"
                      name="Chiffre d'affaires"
                      stroke="#A8783A"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#A8783A' }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ebitda"
                      name="EBITDA"
                      stroke="#3A7FD4"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#3A7FD4' }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Reveal>

            {/* Pie chart — market share */}
            <Reveal delay={0.15}>
              <div className="bg-card border border-soft rounded-lg p-6 h-full">
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-1">Répartition</div>
                <div className="font-display text-lg text-ink mb-4">Poids par entreprise</div>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={marketShare}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {marketShare.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip content={<ThemedTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
                  {marketShare.map((m) => (
                    <div key={m.name} className="flex items-center gap-1.5 text-[11px] text-ink2">
                      <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                      {m.name}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Bar chart — profitability comparison */}
          <Reveal delay={0.1}>
            <div className="bg-card border border-soft rounded-lg p-6 mb-6">
              <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-1">Comparatif</div>
              <div className="font-display text-lg text-ink mb-4">Rentabilité — ROA vs ROE (%)</div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={profitability} margin={{ left: -18, right: 10 }}>
                  <CartesianGrid stroke="rgba(28,25,23,0.08)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 10.5, fill: '#8A847A' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#8A847A' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ThemedTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="roa" name="ROA" fill="#A8783A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="roe" name="ROE" fill="#0F9E92" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Reveal>

          {/* Insight callout */}
          <Reveal delay={0.05}>
            <motion.div className="bg-goldD border border-goldBorder rounded-lg px-6 py-5 flex gap-4">
              <span className="font-mono text-gold text-lg leading-none">◈</span>
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase text-gold mb-2">
                  Insight business
                </div>
                <p className="text-[14px] leading-[1.75] text-ink2">{insight}</p>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>
      <StepNav />
    </PageWrapper>
  )
}
