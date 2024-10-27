import { useEffect, Suspense } from "react"
import { useLcdClient, useConnectedWallet } from "@terra-money/wallet-kit"
import { app, getChainID } from "../global"
import { Text } from "../components/Text"

import { CylinderGeometry } from "three"
const geometry = new CylinderGeometry(1, 1, 1, 8)

export default function VotingBar({ position, proposal, length, radius, quorum, width, status }) {
  const pool = app.pool.get()
  const tally = app[proposal?.id].tally.get()

  const connected = useConnectedWallet()
  const lcd = useLcdClient()
  useEffect(() => {
    lcd.gov.tally(proposal?.id, getChainID(connected?.network) || "phoenix-1").then((tally) =>
      app[proposal.id].tally.set({
        yes: tally.yes.toNumber() / 1000000,
        no: tally.no.toNumber() / 1000000,
        no_with_veto: tally.no_with_veto.toNumber() / 1000000,
        abstain: tally.abstain.toNumber() / 1000000,
      })
    )
    lcd.staking.pool(getChainID(connected?.network) || "phoenix-1").then((total) => {
      app.pool.set({ bonded_tokens: total.bonded_tokens.amount.toNumber() / 1000000, not_bonded_tokens: total.not_bonded_tokens.amount.toNumber() / 1000000 })
    })
  }, [connected, proposal])

  const yes = (tally?.yes / pool?.bonded_tokens) * length
  const no = (tally?.no / pool?.bonded_tokens) * length
  const veto = (tally?.no_with_veto / pool?.bonded_tokens) * length
  const abstain = (tally?.abstain / pool?.bonded_tokens) * length

  const reachedQuorum = yes + no + veto + abstain > quorum * length
  const thresholdPosition = reachedQuorum ? (yes + no + veto) / 2 : quorum * length

  return (
    <Suspense>
      {status === "voting" && (
        <Text
          text={reachedQuorum && yes > no + veto ? "passing" : "not passing"}
          position={[width / 2 - 100, 0, 25]}
          color={reachedQuorum && yes > no + veto ? "green" : "red"}
          fontSize={22}
        />
      )}
      <group position={position}>
        <mesh position={[thresholdPosition - length / 2, radius * 2.5, 0]} rotation={[0, 0, Math.PI]} scale={5}>
          <meshStandardMaterial color={0xfcba03} roughness={0.3} metalness={1} />
          <coneGeometry args={[0.8, 1.5]} />
        </mesh>
        <mesh geometry={geometry} position={[0, 0, -radius * 2]} scale={[radius, length - radius * 2, radius]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial roughness={0.15} metalness={1} color={"hsl(0, 0%, 40%)"} />
        </mesh>
        <mesh geometry={geometry} position={[-(length - yes) / 2, 0, 0]} scale={[radius, yes, radius]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial roughness={0.15} metalness={1} color={"green"} />
        </mesh>
        <mesh geometry={geometry} position={[-(length - no) / 2 + yes, 0, 0]} scale={[radius, no, radius]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial roughness={0.15} metalness={1} color={"red"} />
        </mesh>
        <mesh geometry={geometry} position={[-(length - veto) / 2 + yes + no, 0, 0]} scale={[radius, veto, radius]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial roughness={0.15} metalness={1} color={"orange"} />
        </mesh>
        <mesh geometry={geometry} position={[-(length - abstain) / 2 + yes + no + veto, 0, 0]} scale={[radius, abstain, radius]} rotation={[0, 0, Math.PI / 2]}>
          <meshStandardMaterial roughness={0.15} metalness={1} color={"blue"} />
        </mesh>
      </group>
    </Suspense>
  )
}
