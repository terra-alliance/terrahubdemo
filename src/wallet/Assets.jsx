import { useObservable, Show } from "@legendapp/state/react"
import { useLcdClient, useConnectedWallet } from "@terra-money/wallet-kit"
import axios from "axios"

import { Button } from "../components/Button"
import { Text } from "../components/Text"
import Grid from "../components/Grid"
import { Lunc, Ibc, Terra } from "../components/Coins"
import { app, getChainID } from "../global"

const currencies = ["usd", "twd", "thb", "sgd", "sek", "sdr", "php", "nok", "myr", "mnt", "krw", "jpy", "inr", "idr", "hkd", "gbp", "eur", "dkk", "cny", "chf", "cad", "aud"]

export default function Assets() {
  const connected = useConnectedWallet()
  const address = connected?.addresses[getChainID(connected.network)]
  // const address = "terra120ppepaj2lh5vreadx42wnjjznh55vvktwj679"
  const lcd = useLcdClient()

  if (connected) {
    app.balances.set(lcd.bank.spendableBalances(address).then(([coins]) => Object.values(coins._coins)))
    app.prices.set(
      axios
        .get("https://price.api.tfm.com/tokens/?limit=1500")
        .then(({ data }) => Object.fromEntries(Object.entries(data).map(([denom, { usd, change24h }]) => [denom, { price: usd, change: change24h }])))
    )
  }

  return (
    <>
      <Button position={[-350, 0, 0]} width={650} height={650} radius={10} color={"hsl(0, 0%, 16%)"} />
      <List />
    </>
  )
}

function List() {
  const connected = useConnectedWallet()
  const balances = app.balances.get()
  const prices = app.prices.get()

  return (
    <>
      <Grid position={[350, 0, 0]} width={650} height={650} xspacing={700} columns={1} visibleItems={10} items={balances?.length}>
        {({ index }) => {
          const coin = balances?.[index]
          const denom = coin?.denom === "uluna" && connected.network === "classic" ? "lunc" : coin?.denom
          const amount = coin?.amount / 1e6
          const price = prices?.[tfm[denom]]?.price * amount
          return (
            <>
              <CoinButton width={600} radius={25} opacity={1} color={"hsl(0, 0%, 22%)"} hoveredColor={"hsl(315, 100%, 30%)"} coin={coin} />
              <Text
                text={amount.toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + denom}
                position={[-260, 0, 30]}
                fontSize={22}
                anchorX="left"
                clipRect={[-100, -100, 300, 100]}
              />
              <Text position={[300, 0, 30]} text={prices?.[tfm[denom]] ? "$" + price.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "-"} fontSize={22} anchorX="right" />
            </>
          )
        }}
      </Grid>
    </>
  )
}

function CoinButton({ width, radius, color, hoveredColor, onClick, coin }) {
  const hovered = useObservable(false)

  return (
    <>
      <Show if={coin?.denom === "uluna"}>
        <Lunc position={[-300, 0, 50]} scale={25} flag={currencies.indexOf(coin?.denom.slice(1))} hovered={hovered.get()} />
      </Show>
      <Show if={coin?.denom.slice(0, 3) === "ibc"}>
        <Ibc position={[-300, 0, 50]} scale={25} flag={currencies.indexOf(coin?.denom.slice(1))} hovered={hovered.get()} />
      </Show>
      <Show if={TerraStables.includes(coin?.denom)}>
        <Terra position={[-300, 0, 50]} scale={25} flag={currencies.indexOf(coin?.denom.slice(1))} hovered={hovered.get()} />
      </Show>
      <Button width={width} radius={radius} opacity={1} color={color} hoveredColor={hoveredColor} hovered={hovered} onClick={onClick} />
    </>
  )
}

const tfm = {
  lunc: "ibc/0EF15DF2F02480ADE0BB6E85D9EBB5DAEA2836D3860E9F97F9AADE4F57A31AA0",
  uusd: "ibc/BE1BB42D4BE3C30D50B68D7C41DB4DFCE9678E8EF8C539F6E6A9345048894FCC",
  mbtc: "terra1rhhvx8nzfrx5fufkuft06q5marfkucdqwq5sjw",
  ukrw: "ukrw",
  umnt: "umnt",
  usek: "usek",
  ueur: "ueur",
  uchf: "uchf",
  usdr: "usdr",
  ugbp: "ugbp",
}

const TerraStables = [
  "uusd",
  "utwd",
  "uthb",
  "usgd",
  "usek",
  "usdr",
  "uphp",
  "unok",
  "umyr",
  "umnt",
  "ukrw",
  "ujpy",
  "uinr",
  "uidr",
  "uhkd",
  "ugbp",
  "ueur",
  "udkk",
  "ucny",
  "uchf",
  "ucad",
  "uaud",
]
