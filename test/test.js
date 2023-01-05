import { Cell, beginCell, WalletContractV4 } from 'ton'
import { ContractSystem, ContractExecutor, testAddress, testExternalAddress, testKey } from 'ton-emulator'
import { compileFunc } from "@ton-community/func-js"
import { readFileSync } from "fs"
import { should } from 'chai'

const createMainSC = async (system) => {
    const targets = {
        'stdlib.fc': 'contract/stdlib.fc',
        'main.fc': 'contract/main.fc'
    }
    const compilationResult = await compileFunc({
        targets: Object.keys(targets),
        sources: Object.keys(targets).reduce((a, v) => ({ ...a, [v]: readFileSync(targets[v]).toString()}), {})
    })
    if (compilationResult.status === 'error') throw new Error(compilationResult.message)

    const code = Cell.fromBoc(Buffer.from(compilationResult.codeBoc, 'base64'))[0]
    const data = beginCell().endCell()

    return ContractExecutor.create({ code, data, balance: '100000000000' }, system)
}

const createSkipSC = async (system) => {
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

    return ContractExecutor.create({ code, data, workchain: -1, balance: '1000000000' }, system)
}

describe('TON Random', () => {
    var system, skip, main, treasure

    before(async () => {
        system = await ContractSystem.create()
        treasure = await system.treasure('my-treasure')
        skip = await createSkipSC(system)
        main = await createMainSC(system)
    })

    it('should compile', async () => {

    })
})