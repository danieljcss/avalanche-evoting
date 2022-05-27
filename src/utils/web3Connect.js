import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import contractJson from '../artifacts/contracts/Main.sol/Main.json'
import { mainAddress } from './contractAddress'

export async function web3Load() {
    const providerOptions = {}
    const web3Modal = new Web3Modal({
        network: 'fuji',
        cacheProvider: true,
        providerOptions
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(mainAddress, contractJson.abi, signer)
    const account = await signer.getAddress()
    return { contract: contract, provider: provider, account: account }
}

export async function web3Connect() {
    const { ethereum } = window
    let hasRightnetwork;
    if (ethereum !== undefined) {
        if (ethereum.networkVersion == '80001') {
            hasRightnetwork = true
        }
        else hasRightnetwork = false
    } else {
        hasRightnetwork = false
    }
    if (hasRightnetwork) {
        const providerTest = new ethers.providers.Web3Provider(ethereum)
        const accountsTest = await providerTest.listAccounts()

        if (accountsTest.length > 0) {
            return web3Load()
        } else {
            const contract = new ethers.Contract(mainAddress, contractJson.abi, providerTest)

            return { contract: contract, provider: providerTest }
        }
    }

    else {
        const providerRPC = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
        const mainContract = new ethers.Contract(mainAddress, contractJson.abi, providerRPC)
        return { contract: mainContract, provider: providerRPC }
    }
}