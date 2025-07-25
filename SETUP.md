# Dojo Coding - Starknet STRK Testnet Faucet Setup Guide

This document provides complete setup instructions for deploying and running the Dojo Coding Starknet STRK Testnet Faucet.

## 📋 Prerequisites

### Required Software
- **Node.js 18+** - For frontend development
- **Scarb** - Cairo package manager and build tool
- **Starknet Foundry** - For contract deployment (`sncast`)
- **Git** - Version control

### Required Accounts
- **Starknet Wallet** - For contract deployment (Argent X or Braavos)
- **Sepolia Testnet Account** - With sufficient ETH for gas fees
- **STRK Tokens** - For funding the faucet contract

## 🚀 Installation Steps

### 1. Clone the Repository
```bash
git clone <repository-url>
cd dojo-coding-starknet-faucet
```

### 2. Install Dependencies

#### Smart Contract Dependencies
```bash
# Install Scarb (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://docs.swmansion.com/scarb/install.sh | sh

# Install Starknet Foundry (if not already installed)
curl -L https://raw.githubusercontent.com/foundry-rs/starknet-foundry/master/scripts/install.sh | sh

# Build the contract
scarb build
```

#### Frontend Dependencies
```bash
cd frontend
npm install
```

### 3. Environment Configuration

#### Configure Starknet Account
```bash
# Add your account to sncast (replace with your account details)
sncast account add --name account_dale \
  --address 0x05543ed0560ed5e309a590c8f7f9d19453672cc2c917ffa2690f62670c0ffca2 \
  --private_key YOUR_PRIVATE_KEY
```

#### Frontend Environment Variables (Optional)
Create `.env.local` in the `frontend` directory if you need custom RPC endpoints:
```env
NEXT_PUBLIC_RPC_URL=https://starknet-sepolia.public.blastapi.io
```

## 🔧 Contract Deployment

### Step 1: Declare the Contract
```bash
sncast --account account_dale \
declare \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--contract-name Faucet
```

**Save the class hash** from the output - you'll need it for deployment.

### Step 2: Deploy the Contract
```bash
sncast --account account_dale deploy \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--class-hash YOUR_CLASS_HASH_HERE \
--arguments '0x05543ed0560ed5e309a590c8f7f9d19453672cc2c917ffa2690f62670c0ffca2,0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d,10000000000000000000_u256,86400_u64'
```

**Parameters Explanation:**
- `0x05543...` - Owner address (your wallet)
- `0x04718...` - STRK token contract address on Sepolia
- `10000000000000000000_u256` - Withdrawal amount (10 STRK)
- `86400_u64` - Wait time between claims (24 hours)

**Save the contract address** from the deployment output.

### Step 3: Update Frontend Configuration
Edit `frontend/lib/contract.ts`:
```typescript
export const FAUCET_CONTRACT_ADDRESS = "YOUR_NEW_CONTRACT_ADDRESS";
```

## 💰 Fund the Contract

Transfer STRK tokens to your newly deployed contract address:

```bash
# Using starknet CLI or through your wallet
# Recommended: Transfer 1000+ STRK for initial funding
```

You can also use the `withdraw_all_balance` function later if needed to manage funds.

## 🖥️ Frontend Development

### Start Development Server
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to see the faucet interface.

### Build for Production
```bash
cd frontend
npm run build
npm start
```

## 🧪 Testing the Setup

### 1. Verify Contract Deployment
```bash
# Check contract exists and has correct owner
sncast call \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--contract-address YOUR_CONTRACT_ADDRESS \
--function get_withdrawal_amount
```

### 2. Test Frontend Integration
1. Open `http://localhost:3000`
2. Connect your Starknet wallet
3. Verify the interface loads faucet information
4. Test claiming functionality (if contract is funded)

### 3. Verify Rate Limiting
1. Claim tokens once
2. Try claiming again immediately - should show countdown
3. Wait for countdown to complete - should allow claiming again

## 🎨 Design System

The faucet uses the Dojo Coding design system with:

### Brand Colors
- **Dojo Yellow**: `hsl(52 100% 76%)`
- **Dojo Coral**: `hsl(10 100% 76%)`
- **Dojo Purple**: `hsl(281 100% 75%)`
- **Dojo Blue**: `hsl(190 89% 78%)`
- **Dojo Green**: `hsl(145 100% 85%)`

### Key CSS Classes
- `.btn-primary` - Primary button with gradient background
- `.card` - Main card component
- `.hero-title` - Large heading text
- `.gradient-text` - Text with gradient effect

## 🔍 Troubleshooting

### Common Issues

#### Contract Deployment Fails
- **Check account balance**: Ensure sufficient ETH for gas
- **Verify RPC URL**: Ensure using correct Sepolia endpoint
- **Check account setup**: Verify `sncast account` is configured correctly

#### Frontend Won't Connect
- **Check contract address**: Verify correct address in `contract.ts`
- **Check wallet**: Ensure wallet is connected to Sepolia testnet
- **Check RPC endpoint**: Verify frontend is using correct RPC URL

#### Claims Don't Work
- **Check contract funding**: Verify contract has STRK token balance
- **Check rate limiting**: User may still be in cooldown period
- **Check wallet connection**: Ensure wallet is properly connected

### Debug Commands

```bash
# Check contract balance
sncast call \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--contract-address YOUR_CONTRACT_ADDRESS \
--function get_amount_faucet

# Check user unlock time
sncast call \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--contract-address YOUR_CONTRACT_ADDRESS \
--function get_user_unlock_time \
--arguments YOUR_WALLET_ADDRESS
```

## 📚 Additional Resources

- [Starknet Documentation](https://docs.starknet.io/)
- [Scarb Documentation](https://docs.swmansion.com/scarb/)
- [Starknet Foundry Documentation](https://foundry-rs.github.io/starknet-foundry/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Dojo Coding Design System](./CLAUDE.md#dojo-coding-design-system)

## 🔐 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Rate Limiting**: Contract enforces 24-hour cooldown between claims
- **Owner Functions**: Only contract owner can withdraw funds or change parameters
- **Input Validation**: All user inputs are validated on both frontend and contract

## 🚀 Deployment Checklist

- [ ] Contract compiled successfully (`scarb build`)
- [ ] Contract declared on Sepolia testnet
- [ ] Contract deployed with correct parameters
- [ ] Contract address updated in frontend
- [ ] Contract funded with STRK tokens
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Wallet connection works in frontend
- [ ] Claiming functionality tested
- [ ] Rate limiting verified
- [ ] Documentation updated with new contract address

## 📞 Support

For issues or questions:
1. Check this setup guide
2. Review the [CLAUDE.md](./CLAUDE.md) file for technical details
3. Check contract deployment logs
4. Verify frontend console for errors

---

**Built with ❤️ by the Dojo Coding community**