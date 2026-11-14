import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { store, useStore } from '../lib/store'
import { rooms as roomInfo, type RoomKey } from '../lib/pricing'

/*
 * A cut-away isometric apartment. Every room is a button:
 * click it to add it to your clean. Its grime fades, the dust settles
 * and a burst of sparkles pops out.
 */

const C = {
  cobalt: '#2D4BE0',
  navy: '#1E2A7A',
  lemon: '#FFE14D',
  coral: '#FF7A59',
  mint: '#7FE0C2',
  white: '#FFFFFF',
  floor: '#E4E8F8',
  wall: '#F7F8FF',
  wood: '#E9B872',
  grey: '#C9CEE6',
}

type RoomDef = { id: string; key: RoomKey; index: number; x: [number, number]; z: [number, number] }

const ROOMS: RoomDef[] = [
  { id: 'kitchen', key: 'kitchen', index: 1, x: [-4, -0.4], z: [-3, 0] },
  { id: 'living', key: 'living', index: 1, x: [-0.4, 4], z: [-3, 0] },
  { id: 'bedroom-1', key: 'bedrooms', index: 1, x: [-4, -1.2], z: [0, 3] },
  { id: 'bathroom', key: 'bathrooms', index: 1, x: [-1.2, 0.6], z: [0, 3] },
  { id: 'laundry', key: 'laundry', index: 1, x: [0.6, 1.8], z: [0, 3] },
  { id: 'bedroom-2', key: 'bedrooms', index: 2, x: [1.8, 4], z: [0, 3] },
]

export const roomLabel = (r: RoomDef) => (r.key === 'bedrooms' ? `Bedroom ${r.index}` : roomInfo[r.key].single)

function toggle(r: RoomDef) {
  const n = store.get().counts[r.key]
  store.setCount(r.key, n >= r.index ? r.index - 1 : r.index)
}

