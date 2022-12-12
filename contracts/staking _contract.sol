// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// contract stakingContract{
//   uint time_lock;
//   uint fixed_staking_amount = 1 ether;
//   uint fixed_pool_reward = 0.1 ether;
//   uint flexible_reward_percentage;
//   IERC20  reward_token;
//   mapping (uint => IERC20) staking_pool_index;
//   uint random_number;
//   uint level_1;
//   uint level_2;
//   uint level_3;

//   mapping (address => uint) balances;
//   mapping (uint => mapping(address => mapping(uint =>uint ))) staked_at;
//   mapping (uint => mapping(address => uint)) staking_count;
//   mapping (uint => mapping(address => uint[])) indexing_per_pool;
//   mapping (uint => mapping(address => mapping(uint =>uint ))) staking_record ;
//   // we will be assigning 6 IERC20 stacing and 1 reward IERC20 rewarding token in the constructor! 
//   constructor(address[] memory pool_addresses, address reward_contract, uint reward_percentage, uint time_lock_in_seconds)
//     {
//       for ( uint i=0; i < pool_addresses.length ; ++i )
//       {
//         staking_pool_index[i+1] = IERC20(pool_addresses[i]);
//       }
//       reward_token = IERC20(reward_contract);
//       flexible_reward_percentage = reward_percentage;
//       time_lock = time_lock_in_seconds;
//       level_1 = time_lock_in_seconds * 5;
//       level_2 = time_lock_in_seconds * 10;
//       level_3 = time_lock_in_seconds * 15;

//     }
//   /////////events
//   event staking_events(uint indexed _pool, address indexed  _staker, uint indexed  _amount, string  _message);

//   ////////////////modifiers
//   //this validates staker for reward
//   modifier validate_staker_for_reward(uint _pool, address _staker, uint _index){
//     require(staking_record[_pool][_staker][_index] > 0,"User has not staked in first place to receive any reward or already received the award for that particular staking!");
//     _;
//   }
//   //this checks the timelock for staking
//   modifier check_timelock(uint _pool, address _staker, uint _index){
//     uint since_staked = staked_at[_pool][_staker][_index] + time_lock;
//     require( since_staked <= block.timestamp,"Fixed Stcking => Please wait for the staking time to get end and then try again to claim your reward!");
//     _;
//   }
//   //this updates the record of staker after he received his rewawrd
//   function update_record_after_reward(uint _pool, address _staker,uint _index, uint _amount) private{
//     uint length = indexing_per_pool[_pool][_staker].length;
//     uint[] memory arr = indexing_per_pool[_pool][_staker];
//     for (uint i=0; i < length; ++i) 
//     {
//       if (_index == arr[i])
//       {
//         arr[i] = 0;
//       }
//     }
//     indexing_per_pool[_pool][_staker] = arr;
//     staking_record[_pool][_staker][_index] = 0;
//     balances[_staker] -= _amount;
//     staked_at[_pool][_staker][_index] = 0;
//     staking_count[_pool][_staker] --;
//     emit  staking_events(_pool, _staker, _amount,"user has unstaked the mentioned amount from a pool and has received reward!");
//   }
//   ///////////////functions
// ////function for staking in all 6 pools
//   function staking_in_pool(uint _pool, IERC20 pool_address, address _staker, uint _amount) private 
//     {
//       require(_amount< pool_address.balanceOf(_staker),"Staking amount is exceeding user Balance!");
//       require(_amount > 0,"not enough amount for staking!!");
//       if (_pool == 1 || _pool == 2 ||  _pool == 3)
//       {
//           require(_amount == fixed_staking_amount,
//           "Fixed Staking=> Inappropiate staking amount, amount should be exactly equal to specified amount!");
//       } 
//       require(pool_address.transferFrom(_staker, address(this), _amount),"Unsuccesfull Staking!");
//       emit  staking_events(_pool, _staker, _amount,"user has staked money in a pool!");
//       random_number ++;
//       uint index = random_number;
//       indexing_per_pool[_pool][_staker].push(index); 
//       staking_record[_pool][_staker][index] = _amount;
//       staked_at[_pool][_staker][index] = block.timestamp;
//       staking_count[_pool][_staker] ++;
//       balances[_staker] += _amount;
//     }
// ////functions for reward calculation for both fixed and flexible
//   function fixed_reward(uint _pool, IERC20 fixed_pool_address, address _staker, uint _index, uint _amount) private 
//             check_timelock(_pool,_staker,_index) validate_staker_for_reward(_pool, _staker, _index) 
//     {
//       require(fixed_pool_address.transfer(_staker, _amount),"Fixed Staking => Something went wrong while refunding the staked amount!");
//       emit  staking_events(_pool, _staker, _amount,"Fixed Staking => User has withdrawan the staked amount successfully!");
//       require(reward_token.transfer(_staker, fixed_pool_reward),"Fixed Staking => Something went wrong while sending the reward to staker!");
//       emit  staking_events(_pool, _staker, fixed_pool_reward,"Fixed Staking => User has successfully received award token!");
//       update_record_after_reward(_pool, _staker, _index,_amount);
//     }
    
