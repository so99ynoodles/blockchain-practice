const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const compiledCampaignFactory = require("../build/CampaignFactory.json");
const compiledCampaign = require("../build/Campaign.json");

const web3 = new Web3(ganache.provider());
const THREE_MILLION = "3000000";

let accounts;
let factoryContract;
let campaignAddress;
let campaignContract;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  factoryContract = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({
      data: compiledCampaignFactory.evm.bytecode.object,
    })
    .send({ from: accounts[0], gas: THREE_MILLION });

  await factoryContract.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: THREE_MILLION });

  [
    campaignAddress,
  ] = await factoryContract.methods.getDeployedCampaigns().call();
  campaignContract = await new web3.eth.Contract(
    compiledCampaign.abi,
    campaignAddress
  );
});

describe("Campaign", () => {
  it("successfully deploys contracts", () => {
    assert.ok(factoryContract.options.address);
    assert.ok(campaignContract.options.address);
  });

  it("marks caller as a campaign manager", async () => {
    const manager = await campaignContract.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaignContract.methods.contribute().send({
      value: "200",
      from: accounts[1],
    });

    const isContributer = await campaignContract.methods
      .approvers(accounts[1])
      .call();

    assert(isContributer);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaignContract.methods.contribute().send({
        value: "50",
        from: accounts[1],
      });
      assert(false);
    } catch (error) {
      assert(true);
    }
  });

  it("allows a manager to make a payment request", async () => {
    const description = "Buy computers";
    await campaignContract.methods
      .createRequest(description, "100", accounts[1])
      .send({ from: accounts[0], gas: THREE_MILLION });
    const request = await campaignContract.methods.requests(0).call();
    assert.strictEqual(description, request.description);
  });

  it("processes requests", async () => {
    await campaignContract.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaignContract.methods
      .createRequest("description", web3.utils.toWei("5", "ether"), accounts[1])
      .send({ from: accounts[0], gas: THREE_MILLION });
    await campaignContract.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: THREE_MILLION });
    await campaignContract.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: THREE_MILLION });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.toWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
