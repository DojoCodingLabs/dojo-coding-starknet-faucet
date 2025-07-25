// Faucet Contract Configuration
export const FAUCET_CONTRACT_ADDRESS = "0x0001f07b33f7edb78370900521190fe057672174ec15a29f666f34f5edfc5350";

// ABI for the Faucet contract based on the IFaucet interface
export const FAUCET_ABI = [
  {
    type: "interface",
    name: "IFaucet",
    items: [
      {
        type: "function",
        name: "faucet_mint",
        inputs: [],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "withdraw_all_balance",
        inputs: [
          { name: "user", type: "core::starknet::contract_address::ContractAddress" }
        ],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "get_user_unlock_time",
        inputs: [
          { name: "user", type: "core::starknet::contract_address::ContractAddress" }
        ],
        outputs: [{ type: "core::integer::u64" }],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "get_amount_faucet",
        inputs: [],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "get_token_address",
        inputs: [],
        outputs: [{ type: "core::starknet::contract_address::ContractAddress" }],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "get_withdrawal_amount",
        inputs: [],
        outputs: [{ type: "core::integer::u256" }],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "get_wait_time",
        inputs: [],
        outputs: [{ type: "core::integer::u64" }],
        state_mutability: "view"
      },
      {
        type: "function",
        name: "set_withdrawal_amount",
        inputs: [
          { name: "amount", type: "core::integer::u256" }
        ],
        outputs: [],
        state_mutability: "external"
      },
      {
        type: "function",
        name: "set_wait_time",
        inputs: [
          { name: "wait_time", type: "core::integer::u64" }
        ],
        outputs: [],
        state_mutability: "external"
      }
    ]
  },
  {
    type: "constructor",
    name: "constructor",
    inputs: [
      { name: "owner", type: "core::starknet::contract_address::ContractAddress" },
      { name: "token_address", type: "core::starknet::contract_address::ContractAddress" },
      { name: "withdrawal_amount", type: "core::integer::u256" },
      { name: "wait_time", type: "core::integer::u64" }
    ]
  }
] as const;

// Common token addresses on Sepolia for testing
export const COMMON_TOKENS = {
  ETH: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
  STRK: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
  USDC: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8"
};

export type FaucetInfo = {
  tokenAddress: string;
  withdrawalAmount: bigint;
  waitTime: bigint;
  faucetBalance: bigint;
  userUnlockTime: bigint;
}; 