//   function flexible_reward(uint _pool, IERC20 flexible_pool_address, address _staker, uint _index) private
//             check_timelock(_pool,_staker,_index) validate_staker_for_reward(_pool, _staker, _index) 
//     {
//       uint staked_amount = staking_record[_pool][_staker][_index];
//       uint when_staked = staked_at[_pool][_staker][_index];
//       uint reward_amount = calculate_reward(staked_amount, when_staked);
//       require(flexible_pool_address.transfer(_staker, staked_amount),"Flexible Staking => Something went wrong while refunding the staked amount!");
//       emit  staking_events(_pool, _staker, staked_amount,"Flexible Staking => User has withdrawan the staked amount successfully!");
//       require(reward_token.transfer(_staker, reward_amount),"Flexible Staking => Something went wrong while sending the reward to staker!");
//       emit  staking_events(_pool, _staker, reward_amount,"Flexible Staking => User has successfully received award token!");
//       update_record_after_reward(_pool, _staker, _index,staked_amount);
//     }

//   function calculate_reward(uint _amount, uint staked_time)private view returns (uint)
//   {
//     uint since_staked = block.timestamp - staked_time;
//     uint add_percentage ;
//     if (since_staked >= level_1 && since_staked < level_2)
//     {
//       add_percentage ++;
//     }
//     else if (since_staked >= level_2 && since_staked < level_3)
//     {
//       add_percentage += 2;
//     }
//     else if (since_staked > level_3)
//     {
//       add_percentage += 3;
//     }
//     else {
//       add_percentage = 0;
//     }
//     uint percentile = flexible_reward_percentage + add_percentage;
//     return (( percentile * _amount ) / 100);
//   }

// //// This is the implementation of staking in each pool!!
//   function staking (uint _pool, uint amount) public {
//     address staker = msg.sender;
//     require( 0 < _pool && _pool <= 6,"Pool doesn't exist!");
//     staking_in_pool(_pool, staking_pool_index[_pool], staker, amount);
//   }
// //// This is the implementation of reward claiming for each pool!!
//   function reward(uint _pool,uint _index) public{
//     address staker = msg.sender;
//     uint amount = fixed_staking_amount;
//     if (_pool == 1 || _pool == 2 || _pool == 3)
//     {
//       fixed_reward(_pool, staking_pool_index[_pool], staker, _index, amount);
//     }
//     else if (_pool == 4 || _pool == 5 || _pool == 6)
//     {
//       flexible_reward(_pool, staking_pool_index[_pool], staker, _index);
//     }
//     else {
//       require( 0 < _pool && _pool <= 6,"Pool doesn't exist!");
//     } 
//   }
//   function TimeLock_on_fixed_pool() public view returns (uint){
//     return time_lock;
//   }
//   function staker_indexex_per_pool(uint _pool) public view returns(uint [] memory)
//   {
//     return indexing_per_pool[_pool][msg.sender];
//   }
// }



