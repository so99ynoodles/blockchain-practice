const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contract = "Lottery.sol";
const lotteryPath = path.resolve(process.cwd(), "contracts", contract);
const content = fs.readFileSync(lotteryPath, "utf-8");

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
const { Lottery } = output.contracts[contract];

module.exports = Lottery;
