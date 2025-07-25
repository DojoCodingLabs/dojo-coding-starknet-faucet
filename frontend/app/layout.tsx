import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { StarknetProvider } from '@/components/providers/StarknetProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dojo Coding - Starknet STRK Testnet Faucet',
  description: 'Get free STRK tokens for Starknet Sepolia testnet development. Built by Dojo Coding for the developer community.',
  keywords: ['Dojo Coding', 'Starknet', 'STRK', 'Faucet', 'Sepolia', 'Testnet', 'Blockchain', 'Cairo'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StarknetProvider>
          <div className="min-h-screen">
            {children}
          </div>
          <Toaster 
            position="top-right"
            containerStyle={{
              top: 20,
              right: 20,
            }}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                maxWidth: '300px',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
            }}
            gutter={8}
          />
        </StarknetProvider>
      </body>
    </html>
  )
} 