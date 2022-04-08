import React, { Component } from "react"
import { Loader } from "rimble-ui"
import { ethers } from "ethers"
import VotingJson from "../artifacts/contracts/Voting.sol/Voting.json"
import Voting from "../components/voting"
import Candidates from "../components/candidates"
import CreateVoting from "./createVoting"

// ActiveVotings component would fetch and display all the the votings deployed by the contract Main.sol
class ActiveVotings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
    }
  }

  async componentDidMount() {
    await this.loadData()
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.account !== this.props.account) {
      await this.loadData()
    }
  }

  async loadData() {
    // Scroll to bottom of the page
    this.scroll()

    this.setState({ loading: true })

    // votingId maps to total votings created
    let eCount = await this.props.mainInstance.votingId()
    let votings = [], votingDetails = [], votingComponents = []

    // Voting details of every voting created by Main contract
    for (let i = 0; i < eCount; i++) {
      votings[i] = await this.props.mainInstance.Votings(i);
      let VotingContract = new ethers.Contract(votings[i], VotingJson.abi, this.props.provider)

      votingDetails[i] = {}

      // Account address of the voter
      votingDetails[i].account = this.props.account

      // Provider
      votingDetails[i].provider = this.props.provider

      // Each contract's instance
      votingDetails[i].contractInstance = VotingContract

      // Address of each voting contract
      votingDetails[i].votingAddress = votings[i]

      // Boolean indicating wether the contract address has voted or not
      if (this.props.account == null) {
        votingDetails[i].hasVoted = false
      } else {
        votingDetails[i].hasVoted = await VotingContract.voters(this.props.account)
      }

      // Name of the voting
      votingDetails[i].votingName = await VotingContract.name()

      // Description of the voting
      votingDetails[i].votingDescription = await VotingContract.description()

      // Start date of the voting in ms
      votingDetails[i].votingStart = (await VotingContract.start()).toNumber() * 1000

      // End date of the voting in ms
      votingDetails[i].votingEnd = (await VotingContract.end()).toNumber() * 1000

      // Voting id
      votingDetails[i].votingId = i

      // Organising candidates into components
      let candidatesCountBig = await VotingContract.candidatesCount()
      let candidatesCount = candidatesCountBig.toNumber()
      let candidates = [], candidateComponents = []
      candidates[i] = []
      candidateComponents[i] = []

      for (let j = 0; j < candidatesCount; j++) {
        candidates[i].push(await VotingContract.candidates(j))
        candidateComponents[i].push(
          <Candidates
            key={j}
            name={candidates[i][j][1]}
            voteCount={candidates[i][j][2].toNumber()}
          />
        )
      }

      // Saving the votingDetails in the form of a component
      votingComponents[i] = (
        <Voting
          key={i}
          voting={votingDetails[i]}
          candidates={candidates[i]}
          candidateComponent={candidateComponents[i]}
          loadData={this.loadData.bind(this)}
        />
      )
    }
    console.log(this.props.account)
    this.setState({
      data: votingComponents,
      loading: false,
    })
  }

  scroll() {
    const scrollingElement = (document.scrollingElement || document.body)
    scrollingElement.scrollTop = scrollingElement.scrollHeight + 40
  }

  render() {
    return (
      // Simple container to store table with voting data
      <div className="container pb-5">
        <div style={{ display: "flex", float: "right", marginBottom: "10px" }}>
          <img
            className="icons"
            style={{ marginRight: "10px" }}
            alt=""
            onClick={e => this.loadData(e)}
            src="./synchronise.svg"
          />
          <CreateVoting account={this.props.account} mainInstance={this.props.mainInstance} provider={this.props.provider} loadData={this.loadData.bind(this)} />
        </div>

        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th style={{ textAlign: "center", width: "60px" }}>ID</th>
              <th>Voting Name</th>
              <th style={{ textAlign: "center" }}>Candidates</th>
              <th style={{ textAlign: "center" }}>Voting Period</th>
              <th style={{ textAlign: "center" }}>Vote</th>
            </tr>
          </thead>

          <tbody>{this.state.data}</tbody>
        </table>

        <center>{this.state.loading ? <Loader size="40px" /> : <></>}</center>
      </div>
    )
  }
}

export default ActiveVotings