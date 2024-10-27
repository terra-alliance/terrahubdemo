import { useRef, Suspense } from "react"
import { useFrame } from "@react-three/fiber"
import { useSpringValue, animated } from "@react-spring/three"

import { SphereGeometry, MeshStandardMaterial } from "three"
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js"

const sphere = new SphereGeometry(1, 32, 32)
const halfsphere = new SphereGeometry(1, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2)
const roundedbox = new RoundedBoxGeometry(14, 20, 2, 2, 1)

const white = new MeshStandardMaterial({ roughness: 0.2, metalness: 1, side: 2 })
const blue = new MeshStandardMaterial({ roughness: 0.2, metalness: 1, color: 0x5494f8 })

export default function Satellite({ position, scale, onClick, hovered }) {
  const satellite = useRef()
  useFrame((state, delta) => (satellite.current.rotation.y -= delta * 0.6))

  const explode = useSpringValue(14, { config: { mass: 1, friction: 10, tension: 400, clamp: true } })
  hovered ? explode.start(20) : explode.start(14)

  const _onClick = () => {
    explode
      .start(2)
      .then(() => explode.start(0.5))
      .then(() => onClick())
  }

  return (
    <Suspense>
      <group position={position} rotation={[0, Math.PI / -5, Math.PI / 2.5]} scale={scale}>
        <group ref={satellite}>
          <mesh geometry={roundedbox} material={white} />
          <animated.mesh geometry={roundedbox} material={blue} position={explode.to((v) => [v, 0, 0])} scale={[0.85, 0.4, 0.5]} />
          <animated.mesh geometry={roundedbox} material={blue} position={explode.to((v) => [-v, 0, 0])} scale={[0.85, 0.4, 0.5]} />
          <animated.mesh geometry={halfsphere} material={white} position={explode.to((v) => [0, -v - 2, 0])} scale={[6, 6, 6]} />
        </group>
      </group>
      {onClick && (
        <mesh position={position} geometry={sphere} scale={scale * 22.5} onClick={_onClick}>
          <meshStandardMaterial color={"black"} transparent={true} opacity={hovered ? 0 : 0.3} />
        </mesh>
      )}
    </Suspense>
  )
}
