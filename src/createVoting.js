import React, { Component } from "react";
import { web3Connect } from "./web3Connect"

class CreateVoting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      votingname: "",
      description: "",
      date: "",
      start: "",
      end: "",
      ncandidates: 2,
      candidates: [],
      account: "",
      mainInstance: null,
      provider: null
    }
  }

  // Connect application to Metamask and create instance of smart contract
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
  }

  componentDidMount() {
    this.init()
    this.setFormattedDates()
  }

  onChangeVotingName(e) {
    this.setState({
      votingname: e.target.value,
    })
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value,
    })
  }

  onChangeStart(e) {
    this.setState({
      start: e.target.value,
      end: e.target.value,
    })
  }

  onChangeEnd(e) {
    this.setState({
      end: e.target.value,
    })
  }

  onChangeCandidate(e, n) {
    let candidatesList = this.state.candidates
    candidatesList[n - 1] = e.target.value
    this.setState({
      candidates: candidatesList,
    })
  }

  setFormattedDates() {
    const date = new Date()
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset * 60 * 1000))
    const formattedDate = localDate.toISOString().split(".")[0].slice(0, -3)
    this.setState({
      date: formattedDate,
      start: formattedDate,
      end: formattedDate,
    })
  }

  // Function to be called when the form is submitted
  async onSubmit(e) {
    e.preventDefault()

    // Structuring voting details from the form before submitting transaction to the smart-contract
    const votingDetails = {
      votingname: this.state.votingname,
      description: this.state.description,
      start: Date.parse(this.state.start),
      end: Date.parse(this.state.end),
      candidates: this.state.candidates,
    }

    // Making transaction to the Main contract instance, for creating a new voting
    await this.state.mainInstance.createVoting(
      votingDetails.votingname,
      votingDetails.description,
      votingDetails.start,
      votingDetails.end,
      votingDetails.candidates,
      { from: this.state.account }
    )

    window.location = "/active";
  }

  render() {
    return (
      <div className="container card">
        <h3>Create New Voting</h3>
        <div>{this.state.votingname}</div>

        {/* New Voting Form */}
        <form onSubmit={e => this.onSubmit(e)}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Enter voting name"
              onChange={e => this.onChangeVotingName(e)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              type="text"
              required
              className="form-control"
              placeholder="Describe your Voting here"
              onChange={e => this.onChangeDescription(e)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Start date</label>
            <input
              type="datetime-local"
              required
              className="form-control date"
              min={this.state.date}
              value={this.state.start}
              onChange={e => this.onChangeStart(e)}
            ></input>
          </div>

          <div className="form-group">
            <label>End date</label>
            <input
              type="datetime-local"
              required
              className="form-control date"
              min={this.state.start}
              value={this.state.end}
              onChange={e => this.onChangeEnd(e)}
            ></input>
          </div>

          <div id="1" className="form-group">
            <label>Candidate 1</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Candidate Name"
              onChange={e => this.onChangeCandidate(e, 1)}
            />

            <br />
            <label>Candidate 2</label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="Candidate Name"
              onChange={e => this.onChangeCandidate(e, 2)}
            />
          </div>

          <br />

          <div>
            <button
              className="btn btn-danger grid-item"
              style={{ width: 100 }}
              type="submit"
            >
              Submit
            </button>
          </div>

          <br />
        </form>
      </div>
    )
  }
}

export default CreateVoting