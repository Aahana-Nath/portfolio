'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// ─── Inner knot mesh ────────────────────────────────────────────────────
function TorusKnot() {
  const meshRef = useRef<THREE.Mesh>(null)
  const { mouse } = useThree()

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    // Slow, elegant self-rotation
    meshRef.current.rotation.x = t * 0.06 + mouse.y * 0.12
    meshRef.current.rotation.y = t * 0.10 + mouse.x * 0.12
    meshRef.current.rotation.z = t * 0.04
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* p=2,q=3 yields a smooth trefoil-style knot */}
        <torusKnotGeometry args={[1.1, 0.32, 320, 40, 2, 3]} />
        <meshStandardMaterial
          color="#e8e4de"
          roughness={0.3}
          metalness={0.08}
        />
      </mesh>
    </Float>
  )
}

// ─── Orbiting satellite spheres ──────────────────────────────────────────
function OrbitingSpheres() {
  const group = useRef<THREE.Group>(null)
  const { mouse } = useThree()

  const positions = useMemo<[number, number, number][]>(
    () => [
      [2.4, 0.6, 0.2],
      [-2.2, -0.4, 0.6],
      [0.8, 2.1, -0.4],
      [-0.6, -2.3, 0.2],
    ],
    []
  )

  useFrame(({ clock }) => {
    if (!group.current) return
    const t = clock.getElapsedTime()
    group.current.rotation.y = t * 0.07 + mouse.x * 0.06
    group.current.rotation.x = mouse.y * 0.05
  })

  return (
    <group ref={group}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <sphereGeometry args={[0.08 + i * 0.018, 32, 32]} />
          <meshStandardMaterial
            color="#d0ccc6"
            roughness={0.3}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

// ─── Soft connection ring ────────────────────────────────────────────────
function ConnectionRing() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock, mouse }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    meshRef.current.rotation.x = Math.PI / 2 + t * 0.04 + mouse.y * 0.08
    meshRef.current.rotation.z = t * 0.05 + mouse.x * 0.06
    meshRef.current.scale.setScalar(1 + Math.sin(t * 0.5) * 0.015)
  })

  return (
    <mesh ref={meshRef} renderOrder={-1}>
      <torusGeometry args={[1.85, 0.012, 16, 180]} />
      <meshStandardMaterial
        color="#c0bcb6"
        roughness={0.4}
        metalness={0.0}
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

// ─── Scene root ──────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Soft three-point lighting — cinematic and shadow-friendly */}
      <ambientLight intensity={0.6} color="#fff8f2" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.8}
        color="#ffffff"
        castShadow
      />
      <directionalLight position={[-5, 2, -2]} intensity={0.5} color="#e8eaff" />
      <pointLight position={[0, -4, 2]} intensity={0.4} color="#fdf6f0" />

      <TorusKnot />
      <OrbitingSpheres />
      <ConnectionRing />
    </>
  )
}

// ─── Canvas wrapper (exported) ───────────────────────────────────────────
export default function Scene3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 42 }}
      shadows
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <Scene />
    </Canvas>
  )
}
