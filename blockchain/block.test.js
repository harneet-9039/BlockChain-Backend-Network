const Block = require('./block');
const { DIFFICULTY } = require('../config');


describe('Block',()=>{
  let data, lastBlock, block;
  beforeEach(()=>{
    data = 'temp data';
    lastBlock = Block.genesis();
    block = Block.mineBlock(lastBlock,data);
  });
  it('sets the `data` to match the input',()=>{
    expect(block.data).toEqual(data);
  });

  it('sets the `last hash` to match the hash of the last block',()=>{
    expect(block.lastHash).toEqual(lastBlock.hash);
  });

  it('generates a hash that matches the difficulty',()=>{
    expect(block.hash.substring(0,DIFFICULTY)).toEqual('0'.repeat(DIFFICULTY));
    console.log(block.toString());
  });
});
