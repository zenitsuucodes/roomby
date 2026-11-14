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

function Sph({ r, pos, color, scale }: { r: number; pos: [number, number, number]; color: string; scale?: [number, number, number] }) {
  return (
    <mesh position={pos} scale={scale} castShadow>
      <sphereGeometry args={[r, 16, 12]} />
      <meshStandardMaterial color={color} roughness={0.7} />
    </mesh>
  )
}

function Cone({ r, h, pos, color, top = 0 }: { r: number; h: number; pos: [number, number, number]; color: string; top?: number }) {
  return (
    <mesh position={pos} castShadow>
      <cylinderGeometry args={[top, r, h, 18, 1, true]} />
      <meshStandardMaterial color={color} roughness={0.8} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Plant({ pos, s = 1 }: { pos: [number, number, number]; s?: number }) {
  return (
    <group position={pos} scale={s}>
      <Cyl r={0.14} h={0.26} pos={[0, 0.13, 0]} color={C.white} />
      <Box size={[0.3, 0.04, 0.3]} pos={[0, 0.27, 0]} color="#7A5A3A" />
      {[[0, 0.45, 0, 0.2], [0.1, 0.62, 0.05, 0.14], [-0.09, 0.58, -0.06, 0.13]].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <icosahedronGeometry args={[r, 0]} />
          <meshStandardMaterial color={i === 1 ? '#5ED39F' : '#3DBE8B'} roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** A little robot vacuum doing laps around the living-room rug. */
function RobotVac() {
  const ref = useRef<THREE.Group>(null)
  const light = useRef<THREE.MeshBasicMaterial>(null)
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.45
    if (ref.current) {
      const x = Math.cos(t) * 0.98
      const z = 0.15 + Math.sin(t) * 0.52
      ref.current.position.set(x, 0.05, z)
      ref.current.rotation.y = -Math.atan2(Math.cos(t) * 0.52, -Math.sin(t) * 0.98) + Math.PI / 2
    }
    if (light.current) light.current.color.set(Math.sin(state.clock.elapsedTime * 6) > 0 ? '#7FE0C2' : '#FFFFFF')
  })
  return (
    <group ref={ref}>
      <Cyl r={0.2} h={0.07} pos={[0, 0.035, 0]} color={C.navy} seg={28} />
      <Cyl r={0.15} h={0.02} pos={[0, 0.08, 0]} color={C.cobalt} seg={28} />
      <mesh position={[0.1, 0.1, 0]}>
        <sphereGeometry args={[0.025, 10, 8]} />
        <meshBasicMaterial ref={light} color={C.mint} />
      </mesh>
      <Box size={[0.04, 0.03, 0.26]} pos={[0.17, 0.03, 0]} color={C.lemon} />
    </group>
  )
}

/** Furniture, positioned relative to each room's centre. */
function Furniture({ id }: { id: string }) {
  switch (id) {
    case 'kitchen':
      return (
        <group>
          {/* back run: cabinets, counter, oven, hob, sink */}
          <Box size={[3.2, 0.9, 0.7]} pos={[0, 0.45, -1.1]} color={C.white} />
          {[-1.2, -0.4, 0.4].map((x) => <Box key={x} size={[0.02, 0.8, 0.02]} pos={[x, 0.45, -0.74]} color={C.grey} />)}
          {[-1.4, -1.0, -0.6, 0.2, 0.6].map((x) => <Box key={x} size={[0.18, 0.03, 0.03]} pos={[x, 0.78, -0.74]} color={C.navy} />)}
          <Box size={[3.2, 0.06, 0.74]} pos={[0, 0.93, -1.1]} color={C.navy} />
          <Box size={[0.62, 0.5, 0.02]} pos={[-0.4, 0.4, -0.74]} color="#2A2F45" />
          <Box size={[0.5, 0.06, 0.02]} pos={[-0.4, 0.72, -0.73]} color={C.grey} />
          {[[-0.55, -1.2], [-0.25, -1.2], [-0.55, -0.95], [-0.25, -0.95]].map(([x, z], i) => (
            <Cyl key={i} r={0.09} h={0.02} pos={[x, 0.97, z]} color={i === 1 ? C.coral : '#2A2F45'} />
          ))}
          <Box size={[0.5, 0.03, 0.36]} pos={[0.45, 0.955, -1.1]} color="#9FD8FF" />
          <Cyl r={0.025} h={0.3} pos={[0.45, 1.1, -1.32]} color={C.grey} seg={10} />
          <Box size={[0.03, 0.03, 0.18]} pos={[0.45, 1.24, -1.24]} color={C.grey} />
          {/* backsplash, uppers, hood */}
          <Box size={[2.4, 0.3, 0.02]} pos={[-0.4, 1.12, -1.46]} color="#BFD7FF" />
          {[-1.3, -0.9, 0.1, 0.5].map((x) => <Box key={x} size={[0.38, 0.42, 0.3]} pos={[x, 1.5, -1.3]} color={C.white} />)}
          {[-1.3, -0.9, 0.1, 0.5].map((x) => <Box key={`k${x}`} size={[0.03, 0.12, 0.02]} pos={[x + 0.14, 1.4, -1.14]} color={C.navy} />)}
          <Box size={[0.5, 0.3, 0.36]} pos={[-0.4, 1.42, -1.27]} color={C.grey} />
          <Box size={[0.2, 0.2, 0.2]} pos={[-0.4, 1.66, -1.36]} color={C.grey} />
          {/* fridge with handles */}
          <Box size={[0.8, 1.9, 0.7]} pos={[1.3, 0.95, -1.1]} color={C.grey} />
          <Box size={[0.8, 0.02, 0.02]} pos={[1.3, 1.25, -0.74]} color="#AEB4D4" />
          <Box size={[0.03, 0.4, 0.04]} pos={[0.98, 1.55, -0.73]} color={C.navy} />
          <Box size={[0.03, 0.5, 0.04]} pos={[0.98, 0.85, -0.73]} color={C.navy} />
          <Box size={[0.14, 0.12, 0.01]} pos={[1.4, 1.5, -0.745]} color={C.lemon} />
          {/* counter props */}
          <Cyl r={0.09} h={0.18} pos={[-1.15, 1.05, -1.15]} color={C.coral} />
          <Box size={[0.04, 0.08, 0.04]} pos={[-1.05, 1.08, -1.15]} color={C.coral} />
          <Box size={[0.32, 0.03, 0.22]} pos={[0.95, 0.975, -1.12]} color={C.wood} />
          <Plant pos={[-1.45, 0.96, -1.2]} s={0.6} />
          {/* island with stools, bowl and pendants */}
          <Box size={[1.5, 0.9, 0.8]} pos={[-0.2, 0.45, 0.4]} color={C.lemon} />
          <Box size={[1.6, 0.06, 0.9]} pos={[-0.2, 0.93, 0.4]} color={C.white} />
          {[-0.7, 0.3].map((x) => (
            <group key={x}>
              <Cyl r={0.04} h={0.6} pos={[x, 0.3, 1.05]} color={C.navy} seg={10} />
              <Cyl r={0.18} h={0.06} pos={[x, 0.62, 1.05]} color={C.coral} />
              <mesh position={[x, 0.2, 1.05]} rotation-x={Math.PI / 2}>
                <torusGeometry args={[0.12, 0.015, 6, 20]} />
                <meshStandardMaterial color={C.navy} />
              </mesh>
            </group>
          ))}
          <Sph r={0.16} pos={[-0.35, 1.0, 0.4]} color={C.white} scale={[1, 0.45, 1]} />
          <Sph r={0.06} pos={[-0.4, 1.06, 0.38]} color={C.coral} />
          <Sph r={0.06} pos={[-0.29, 1.06, 0.43]} color={C.lemon} />
          <Sph r={0.055} pos={[-0.34, 1.09, 0.34]} color="#7BD36A" />
          <Box size={[0.36, 0.05, 0.26]} pos={[0.2, 0.985, 0.4]} color={C.cobalt} />
          {[-0.6, 0.2].map((x) => (
            <group key={`p${x}`}>
              <Box size={[0.015, 0.36, 0.015]} pos={[x, 1.68, 0.4]} color={C.navy} />
              <Cone r={0.15} h={0.16} pos={[x, 1.44, 0.4]} color={C.lemon} top={0.04} />
            </group>
          ))}
        </group>
      )
    case 'living':
      return (
        <group>
          {/* rug with stripes */}
          <Box size={[2.6, 0.02, 1.8]} pos={[0, 0.02, 0.1]} color={C.mint} />
          {[-0.5, 0.7].map((z) => <Box key={z} size={[2.6, 0.022, 0.1]} pos={[0, 0.022, z]} color={C.white} />)}
          {/* sofa with cushions and pillows */}
          <Box size={[2.4, 0.45, 0.8]} pos={[0, 0.25, -0.9]} color={C.coral} />
          <Box size={[2.4, 0.5, 0.25]} pos={[0, 0.7, -1.2]} color={C.coral} />
          {[-1.25, 1.25].map((x) => <Box key={x} size={[0.18, 0.62, 0.8]} pos={[x, 0.33, -0.9]} color="#F06A4A" />)}
          {[-0.75, 0, 0.75].map((x) => <Box key={`c${x}`} size={[0.72, 0.1, 0.6]} pos={[x, 0.52, -0.82]} color="#FF9479" />)}
          <Box size={[0.42, 0.36, 0.12]} pos={[-0.8, 0.72, -1.0]} color={C.lemon} rot={0.2} />
          <Box size={[0.42, 0.36, 0.12]} pos={[0.85, 0.72, -1.0]} color={C.cobalt} rot={-0.15} />
          <Box size={[0.6, 0.04, 0.5]} pos={[0.2, 0.59, -0.75]} color={C.white} rot={0.3} />
          {/* coffee table and props */}
          <Box size={[0.9, 0.06, 0.6]} pos={[0, 0.33, 0.2]} color={C.wood} />
          {[[-0.38, 0.2 - 0.24], [0.38, -0.04], [-0.38, 0.44], [0.38, 0.44]].map(([x, z], i) => (
            <Box key={i} size={[0.05, 0.3, 0.05]} pos={[x, 0.15, z]} color="#C8955A" />
          ))}
          <Cyl r={0.05} h={0.1} pos={[-0.2, 0.41, 0.15]} color={C.white} />
          <Box size={[0.26, 0.05, 0.18]} pos={[0.15, 0.385, 0.25]} color={C.cobalt} />
          <Box size={[0.22, 0.04, 0.16]} pos={[0.15, 0.43, 0.25]} color={C.lemon} />
          {/* tv on stand */}
          <Box size={[1.4, 0.5, 0.3]} pos={[0, 0.25, 1.15]} color={C.navy} />
          <Box size={[1.2, 0.7, 0.05]} pos={[0, 0.9, 1.2]} color="#141A3D" />
          <Box size={[0.2, 0.06, 0.14]} pos={[0, 0.53, 1.18]} color="#141A3D" />
          {/* floor lamp */}
          <Cyl r={0.14} h={0.03} pos={[-1.75, 0.02, -0.95]} color={C.navy} />
          <Cyl r={0.02} h={1.25} pos={[-1.75, 0.65, -0.95]} color={C.navy} seg={10} />
          <Cone r={0.2} h={0.24} pos={[-1.75, 1.34, -0.95]} color={C.lemon} top={0.12} />
          {/* bookshelf on the back wall */}
          <group position={[-1.3, 0, -1.35]}>
            <Box size={[0.7, 1.3, 0.24]} pos={[0, 0.65, 0]} color={C.white} />
            {[0.35, 0.75, 1.15].map((y) => <Box key={y} size={[0.64, 0.03, 0.22]} pos={[0, y - 0.15, 0.02]} color={C.grey} />)}
            {[[-0.2, 0.31, C.coral], [-0.12, 0.33, C.cobalt], [-0.04, 0.3, C.lemon], [0.12, 0.72, C.navy], [0.2, 0.7, C.mint], [-0.18, 1.1, C.coral], [-0.1, 1.12, C.wood]].map(([x, y, c], i) => (
              <Box key={i} size={[0.07, 0.24, 0.17]} pos={[x as number, (y as number) - 0.02, 0.02]} color={c as string} />
            ))}
            <Sph r={0.08} pos={[0.15, 0.32, 0.02]} color={C.mint} />
          </group>
          {/* frames above the sofa */}
          <Box size={[0.5, 0.36, 0.03]} pos={[-0.4, 1.18, -1.46]} color={C.navy} />
          <Box size={[0.42, 0.28, 0.03]} pos={[-0.4, 1.18, -1.445]} color={C.lemon} />
          <Box size={[0.36, 0.46, 0.03]} pos={[0.35, 1.2, -1.46]} color={C.navy} />
          <Box size={[0.28, 0.38, 0.03]} pos={[0.35, 1.2, -1.445]} color={C.mint} />
          <Plant pos={[1.7, 0, -1]} s={1.2} />
          <RobotVac />
        </group>
      )
    case 'bedroom-1':
    case 'bedroom-2': {
      const blanket = id === 'bedroom-1' ? C.cobalt : C.coral
      return (
        <group rotation-y={id === 'bedroom-2' ? Math.PI : 0}>
          {/* bed */}
          <Box size={[1.5, 0.45, 2]} pos={[-0.3, 0.23, 0.2]} color={C.white} />
          <Box size={[1.5, 0.08, 1.3]} pos={[-0.3, 0.49, 0.55]} color={blanket} />
          <Box size={[1.52, 0.09, 0.2]} pos={[-0.3, 0.5, -0.02]} color={C.white} />
          <Box size={[1.5, 0.06, 0.12]} pos={[-0.3, 0.535, 0.9]} color={C.lemon} />
          <Box size={[0.55, 0.16, 0.36]} pos={[-0.62, 0.55, -0.55]} color={C.white} />
          <Box size={[0.55, 0.16, 0.36]} pos={[0.02, 0.55, -0.55]} color={id === 'bedroom-1' ? C.lemon : C.mint} />
          <Box size={[1.5, 0.9, 0.12]} pos={[-0.3, 0.45, -0.85]} color={C.wood} />
          {[-0.75, -0.3, 0.15].map((x) => <Box key={x} size={[0.02, 0.6, 0.02]} pos={[x, 0.55, -0.78]} color="#C8955A" />)}
          {/* nightstand + lamp + book */}
          <Box size={[0.45, 0.5, 0.45]} pos={[0.8, 0.25, -0.6]} color={C.wood} />
          <Box size={[0.3, 0.03, 0.02]} pos={[0.8, 0.32, -0.37]} color={C.navy} />
          <Cyl r={0.06} h={0.18} pos={[0.85, 0.59, -0.65]} color={C.navy} />
          <Cone r={0.13} h={0.16} pos={[0.85, 0.76, -0.65]} color={C.lemon} top={0.08} />
          <Box size={[0.16, 0.04, 0.12]} pos={[0.68, 0.52, -0.5]} color={C.coral} />
          {/* rug, slippers, wardrobe, plant */}
          <Box size={[0.7, 0.02, 1.2]} pos={[0.75, 0.01, 0.4]} color={id === 'bedroom-1' ? C.mint : C.lemon} />
          <Box size={[0.1, 0.05, 0.22]} pos={[0.6, 0.04, 0.2]} color={C.coral} />
          <Box size={[0.1, 0.05, 0.22]} pos={[0.74, 0.04, 0.22]} color={C.coral} />
          <Plant pos={[0.9, 0, 1.1]} s={0.8} />
        </group>
      )
    }
    case 'bathroom':
      return (
        <group>
          {/* tub with water, tap and a rubber duck */}
          <Box size={[1.4, 0.55, 0.75]} pos={[0, 0.28, -1]} color={C.white} />
          <Box size={[1.2, 0.05, 0.55]} pos={[0, 0.56, -1]} color="#9FD8FF" />
          <Cyl r={0.025} h={0.3} pos={[0.6, 0.7, -1.3]} color={C.grey} seg={10} />
          <Box size={[0.03, 0.03, 0.14]} pos={[0.6, 0.84, -1.24]} color={C.grey} />
          <group position={[-0.25, 0.62, -0.95]}>
            <Sph r={0.08} pos={[0, 0, 0]} color={C.lemon} scale={[1.2, 0.8, 1]} />
            <Sph r={0.05} pos={[0.06, 0.08, 0]} color={C.lemon} />
            <Box size={[0.05, 0.02, 0.03]} pos={[0.12, 0.08, 0]} color={C.coral} />
          </group>
          {[[0.1, 0.62, -0.9], [0.18, 0.64, -1.05], [0.04, 0.63, -1.12]].map((p, i) => <Sph key={i} r={0.04} pos={p as [number, number, number]} color={C.white} />)}
          <Box size={[1.42, 0.02, 0.02]} pos={[0, 1.35, -0.62]} color={C.grey} />
          <Box size={[0.5, 0.75, 0.02]} pos={[-0.45, 0.98, -0.62]} color={C.mint} />
          {/* toilet with tank */}
          <Cyl r={0.22} h={0.42} pos={[-0.35, 0.21, 0.9]} color={C.white} />
          <Cyl r={0.2} h={0.04} pos={[-0.35, 0.44, 0.9]} color={C.grey} />
          <Box size={[0.42, 0.36, 0.18]} pos={[-0.35, 0.55, 1.2]} color={C.white} />
          {/* vanity with basin, tap and mirror cabinet */}
          <Box size={[0.6, 0.7, 0.4]} pos={[0.45, 0.35, 0.95]} color={C.navy} />
          <Box size={[0.62, 0.04, 0.42]} pos={[0.45, 0.72, 0.95]} color={C.white} />
          <Sph r={0.14} pos={[0.45, 0.74, 0.93]} color="#E4E8F8" scale={[1, 0.3, 1]} />
          <Cyl r={0.02} h={0.16} pos={[0.45, 0.82, 1.1]} color={C.grey} seg={10} />
          <Box size={[0.02, 0.3, 0.02]} pos={[0.2, 0.45, 0.74]} color={C.lemon} />
          {/* bath mat and towel */}
          <Box size={[0.6, 0.02, 0.36]} pos={[0, 0.01, -0.35]} color={C.coral} />
          <Box size={[0.3, 0.4, 0.04]} pos={[0.82, 0.55, 0.3]} color={C.lemon} />
        </group>
      )
    case 'laundry':
      return (
        <group>
          {[[-0.9, C.cobalt], [0.2, C.coral]].map(([z, c]) => (
            <group key={z as number}>
              <Box size={[0.8, 0.85, 0.75]} pos={[0, 0.43, z as number]} color={C.white} />
              <Box size={[0.8, 0.12, 0.02]} pos={[0, 0.79, (z as number) + 0.38]} color={C.grey} />
              <Cyl r={0.04} h={0.03} pos={[0.25, 0.79, (z as number) + 0.39]} color={C.navy} />
              <mesh position={[0, 0.42, (z as number) + 0.39]} rotation-x={Math.PI / 2}>
                <torusGeometry args={[0.24, 0.035, 8, 28]} />
                <meshStandardMaterial color={C.grey} />
              </mesh>
              <mesh position={[0, 0.42, (z as number) + 0.385]} rotation-x={Math.PI / 2}>
                <cylinderGeometry args={[0.22, 0.22, 0.02, 28]} />
                <meshStandardMaterial color={c as string} transparent opacity={0.85} />
              </mesh>
            </group>
          ))}
          {/* detergent on top, basket with clothes */}
          <Box size={[0.2, 0.28, 0.14]} pos={[-0.15, 1.0, -0.95]} color={C.mint} />
          <Box size={[0.08, 0.06, 0.08]} pos={[-0.15, 1.17, -0.95]} color={C.navy} />
          <Cyl r={0.07} h={0.22} pos={[0.15, 0.97, -0.85]} color={C.lemon} />
          <Cyl r={0.22} h={0.32} pos={[0, 0.16, 1.05]} color={C.wood} />
          <Sph r={0.11} pos={[-0.06, 0.34, 1.0]} color={C.coral} />
          <Sph r={0.1} pos={[0.08, 0.36, 1.1]} color={C.cobalt} />
          <Sph r={0.09} pos={[0.02, 0.42, 0.98]} color={C.white} />
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
      <Box size={[1.7, 0.06, 0.06]} pos={[1.8, 1.37, -2.97]} color={C.navy} />
      <Box size={[1.7, 0.06, 0.1]} pos={[1.8, 0.53, -2.95]} color={C.navy} />
      <Box size={[0.05, 0.8, 0.05]} pos={[1.8, 0.95, -2.97]} color={C.navy} />
      <Box size={[1.6, 0.04, 0.05]} pos={[1.8, 0.95, -2.97]} color={C.navy} />
      <Box size={[0.32, 1.0, 0.06]} pos={[0.82, 0.92, -2.94]} color={C.coral} />
      <Box size={[0.32, 1.0, 0.06]} pos={[2.78, 0.92, -2.94]} color={C.coral} />
      <Box size={[2.3, 0.03, 0.03]} pos={[1.8, 1.44, -2.94]} color={C.navy} />
      {/* kitchen wall clock */}
      <mesh position={[-3.98, 1.1, -1.0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.2, 0.2, 0.04, 28]} />
        <meshStandardMaterial color={C.white} />
      </mesh>
      <mesh position={[-3.96, 1.1, -1.0]} rotation-z={Math.PI / 2}>
        <torusGeometry args={[0.2, 0.025, 6, 28]} />
        <meshStandardMaterial color={C.coral} />
      </mesh>
      <Box size={[0.02, 0.13, 0.02]} pos={[-3.95, 1.15, -1.0]} color={C.navy} />
      <Box size={[0.02, 0.02, 0.1]} pos={[-3.95, 1.1, -0.96]} color={C.navy} />
      {/* bedroom window on the side wall */}
      <Box size={[0.04, 0.7, 1.3]} pos={[-3.98, 0.95, 1.5]} color="#BFD7FF" />
      <Box size={[0.06, 0.06, 1.4]} pos={[-3.97, 1.33, 1.5]} color={C.navy} />
      <Box size={[0.1, 0.06, 1.4]} pos={[-3.95, 0.57, 1.5]} color={C.navy} />
      <Box size={[0.05, 0.7, 0.05]} pos={[-3.97, 0.95, 1.5]} color={C.navy} />
      <Box size={[0.06, 0.9, 0.3]} pos={[-3.94, 0.9, 0.7]} color={C.lemon} />
      <Box size={[0.06, 0.9, 0.3]} pos={[-3.94, 0.9, 2.3]} color={C.lemon} />
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
