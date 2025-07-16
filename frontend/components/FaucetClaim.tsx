'use client'

import React, { useState, useEffect } from 'react'
import { useStarknet } from '@/components/providers/StarknetProvider'
import { Contract, RpcProvider } from 'starknet'
import { FAUCET_CONTRACT_ADDRESS, FAUCET_ABI, type FaucetInfo } from '@/lib/contract'
import toast from 'react-hot-toast'

export default function FaucetClaim() {
  const { account, address, isConnected } = useStarknet()
  const [faucetInfo, setFaucetInfo] = useState<FaucetInfo | null>(null)
  const [isClaiming, setIsClaiming] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Create provider for read-only operations
  const provider = new RpcProvider({ nodeUrl: "https://starknet-sepolia.public.blastapi.io" })

  const loadFaucetInfo = async () => {
    if (!address) return

    setIsLoading(true)
    try {
      // Use provider for read operations
      const contract = new Contract(FAUCET_ABI, FAUCET_CONTRACT_ADDRESS, provider)
      
      const [tokenAddress, withdrawalAmount, waitTime, faucetBalance, userUnlockTime] = await Promise.all([
        contract.get_token_address(),
        contract.get_withdrawal_amount(),
        contract.get_wait_time(),
        contract.get_amount_faucet(),
        contract.get_user_unlock_time(address)
      ])

      setFaucetInfo({
        tokenAddress: tokenAddress.toString(),
        withdrawalAmount: BigInt(withdrawalAmount.toString()),
        waitTime: BigInt(waitTime.toString()),
        faucetBalance: BigInt(faucetBalance.toString()),
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
    const currentTime = Math.floor(Date.now() / 1000)
    if (faucetInfo.userUnlockTime > 0 && Number(faucetInfo.userUnlockTime) > currentTime) {
      const timeRemaining = Number(faucetInfo.userUnlockTime) - currentTime
      const hours = Math.floor(timeRemaining / 3600)
      const minutes = Math.floor((timeRemaining % 3600) / 60)
      toast.error(`You must wait ${hours}h ${minutes}m before claiming again`)
      return
    }

    // Check if faucet has enough balance
    if (faucetInfo.faucetBalance < faucetInfo.withdrawalAmount) {
      toast.error('Faucet does not have enough balance')
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
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <p className="text-gray-600 text-lg">Connect your wallet to claim tokens</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
        <div className="animate-spin w-8 h-8 mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <p className="text-gray-600">Loading faucet information...</p>
      </div>
    )
  }

  if (!faucetInfo) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center">
        <p className="text-red-600">Failed to load faucet information</p>
        <button 
          onClick={loadFaucetInfo}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Retry
        </button>
      </div>
    )
  }

  const currentTime = Math.floor(Date.now() / 1000)
  const canClaim = faucetInfo.userUnlockTime === BigInt(0) || Number(faucetInfo.userUnlockTime) <= currentTime
  const timeRemaining = canClaim ? 0 : Number(faucetInfo.userUnlockTime) - currentTime

  const formatWei = (wei: bigint) => {
    return (Number(wei) / 10**18).toFixed(4)
  }

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Faucet</h2>
        <p className="text-gray-600">Claim free tokens from the faucet</p>
      </div>
      
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Withdrawal Amount</p>
            <p className="text-lg font-semibold text-gray-900">{formatWei(faucetInfo.withdrawalAmount)} ETH</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Faucet Balance</p>
            <p className="text-lg font-semibold text-gray-900">{formatWei(faucetInfo.faucetBalance)} ETH</p>
          </div>
        </div>

        {!canClaim && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-yellow-800 font-medium">
                Next claim available in: {formatTimeRemaining(timeRemaining)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleClaim}
          disabled={isClaiming || !canClaim || faucetInfo.faucetBalance < faucetInfo.withdrawalAmount}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:hover:scale-100 shadow-lg hover:shadow-xl"
        >
          {isClaiming ? (
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Claiming...</span>
            </div>
          ) : (
            'Claim Tokens'
          )}
        </button>
      </div>
    </div>
  )
} 