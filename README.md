# Voting DApp Avalanche

In this project we create a simple voting DApp and we deploy it on the Avalanche Fuji testnetwork.

## Installation

To install the required dependencies run

```bash
npm install
```

## Deployment

To deploy the smart contracts to the Fuji network, first create a .env file with the mnemonic key of your Avalanche account

```
PRIVATE_KEY="<your mnemonic key here>"
```

Then, we deploy our contracts using Hardhat

```bash
npx hardhat run scripts/deploy.js --network fuji
```

To start the DApp on a local server, run

```bash
npm start
```

## Technologies used:

- Solidity: creation of smart contracts
- React: Frontend
- Hardhat: Deployment
- Bootstrap: CSS Styling
