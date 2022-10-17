// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract Flexible_Pool_5 is ERC20 {
    constructor() ERC20('Flexible-P5' , 'FLX5')
    {
        _mint(msg.sender, 10000 * 10**18);
    }
}