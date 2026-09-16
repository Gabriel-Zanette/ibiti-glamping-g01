import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { zipSync, unzipSync } from 'fflate';
import { compile, root } from './compile.ts';

compile();
const files:Record<string,Uint8Array>={};
function collect(folder:string,filter:(file:string)=>boolean) {
  for(const e of readdirSync(resolve(root,folder),{withFileTypes:true})) {
    const file=folder+'/'+e.name;
    if(e.isDirectory())collect(file,filter);
    else if(filter(file))files[file]=readFileSync(resolve(root,file));
  }
}
collect('contracts',p=>p.endsWith('.sol')||p.endsWith('.md')||p.endsWith('/LICENSE'));
collect('scripts',p=>p.endsWith('.js'));
collect('tests',p=>p.endsWith('.sol')&&!p.includes('LegacyRedemptionFixture'));
files['README.md']=readFileSync(resolve(root,'docs/guia-de-execucao.md'));
files['docs/regras-de-negocio-para-contrato.md']=readFileSync(resolve(root,'docs/regras-de-negocio-para-contrato.md'));
const output=zipSync(files,{level:9});
const entries=Object.keys(unzipSync(output));
if(entries.length!==Object.keys(files).length || entries.some(p=>/node_modules|\.env|hardhat|ignition|\.sqlite|build\//i.test(p)))throw Error('Conteúdo inválido no pacote Remix');
const dir=resolve(root,'entrega');mkdirSync(dir,{recursive:true});
writeFileSync(resolve(dir,'IBITI-Remix.zip'),output);
for (const [path,content] of Object.entries(files)) {
  const target=resolve(dir,'IBITI-Remix',path);
  mkdirSync(resolve(target,'..'),{recursive:true});
  writeFileSync(target,content);
}
console.log(`Pacote Remix: ${resolve(dir,'IBITI-Remix.zip')} (${entries.length} arquivos).`);
