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
    await createVotingTx.wait()

    expect(await mainContract.votingId()).to.equal(1)
  })
})

describe("Voting contract tests", async function () {
  let mainContract

  before(async function () {
    const Main = await ethers.getContractFactory("Main")
    mainContract = await Main.deploy()
    await mainContract.deployed()
  })

  it("Should create a new voting with 2 candidates and correct data", async function () {
    const block = await ethers.provider.getBlockNumber()
    const time = (await ethers.provider.getBlock(block)).timestamp

    const createVotingTx = await mainContract.createVoting(
      "Voting Test 1",
      "This is an example of a Voting contract",
      time + 3600,
      time + 360000,
      ["Candidate A", "Candidate B"]
    )

    // wait until the transaction is mined
    await createVotingTx.wait()

    // Getting address of deployed contract
    const votingId = await mainContract.votingId()
    const votingAddress = await mainContract.Votings(votingId - 1)

    // Create instance of Voting contract
    const Voting = await ethers.getContractFactory("Voting")
    const votingContract = Voting.attach(votingAddress)

    // Testing the data that we sent
    expect(await votingContract.name()).to.equal("Voting Test 1")
    expect(await votingContract.description()).to.equal("This is an example of a Voting contract")
    expect(await votingContract.start()).to.equal(time + 3600)
    expect(await votingContract.end()).to.equal(time + 360000)
    expect((await votingContract.candidates(0)).name).to.equal("Candidate A")
    expect((await votingContract.candidates(1)).name).to.equal("Candidate B")

    // Testng that candidates start with 0 votes
    expect((await votingContract.candidates(0)).votesCount).to.equal(0)
    expect((await votingContract.candidates(1)).votesCount).to.equal(0)
  })

  it('Should create a Voting and vote for the first candidate', async function () {

  })
})
