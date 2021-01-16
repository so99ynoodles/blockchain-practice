require("dotenv").config();

const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const { abi, evm } = require("./compile");

const provider = new HDWalletProvider({
  mnemonic: process.env.MNEMONIC,
  providerOrUrl: process.env.API_ENDPOINT,
});
const web3 = new Web3(provider);
const ONE_MILLION = "1000000";
const DEFAULT_MESSAGE = "Hello World";

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("Attempting to deploy from account ", accounts[0]);
  const result = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [DEFAULT_MESSAGE],
    })
    .send({ from: accounts[0], gas: ONE_MILLION });

  console.log("Contract successfully deployed to ", result.options.address);
};

deploy();
