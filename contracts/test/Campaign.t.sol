// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Campaign.sol";
import "../src/CampaignFactory.sol";

contract CampaignTest is Test {
    CampaignFactory public factory;
    Campaign public campaign;
    
    address public creator = address(1);
    address public donor1 = address(2);
    address public donor2 = address(3);
    address payable public beneficiary = payable(address(4));
    
    uint256 public targetAmount = 10 ether;
    uint256 public deadline;
    
    function setUp() public {
        deadline = block.timestamp + 30 days;
        
        // Deploy factory
        factory = new CampaignFactory();
        
        // Create campaign
        vm.prank(creator);
        address campaignAddress = factory.createCampaign(
            "Test Campaign",
            "This is a test campaign",
            targetAmount,
            deadline,
            beneficiary,
            "QmTestHash123"
        );
        
        campaign = Campaign(payable(campaignAddress));
    }
    
    function testDonation() public {
        uint256 donationAmount = 1 ether;
        
        vm.deal(donor1, donationAmount);
        vm.prank(donor1);
        campaign.donate{value: donationAmount}("Great cause!");
        
        assertEq(campaign.totalRaised(), donationAmount);
        assertEq(campaign.donorContributions(donor1), donationAmount);
        assertEq(campaign.getDonorCount(), 1);
    }
    
    function testMultipleDonations() public {
        uint256 donation1 = 1 ether;
        uint256 donation2 = 2 ether;
        
        // First donor
        vm.deal(donor1, donation1);
        vm.prank(donor1);
        campaign.donate{value: donation1}("First donation");
        
        // Second donor
        vm.deal(donor2, donation2);
        vm.prank(donor2);
        campaign.donate{value: donation2}("Second donation");
        
        assertEq(campaign.totalRaised(), donation1 + donation2);
        assertEq(campaign.getDonorCount(), 2);
    }
    
    function testWithdrawal() public {
        uint256 donationAmount = 5 ether;
        
        // Donate
        vm.deal(donor1, donationAmount);
        vm.prank(donor1);
        campaign.donate{value: donationAmount}("");
        
        // Withdraw
        uint256 withdrawAmount = 2 ether;
        uint256 beneficiaryBalanceBefore = beneficiary.balance;
        
        vm.prank(beneficiary);
        campaign.withdrawFunds(withdrawAmount);
        
        // Check balances (accounting for 2% platform fee)
        uint256 expectedAmount = withdrawAmount * 98 / 100;
        assertEq(beneficiary.balance - beneficiaryBalanceBefore, expectedAmount);
        assertEq(campaign.totalWithdrawn(), withdrawAmount);
    }
    
    function testCannotDonateAfterDeadline() public {
        // Fast forward past deadline
        vm.warp(deadline + 1);
        
        vm.deal(donor1, 1 ether);
        vm.prank(donor1);
        vm.expectRevert("Campaign ended");
        campaign.donate{value: 1 ether}("");
    }
    
    function testAddMilestone() public {
        vm.prank(creator);
        campaign.addMilestone("First milestone", 50);
        
        Campaign.Milestone[] memory milestones = campaign.getMilestones();
        assertEq(milestones.length, 1);
        assertEq(milestones[0].targetPercentage, 50);
    }
    
    function testCompleteMilestone() public {
        // Add milestone
        vm.prank(creator);
        campaign.addMilestone("First milestone", 50);
        
        // Complete milestone
        vm.prank(creator);
        campaign.completeMilestone(0);
        
        Campaign.Milestone[] memory milestones = campaign.getMilestones();
        assertTrue(milestones[0].isCompleted);
    }
    
    function testOnlyBeneficiaryCanWithdraw() public {
        vm.deal(donor1, 1 ether);
        vm.prank(donor1);
        campaign.donate{value: 1 ether}("");
        
        // Try to withdraw as non-beneficiary
        vm.prank(donor1);
        vm.expectRevert("Not beneficiary");
        campaign.withdrawFunds(0.5 ether);
    }
}

