"use client"

import { LiFiWidget, WidgetConfig, WidgetSkeleton } from "@lifi/widget"
import { ClientOnly } from "./client-only"
import { useConnectModal } from "thirdweb/react"
import { getChainConfig } from "./widget-config"
import { client } from "../client"
import { useEffect } from "react"
import { defineChain } from "thirdweb"
import { useSetActiveWallet, useActiveAccount } from "thirdweb/react"
import { createWalletAdapter } from "thirdweb/wallets"
import { useDisconnect, useConnect, useSwitchChain, useWalletClient, useAccount } from "wagmi"
import { viemAdapter } from "thirdweb/adapters/viem"

const LiFi = ({}: {}) => {
	const { connect: thirdwebConnect } = useConnectModal()
  const { connectors, connect } = useConnect()
  const wagmiAccount = useAccount()
	const chainConfig = getChainConfig("Ethereum")!
	const { data: walletClient } = useWalletClient() // from wagmi
	const { disconnectAsync } = useDisconnect() // from wagmi
	const { switchChainAsync } = useSwitchChain() // from wagmi
	const setActiveWallet = useSetActiveWallet() // from thirdweb/react
  const activeTwAccount = useActiveAccount()

	useEffect(() => {
		const setActive = async () => {
        if (walletClient) {
          // adapt the walletClient to a thirdweb account
          const adaptedAccount = viemAdapter.walletClient.fromViem({
            walletClient: walletClient as any, // accounts for wagmi/viem version mismatches
          })
          // create the thirdweb wallet with the adapted account
          const thirdwebWallet = createWalletAdapter({
            client,
            adaptedAccount,
            chain: defineChain(await walletClient.getChainId()),
            onDisconnect: async () => {
              await disconnectAsync()
            },
            switchChain: async (chain: any) => {
              await switchChainAsync({ chainId: chain.id as any })
            },
          })
          setActiveWallet(thirdwebWallet)
        }
		}
		setActive()
	}, [walletClient, disconnectAsync, setActiveWallet, switchChainAsync])

  useEffect(() => {
    const connector = connectors[0]!;

    if (!wagmiAccount.isConnected && activeTwAccount?.address) {
      void connect({connector})
    } 
  }, [activeTwAccount?.address, connect, connectors, wagmiAccount.isConnected])


	const widgetConfig: WidgetConfig = {
		integrator: "WaterCoolerStudios",
		variant: "wide",
		subvariant: "default",
		appearance: "dark",
		disabledUI: ["fromToken", "toToken"],
		theme: {
			palette: {
				primary: {
					main: "#18f3e6",
				},
				secondary: {
					main: "#95FFF2",
				},
				text: {
					secondary: "#838383",
					primary: "#ffffff",
				},
				background: {
					paper: "#262626",
					default: "#000000",
				},
				grey: {
					200: "#eeeeee",
				},
			},
			typography: {
				fontFamily: "Montserrat, sans-serif",
			},
			container: {
				boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
				borderRadius: "16px",
			},
			shape: {
				borderRadius: 18,
				borderRadiusSecondary: 18,
			},
		},
		walletConfig: {
			async onConnect() {
        // const connector = connectors[0]!;

        // if (!wagmiAccount.isConnected) {
        //   void connect({connector})
        // } else {
          await thirdwebConnect({
            client: client
          })
        // }
			},
		},
		// Read in the selected chains config
		sdkConfig: {
			rpcUrls: {
				[chainConfig.chainId]: [chainConfig.rpcUrl],
			},
		},
		fromChain: chainConfig.chainId,
		toChain: chainConfig.chainId,
		fromToken: chainConfig.gasToken,
		toToken: chainConfig.lstToken,
	}

	return (
		<ClientOnly fallback={<WidgetSkeleton config={widgetConfig} />}>
			<LiFiWidget integrator="WaterCoolerStudios" config={widgetConfig} />
		</ClientOnly>
	)
}

export default LiFi
