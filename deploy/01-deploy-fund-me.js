// function deployFunc(){
// console.log("hi");
// }

// module.exports.default = deployFunc

// const { network } = require("hardhat")

// hre = hardhat runtime environment

// module.exports = async (hre) => {
// const {getNamedAccounts,deployments} = hre
// hre.getNamedAccounts
// hre.deployments
// }

const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

// // OR we can use the following
// const helperConfig = require("../helper-hardhat-config")
// const networkConfig = helperConfig.networkConfig

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  // if chainId is x use address y
  // if chainId is a use address b
  // for this functionality we make use of the aave

  // const ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  let ethUsdPriceFeedAddress
  if(developmentChains.includes(network.name)){
    const ethUsdAggregator = await deployments.get("MockV3Aggregator")
    ethUsdPriceFeedAddress = ethUsdAggregator.address
  } else {
    ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
  }

  //  if the contract doesnt exist we deploy the minimal version of it for our local testing

  // const args = 
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args: [ethUsdPriceFeedAddress],
    // put price feed address here
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1
  })
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    // verify
    await verify(fundMe.address, [ethUsdPriceFeedAddress])
  }
  log("________________________________________________________________")
}

module.exports.tags = ["all", "fundMe"]
