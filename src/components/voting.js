import React, { Component } from 'react'
import VoteModal from "./voteModal"
import { formatDate } from "../utils/formatDate"
import { Box, Card, Text, Flex } from 'rimble-ui'

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
            <Box mb={'20px'} className="col-12 col-lg-6">
                <Card >
                    <Flex className="flex-column">
                        <Flex className="flex-column align-items-center">
                            <Text fontSize={'18pt'}>{this.props.voting.votingName}</Text>
                            <Text className="text-muted">{this.props.voting.votingDescription}</Text>
                            <Flex className="text-muted">
                                <Text fontSize={'10pt'} mr={3}>ID: {this.props.voting.votingId}</Text>

                                <Text fontSize={'10pt'} mr={1}>
                                    Contract:
                                </Text>
                                <Text className="link-address active-votings" fontSize={'10pt'}>
                                    <a href={`https://testnet.snowtrace.io/address/${this.props.voting.votingAddress}`}
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        {`${this.props.voting.votingAddress.slice(0, 10)}...`}
                                    </a>
                                </Text>
                            </Flex>
                        </Flex>


                        <Flex mt={3} className="flex-wrap justify-content-center">
                            {this.props.candidateComponent}
                        </Flex>

                        <Flex className="flex-column align-items-center" mt={3}>
                            <Box>
                                <Text className="text-muted" fontSize={'11pt'}>
                                    <b>Start: </b>
                                    {formatDate(this.props.voting.votingStart)}
                                </Text>
                            </Box>
                            <Box>
                                <Text className="text-muted" fontSize={'11pt'}>
                                    <b>End: </b>
                                    {formatDate(this.props.voting.votingEnd)}
                                </Text>
                            </Box>
                        </Flex>

                        <Box mx={'auto'} mt={3}>{this.votingState()}</Box>


                    </Flex>
                </Card>
            </Box>
        )
    }
    // render() {
    //     return (
    //         <tr>
    //             <td style={{ textAlign: "center", verticalAlign: "middle" }}>{this.props.voting.votingId}</td>

    //             <td>
    //                 {this.props.voting.votingName} <br />
    //                 <font className="text-muted" size="2">
    //                     <b>{this.props.voting.votingDescription}</b>
    //                 </font>
    //                 <br />
    //                 <font className="text-muted" size="2">
    //                     Contract: <span className="link-address active-votings">
    //                         <a href={`https://testnet.snowtrace.io/address/${this.props.voting.votingAddress}`}
    //                             target="_blank" rel="noopener noreferrer"
    //                         >
    //                             {`${this.props.voting.votingAddress.slice(0, 10)}...`}
    //                         </a>
    //                     </span>
    //                 </font>
    //             </td>

    //             <td style={{ textAlign: "center", verticalAlign: "middle" }}>{this.props.candidateComponent}</td>

    //             <td style={{ textAlign: "center", verticalAlign: "middle" }}>
    //                 <div>
    //                     <font className="text-muted" size="2.5">
    //                         <b>Start: </b>
    //                         {formatDate(this.props.voting.votingStart)}
    //                     </font>
    //                 </div>
    //                 <div>
    //                     <font className="text-muted" size="2.5">
    //                         <b>End: </b>
    //                         {formatDate(this.props.voting.votingEnd)}
    //                     </font>
    //                 </div>
    //             </td>

    //             <td style={{ textAlign: "center", verticalAlign: "middle" }}>
    //                 {this.votingState()}
    //             </td>
    //         </tr>
    //     )
    // }
}