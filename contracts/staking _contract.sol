// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract stakingContract{
    uint time_lock;
    uint fixed_staking_amount = 1 ether;
    uint fixed_pool_reward = 0.1 ether;
    uint flexible_reward_percentage;
    address owner;
    IERC20  staking_fixed_pool_1;
    IERC20  staking_fixed_pool_2;
    IERC20  staking_fixed_pool_3;
    IERC20  staking_flexible_pool_4;
    IERC20  staking_flexible_pool_5;
    IERC20  staking_flexible_pool_6;
    IERC20  reward_token;
    mapping (uint => IERC20) staking_pool_index;
    uint random_number;
    uint level_1;
    uint level_2;
    uint level_3;

    mapping (address => uint) balances;
    mapping (uint => mapping(address => mapping(uint =>uint ))) staked_at;
    mapping (uint => mapping(address => uint)) staking_count;
    mapping (uint => mapping(address => uint[])) indexing;
    mapping (uint => mapping(address => mapping(uint =>uint ))) staking_record ;
    // we will be assigning 6 IERC20 stacing and 1 reward IERC20 rewarding token in the constructor! 
    constructor(address[] memory pool_addresses, address reward_contract, uint reward_percentage, uint time_lock_in_seconds)
      {
     
        for (uint i=0; i < pool_addresses.length ;i++)
        {
          staking_pool_index[i+1] = IERC20(pool_addresses[i]);
        }
        reward_token = IERC20(reward_contract);
        flexible_reward_percentage = reward_percentage;
        time_lock = time_lock_in_seconds;
        level_1 = time_lock_in_seconds * 5;
        level_2 = time_lock_in_seconds * 10;
        level_3 = time_lock_in_seconds * 15;

     }
    /////////events
    event staking_events(uint indexed _pool, address indexed  _staker, uint indexed  _amount, string  _message);

    ////////////////modifiers
    //for validating staker
    modifier validating_for_staking(address _staker, IERC20 _pool_address, uint _amount){
       require(_amount< _pool_address.balanceOf(_staker),"Staking amount is exceeding user Balance!");
       require(_amount > 0,"not enough amount for staking!!");
      _;
    }
    //for assigning and checking how many times the particular user has staked!
    modifier record_staking(uint _pool,address _staker,uint _amount){
        _;
      random_number ++;
      uint index = random_number;
      indexing[_pool][_staker].push(index); 
      // uint repetation = staking_count[_pool][_staker];
      // uint index = indexing[_pool][_staker];
      staking_record[_pool][_staker][index] = _amount;
      staked_at[_pool][_staker][index] = block.timestamp;
      staking_count[_pool][_staker] ++;
      balances[_staker] += _amount;
    }
    //this validates staker for reward
    modifier validate_staker_for_reward(uint _pool, address _staker, uint _index){
      require(staking_record[_pool][_staker][_index] > 0,"User has not staked in first place to receive any reward or already received the award for that particular staking!");
      _;
    }
    //this checks the timelock for staking
    modifier check_timelock(uint _pool, address _staker, uint _index){
      uint since_staked = staked_at[_pool][_staker][_index] + time_lock;
      require( since_staked <= time_now(),"Fixed Stcking => Please wait for the staking time to get end and then try again to claim your reward!");
      _;
    }
    //this updates the record of staker after he received his rewawrd
    function update_record_after_reward(uint _pool, address _staker,uint _index, uint _amount) private{
      for (uint i=0; i < indexing[_pool][_staker].length; ++i) 
      {
        if (_index == indexing[_pool][_staker][i])
        {
          indexing[_pool][_staker][i] = 0;
        }
      }
      staking_record[_pool][_staker][_index] = 0;
      balances[_staker] -= _amount;
      staked_at[_pool][_staker][_index] = 0;
      staking_count[_pool][_staker] --;
      emit  staking_events(_pool, _staker, _amount,"user has unstaked the mentioned amount from a pool and has received reward!");
    }
   ///////////////functions
////function for staking in all 6 pools
    function staking_in_pool(uint _pool, IERC20 pool_address, address _staker, uint _amount) private 
              record_staking(_pool, _staker, _amount) validating_for_staking (_staker, pool_address, _amount)
      {
        if (_pool == 1 || _pool == 2 ||  _pool == 3)
        {
           require(_amount == fixed_staking_amount,
           "Fixed Staking=> Inappropiate staking amount, amount should be exactly equal to specified amount!");
        } 
        require(pool_address.transferFrom(_staker, address(this), _amount),"Unsuccesfull Staking!");
        emit  staking_events(_pool, _staker, _amount,"user has staked money in a pool!");
      }
