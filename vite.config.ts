import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Libraries loaded from CDN via the import map in index.html.
// Marking them external keeps Rollup from bundling Three.js etc. — essential
// in this low-memory sandbox where bundling Three.js OOMs / hangs.
const external = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  'react-dom/client',
  'react-router-dom',
  'three',
  '@react-three/fiber',
  '@react-three/drei',
  '@react-three/postprocessing',
  'postprocessing',
  'framer-motion',
  'gsap',
  'lenis',
]

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild',
    sourcemap: false,
    target: 'esnext',
    rollupOptions: {
      external,
    },
  },
})
