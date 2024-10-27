import { Suspense } from "react"
import { useWindowSize } from "@uidotdev/usehooks"

export default function MarketPools() {
  const size = useWindowSize()

  return (
    <Suspense>
      <group scale={Math.min(size.width / 6, 130)}>
        <Stablecoin />
        <Collateral />
        <Bridge />
      </group>
    </Suspense>
  )
}

function Bridge() {
  return (
    <>
      <mesh position={[0, 0, 0]} rotation-z={90 * (Math.PI / 180)}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color={"white"} transparent={true} opacity={0.3} />
      </mesh>
      <mesh position={[0.25, 0, 0]} rotation-z={90 * (Math.PI / 180)}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 32, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} transparent={true} opacity={1} />
      </mesh>
      <mesh position={[-0.25, 0, 0]} rotation-z={90 * (Math.PI / 180)}>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 32, 1, false, Math.PI, Math.PI]} />
        <meshStandardMaterial color={"blue"} roughness={0.3} metalness={1} transparent={true} opacity={1} />
      </mesh>
    </>
  )
}

function Collateral() {
  return (
    <group position={[1.5, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial color={"darkorange"} transparent={true} opacity={0.5} />
      </mesh>
      <mesh rotation-x={180 * (Math.PI / 180)}>
        <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} transparent={true} opacity={1} />
      </mesh>
    </group>
  )
}

function Stablecoin() {
  return (
    <group position={[-1.5, 0, 0]}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color={"blue"} transparent={true} opacity={0.2} />
      </mesh>
      <mesh rotation-x={180 * (Math.PI / 180)}>
        <sphereGeometry args={[1, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color={"blue"} roughness={0.3} metalness={1} transparent={true} opacity={1} />
      </mesh>
    </group>
  )
}
