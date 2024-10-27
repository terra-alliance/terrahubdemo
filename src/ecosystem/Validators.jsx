import { Text } from "../components/Text"
import { MoonRabbit, Orion, Terrarium } from "../components/Validators"

export default function Validators() {
  return (
    <>
      <Text text="Validators" position={[0, 350, 0]} fontSize={70} />
      <MoonRabbit position={[-300, 0, 0]} scale={120} />
      <Orion position={[0, 0, 0]} scale={120} />
      <Terrarium position={[300, 0, 0]} scale={120} />
    </>
  )
}
