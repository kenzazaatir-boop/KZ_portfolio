import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Environment } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

// ─── Crystal core orbiting behind the portrait — reacts gently to the cursor ───
function OrbCore() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { pointer } = useThree()
  const look = useRef({ x: 0, y: 0 })

  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.25
    mesh.current.rotation.x += delta * 0.08
    look.current.x += (pointer.x * 0.3 - look.current.x) * Math.min(delta * 2, 1)
    look.current.y += (-pointer.y * 0.25 - look.current.y) * Math.min(delta * 2, 1)
    mesh.current.position.x = look.current.x * 0.4
    mesh.current.position.y = look.current.y * 0.4
  })

  return (
    <Float speed={1.8} rotationIntensity={0.5} floatIntensity={1.4}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color="#C49450"
          emissive="#E4B672"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.95}
          distort={0.35}
          speed={2.5}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  )
}

// ─── Thin orbiting ring for extra depth ───
function OrbRing() {
  const group = useRef<THREE.Group>(null!)
  useFrame((state, delta) => {
    group.current.rotation.z = 0.6 + Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    group.current.rotation.y += delta * 0.15
  })
  return (
    <group ref={group} scale={1.65}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.01, 8, 128]} />
        <meshStandardMaterial
          color="#E4B672"
          emissive="#E4B672"
          emissiveIntensity={1.6}
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

/**
 * Compact standalone 3D canvas placed behind the Hero portrait —
 * gives the medallion real depth and motion instead of a flat CSS halo.
 */
export default function HeroOrb() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        dpr={[1, 1.6]}
        frameloop={reduced ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <ambientLight intensity={0.4} />
          <pointLight position={[3, 3, 3]} intensity={1.2} color="#E4B672" />
          <OrbCore />
          <OrbRing />
          <Sparkles count={40} scale={4} size={2.2} speed={0.35} opacity={0.6} color="#E4B672" />
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom intensity={0.55} luminanceThreshold={0.25} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
