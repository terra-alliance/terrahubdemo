import { useObservable } from "@legendapp/state/react"
import { useThree } from "@react-three/fiber"
import { animated, useSpringValue } from "@react-spring/three"

import { Button } from "../components/Button"

function MinMax(num, min, max) {
  if (num < min) return min
  if (num > max) return max
  return num
}

export default function Grid({ position, height, width, xspacing, columns, items, visibleItems, children }) {
  const scroll = useObservable(0)
  const yspacing = (height - 125) / (visibleItems - 1)

  return (
    <group position={position}>
      <Button
        width={width}
        height={height}
        radius={10}
        color={"hsl(0, 0%, 16%)"}
        onWheel={(ev) => scroll.set((prev) => MinMax(prev + ev.deltaY / 2, 0, yspacing * Math.max(items / columns - visibleItems, 0)))}
      />
      {items && (
        <Items
          width={width}
          height={height - 125}
          xspacing={xspacing}
          columns={columns}
          yspacing={yspacing}
          visibleItems={visibleItems - 1}
          items={items}
          children={children}
          scroll={scroll}
        />
      )}
    </group>
  )
}

function Items({ children, width, height, xspacing, columns, yspacing, visibleItems, items, scroll }) {
  const events = useThree((state) => state.events)
  const spring = useSpringValue(scroll.get(), { onChange: () => events.update() })
  spring.start(scroll.get())

  return (
    <AnimatedGroup
      spring={spring}
      width={width}
      height={height}
      xspacing={xspacing}
      columns={columns}
      yspacing={yspacing}
      visibleItems={visibleItems}
      items={items}
      children={children}
    />
  )
}

const AnimatedGroup = animated(Group)

function Group({ children, width, height, xspacing, columns, spring, yspacing, visibleItems }) {
  return (
    <>
      {[...Array(Math.min(visibleItems * columns + 2 * columns))].map((_, i) => {
        const gridX = (i % columns) * xspacing - ((columns - 1) * xspacing) / 2
        const gridY = -Math.floor(i / columns) * yspacing
        const y = ((gridY + spring + height + yspacing) % (height + yspacing * 2)) - yspacing
        const index = i + Math.floor((gridY + spring + height + yspacing) / (height + yspacing * 2)) * (visibleItems * columns + 2 * columns)

        return <group key={i} position={[gridX, MinMax(y, 0, height) - height / 2, y < 0 || y > height ? 50 : 150]} children={children({ width, index })} />
      })}
    </>
  )
}
