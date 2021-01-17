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
});