function Box({ size, pos, color, rot = 0 }: { size: [number, number, number]; pos: [number, number, number]; color: string; rot?: number }) {
  return (
    <mesh position={pos} rotation-y={rot} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

function Cyl({ r, h, pos, color, seg = 20 }: { r: number; h: number; pos: [number, number, number]; color: string; seg?: number }) {
  return (
    <mesh position={pos} castShadow>
      <cylinderGeometry args={[r, r, h, seg]} />
      <meshStandardMaterial color={color} roughness={0.85} />
    </mesh>
  )
}

/** Furniture, positioned relative to each room's centre. */
function Furniture({ id }: { id: string }) {
  switch (id) {
    case 'kitchen':
      return (
        <group>
          <Box size={[3.2, 0.9, 0.7]} pos={[0, 0.45, -1.1]} color={C.white} />
          <Box size={[3.2, 0.06, 0.74]} pos={[0, 0.93, -1.1]} color={C.navy} />
          <Box size={[0.8, 1.9, 0.7]} pos={[1.3, 0.95, -1.1]} color={C.grey} />
          <Box size={[1.5, 0.9, 0.8]} pos={[-0.2, 0.45, 0.4]} color={C.lemon} />
          <Box size={[1.6, 0.06, 0.9]} pos={[-0.2, 0.93, 0.4]} color={C.white} />
          <Cyl r={0.16} h={0.6} pos={[-0.7, 0.3, 1.05]} color={C.coral} />
          <Cyl r={0.16} h={0.6} pos={[0.3, 0.3, 1.05]} color={C.coral} />
        </group>
      )
    case 'living':
      return (
        <group>
          <Box size={[2.6, 0.02, 1.8]} pos={[0, 0.02, 0.1]} color={C.mint} />
          <Box size={[2.4, 0.45, 0.8]} pos={[0, 0.25, -0.9]} color={C.coral} />
          <Box size={[2.4, 0.5, 0.25]} pos={[0, 0.7, -1.2]} color={C.coral} />
          <Box size={[0.9, 0.3, 0.6]} pos={[0, 0.2, 0.2]} color={C.wood} />
          <Box size={[1.4, 0.8, 0.2]} pos={[0, 0.4, 1.15]} color={C.navy} />
          <Cyl r={0.2} h={0.4} pos={[1.7, 0.2, -1]} color={C.white} />
          <mesh position={[1.7, 0.75, -1]} castShadow>
            <icosahedronGeometry args={[0.38, 0]} />
            <meshStandardMaterial color="#3DBE8B" roughness={0.9} flatShading />
          </mesh>
        </group>
      )
    case 'bedroom-1':
    case 'bedroom-2':
      return (
        <group rotation-y={id === 'bedroom-2' ? Math.PI : 0}>
          <Box size={[1.5, 0.45, 2]} pos={[-0.3, 0.23, 0.2]} color={C.white} />
          <Box size={[1.5, 0.08, 1.3]} pos={[-0.3, 0.49, 0.55]} color={id === 'bedroom-1' ? C.cobalt : C.coral} />
          <Box size={[1.2, 0.18, 0.4]} pos={[-0.3, 0.55, -0.55]} color={C.lemon} />
          <Box size={[1.5, 0.9, 0.12]} pos={[-0.3, 0.45, -0.85]} color={C.wood} />
          <Box size={[0.45, 0.5, 0.45]} pos={[0.8, 0.25, -0.6]} color={C.wood} />
        </group>
      )
    case 'bathroom':
      return (
        <group>
          <Box size={[1.4, 0.55, 0.75]} pos={[0, 0.28, -1]} color={C.white} />
          <Box size={[1.2, 0.05, 0.55]} pos={[0, 0.56, -1]} color="#9FD8FF" />
          <Cyl r={0.22} h={0.42} pos={[-0.35, 0.21, 0.9]} color={C.white} />
          <Box size={[0.6, 0.7, 0.4]} pos={[0.45, 0.35, 0.95]} color={C.navy} />
        </group>
      )
    case 'laundry':
      return (
        <group>
          <Box size={[0.8, 0.85, 0.75]} pos={[0, 0.43, -0.9]} color={C.white} />
          <mesh position={[0, 0.45, -0.51]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 24]} />
            <meshStandardMaterial color={C.cobalt} />
          </mesh>
          <Box size={[0.8, 0.85, 0.75]} pos={[0, 0.43, 0.2]} color={C.white} />
          <mesh position={[0, 0.45, 0.59]} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.24, 0.24, 0.04, 24]} />
            <meshStandardMaterial color={C.coral} />
          </mesh>
        </group>
      )
    default:
      return null
  }
}

