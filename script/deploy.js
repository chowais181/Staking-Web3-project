async function main() {
    const [deployer] = await ethers.getSigners();
    var token_instances =[]
    var token_addresses = []
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    ///staking_pool_1
    var Token = await ethers.getContractFactory("Fixed_Pool_1");
    var token = await Token.deploy();
    console.log("Fixed pool 1 => Address: ", token.address);
    token_instances.push(token);
    token_addresses.push(token.address);
    // staking_pool_2
    Token = await ethers.getContractFactory("Fixed_Pool_2");
    token = await Token.deploy();
    console.log("Fixed pool 2 => Address: ", token.address);
    token_instances.push(token);
    token_addresses.push(token.address);
     // staking_pool_3
     Token = await ethers.getContractFactory("Fixed_Pool_3");
     token = await Token.deploy();
     console.log("Fixed pool 3 => Address: ", token.address);
     token_instances.push(token);
     token_addresses.push(token.address);
      // staking_pool_4
    Token = await ethers.getContractFactory("Flexible_Pool_4");
    token = await Token.deploy();
    console.log("Flexible pool 4 => Address: ", token.address);
    token_instances.push(token);
    token_addresses.push(token.address);

     // staking_pool_5
     Token = await ethers.getContractFactory("Flexible_Pool_5");
     token = await Token.deploy();
     console.log("Flexible pool 5 => Address: ", token.address);
     token_instances.push(token);
     token_addresses.push(token.address);

      // staking_pool_6
    Token = await ethers.getContractFactory("Flexible_Pool_6");
    token = await Token.deploy();
    console.log("Flexible pool 6 => Address: ", token.address);
    token_instances.push(token);
    token_addresses.push(token.address);

     // reward_token_
     Token = await ethers.getContractFactory("Reward_token");
     token = await Token.deploy();
     console.log("Reward token => Address: ", token.address);
     reward_contract = token;
    //  console.log("all addrs: ",token_instances.address)
     ///stacking_contract
     Token = await ethers.getContractFactory("stakingContract");
     //following arguments => all pool contracts addresses , reward token address ,reward percentage and timelock
     token = await Token.deploy(token_addresses,token.address,5,100);
     var staking_instance = token;
    //  const time = await staking_instance.TimeLock_on_fixed_pool();
    //  console.log("Time: ", time);
     console.log("Staking Contract => Address: ", staking_instance.address);
     ////minting rewards on staking contract address
     await reward_contract.mint(staking_instance.address, "10000000000000000000000000");
     value = await reward_contract.balanceOf(staking_instance.address);
     console.log("Total reward token Minted: ",value)
     //approving contract for staking
    //  const [deplvalue = await token_instances[i].balanceOf(deployer] = await ethers.getSigners();
     for(let i=0; i < token_instances.length; i++)
     {
      console.log("Approving Pool_",i+1,"=>",token_instances[i].address);
      await token_instances[i].connect(deployer).approve(staking_instance.address, ethers.utils.parseEther('10000'));
      value = await token_instances[i].balanceOf(deployer.address);
      console.log("Before Staking: ", value);
      await staking_instance.connect(deployer).staking(i+1, ethers.utils.parseEther('1'));
      value = await token_instances[i].balanceOf(deployer.address);
      console.log("After Staking: ", value);
    }
     //////////for staking in each pool
    
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });