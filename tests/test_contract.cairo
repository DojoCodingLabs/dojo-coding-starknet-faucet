use starknet::{ContractAddress, contract_address_const};
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait, start_cheat_caller_address, stop_cheat_caller_address};

// Note: The dispatcher will be generated automatically by the interface
use dojo_coding_faucet::{IFaucetDispatcher, IFaucetDispatcherTrait};

fn deploy_faucet(
    owner: ContractAddress,
    token_address: ContractAddress, 
    withdrawal_amount: u256,
    wait_time: u64
) -> ContractAddress {
    let contract = declare("DojoCodingFaucet").unwrap().contract_class();
    let constructor_calldata = array![
        owner.into(),
        token_address.into(),
        withdrawal_amount.low.into(),
        withdrawal_amount.high.into(),
        wait_time.into()
    ];
    let (contract_address, _) = contract.deploy(@constructor_calldata).unwrap();
    contract_address
}

#[test]
fn test_deployment() {
    let owner = contract_address_const::<'owner'>();
    let token_address = contract_address_const::<'token'>();
    let withdrawal_amount = 1000_u256;
    let wait_time = 86400_u64; // 24 hours

    let faucet_address = deploy_faucet(owner, token_address, withdrawal_amount, wait_time);
    let dispatcher = IFaucetDispatcher { contract_address: faucet_address };

    // Test getters
    assert(dispatcher.get_token_address() == token_address, 'Wrong token address');
    assert(dispatcher.get_withdrawal_amount() == withdrawal_amount, 'Wrong withdrawal amount');
    assert(dispatcher.get_wait_time() == wait_time, 'Wrong wait time');
}

#[test]
fn test_set_withdrawal_amount() {
    let owner = contract_address_const::<'owner'>();
    let token_address = contract_address_const::<'token'>();
    let withdrawal_amount = 1000_u256;
    let wait_time = 86400_u64;

    let faucet_address = deploy_faucet(owner, token_address, withdrawal_amount, wait_time);
    let dispatcher = IFaucetDispatcher { contract_address: faucet_address };

    // Test setting withdrawal amount as owner
    start_cheat_caller_address(faucet_address, owner);
    let new_amount = 2000_u256;
    dispatcher.set_withdrawal_amount(new_amount);
    stop_cheat_caller_address(faucet_address);

    assert(dispatcher.get_withdrawal_amount() == new_amount, 'Amount not updated');
}

#[test]
fn test_user_unlock_time_initial() {
    let owner = contract_address_const::<'owner'>();
    let token_address = contract_address_const::<'token'>();
    let withdrawal_amount = 1000_u256;
    let wait_time = 86400_u64;

    let faucet_address = deploy_faucet(owner, token_address, withdrawal_amount, wait_time);
    let dispatcher = IFaucetDispatcher { contract_address: faucet_address };

    let user = contract_address_const::<'user'>();
    
    // User should have no unlock time initially (0)
    assert(dispatcher.get_user_unlock_time(user) == 0, 'Should be 0 initially');
}
