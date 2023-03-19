const {ethers} = require("hardhat");
const UniswapV2Factory = require("@uniswap/v2-core/build/UniswapV2Factory.json");

const UNISWAP_V2_FACTORY_MAINNET_ADDRESS = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
const USDT_TOKEN_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

async function createPair(myTokenAddress) {
    const [signer] = await ethers.getSigners();

    const contract = await ethers.getContractAt(UniswapV2Factory.abi, UNISWAP_V2_FACTORY_MAINNET_ADDRESS, signer);

    const pairTransaction = await contract.createPair(myTokenAddress, USDT_TOKEN_ADDRESS)
    const pairInfo = await pairTransaction.wait();
    const pair = pairInfo.events.find(event => event.event === 'PairCreated');

    return pair.args.pair;
}

module.exports = { USDT_TOKEN_ADDRESS, createPair }