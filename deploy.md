# Dojo Coding - Starknet STRK Testnet Faucet Deployment Guide

## Current Contract Status
- **Old Contract**: `0x06ee9dd3a4cc33d35dd172495075f8787b8876eaaa221d664ba8793066b59a12`
- **Target Network**: Starknet Sepolia Testnet
- **Token**: STRK (`0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d`)

## Deployment Parameters
Based on the current configuration, the new contract should be deployed with:

- **Owner Address**: `0x02e8a8551e8120fd8f6b0691dda637b83b86f68e515fbfd6e3f3e2117ee7c95a`
- **Token Address**: `0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d` (STRK)
- **Withdrawal Amount**: `10000000000000000000` (10 STRK)
- **Wait Time**: `86400` (24 hours)

## Deployment Commands

### 1. Declare the Contract
```bash
sncast --account account_dale \
declare \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--contract-name DojoCodingFaucet
```

### 2. Deploy the Contract
```bash
sncast --account dojo_wallet deploy \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--class-hash 0x50b779b88be7bb403ecbcbb5140dc34a6113f5f9b8d6acacf2681e06d098fa8 \
--arguments '0x02e8a8551e8120fd8f6b0691dda637b83b86f68e515fbfd6e3f3e2117ee7c95a,0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d,10000000000000000000_u256,86400_u64'
```

## Post-Deployment Steps

1. **Update Frontend Configuration**
   - Update `FAUCET_CONTRACT_ADDRESS` in `frontend/lib/contract.ts`
   - Test wallet connection and claiming functionality

2. **Fund the Contract**
   - Transfer STRK tokens to the new contract address
   - Recommended initial funding: 1000+ STRK tokens

3. **Update Documentation**
   - Update README with new contract address
   - Update CLAUDE.md with deployment information

## Verification Checklist

- [ ] Contract deployed successfully
- [ ] Contract address updated in frontend
- [ ] Frontend connects to new contract
- [ ] Claiming functionality works
- [ ] Rate limiting enforced (24 hours)
- [ ] Contract funded with STRK tokens
- [ ] Documentation updated