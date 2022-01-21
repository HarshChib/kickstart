const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory=require('../ethereum/build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'stay dice major shoot kid monitor slogan spoil flee barrel drop drastic',
  'https://rinkeby.infura.io/v3/17819c9b126641dbb4e04774f70ee960'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
    let result;
  try {
     result =await new web3.eth.Contract(compiledFactory.abi).
    deploy({
        data:compiledFactory.evm.bytecode.object
    }).
    send({from:accounts[0],
    gas:'3000000'});
  } catch (error) {
      console.log(error)
  }
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
