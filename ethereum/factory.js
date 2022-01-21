import web3 from "./web3";
import campaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    campaignFactory.abi,
    '0x865077Effb9C4e34B0de295d9995bee0596d15EC'
)

export default instance;