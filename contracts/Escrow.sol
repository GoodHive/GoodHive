// SPDX-License-Identifier: MIT
pragma solidity 0.8.1;
import "./SafeMath.sol";
import "./GoodHoneyToken.sol";
import "./UsdcToken.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract Escrow {
  using SafeMath for uint256;
  
  constructor(address _ethUsdAdress) public {
      tokenGHN = new GoodHoneyToken();
      tokenUSDC = new UsdcToken();
      ethUsdAdress = _ethUsdAdress;
  } 

  function balanceOfToken() external view returns(uint256) {
      return ERC20(tokenGHN).balanceOf(msg.sender);
  }
  
  address ethUsdAdress; // rinkeby = 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e;
  GoodHoneyToken public tokenGHN;
  UsdcToken public tokenUSDC;
  mapping (address => uint256) public payments;
  uint256 public totalPayments;
  /**
  * @dev Called by the payer to store the sent amount as credit to be pulled.
  * @param dest The destination address of the funds.
  * @param amount The amount to transfer.
  */
  function asyncSend(address dest, uint256 amount) internal {
      uint usdPrice = getUsdPrice(amount);
      payments[dest] = payments[dest].add(usdPrice);
      totalPayments = totalPayments.add(usdPrice);
  }
  /**
  * @dev withdraw accumulated balance, called by payee.
  */
  function withdrawPaymentsUSDC(address dest) public payable {
      require(payments[dest] != 0);
      totalPayments = totalPayments.sub(payments[dest]);
      uint amount = payments[dest]; // 10 GHNY = 1 USDC
      payments[dest] = 0;
      tokenUSDC.transfer(dest,amount);
  }

  function withdrawPaymentsGHNY(address dest) public payable {
      require(payments[dest] != 0);
      totalPayments = totalPayments.sub(payments[dest]);
      uint amount = payments[dest] * 10;
      payments[dest] = 0;
      tokenGHN.transfer(dest,amount);
  }

  function SendMoneyTo(address dest, uint256 amount) public {
      asyncSend(dest, amount);
  }

  function getThePrice(address chainlinkAddress) internal view returns (uint) {
        (uint80 roundID,int price,uint startedAt,uint timeStamp,uint80 answeredInRound) = AggregatorV3Interface(chainlinkAddress).latestRoundData();
        return uint(price);
  }

  function getUsdPrice(uint amount) public view returns (uint) {
      uint price = 259700618610; //getThePrice(ethUsdAdress);
      uint usdPrice = amount * price * 1e10;      
      return usdPrice;
  }
}