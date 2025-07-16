sncast --account account_dale \
declare \
--url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 \
--contract-name Faucet

sncast --account account_dale deploy --url https://starknet-sepolia.public.blastapi.io/rpc/v0_8 --class-hash 0x01f17a71b774754d5b566de5098b433e0d14459df826def1feaadd469cc56f82 --arguments '0x05543ed0560ed5e309a590c8f7f9d19453672cc2c917ffa2690f62670c0ffca2,0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D,1000000000000000000_u256,86400_u64'
