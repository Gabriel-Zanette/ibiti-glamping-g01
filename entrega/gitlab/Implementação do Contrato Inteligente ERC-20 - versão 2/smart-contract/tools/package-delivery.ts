import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
import { zipSync, unzipSync } from 'fflate';
import { root } from './compile.ts';

// Pacote autônomo; conserva módulos irmãos exigidos pelos imports e testes de integração.
const repo=resolve(root,'..');
const files:Record<string,Uint8Array>={};
function collect(folder:string) {
  for(const entry of readdirSync(resolve(repo,folder),{withFileTypes:true})) {
    if(['node_modules','build','data','.git','artifacts'].includes(entry.name) || entry.name.startsWith('.env')) continue;
    const path=folder+'/'+entry.name;
    if(entry.isDirectory()) collect(path);
    else if(/\.(sol|ts|js|json|md|html|css|svg)$/.test(entry.name) || entry.name==='LICENSE' || entry.name==='.gitignore') files[path]=readFileSync(resolve(repo,path));
  }
}
collect('smart-contract');collect('offchain');
for(const name of ['whitepaper/whitepaper_ibiti_revisado.md','whitepaper/README.md','whitepaper/render_whitepaper.py','whitepaper/validacao.json','output/pdf/whitepaper_ibiti_revisado.pdf']) files[name]=readFileSync(resolve(repo,name));
files['README.md']=readFileSync(resolve(root,'docs/README-entrega.md'));
const manifest=Object.keys(files).sort().map(path=>createHash('sha256').update(files[path]).digest('hex')+'  '+path).join('\n')+'\n';
files['MANIFEST.sha256']=Buffer.from(manifest);
const archive=zipSync(files,{level:9});
const check=unzipSync(archive);
if(Object.keys(check).length!==Object.keys(files).length || Object.keys(check).some(p=>/(^|\/)(node_modules|data|\.env[^/]*|\.git)(\/|$)|\.sqlite/.test(p))) throw Error('Pacote inválido');
const delivery=resolve(repo,'entrega/gitlab/Implementação do Contrato Inteligente ERC-20 - versão 2');
// Escreve somente arquivos incluídos, sem apagar conteúdo alheio de entregas existentes.
for(const [path,content]of Object.entries(files)) {
  const target=resolve(delivery,path);mkdirSync(dirname(target),{recursive:true});writeFileSync(target,content);
}
const output=resolve(repo,'entrega/IBITI-Implementacao-v2.zip');mkdirSync(dirname(output),{recursive:true});writeFileSync(output,archive);
console.log(JSON.stringify({directory:delivery,archive:output,files:Object.keys(files).length,sha256:createHash('sha256').update(archive).digest('hex')},null,2));
