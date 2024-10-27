import { Text } from "../components/Text"
import { FireSphere, Lunc } from "../components/Coins"

export default function Burn() {
  return (
    <>
      <Text text="Burn" position={[0, 350, 0]} fontSize={60} />
      <Lunc position={[0, 0, 0]} scale={130} />
      <FireSphere position={[0, 0, 0]} scale={131} />
    </>
  )
}
