import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Environment, Sparkles, MeshDistortMaterial, Trail, Stars, MeshReflectorMaterial } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, DepthOfField, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useRef, useMemo, useState, useEffect, Suspense } from 'react'
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
  const inner = useRef<THREE.Group>(null!)
  const mat = useRef<any>(null!)
  const mood = useMood()
  const { pointer } = useThree()
  const cur = useRef({ r: 1, distort: 0.3 })
  const curColor = useRef(new THREE.Color('#C49450'))
  const curEmissive = useRef(new THREE.Color('#E4B672'))
  const look = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.8, 1)
    // Scale the core relative to particle radius
    const targetScale = mood.radius * 0.34
    cur.current.r += (targetScale - cur.current.r) * lerp
    cur.current.distort += (mood.distort - cur.current.distort) * lerp
    mesh.current.scale.setScalar(cur.current.r)

    mesh.current.rotation.y += delta * 0.15
    mesh.current.rotation.z += delta * 0.05

    // Gentle "attention" toward the cursor — the core subtly leans toward pointer
    look.current.x += (pointer.x * 0.35 - look.current.x) * Math.min(delta * 2.2, 1)
    look.current.y += (-pointer.y * 0.25 - look.current.y) * Math.min(delta * 2.2, 1)
    if (inner.current) {
      inner.current.rotation.x = look.current.y
      inner.current.rotation.y = look.current.x
    }

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
      <group ref={inner}>
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
      </group>
    </Float>
  )
}

// ─── Orbiting "data ring" — thin torus made of segmented arcs, tech/analytics feel ───
function DataRing({ tilt = 0.5, speedMul = 1, offset = 1.55 }: { tilt?: number; speedMul?: number; offset?: number }) {
  const group = useRef<THREE.Group>(null!)
  const mat = useRef<any>(null!)
  const mood = useMood()
  const cur = useRef({ r: 1 })
  const curColor = useRef(new THREE.Color('#E4B672'))

  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.8, 1)
    const t = state.clock.elapsedTime
    const targetR = mood.radius * offset * 0.34
    cur.current.r += (targetR - cur.current.r) * lerp
    group.current.scale.setScalar(cur.current.r)
    group.current.rotation.z = tilt + Math.sin(t * 0.15) * 0.08
    group.current.rotation.y += delta * mood.spin * speedMul * -1.4

    curColor.current.lerp(mood.emissive, lerp)
    if (mat.current) {
      mat.current.color.copy(curColor.current)
      mat.current.emissive?.copy(curColor.current)
    }
  })

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.012, 8, 128]} />
        <meshStandardMaterial
          ref={mat}
          color="#E4B672"
          emissive="#E4B672"
          emissiveIntensity={1.4}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.55}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// ─── Burst of particles fired on route change — a "step complete" pulse ───
function RouteBurst() {
  const points = useRef<THREE.Points>(null!)
  const mat = useRef<THREE.PointsMaterial>(null!)
  const location = useLocation()
  const mood = useMood()
  const COUNT = 260
  const progress = useRef(1) // 1 = finished/idle
  const dirs = useMemo(() => {
    const d = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      d[i * 3] = Math.sin(phi) * Math.cos(theta)
      d[i * 3 + 1] = Math.sin(phi) * Math.sin(theta)
      d[i * 3 + 2] = Math.cos(phi)
    }
    return d
  }, [])
  const positions = useMemo(() => new Float32Array(COUNT * 3), [])
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    progress.current = 0
  }, [location.pathname])

  useFrame((_, delta) => {
    if (progress.current >= 1) {
      if (points.current) points.current.visible = false
      return
    }
    points.current.visible = true
    progress.current = Math.min(1, progress.current + delta * 0.55)
    const ease = 1 - Math.pow(1 - progress.current, 3)
    const dist = ease * mood.radius * 2.4
    const arr = (points.current.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array
    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3
      arr[ix] = dirs[ix] * dist
      arr[ix + 1] = dirs[ix + 1] * dist
      arr[ix + 2] = dirs[ix + 2] * dist
    }
    ;(points.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true
    if (mat.current) {
      mat.current.opacity = (1 - ease) * 0.9
      mat.current.color.copy(mood.emissive)
    }
  })

  return (
    <points ref={points} visible={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        size={0.045}
        color="#E4B672"
        transparent
        opacity={0}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

// ─── Orbiting light-trail comet for dynamic video feel ───
function Comet({ phase = 0, speed = 1, size = 0.06, trailColor = '#E4B672' }: { phase?: number; speed?: number; size?: number; trailColor?: string }) {
  const ref = useRef<THREE.Mesh>(null!)
  const mood = useMood()
  const curColor = useRef(new THREE.Color(trailColor))

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime * speed + phase
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
    <Trail width={2.5} length={7} color={trailColor} attenuation={(w) => w * w}>
      <mesh ref={ref}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial color={trailColor} toneMapped={false} />
      </mesh>
    </Trail>
  )
}

// ─── Reflective floor for cinematic depth (like a studio product shot) ───
function FloorReflection() {
  const mood = useMood()
  const mat = useRef<any>(null!)
  const curColor = useRef(new THREE.Color('#C49450'))

  useFrame((_, delta) => {
    curColor.current.lerp(mood.color, Math.min(delta * 1.8, 1))
    if (mat.current) mat.current.color?.set?.(curColor.current)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.4, 0]}>
      <planeGeometry args={[60, 60]} />
      <MeshReflectorMaterial
        ref={mat}
        blur={[400, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={35}
        roughness={1}
        depthScale={1}
        minDepthThreshold={0.85}
        color="#0a0a0c"
        metalness={0.4}
        mirror={0.35}
      />
    </mesh>
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
    // Subtle organic "handheld camera" micro-jitter — makes the motion feel shot, not looped
    const shakeX = (Math.sin(t * 8.3) * 0.5 + Math.sin(t * 5.1) * 0.5) * 0.025
    const shakeY = (Math.sin(t * 7.1) * 0.5 + Math.sin(t * 4.4) * 0.5) * 0.025
    const targetZ = mood.camZ + Math.sin(t * 0.15) * 0.4
    const targetX = pointer.x * 1.4 + Math.sin(t * 0.1) * 0.6 + shakeX
    const targetY = mood.camY + pointer.y * 0.9 + Math.cos(t * 0.12) * 0.3 + shakeY
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

          <Stars radius={70} depth={40} count={1600} factor={3.2} saturation={0} fade speed={0.5} />
          <FloorReflection />

          <Core />
          <DataRing tilt={0.55} speedMul={1} offset={1.55} />
          <DataRing tilt={-0.35} speedMul={0.65} offset={1.85} />
          <Comet phase={0} speed={1} size={0.06} trailColor="#E4B672" />
          <Comet phase={Math.PI} speed={0.72} size={0.045} trailColor="#8C80F2" />
          <ParticleField />
          <RouteBurst />

          <Sparkles count={70} scale={14} size={3} speed={0.3} opacity={0.5} color="#E4B672" />

          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={1.15}
              luminanceThreshold={0.15}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.7}
            />
            <DepthOfField
              focusDistance={0.012}
              focalLength={0.09}
              bokehScale={3.5}
              height={480}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0006, 0.0006] as any}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.035} premultiply />
            <Vignette eskil={false} offset={0.25} darkness={0.85} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
