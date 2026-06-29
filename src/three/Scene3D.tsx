import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'

// Map each route to a target 3D "mood" — color, particle radius, rotation speed, camera Z.
const SCENE_CONFIG: Record<string, {
  color: THREE.Color
  radius: number
  spin: number
  camZ: number
  spread: number
}> = {
  '/':            { color: new THREE.Color('#C49450'), radius: 2.6, spin: 0.05, camZ: 6.5, spread: 0.4 },
  '/profil':      { color: new THREE.Color('#E4B672'), radius: 3.2, spin: 0.03, camZ: 7.5, spread: 1.2 },
  '/projets':     { color: new THREE.Color('#8C80F2'), radius: 4.0, spin: 0.08, camZ: 9.0, spread: 2.0 },
  '/competences': { color: new THREE.Color('#42E8DF'), radius: 3.0, spin: 0.10, camZ: 7.0, spread: 0.8 },
  '/parcours':    { color: new THREE.Color('#5BA4F8'), radius: 3.6, spin: 0.04, camZ: 8.0, spread: 1.6 },
  '/contact':     { color: new THREE.Color('#C49450'), radius: 2.2, spin: 0.06, camZ: 6.0, spread: 0.3 },
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const matRef = useRef<THREE.PointsMaterial>(null!)
  const { pointer, camera } = useThree()
  const location = useLocation()

  const PARTICLE_COUNT = 3500

  // Base positions on a unit sphere — we scale them per-frame toward target radius.
  const { basePositions, randomOffsets } = useMemo(() => {
    const base = new Float32Array(PARTICLE_COUNT * 3)
    const offs = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      base[i * 3] = Math.sin(phi) * Math.cos(theta)
      base[i * 3 + 1] = Math.sin(phi) * Math.sin(theta)
      base[i * 3 + 2] = Math.cos(phi)
      offs[i * 3] = (Math.random() - 0.5)
      offs[i * 3 + 1] = (Math.random() - 0.5)
      offs[i * 3 + 2] = (Math.random() - 0.5)
    }
    return { basePositions: base, randomOffsets: offs }
  }, [])

  const positions = useMemo(() => new Float32Array(basePositions), [basePositions])

  // Smoothly-tracked animated values
  const current = useRef({ radius: 2.6, spin: 0.05, spread: 0.4, camZ: 6.5 })
  const currentColor = useRef(new THREE.Color('#C49450'))

  useFrame((state, delta) => {
    const cfg = SCENE_CONFIG[location.pathname] || SCENE_CONFIG['/']
    const t = state.clock.elapsedTime
    const lerp = Math.min(delta * 2.2, 1)

    // Ease toward target config
    current.current.radius += (cfg.radius - current.current.radius) * lerp
    current.current.spin += (cfg.spin - current.current.spin) * lerp
    current.current.spread += (cfg.spread - current.current.spread) * lerp
    current.current.camZ += (cfg.camZ - current.current.camZ) * lerp

    // Update particle positions (breathing sphere)
    const r = current.current.radius
    const sp = current.current.spread
    const breathe = 1 + Math.sin(t * 0.6) * 0.04
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const arr = posAttr.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3
      const rr = (r + randomOffsets[ix] * sp) * breathe
      arr[ix] = basePositions[ix] * rr
      arr[ix + 1] = basePositions[ix + 1] * rr
      arr[ix + 2] = basePositions[ix + 2] * rr
    }
    posAttr.needsUpdate = true

    // Rotation + subtle mouse parallax
    pointsRef.current.rotation.y += delta * current.current.spin
    pointsRef.current.rotation.x = pointer.y * 0.25
    pointsRef.current.rotation.z = pointer.x * 0.1

    // Color transition
    currentColor.current.lerp(cfg.color, lerp)
    if (matRef.current) matRef.current.color.copy(currentColor.current)

    // Camera ease
    camera.position.z += (current.current.camZ - camera.position.z) * lerp
    camera.position.x += (pointer.x * 0.6 - camera.position.x) * lerp * 0.6
    camera.position.y += (pointer.y * 0.4 - camera.position.y) * lerp * 0.6
    camera.lookAt(0, 0, 0)
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.028}
        color={'#C49450'}
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// A slowly rotating wireframe core for depth
function CoreObject() {
  const ref = useRef<THREE.Group>(null!)
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.08
    ref.current.rotation.x += delta * 0.03
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.06
    ref.current.scale.setScalar(s)
  })
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={0.8}>
      <group ref={ref}>
        <mesh>
          <icosahedronGeometry args={[1.1, 1]} />
          <meshBasicMaterial color="#C49450" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
    </Float>
  )
}

export default function Scene3D() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div id="bg-canvas">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 60 }}
        dpr={[1, 1.75]}
        frameloop={reduced ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <Stars radius={60} depth={40} count={1200} factor={3} saturation={0} fade speed={0.6} />
          <ParticleField />
          <CoreObject />
        </Suspense>
      </Canvas>
    </div>
  )
}
