'use client'

import { LiFiWidget, WidgetConfig, WidgetSkeleton } from '@lifi/widget'
import { ClientOnly } from './client-only'
import { useActiveAccount, useConnectModal } from 'thirdweb/react'
import { getChainConfig } from './widget-config'
import { client } from '../client'

const LiFi = ({
}: {
}) => {
  const { connect, isConnecting } = useConnectModal()
  const activeAccount = useActiveAccount()
  const chainConfig = getChainConfig("Ethereum")!
  
  const widgetConfig: WidgetConfig = {
    integrator: 'WaterCoolerStudios',
    variant: 'wide',
    subvariant: 'default',
    appearance: 'dark',
    disabledUI: ['fromToken', 'toToken'],
    theme: {
      palette: {
        primary: {
          main: '#18f3e6',
        },
        secondary: {
          main: '#95FFF2',
        },
        text: {
          secondary: '#838383',
          primary: '#ffffff',
        },
        background: {
          paper: '#262626',
          default: '#000000',
        },
        grey: {
          200: '#eeeeee',
        },
      },
      typography: {
        fontFamily: 'Montserrat, sans-serif',
      },
      container: {
        boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
      },
      shape: {
        borderRadius: 18,
        borderRadiusSecondary: 18,
      },
    },
    walletConfig: {
      async onConnect() {
        await connect({
          client: client,
        })
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
    toToken: chainConfig.lstToken
  }

  return (
        <ClientOnly fallback={<WidgetSkeleton config={widgetConfig} />}>
            <LiFiWidget integrator="WaterCoolerStudios" config={widgetConfig} />
        </ClientOnly>
  )
}

export default LiFi
