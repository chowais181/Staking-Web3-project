require("@nomicfoundation/hardhat-chai-matchers");
require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY = "RMYjx8eg9j60VUPI-q-d1kazC7s3aWD2";

// Replace this private key with your Goerli account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const GOERLI_PRIVATE_KEY =
  "de5c465f9187fbeeca2f105d602e205fb52e556378757522c60bba697c002693";

module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY],
    },
    
  },
  etherscan: {
    apiKey: "2KI4GAYDKH4RJHKP4W8F7BB2S449WG9R9X",
  },
};
