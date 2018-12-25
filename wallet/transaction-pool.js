class TransactionPool{
    constructor(){
        this.transactions=[];
    }

    updateOrAddTransaction(transaction){
        let TransactionWithId = this.transactions.find(t=>t.id===transaction.id);

        if(TransactionWithId){
            this.transactions[this.transactions.indexOf(TransactionWithId)] = transaction;
        }
        else{
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address){
        return this.transactions.find(t=>t.input.address === address);
    }
}

module.exports = TransactionPool;