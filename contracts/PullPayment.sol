// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;
import "./SafeMath.sol";
contract PullPayment {
  using SafeMath for uint256;
  mapping (address => uint256) public payments;
  uint256 public totalPayments;
  /**
  * @dev Called by the payer to store the sent amount as credit to be pulled.
  * @param dest The destination address of the funds.
  * @param amount The amount to transfer.
  */
  function asyncSend(address dest, uint256 amount) internal {
      payments[dest] = payments[dest].add(amount);
      totalPayments = totalPayments.add(amount);
  }
  /**
  * @dev withdraw accumulated balance, called by payee.
  */
  function withdrawPayments() public payable {
      require(payments[msg.sender] != 0);
      totalPayments = totalPayments.sub(payments[msg.sender]);
      payments[msg.sender] = 0;
      payable(msg.sender).transfer(payments[msg.sender]);
  }
}