const Transacation = require('./transaction');

const Wallet = require('./index');

describe('Transaction',()=>{
 let transaction, wallet, recipient, amount;

 beforeEach(()=>{
    wallet = new Wallet();
    amount=50;
    recipient = 'r3c1p13n';
    transaction = Transacation.newTransaction(wallet, recipient, amount);
 });

 it('outputs the `amount` subtracted from the wallet balance',()=>{
    expect(transaction.outputs.find(output=>output.address==wallet.publicKey).amount)
    .toEqual(wallet.balance-amount);
 });

 /*it('outputs the `amount` added to the recipient',()=>{
    expect(transaction.outputs.find(output=>output.address=recipient).amount)
    .toEqual(amount);
 });*/

 it('validates the valid trans',()=>{
   expect(Transacation.verifyTransaction(transaction)).toBe(true);
 });

 it('invalidates the corrupt trans',()=>{
   transaction.outputs[0].amount = 50000;
   expect(Transacation.verifyTransaction(transaction)).toBe(false);
 });

 describe('add updating a transaction',()=>{
   let nextAmount, nextRecipient;

   beforeEach(()=>{
      nextAmount=20;
      nextRecipient = 'n3xt-4ddr355';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
   });

   it('subtracts the next amount the sender output',()=>{
      expect(transaction.outputs.find(output=> output.address===wallet.publicKey).amount).toEqual(wallet.balance-amount-nextAmount);
   });

   it('it output an amount for the next recipient',()=>{
      expect(transaction.outputs.find(output=>output.address===nextRecipient).amount).toEqual(nextAmount);
   });
 });
});