// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title Campaign
 * @dev Individual charity campaign contract
 */
contract Campaign is ReentrancyGuard {
    // Structs
    struct Milestone {
        string description;
        uint256 targetPercentage; // Percentage of total goal
        bool isCompleted;
        bool fundsReleased;
    }

    struct Donation {
        address donor;
        uint256 amount;
        uint256 timestamp;
        string message;
    }

    // State variables
    address public creator;
    string public title;
    string public description;
    uint256 public targetAmount;
    uint256 public deadline;
    address payable public beneficiary;
    string public ipfsHash;
    uint256 public platformFeePercentage;
    
    uint256 public totalRaised;
    uint256 public totalWithdrawn;
    bool public isActive = true;
    
    Milestone[] public milestones;
    Donation[] public donations;
    
    mapping(address => uint256) public donorContributions;
    address[] public donors;
    
    // Events
    event DonationReceived(
        address indexed donor,
        uint256 amount,
        uint256 timestamp,
        string message
    );
    
    event FundsWithdrawn(
        address indexed beneficiary,
        uint256 amount,
        uint256 timestamp
    );
    
    event MilestoneCompleted(
        uint256 indexed milestoneIndex,
        string description
    );
    
    event CampaignStatusChanged(bool isActive);
    
    // Modifiers
    modifier onlyCreator() {
        require(msg.sender == creator, "Not creator");
        _;
    }
    
    modifier campaignActive() {
        require(isActive, "Campaign not active");
        require(block.timestamp < deadline, "Campaign ended");
        _;
    }

    constructor(
        address _creator,
        string memory _title,
        string memory _description,
        uint256 _targetAmount,
        uint256 _deadline,
        address payable _beneficiary,
        string memory _ipfsHash,
        uint256 _platformFeePercentage
    ) {
        creator = _creator;
        title = _title;
        description = _description;
        targetAmount = _targetAmount;
        deadline = _deadline;
        beneficiary = _beneficiary;
        ipfsHash = _ipfsHash;
        platformFeePercentage = _platformFeePercentage;
    }

    /**
     * @dev Donate to campaign (ETH)
     */
    function donate(string memory _message) external payable campaignActive nonReentrant {
        require(msg.value > 0, "Donation must be > 0");
        
        // Track donor
        if (donorContributions[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        donorContributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        
        // Record donation
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        }));
        
        emit DonationReceived(msg.sender, msg.value, block.timestamp, _message);
    }

    /**
     * @dev Donate ERC20 tokens
     */
    function donateERC20(
        address _token,
        uint256 _amount,
        string memory _message
    ) external campaignActive nonReentrant {
        require(_amount > 0, "Donation must be > 0");
        
        IERC20 token = IERC20(_token);
        require(
            token.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        
        // Track donor
        if (donorContributions[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        donorContributions[msg.sender] += _amount;
        totalRaised += _amount;
        
        // Record donation
        donations.push(Donation({
            donor: msg.sender,
            amount: _amount,
            timestamp: block.timestamp,
            message: _message
        }));
        
        emit DonationReceived(msg.sender, _amount, block.timestamp, _message);
    }

    /**
     * @dev Withdraw funds (only beneficiary)
     */
    function withdrawFunds(uint256 _amount) external nonReentrant {
        require(msg.sender == beneficiary, "Not beneficiary");
        require(_amount > 0, "Amount must be > 0");
        require(totalRaised - totalWithdrawn >= _amount, "Insufficient funds");
        
        // Calculate platform fee
        uint256 fee = (_amount * platformFeePercentage) / 100;
        uint256 amountAfterFee = _amount - fee;
        
        totalWithdrawn += _amount;
        
        // Transfer to beneficiary
        (bool success, ) = beneficiary.call{value: amountAfterFee}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(beneficiary, amountAfterFee, block.timestamp);
    }

    /**
     * @dev Add milestone (only creator)
     */
    function addMilestone(
        string memory _description,
        uint256 _targetPercentage
    ) external onlyCreator {
        require(_targetPercentage > 0 && _targetPercentage <= 100, "Invalid percentage");
        
        milestones.push(Milestone({
            description: _description,
            targetPercentage: _targetPercentage,
            isCompleted: false,
            fundsReleased: false
        }));
    }

    /**
     * @dev Complete milestone (only creator)
     */
    function completeMilestone(uint256 _milestoneIndex) external onlyCreator {
        require(_milestoneIndex < milestones.length, "Invalid milestone");
        require(!milestones[_milestoneIndex].isCompleted, "Already completed");
        
        milestones[_milestoneIndex].isCompleted = true;
        
        emit MilestoneCompleted(_milestoneIndex, milestones[_milestoneIndex].description);
    }

    /**
     * @dev Toggle campaign active status (only creator)
     */
    function toggleCampaignStatus() external onlyCreator {
        isActive = !isActive;
        emit CampaignStatusChanged(isActive);
    }

    /**
     * @dev Get campaign details
     */
    function getCampaignDetails() external view returns (
        address _creator,
        string memory _title,
        uint256 _targetAmount,
        uint256 _totalRaised,
        uint256 _deadline,
        bool _isActive,
        uint256 _donorCount
    ) {
        return (
            creator,
            title,
            targetAmount,
            totalRaised,
            deadline,
            isActive,
            donors.length
        );
    }

    /**
     * @dev Get all donations
     */
    function getAllDonations() external view returns (Donation[] memory) {
        return donations;
    }

    /**
     * @dev Get donor count
     */
    function getDonorCount() external view returns (uint256) {
        return donors.length;
    }

    /**
     * @dev Get all milestones
     */
    function getMilestones() external view returns (Milestone[] memory) {
        return milestones;
    }

    /**
     * @dev Get available funds to withdraw
     */
    function getAvailableFunds() external view returns (uint256) {
        return totalRaised - totalWithdrawn;
    }

    // Receive ETH
    receive() external payable {
        require(isActive, "Campaign not active");
        require(block.timestamp < deadline, "Campaign ended");
        
        if (donorContributions[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        
        donorContributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        
        donations.push(Donation({
            donor: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            message: ""
        }));
        
        emit DonationReceived(msg.sender, msg.value, block.timestamp, "");
    }
}

