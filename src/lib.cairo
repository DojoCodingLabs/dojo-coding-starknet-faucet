use starknet::ContractAddress;

#[starknet::interface]
pub trait IFaucet<TContractState> {
    fn faucet_mint(ref self: TContractState);
    fn withdraw_all_balance(ref self: TContractState, user: ContractAddress);
    fn get_user_unlock_time(self: @TContractState, user: ContractAddress) -> u64;
    fn get_amount_faucet(self: @TContractState) -> u256;
    fn get_token_address(self: @TContractState) -> ContractAddress;
    fn get_withdrawal_amount(self: @TContractState) -> u256;
    fn get_wait_time(self: @TContractState) -> u64;
    fn set_withdrawal_amount(ref self: TContractState, amount: u256);
    fn set_wait_time(ref self: TContractState, wait_time: u64);
}

#[starknet::contract]
mod DojoCodingFaucet {
    use super::IFaucet;
    use starknet::{
        ContractAddress, get_block_timestamp, get_caller_address, get_contract_address,
        storage::{Map, StoragePointerReadAccess, StoragePointerWriteAccess, StorageMapReadAccess, StorageMapWriteAccess}
    };
    use openzeppelin::access::ownable::{OwnableComponent, OwnableComponent::InternalTrait};
    use openzeppelin::token::erc20::interface::{IERC20Dispatcher, IERC20DispatcherTrait};

    component!(path: OwnableComponent, storage: ownable, event: OwnableEvent);

    #[abi(embed_v0)]
    impl OwnableImpl = OwnableComponent::OwnableImpl<ContractState>;
    impl OwnableInternalImpl = OwnableComponent::InternalImpl<ContractState>;

    #[storage]
    struct Storage {
        user_unlock_time: Map<ContractAddress, u64>,
        token_address: ContractAddress,
        withdrawal_amount: u256,
        wait_time: u64,
        #[substorage(v0)]
        ownable: OwnableComponent::Storage
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        OwnableEvent: OwnableComponent::Event
    }

    #[constructor]
    fn constructor(
        ref self: ContractState,
        owner: ContractAddress,
        token_address: ContractAddress,
        withdrawal_amount: u256,
        wait_time: u64
    ) {
        self.ownable.initializer(owner);
        self.token_address.write(token_address);
        self.withdrawal_amount.write(withdrawal_amount);
        self.wait_time.write(wait_time);
    }

    #[abi(embed_v0)]
    impl FaucetImpl of IFaucet<ContractState> {
        fn faucet_mint(ref self: ContractState) {
            let withdrawal_amount = self.withdrawal_amount.read();
            assert(self.get_amount_faucet() > withdrawal_amount, 'There is not enough balance');
            let caller_address = get_caller_address();
            assert(self.allowed_to_withdraw(caller_address), 'Not allowed to withdraw');
            self
                .user_unlock_time
                .write(caller_address, get_block_timestamp() + self.wait_time.read());
            IERC20Dispatcher { contract_address: self.token_address.read() }
                .transfer(caller_address, withdrawal_amount);
        }

        fn withdraw_all_balance(ref self: ContractState, user: ContractAddress) {
            self.ownable.assert_only_owner();
            let balance = self.get_amount_faucet();
            IERC20Dispatcher { contract_address: self.token_address.read() }
                .transfer(user, balance);
        }

        fn get_amount_faucet(self: @ContractState) -> u256 {
            IERC20Dispatcher { contract_address: self.token_address.read() }
                .balance_of(get_contract_address())
        }

        fn get_user_unlock_time(self: @ContractState, user: ContractAddress) -> u64 {
            self.user_unlock_time.read(user)
        }

        fn get_token_address(self: @ContractState) -> ContractAddress {
            self.token_address.read()
        }

        fn get_withdrawal_amount(self: @ContractState) -> u256 {
            self.withdrawal_amount.read()
        }

        fn get_wait_time(self: @ContractState) -> u64 {
            self.wait_time.read()
        }

        fn set_withdrawal_amount(ref self: ContractState, amount: u256) {
            self.ownable.assert_only_owner();
            self.withdrawal_amount.write(amount);
        }

        fn set_wait_time(ref self: ContractState, wait_time: u64) {
            self.ownable.assert_only_owner();
            self.wait_time.write(wait_time);
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalHelperTrait {
        fn allowed_to_withdraw(self: @ContractState, user: ContractAddress) -> bool {
            let unlock_time = self.user_unlock_time.read(user);
            if unlock_time == 0 {
                return true;
            }
            let timestamp = get_block_timestamp();
            if unlock_time < timestamp {
                true
            } else {
                false
            }
        }
    }
}