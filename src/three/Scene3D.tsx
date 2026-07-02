import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Sparkles, MeshDistortMaterial, Line } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useRef, useMemo, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { useLocation } from 'react-router-dom'


// ─── Per-route cinematic "mood" — light, data/AI palette ──────────────────────────────
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
  '/':            { color: new THREE.Color('#A8783A'), emissive: new THREE.Color('#C9954F'), radius: 3.0, spin: 0.06, camZ: 8.0, camY: 0.0,  spread: 0.6, distort: 0.28 },
  '/profil':      { color: new THREE.Color('#C9954F'), emissive: new THREE.Color('#A8783A'), radius: 3.6, spin: 0.04, camZ: 9.0, camY: 0.6,  spread: 1.4, distort: 0.35 },
  '/projets':     { color: new THREE.Color('#6E62D9'), emissive: new THREE.Color('#5B50BE'), radius: 4.6, spin: 0.09, camZ: 10.5, camY: -0.4, spread: 2.4, distort: 0.45 },
  '/competences': { color: new THREE.Color('#0F9E92'), emissive: new THREE.Color('#0C8377'), radius: 3.4, spin: 0.12, camZ: 8.5, camY: 0.3,  spread: 1.0, distort: 0.42 },
  '/parcours':    { color: new THREE.Color('#3A7FD4'), emissive: new THREE.Color('#2E66AD'), radius: 4.0, spin: 0.05, camZ: 9.5, camY: -0.2, spread: 1.8, distort: 0.32 },
  '/contact':     { color: new THREE.Color('#A8783A'), emissive: new THREE.Color('#C9954F'), radius: 2.6, spin: 0.07, camZ: 7.0, camY: 0.0,  spread: 0.4, distort: 0.5 },
}

function useMood() {
  const location = useLocation()
  return MOODS[location.pathname] || MOODS['/']
}

// ─── Glowing distorted crystalline core — data nucleus ───
function Core() {
  const mesh = useRef<THREE.Mesh>(null!)
  const inner = useRef<THREE.Group>(null!)
  const mat = useRef<any>(null!)
  const mood = useMood()
  const { pointer } = useThree()
  const cur = useRef({ r: 1, distort: 0.28 })
  const curColor = useRef(new THREE.Color('#A8783A'))
  const curEmissive = useRef(new THREE.Color('#C9954F'))
  const look = useRef({ x: 0, y: 0 })

  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.8, 1)
    const targetScale = mood.radius * 0.32
    cur.current.r += (targetScale - cur.current.r) * lerp
    cur.current.distort += (mood.distort - cur.current.distort) * lerp
    mesh.current.scale.setScalar(cur.current.r)

    mesh.current.rotation.y += delta * 0.15
    mesh.current.rotation.z += delta * 0.05

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
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.0}>
      <group ref={inner}>
        <mesh ref={mesh}>
          <icosahedronGeometry args={[1, 12]} />
          <MeshDistortMaterial
            ref={mat}
            color="#A8783A"
            emissive="#C9954F"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.75}
            clearcoat={1}
            clearcoatRoughness={0.15}
            distort={0.28}
            speed={2.2}
            transparent
            opacity={0.94}
          />
        </mesh>
      </group>
    </Float>
  )
}

