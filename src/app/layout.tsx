'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThirdwebProvider } from "thirdweb/react";

import { WagmiProvider, createConfig, http, useAccount } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from 'wagmi/connectors';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const wagmiConfig = createConfig({
        chains: [mainnet],
        transports: {
            [mainnet.id]: http()
        },
        connectors: [injected()]        
    })

    const queryClient = new QueryClient();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThirdwebProvider>
            <WagmiProvider config={wagmiConfig}>
                <QueryClientProvider client={queryClient}>
                    {children}
                </QueryClientProvider>
            </WagmiProvider>    
        </ThirdwebProvider>
      </body>
    </html>
  );
}
