import { Cell, beginCell, WalletContractV4, toNano } from 'ton'
import { ContractSystem, ContractExecutor, testAddress, testExternalAddress, testKey } from 'ton-emulator'
import { compileFunc } from "@ton-community/func-js"
import { readFileSync } from "fs"
import { expect } from 'chai'

const createMainSC = async (system, treasure) => {
    const targets = {
        'stdlib.fc': 'contract/stdlib.fc',
        'opcodes.fc': 'contract/opcodes.fc',
        'main.fc': 'contract/main.fc'
    }
    const compilationResult = await compileFunc({
        targets: Object.keys(targets),
        sources: Object.keys(targets).reduce((a, v) => ({ ...a, [v]: readFileSync(targets[v]).toString()}), {})
    })
    if (compilationResult.status === 'error') throw new Error(compilationResult.message)

    const code = Cell.fromBoc(Buffer.from(compilationResult.codeBoc, 'base64'))[0]
    const data = beginCell().endCell()
    const contract = await ContractExecutor.create({ code, data, workchain: 0, balance: '0' }, system)

    await treasure.send({
        sendMode: 0,
        to: contract.address,
        value: toNano(10),
        init: { code, data },
        body: beginCell().endCell(),
        bounce: false
    })
    await system.run()
    return contract
}

const createSkipSC = async (system, treasure) => {
    const targets = {
        'stdlib.fc': 'contract/stdlib.fc',
        'opcodes.fc': 'contract/opcodes.fc',
        'skip.fc': 'contract/skip.fc'
    }
    const compilationResult = await compileFunc({
        targets: Object.keys(targets),
        sources: Object.keys(targets).reduce((a, v) => ({ ...a, [v]: readFileSync(targets[v]).toString()}), {})
    })
    if (compilationResult.status === 'error') throw new Error(compilationResult.message)

    const code = Cell.fromBoc(Buffer.from(compilationResult.codeBoc, 'base64'))[0]
    const data = beginCell().endCell()
    const contract = await ContractExecutor.create({ code, data, workchain: -1, balance: '0' }, system)

    await treasure.send({
        sendMode: 0,
        to: contract.address,
        value: toNano(10),
        init: { code, data },
        body: beginCell().endCell(),
        bounce: false
    })
    await system.run()
    return contract
}

const getBalance = async (system, contract) => {
    return (await system.provider(contract).getState()).balance
}

describe('TON Random', () => {
    var system, skip, main, treasure

    before(async () => {
        system = await ContractSystem.create()
        treasure = await system.treasure('treasure')
        skip = await createSkipSC(system, treasure)
        main = await createMainSC(system, treasure)
    })

    it('should generate number successfully', async () => {
        await treasure.send({
            sendMode: 0,
            to: skip.address,
            value: toNano(123),
            body: beginCell().storeUint(0x630dd32b, 32).storeUint(123, 10).endCell(),
            bounce: true
        })

        let txs = await system.run()
        console.log(txs)
    })
})