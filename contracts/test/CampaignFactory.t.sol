// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CampaignFactory.sol";
import "../src/Campaign.sol";

contract CampaignFactoryTest is Test {
    CampaignFactory public factory;
    
    address public creator = address(1);
    address payable public beneficiary = payable(address(2));
    
    function setUp() public {
        factory = new CampaignFactory();
    }
    
    function testCreateCampaign() public {
        uint256 targetAmount = 10 ether;
        uint256 deadline = block.timestamp + 30 days;
        
        vm.prank(creator);
        address campaignAddress = factory.createCampaign(
            "Test Campaign",
            "Description",
            targetAmount,
            deadline,
            beneficiary,
            "QmHash123"
        );
        
        assertTrue(factory.isCampaign(campaignAddress));
        assertEq(factory.getCampaignCount(), 1);
        
        Campaign campaign = Campaign(payable(campaignAddress));
        assertEq(campaign.creator(), creator);
        assertEq(campaign.targetAmount(), targetAmount);
    }
    
    function testGetCampaignsByCreator() public {
        uint256 deadline = block.timestamp + 30 days;
        
        // Create two campaigns
        vm.startPrank(creator);
        
        factory.createCampaign(
            "Campaign 1",
            "Description 1",
            5 ether,
            deadline,
            beneficiary,
            "Hash1"
        );
        
        factory.createCampaign(
            "Campaign 2",
            "Description 2",
            10 ether,
            deadline,
            beneficiary,
            "Hash2"
        );
        
        vm.stopPrank();
        
        address[] memory creatorCampaigns = factory.getCampaignsByCreator(creator);
        assertEq(creatorCampaigns.length, 2);
    }
    
    function testCannotCreateCampaignWithPastDeadline() public {
        // Use a timestamp that's clearly in the past
        uint256 pastDeadline = block.timestamp - 1; // 1 second ago
        
        vm.prank(creator);
        vm.expectRevert("Deadline must be in future");
        factory.createCampaign(
            "Test",
            "Desc",
            1 ether,
            pastDeadline,
            beneficiary,
            "Hash"
        );
    }
    
    function testCannotCreateCampaignWithZeroTarget() public {
        uint256 deadline = block.timestamp + 30 days;
        
        vm.prank(creator);
        vm.expectRevert("Target amount must be > 0");
        factory.createCampaign(
            "Test",
            "Desc",
            0,
            deadline,
            beneficiary,
            "Hash"
        );
    }
    
    function testSetPlatformFee() public {
        factory.setPlatformFee(5);
        assertEq(factory.platformFeePercentage(), 5);
    }
    
    function testCannotSetExcessivePlatformFee() public {
        vm.expectRevert("Fee too high");
        factory.setPlatformFee(11);
    }
}

