var escrow = artifacts.require("./Escrow.sol");
module.exports = function(deployer) {
  deployer.deploy(escrow,"0x8A753747A1Fa494EC906cE90E9f37563A8AF630e");
};

