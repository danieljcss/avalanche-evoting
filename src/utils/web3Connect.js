import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import contractJson from '../artifacts/contracts/Main.sol/Main.json'
import { mainAddress } from './contractAddress'

export function web3Load() {
    const provider = new ethers.providers.JsonRpcProvider('https://api.avax-test.network/ext/bc/C/rpc')
    const mainContract = new ethers.Contract(mainAddress, contractJson.abi, provider)
    return { mainContract: mainContract, provider: provider }
}

export async function web3Connect() {
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