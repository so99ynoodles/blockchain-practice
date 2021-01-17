// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Campaign {
    struct Request {
        string description;
        uint amount;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }
    
    address public manager;
    mapping(uint => Request) public requests;
    mapping(address => bool) public approvers;
    uint public approverCount;
    uint public minimumContribution;
    uint public requestCount;
    
    constructor (uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approverCount++;
    }
    
    function createRequest(string memory description, uint amount, address payable recipient) public restrictToManager {
        Request storage r = requests[requestCount++];
        r.description = description;
        r.amount = amount;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }
    
    function approveRequest(uint index) public {
        Request storage r = requests[index];
        require(approvers[msg.sender]);
        require(!r.approvals[msg.sender]);
        r.approvals[msg.sender] = true;
        r.approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public restrictToManager {
        Request storage r = requests[index];
        require(r.approvalCount > (approverCount / 2));
        require(!r.complete);
        r.recipient.transfer(r.amount);
        r.complete = true;
    }
    
    modifier restrictToManager() {
        require(msg.sender == manager);
        _;
    }
}

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimumContribution) public {
        address newCampaign = address(new Campaign(minimumContribution, msg.sender));
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}