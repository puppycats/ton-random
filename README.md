# TON Random

## Description

Generating random numbers on-chain is a common task for many different projects. But generating them by simply calling `randomize_lt()` and `random()` is a bad idea, as was seen in the [TON Hack Challenge](https://ton.org/docs/develop/smart-contracts/security/ton-hack-challenge-1#4-lottery) example.

This repository contain two contracts that will help you in generating random numbers on-chain.

 * `main.fc` — contract that accepts queries (check `contract/scheme.tlb`) and responding with generated random numbers.
 * `skip.fc` — contract that must be deployed in Masterchain (or some other workchain, different from the one where `main.fc` is deployed). It is just a basic echo contract which sends back the same message. It is used to skip at least 1 block and guarantee that random is unpredictable.

## Sources

 * Contract sources (func): `contract/`
 * Tests (js): `test/`

## Usage

`contract/skip.fc` contract is deployed in Masterchain (wc -1) at address:
 * `Ef-qj8_G2KbB7tP-0moAvD38axjALxVCqc73YNpGZH7Uh7aG`

`contract/main.fc` contract is deployed in Basechain (wc 0) at address:
 * `EQCvDqsdX4_WHsN352c29vgWz45y8OqC1pkz8S0cbMiG1Q7s`

To generate random number, simply send a query internal message to the `main` contract and handle response internal message.
Check `contract/scheme.tlb` for exact scheme.

## Testing

Tests are written in JS using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) libraries. Interactions with contracts are done with [ton-emulator](https://github.com/ton-community/ton-emulator).

You can run tests with this command inside the project directory:

`npm test`