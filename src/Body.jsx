import { useWallet } from "@terra-money/wallet-kit"
import { useWindowSize } from "@uidotdev/usehooks"

import Navbar from "./components/Navbar"
import { Button } from "./components/Button"
import { app } from "./global"

import Home from "./wallet/Home"
import Assets from "./wallet/Assets"
import Swap from "./wallet/Swap"
import Stake from "./wallet/Stake"
import Burn from "./wallet/Burn"
import Govern from "./wallet/Govern"

import Stablecoins from "./learn/Stablecoins"
import MarketModule from "./learn/MarketModule"
import Staking from "./learn/Staking"
import Rewards from "./learn/Rewards"
import Governance from "./learn/Governance"

import Discords from "./ecosystem/Discords"
import Validators from "./ecosystem/Validators"
import Wallets from "./ecosystem/Wallets"
import Finance from "./ecosystem/Finance"
import Games from "./ecosystem/Games"

export default function Body() {
  console.log("Body Render")
  return (
    <>
      <Lighting />
      <Navbar state={app.Mainbar}>
        <Navbar state={app.Walletbar}>
          <Home />
          <Assets />
          <Swap />
          <Stake />
          <Burn />
          <Govern />
        </Navbar>
        <Navbar state={app.Learnbar}>
          <Stablecoins />
          <MarketModule />
          <Staking />
          <Rewards />
          <Governance />
        </Navbar>
        <Navbar state={app.Ecosystembar}>
          <Discords />
          <Validators />
          <Wallets />
          <Finance />
          <Games />
        </Navbar>
        <Explore />
      </Navbar>
      <Connect />
      <Settings />
    </>
  )
}

function Lighting() {
  return (
    <>
      <pointLight intensity={5} position={[0, 5000, -10000]} decay={0} />
      <directionalLight position={[0, -0.5, 1]} intensity={8} />
    </>
  )
}

function Connect() {
  const size = useWindowSize()
  const { status, connect, disconnect } = useWallet()
  const connected = status === "CONNECTED"

  return (
    <Button
      position={[size.width / 2 - 120, size.height / 2 - 40, 200]}
      width={160}
      radius={20}
      color={["hsl(45, 100%, 30%)", "hsl(180, 100%, 30%)", "hsl(300, 100%, 30%)", "hsl(200, 100%, 30%)"][app.Mainbar.selected.get()]}
      hoveredColor={["hsl(300, 100%, 30%)", "hsl(200, 100%, 30%)", "hsl(45, 100%, 30%)", "hsl(180, 100%, 30%)"][app.Mainbar.selected.get()]}
      text={connected ? "Disconnect" : "Connect"}
      textProps={{ fontSize: 22 }}
      onClick={() => (connected ? disconnect() : connect())}
    />
  )
}

function Settings() {
  const size = useWindowSize()

  return (
    <Button
      position={[size.width / 2 - 120, -size.height / 2 + 40, 200]}
      width={160}
      radius={20}
      color={["hsl(45, 100%, 30%)", "hsl(180, 100%, 30%)", "hsl(300, 100%, 30%)", "hsl(200, 100%, 30%)"][app.Mainbar.selected.get()]}
      hoveredColor={["hsl(300, 100%, 30%)", "hsl(200, 100%, 30%)", "hsl(45, 100%, 30%)", "hsl(180, 100%, 30%)"][app.Mainbar.selected.get()]}
      text={"Settings"}
      textProps={{ fontSize: 22 }}
    />
  )
}

function Explore() {
  return (
    <>
      <Button width={1200} height={600} radius={10} color={"hsl(0, 0%, 16%)"} />
    </>
  )
}
