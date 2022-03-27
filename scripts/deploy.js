const hre = require("hardhat");
const fs = require('fs');

async function main() {
  const Main = await hre.ethers.getContractFactory("Main")

  const mainContract = await Main.deploy()
  await mainContract.deployed()
  console.log("Main contract deployed to:", mainContract.address);

  fs.writeFileSync('./src/contractAddress.js', `
  export const mainAddress = "${mainContract.address}" \n
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });