// ─── Portfolio Data — Kenza Zaatir ───────────────────────────

export const profile = {
  name: 'Kenza',
  lastName: 'Zaatir',
  availability: 'Disponible — Juillet 2025',
  tagline:
    "À l'intersection du business et de la donnée, je transforme des datasets complexes en décisions stratégiques mesurables.",
  email: 'kenza.zaatir@gmail.com',
  linkedin: 'https://www.linkedin.com/in/kenza-zaatir',
  cv: 'CV_Kenza_Zaatir.pdf',
  tags: ['Data Analytics', 'Machine Learning', 'Conseil Stratégique', 'e-Business'],
  quote: 'Curiosity becomes intelligence when you build with it.',
}

export const stats = [
  { n: '918', l: 'Patients analysés' },
  { n: '502K', l: 'Clients · Projet Sou9na' },
  { n: '80%', l: 'Parts de marché analysées' },
]

export const about = {
  paragraphs: [
    "Animée par la curiosité et l'ouverture d'esprit, je développe un intérêt fort pour l'intelligence artificielle et les technologies no-code. J'aime expérimenter de nouveaux outils et transformer mes idées en projets concrets grâce à l'apprentissage par la pratique.",
    "En Master Business Analytics à Esprit School of Business, je construis une double compétence rare — pensée stratégique business et maîtrise des outils data — pour transformer des datasets complexes en décisions mesurables.",
  ],
  meta: [
    { k: 'Localisation', v: 'Ariana, Tunisie · Open to relocation' },
    { k: 'Formation', v: 'M. Business Analytics — Esprit School of Business' },
    { k: 'Email', v: 'kenza.zaatir@gmail.com' },
    { k: 'Intérêts', v: 'IA Appliquée · No-Code · Conseil Data' },
  ],
  pillars: [
    {
      ico: '◈',
      cat: 'Analyse & Intelligence Données',
      h: 'Pipeline analytique bout-en-bout',
      p: "Conception et déploiement de pipelines ML (Python, Scikit-learn), modèles prédictifs supervisés, dashboards Power BI et applications Streamlit — du traitement des données brutes à la restitution décisionnelle.",
    },
    {
      ico: '◉',
      cat: 'Stratégie & Conseil Business',
      h: 'Diagnostic stratégique orienté impact',
      p: "Diagnostic PESTEL/VRIO, modélisation de la valeur via Business Model Canvas et Value Proposition Canvas, conception de plans go-to-market avec KPIs SMART et tableaux de bord de suivi de performance.",
    },
    {
      ico: '◎',
      cat: 'e-Business & Transformation Digitale',
      h: 'De la conception à la viabilité économique',
      p: "Architecture d'écosystèmes numériques (marketplaces B2B/B2C), modèles de monétisation hybrides, stratégies de croissance (framework AARRR) et analyse financière sectorielle avec prévision time-series.",
    },
  ],
}

export type Project = {
  num: string
  domain: string
  domainColor: string
  title: string
  sub: string
  note?: string
  desc: string
  bullets: string[]
  tools: string[]
  image: string
  link?: { label: string; url: string }
  academic?: boolean
}

