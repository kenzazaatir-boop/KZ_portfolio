// ─── Analytics Dashboard — Données ─────────────────────────────
//
// ⚠️ À FAIRE : ces valeurs sont des PLACEHOLDERS structurés pour illustrer
// le composant. Remplacez-les par les résultats réels de votre projet
// "Prévision de Performance Financière — Secteur BTP Tunisien" (ou par
// les données d'un autre projet) avant mise en ligne. Ne publiez jamais
// de chiffres financiers attribués à de vraies entreprises cotées sans
// qu'ils soient exacts et sourcés.

export type PeriodKey = '2022' | '2023' | '2024'

export const kpis = [
  { label: 'Entreprises analysées', value: '5', suffix: '', note: 'Secteur BTP · BVMT' },
  { label: "Poids sectoriel", value: '7', suffix: '%', note: 'du PIB tunisien' },
  { label: 'Précision du modèle', value: '87', suffix: '%', note: 'Forecasting time-series' },
  { label: 'Variables suivies', value: '9', suffix: '', note: 'CA · EBITDA · ROA · ROE · BFR…' },
]

// Évolution du CA agrégé du secteur (M TND) — courbe temporelle
export const revenueTrend: Record<PeriodKey, { month: string; ca: number; ebitda: number }[]> = {
  '2022': [
    { month: 'T1', ca: 42, ebitda: 9 },
    { month: 'T2', ca: 46, ebitda: 10 },
    { month: 'T3', ca: 44, ebitda: 9.5 },
    { month: 'T4', ca: 51, ebitda: 12 },
  ],
  '2023': [
    { month: 'T1', ca: 48, ebitda: 10 },
    { month: 'T2', ca: 53, ebitda: 12 },
    { month: 'T3', ca: 50, ebitda: 11 },
    { month: 'T4', ca: 58, ebitda: 14 },
  ],
  '2024': [
    { month: 'T1', ca: 55, ebitda: 12.5 },
    { month: 'T2', ca: 61, ebitda: 14.5 },
    { month: 'T3', ca: 59, ebitda: 13.8 },
    { month: 'T4', ca: 67, ebitda: 16.5 },
  ],
}

// Répartition du chiffre d'affaires par entreprise (dernier exercice)
export const marketShare = [
  { name: 'Carthage Cement', value: 34, color: 'var(--gold)' },
  { name: 'Ciments de Bizerte', value: 18, color: 'var(--violet, #6E62D9)' },
  { name: 'SOMOCER', value: 21, color: 'var(--teal, #0F9E92)' },
  { name: 'ESSOUKNA', value: 15, color: 'var(--sky, #3A7FD4)' },
  { name: 'SIMPAR', value: 12, color: '#B8A98F' },
]

// Comparatif de rentabilité par entreprise (ROA vs ROE, en %)
export const profitability = [
  { name: 'Carthage Cement', roa: 9.2, roe: 14.1 },
  { name: 'Ciments de Bizerte', roa: 2.1, roe: 3.4 },
  { name: 'SOMOCER', roa: 6.8, roe: 10.2 },
  { name: 'ESSOUKNA', roa: 5.4, roe: 8.7 },
  { name: 'SIMPAR', roa: 4.9, roe: 7.5 },
]

export const insight =
  "Carthage Cement se distingue par le couple ROA/ROE le plus élevé du panel, cohérent avec un profil " +
  "financier jugé le plus favorable dans l'analyse. Ciments de Bizerte présente au contraire un risque " +
  "structurel — rentabilité et solvabilité les plus faibles — corroborant la recommandation de restructuration " +
  "de dette formulée dans l'étude complète."
