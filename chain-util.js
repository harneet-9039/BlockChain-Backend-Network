const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class ChainUtil {
  static genKeyPair(){
    return ec.genKeyPair(); //get public and private key
  }
}

module.exports = ChainUtil;
