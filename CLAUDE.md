# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **Dojo Coding - Starknet STRK Testnet Faucet**, a modern community-driven application that allows users to claim STRK tokens on Starknet Sepolia testnet. The project consists of:

1. **Smart Contract** (Cairo): A faucet contract with rate limiting and owner controls
2. **Frontend** (Next.js): React-based web interface using Dojo Coding design system for wallet connection and token claiming

## Architecture

### Smart Contract Layer (`/src/lib.cairo`)
- **Language**: Cairo (Starknet's native language)
- **Main Contract**: `DojoCodingFaucet` implementing `IFaucet` interface
- **Key Features**:
  - Rate limiting per user (configurable wait time)
  - Owner-controlled withdrawal amounts and wait times
  - ERC20 token distribution
  - OpenZeppelin Ownable component integration

### Frontend Layer (`/frontend/`)
- **Framework**: Next.js 14 with TypeScript
- **Design System**: Dojo Coding design system with custom CSS variables and components
- **Styling**: TailwindCSS with custom Dojo Coding theme
- **Wallet Integration**: StarknetKit + get-starknet
- **State Management**: React hooks + Context (StarknetProvider)
- **Key Components**:
  - `FaucetClaim.tsx`: Main claiming interface with real-time countdown using Dojo styling
  - `WalletConnection.tsx`: Wallet connection handling with gradient backgrounds
  - `Header.tsx`: Branded header with Dojo Coding logo and navigation
  - `StarknetProvider.tsx`: Global Starknet state management

## Development Commands

### Smart Contract (Cairo)
```bash
# Test Cairo contracts
scarb test

# Build contracts
scarb build
```

### Frontend Development
```bash
# Navigate to frontend directory first
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Key Configuration Files

- **Contract ABI**: `frontend/lib/contract.ts` - Contains contract address and ABI definitions
- **Starknet Provider**: Uses `https://starknet-sepolia.public.blastapi.io` for RPC calls
- **Contract Address**: Currently deployed at `0x0001f07b33f7edb78370900521190fe057672174ec15a29f666f34f5edfc5350`
- **Design System**: `frontend/app/globals.css` - Dojo Coding design tokens and CSS variables
- **Tailwind Config**: `frontend/tailwind.config.js` - Custom color palette and brand colors

## Dojo Coding Design System

The frontend uses a comprehensive design system with:

- **Brand Colors**: Yellow, Coral, Purple, Blue, Green gradients
- **CSS Variables**: All colors defined as HSL values in `:root`
- **Component Classes**: `.btn-primary`, `.card`, `.hero-title`, etc.
- **Typography Scale**: Responsive typography with proper contrast
- **Gradient Backgrounds**: Primary, secondary, accent, and hero gradients
- **Focus Management**: Proper keyboard navigation and accessibility

## Important Implementation Details

### Contract Interaction Pattern
- **Read Operations**: Use RpcProvider for view functions (no wallet required)
- **Write Operations**: Use connected account for state-changing functions
- **Error Handling**: Toast notifications for user feedback

### State Management
- Real-time countdown updates every second
- Immediate local state updates after claiming (optimistic UI)
- Retry mechanism for reloading faucet info after transactions

### Rate Limiting Logic
The contract enforces a wait time between claims:
- Users can claim immediately on first use
- After claiming, they must wait the configured `wait_time` before claiming again
- Frontend shows real-time countdown until next available claim

## Testing Strategy

Smart contracts use Starknet Foundry (`snforge`):
- Test files in `/tests/` directory
- Run with `scarb test` command

Frontend testing would use Next.js built-in testing capabilities (not currently implemented).

## Deployment Notes

### Contract Deployment
Uses `sncast` (Starknet Foundry CLI) for deployment:
- Deploy to Starknet Sepolia testnet
- Constructor requires: owner address, token address, withdrawal amount, wait time
- Example in root README shows deployment command

### Frontend Deployment
Standard Next.js deployment - ensure environment variables are set for production RPC endpoints if different from development.