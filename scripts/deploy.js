const {ethers} = require("hardhat");

async function deploy(deployer, start_balance) {
  const Token = await ethers.getContractFactory("MaxlihToken");
  const token = await Token.deploy('MaxlihToken', 'MT', start_balance);

  return token.address
}

module.exports = { deploy }