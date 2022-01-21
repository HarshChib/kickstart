const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");
 
// get path to build folder
const buildPath = path.resolve(__dirname, "build");
// delete build folder
fs.removeSync(buildPath);
 
// get path to Campaigns.sol
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
// read campaign file
const source = fs.readFileSync(campaignPath, "utf8");
// compile contracts and get contracts
let input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ['*'],
      },
    },
  },
};
// const output = solc.compile(output, 1);
const output = JSON.parse(solc.compile(JSON.stringify(input)));
 console.log(output);
// create build folder
const contracts=output.contracts['Campaign.sol'];
fs.ensureDirSync(buildPath);

// Extract and write the JSON representations of the contracts to the build folder.
for (let contract in contracts) {
  if (contracts.hasOwnProperty(contract)) {
    fs.outputJsonSync(path.resolve(buildPath, `${contract}.json`), contracts[contract]);
  }
}