// ─── Orbiting "data ring" — thin torus, tech/analytics feel ───
function DataRing({ tilt = 0.5, speedMul = 1, offset = 1.55 }: { tilt?: number; speedMul?: number; offset?: number }) {
  const group = useRef<THREE.Group>(null!)
  const mat = useRef<any>(null!)
  const mood = useMood()
  const cur = useRef({ r: 1 })
  const curColor = useRef(new THREE.Color('#C9954F'))

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
          color="#C9954F"
          emissive="#C9954F"
          emissiveIntensity={1.1}
          roughness={0.3}
          metalness={0.6}
          transparent
          opacity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

// ─── Burst of particles fired on route change ───
function RouteBurst() {
  const points = useRef<THREE.Points>(null!)
  const mat = useRef<THREE.PointsMaterial>(null!)
  const location = useLocation()
  const mood = useMood()
  const COUNT = 260
  const progress = useRef(1)
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
      mat.current.opacity = (1 - ease) * 0.75
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
        size={0.04}
        color="#C9954F"
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

// ─── Data flow curve — a single flowing line of connected nodes, like a live data stream ───
function DataFlowCurve({ seed = 0, colorHex = '#A8783A', speed = 0.12, radiusMul = 1 }: { seed?: number; colorHex?: string; speed?: number; radiusMul?: number }) {
  const group = useRef<THREE.Group>(null!)
  const mood = useMood()
  const matRefs = useRef<THREE.MeshBasicMaterial[]>([])
  const NODES = 7
  const curColor = useRef(new THREE.Color(colorHex))

  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i < NODES; i++) {
      const a = (i / (NODES - 1)) * Math.PI * 1.4 + seed
      const r = 1 + Math.sin(seed * 3 + i * 1.7) * 0.35
      pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a * 1.3 + seed) * 0.5, Math.sin(a) * r))
    }
    return pts
  }, [seed])

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5), [points])
  const linePoints = useMemo(() => curve.getPoints(48), [curve])

  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.6, 1)
    const t = state.clock.elapsedTime
    const targetScale = mood.radius * 0.42 * radiusMul
    group.current.scale.setScalar(
      group.current.scale.x + (targetScale - group.current.scale.x) * lerp
    )
    group.current.rotation.y = t * speed + seed
    group.current.rotation.x = Math.sin(t * 0.1 + seed) * 0.25

    curColor.current.lerp(mood.emissive, lerp)
    matRefs.current.forEach((m) => m?.color.copy(curColor.current))
  })

  return (
    <group ref={group}>
      <Line points={linePoints} color={colorHex} lineWidth={1.4} transparent opacity={0.45} toneMapped={false} />
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.028, 12, 12]} />
          <meshBasicMaterial
            ref={(el) => { if (el) matRefs.current[i] = el }}
            color={colorHex}
            toneMapped={false}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Volumetric particle cloud that morphs per route — "data points" ───
function ParticleField() {
  const points = useRef<THREE.Points>(null!)
  const mat = useRef<THREE.PointsMaterial>(null!)
  const mood = useMood()
  const { pointer } = useThree()
  const COUNT = 2200

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
  const curColor = useRef(new THREE.Color('#A8783A'))

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
        size={0.026}
        color="#A8783A"
        transparent
        opacity={0.55}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  )
}

// ─── Cinematic camera rig — smooth drift + parallax ───
function CameraRig() {
  const { camera, pointer } = useThree()
  const mood = useMood()
  useFrame((state, delta) => {
    const lerp = Math.min(delta * 1.4, 1)
    const t = state.clock.elapsedTime
    const shakeX = (Math.sin(t * 8.3) * 0.5 + Math.sin(t * 5.1) * 0.5) * 0.02
    const shakeY = (Math.sin(t * 7.1) * 0.5 + Math.sin(t * 4.4) * 0.5) * 0.02
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
  const cur = useRef(new THREE.Color('#C9954F'))
  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    l1.current.position.set(Math.sin(t * 0.5) * 6, Math.cos(t * 0.4) * 4, 4 + Math.sin(t * 0.3) * 2)
    cur.current.lerp(mood.emissive, Math.min(delta * 1.8, 1))
    l1.current.color.copy(cur.current)
  })
  return (
    <>
      <ambientLight intensity={0.75} color="#FFFDF8" />
      <pointLight ref={l1} intensity={22} distance={30} color="#C9954F" />
      <pointLight position={[-6, -4, -6]} intensity={7} distance={25} color="#6E62D9" />
      <hemisphereLight args={['#FFFFFF', '#E8DFD0', 0.6]} />
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
          <DynamicLights />
          <CameraRig />

          <Core />
          <DataRing tilt={0.55} speedMul={1} offset={1.55} />
          <DataRing tilt={-0.35} speedMul={0.65} offset={1.85} />
          <DataFlowCurve seed={0.4} colorHex="#A8783A" speed={0.1} radiusMul={1.1} />
          <DataFlowCurve seed={2.6} colorHex="#6E62D9" speed={-0.07} radiusMul={1.35} />
          <DataFlowCurve seed={4.8} colorHex="#0F9E92" speed={0.055} radiusMul={0.9} />
          <ParticleField />
          <RouteBurst />

          <Sparkles count={50} scale={13} size={2.4} speed={0.25} opacity={0.35} color="#C9954F" />

          <EffectComposer multisampling={0} enableNormalPass={false}>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.85}
              mipmapBlur
              radius={0.6}
            />
            <ChromaticAberration
              blendFunction={BlendFunction.NORMAL}
              offset={[0.0004, 0.0004] as any}
              radialModulation={false}
              modulationOffset={0}
            />
            <Noise blendFunction={BlendFunction.OVERLAY} opacity={0.015} premultiply />
            <Vignette eskil={false} offset={0.35} darkness={0.28} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