/** Grime blotches, dust motes and a sparkle burst for one room. */
function Room({ r, selected, onHover }: { r: RoomDef; selected: boolean; onHover: (r: RoomDef | null, e?: ThreeEvent<PointerEvent>) => void }) {
  const w = r.x[1] - r.x[0]
  const d = r.z[1] - r.z[0]
  const cx = (r.x[0] + r.x[1]) / 2
  const cz = (r.z[0] + r.z[1]) / 2
  const [hover, setHover] = useState(false)
  const floor = useRef<THREE.MeshStandardMaterial>(null)
  const grime = useRef<THREE.Group>(null)
  const dust = useRef<THREE.Points>(null)
  const sparks = useRef<THREE.Group>(null)
  const burst = useRef(0)
  const lift = useRef<THREE.Group>(null)
  const clean = useRef(selected ? 1 : 0)

  const spots = useMemo(() => Array.from({ length: Math.round(w * d * 0.9) + 2 }, (_, i) => {
    const s = Math.sin(i * 91.7 + w * 13.1) * 0.5 + 0.5
    const t = Math.sin(i * 47.3 + d * 7.7) * 0.5 + 0.5
    return { x: (s - 0.5) * (w - 0.6), z: (t - 0.5) * (d - 0.6), r: 0.12 + ((i * 37) % 10) / 45 }
  }), [w, d])

  const dustGeo = useMemo(() => {
    const n = 22
    const pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * (w - 0.4)
      pos[i * 3 + 1] = 0.2 + Math.random() * 1.4
      pos[i * 3 + 2] = (Math.random() - 0.5) * (d - 0.4)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [w, d])

  const sparkDirs = useMemo(() => Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2
    return new THREE.Vector3(Math.cos(a), 1.2 + (i % 3) * 0.4, Math.sin(a)).normalize()
  }), [])

  const prev = useRef(selected)
  useEffect(() => {
    if (selected && !prev.current) burst.current = 1
    prev.current = selected
  }, [selected])

  useFrame((state, dt) => {
    clean.current = THREE.MathUtils.damp(clean.current, selected ? 1 : 0, 6, dt)
    const k = clean.current
    if (floor.current) floor.current.color.set(selected ? C.lemon : hover ? '#FFFFFF' : C.floor)
    if (grime.current) {
      grime.current.scale.setScalar(Math.max(0.0001, 1 - k))
      grime.current.visible = k < 0.99
    }
    if (dust.current) {
      const m = dust.current.material as THREE.PointsMaterial
      m.opacity = 0.75 * (1 - k)
      dust.current.position.y = Math.sin(state.clock.elapsedTime * 0.8 + cx) * 0.08 - k * 0.5
    }
    if (lift.current) lift.current.position.y = THREE.MathUtils.damp(lift.current.position.y, hover ? 0.12 : 0, 10, dt)
    if (sparks.current) {
      burst.current = Math.max(0, burst.current - dt * 1.3)
      const b = 1 - burst.current
      sparks.current.visible = burst.current > 0
      sparks.current.children.forEach((c, i) => {
        c.position.copy(sparkDirs[i]).multiplyScalar(0.3 + b * 2.2)
        c.position.y += 0.6
        c.scale.setScalar(Math.sin(Math.PI * Math.min(1, b * 1.2)) * 0.9 + 0.001)
        c.rotation.y += dt * 6
      })
    }
  })

  return (
    <group position={[cx, 0, cz]}>
      <group
        ref={lift}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); onHover(r, e); document.body.style.cursor = 'pointer' }}
        onPointerMove={(e) => onHover(r, e)}
        onPointerOut={() => { setHover(false); onHover(null); document.body.style.cursor = '' }}
        onClick={(e) => { e.stopPropagation(); toggle(r) }}
      >
        <mesh position={[0, 0.06, 0]} receiveShadow>
          <boxGeometry args={[w - 0.08, 0.12, d - 0.08]} />
          <meshStandardMaterial ref={floor} color={C.floor} roughness={0.95} />
        </mesh>
        <group ref={grime} position={[0, 0.125, 0]}>
          {spots.map((s, i) => (
            <mesh key={i} position={[s.x, 0, s.z]} rotation-x={-Math.PI / 2}>
              <circleGeometry args={[s.r, 14]} />
              <meshBasicMaterial color="#8C8FA8" transparent opacity={0.45} />
            </mesh>
          ))}
        </group>
        <group position={[0, 0.12, 0]}><Furniture id={r.id} /></group>
      </group>
      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial color="#8C8FA8" size={0.09} transparent opacity={0.75} depthWrite={false} />
      </points>
      <group ref={sparks} visible={false}>
        {sparkDirs.map((_, i) => (
          <mesh key={i}>
            <octahedronGeometry args={[0.14, 0]} />
            <meshBasicMaterial color={i % 2 ? C.lemon : C.white} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function Walls() {
  const h = 1.5
  const t = 0.16
  return (
    <group>
      {/* back walls (full height) */}
      <Box size={[8.3, h, t]} pos={[0, h / 2, -3.07]} color={C.wall} />
      <Box size={[t, h, 6.3]} pos={[-4.07, h / 2, 0]} color={C.wall} />
      <Box size={[8.3, 0.06, t + 0.02]} pos={[0, h, -3.07]} color={C.navy} />
      <Box size={[t + 0.02, 0.06, 6.3]} pos={[-4.07, h, 0]} color={C.navy} />
      {/* window on the back wall */}
      <Box size={[1.6, 0.8, 0.04]} pos={[1.8, 0.95, -2.98]} color="#BFD7FF" />
      {/* front walls cut low so you can see in */}
      <Box size={[8.3, 0.32, t]} pos={[0, 0.16, 3.07]} color={C.wall} />
      <Box size={[t, 0.32, 6.3]} pos={[4.07, 0.16, 0]} color={C.wall} />
      {/* partitions */}
      <Box size={[8, 0.7, 0.08]} pos={[0, 0.35, 0]} color={C.wall} />
      <Box size={[0.08, 0.7, 3]} pos={[-0.4, 0.35, -1.5]} color={C.wall} />
      <Box size={[0.08, 0.7, 3]} pos={[-1.2, 0.35, 1.5]} color={C.wall} />
      <Box size={[0.08, 0.7, 3]} pos={[0.6, 0.35, 1.5]} color={C.wall} />
      <Box size={[0.08, 0.7, 3]} pos={[1.8, 0.35, 1.5]} color={C.wall} />
      {/* base slab */}
      <Box size={[8.6, 0.3, 6.6]} pos={[0, -0.15, 0]} color={C.navy} />
    </group>
  )
}

function Scene({ onHover, reduced }: { onHover: (r: RoomDef | null, e?: ThreeEvent<PointerEvent>) => void; reduced: boolean }) {
  const counts = useStore((s) => s.counts)
  const group = useRef<THREE.Group>(null)
  const t0 = useRef(0)
  const { camera, size } = useThree()
  useEffect(() => {
    // Fit the 8 x 6 m floor plan to the canvas width.
    camera.zoom = Math.min(62, size.width / 9.2)
    camera.updateProjectionMatrix()
  }, [camera, size.width])
  useFrame((_, dt) => {
    t0.current += dt
    if (group.current && !reduced) {
      group.current.rotation.y = Math.sin(t0.current * 0.25) * 0.12
      group.current.position.y = Math.sin(t0.current * 0.8) * 0.06
    }
  })
  return (
    <>
      <hemisphereLight args={['#ffffff', '#7d8fe8', 1.6]} />
      <directionalLight position={[6, 10, 4]} intensity={1.9} castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
      <group ref={group}>
        <Walls />
        {ROOMS.map((r) => (
          <Room key={r.id} r={r} selected={counts[r.key] >= r.index} onHover={onHover} />
        ))}
      </group>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.7} maxPolarAngle={1.15} minAzimuthAngle={-0.6} maxAzimuthAngle={1.4} />
    </>
  )
}

export default function House3D({ reduced }: { reduced: boolean }) {
  const [tip, setTip] = useState<{ r: RoomDef; x: number; y: number } | null>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const counts = useStore((s) => s.counts)
  const onHover = (r: RoomDef | null, e?: ThreeEvent<PointerEvent>) => {
    if (!r || !e || !wrap.current) return setTip(null)
    const b = wrap.current.getBoundingClientRect()
    setTip({ r, x: e.nativeEvent.clientX - b.left, y: e.nativeEvent.clientY - b.top })
  }
  useEffect(() => () => { document.body.style.cursor = '' }, [])

  return (
    <div ref={wrap} className="house-wrap">
      <Canvas shadows orthographic dpr={[1, 2]} camera={{ position: [10, 9, 10], zoom: 62, near: -50, far: 100 }} gl={{ antialias: true, alpha: true }}>
        <Scene onHover={onHover} reduced={reduced} />
      </Canvas>
      {tip && (
        <div className="house-tip" style={{ left: tip.x, top: tip.y }}>
          <strong>{roomLabel(tip.r)}</strong>
          <span>{counts[tip.r.key] >= tip.r.index ? 'Added · click to remove' : `Click to add · from $${roomInfo[tip.r.key].price}`}</span>
        </div>
      )}
      <div className="house-keys" aria-label="Rooms in the 3D home">
        {ROOMS.map((r) => (
          <button key={r.id} type="button" aria-pressed={counts[r.key] >= r.index} onClick={() => toggle(r)}>
            {roomLabel(r)}
          </button>
        ))}
      </div>
    </div>
  )
}
