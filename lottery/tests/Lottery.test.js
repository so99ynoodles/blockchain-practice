const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const { abi, evm } = require("../compile");

const web3 = new Web3(ganache.provider());
const ONE_MILLION = "1000000";

let accounts;
let contract;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  contract = await new web3.eth.Contract(abi)
    .deploy({
      data: evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: ONE_MILLION });
});

describe("Lottery", () => {
  it("successfully deploys a contract", () => {
    assert.ok(contract.options.address);
  });

  it("allows a player to enter", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await contract.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(1, players.length);
  });

  it("allows multiple players to enter", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await contract.methods.enter().send({
      from: accounts[1],
      value: web3.utils.toWei("0.02", "ether"),
    });
    await contract.methods.enter().send({
      from: accounts[2],
      value: web3.utils.toWei("0.02", "ether"),
    });

    const players = await contract.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(accounts[1], players[1]);
    assert.strictEqual(accounts[2], players[2]);
    assert.strictEqual(3, players.length);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await contract.methods.enter().send({
        from: accounts[0],
        value: 0,
      });
      assert(false, "could not catch any error.");
    } catch (error) {
      assert(error);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await contract.methods.pickWinner().send({
        from: accounts[1],
      });
      assert(false, "could not catch any error.");
    } catch (error) {
      assert(error);
    }
  });

  it("sends money to the winner and resets players array", async () => {
    await contract.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei("2", "ether"),
    });

    const initialBalance = await web3.eth.getBalance(accounts[0]);

    await contract.methods.pickWinner().send({
      from: accounts[0],
    });

    const finalBalance = await web3.eth.getBalance(accounts[0]);

    const difference = finalBalance - initialBalance;
    assert(difference > web3.utils.toWei("1.8", "ether"));

    const players = await contract.methods.getPlayers().call({
      from: accounts[0],
    });

    assert.strictEqual(players.length, 0);
  });
});
