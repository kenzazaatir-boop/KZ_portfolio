import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, Sparkles, MeshDistortMaterial, Trail } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useRef, useMemo, Suspense } from 'react'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'

// ─── Per-route cinematic "mood" ──────────────────────────────
type Mood = {
  color: THREE.Color
  emissive: THREE.Color
  radius: number
  spin: number
  camZ: number
  camY: number
  spread: number
  distort: number
}

const MOODS: Record<string, Mood> = {
  '/':            { color: new THREE.Color('#C49450'), emissive: new THREE.Color('#E4B672'), radius: 3.0, spin: 0.06, camZ: 8.0, camY: 0.0,  spread: 0.6, distort: 0.3 },
  '/profil':      { color: new THREE.Color('#E4B672'), emissive: new THREE.Color('#C49450'), radius: 3.6, spin: 0.04, camZ: 9.0, camY: 0.6,  spread: 1.4, distort: 0.4 },
  '/projets':     { color: new THREE.Color('#8C80F2'), emissive: new THREE.Color('#6B5FC4'), radius: 4.6, spin: 0.09, camZ: 10.5, camY: -0.4, spread: 2.4, distort: 0.55 },
  '/competences': { color: new THREE.Color('#42E8DF'), emissive: new THREE.Color('#2A9E97'), radius: 3.4, spin: 0.12, camZ: 8.5, camY: 0.3,  spread: 1.0, distort: 0.5 },
  '/parcours':    { color: new THREE.Color('#5BA4F8'), emissive: new THREE.Color('#3A84D4'), radius: 4.0, spin: 0.05, camZ: 9.5, camY: -0.2, spread: 1.8, distort: 0.35 },
  '/contact':     { color: new THREE.Color('#C49450'), emissive: new THREE.Color('#E4B672'), radius: 2.6, spin: 0.07, camZ: 7.0, camY: 0.0,  spread: 0.4, distort: 0.6 },
}

function useMood() {
  const location = useLocation()
  return MOODS[location.pathname] || MOODS['/']
}

// ─── Glowing distorted crystalline core (video-like organic motion) ───
function Core() {
  const mesh = useRef<THREE.Mesh>(null!)
  const mat = useRef<any>(null!)
  const mood = useMood()
  const cur = useRef({ r: 1, distort: 0.3 })
  const curColor = useRef(new THREE.Color('#C49450'))
  const curEmissive = useRef(new THREE.Color('#E4B672'))

  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.8, 1)
    // Scale the core relative to particle radius
    const targetScale = mood.radius * 0.34
    cur.current.r += (targetScale - cur.current.r) * lerp
    cur.current.distort += (mood.distort - cur.current.distort) * lerp
    mesh.current.scale.setScalar(cur.current.r)

    mesh.current.rotation.y += delta * 0.15
    mesh.current.rotation.z += delta * 0.05

    curColor.current.lerp(mood.color, lerp)
    curEmissive.current.lerp(mood.emissive, lerp)
    if (mat.current) {
      mat.current.color.copy(curColor.current)
      mat.current.emissive?.copy(curEmissive.current)
      mat.current.distort = cur.current.distort
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.7} floatIntensity={1.1}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1, 12]} />
        <MeshDistortMaterial
          ref={mat}
          color="#C49450"
          emissive="#E4B672"
          emissiveIntensity={0.35}
          roughness={0.15}
          metalness={0.9}
          clearcoat={1}
          clearcoatRoughness={0.1}
          distort={0.3}
          speed={2.2}
        />
      </mesh>
    </Float>
  )
}

// ─── Orbiting light-trail comet for dynamic video feel ───
function Comet() {
  const ref = useRef<THREE.Mesh>(null!)
  const mood = useMood()
  const curColor = useRef(new THREE.Color('#E4B672'))

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const R = mood.radius * 1.3
    ref.current.position.set(
      Math.cos(t * 0.6) * R,
      Math.sin(t * 0.9) * R * 0.4,
      Math.sin(t * 0.6) * R
    )
    curColor.current.lerp(mood.emissive, Math.min(delta * 1.8, 1))
    ;(ref.current.material as THREE.MeshBasicMaterial).color.copy(curColor.current)
  })

  return (
    <Trail width={2.5} length={7} color={'#E4B672'} attenuation={(w) => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#E4B672" toneMapped={false} />
      </mesh>
    </Trail>
  )
}

