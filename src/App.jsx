import { Canvas } from "@react-three/fiber"
import { OrthographicCamera, Stats } from "@react-three/drei"
import { OrbitControls } from "@react-three/drei"

import Body from "./Body"
import { app } from "./global"

export default function App() {
  return (
    <div style={{ position: "absolute", width: "100%", height: "100%" }}>
      <Background />
      <Canvas>
        <OrthographicCamera makeDefault position={[0, 0, 5000]} far={10000} />
        <OrbitControls enabled={false} enableZoom={false} />
        <Body />
        <Stats />
      </Canvas>
    </div>
  )
}

function Background() {
  return (
    <div
      className={["wallet", "learn", "ecosystem", "explore"][app.Mainbar.selected.get()]}
      style={{ position: "absolute", width: "100%", height: "100%", background: "linear-gradient(black 70%, var(--Color)) 100%", transition: "--Color 0.6s ease" }}
    ></div>
  )
}
