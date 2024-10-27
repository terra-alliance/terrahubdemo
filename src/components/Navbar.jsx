import { Suspense } from "react"
import { useObservable } from "@legendapp/state/react"
import { animated, useSpringValue } from "@react-spring/three"
import { useWindowSize } from "@uidotdev/usehooks"

import { Text } from "./Text"
import { Button } from "./Button"

export default function Navbar({ state, children }) {
  return (
    <>
      <Bar position={calculatePosition(state.origin.get(), state.translation.get(), useWindowSize())} state={state} children={children} />
      <Pages state={state} children={children} />
    </>
  )
}

function Pages({ state, children }) {
  const size = useWindowSize()
  const selected = state.selected.get()
  const horizontal = state.direction.get() === "horizontal"

  const spring = useSpringValue(selected, { onRest: () => state.animating.set(false) })
  spring.start(selected)

  return (
    <>
      {children.map((child, i) => (
        <animated.group
          key={i}
          position={spring.to((value) =>
            horizontal ? [i * size.width - value * (horizontal ? size.width : size.height), 0, 0] : [0, i * -size.height + value * (horizontal ? size.width : size.height), 0]
          )}
        >
          {child}
        </animated.group>
      ))}
    </>
  )
}

function Bar({ position, state, children }) {
  const width = state.width.get()
  const radius = state.radius.get()
  const direction = state.direction.get()

  return (
    <group position={position}>
      <Selected state={state} children={children} />
      <Buttons state={state} children={children} />
      {direction === "horizontal" ? (
        <Button width={width - radius * 2} radius={radius} color={"hsl(0, 0%, 16%)"} />
      ) : (
        <Button width={width} height={radius * 3 * children.length - radius * 3} radius={radius} color={"hsl(0, 0%, 16%)"} />
      )}
    </group>
  )
}

function Selected({ state, children }) {
  const width = state.width.get()
  const radius = state.radius.get()
  const direction = state.direction.get()
  const selected = state.selected.get()
  const spring = useSpringValue(selected)
  spring.start(selected)

  const color = ["hsl(45, 100%, 30%)", "hsl(180, 100%, 30%)", "hsl(300, 100%, 30%)", "hsl(200, 100%, 30%)"][selected]
  const height = radius * 3 * children.length

  return (
    <>
      {direction === "horizontal" ? (
        <animated.group position={spring.to((value) => [(width / children.length) * value - width / 2 + width / children.length / 2, 0, radius * 4])}>
          <Button width={width / children.length - radius * 2} radius={radius} color={color} />
        </animated.group>
      ) : (
        <animated.group position={spring.to((value) => [0, -(height / children.length) * value + height / 2 - height / children.length / 2, radius * 4])}>
          <Button width={width} radius={radius} color={state.color.get()} />
        </animated.group>
      )}
    </>
  )
}

function Buttons({ state, children }) {
  const names = state.names.get()
  const width = state.width.get()
  const radius = state.radius.get()
  const horizontal = state.direction.get() === "horizontal"
  const height = radius * 3 * children.length

  return (
    <>
      {children.map((_, i) => (
        <group
          key={i}
          position-x={horizontal ? (width / children.length) * i - width / 2 + width / children.length / 2 : 0}
          position-y={horizontal ? 0 : -(height / children.length) * i + height / 2 - height / children.length / 2}
        >
          <TransparentButton key={i} state={state} index={i} children={children} width={width} radius={radius} horizontal={horizontal} />
          <Text text={names[i]} position-z={radius * 5} fontSize={25} />
        </group>
      ))}
    </>
  )
}

function TransparentButton({ state, index, children, width, radius, horizontal }) {
  const hovered = useObservable(false)

  return (
    <Suspense>
      <mesh
        onPointerOver={() => hovered.set(true)}
        onPointerOut={() => hovered.set(false)}
        onClick={() => (state.animating.set(true), state.selected.set(index))}
        rotation-z={90 * (Math.PI / 180)}
        position-z={radius}
      >
        <capsuleGeometry args={[radius, horizontal ? width / children.length - radius * 2 : width]} />
        <meshStandardMaterial
          transparent={true}
          opacity={hovered.get() ? 0.25 : 0}
          metalness={1}
          roughness={1}
          color={horizontal ? ["hsl(45, 100%, 20%)", "hsl(180, 100%, 20%)", "hsl(300, 100%, 20%)", "hsl(200, 100%, 20%)"][index] : "hsl(44, 100%, 20%)"}
        />
      </mesh>
    </Suspense>
  )
}

function calculatePosition(origin, translation, size) {
  const [x, y, z] = translation
  switch (origin) {
    case "top":
      return [x, size.height / 2 + y, z]
    case "bottom":
      return [x, -(size.height / 2) + y, z]
    case "left":
      return [-(size.width / 2) + x, y, z]
    case "right":
      return [size.width / 2 + x, y, z]
    default:
      return [x, y, z]
  }
}
