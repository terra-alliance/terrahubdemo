import { Text } from "../components/Text"
import { LuncAcademy, Terrarium } from "../components/Validators"

export default function Discords() {
  return (
    <>
      <Text text="Discords" position={[0, 350, 0]} fontSize={70} />
      <Terrarium position={[150, 0, 0]} scale={120} />
      <LuncAcademy position={[-150, 0, 0]} scale={120} />
    </>
  )
}
