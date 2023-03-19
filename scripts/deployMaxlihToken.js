const { deploy } = require("./deploy.js");
const {ethers} = require("hardhat");

async function deployMaxlihToken(start_balance) {
    const [owner] = await ethers.getSigners();
    const maxlihTokenAddress = await deploy(owner, start_balance)

    return ethers.getContractAt("MaxlihToken", maxlihTokenAddress, owner);
}

module.exports = { deployMaxlihToken }