export const projects: Project[] = [
  {
    num: '01 / 04',
    domain: 'Stratégie Digitale',
    domainColor: 'gold',
    title: 'Sou9na سوقنا',
    sub: 'Marketplace & e-Business inclusif',
    image: '/projects/sou9na.jpg',
    note: "Ce projet est né d'un constat simple : 502 000 micro-entrepreneurs tunisiens n'avaient aucune vitrine numérique. J'ai voulu concevoir quelque chose qui change ça vraiment.",
    desc: "Conception d'un écosystème e-business intégré pour transformer Enda Tamweel — leader de la microfinance tunisienne — en hub économique numérique via un modèle Brick & Click.",
    bullets: [
      'Diagnostic stratégique complet (PESTEL · VRIO) pour un acteur détenant 80% de parts de marché en microfinance',
      "Conception d'un Alternative Credit Scoring liant l'activité marketplace à l'octroi automatisé de microcrédits",
      'Architecture Platform Ecosystem Map — équilibrage tripartite vendeurs · acheteurs · logisticiens',
      'Modèle de monétisation hybride à 4 piliers — point mort projeté début d\'année 4',
      'Stratégie de croissance AARRR avec effet de réseau biface et onboarding humain en agence',
    ],
    tools: ['Business Model Canvas', 'PESTEL', 'VRIO', 'AARRR', 'Platform Ecosystem', 'Gap Analysis'],
    link: { label: 'Voir la plateforme live', url: 'https://sou9na.netlify.app/' },
  },
  {
    num: '02 / 04',
    domain: 'Machine Learning · Santé',
    domainColor: 'violet',
    title: 'Prédiction Cardiaque',
    sub: 'IA & aide à la décision médicale',
    image: '/projects/heart.jpg',
    note: "Minimiser les faux négatifs : ma priorité absolue. Parce que manquer un cas à risque en médecine, c'est in-ac-cep-table.",
    desc: "Modèle de classification binaire supervisée sur 918 patients pour prédire la présence d'une maladie cardiaque — optimisé sur le Recall pour les contextes médicaux critiques.",
    bullets: [
      'Pipeline CRISP-DM complet — EDA, encodage, StandardScaler, GridSearchCV',
      'Priorisation métier du Recall : ne jamais manquer un patient à risque réel',
      'App Streamlit déployée en production pour usage clinique en temps réel',
    ],
    tools: ['Python', 'Scikit-learn', 'Streamlit', 'Pandas', 'CRISP-DM'],
    link: { label: "Voir l'application", url: 'https://heart-disease-7olnmktyhcmzmeh35putjq.streamlit.app/' },
  },
  {
    num: '03 / 04',
    domain: 'Marketplace de Services',
    domainColor: 'teal',
    title: 'Salla7ni صلّحني',
    sub: 'Disruption du marché informel tunisien',
    image: '/projects/salla7ni.jpg',
    note: "J'ai vécu ce problème personnellement : impossible de trouver un réparateur fiable. Ce projet répond à un vrai besoin.",
    desc: "Plan marketing digital et stratégie go-to-market pour structurer le secteur fragmenté de la réparation en Tunisie — 12M d'habitants, 73% connectés.",
    bullets: [
      "Audit concurrentiel et identification d'un gap de marché — absence d'acteur de confiance multi-services",
      'KPIs SMART Année 1 : 10 000 utilisateurs · 500 réparateurs certifiés · NPS cible 70+',
      'Modèle biface B2C/B2B — commissions + visibilité premium + plans correctifs A/B testing',
    ],
    tools: ['Analyse de Marché', 'KPIs SMART', 'Go-to-Market', 'BMC'],
    academic: true,
  },
  {
    num: '04 / 04',
    domain: 'Analyse Financière · ML',
    domainColor: 'sky',
    title: 'Prévision de Performance Financière',
    sub: 'Secteur BTP Tunisien · 2010 – 2025',
    image: '/projects/finance.jpg',
    desc: "Analyse historique complète et modélisation prédictive de la santé financière de 5 entreprises cotées à la BVMT (Carthage Cement, Ciments de Bizerte, SOMOCER, ESSOUKNA, SIMPAR) — secteur représentant 7% du PIB tunisien et 25% des investissements nationaux.",
    bullets: [
      'Analyse cross-sectional : CA, EBITDA, Résultat Net, ROA, ROE, BFR, trésorerie nette et solvabilité',
      'Carthage Cement identifié comme profil le plus favorable ; Ciments de Bizerte comme profil à risque structurel',
      'Modélisation Time Series pour projections 2025+ avec techniques avancées de forecasting',
      'Recommandations stratégiques différenciées par profil : restructuration de dette, optimisation du BFR, relance industrielle',
    ],
    tools: ['Python', 'Machine Learning', 'Time Series', 'ETL', 'CRISP-DM', 'Data Viz', 'Ratios Financiers'],
    link: { label: 'Voir le dashboard analytique', url: 'https://bouzaienemafez-tech.github.io/pi-/' },
  },
]

