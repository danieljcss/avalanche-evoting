import React, { Component } from "react";
import { web3Connect } from "./web3Connect"
import { Card, Form, Field, Input, Button, Textarea } from 'rimble-ui'

class Candidate extends Component {
  render() {
    return (
      <Field label={`Candidate ${this.props.number}`} className="field-new-voting">
        <Input
          type="text"
          required
          placeholder="Candidate Name"
          onChange={e => this.props.change(e, this.props.number)}
          className="input-new-voting"
        />
      </Field>
    )
  }
}

class CreateVoting extends Component {
  constructor(props) {
    super(props)

    this.state = {
      votingname: "",
      description: "",
      date: "1970-01-01",
      start: "1970-01-01",
      end: "1970-01-01",
      ncandidates: 0,
      candidates: [],
      candidatesComponents: [],
      account: "",
      mainInstance: null,
      provider: null
    }

    this.timer = null
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
    this.setInitialCandidates()
    this.timer = setInterval(() => this.setFormattedDates(), 1000)
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
    })
    if (Date.parse(this.state.end) <= Date.parse(e.target.value)) {
      this.setState({
        end: e.target.value,
      })
    }
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

  setInitialCandidates() {
    this.setState({
      ncandidates: 2,
      candidatesComponents: [
        <Candidate key={1} number={1} change={this.onChangeCandidate.bind(this)} />,
        <Candidate key={2} number={2} change={this.onChangeCandidate.bind(this)} />
      ],
    })
  }
  addCandidate(e) {
    e.preventDefault()
    const newNcandidates = this.state.ncandidates + 1
    let candidatesComp = this.state.candidatesComponents.concat(<Candidate key={newNcandidates} number={newNcandidates} change={this.onChangeCandidate.bind(this)} />)
    this.setState({
      ncandidates: newNcandidates,
      candidatesComponents: candidatesComp,
    })
  }

  removeCandidate(e) {
    e.preventDefault()
    const newNcandidates = this.state.ncandidates - 1
    let candidatesComp = this.state.candidatesComponents.slice(0, -1)
    this.setState({
      ncandidates: newNcandidates,
      candidatesComponents: candidatesComp,
    })
  }

  setFormattedDates() {
    const date = new Date()
    const offset = date.getTimezoneOffset()
    const localDate = new Date(date.getTime() - (offset * 60 * 1000) + 60000)
    const formattedDate = localDate.toISOString().split(".")[0].slice(0, -3)
    this.setState({
      date: formattedDate,
      start: formattedDate,
    })
    if (localDate >= Date.parse(this.state.end)) {
      this.setState({
        end: formattedDate,
      })
    }
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
      <Card id="new-voting-card" className="card">
        <h3 style={{ textAlign: "center", marginTop: "15pt" }}>Create New Voting</h3>

        {/* New Voting Form */}
        <Form onSubmit={e => this.onSubmit(e)}>
          <Field label="Name" className="field-new-voting">
            <Input
              type="text"
              required
              placeholder="Enter voting name"
              onChange={e => this.onChangeVotingName(e)}
              className="input-new-voting"
            />
          </Field>

          <div>
            <Field label="Description" className="field-new-voting">
              <Textarea
                rows={2}
                required
                type="text"
                resize="vertical"
                placeholder="Describe your Voting here"
                onChange={e => this.onChangeDescription(e)}
                className="input-new-voting"
              />
            </Field>
          </div>
          <Field label="Start date" className="field-new-voting date-start">
            <Input
              type="datetime-local"
              required
              min={this.state.date}
              value={this.state.start}
              onChange={e => this.onChangeStart(e)}
              className="date-new-voting"
            ></Input>
          </Field>
          <Field label="End date" className="field-new-voting date-end">
            <Input
              type="datetime-local"
              required
              min={this.state.start}
              value={this.state.end}
              onChange={e => this.onChangeEnd(e)}
              className="date-new-voting"
            ></Input>
          </Field>

          {this.state.candidatesComponents}
          <div className="button-candidates d-flex justify-content-center">
            <div className="button-add-candidate">
              <Button.Outline onClick={e => this.addCandidate(e)}>+</Button.Outline>
            </div>

            {this.state.ncandidates > 2 ? (
              <div className="button-remove-candidate">
                <Button.Outline onClick={e => this.removeCandidate(e)}>-</Button.Outline>
              </div>) : null}
          </div>
          <div className="button-new-voting">
            <Button type="submit">
              Submit
            </Button>
          </div>

          <br />
        </Form>
      </Card>
    )
  }
}

export default CreateVoting