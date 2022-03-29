# Voting DApp Avalanche

In this project we create a simple voting DApp and we deploy it on the Avalanche Fuji testnetwork.

## Installation

To install the required dependencies run

```bash
npm install
```

We use Hardhat to deploy and test. Since it is not a dependency on the project you can install it by using

```bash
npm install -D hardhat
```

## Deployment

To deploy the smart contracts to the Fuji network, first create a .env file with the mnemonic key of your Avalanche account

```
PRIVATE_KEY="<your private key here>"
```

Then, we deploy our contracts using Hardhat

```bash
npx hardhat run scripts/deploy.js --network fuji
```

To start the DApp on a local server, run

```bash
npm start
```

## Testing

To run the tests in the `test` folder, you can run

```bash
npx hardhat test
```

## Technologies used:

- Solidity: creation of smart contracts
- React: Frontend Javascript components
- Rumble: Some UI Components
- Hardhat + Ethers + Chai: Deployment and Testing
- Bootstrap: CSS Styling