// ─── Volumetric particle cloud that morphs per route ───
function ParticleField() {
  const points = useRef<THREE.Points>(null!)
  const mat = useRef<THREE.PointsMaterial>(null!)
  const mood = useMood()
  const { pointer } = useThree()
  const COUNT = 2600

  const { base, offs, positions } = useMemo(() => {
    const base = new Float32Array(COUNT * 3)
    const offs = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      base[i * 3] = Math.sin(phi) * Math.cos(theta)
      base[i * 3 + 1] = Math.sin(phi) * Math.sin(theta)
      base[i * 3 + 2] = Math.cos(phi)
      offs[i * 3] = Math.random() - 0.5
      offs[i * 3 + 1] = Math.random() - 0.5
      offs[i * 3 + 2] = Math.random() - 0.5
    }
    return { base, offs, positions: new Float32Array(base) }
  }, [])

  const cur = useRef({ r: 3, spread: 0.6 })
  const curColor = useRef(new THREE.Color('#C49450'))

  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.8, 1)
    const t = state.clock.elapsedTime
    cur.current.r += (mood.radius - cur.current.r) * lerp
    cur.current.spread += (mood.spread - cur.current.spread) * lerp

    const r = cur.current.r
    const sp = cur.current.spread
    const breathe = 1 + Math.sin(t * 0.5) * 0.05
    const arr = (points.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      const rr = (r + offs[ix] * sp) * breathe
      arr[ix] = base[ix] * rr
      arr[ix + 1] = base[ix + 1] * rr
      arr[ix + 2] = base[ix + 2] * rr
    }
    ;(points.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true

    points.current.rotation.y += delta * mood.spin
    points.current.rotation.x = pointer.y * 0.2

    curColor.current.lerp(mood.color, lerp)
    if (mat.current) mat.current.color.copy(curColor.current)
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.03}
        color="#C49450"
        transparent
        opacity={0.9}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

// ─── Cinematic camera rig — smooth drift + parallax like a moving shot ───
function CameraRig() {
  const { camera, pointer } = useThree()
  const mood = useMood()
  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.4, 1)
    const t = state.clock.elapsedTime
    const targetZ = mood.camZ + Math.sin(t * 0.15) * 0.4
    const targetX = pointer.x * 1.4 + Math.sin(t * 0.1) * 0.6
    const targetY = mood.camY + pointer.y * 0.9 + Math.cos(t * 0.12) * 0.3
    camera.position.z += (targetZ - camera.position.z) * lerp
    camera.position.x += (targetX - camera.position.x) * lerp
    camera.position.y += (targetY - camera.position.y) * lerp
    camera.lookAt(0, 0, 0)
  })
  return null
}

function DynamicLights() {
  const l1 = useRef<THREE.PointLight>(null!)
  const mood = useMood()
  const cur = useRef(new THREE.Color('#E4B672'))
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    l1.current.position.set(Math.sin(t * 0.5) * 6, Math.cos(t * 0.4) * 4, 4 + Math.sin(t * 0.3) * 2)
    cur.current.lerp(mood.emissive, Math.min(delta * 1.8, 1))
    l1.current.color.copy(cur.current)
  })
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight ref={l1} intensity={45} distance={30} color="#E4B672" />
      <pointLight position={[-6, -4, -6]} intensity={12} distance={25} color="#8C80F2" />
    </>
  )
}

export default function Scene3D() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div id="bg-canvas">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 55 }}
        dpr={[1, 1.75]}
        frameloop={reduced ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Environment preset="night" />
          <DynamicLights />
          <CameraRig />

          <Core />
          <Comet />
          <ParticleField />

          <Sparkles count={80} scale={14} size={3} speed={0.3} opacity={0.5} color="#E4B672" />

          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={1.15}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.7}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0006, 0.0006] as any}
              radialModulation={false}
              modulationOffset={0}
            />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
