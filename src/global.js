import { observable } from "@legendapp/state"
import { enableReactTracking } from "@legendapp/state/config/enableReactTracking"
enableReactTracking({ auto: true })

export const app = observable()

app.Mainbar.set({
  width: 700,
  radius: 20,
  selected: 0,
  color: "hsl(45, 100%, 30%)",
  origin: "top",
  translation: [0, -40, 150],
  direction: "horizontal",
  names: ["Wallet", "Learn", "Ecosystem", "Explore"],
})

app.Walletbar.set({
  width: 160,
  radius: 20,
  selected: 0,
  color: "hsl(45, 100%, 30%)",
  origin: "right",
  translation: [-120, 0, 150],
  direction: "vertical",
  names: ["Home", "Assets", "Swap", "Stake", "Burn", "Govern"],
})

app.Learnbar.set({
  width: 160,
  radius: 20,
  selected: 0,
  color: "hsl(180, 100%, 30%)",
  origin: "right",
  translation: [-120, 0, 150],
  direction: "vertical",
  names: ["Stablecoins", "Market Module", "Validators", "Staking", "Rewards", "Governance"],
})

app.Ecosystembar.set({
  width: 160,
  radius: 20,
  selected: 0,
  color: "hsl(300, 100%, 30%)",
  origin: "right",
  translation: [-120, 0, 150],
  direction: "vertical",
  names: ["Discords", "Validators", "Wallets", "Finance", "Games"],
})

export const getChainID = (network) => {
  switch (network) {
    case "mainnet":
      return "phoenix-1"
    case "testnet":
      return "pisco-1"
    case "classic":
      return "columbus-5"
    case "localterra":
      return "localterra"
  }
}
