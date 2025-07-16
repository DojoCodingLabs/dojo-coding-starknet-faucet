'use client'

import React from 'react'
import WalletConnection from '@/components/WalletConnection'
import FaucetClaim from '@/components/FaucetClaim'
import Header from '@/components/Header'
import { useStarknet } from '@/components/providers/StarknetProvider'

export default function Home() {
  const { isConnected } = useStarknet()

  return (
    <div className="min-h-screen bg-gradient-light flex flex-col">
      {/* <Header /> */}

      {/* Main Application */}
      <section className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 max-w-2xl">
          <div className="space-y-8">
            {/* Wallet Connection */}
            <WalletConnection />

            {/* Faucet Claim - Only show when connected */}
            {isConnected && <FaucetClaim />}
          </div>
        </div>
      </section>
    </div>
  )
} 