import { useState, Suspense } from "react"
import { Text, Plane } from "@react-three/drei"
import { useGesture } from "@use-gesture/react"
import { SphereGeometry, MeshPhongMaterial } from "three"

const sphereGeometry = new SphereGeometry()
const trackMaterial = new MeshPhongMaterial({
  color: "blue",
  transparent: true,
  opacity: 0.3,
  shininess: 1,
})

function remap(v, x1, y1, x2, y2) {
  return ((v - x1) * (y2 - x2)) / (y1 - x1) + x2
}

function stepRound(num, step) {
  return Math.round(num / step) * step
}

export default function Slider({ position = [0, 0, 0], scale = [1, 1, 1], handleChange = null, text, min = 0, max = 100, step = 1, fontSize = 30 }) {
  const [value, setValue] = useState(0)
  const [active, setActive] = useState(false)
  const bind = useGesture(
    {
      onDrag: ({ event, offset: [x] }) => {
        event.stopPropagation()
        setValue(stepRound(x, scale[0] / ((max - min) / step)))
        handleChange(stepRound(remap(value, -scale[0] / 2, scale[0] / 2, min, max), step))
      },
      onDragStart: () => {
        setActive(true)
      },
      onDragEnd: () => {
        setActive(false)
      },
    },
    { drag: { bounds: { left: -scale[0] / 2, right: scale[0] / 2 }, from: () => [value] } }
  )
  const handleClick = (x) => {
    const v = stepRound(remap(x, 0, 1, -scale[0] / 2, scale[0] / 2), scale[0] / ((max - min) / step))
    setValue(v)
    handleChange(stepRound(remap(v, -scale[0] / 2, scale[0] / 2, min, max), step))
  }

  return (
    <Suspense>
      <Text position={[position[0], position[1] + 30, position[2]]} font={"./GothamLight.otf"} fontSize={fontSize} color="yellow">
        {text}
      </Text>
      <Knob position={position} scale={scale} value={value} bind={bind} active={active} />
      <Track position={position} scale={scale} handleClick={handleClick} />
    </Suspense>
  )
}

function Knob({ position, scale, value, bind, active }) {
  const [hovered, setHover] = useState(false)

  return (
    <mesh
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      scale={active ? scale[1] * 0.9 : scale[1]}
      position={[value + position[0], position[1], position[2]]}
      {...bind()}
      geometry={sphereGeometry}
    >
      <meshPhongMaterial color="yellow" transparent="true" opacity={hovered ? 0.7 : 1} />
    </mesh>
  )
}

function Track({ position, scale, handleClick }) {
  return (
    <>
      <mesh position={position} rotation={[0, 0, 90 * (Math.PI / 180)]} material={trackMaterial}>
        <capsuleGeometry args={[scale[2], scale[0]]} />
      </mesh>
      <Plane onPointerDown={(e) => handleClick(e.uv.x)} args={[scale[0] + scale[2] * 2, scale[2] * 2]} visible={false} />
    </>
  )
}
