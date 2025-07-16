import './globals.css'
import { Inter } from 'next/font/google'
import { Metadata } from 'next'
import { StarknetProvider } from '@/components/providers/StarknetProvider'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Faucet Starknet',
  description: 'Faucet for Starknet Sepolia',
  keywords: ['Starknet', 'Faucet', 'Sepolia'],
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
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                style: {
                  background: '#22c55e',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </StarknetProvider>
      </body>
    </html>
  )
} 