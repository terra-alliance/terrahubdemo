import { useEffect, useRef } from "react"
import { useObservable } from "@legendapp/state/react"
import { Shape } from "three"
import { useFrame } from "@react-three/fiber"
import { useWindowSize } from "@uidotdev/usehooks"
import { Extrude } from "@react-three/drei"
import { useLcdClient, useConnectedWallet } from "@terra-money/wallet-kit"

import { Button } from "../components/Button"
import Satellite from "../components/Satellite"
import { Text } from "../components/Text"
import Grid from "../components/Grid"
import { app, getChainID } from "../global"

/* <Input position={[0, 0, 100]} scale={200} /> */

export default function Stake() {
  const size = useWindowSize()
  const connected = useConnectedWallet()
  // const address = connected?.addresses[getChainID(connected.network)]
  const address = "terra1yayfwn5gqz9t90a5c4ne7asjhra6aq62qtqz73"
  const lcd = useLcdClient()
  const validators = app.validators.get()

  useEffect(() => {
    lcd.staking.validators(getChainID(connected?.network) || "phoenix-1", { "pagination.limit": 999 }).then(([validators]) => {
      app.validators.set(
        validators
          .filter((obj) => obj.status !== "BOND_STATUS_UNBONDED")
          .sort((a, b) => b.tokens - a.tokens)
          .map((validator) => {
            return {
              name: validator.description.moniker,
              operator_address: validator.operator_address,
              tokens: validator.tokens.toNumber() / 1000000,
              commission_rate: validator.commission.commission_rates.rate.toNumber(),
            }
          })
      )
    })
    lcd.staking.pool(getChainID(connected?.network) || "phoenix-1").then((total) => {
      app.pool.set({ bonded_tokens: total.bonded_tokens.amount.toNumber() / 1000000, not_bonded_tokens: total.not_bonded_tokens.amount.toNumber() / 1000000 })
    })
    lcd.staking.delegations(address).then(([delegations]) => {
      app.delegations.set(
        delegations
          .filter((delegation) => delegation.balance.amount > 0)
          .sort((a, b) => b.balance.amount - a.balance.amount)
          .map(({ balance, validator_address }) => {
            return {
              balance: balance.amount.toNumber(),
              validator_address: validator_address,
            }
          })
      )
    })
    lcd.staking.redelegations(address).then(([redelegations]) => {
      for (const key in redelegations) {
        for (const entry in redelegations[key].entries) {
          redelegations[key].entries[entry].balance = redelegations[key].entries[entry].balance.toNumber()
          redelegations[key].entries[entry].initial_balance = redelegations[key].entries[entry].initial_balance.toNumber()
          redelegations[key].entries[entry].shares_dst = redelegations[key].entries[entry].shares_dst.toNumber()
        }
      }
      app.redelegations.set(redelegations)
    })
    lcd.staking.unbondingDelegations(address).then(([undelegations]) => {
      for (const key in undelegations) {
        for (const entry in undelegations[key].entries) {
          undelegations[key].entries[entry].balance = undelegations[key].entries[entry].balance.toNumber()
          undelegations[key].entries[entry].initial_balance = undelegations[key].entries[entry].initial_balance.toNumber()
        }
      }
      app.undelegations.set(undelegations)
    })
    address &&
      lcd.distribution.rewards(address).then((rewards) => {
        for (const key in rewards.rewards) {
          for (const coin in rewards.rewards[key]._coins) {
            rewards.rewards[key]._coins[coin].amount = rewards.rewards[key]._coins[coin].amount.toNumber()
          }
        }
        for (const coin in rewards.total._coins) {
          rewards.total._coins[coin].amount = rewards.total._coins[coin].amount.toNumber()
        }
        app.rewards.set(rewards)
      })
  }, [connected])

  return (
    <>
      <Dashboard />
      <Grid position={[size.width / 8, 0, 0]} width={size.width / 2 - 30} height={size.height / 1.5} xspacing={700} columns={1} visibleItems={10} items={validators?.length}>
        {({ index, width }) => <GridItems index={index} width={width} />}
      </Grid>
    </>
  )
}

function GridItems({ index, width }) {
  const validators = app.validators.get()
  const delegations = app.delegations.get()
  const pool = app.pool.get()
  const delegation = delegations?.filter(({ validator_address }) => validators?.[index]?.operator_address === validator_address)[0]?.balance / 1000000
  const fontSize = 20

  return (
    <>
      <SatelliteButton width={width - 100} radius={25} opacity={1} color={delegation ? "hsl(45, 100%, 30%)" : "hsl(0, 0%, 22%)"} hoveredColor={"hsl(315, 100%, 30%)"} />
      <Text position={[-width / 2 + 100, 0, 30]} text={index + 1} fontSize={fontSize} />
      <Text position={[-width / 2 + 130, 0, 30]} text={validators?.[index]?.name} fontSize={fontSize} anchorX="left" clipRect={[-100, -100, 250, 100]} />
      <Text position={[-width / 2 + 450, 0, 30]} text={((validators?.[index]?.tokens / pool?.bonded_tokens) * 100).toFixed(2) + "%"} fontSize={fontSize} anchorX="left" />
      <Text position={[-width / 2 + 550, 0, 30]} text={(validators?.[index]?.commission_rate * 100).toFixed(2) + "%"} fontSize={fontSize} anchorX="left" />
      <Text position={[-width / 2 + 750, 0, 30]} text={delegation > 0 ? delegation.toFixed(2) : "-"} fontSize={fontSize} />
    </>
  )
}

