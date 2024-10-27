import { Text } from "../components/Text"
import SwapMachine from "../components/SwapMachine"

export default function Swap() {
  return (
    <>
      <Text text="Swap" position={[0, 350, 0]} fontSize={60} />
      <SwapMachine />
    </>
  )
}
