const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("DNFT", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployKeeperFlowerFixture() {
    const keeperInterval = 2;
    const ethersToStart = 0;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const KeeperFlower = await ethers.getContractFactory("keeperFlower");
    const keeperFlower = await KeeperFlower.deploy(keeperInterval, { value: ethersToStart });
    await keeperFlower.deployed();

    // 1st NFT to the owner, 2nd to the other account.
    await keeperFlower.safeMint(owner.address);
    // await keeperFlower.safeMint(otherAccount.address);

    return { keeperFlower, keeperInterval, ethersToStart, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should have the right name", async function () {
      const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);

      expect(await keeperFlower.name()).to.equal("Flower Tomkat_CR");
    });

    it("Should have the right symbol", async function () {
      const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);

      expect(await keeperFlower.symbol()).to.equal("dFCR1");
    });

    it("Should set the right Interval", async function () {
      const { keeperFlower, keeperInterval } = await loadFixture(deployKeeperFlowerFixture);

      expect(await keeperFlower.getInterval()).to.equal(keeperInterval);
    });

  });

  describe("Mint", function () {

    it("Should have one token minted", async function () {
      const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);

      expect(await keeperFlower.tokenIdCounter()).to.equal(1);
    });

    it("Contract owner should have 1 NFT", async function () {
      const { keeperFlower, owner } = await loadFixture(deployKeeperFlowerFixture);

      expect(await keeperFlower.balanceOf(owner.address)).to.equal(1);
    });

    it("Owner of 1st NFT should be the contract owner", async function () {
      const { keeperFlower, owner } = await loadFixture(deployKeeperFlowerFixture);

      expect(await keeperFlower.ownerOf(0)).to.equal(owner.address);
    });

  });

  describe("Flower stages changes", function () {

    describe("Flower 1st stage", function () {

      it("Checking current flower stage", async function () {
        const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);
  
        expect(await keeperFlower.flowerStage(0)).to.equal(0);
      });
  
      it("Checking flower 1st stage URI", async function () {
        const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);
  
        expect(await keeperFlower.tokenURI(0)).to.equal("https://ipfs.io/ipfs/Qmdjp2MeudyZHkxe8oaHAcPjkwYV4iU5tn62c4cZaWFMuj/fase-1-semilla.json");
      });
  
    });

    describe("Flower 2nd stage", function () {

        it("Checking current flower stage", async function () {
          const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);

          // Go to the next flower stage
          await keeperFlower.growFlower(0); // 2
    
          expect(await keeperFlower.flowerStage(0)).to.equal(1);
        });
    
        it("Checking flower 2nd stage URI", async function () {
          const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);

          // Go to the next flower stage
          await keeperFlower.growFlower(0);
    
          expect(await keeperFlower.tokenURI(0)).to.equal("https://ipfs.io/ipfs/Qmdjp2MeudyZHkxe8oaHAcPjkwYV4iU5tn62c4cZaWFMuj/fase-2-germinando.json");
        });
  
    });

    describe("Flower 7th stage", function () {
        it("Checking current flower stage", async function () {
          const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);

          // Go to the next flower stage(s) = 3, 4, 5, 6, 7
          for (let i=0; i<7; i++) {
            await keeperFlower.growFlower(0);
          }
    
          expect(await keeperFlower.flowerStage(0)).to.equal(6);
        });
    
        it("Checking flower 7th stage URI", async function () {
          const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);
    
          // Go to the next flower stage(s) = 3, 4, 5, 6, 7
          for (let i=0; i<7; i++) {
            await keeperFlower.growFlower(0);
          }
      
          expect(await keeperFlower.tokenURI(0)).to.equal("https://ipfs.io/ipfs/Qmdjp2MeudyZHkxe8oaHAcPjkwYV4iU5tn62c4cZaWFMuj/fase-7-frutos.json");
        });
      
    });

    describe("Beyond Flower 7th stage", function () {
        it("Checking current flower stage (must be the last one)", async function () {
          const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);

          // Go to the next flower stage(s) = 3, 4, 5, 6, 7, 7+
          for (let i=0; i<8; i++) {
            await keeperFlower.growFlower(0);
          }

          expect(await keeperFlower.flowerStage(0)).to.equal(6);
        });
    
        it("Checking flower 7th stage URI (must be the last one)", async function () {
          const { keeperFlower } = await loadFixture(deployKeeperFlowerFixture);
    
          // Go to the next flower stage(s) = 3, 4, 5, 6, 7, 7+
          for (let i=0; i<8; i++) {
            await keeperFlower.growFlower(0);
          }

          expect(await keeperFlower.tokenURI(0)).to.equal("https://ipfs.io/ipfs/Qmdjp2MeudyZHkxe8oaHAcPjkwYV4iU5tn62c4cZaWFMuj/fase-7-frutos.json");
        });
      
      });

  });

});
