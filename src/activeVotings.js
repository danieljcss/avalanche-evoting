import React, { Component } from "react"
import { Loader } from "rimble-ui"
import { Link } from "react-router-dom"
import { ethers } from "ethers"
import { web3Connect } from "./web3Connect"
import { formatDate } from "./formatDate"
import VotingJson from "./artifacts/contracts/Voting.sol/Voting.json"
import VoteModal from "./voteModal"

// Voting component for organising voting details
class Voting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      time: new Date(),
    }
    this.timer = null
  }

  componentDidMount() {
    this.timer = setInterval(this.setTime.bind(this), 1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  setTime() {
    this.setState({ time: Date.now() })
  }

  votingState() {
    if (this.props.voting.hasVoted) {
      return (
        <font size="2" color="green">
          You have voted!
        </font>
      )
    } else if (this.props.voting.votingStart > this.state.time) {
      return (
        <font size="2">
          Not open yet!
        </font>
      )
    } else if (this.props.voting.votingEnd < this.state.time) {
      return (
        <font className="text-muted" size="2">
          Already closed
        </font>
      )
    } else {
      return (
        <VoteModal voting={this.props.voting} candidates={this.props.candidates} />
      )
    }
  }

  render() {
    return (
      <tr>
        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{this.props.voting.votingId}</td>

        <td>
          {this.props.voting.votingName} <br />
          <font className="text-muted" size="2">
            <b>{this.props.voting.votingDescription}</b>
          </font>
          <br />
          <font className="text-muted" size="2">
            {this.props.voting.votingAddress}
          </font>
        </td>

        <td style={{ textAlign: "center", verticalAlign: "middle" }}>{this.props.candidateComponent}</td>

        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
          <div>
            <font className="text-muted" size="2.5">
              <b>Start: </b>
              {formatDate(this.props.voting.votingStart)}
            </font>
          </div>
          <div>
            <font className="text-muted" size="2.5">
              <b>End: </b>
              {formatDate(this.props.voting.votingEnd)}
            </font>
          </div>
        </td>

        <td style={{ textAlign: "center", verticalAlign: "middle" }}>
          {this.votingState()}
        </td>
      </tr>
    )
  }
}

// Candidate component for organising candidate details of each candidate
class Candidates extends Component {
  render() {
    return (
      <font size="2">
        <b>{this.props.name}</b> ({this.props.voteCount}) <br />
      </font>
    )
  }
}

// ActiveVotings component would fetch and display all the the votings deployed by the contract Main.sol
class ActiveVotings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
      loading: false,
      account: "",
      mainInstance: null,
      provider: null,
      time: 0,
    }
    this.timer = null
  }


  // Connect application with Metamask and create smart-contract's instance
  async init() {
    try {
      const connect = await web3Connect()
      const account = await connect.account.getAddress()
      this.setState({
        account: account,
        mainInstance: connect.contract,
        provider: connect.provider,
      })
    } catch (error) {
      console.log('Wallet connection failed: ', error)
    }

    await this.loadData()
  }

  loader = false;

  componentDidMount() {
    this.init()
  }

  async loadData() {
    this.setState({ loading: true })

    // votingId maps to total votings created
    let eCount = await this.state.mainInstance.votingId()
    let votings = [], votingDetails = [], votingComponents = []

    // Voting details of every voting created by Main contract
    for (let i = 0; i < eCount; i++) {
      votings[i] = await this.state.mainInstance.Votings(i);
      let VotingContract = new ethers.Contract(votings[i], VotingJson.abi, this.state.provider)

      votingDetails[i] = {}

      // Account address of the voter
      votingDetails[i].account = this.state.account

      // Each contract's instance
      votingDetails[i].contractInstance = VotingContract

      // Address of each voting contract
      votingDetails[i].votingAddress = votings[i]

      // Boolean indicating wether the contract address has voted or not
      votingDetails[i].hasVoted = await VotingContract.voters(this.state.account)

      // Name of the voting
      votingDetails[i].votingName = await VotingContract.name()

      // Description of the voting
      votingDetails[i].votingDescription = await VotingContract.description()

      // Start date of the voting
      let bigStart = await VotingContract.start()
      votingDetails[i].votingStart = bigStart.toNumber()


      // End date of the voting
      votingDetails[i].votingEnd = (await VotingContract.end()).toNumber()

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
        />
      )
    }

    this.setState({
      data: votingComponents,
      loading: false,
    })
  }

  render() {
    return (
      // Simple container to store table with voting data
      <div className="container">
        <div style={{ float: "right", marginBottom: "10px" }}>
          <img
            style={{ width: "25px", marginRight: "20px", cursor: "pointer" }}
            alt=""
            onClick={e => this.loadData(e)}
            src="https://img.icons8.com/color/50/000000/synchronize.png"
          />
          <Link to="/createVoting">
            <img
              style={{ width: "25px", cursor: "pointer" }}
              src="https://img.icons8.com/color/48/000000/plus-math.png"
              alt=""
            />
          </Link>
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