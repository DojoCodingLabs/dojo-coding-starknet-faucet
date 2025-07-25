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
              <Image 
                src="/dojo-logo.png" 
                alt="Dojo Logo" 
                width={48} 
                height={48}
                className="rounded-lg shadow-md"
              />
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