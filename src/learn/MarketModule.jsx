import { Text } from "../components/Text"
import MarketPools from "../components/MarketPools"
import Slider from "../components/Slider"

export default function MarketModule() {
  return (
    <>
      <Text text="Market Module" position={[0, 350, 0]} fontSize={70} />
      <MarketPools />
      <Slider position={[200, -175, 0]} scale={[200, 10, 5]} handleChange={null} text min={0} max={100} step={1} fontSize={30} />
      <Slider position={[-200, -175, 0]} scale={[200, 10, 5]} handleChange={null} text min={0} max={100} step={1} fontSize={30} />
    </>
  )
}
