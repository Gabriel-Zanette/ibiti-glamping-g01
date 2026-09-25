import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { resolve, relative } from 'node:path';
const require = createRequire(import.meta.url);
const solc = require('solc');
export const root = fileURLToPath(new URL('../', import.meta.url));
export const settings = { viaIR: true, optimizer: { enabled: true, runs: 200 }, evmVersion: 'osaka', outputSelection: { '*': { '*': ['abi','evm.bytecode.object','evm.deployedBytecode.object'] } } };
let cached: any;
export function compile() {
  if (cached) return cached;
  const sources: Record<string,{content:string}> = {};
  function collect(folder:string) {
    for (const entry of readdirSync(resolve(root,folder),{withFileTypes:true})) {
      const path = `${folder}/${entry.name}`;
      if (entry.isDirectory()) collect(path);
      else if (entry.name.endsWith('.sol')) sources[path] = {content:readFileSync(resolve(root,path),'utf8')};
    }
  }
  collect('contracts'); collect('tests');
  const output = JSON.parse(solc.compile(JSON.stringify({language:'Solidity',sources,settings})));
  const errors = (output.errors ?? []).filter((e:any)=>e.severity==='error');
  if (errors.length) throw Error(errors.map((e:any)=>e.formattedMessage).join('\n'));
  for (const e of output.errors ?? []) console.warn(e.formattedMessage);
  mkdirSync(resolve(root,'build'),{recursive:true});
  for (const [file,contracts] of Object.entries(output.contracts) as [string,any][]) {
    for (const [name,c] of Object.entries(contracts) as [string,any][]) {
      if (!c.evm.bytecode.object) continue;
      const artifact={contractName:name,sourceName:file,abi:c.abi,bytecode:'0x'+c.evm.bytecode.object,deployedBytecode:'0x'+c.evm.deployedBytecode.object};
      writeFileSync(resolve(root,'build',name+'.json'),JSON.stringify(artifact,null,2)+'\n');
      if (c.evm.deployedBytecode.object.length/2 > 24576) throw Error(`${name}: bytecode excede limite EIP-170`);
    }
  }
  cached=output; return output;
}
export function artifact(name:string) { compile(); return JSON.parse(readFileSync(resolve(root,'build',name+'.json'),'utf8')); }
if (process.argv[1] && relative(root,resolve(process.argv[1]))==='tools/compile.ts') {
  compile();console.log(`Solidity ${solc.version()}: compilação concluída (Osaka, viaIR, otimizador 200).`);
}