export const skills = {
  technical: [
    { name: 'SQL', level: 'Intermédiaire', w: 70, tip: 'Requêtes analytiques complexes' },
    { name: 'Python', level: 'Intermédiaire', w: 68, tip: 'Analyse de données (Pandas, Numpy)' },
    { name: 'Power BI', level: 'Intermédiaire', w: 65, tip: 'Création de dashboards interactifs' },
    { name: 'Machine Learning (Scikit-learn)', level: 'Débutant', w: 42, tip: 'Modèles prédictifs et classification' },
    { name: 'MS Project', level: 'Intermédiaire', w: 62, tip: 'Gestion et planification de projets' },
    { name: 'Streamlit', level: 'Intermédiaire', w: 60, tip: "Déploiement d'apps data interactives" },
  ],
  frameworks: [
    'CRISP-DM', 'Framework AARRR', 'Business Model Canvas', 'Value Proposition Canvas',
    'Analyse PESTEL', 'Modèle VRIO', 'Gap Analysis', 'KPIs SMART',
    'Go-to-Market', 'Time Series Forecasting', 'Analyse Financière', 'Platform Ecosystem Map',
  ],
  languages: [
    { n: 'Arabe', dots: 5, l: 'Langue maternelle' },
    { n: 'Français', dots: 4, l: 'Courant' },
    { n: 'Anglais', dots: 3, l: 'Conversationnel' },
  ],
}

export const formation = [
  {
    date: 'Sept. 2025 — Présent',
    org: 'Esprit School of Business',
    role: 'Master en Business Analytics',
    desc: "Formation avancée en analyse de données, IA appliquée aux décisions business, modélisation prédictive, forecasting financier et transformation digitale des organisations.",
  },
  {
    date: 'Sept. 2022 — Juin 2025',
    org: 'Esprit School of Business',
    role: 'Licence en Management',
    desc: "Fondamentaux du management, stratégie d'entreprise, gestion de projet (MS Project), analyse financière et entrepreneuriat.",
  },
]

export const experience = [
  {
    date: 'Juillet 2025',
    org: 'Esprit School of Business',
    role: "Agent d'Admission",
    desc: "Accueil et orientation des candidats, conseil sur les programmes académiques, gestion des appels et suivi des dossiers d'inscription.",
  },
  {
    date: 'Juil. — Août 2024',
    org: 'Adwya · La Marsa',
    role: 'Stagiaire — Logistique Industrielle',
    desc: "Contrôle qualité des bons de livraison et certificats de conformité, enregistrement et traçabilité sur Sage X3, supervision du stockage de matières premières selon les normes de sécurité.",
  },
  {
    date: 'Activité associative',
    org: 'AIESEC Tunisie — Manouba',
    role: 'Département Outgoing Global Talent',
    desc: "Promotion des opportunités de stage et d'échange international pour les jeunes talents tunisiens à travers le réseau AIESEC mondial.",
  },
]

export const certifications = [
  {
    iss: 'INCO Academy',
    name: 'Green Digital Certificate',
    date: 'Octobre 2025',
    id: 'Réf. : 1492661210KZ',
  },
  {
    iss: 'Honoris United Universities',
    name: 'Sustainability, Work Ethics & Gender Equity Certificate',
    date: 'Octobre 2024',
  },
]

export const navItems = [
  { path: '/', label: 'Accueil', index: '01' },
  { path: '/profil', label: 'Profil', index: '02' },
  { path: '/projets', label: 'Projets', index: '03' },
  { path: '/dashboard', label: 'Dashboard', index: '04' },
  { path: '/competences', label: 'Compétences', index: '05' },
  { path: '/parcours', label: 'Parcours', index: '06' },
  { path: '/contact', label: 'Contact', index: '07' },
]
