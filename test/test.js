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

const parseResponse = (response) => {
    let s = response.beginParse()
    const op = s.loadUint(32)
    const result = s.loadUint(256)
    const body = s.loadRef()
    expect(op).to.be.equal(0xf8bb96e8)
    return { result, body }
}

const generateNumber = async (system, wallet, contract, value, body) => {
    await wallet.send({
        sendMode: 0,
        to: contract.address,
        value: toNano(value),
        body: beginCell().storeUint(0x630dd32b, 32).storeSlice(body).endCell(),
        bounce: true
    })

    let txs = await system.run()
    expect(txs).to.have.lengthOf(5)
    const resTx = txs[4].inMessage
    expect(resTx.info.src.toRawString()).to.be.equal(contract.address.toRawString())
    expect(resTx.info.dest.toRawString()).to.be.equal(wallet.address.toRawString())
    expect(parseInt(toNano(value) - resTx.info.value.coins)).to.be.lte(100000000)
    const res = parseResponse(resTx.body)
    expect(res.body.hash().toString()).to.be.equal(beginCell().storeSlice(body).endCell().hash().toString())

    return res.result
}

describe('TON Random', () => {
    var system, skip, main, treasure

    before(async () => {
        system = await ContractSystem.create()
        treasure = await system.treasure('treasure')
        skip = await createSkipSC(system, treasure)
        main = await createMainSC(system, treasure)
    })

    it('should generate numbers successfully', async () => {
        for (let i = 0; i < 10; i += 1) {
            await generateNumber(system, treasure, main, 1, beginCell().endCell().beginParse())
        }
    })
})