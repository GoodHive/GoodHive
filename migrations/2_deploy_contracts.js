var pullPayment = artifacts.require("./PullPayment.sol");

module.exports = function(deployer) {
  deployer.deploy(pullPayment );
};

