require("dotenv").config()
require("@nomiclabs/hardhat-waffle")

const PRIVATE_KEY = process.env.PRIVATE_KEY

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    fuji: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: [PRIVATE_KEY],
      gas: 7990000,
      gasPrice: 1050000000000,
    }
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    artifacts: "./src/artifacts"
  }
}