////functions for reward calculation for both fixed and flexible
    function fixed_reward(uint _pool, IERC20 fixed_pool_address, address _staker, uint _index, uint _amount) private 
             check_timelock(_pool,_staker,_index) validate_staker_for_reward(_pool, _staker, _index) 
      {
        require(fixed_pool_address.transfer(_staker, _amount),"Fixed Staking => Something went wrong while refunding the staked amount!");
        emit  staking_events(_pool, _staker, _amount,"Fixed Staking => User has withdrawan the staked amount successfully!");
        require(reward_token.transfer(_staker, fixed_pool_reward),"Fixed Staking => Something went wrong while sending the reward to staker!");
        emit  staking_events(_pool, _staker, fixed_pool_reward,"Fixed Staking => User has successfully received award token!");
        update_record_after_reward(_pool, _staker, _index,_amount);
        // (bool check, ) = _staker.call{value: _amount}(""); 
        // require(check,"Unsuccessful unstaking!");
      }
      
    function flexible_reward(uint _pool, IERC20 flexible_pool_address, address _staker, uint _index) private
             check_timelock(_pool,_staker,_index) validate_staker_for_reward(_pool, _staker, _index) 
      {
        uint staked_amount = staking_record[_pool][_staker][_index];
        uint when_staked = staked_at[_pool][_staker][_index];
        uint reward_amount = calculate_reward(staked_amount, when_staked);
        require(flexible_pool_address.transfer(_staker, staked_amount),"Flexible Staking => Something went wrong while refunding the staked amount!");
        emit  staking_events(_pool, _staker, staked_amount,"Flexible Staking => User has withdrawan the staked amount successfully!");
        require(reward_token.transfer(_staker, reward_amount),"Flexible Staking => Something went wrong while sending the reward to staker!");
        emit  staking_events(_pool, _staker, reward_amount,"Flexible Staking => User has successfully received award token!");
        update_record_after_reward(_pool, _staker, _index,staked_amount);
      }
      function calculate_reward(uint _amount, uint staked_time)private view returns (uint)
      {
        uint since_staked = time_now() - staked_time;
        uint add_percentage ;
        if (since_staked >= level_1 && since_staked < level_2)
        {
          add_percentage ++;
        }
        else if (since_staked >= level_2 && since_staked < level_3)
        {
          add_percentage += 2;
        }
        else if (since_staked > level_3)
        {
          add_percentage += 3;
        }
        else {
          add_percentage = 0;
        }
        uint percentile = flexible_reward_percentage + add_percentage;
        return (( percentile * _amount ) / 100);
      }

//// This is the implementation of staking in each pool!!
    function staking (uint _pool, uint amount) public {
      address staker = msg.sender;
      require( 0 < _pool && _pool <= 6,"Pool doesn't exist!");
      staking_in_pool(_pool, staking_pool_index[_pool], staker, amount);
    }
    function reward(uint _pool,uint _index) public{
      address staker = msg.sender;
      uint amount = fixed_staking_amount;
      if (_pool == 1 || _pool == 2 || _pool == 3)
      {
        fixed_reward(_pool, staking_pool_index[_pool], staker, _index, amount);
      }
      else if (_pool == 4 || _pool == 5 || _pool == 6)
      {
        flexible_reward(_pool, staking_pool_index[_pool], staker, _index);
      }
      else {
        require( 0 < _pool && _pool <= 6,"Pool doesn't exist!");
      } 
    }
    function time_now() public view returns (uint) {
      return block.timestamp;
    }
    function staking_amount_on_fixed_pool() public view returns (uint){
      return fixed_staking_amount;
    }
    function staking_reward_on_fixed_pool() public view returns (uint){
      return fixed_pool_reward;
    }
    function TimeLock_on_fixed_pool() public view returns (uint){
      return time_lock;
    }
    function amount_staked(uint _pool, uint _index) public view returns(uint)
    {
      return staking_record[_pool][msg.sender][_index];
    }
    function time_when_staked(uint _pool, uint _index) public view returns(uint)
    {
      return staked_at[_pool][msg.sender][_index];
    }
function time_when_reward_will_receive(uint _pool, uint _index) public view returns(bool)
    {
      if (staked_at[_pool][msg.sender][_index] + time_lock > time_now())
      {
        return false;
      }
      else 
      { 
        return true;
      }    
    }
    function staking_count_per_pool(uint _pool) public view returns(uint)
    {
      return staking_count[_pool][msg.sender];
    }
    function staker_indexex_per_pool(uint _pool) public view returns(uint [] memory)
    {
      return indexing[_pool][msg.sender];
    }
    function total_staking_all_pools() public view returns(uint)
    {
      return balances[msg.sender];
    }
}