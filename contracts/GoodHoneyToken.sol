// ERC20Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GoodHoneyToken is ERC20 {
constructor() public ERC20("Good Honey", "GHN") {
    _mint(msg.sender, 1e24);
 }
}