function SatelliteButton({ width, radius, color, hoveredColor }) {
  const hovered = useObservable(false)

  return (
    <>
      <Satellite position={[-width / 2, 0, 50]} scale={1.1} onClick={() => null} hovered={hovered.get()} />
      <Button width={width} radius={radius} opacity={1} color={color} hoveredColor={hoveredColor} hovered={hovered} cursor={"pointer"} />
    </>
  )
}

function Dashboard() {
  const size = useWindowSize()

  return (
    <group position={[-size.width / 4, 0, 0]}>
      <Button width={size.width / 4 - 30} height={size.height / 1.5} radius={10} color={"hsl(0, 0%, 16%)"} />
      <Delegations position={[0, 0, 100]} />
      <Redelegations position={[0, -75, 100]} />
      <Undelegations position={[0, -150, 100]} />
      <Rewards position={[0, -225, 100]} />
      <PieChart />
    </group>
  )
}

function PieChart() {
  const delegations = app.delegations.get()
  const total = delegations?.reduce((acc, { balance }) => acc + balance, 0)
  const group = useRef()

  useFrame((state, delta) => (group.current.rotation.z += delta * 0.3))

  return (
    <group ref={group} position={[0, 150, 100]} rotation={[-Math.PI / 4, 0, 0]}>
      {delegations?.map(({ balance }, i, array) => {
        var shape = new Shape()
        shape.moveTo(0, 0)
        shape.arc(0, 0, 100, 0, Math.PI * 2 * (balance / total), false)
        shape.lineTo(0, 0)
        const angle = Math.PI * 2 * (array.slice(0, i).reduce((acc, { balance }) => acc + balance, 0) / total)
        return (
          <group key={i}>
            <Extrude
              position={[Math.cos(angle + Math.PI * (balance / total)) * 10, Math.sin(angle + Math.PI * (balance / total)) * 10, 0]}
              rotation={[0, 0, angle]}
              args={[shape, { curveSegments: 48, steps: 1, depth: 20, bevelEnabled: true, bevelThickness: 2, bevelSize: 2, bevelSegments: 2 }]}
            >
              <meshStandardMaterial roughness={0.5} metalness={1} color={"hsl(45, 100%," + (70 - (i * 60) / array.length) + "%)"} />
            </Extrude>
          </group>
        )
      })}
    </group>
  )
}

function Delegations({ position }) {
  const size = useWindowSize()
  const delegations = app.delegations.get()
  const total = delegations?.reduce((acc, { balance }) => acc + balance, 0)

  return (
    <group position={position}>
      <Button width={size.width / 4 - 100} radius={30} opacity={1} color={"hsl(0, 0%, 22%)"} hoveredColor={"hsl(315, 100%, 30%)"} />
      <Text position-z={30} text={"Delegations: " + (total / 1000000).toLocaleString("en-US", { maximumFractionDigits: 2 })} fontSize={24} />
    </group>
  )
}

function Redelegations({ position }) {
  const size = useWindowSize()
  const redelegations = app.redelegations.get()

  const totalredelegations = redelegations?.reduce((acc, redelegation) => {
    let balance = 0
    redelegation.entries.forEach((entry) => (balance += entry.balance))
    return acc + balance
  }, 0)

  return (
    <group position={position}>
      <Button width={size.width / 4 - 100} radius={30} opacity={1} color={"hsl(0, 0%, 22%)"} hoveredColor={"hsl(315, 100%, 30%)"} />
      <Text position-z={30} text={"Redelegations: " + (totalredelegations / 1000000).toLocaleString("en-US", { maximumFractionDigits: 2 })} fontSize={24} />
    </group>
  )
}

function Undelegations({ position }) {
  const size = useWindowSize()
  const undelegations = app.undelegations.get()

  const totalundelegations = undelegations?.reduce((acc, undelegation) => {
    let balance = 0
    undelegation.entries.forEach((entry) => (balance += entry.balance))
    return acc + balance
  }, 0)

  return (
    <group position={position}>
      <Button width={size.width / 4 - 100} radius={30} opacity={1} color={"hsl(0, 0%, 22%)"} hoveredColor={"hsl(315, 100%, 30%)"} />
      <Text position-z={30} text={"Undelegations: " + (totalundelegations / 1000000).toLocaleString("en-US", { maximumFractionDigits: 2 })} fontSize={24} />
    </group>
  )
}

function Rewards({ position }) {
  const size = useWindowSize()
  const rewards = app.rewards.get()

  return (
    <group position={position}>
      <Button width={size.width / 4 - 100} radius={30} opacity={1} color={"hsl(0, 0%, 22%)"} hoveredColor={"hsl(315, 100%, 30%)"} />
      <Text position-z={30} text={"Rewards: " + (rewards?.total._coins.uluna.amount / 1000000).toLocaleString("en-US", { maximumFractionDigits: 2 })} fontSize={24} />
    </group>
  )
}
