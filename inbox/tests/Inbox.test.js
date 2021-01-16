const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());
const ONE_MILLION = "1000000";
const DEFAULT_MESSAGE = "Hello World";
let accounts;
let contract;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  contract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
      arguments: [DEFAULT_MESSAGE],
    })
    .send({ from: accounts[0], gas: ONE_MILLION });
});

describe("Inbox", () => {
  it("successfully deploys a contract", () => {
    assert.ok(contract.options.address);
  });

  it("has a default message", async () => {
    const message = await contract.methods.message().call();
    assert.strictEqual(message, DEFAULT_MESSAGE);
  });

  it("setMessage modifies the message", async () => {
    const NEW_MESSAGE = "Bye World";
    await contract.methods.setMessage(NEW_MESSAGE).send({ from: accounts[0] });
    const message = await contract.methods.message().call();
    assert.strictEqual(message, NEW_MESSAGE);
  });
});
