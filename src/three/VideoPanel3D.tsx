import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A floating 3D panel textured with a looping video — makes the footage feel
 * like a genuine object living inside the WebGL scene (screen/hologram feel)
 * rather than a flat <video> tag layered on top of it. Subtle mouse-parallax
 * tilt reinforces the "it's really there in 3D space" illusion.
 */
export default function VideoPanel3D({
  src,
  webmSrc,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  width = 3.2,
  height = 1.8,
  tilt = 0.15,
  cornerRadius = 0.08,
}: {
  src: string
  webmSrc?: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  tilt?: number
  cornerRadius?: number
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const frame = useRef<THREE.Mesh>(null!)
  const { pointer } = useThree()
  const [ready, setReady] = useState(false)

  const video = useMemo(() => {
    const v = document.createElement('video')
    // Prefer webm when supported/provided for a lighter payload
    if (webmSrc && v.canPlayType('video/webm')) {
      v.src = webmSrc
    } else {
      v.src = src
    }
    v.crossOrigin = 'anonymous'
    v.loop = true
    v.muted = true
    v.playsInline = true
    v.setAttribute('playsinline', 'true')
    v.addEventListener('loadeddata', () => setReady(true))
    v.play().catch(() => {
      /* autoplay can be blocked before user gesture on some mobile browsers; harmless for a muted bg video */
    })
    return v
  }, [src, webmSrc])

  const texture = useMemo(() => {
    const t = new THREE.VideoTexture(video)
    t.colorSpace = THREE.SRGBColorSpace
    t.minFilter = THREE.LinearFilter
    t.magFilter = THREE.LinearFilter
    return t
  }, [video])

  useEffect(() => {
    return () => {
      video.pause()
      video.src = ''
    }
  }, [video])

  const baseRot = useMemo(() => new THREE.Euler(...rotation), [rotation])

  useFrame((_, delta) => {
    if (!mesh.current) return
    const lerp = Math.min(delta * 2, 1)
    const targetY = baseRot.y + pointer.x * tilt
    const targetX = baseRot.x - pointer.y * tilt * 0.7
    mesh.current.rotation.y += (targetY - mesh.current.rotation.y) * lerp
    mesh.current.rotation.x += (targetX - mesh.current.rotation.x) * lerp
    if (frame.current) {
      frame.current.rotation.copy(mesh.current.rotation)
    }
  })

  return (
    <group position={position}>
      {/* Thin glowing frame behind the panel — gives it a "screen" presence */}
      <mesh ref={frame} position={[0, 0, -0.01]}>
        <planeGeometry args={[width + 0.06, height + 0.06]} />
        <meshStandardMaterial
          color="#A8783A"
          emissive="#C9954F"
          emissiveIntensity={0.5}
          roughness={0.4}
          metalness={0.5}
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh ref={mesh}>
        <planeGeometry args={[width, height, 1, 1]} />
        <meshBasicMaterial
          map={texture}
          toneMapped={false}
          transparent
          opacity={ready ? 1 : 0}
        />
      </mesh>
    </group>
  )
}
