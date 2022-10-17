const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
describe("Staking Pool_1 contract Testing", function () {
    it("Successful initial minting to user account in pool 1!", async function () {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Fixed_Pool_1" ,owner);
        const contract = await Token.deploy( );
        // const{owner, contract} = await loadFixture(deployTokenFixture);
        var value = await contract.balanceOf(owner.address);
        console.log("Return Balance: ",value);
        expect(await contract.balanceOf(owner.address)).to.equal('10000000000000000000000');
        });  
    });
describe("Staking Pool_2 contract Testing", function () {
    it("Successful initial minting to user account in pool 2!", async function () {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Fixed_Pool_2" ,owner);
        const contract = await Token.deploy( );
        const value = await contract.balanceOf(owner.address);
        console.log("Return Balance: ",value);
        expect(await contract.balanceOf(owner.address)).to.equal('10000000000000000000000');
        });  
    });

describe("Staking Pool_3 contract Testing", function () {
    it("Successful initial minting to user account in pool 3!", async function () {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Fixed_Pool_3" ,owner);
        const contract = await Token.deploy( );
        const value = await contract.balanceOf(owner.address);
        console.log("Return Balance: ",value);
        expect(await contract.balanceOf(owner.address)).to.equal('10000000000000000000000');
        });  
    });

describe("Staking Pool_4 contract Testing", function () {
    it("Successful initial minting to user account in pool 4!", async function () {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Flexible_Pool_4" ,owner);
        const contract = await Token.deploy( );
        const value = await contract.balanceOf(owner.address);
        console.log("Return Balance: ",value);
        expect(await contract.balanceOf(owner.address)).to.equal('10000000000000000000000');
        });  
    });

describe("Staking Pool_5 contract Testing", function () {
    it("Successful initial minting to user account in pool 5!", async function () {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Flexible_Pool_5" ,owner);
        const contract = await Token.deploy( );
        const value = await contract.balanceOf(owner.address);
        console.log("Return Balance: ",value);
        expect(await contract.balanceOf(owner.address)).to.equal('10000000000000000000000');
        });  
    });

describe("Staking Pool_6 contract Testing", function () {
    it("Successful initial minting to user account in pool 6!", async function () {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Flexible_Pool_6" ,owner);
        const contract = await Token.deploy( );
        const value = await contract.balanceOf(owner.address);
        console.log("Return Balance: ",value);
        expect(await contract.balanceOf(owner.address)).to.equal('10000000000000000000000');
        });  
    });

describe("Reward token Testing", function () {
    it("Successful initial minting to user account for reward!", async function () {
        const [owner] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("Reward_token" ,owner);
        const contract = await Token.deploy( );
        const value = await contract.balanceOf(owner.address);
        console.log("Return Balance: ",value);
        expect(await contract.balanceOf(owner.address)).to.equal('0');
        });  
    });

    describe("Staking contract testing", function () {

    async function deployStakingFixture(){
        const [owner] = await ethers.getSigners();
        console.log(owner.address);
        const pool_token = await ethers.getContractFactory("Fixed_Pool_1" ,owner);
        const pool_contract = await pool_token.deploy( );
        const reward_token = await ethers.getContractFactory("Reward_token" ,owner);
        const reward_contract = await reward_token.deploy( );
        const staking_token = await ethers.getContractFactory("stakingContract" ,owner);
        const staking_contract = await staking_token.deploy( [
            pool_contract.address
          ],
          reward_contract.address,
          5,0
          );
        return {owner, pool_contract, reward_contract, staking_contract};
    }

        it("Staker account check before and after staking!", async function () {
    
            const{owner, pool_contract, staking_contract} = await loadFixture(deployStakingFixture);
            expect(await pool_contract.balanceOf(owner.address)).to.equal('10000000000000000000000');
            await pool_contract.connect(owner).approve(staking_contract.address, ethers.utils.parseEther('10000'));
            value = await pool_contract.balanceOf(owner.address);
            console.log("Before Staking: ", value);
            await staking_contract.connect(owner).staking(1, ethers.utils.parseEther('1'));
            value = await pool_contract.balanceOf(owner.address);
            console.log("After Staking: ", value);
            expect(await pool_contract.balanceOf(owner.address)).to.equal('9999000000000000000000');
            });  

        it("Staker reward check on before and after staking!", async function () {
    
            const{owner, pool_contract, reward_contract, staking_contract} = await loadFixture(deployStakingFixture);
            value = await reward_contract.balanceOf(staking_contract.address);
            console.log("Total reward before Minting: ",value);
            await reward_contract.mint(staking_contract.address, "1000000000000000000000000");
            value = await reward_contract.balanceOf(staking_contract.address);
            console.log("Total reward after Minting: ",value)
            expect(await reward_contract.balanceOf(staking_contract.address)).to.equal('1000000000000000000000000');
            await pool_contract.connect(owner).approve(staking_contract.address, ethers.utils.parseEther('10000'));

            value = await reward_contract.balanceOf(owner.address);
            console.log("Staker Rewards before Staking: ", value);
            await staking_contract.connect(owner).staking(1, ethers.utils.parseEther('1'));
            value = await pool_contract.balanceOf(owner.address);
            console.log("Staker balance before receiving reward: ", value);
            await staking_contract.connect(owner).reward(1,1);
            value = await reward_contract.balanceOf(owner.address);
            console.log("Staker Rewards after Staking: ", value);
            expect(await reward_contract.balanceOf(owner.address)).to.equal('100000000000000000');
            value = await pool_contract.balanceOf(owner.address);
            console.log("Staker balance after receiving reward: ", value);
            });  
        });