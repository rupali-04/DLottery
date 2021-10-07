const Lottery = artifacts.require("Lottery");

module.exports = async function (deployer) {
  deployer.deploy(Lottery);
  const lottery = await Lottery.deployed();
  console.log(lottery.address)
};
