const BlockChain = require('./index');
const Block = require('./block');
describe('Blockchain',()=>{
  let bc, bc2;

  beforeEach(()=>{
    bc = new BlockChain();
    bc2 = new BlockChain();
  });

  it('starts with the genesis block',()=>{
    expect(bc.chain[0]).toEqual(Block.genesis());
  });

  it('adds a new block',()=>{
    const data = 'foo';
    bc.addBlock(data);

    expect(bc.chain[bc.chain.length-1].data).toEqual(data);
  });

  it('validates a valid chain',()=>{
    bc2.addBlock('foo');

    expect(bc.isValidChain(bc2.chain)).toBe(true);
  });

  it('invalidate a chain with a corrupt genesis block',()=>{
      bc2.chain[0].data = 'Bad data';
      expect(bc.isValidChain(bc2.chain)).toBe(false);
  });

  it('invalidate a corrupt chain',()=>{
    bc2.addBlock('foo');
    bc2.chain[1].data = "Not foo";

    expect(bc.isValidChain(bc2.chain)).toBe(false);
  });


  it('replaces a chain with a valid change',()=>{
    bc2.addBlock('goo');

    bc.replaceChain(bc2.chain);

    expect(bc.chain).toEqual(bc2.chain);
  });

  it('does not change the chain less than the previous chain',()=>{
    bc.addBlock('foo');

    bc.replaceChain(bc2.chain);

    expect(bc.chain).not.toEqual(bc2.chain);
  });

});
