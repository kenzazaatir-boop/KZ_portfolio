import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A floating 3D panel textured with a static photograph — the photo
 * counterpart to VideoPanel3D. Same "screen in space" treatment (glowing
 * frame + subtle mouse-parallax tilt) but backed by a THREE.TextureLoader
 * image instead of a video texture.
 */
export default function PhotoPanel3D({
  src,
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  width = 2.6,
  height = 1.6,
  tilt = 0.15,
}: {
  src: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  tilt?: number
}) {
  const mesh = useRef<THREE.Mesh>(null!)
  const frame = useRef<THREE.Mesh>(null!)
  const { pointer } = useThree()
  const [ready, setReady] = useState(false)

  const texture = useLoader(THREE.TextureLoader, src)

  useMemo(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.needsUpdate = true
      setReady(true)
    }
  }, [texture])

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
      {/* Thin glowing frame behind the panel — gives it a "screen" presence,
          matching VideoPanel3D's treatment */}
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
        <meshBasicMaterial map={texture} toneMapped={false} transparent opacity={ready ? 1 : 0} />
      </mesh>
    </group>
  )
}
