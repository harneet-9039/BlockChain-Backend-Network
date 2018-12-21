const Block = require('./block');



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
});
