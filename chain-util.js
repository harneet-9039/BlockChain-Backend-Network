const EC = require('elliptic').ec;
const uuidV1 = require('uuid/v1'); //uuid based on timestamp
const ec = new EC('secp256k1');
const SHA256 = require('crypto-js/SHA256');
class ChainUtil {
  static genKeyPair(){
    return ec.genKeyPair(); //get public and private key
  }

  static id(){
    return uuidV1();
  }

  static hash(data)
  {
    return SHA256(JSON.stringify(data)).toString();
  }

  static verifySignature(publicKey, signature, dataHash){
    return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature); //to verify the signature using public key
    
  }
}

module.exports = ChainUtil;
