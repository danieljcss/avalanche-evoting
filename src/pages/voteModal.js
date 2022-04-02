import React, { useState } from 'react'
import { Box, Flex, Modal, Button, Card, Radio, Loader } from 'rimble-ui'

// Data like voting and candidate details will be passed in the props by activeVotings.js (parent)
function VoteModal(props) {
    // These are React Hooks and are used only for UX like opening and closing of Voting Modal and loaders
    const [isOpen, setIsOpen] = useState(false)
    const [loading, isLoading] = useState(false)

    // This Hook will be used to maintain the selected candidate ID by a voter
    const [candidateId, changeCandidateId] = useState(0);

    const closeModal = (e) => {
        e.preventDefault()
        setIsOpen(false)
    }

    const openModal = (e) => {
        e.preventDefault()
        setIsOpen(true)
    }

    const onRadioChange = (e) => {
        changeCandidateId(e.target.value);
    };

    // vote() function would be used to transact a vote
    const vote = async () => {
        isLoading(true)
        let signedContract = await props.voting.contractInstance.connect(props.voting.account)
        await signedContract.vote(candidateId)
        isLoading(false)
        setIsOpen(false)
    };

    let candid = [],
        candidVote = []
    for (let i = 0; i < props.candidates.length; i++) {
        let candidDetail = props.candidates[i][1] + " (" + props.candidates[i][2].toNumber() + ")"

        candid.push(
            <Radio
                name="candidate"
                key={i}
                label={candidDetail}
                my={2}
                value={props.candidates[i][0]}
                onChange={onRadioChange}
            />
        );

        candidVote.push(props.candidates[i][2])
    }

    return (
        // This is a rimble-ui builtin modal for triggering vote() function
        <Box p={0}>
            <Box>
                <Button onClick={openModal}>
                    Vote
                </Button>

                <Modal isOpen={isOpen}>
                    <Card width={"540px"} p={0} className="card">
                        {/* Close icon to close the modal */}
                        <Button.Text
                            icononly
                            icon={"Close"}
                            mainColor={'#006BA6'}
                            color={"moon-gray"}
                            position={"absolute"}
                            top={0}
                            right={0}
                            mt={3}
                            mr={3}
                            onClick={closeModal}
                        />

                        {/* List of candidates with their vote count */}
                        <Box p={4} mb={3}>
                            <h4 style={{ marginRight: "2rem" }}>{props.voting.votingName}</h4>
                            <fieldset>
                                <legend>
                                    <b style={{ fontSize: "12pt" }}>
                                        Choose one candidate from below
                                    </b>
                                </legend>
                                {candid}
                            </fieldset>
                        </Box>

                        {/* Vote button to cast a vote */}
                        <Flex
                            px={4}
                            py={3}
                            borderTop={1}
                            borderColor={"#E8E8E8"}
                            justifyContent={"flex-end"}
                        >
                            {loading ? (
                                <Loader size="40px" />
                            ) : (
                                <Button.Outline onClick={vote}>
                                    Vote
                                </Button.Outline>
                            )}
                        </Flex>
                    </Card>
                </Modal>
            </Box>
        </Box>

    )
}

export default VoteModal;