import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles, Line } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useRef, useMemo, Suspense } from 'react'
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
          color="#A8783A"
          emissive="#C9954F"
          emissiveIntensity={0.65}
          roughness={0.15}
          metalness={0.8}
          distort={0.32}
          speed={2.5}
          transparent
          opacity={0.92}
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
          color="#C9954F"
          emissive="#C9954F"
          emissiveIntensity={1.2}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// ─── Small data-flow arc — nodes connected by a curved line, echoes the global scene ───
function DataArc({ seed = 0, colorHex = '#6E62D9' }: { seed?: number; colorHex?: string }) {
  const group = useRef<THREE.Group>(null!)
  const NODES = 5
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < NODES; i++) {
      const a = (i / (NODES - 1)) * Math.PI * 1.2 + seed
      const r = 1.9 + Math.sin(seed * 2 + i) * 0.2
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.4 + seed) * 0.6, Math.sin(a) * r))
    }
    return pts
  }, [seed])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5), [points])
  const linePoints = useMemo(() => curve.getPoints(32), [curve])

  useFrame((state, delta) => {
    group.current.rotation.y += delta * 0.08
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15 + seed) * 0.2
  })

  return (
    <group ref={group}>
      <Line points={linePoints} color={colorHex} lineWidth={1.2} transparent opacity={0.4} toneMapped={false} />
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.025, 10, 10]} />
          <meshBasicMaterial color={colorHex} toneMapped={false} transparent opacity={0.8} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * Compact standalone 3D canvas placed behind the Hero portrait —
 * gives the medallion real depth and motion, data/AI themed for the light palette.
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
          <ambientLight intensity={0.9} color="#FFFDF8" />
          <pointLight position={[3, 3, 3]} intensity={1.4} color="#C9954F" />
          <hemisphereLight args={['#FFFFFF', '#E8DFD0', 0.7]} />
          <OrbCore />
          <OrbRing />
          <DataArc seed={0.6} colorHex="#6E62D9" />
          <DataArc seed={3.1} colorHex="#0F9E92" />
          <Sparkles count={35} scale={4} size={2} speed={0.3} opacity={0.4} color="#C9954F" />
          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom intensity={0.4} luminanceThreshold={0.4} luminanceSmoothing={0.9} mipmapBlur />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
