# TON Random

## Description

TODO

## Sources

 * Contract sources (func): `contract/`
 * Tests (js): `test/`

## Usage

`contract/skip.fc` contract is deployed in Masterchain (wc -1) at address:
 * `TODO`

`contract/main.fc` contract is deployed in Basechain (wc 0) at address:
 * `TODO`

To generate random number, simply send a query internal message to the `main` contract and handle response internal message.
Minimal example:

```func
TODO
```

## Testing

Tests are written in JS using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/) libraries. Interactions with contracts are done with [ton-emulator](https://github.com/ton-community/ton-emulator).

You can run tests with this command inside the project directory:

`npm test`