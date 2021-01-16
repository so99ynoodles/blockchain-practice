const path = require("path");
const fs = require("fs");
const solc = require("solc");

const contract = "Inbox.sol";
const inboxPath = path.resolve(process.cwd(), "contracts", contract);
const content = fs.readFileSync(inboxPath, "utf-8");

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
const { Inbox } = output.contracts[contract];

module.exports = Inbox;
