// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract Fixed_Pool_3 is ERC20 {
    constructor() ERC20('Fixed-P3' , 'FXD3')
    {
        _mint(msg.sender, 10000 * 10**18);
    }
}