const assert = require('assert');
const ganache=require('ganache-cli');
const Web3= require('web3');

const web3=new Web3(ganache.provider());

const compiledFactory=require('../ethereum/build/CampaignFactory.json');
const compiledCampaign=require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;


beforeEach(async()=>{
    accounts=await web3.eth.getAccounts();
    factory=await new web3.eth.Contract(compiledFactory.abi).
    deploy({
        data:compiledFactory.evm.bytecode.object
    }).
    send({from:accounts[1],
    gas:'3000000'});

    await factory.methods.createCampaign('100').send({
        from:accounts[1],
        gas:'3000000'
    });

//    const addresses= await factory.methods.getDeployedCampaigns().call();
//    campaignAddress=addresses[0]
    [campaignAddress]= await factory.methods.getDeployedCampaigns().call();
  // console.log('address',campaignAddress)
   campaign=await new web3.eth.Contract(compiledCampaign.abi,campaignAddress)
});

describe('Campaign', () => {
    it('deploys factory and campaign',()=>{
        assert.ok(factory.options.address);
        
    });

    it('manager',async()=>{
        const manager=await campaign.methods.manager().call();
        assert.equal(accounts[1],manager);
    })

    it('contribute',async()=>{
        const manager=await campaign.methods.contribute().send({
            value:'200',
            from:accounts[1]
        });
        const isApproved=await campaign.methods.approvers(accounts[1]).call();
        assert(isApproved);
    });

    it('requires minimium contribution',async()=>{
        try {
            await campaign.methods.contribute().send({
                value:'5',
                from:accounts[0]
            });
            assert(false)
        } catch (err) {
            assert(err)
        }
    });

    it('manager craetes account',async()=>{
        await campaign.methods.createRequest(
            'hello',
            '100',
            accounts[2]
        ).send({
            from:accounts[1],
            gas:'1000000'
        });

        const request=await campaign.methods.requests(0).call();
        assert.equal('hello',request.description);
    });

    it('processes request',async()=>{
        await campaign.methods.contribute().send({
            value:web3.utils.toWei('10','ether') ,
            from:accounts[1]
        });

        await campaign.methods.createRequest(
            'hello',
            web3.utils.toWei('5','ether'),
            accounts[2]
        ).send({
            from:accounts[1],
            gas:'1000000'
        });
        
        await campaign.methods.approveRequest(0).send({
            gas:'1000000',
            from:accounts[1]
        });

        await campaign.methods.finalizeRequest(0).send({
            gas:'1000000',
            from:accounts[1]
        })
        let balance=await web3.eth.getBalance(accounts[2]);
        balance=parseFloat(web3.utils.fromWei(balance, 'ether'));
        console.log(balance)
        assert(balance>103)
    })
})
