const { ethers } = require("hardhat");
const { deployMaxlihToken } = require("../scripts/deployMaxlihToken.js");
const { createPair, USDT_TOKEN_ADDRESS } = require("../scripts/createPair.js");
const { expect } = require("chai");
const UniswapV2Router = require("@uniswap/v2-periphery/build/UniswapV2Router02.json");
const UniswapV2Pair = require("@uniswap/v2-core/build/UniswapV2Pair.json");
const IERC20 = require("@uniswap/v2-core/build/IERC20.json")

const SEPARATOR = "==============================================";

const START_BALANCE_MAXLIH_TOKEN = 2_000_000
const START_BALANCE_USDT = 1_000_000


const AMOUNT_MAXLIH_TOKEN_DESIRED = 10_000
const AMOUNT_USDT_TOKEN_DESIRED = 10_000

const USDT_TOKEN_MIN_AMOUNT_EXCHANGE = 10
const MAXLIH_TOKEN_SWAP_AMOUNT = 100

const UNISWAP_V2_ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const USDT_WHALE_ADDRESS = "0x5754284f345afc66a98fbb0a0afe71e0f007b949"

describe("MaxlihToken test", function () {
  it("deploy MaxlihToken", async function () {
    console.log(SEPARATOR);

    const [owner] = await ethers.getSigners();
    const maxlihToken = await deployMaxlihToken(START_BALANCE_MAXLIH_TOKEN);
    const balance = await maxlihToken.balanceOf(owner.address);

    console.log(`MaxlihToken address: ${maxlihToken.address}`);
    console.log(`MaxlihToken balance: ${balance.toString()}`);

    expect(balance).to.equal(START_BALANCE_MAXLIH_TOKEN);

    console.log(SEPARATOR);
  });

  it("create uniswap pair and make an exchange", async function () {
    console.log(SEPARATOR);

    const [owner] = await ethers.getSigners();
    const maxlihToken = await deployMaxlihToken(START_BALANCE_MAXLIH_TOKEN);

    const impersonatedSigner = await ethers.getImpersonatedSigner(USDT_WHALE_ADDRESS);
    const usdtContractImpersonated = await ethers.getContractAt(IERC20.abi, USDT_TOKEN_ADDRESS, impersonatedSigner);
    await usdtContractImpersonated.transfer(owner.address, START_BALANCE_USDT)

    expect(await usdtContractImpersonated.balanceOf(owner.address)).to.equal(START_BALANCE_USDT);

    const pairAddress = await createPair(maxlihToken.address)
    const uniswapV2PairContract = await ethers.getContractAt(UniswapV2Pair.abi, pairAddress, owner);
    const uniswapV2RouterContract = await ethers.getContractAt(UniswapV2Router.abi, UNISWAP_V2_ROUTER_ADDRESS, owner);

    console.log(`uniswap pair factory contract address: ${uniswapV2PairContract.address}`);
    console.log(`uniswap router contract address: ${uniswapV2RouterContract.address}`);

    const blockNumber = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumber);
    const blockTimestamp = block.timestamp;
    const deadline = blockTimestamp + 60 * 20;

    const usdtContract = await ethers.getContractAt(IERC20.abi, USDT_TOKEN_ADDRESS, owner);

    await usdtContract.approve(UNISWAP_V2_ROUTER_ADDRESS, AMOUNT_USDT_TOKEN_DESIRED)
    await maxlihToken.approve(UNISWAP_V2_ROUTER_ADDRESS, AMOUNT_MAXLIH_TOKEN_DESIRED)

    await uniswapV2RouterContract.addLiquidity(
        maxlihToken.address,
        USDT_TOKEN_ADDRESS,
        AMOUNT_MAXLIH_TOKEN_DESIRED,
        AMOUNT_USDT_TOKEN_DESIRED,
        0,
        0,
        owner.address,
        deadline
    );

    const pairTotalSupply = await uniswapV2PairContract.totalSupply();

    console.log(`uniswap pair contract total supply: ${pairTotalSupply.toString()}\n`);

    expect(pairTotalSupply).to.equal(AMOUNT_MAXLIH_TOKEN_DESIRED);

    console.log("swap MaxlihToken to USDT");

    const maxlihTokenBalanceBefore = await maxlihToken.balanceOf(owner.address);
    const usdcBalanceBefore = await usdtContract.balanceOf(owner.address);

    console.log("MaxlihToken balance before:" + maxlihTokenBalanceBefore);
    console.log("USDT balance before:" + usdcBalanceBefore);

    await maxlihToken.approve(
        UNISWAP_V2_ROUTER_ADDRESS,
        MAXLIH_TOKEN_SWAP_AMOUNT
    );
    await uniswapV2RouterContract.swapExactTokensForTokens(
        MAXLIH_TOKEN_SWAP_AMOUNT,
        USDT_TOKEN_MIN_AMOUNT_EXCHANGE,
        [maxlihToken.address, USDT_TOKEN_ADDRESS],
        owner.address,
        deadline
    );

    const maxlihTokenBalanceAfter = await maxlihToken.balanceOf(owner.address);
    const usdtBalanceAfter = await usdtContract.balanceOf(owner.address);

    console.log("MaxlihToken balance after:" + maxlihTokenBalanceAfter);
    console.log("USDT balance after:" + usdtBalanceAfter);

    expect(maxlihTokenBalanceBefore.sub(maxlihTokenBalanceAfter)).to.equal(MAXLIH_TOKEN_SWAP_AMOUNT)
    expect(usdtBalanceAfter.sub(usdcBalanceBefore).toNumber()).to.greaterThanOrEqual(USDT_TOKEN_MIN_AMOUNT_EXCHANGE)

    console.log(SEPARATOR);
  })
});