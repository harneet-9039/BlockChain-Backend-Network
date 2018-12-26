const ChainUtil = require('../chain-util');
const {INITIAL_BALANCE} = require('../config');
const Transaction = require('./transaction');
class Wallet {
  constructor(){
    this.balance = INITIAL_BALANCE;
    this.keyPair = ChainUtil.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode('hex');
  }

  toString(){
    return `Wallet -
     publicKey: ${this.publicKey.toString()}
     balance  : ${this.balance}`
  }

  sign(dataHash){
    return this.keyPair.sign(dataHash);
  }

  createTransaction(recipient, amount, blockchain, transactionPool){
  {
    this.balance = this.calculateBalance(blockchain);
    if(amount>this.balance)
    return;
  }

  let transaction = transactionPool.existingTransaction(this.publicKey);
  if(transaction){
    transaction.update(this, recipient, amount);
  }
  else{
    transaction = Transaction.newTransaction(this, recipient, amount);
    transactionPool.updateOrAddTransaction(transaction);
  }
  return transaction;
  }

  //calculate balance before every trans, as to see if user has sufficient balance or not
  // looking at the most recent transaction output where PK matches the user
  calculateBalance(blockchain){
    let balance = this.balance;
    let transactions = [];

    //for each block in blockchain

    blockchain.chain.forEach(block=> block.data.forEach(transaction=>{
    transactions.push(transaction);
    }));

    const WalletInputTs = transactions.filter(transaction => transaction.input.address === this.publicKey);
    let startTime = 0;
    if(WalletInputTs.length > 0){
    const recentInputT = WalletInputTs.reduce(
      (prev, curr) => prev.input.timestamp > current.input.timestamp? prev : current
    );

    balance = recentInputT.outputs.find(output=>output.address === this.publicKey).amount;
    startTime = recentInputT.input.timestamp;
    }

    transactions.forEach(transaction => {
      if(transaction.input.timestamp > startTime){
        transaction.outputs.find(output => {
      if(output.address === this.publicKey){
      balance+=output.amount;
}
        });
      }
    });

    return balance;
  }

  //create blockchain wallet for rewarding miners
  static blockchainWallet(){
    const blockchainWallet = new this();
    blockchainWallet.address = 'blockchain-wallet';
    return blockchainWallet;
  }

}

module.exports = Wallet;
