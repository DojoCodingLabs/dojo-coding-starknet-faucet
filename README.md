# Dojo Coding - Starknet STRK Testnet Faucet

A modern, community-driven faucet for distributing STRK tokens on Starknet Sepolia testnet. Built with the Dojo Coding design system for an exceptional developer experience.

## 🚀 Quick Start

Visit the live faucet at: [Your deployment URL]

## 🎯 Features

- **10 STRK tokens** every 24 hours
- **Modern UI** with Dojo Coding design system
- **Instant claiming** with real-time countdown
- **Wallet integration** via StarknetKit
- **Rate limiting** to prevent abuse
- **Responsive design** for all devices

## 🛠 Deployment Commands

### Declare Contract
```bash
sncast --account account_dale \
declare \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--contract-name Faucet
```

### Deploy Contract
```bash
sncast --account account_dale deploy \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--class-hash [YOUR_CLASS_HASH] \
--arguments '0x05543ed0560ed5e309a590c8f7f9d19453672cc2c917ffa2690f62670c0ffca2,0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d,10000000000000000000_u256,86400_u64'
```
