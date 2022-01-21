import web3 from "./web3";
import campaign from "./build/Campaign.json";

const returnInstance = (address) => {
  const Instance = new web3.eth.Contract(campaign.abi, address);
  return Instance;
};

export default returnInstance;
