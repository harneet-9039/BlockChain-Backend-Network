const Wallet = require('../wallet');
const Transaction = require('../wallet/transaction');

class Miner{
    constructor(blockchain, transactionPool, wallet, p2pServer){
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.p2pServer = p2pServer;
    }

    //intermediate btw blockchain and transactions
    mine(){
        const validTransactions = this.transactionPool.validTransactions();

        //include a reward for the miner
        validTransactions.push(Transaction.rewardTransaction(this.wallet,Wallet.blockchainWallet()));
        
        //create a block consisting of the valid transactions
        const block = this.blockchain.addBlock(validTransactions);

        // sync chains in p2p server
        this.p2pServer.syncChains();

        //clear the transaction pool
        this.transactionPool.clear();

        //broadcast to every miner to clear their transaction pools
        this.p2pServer.broadcastClearTransactions();

        return block;

    }
}

module.exports = Miner;