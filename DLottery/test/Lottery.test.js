const Lottery = artifacts.require('./Lottery.sol')

contract('Lottery', ([deployer, author]) => {
    let lottery;
    let accounts;
  beforeEach(async () => {
    accounts = web3.eth.getAccounts();
    
    lottery = await Lottery.deployed()
  });

  describe('Lottery Contract', async () => {
    it('deploys successfully', async () => {
      const address = await lottery.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    });

    it('allows one entery in the Lottery Pool at a time!!', async ()=>{
        console.log(lottery.address); 
        await lottery.enter(
            {from:'0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
                value: web3.utils.toWei('0.02','ether')
        }
        );
        await lottery.enter(
            {from: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
                value: web3.utils.toWei('0.02','ether')
        }
        );
        await lottery.enter(
            {from: '0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',
                value: web3.utils.toWei('0.02','ether')
        }
        );
        const players = await lottery.getPlayers();
        assert.equal('0x627306090abaB3A6e1400e9345bC60c78a8BEf57',players[0]);
        assert.equal('0xf17f52151EbEF6C7334FAD080c5704D77216b732',players[1]);
        assert.equal('0xC5fdf4076b8F3A5357c5E395ab970B5B54098Fef',players[2]);
        assert.equal(3,players.length);
    });

    it('requires a min amount of Ethers', async ()=>{
        try{
            await lottery.enter({
                from:'0x627306090abaB3A6e1400e9345bC60c78a8BEf57',
                value: 0
            });
            assert(false);
        }catch(err){
            assert.ok(err);
        }
    });

    it('only manager can call PickWinner', async () =>{
        try {
            await lottery.pickWinner({from: accounts[1]});
            assert(false);
        } catch (error) {
            assert(error);
        }
    });

    it('sends money to the winner', async ()=>{
        await lottery.enter({
            from: '0xf17f52151EbEF6C7334FAD080c5704D77216b732',
            value: web3.utils.toWei('2','ether')
        });
        var initialBalance = await web3.eth.getBalance('0xf17f52151EbEF6C7334FAD080c5704D77216b732');
        await lottery.pickWinner({from: '0x627306090abaB3A6e1400e9345bC60c78a8BEf57'});
        var finalBalance = await web3.eth.getBalance('0xf17f52151EbEF6C7334FAD080c5704D77216b732');
        var d = finalBalance - initialBalance;
        console.log(d,initialBalance,finalBalance);
        assert(d > web3.utils.toWei('1.8', 'ether')); 
    })


    
  })
})