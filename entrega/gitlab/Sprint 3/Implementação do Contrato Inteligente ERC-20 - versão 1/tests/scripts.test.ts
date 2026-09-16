import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import * as ethers from 'ethers';
import { localChain } from '../tools/local-chain.ts';
import { artifact, root } from '../tools/compile.ts';

for (const layout of ['root', 'legacy']) test('Scripts Remix publicam e operam com artefatos '+layout,async t=>{
  const chain=await localChain();t.after(()=>chain.stop());
  const files:Record<string,string>={};
  for(const [path,name] of [['contracts/artifacts/IBIToken.json','IBIToken'],['contracts/mocks/artifacts/MockStablecoin.json','MockStablecoin']]) {
    const a=artifact(name);const file=layout==='root'?'artifacts/'+name+'.json':path;files[file]=JSON.stringify({abi:a.abi,data:{bytecode:{object:a.bytecode}}});
  }
  let account=chain.signers[0].address;
  const context={ethers,web3Provider:{request:({method,params=[]}:{method:string,params?:unknown[]})=>method==='eth_accounts'?Promise.resolve([account]):chain.provider.send(method,params)},
    remix:{call:async(_plugin:string,method:string,path:string,content?:string)=>{if(method==='setFile'){files[path]=content!;return;}if(!(path in files))throw Error('Arquivo ausente: '+path);return files[path];}},console:{log(){},error(){}}};
  const run=(name:string,changes:Record<string,string>={})=>{
    let source=readFileSync(root+'scripts/'+name,'utf8');
    for(const [from,to]of Object.entries(changes))source=source.replace(from,to);
    return new vm.Script(source,{filename:name}).runInNewContext(context,{timeout:5000});
  };
  const record=await run('01_publicar.js');assert.equal(record.supply,'150');
  const result=await run('02_operar.js');assert.equal(result.supply,'150');
  await run('02_operar.js',{"acao: 'status'":"acao: 'compra'","destino: ''":`destino: '${chain.signers[1].address}'`,"quantidade: '1'":"quantidade: '5'"});
  await run('02_operar.js',{"acao: 'status'":"acao: 'reporte'"});
  account=chain.signers[1].address;
  await run('02_operar.js',{"acao: 'status'":"acao: 'saque'"});
  const stable=new ethers.Contract(record.stablecoin,artifact('MockStablecoin').abi,chain.provider);
  assert.equal(await stable.balanceOf(account),5_000_000n);
  account=chain.signers[0].address;
  await run('02_operar.js',{"acao: 'status'":"acao: 'recuperacao'","origem: ''":`origem: '${chain.signers[1].address}'`,"destino: ''":`destino: '${chain.signers[2].address}'`});
  const token=new ethers.Contract(record.token,artifact('IBIToken').abi,chain.provider);
  assert.equal(await token.balanceOf(chain.signers[2].address),5n);
  await run('02_operar.js',{"acao: 'status'":"acao: 'pausar'"});assert.equal(await token.paused(),true);
  await run('02_operar.js',{"acao: 'status'":"acao: 'retomar'"});assert.equal(await token.paused(),false);
});
