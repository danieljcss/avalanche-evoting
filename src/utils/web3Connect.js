import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import contractJson from '../artifacts/contracts/Main.sol/Main.json'
import { mainAddress } from '../contractAddress'

export async function web3Connect() {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(mainAddress, contractJson.abi, signer)
    return { contract: contract, provider: provider, account: signer }
}