# TON Random

## Description

Generating random numbers on-chain is a common task for many different projects. But generating them by simply calling `randomize_lt()` and `random()` is a bad idea, as was seen in the [TON Hack Challenge](https://ton.org/docs/develop/smart-contracts/security/ton-hack-challenge-1#4-lottery) example.

This repository contain two contracts that will help you in generating random numbers on-chain.

 * `main.fc` — contract that accepts queries (check `contract/scheme.tlb`) and responds with random numbers.
 * `skip.fc` — contract that must be deployed in Masterchain (or some other workchain, different from the one where `main.fc` is deployed). It is just a basic echo contract. It is used to skip at least 1 block and guarantee that random is unpredictable.

## Sources

 * Contract sources (func): `contract/`
 * Tests (js): `test/`

## Usage

`contract/skip.fc` contract is deployed in Masterchain (wc -1) at address:
 * `Ef8Nb7157K5bVxNKAvIWreRcF0RcUlzcCA7lwmewWVNtqM3s`

`contract/main.fc` contract is deployed in Basechain (wc 0) at address:
 * `EQB_tX9bf-CwCtfan3LaRik_K2MH0J60XRZtd0p_x3d6lW96`

To generate random number, simply send a query internal message to the `main` contract and handle response internal message.
Check `contract/scheme.tlb` for exact scheme.

## Testing

Tests are written in JS using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) libraries. Interactions with contracts are done with [ton-emulator](https://github.com/ton-community/ton-emulator).

You can run tests with this command inside the project directory:

`npm test`
