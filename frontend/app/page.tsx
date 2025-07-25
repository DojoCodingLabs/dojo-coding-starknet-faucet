'use client'

import React from 'react'
import WalletConnection from '@/components/WalletConnection'
import FaucetClaim from '@/components/FaucetClaim'
import Header from '@/components/Header'
import { useStarknet } from '@/components/providers/StarknetProvider'

export default function Home() {
  const { isConnected } = useStarknet()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="section-padding flex-1 flex items-center justify-center">
        <div className="container-dojo text-center">
          <div className="space-y-8 max-w-4xl mx-auto">
            {/* Hero Content */}
            <div className="text-spacing">
              <div className="badge-primary mb-6 inline-block">
                🚀 Free Starknet Testnet Tokens
              </div>
              <h1 className="hero-title mb-6">
                Get <span className="gradient-text">STRK Tokens</span> for Development
              </h1>
              <p className="subtitle mb-8">
                Free testnet tokens for Starknet Sepolia development. Built by the Dojo Coding community.
              </p>
            </div>

            {/* Main Application */}
            <div className="max-w-2xl mx-auto space-y-8">
              {/* Wallet Connection */}
              <WalletConnection />

              {/* Faucet Claim - Only show when connected */}
              {isConnected && <FaucetClaim />}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 