import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Scene3D from './three/Scene3D'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import SmoothScroll from './components/SmoothScroll'
import StepProgress from './components/StepProgress'
import RouteTransition from './components/RouteTransition'

import Hero from './pages/Hero'
import Profil from './pages/Profil'
import Projets from './pages/Projets'
import Competences from './pages/Competences'
import Parcours from './pages/Parcours'
import Contact from './pages/Contact'

export default function App() {
  const location = useLocation()

  return (
    <SmoothScroll>
      {/* Persistent 3D background that morphs per route */}
      <Scene3D />

      <Cursor />
      <Navbar />
      <StepProgress />
      <RouteTransition />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Hero />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/projets" element={<Projets />} />
          <Route path="/competences" element={<Competences />} />
          <Route path="/parcours" element={<Parcours />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Hero />} />
        </Routes>
      </AnimatePresence>
    </SmoothScroll>
  )
}
