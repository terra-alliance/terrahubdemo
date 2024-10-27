import { Suspense, useRef } from "react"
import { useObservable, Show } from "@legendapp/state/react"
import { RoundedBox } from "@react-three/drei"

import { Text } from "./Text"

export function Button({ position, width = 0, height = 0, radius, color, hoveredColor, onClick, hovered, toggle, text, textProps, ...props }) {
  const localHovered = useObservable(false)

  return (
    <Suspense>
      <group position={position}>
        <Show if={text}>
          <Text position={[0, 0, radius]} text={text} {...textProps} />
        </Show>
        <group
          onPointerOver={() => (hovered ? (hovered.set(true), localHovered.set(true)) : localHovered.set(true))}
          onPointerOut={() => (hovered ? (hovered.set(false), localHovered.set(false)) : localHovered.set(false))}
          onClick={onClick}
          {...props}
        >
          <Meshes position={position} width={width} height={height} radius={radius} color={localHovered.get() ? hoveredColor : color} />
        </group>
      </group>
    </Suspense>
  )
}

export function RadioButton({ position, width = 0, height = 0, radius, color, hoveredColor, onClick, active, text, textProps, ...props }) {
  const hovered = useObservable(false)
  const isHovered = hovered.get()

  return (
    <Suspense>
      <group position={position}>
        <Show if={text}>
          <Text position={[0, 0, radius]} text={text} {...textProps} />
        </Show>
        <group onPointerOver={() => hovered.set(true)} onPointerOut={() => hovered.set(false)} onClick={onClick} {...props}>
          <Meshes width={width} height={height} radius={radius} color={isHovered || active ? hoveredColor : color} />
        </group>
      </group>
    </Suspense>
  )
}

function Meshes({ width, height, radius, color }) {
  const group = useRef()

  return (
    <group ref={group}>
      <Show if={width && !height}>
        <mesh rotation-z={Math.PI / 2}>
          <capsuleGeometry args={[radius, width]} />
          <meshStandardMaterial transparent={true} metalness={1} roughness={1} color={color} />
        </mesh>
      </Show>
      <Show if={height && !width}>
        <>
          <mesh rotation-z={-Math.PI / 2}>
            <capsuleGeometry args={[radius, width]} />
            <meshStandardMaterial transparent={true} metalness={1} roughness={1} color={color} />
          </mesh>
        </>
      </Show>
      <Show if={height && width}>
        <RoundedBox args={[width + radius * 2, height + radius * 2, radius * 2]} radius={radius}>
          <meshPhysicalMaterial color={color} roughness={1} metalness={1} />
        </RoundedBox>
      </Show>
    </group>
  )
}
