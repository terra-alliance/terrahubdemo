import { useRef, Suspense } from "react"
import { useObservable } from "@legendapp/state/react"
import { MeshStandardMaterial, Shape, Path, SphereGeometry } from "three"
import { useFrame } from "@react-three/fiber"
import { Text, useGLTF, Extrude } from "@react-three/drei"
import { useSpringValue, animated } from "@react-spring/three"

// MoonRabbit

export function MoonRabbit({ position, scale }) {
  const { nodes } = useGLTF("/rabbit.gltf")

  const group = useRef()
  useFrame((state, delta) => (group.current.rotation.y += delta * 0.4))

  return (
    <Suspense>
      <group ref={group} position={position} scale={scale}>
        <mesh position={[0, -0.5, 0]} geometry={nodes.mesh_0.geometry}>
          <meshStandardMaterial roughness={0.5} metalness={1} color={"grey"} />
        </mesh>
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial transparent={true} roughness={0.5} metalness={1} opacity={0.3} color={"purple"} />
        </mesh>
      </group>
    </Suspense>
  )
}

// Orion

const geometry = new SphereGeometry(1, 32, 32)
const material = new MeshStandardMaterial({ roughness: 0.2, metalness: 1, color: 0x08c176 })

export function Orion({ position, scale, onClick }) {
  const hovered = useObservable(false)
  console.log(hovered.get())

  const group = useRef()
  useFrame((state, delta) => (group.current.rotation.z += delta * 0.5))

  const explode = useSpringValue(0.75, { config: { tension: 500, clamp: true } })
  const _onClick = () => {
    explode
      .start(1.8)
      .then(() => explode.start(0.75))
      .then(() => onClick())
  }

  return (
    <Suspense>
      <group position={position} scale={scale}>
        <group ref={group}>
          <animated.mesh geometry={geometry} material={material} position={explode.to((v) => [v, 0, 0])} scale={0.15} />
          <animated.mesh geometry={geometry} material={material} position={explode.to((v) => [-v, 0, 0])} scale={0.15} />
        </group>
        <mesh geometry={geometry} material={material} position={[0, 0, 0]} scale={0.5} />
        <mesh
          geometry={geometry}
          onPointerOver={() => (hovered.set(true), explode.start(1.25))}
          onPointerOut={() => (hovered.set(false), explode.start(0.75))}
          onClick={() => _onClick}
        >
          <meshStandardMaterial transparent={true} roughness={1} metalness={1} opacity={hovered.get() ? 0 : 0.3} color={0x0b9898} />
        </mesh>
      </group>
    </Suspense>
  )
}

// Lunc Academy

const arcShape = new Shape()
arcShape.moveTo(0.2, 0.75)
arcShape.bezierCurveTo(1, 0.6, 1, -0.6, 0.2, -0.75)
arcShape.bezierCurveTo(0.2, -0.75, 0.2, -0.65, 0.2, -0.65)
arcShape.bezierCurveTo(0.85, -0.5, 0.85, 0.5, 0.2, 0.65)

const circle = new Shape()
circle.absarc(0, 0, 0.3, 0, Math.PI * 2, 0, false)
const hole = new Path()
hole.absarc(0, 0, 0.2, 0, Math.PI * 2, true)
circle.holes.push(hole)

const whitemetal = new MeshStandardMaterial({ roughness: 0.5, metalness: 1, color: "white" })

export function LuncAcademy({ position, scale }) {
  const mesh = useRef()
  useFrame((state, delta) => {
    mesh.current.rotation.z += delta * 0.5
  })

  return (
    <Suspense>
      <group position={position}>
        <group scale={scale}>
          <group ref={mesh}>
            <Extrude
              position={[0, 0, -0.05]}
              rotation-z={65 * (Math.PI / 180)}
              args={[arcShape, { curveSegments: 48, steps: 1, depth: 0.1, bevelEnabled: false }]}
              material={whitemetal}
            />
            <Extrude
              position={[0, 0, 0.05]}
              rotation-z={-65 * (Math.PI / 180)}
              rotation={[0, Math.PI, 0]}
              args={[arcShape, { curveSegments: 48, steps: 1, depth: 0.1, bevelEnabled: false }]}
              material={whitemetal}
            />
            <Extrude position={[-0.49, 0, -0.05]} args={[circle, { amount: 2, curveSegments: 48, steps: 2, depth: 0.1, bevelEnabled: false }]} material={whitemetal} />
            <Extrude position={[0.49, 0, -0.05]} args={[circle, { amount: 2, curveSegments: 48, steps: 2, depth: 0.1, bevelEnabled: false }]} material={whitemetal} />
          </group>
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial transparent={true} roughness={0.4} metalness={1} opacity={0.5} color={0xfcba03} />
          </mesh>
        </group>
        <Text position={[0, -175, 0]} color="white" fontSize={40} textAlign="center" font="./FuturaLightEmoji.ttf">
          Lunc Academy
        </Text>
      </group>
    </Suspense>
  )
}

// Terrarium

const leaf = new Shape()
leaf.moveTo(0, 0.75)
leaf.bezierCurveTo(1, 0.4, 1, -0.4, 0, -0.75)
leaf.bezierCurveTo(-1, -0.4, -1, 0.4, 0, 0.75)

export function Terrarium({ position, scale }) {
  const plant = useRef()
  useFrame((state, delta) => {
    plant.current.rotation.y += delta * 0.5
  })

  return (
    <Suspense>
      <group position={position}>
        <mesh scale={scale} rotation-x={180 * (Math.PI / 180)}>
          <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
          <meshStandardMaterial color={"saddlebrown"} roughness={0.5} metalness={1} />
        </mesh>
        <mesh scale={scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={"white"} transparent={true} opacity={0.2} />
        </mesh>
        <Text position={[0, -175, 0]} color="white" fontSize={40} textAlign="center" font="./FuturaLightEmoji.ttf">
          Terrarium
        </Text>
        <group ref={plant}>
          <mesh rotation-z={180 * (Math.PI / 180)}>
            <cylinderGeometry args={[4, 4, 85, 32]} />
            <meshStandardMaterial color={"green"} roughness={0.5} metalness={0.5} />
          </mesh>
          <Extrude
            position={[-30, 55, 10]}
            rotation={[45 * (Math.PI / 180), 0, 45 * (Math.PI / 180)]}
            scale={50}
            args={[leaf, { curveSegments: 48, steps: 1, depth: 0.1, bevelEnabled: false }]}
          >
            <meshStandardMaterial color={"green"} roughness={0.5} metalness={0.5} />
          </Extrude>
          <Extrude
            position={[30, 25, -20]}
            rotation={[45 * (Math.PI / 180), 0, -135 * (Math.PI / 180)]}
            scale={50}
            args={[leaf, { curveSegments: 48, steps: 1, depth: 0.1, bevelEnabled: false }]}
          >
            <meshStandardMaterial color={"green"} roughness={0.5} metalness={0.5} />
          </Extrude>
        </group>
      </group>
    </Suspense>
  )
}
