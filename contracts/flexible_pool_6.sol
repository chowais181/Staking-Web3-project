// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract Flexible_Pool_6 is ERC20 {
    constructor() ERC20('Flexible-P6' , 'FLX6')
    {
        _mint(msg.sender, 10000 * 10**18);
    }
}