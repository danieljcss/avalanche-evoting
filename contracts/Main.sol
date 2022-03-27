// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import './Voting.sol';

contract Main {
  uint public votingId = 0;
  mapping (uint => address) public Votings;

  function createVoting (
    string memory _name,
    string memory _description,
    uint256 _start,
    uint256 _end, 
    string[] memory _candidates
    ) public {
    Voting voting = new Voting(_name, _description, _start, _end, _candidates);
    Votings[votingId] = address(voting);
    votingId++;
  }
}