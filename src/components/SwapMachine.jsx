import { useObservable } from "@legendapp/state/react"
import { animated, useSpringValue } from "@react-spring/three"
import useSound from "use-sound"

import { Lunc, Terra } from "../components/Coins"
import { Button } from "./Button"
import { Text } from "./Text"
import sound_1 from "/sounds/sound_11.mp3"
import sound_2 from "/sounds/sound_13.mp3"

export default function SwapMachine() {
  const swapped = useObservable(false)
  const rotation = useSpringValue(0, { config: { mass: 1, friction: 15, tension: 150 } })
  const tornado = useSpringValue(0, { config: { mass: 1, friction: 15, tension: 50 } })

  const [play_1] = useSound(sound_1)
  const [play_2] = useSound(sound_2, { volume: 0.5 })

  return (
    <>
      <animated.group rotation={rotation.to((v) => [0, v, 0])}>
        <animated.group rotation={tornado.to((v) => [0, v, 0])}>
          <Lunc position={[-200, 0, 0]} scale={130} />
          <animated.group position={[200, 0, 0]} rotation={rotation.to((v) => [0, v, 0])}>
            <Terra scale={130} />
          </animated.group>
          <Revert
            onClick={() => {
              if (swapped.get()) swapped.set(false), rotation.start(0), play_2()
              else swapped.set(true), rotation.start(Math.PI), play_2()
            }}
          />
        </animated.group>
      </animated.group>
      <Text position={[0, -200, 20]} text={"Swap"} fontSize={25} />
      <Button position={[0, -200, 0]} radius={20} width={100} color={"hsl(45, 100%, 30%)"} onClick={() => (tornado.start(Math.PI * 10), tornado.reset(), play_1())} />
    </>
  )
}

function Revert({ position, rotation, onClick }) {
  const hovered = useObservable(false)

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]} onPointerOver={() => hovered.set(true)} onPointerOut={() => hovered.set(false)} onClick={onClick}>
        <capsuleGeometry args={[15, 70]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} transparent={true} opacity={hovered.get() ? 0.15 : 0.25} />
      </mesh>
      <mesh position={[0, 5, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
        <capsuleGeometry args={[1, 60]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
      <mesh position={[0, -5, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
        <capsuleGeometry args={[1, 60]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
      <mesh position={[-30, 5, 0]} rotation={[0, 0, 90 * (Math.PI / 180)]}>
        <coneGeometry args={[6, 30]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
      <mesh position={[30, -5, 0]} rotation={[0, 0, 270 * (Math.PI / 180)]}>
        <coneGeometry args={[6, 30]} />
        <meshStandardMaterial color={0xfcba03} roughness={0.15} metalness={1} />
      </mesh>
    </group>
  )
}
