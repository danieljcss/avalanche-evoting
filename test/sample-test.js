const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Create Voting", function () {
  it("Should create a new voting with 2 candidates", async function () {
    const Main = await ethers.getContractFactory("Main")
    const mainContract = await Main.deploy()
    await mainContract.deployed()

    expect(await mainContract.votingId()).to.equal(0)

    const block = await ethers.provider.getBlockNumber()
    const time = (await ethers.provider.getBlock(block)).timestamp

    const createVotingTx = await mainContract.createVoting(
      "Voting Test 1",
      "This is a test to deploy a Voting contract",
      time + 3600,
      time + 360000,
      ["Candidate A", "Candidate B"]
    );

    // wait until the transaction is mined
    await createVotingTx.wait();

    expect(await mainContract.votingId()).to.equal(1);
  });
});
