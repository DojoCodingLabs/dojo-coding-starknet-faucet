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
      
      // Immediately update the local state to reflect the new unlock time
      if (faucetInfo.waitTime) {
        const newUnlockTime = currentTime + Number(faucetInfo.waitTime)
        setFaucetInfo(prev => prev ? {
          ...prev,
          userUnlockTime: BigInt(newUnlockTime)
        } : null)
      }
      
      // Reload faucet info after a short delay with retries
      const reloadWithRetries = async (attempts = 0) => {
        if (attempts < 5) {
          await loadFaucetInfo()
          // If the unlock time hasn't updated yet, try again
          setTimeout(() => reloadWithRetries(attempts + 1), 2000)
        }
      }
      
      setTimeout(() => {
        reloadWithRetries()
      }, 1000)
      
    } catch (error) {
      console.error('Error claiming from faucet:', error)
      toast.error('Failed to claim tokens')
    } finally {
      setIsClaiming(false)
    }
  }

  useEffect(() => {
    if (address && isConnected) {
      loadFaucetInfo()
    } else {
      // Reset state when wallet disconnects
      setFaucetInfo(null)
      setIsLoading(false)
      setIsClaiming(false)
    }
  }, [address, isConnected])

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="card-padding">
            <h2 className="card-title mb-4">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Please connect your Starknet wallet to claim STRK tokens</p>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="card-padding">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 818-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 814 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="body-text">Loading faucet information...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!faucetInfo) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="card-padding">
            <p className="text-destructive mb-4">Failed to load faucet information</p>
            <button 
              onClick={loadFaucetInfo}
              className="btn-primary focus-ring"
            >
              Retry
            </button>
          </div>
        </div>
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
      <div className="card overflow-hidden">
        <div className="card-padding" style={{background: 'var(--gradient-primary)'}}>
          <div className="flex items-center space-x-3 mb-2">
            <Image src="/strk-logo.svg" alt="STRK Logo" width={40} height={40} />
            <h2 className="card-title text-white">Dojo STRK Faucet</h2>
          </div>
          <p className="text-white/90 text-sm">Claim free STRK tokens from the community faucet</p>
        </div>
        
        <div className="card-padding space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <Image src="/strk-logo.svg" alt="STRK" width={20} height={20} />
                <p className="text-sm text-muted-foreground">Withdrawal Amount</p>
              </div>
              <p className="text-lg font-semibold text-foreground">{formatSTRK(faucetInfo.withdrawalAmount)} STRK</p>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-1">
                <svg className="icon-accent w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-muted-foreground">Next Claim Available</p>
              </div>
              <p className={`text-lg font-semibold ${canClaim ? 'text-primary' : 'text-destructive'}`}>
                {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
          </div>

          <button
            onClick={handleClaim}
            disabled={isClaiming || !canClaim}
            className={`w-full focus-ring ${
              canClaim && !isClaiming
                ? 'btn-primary'
                : 'bg-muted text-muted-foreground cursor-not-allowed pointer-events-none'
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
            <div className="text-center text-sm text-muted-foreground">
              <p>You must wait {formatTimeRemaining(timeRemaining)} before claiming again</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 