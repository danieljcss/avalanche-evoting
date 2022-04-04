const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Main contract tests", async function () {
  let Main
  let mainContract
  before(async function () {
    Main = await ethers.getContractFactory("Main")
  })

  it("Should deploy the main contract", async function () {
    mainContract = await Main.deploy()
    await mainContract.deployed()
  })

  it("Should start with 0 deployed votings", async function () {
    expect(await mainContract.votingId()).to.equal(0)
  })

  it("Should create a new voting with 2 candidates and increase votingId", async function () {

    const block = await ethers.provider.getBlockNumber()
    const time = (await ethers.provider.getBlock(block)).timestamp

    const createVotingTx = await mainContract.createVoting(
      "Voting Test 1",
      "This is a test to deploy a Voting contract",
      time + 3600,
      time + 360000,
      ["Candidate A", "Candidate B"]
    )

    // wait until the transaction is mined
    await createVotingTx.wait();

    expect(await mainContract.votingId()).to.equal(1);
  })
})
