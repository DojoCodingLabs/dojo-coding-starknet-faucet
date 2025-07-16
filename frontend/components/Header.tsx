'use client'

import React from 'react'

export default function Header() {
  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Faucet</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium rounded-xl border border-white/20">
              🔗 Sepolia Testnet
            </span>
          </div>
        </div>
      </div>
    </header>
  )
} 