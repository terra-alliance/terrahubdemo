import { Text } from "../components/Text"
import { Dai, Usdt, Usdc } from "../components/Coins"

export default function Stablecoins() {
  return (
    <>
      <Text text="Stablecoins" position={[0, 350, 0]} fontSize={70} />
      <Dai position={[0, 0, 0]} scale={120} />
      <Usdc position={[-300, 0, 0]} scale={120} />
      <Usdt position={[300, 0, 0]} scale={120} />
    </>
  )
}
