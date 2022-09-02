// File: scripts/deploy-DNFT.js
// 2022-09-01 | CR
//
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const keeperInterval = 2;
  const ethersToStart = hre.ethers.utils.parseEther("0");

  const KeeperFlower = await hre.ethers.getContractFactory("keeperFlower");
  const keeperFlower = await KeeperFlower.deploy(keeperInterval, { value: ethersToStart });

  await keeperFlower.deployed();

  console.log(
    `keeperFlower with ${keeperInterval} seconds for keeper interval deployed to ${keeperFlower.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
