const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const contract = "Campaign.sol";
const campaignPath = path.resolve(process.cwd(), "contracts", contract);
const buildPath = path.resolve(process.cwd(), "build");
fs.removeSync(buildPath);

const content = fs.readFileSync(campaignPath, "utf-8");

var input = {
  language: "Solidity",
  sources: {
    [contract]: {
      content,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"],
      },
    },
  },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts[contract];

fs.ensureDirSync(buildPath);

for (let contract in contracts) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract + ".json"),
    contracts[contract]
  );
}
