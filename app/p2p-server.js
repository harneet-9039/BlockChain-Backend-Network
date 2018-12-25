const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];

//for message handler
const MESSAGE_TYPES ={
  chain: 'CHAIN',
  transaction: 'TRANSACTION',
  clear_transactions: 'CLEAR_TRANSACTIONS'
};
class P2pServer{
  constructor(blockchain, transactionPool){
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }

  listen(){
    const server = new Websocket.Server({port: P2P_PORT});
    server.on('connection', socket=>this.connectSocket(socket));

    this.connectToPeers();
    console.log(`listening for p2p connections on ${P2P_PORT}`);
  }

  connectToPeers(){
    peers.forEach(peer=>{
      const socket = new Websocket(peer);

      socket.on('open',()=>this.connectSocket(socket));
    });
  }

  connectSocket(socket){
    this.sockets.push(socket);
    console.log('socket connected');

    this.messageHandler(socket);
    this.sendChain(socket);

  }
  //updating this method as this message handler updates the chain
  //by replacing it, which comes to contrary when transaction object is being sent to it
  messageHandler(socket){
    socket.on('message',message=>{
      const data = JSON.parse(message);

      switch(data.type){
        case MESSAGE_TYPES.chain:
        this.blockchain.replaceChain(data.chain);
        break;
        case MESSAGE_TYPES.transaction:
        this.transactionPool.updateOrAddTransaction(data.transaction);
        break;
        case MESSAGE_TYPES.clear_transactions:
        this.transactionPool.clear();
        break;
      }
    });
  }

  sendChain(socket)
  {
        socket.send(JSON.stringify({
          type: MESSAGE_TYPES.chain,
          chain: this.blockchain.chain}));
  }

  sendTransaction(socket, transaction){
    socket.send(JSON.stringify({
     type: MESSAGE_TYPES.transaction,
      transaction
    }));
  }
  syncChains(){
    this.sockets.forEach(socket=>this.sendChain(socket));
  }

  broadcastTransaction(transaction){
    this.sockets.forEach(socket=> this.sendTransaction(socket, transaction));
  }

  broadcastClearTransactions(transaction){
    this.sockets.forEach(socket=> socket.send(JSON.stringify({
      type: MESSAGE_TYPES.clear_transactions
    })));
  }
}

module.exports = P2pServer;
