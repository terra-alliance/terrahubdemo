import { Title } from "../components/Text"
import { Lunc } from "../components/Coins"

export default function Home() {
  return (
    <>
      <Title text="Welcome to Terra Classic" position={[0, 325, 0]} />
      <Lunc position={[0, 0, 0]} scale={130} />
    </>
  )
}
