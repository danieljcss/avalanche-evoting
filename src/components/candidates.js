import React, { Component } from 'react'

// Candidate component for organising candidate details of each candidate
export default class Candidates extends Component {
    render() {
        return (
            <font size="2">
                <b>{this.props.name}</b> ({this.props.voteCount}) <br />
            </font>
        )
    }
}