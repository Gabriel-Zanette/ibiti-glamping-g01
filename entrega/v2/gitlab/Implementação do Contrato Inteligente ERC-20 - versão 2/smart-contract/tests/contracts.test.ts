import { test } from 'node:test';
import assert from 'node:assert/strict';
import { artifact } from '../tools/compile.ts';
import { localChain } from '../tools/local-chain.ts';

test('Mesmas suites Solidity do Remix, executadas em Anvil', async t => {
  const chain=await localChain();t.after(()=>chain.stop());
  for(const name of ['TokenTest','GovernanceTest','RoyaltiesTest','SettlementTest']) {
    const suite=await chain.deploy(name);
    for(const f of artifact(name).abi.filter((f:any)=>f.type==='function' && f.name.startsWith('test'))) {
      await t.test(`${name}: ${f.name}`,async()=>{
        await(await suite.beforeEach()).wait();
        assert.equal(await suite[f.name].staticCall(),true);
        if(!['view','pure'].includes(f.stateMutability)) {
          const receipt=await(await suite[f.name]()).wait();assert.equal(receipt.status,1);
        }
      });
    }
  }
});
