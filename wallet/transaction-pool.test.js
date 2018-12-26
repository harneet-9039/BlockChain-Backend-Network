const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const BLockChain = require('../blockchain');

describe('TransactionPool',()=>{
let tp, wallet, transaction, bc;

beforeEach(()=>{
tp= new TransactionPool();
wallet = new Wallet();
bc = new BLockChain();
transaction = wallet.createTransaction('r4nd-4dr355',30,bc,tp);
});

it('It adds a transaction the pool',()=>{
expect(tp.transactions.find(t=>t.id===transaction.id)).toEqual(transaction);
});

it('updates a transaction in the pool',()=>{
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355',40);
    tp.updateOrAddTransaction(newTransaction);

    expect(JSON.stringify(tp.transactions.find(t=>t.id===newTransaction.id))).not.toEqual(oldTransaction);
});

it('clear transactions',()=>{
    tp.clear();
    expect(tp.transactions).toEqual([]);
});

describe('mixing valid and corrupt transaction',()=>{
    let validTransactions;

    beforeEach(()=>{
        validTransactions = [...tp.transactions]; //adds one lement at a time to validTransactions array
        //add valid as well as corrupt transactions
        for(let i=0;i<6;i++){
        wallet = new Wallet();
        transaction = wallet.createTransaction('r4nd-4dr355',30,bc,tp);
        if(i%2==0){
            transaction.input.amount = 99999;
        } else{
            validTransactions.push(transaction);
        }
        }
    }); 

    it('shows the difference btw valid an corrupt transactions',()=>{
        expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
    });

    it('grabs vald transactions',()=>{
        expect(tp.validTransactions()).toEqual(validTransactions);
    });
});
});