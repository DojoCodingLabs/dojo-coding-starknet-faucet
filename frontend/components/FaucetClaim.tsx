'use client'

import React, { useState, useEffect } from 'react'
import { useStarknet } from '@/components/providers/StarknetProvider'
import { Contract, RpcProvider } from 'starknet'
import { FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, type FaucetInfo } from '@/lib/contract'
import toast from 'react-hot-toast'
import Image from 'next/image'

export default function FaucetClaim() {
  const { account, address, isConnected } = useStarknet()
  const [faucetInfo, setFaucetInfo] = useState<{
    withdrawalAmount: bigint;
    waitTime: bigint;
    userUnlockTime: bigint;
  } | null>(null)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(Math.floor(Date.now() / 1000))

  // Create provider for read-only operations
  const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io" })

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Math.floor(Date.now() / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const loadFaucetInfo = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // Use provider for read operations
      const contract = new Contract(FAUCET_ABI, FAUCET_CONTRACT_ADDRESS, provider)
      
      const [withdrawalAmount, waitTime, userUnlockTime] = await Promise.all([
        contract.get_withdrawal_amount(),
        contract.get_wait_time(),
        contract.get_user_unlock_time(address)
      ])

      setFaucetInfo({
        withdrawalAmount: BigInt(withdrawalAmount.toString()),
        waitTime: BigInt(waitTime.toString()),
        userUnlockTime: BigInt(userUnlockTime.toString())
      })
    } catch (error) {
      console.error('Error loading faucet info:', error)
      toast.error('Failed to load faucet information')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    if (!account) {
      toast.error('Please connect your wallet first')
      return
    }

    if (!faucetInfo) {
      toast.error('Faucet information not loaded')
      return
    }

    // Check if user can claim
    if (faucetInfo.userUnlockTime > 0 && Number(faucetInfo.userUnlockTime) > currentTime) {
      const timeRemaining = Number(faucetInfo.userUnlockTime) - currentTime
      toast.error(`You must wait before claiming again`)
      return
    }

    setIsClaiming(true)
    try {
      // Use account for write operations
      const contract = new Contract(FAUCET_ABI, FAUCET_CONTRACT_ADDRESS, account)
      const tx = await contract.faucet_mint()
      toast.success('Claim transaction submitted!')
      console.log('Transaction hash:', tx.transaction_hash)
      
      // Reload faucet info after claim
      setTimeout(() => {
        loadFaucetInfo()
      }, 3000)
    } catch (error) {
      console.error('Error claiming from faucet:', error)
      toast.error('Failed to claim tokens')
    } finally {
      setIsClaiming(false)
    }
  }

  useEffect(() => {
    if (address) {
      loadFaucetInfo()
    }
  }, [address])

  if (!isConnected) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Connect Your Wallet</h2>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 814 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-lg text-neutral-600">Loading faucet information...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!faucetInfo) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 text-center">
        <p className="text-red-500">Failed to load faucet information</p>
        <button 
          onClick={loadFaucetInfo}
          className="mt-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  const canClaim = Number(faucetInfo.userUnlockTime) <= currentTime
  const timeRemaining = canClaim ? 0 : Number(faucetInfo.userUnlockTime) - currentTime

  const formatSTRK = (wei: bigint) => {
    const value = Number(wei) / 10**18
    // Si es un número entero, no mostrar decimales
    if (value % 1 === 0) {
      return value.toString()
    }
    // Si tiene decimales, mostrar hasta 4 decimales pero eliminar ceros al final
    return parseFloat(value.toFixed(4)).toString()
  }

  const formatTimeRemaining = (seconds: number) => {
    if (seconds <= 0) return "Ready to claim!"
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden">
        <div className="bg-gradient-to-r from-soft-blue to-soft-purple p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Image src="/strk-logo.svg" alt="STRK Logo" width={40} height={40} />
            <h2 className="text-2xl font-bold text-neutral-800">STRK Faucet</h2>
          </div>
          <p className="text-neutral-600">Claim free STRK tokens from the faucet</p>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Image src="/strk-logo.svg" alt="STRK" width={20} height={20} />
                <p className="text-sm text-neutral-600">Withdrawal Amount</p>
              </div>
              <p className="text-lg font-semibold text-neutral-800">{formatSTRK(faucetInfo.withdrawalAmount)} STRK</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-neutral-600">Next Claim Available</p>
              </div>
              <p className={`text-lg font-semibold ${canClaim ? 'text-accent-600' : 'text-orange-600'}`}>
                {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={isClaiming || !canClaim}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
              canClaim && !isClaiming
                ? 'bg-gradient-to-r from-primary-400 to-secondary-400 hover:from-primary-500 hover:to-secondary-500 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
            }`}
          >
            {isClaiming ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 814 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Claiming...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <Image src="/strk-logo.svg" alt="STRK" width={24} height={24} />
                <span>Claim STRK Tokens</span>
              </div>
            )}
          </button>

          {!canClaim && (
            <div className="text-center text-sm text-neutral-500">
              <p>You must wait {formatTimeRemaining(timeRemaining)} before claiming again</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 