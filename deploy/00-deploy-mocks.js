const { network, deployments, getNamedAccounts } = require("hardhat")
const {
  developmentChains,
  decimals,
  initialAnswer
} = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  const chainId = network.config.chainId

  if (developmentChains.includes(network.name)) {
    log("local network detected, Deploying mocks !")
    await deploy("MockV3Aggregator", {
      contract: "MockV3Aggregator",
      from: deployer,
      log: true,
      args: [decimals, initialAnswer]
    })
    log("Mocks Deployed!")
    log("________________________________________________________________")
  }
}

module.exports.tags = ["all", "mocks"]
