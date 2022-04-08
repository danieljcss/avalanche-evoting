import React, { Component } from 'react'
import VoteModal from "./voteModal"
import { formatDate } from "../utils/formatDate"

// Voting component for organising voting details
export default class Voting extends Component {
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
        if (this.props.voting.account != null) {
            if (this.props.voting.hasVoted) {
                return (
                    <font size="2" color="green">
                        You have voted!
                    </font>
                )
            } else if (this.props.voting.votingStart > this.state.time) {
                return (
                    <font size="2">
                        Not open yet
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
                    <VoteModal voting={this.props.voting} candidates={this.props.candidates} loadData={this.props.loadData} />
                )
            }
        }
        else {
            return (
                <font className="text-muted" size="2">
                    Wallet not connected
                </font>
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
                        Contract: <span className="link-address active-votings">
                            <a href={`https://testnet.snowtrace.io/address/${this.props.voting.votingAddress}`}
                                target="_blank" rel="noopener noreferrer"
                            >
                                {`${this.props.voting.votingAddress.slice(0, 10)}...`}
                            </a>
                        </span>
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