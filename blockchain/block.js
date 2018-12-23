
const SHA256 = require('crypto-js/SHA256');
const { DIFFICULTY, MINE_RATE } = require('../config');



class Block{
	constructor(timestamp, lastHash, hash, data, nonce, difficulty) {
		this.timestamp = timestamp;
		this.lastHash = lastHash;
		this.hash = hash;
		this.data = data;
		this.nonce = nonce;
		this.difficulty = difficulty || DIFFICULTY;
	}


	toString() {
		return `Block -
			Timestamp: ${this.timestamp}
			Last Hash: ${this.lastHash.substring(0,10)}
			Hash     : ${this.hash.substring(0,10)}
			Nonce    : ${this.nonce}
		Difficulty : ${this.difficulty}
			Data     : ${this.data}`;
	}

	static genesis() {
		return new this('Genesis time','-------','fir57-h45h',[],0, DIFFICULTY);
	}

	static mineBlock(lastBlock, data){
		let hash, timestamp;
		const lastHash = lastBlock.hash;
		let difficulty = lastBlock.difficulty;
		let nonce = 0;
		do{
		nonce++;
		timestamp = Date.now();
		hash = Block.hash(timestamp,lastHash,data, nonce);
	} while(hash.substring(0,DIFFICULTY)!== '0'.repeat(DIFFICULTY));

		return new this(timestamp, lastHash, hash, data, nonce);
	}

	static hash(timestamp, lastHash, data, nonce, difficulty)
	{
		return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
	}

	static blockHash(block){
		const {timestamp, lastHash, data, nonce, difficulty} = block;
		return Block.hash(timestamp,lastHash,data, nonce, difficulty);
	}
}

module.exports = Block;
