'use client'

import React, { useState } from 'react'
import { useStarknet } from '@/components/providers/StarknetProvider'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function WalletConnection() {
  const { address, isConnected, connect, disconnect } = useStarknet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      await connect()
      toast.success('Wallet connected successfully!')
    } catch (error) {
      console.error('Failed to connect:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast.success('Wallet disconnected')
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (isConnected && address) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden">
          <div className="bg-gradient-to-r from-soft-green to-accent-100 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-r from-accent-400 to-accent-500 rounded-2xl flex items-center justify-center shadow-md">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-accent-600 mb-1">✓ Wallet Connected</p>
                  <p className="text-lg font-bold text-neutral-800">{formatAddress(address)}</p>
                </div>
              </div>
              <button
                onClick={handleDisconnect}
                className="bg-white hover:bg-neutral-50 text-neutral-700 font-semibold px-6 py-3 rounded-xl transition-all duration-300 border border-neutral-200 hover:border-neutral-300 shadow-sm hover:shadow-md"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <Image src="/strk-logo.svg" alt="STRK Logo" width={80} height={80} />
          </div>
          
          <h3 className="text-2xl font-bold text-neutral-800 mb-3">Starknet Sepolia STRK Faucet</h3>
          <p className="text-neutral-600 mb-6">10 STRK / 24 hrs</p>

          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full bg-gradient-to-r from-primary-400 to-secondary-400 hover:from-primary-500 hover:to-secondary-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
          >
            {isConnecting ? (
              <div className="flex items-center justify-center space-x-3">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 814 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Image src="/strk-logo.svg" alt="STRK" width={20} height={20} />
                <span>Connect Wallet</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
} 