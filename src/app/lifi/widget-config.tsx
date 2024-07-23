type ChainConfig = {
    rpcUrl: string
    chainId: number
    gasToken: string
    lstToken: string
  }
  
//   TODO: probably move this way up or store somewhere else, as we might need this info elsewhere as well
  const chainConfigs: { [key: string]: ChainConfig } = {
    Ethereum: {
        rpcUrl: 'https://mainnet.infura.io/v3/88d591a30fb245e48f680e5628319a51',
        chainId: 1,
        gasToken: '0x0000000000000000000000000000000000000000', // ETH
        lstToken: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0' // wstETH
    }
}


export const getChainConfig = (key: string): ChainConfig | undefined => {
    return chainConfigs[key]
}