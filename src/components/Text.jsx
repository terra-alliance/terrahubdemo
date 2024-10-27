import { Text as _Text } from "@react-three/drei"

export function Text({ font, ...props }) {
  return <_Text font={font || "./FuturaLightEmoji.ttf"} {...props} />
}

export function Title({ font, ...props }) {
  return <Text fontSize={80} {...props} />
}
