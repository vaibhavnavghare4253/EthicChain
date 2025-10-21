// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./Campaign.sol";

/**
 * @title CampaignFactory
 * @dev Factory contract to create and manage charity campaigns
 */
contract CampaignFactory {
    // Events
    event CampaignCreated(
        address indexed campaignAddress,
        address indexed creator,
        string title,
        uint256 targetAmount,
        uint256 deadline
    );

    // State variables
    address[] public campaigns;
    mapping(address => address[]) public creatorCampaigns;
    mapping(address => bool) public isCampaign;
    
    address public owner;
    uint256 public platformFeePercentage = 2; // 2% platform fee
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create a new campaign
     * @param _title Campaign title
     * @param _description Campaign description
     * @param _targetAmount Target funding amount in wei
     * @param _deadline Campaign deadline timestamp
     * @param _beneficiary Address to receive funds
     * @param _ipfsHash IPFS hash for campaign details
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline,
        address payable _beneficiary,
        string memory _ipfsHash
    ) external returns (address) {
        require(_targetAmount > 0, "Target amount must be > 0");
        require(_deadline > block.timestamp, "Deadline must be in future");
        require(_beneficiary != address(0), "Invalid beneficiary");

        Campaign newCampaign = new Campaign(
            msg.sender,
            _title,
            _description,
            _targetAmount,
            _deadline,
            _beneficiary,
            _ipfsHash,
            platformFeePercentage
        );

        address campaignAddress = address(newCampaign);
        
        campaigns.push(campaignAddress);
        creatorCampaigns[msg.sender].push(campaignAddress);
        isCampaign[campaignAddress] = true;

        emit CampaignCreated(
            campaignAddress,
            msg.sender,
            _title,
            _targetAmount,
            _deadline
        );

        return campaignAddress;
    }

    /**
     * @dev Get all campaigns
     */
    function getAllCampaigns() external view returns (address[] memory) {
        return campaigns;
    }

    /**
     * @dev Get campaigns created by a specific address
     */
    function getCampaignsByCreator(address _creator) external view returns (address[] memory) {
        return creatorCampaigns[_creator];
    }

    /**
     * @dev Get total number of campaigns
     */
    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function setPlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 10, "Fee too high"); // Max 10%
        platformFeePercentage = _newFee;
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid address");
        owner = _newOwner;
    }
}

