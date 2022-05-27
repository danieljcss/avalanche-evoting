import React, { Component } from 'react'
import { Box, Text } from 'rimble-ui'

// Candidate component for organising candidate details of each candidate
export default class Candidates extends Component {
    render() {
        return (
            <Box className="d-flex col-6 justify-content-center">
                <Text fontSize={'12pt'} >
                    <b>{this.props.name}</b> ({this.props.voteCount}) <br />
                </Text>
            </Box>
        )
    }
}