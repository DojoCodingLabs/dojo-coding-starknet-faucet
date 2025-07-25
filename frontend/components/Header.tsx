'use client'

import React from 'react'
import Image from 'next/image'

export default function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="container-dojo py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-md" style={{background: 'var(--gradient-primary)'}}>
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <div className="text-spacing">
                <h1 className="card-title gradient-text">Dojo Coding</h1>
                <p className="text-sm text-muted-foreground">Starknet STRK Testnet Faucet</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="badge-primary">
              🔗 Sepolia Testnet
            </span>
          </div>
        </div>
      </div>
    </header>
  )
} 