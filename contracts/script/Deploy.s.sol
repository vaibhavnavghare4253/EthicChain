// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/CampaignFactory.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy CampaignFactory
        CampaignFactory factory = new CampaignFactory();
        
        console.log("CampaignFactory deployed to:", address(factory));

        vm.stopBroadcast();
    }
}