contract stakingContract{
    uint time_lock;
    uint fixed_staking_amount = 1 ether;
    uint fixed_pool_reward = 0.1 ether;
    uint flexible_reward_percentage;
    IERC20 staking_address;
    IERC20  reward_token;
    uint random_number;
    uint level_1;
    uint level_2;
    uint level_3;
    
    enum Type{fixed_pool, flexible_pool}

    struct pool{
        uint pool_id;
        Type pool_type;
    }

    mapping (uint => pool) pools;
    mapping (address => uint) balances;
    mapping (uint => mapping(address => mapping(uint =>uint ))) staked_at;
    mapping (uint => mapping(address => uint)) staking_count;
    mapping (uint => mapping(address => uint[])) indexing_per_pool;
    mapping (uint => mapping(address => mapping(uint =>uint ))) staking_record ;
    constructor(address staking_pool_address, address reward_contract, uint reward_percentage, uint time_lock_in_seconds)
      {
        staking_address = IERC20(staking_pool_address);
        reward_token = IERC20(reward_contract);
        flexible_reward_percentage = reward_percentage;
        time_lock = time_lock_in_seconds;
        level_1 = time_lock_in_seconds * 5;
        level_2 = time_lock_in_seconds * 10;
        level_3 = time_lock_in_seconds * 15;
      }
     
    function create_pool(uint _id, uint _type) public returns(uint){
        pool memory obj;
        obj.pool_id = _id;
        if( _type == 0 ){
          obj.pool_type = Type.fixed_pool;
        }
        else{
          obj.pool_type = Type.flexible_pool;
        }
        pools [_id] = obj; 
        return _id;
    }
    /////////events
    event staking_events(uint indexed _pool, address indexed  _staker, uint indexed  _amount, string  _message);

    ////////////////modifiers
    //this validates staker for reward
    modifier validate_staker_for_reward(uint _pool, address _staker, uint _index){
      require(staking_record[_pool][_staker][_index] > 0,"User has not staked in first place to receive any reward or already received the award for that particular staking!");
      _;
    }
    //this checks the timelock for staking
    modifier check_timelock(uint _pool, address _staker, uint _index){
      uint since_staked = staked_at[_pool][_staker][_index] + time_lock;
      require( since_staked <= block.timestamp,"Fixed Stcking => Please wait for the staking time to get end and then try again to claim your reward!");
      _;
    }
    //this updates the record of staker after he received his rewawrd
    function update_record_after_reward(uint _pool, address _staker,uint _index, uint _amount) private{
      for (uint i=0; i < indexing_per_pool[_pool][_staker].length; ++i) 
      {
        if (_index == indexing_per_pool[_pool][_staker][i])
        {
          indexing_per_pool[_pool][_staker][i] = 0;
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
      {
        require(_amount< pool_address.balanceOf(_staker),"Staking amount is exceeding user Balance!");
        require(_amount > 0,"not enough amount for staking!!");
        pool memory pool_obj = pools[_pool];
        if (pool_obj.pool_type == Type.fixed_pool)
        {
           require(_amount == fixed_staking_amount,
           "Fixed Staking=> Inappropiate staking amount, amount should be exactly equal to specified amount!");
        } 
        require(pool_address.transferFrom(_staker, address(this), _amount),"Unsuccesfull Staking!");
        emit  staking_events(_pool, _staker, _amount,"user has staked money in a pool!");
        random_number ++;
        uint index = random_number;
        indexing_per_pool[_pool][_staker].push(index); 
        staking_record[_pool][_staker][index] = _amount;
        staked_at[_pool][_staker][index] = block.timestamp;
        staking_count[_pool][_staker] ++;
        balances[_staker] += _amount;
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
        uint since_staked = block.timestamp - staked_time;
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
      pool memory object = pools[_pool];
      require(object.pool_id != 0,"Pool doesn't exist!");
      staking_in_pool(_pool, staking_address, staker, amount);
    }
//// This is the implementation of reward claiming for each pool!!
    function reward(uint _pool, uint _index) public{
      address staker = msg.sender;
      uint amount = fixed_staking_amount;
      pool memory pool_obj = pools[_pool];
      if ( pool_obj.pool_type == Type.fixed_pool )
      {
        fixed_reward(_pool, staking_address, staker, _index, amount);
      }
      else if ( pool_obj.pool_type == Type.flexible_pool )
      {
        flexible_reward(_pool, staking_address, staker, _index);
      }
      else {
        require( 0 < _pool && _pool <= 6,"Pool doesn't exist!");
      } 
    }
    function TimeLock_on_fixed_pool() public view returns (uint){
      return time_lock;
    }
    function staker_indexex_per_pool(uint _pool) public view returns(uint [] memory)
    {
      return indexing_per_pool[_pool][msg.sender];
    }
}