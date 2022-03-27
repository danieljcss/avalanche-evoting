// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Voting {
  // Voting details will be stored in these variables
  string public name;
  string public description;
  uint256 public start;
  uint256 public end;


  // Structure of candidate standing in the election
  struct Candidate {
    uint256 id;
    string name;
    uint256 votesCount;
  }

  // Storing candidates in a map
  mapping(uint256 => Candidate) public candidates;

  // Storing address of those voters who already voted
  mapping(address => bool) public voters;

  // Number of candidates in standing in the election
  uint256 public candidatesCount = 0;

  // Setting of variables and data, during the creation of election contract
  constructor(
    string memory _name,
    string memory _description,
    uint256 _start,
    uint256 _end,
    string[] memory _candidates
    ) {

    require(_start > block.timestamp, "Invalid starting date.");
    require(_end > _start, "Invalid ending date. It should be later than the starting date.");
    require(_candidates.length > 1, "There should be at least two candidates.");

    name = _name;
    description = _description;
    start = _start;
    end = _end;

    for (uint256 i = 0; i < _candidates.length; i++) {
      addCandidate(_candidates[i]);
    }
  }

  // Internal function to add a candidate
  function addCandidate(string memory _name) internal {
    candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    candidatesCount++;
  }

  // Public vote function for voting a candidate
  function vote(uint256 _candidate) public {
    require(block.timestamp >= start, "Voting has not started yet");
    require(block.timestamp < end, "Voting has already ended");
    require(!voters[msg.sender], "Voter has already voted!");
    require(
      _candidate < candidatesCount && _candidate >= 0,
      "Invalid candidate to vote!"
    );
    voters[msg.sender] = true;
    candidates[_candidate].votesCount++;
  }
}