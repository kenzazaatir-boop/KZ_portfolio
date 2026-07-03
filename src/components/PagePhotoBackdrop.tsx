import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { Suspense } from 'react'
import PhotoPanel3D from '../three/PhotoPanel3D'

type Corner = 'bottom-right' | 'bottom-left' | 'top-right'

const CORNER_CLASS: Record<Corner, string> = {
  'bottom-right': 'bottom-10 right-8',
  'bottom-left': 'bottom-10 left-8',
  'top-right': 'top-28 right-8',
}

/**
 * Reusable floating 3D photo panel for any page — the "photo-realistic"
 * counterpart to the abstract Core/DataRing shapes that live in the global
 * Scene3D background. Scene3D stays mounted underneath (unlike the Hero,
 * which fully replaces it with a video); this panel is a complement, giving
 * each page a distinct, on-theme photograph without losing the ambient 3D.
 */
export default function PagePhotoBackdrop({
  src,
  width = 2.6,
  height = 1.6,
  corner = 'bottom-right',
  containerWidth = 360,
  containerHeight = 220,
}: {
  src: string
  width?: number
  height?: number
  corner?: Corner
  containerWidth?: number
  containerHeight?: number
}) {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div
      className={`hidden lg:block fixed -z-10 pointer-events-none ${CORNER_CLASS[corner]}`}
      style={{ width: `${containerWidth}px`, height: `${containerHeight}px` }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        dpr={[1, 1.6]}
        frameloop={reduced ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={1} color="#FFFDF8" />
          <pointLight position={[2, 2, 3]} intensity={1.2} color="#C9954F" />
          <PhotoPanel3D src={src} width={width} height={height} tilt={0.14} />
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom intensity={0.3} luminanceThreshold={0.45} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
