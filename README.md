# Kenza Zaatir — Portfolio Immersif 3D

## Présentation du projet
- **Nom** : Portfolio 3D — Kenza Zaatir
- **Objectif** : Transformer le portfolio HTML mono-page en une expérience web **3D immersive multi-pages**, où le recruteur découvre les informations **étape par étape**.
- **Public** : Recruteurs, partenaires, contacts professionnels (Business Analytics, IA, Data).

## Stack technique
- **React 18** + **Vite** (SPA)
- **Three.js** + **React Three Fiber** + **Drei** — scène 3D persistante en arrière-plan
- **Framer Motion** — transitions de pages et animations d'entrée
- **GSAP** — overlay de transition « étape » entre les pages
- **Lenis** — smooth scroll
- **Tailwind CSS** — design system (palette dorée / sombre)
- **React Router** — navigation multi-pages

> ⚙️ **Note technique** : Les librairies lourdes (React, Three.js, R3F, Drei, Framer Motion, GSAP, Lenis) sont chargées via **import map + CDN esm.sh**, et marquées `external` dans Vite. Cela rend le build quasi-instantané et léger (~39 Ko de bundle applicatif) — indispensable dans cet environnement sandbox à faible mémoire.

## Architecture & expérience immersive
Une **scène 3D unique** (`src/three/Scene3D.tsx`) reste en fond derrière toutes les pages. À chaque changement de route, elle **se métamorphose** (couleur des particules, rayon de la sphère, vitesse de rotation, position caméra) pour créer une ambiance propre à chaque étape :

| Route | Étape | Ambiance 3D |
|-------|-------|-------------|
| `/` | 01 — Accueil | Or, sphère compacte |
| `/profil` | 02 — Profil | Or clair, expansion |
| `/projets` | 03 — Projets | Violet, dispersion large |
| `/competences` | 04 — Compétences | Teal, rotation rapide |
| `/parcours` | 05 — Parcours | Bleu ciel |
| `/contact` | 06 — Contact | Or, resserrement |

Entre chaque page : **overlay GSAP** affichant le numéro et le nom de l'étape (effet de « wipe » doré) + transition Framer Motion (fade/blur/translate).

## URLs / Routes fonctionnelles
- `/` — Accueil (Hero) : nom, accroche, tags, stats, CTA « Commencer la visite »
- `/profil` — Profil : bio, méta-infos, 3 piliers de compétences
- `/projets` — Études de cas : 4 projets (cartes 3D tilt au survol)
- `/competences` — Compétences : barres techniques animées, frameworks, langues
- `/parcours` — Parcours : timelines formation + expérience, certifications
- `/contact` — Contact : email, LinkedIn, citation

Navigation : barre de nav (desktop + menu mobile), indicateur d'étapes vertical (desktop), boutons Précédent/Suivant en bas de page.

## Structure des fichiers
```
src/
├── main.tsx              # Entrée React + BrowserRouter
├── App.tsx               # Routing + AnimatePresence + scène 3D
├── index.css             # Tailwind + design system
├── data/portfolio.ts     # Toutes les données du portfolio
├── three/Scene3D.tsx     # Scène 3D R3F (particules, core, Stars, Float)
├── components/
│   ├── Navbar.tsx
│   ├── Cursor.tsx        # Curseur personnalisé
│   ├── SmoothScroll.tsx  # Lenis
│   ├── StepProgress.tsx  # Indicateur d'étapes + StepNav
│   ├── RouteTransition.tsx # Overlay GSAP
│   └── PageWrapper.tsx   # Wrapper + composant Reveal
└── pages/
    ├── Hero.tsx · Profil.tsx · Projets.tsx
    ├── Competences.tsx · Parcours.tsx · Contact.tsx
```

## Données
Toutes les données (profil, projets, compétences, parcours, certifications) sont centralisées dans `src/data/portfolio.ts`. Aucune base de données : portfolio statique.

## Développement local
```bash
npm install
npm run build      # build de production (dist/)
pm2 start ecosystem.config.cjs   # sert dist/ via vite preview sur le port 3000
```

## Déploiement
- **Plateforme** : Cloudflare Pages (site statique)
- **Build output** : `./dist`
- **SPA routing** : `public/_redirects` (`/* /index.html 200`)
- **Statut** : En préparation de déploiement

## À personnaliser
- `public/CV_Kenza_Zaatir.pdf` — remplacer le placeholder par le vrai CV
- Photo de profil : actuellement un monogramme « KZ » élégant (la photo originale `kenza-photo.jpg` n'a pas été fournie)

## Prochaines étapes possibles
- Ajouter la vraie photo de profil dans la page Profil
- Modèles 3D GLTF spécifiques par projet (via Drei `useGLTF`)
- Mode clair/sombre
- Internationalisation FR / EN

---
*« Curiosity becomes intelligence when you build with it. » — Kenza Zaatir*
