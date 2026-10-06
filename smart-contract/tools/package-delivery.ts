import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { zipSync, unzipSync } from 'fflate';
import { root } from './compile.ts';

// A preparação v2 conserva os módulos irmãos exigidos pelo servidor e pelos testes.
// Somente fontes e recursos permitidos entram no pacote; estado local fica de fora.
const repo = resolve(root, '..');
const delivery = resolve(repo, 'entrega/v2');
const implementationName = 'Implementação do Contrato Inteligente ERC-20 - versão 2';
const implementation = resolve(delivery, 'gitlab', implementationName);
type Files = Record<string, Uint8Array>;
const excludedDirectories = new Set(['node_modules', 'build', 'data', '.git', '.superpowers', 'artifacts', 'cache', 'coverage', 'dist', 'types']);
const examples = new Set(['.env.example', '.env.portal.example']);
function permitted(name: string) {
  if (name.startsWith('.env')) return examples.has(name);
  if (/(?:\.sqlite(?:-.+)?|\.pem|\.key)$/.test(name) || name === 'resume-private.json') return false;
  return /\.(sol|ts|js|cjs|mjs|json|md|html|css|svg|jpg|jpeg|png|webp|pdf|py|csv|sha256|mp4|srt)$/.test(name)
    || ['LICENSE', '.gitignore', '.gitkeep'].includes(name);
}
function collect(base: string, folder = '', files: Files = {}): Files {
  for (const entry of readdirSync(resolve(base, folder), { withFileTypes: true })) {
    if (excludedDirectories.has(entry.name)) continue;
    const path = folder ? folder + '/' + entry.name : entry.name;
    if (entry.isDirectory()) collect(base, path, files);
    else if (entry.isFile() && permitted(entry.name)) files[path] = readFileSync(resolve(base, path));
  }
  return files;
}
const sha256 = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
function manifest(files: Files): Buffer {
  return Buffer.from(Object.keys(files).sort().map(path => sha256(files[path]) + '  ' + path).join('\n') + '\n');
}
function writeFiles(destination: string, files: Files) {
  for (const [path, bytes] of Object.entries(files)) {
    const target = resolve(destination, path);
    if (!target.startsWith(destination + '/')) throw Error('Caminho inválido: ' + path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, bytes);
  }
}
function archive(name: string, files: Files) {
  const zip = zipSync(files, { level: 9 });
  const reopened = unzipSync(zip);
  if (Object.keys(reopened).length !== Object.keys(files).length) throw Error('ZIP incompleto');
  for (const [path, bytes] of Object.entries(reopened)) {
    if (sha256(bytes) !== sha256(files[path])) throw Error('ZIP divergente: ' + path);
    if (path.split('/').some(part => excludedDirectories.has(part) || (part.startsWith('.env') && !examples.has(part)))) throw Error('Arquivo privado no pacote: ' + path);
  }
  const target = resolve(delivery, 'pacotes', name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, zip);
  return { file: relative(repo, target), files: Object.keys(files).length, sha256: sha256(zip) };
}

for (const required of ['README.md', 'gitlab/README.md', 'apoio/README.md']) {
  if (!existsSync(resolve(delivery, required))) throw Error('Estrutura de preparação ausente: entrega/v2/' + required);
}
const files: Files = {};
for (const folder of ['smart-contract', 'offchain']) collect(repo, folder, files);
// A entrega contém somente a implementação vigente. Histórico, planos, referências
// e produção de vídeo/PDF continuam no repositório de trabalho, fora deste artefato.
for (const path of Object.keys(files)) {
  if (path.startsWith('smart-contract/docs/') || path.startsWith('smart-contract/deployments/')
    || /^smart-contract\/tools\/(package-|video-)/.test(path)
    || ['smart-contract/README.md', 'offchain/README.md', 'offchain/PORTAL.md'].includes(path)) delete files[path];
}
const deliveryDocs: Record<string, string> = {
  'docs/EXECUCAO.md': 'execucao.md',
  'docs/MODELO-E-LIMITES.md': 'modelo-e-limites.md',
  'smart-contract/README.md': 'contrato.md',
  'offchain/README.md': 'portal.md',
};
for (const [target, source] of Object.entries(deliveryDocs)) files[target] = readFileSync(resolve(repo, 'docs/entrega/implementacao-v2', source));
const contractPackage = JSON.parse(Buffer.from(files['smart-contract/package.json']).toString('utf8'));
delete contractPackage.scripts['package:delivery'];
delete contractPackage.scripts['package:remix'];
files['smart-contract/package.json'] = Buffer.from(JSON.stringify(contractPackage, null, 2) + '\n');
// A landing pertence ao portal no pacote. O guia editorial permanece fora da implementação.
const landingFiles = collect(resolve(repo, 'guia-de-comunicacao/landing'));
for (const [path, bytes] of Object.entries(landingFiles)) {
  if (path !== 'README.md') files['offchain/public/landing/' + path] = bytes;
}
const apiPath = 'offchain/src/api.ts';
const apiSource = Buffer.from(files[apiPath]).toString('utf8');
if (!apiSource.includes('../../guia-de-comunicacao/landing/')) throw Error('Caminho canônico da landing mudou; revisar empacotamento.');
files[apiPath] = Buffer.from(apiSource.replace('../../guia-de-comunicacao/landing/', '../public/landing/'));
// Retira somente cópias geradas; os originais permanecem no repositório.
for (const obsolete of ['output', 'guia-de-comunicacao', 'docs', 'smart-contract/docs', 'smart-contract/deployments', 'offchain/PORTAL.md', 'offchain/public/landing/README.md']) rmSync(resolve(implementation, obsolete), {recursive: true, force: true});
for (const name of ['package-delivery.ts', 'package-remix.ts', 'video-console.ts', 'video-console.html', 'video-evidence.ts']) rmSync(resolve(implementation, 'smart-contract/tools', name), {force: true});
files['README.md'] = readFileSync(resolve(root, 'docs/README-entrega.md'));

files['FONTE.json'] = Buffer.from(JSON.stringify({
  officialRelease: 'v2', status: 'em-preparacao', internalRevision: 4,
  sourceBaseCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
  includesWorkingTree: true,
  note: 'MANIFEST.sha256 identifica o conteúdo, inclusive mudanças locais. Documentação selecionada para entrega; histórico e ferramentas editoriais ficam no repositório. Landing relocada para offchain/public/landing com caminho normalizado em api.ts. Scripts de empacotamento removidos do package.json desta cópia. Evidências públicas ficam no artefato próprio.'
}, null, 2) + '\n');
for (const required of ['smart-contract/contracts/IBIToken.sol', 'smart-contract/contracts/OpeningCalendar.sol', 'offchain/public/portal.html', 'offchain/.env.portal.example', 'offchain/public/landing/index.html', 'offchain/public/landing/assets/territorio-referencia.jpg']) {
  if (!files[required]) throw Error('Recurso obrigatório ausente: ' + required);
}
files['MANIFEST.sha256'] = manifest(files);
writeFiles(implementation, files);

const support: Record<string, string> = {
  'guia-deploy-e-evidencias-v2.md': 'docs/entrega/guia-deploy-e-evidencias-v2.md',
  'roteiro-minimo-relatorio-onchain-en.md': 'docs/entrega/roteiro-minimo-relatorio-onchain-en.md',
  'registro-evidencias-modelo.csv': 'docs/entrega/registro-evidencias-modelo.csv',
  'IBIToken-Guia-Deploy-Evidencias-v2.pdf': 'output/pdf/IBIToken-Guia-Deploy-Evidencias-v2.pdf',
  'feedback-memorando-v2.md': 'docs/decisoes/2026-09-25-feedback-memorando-v2.md',
  'pendencias-para-retomada.md': 'docs/decisoes/2026-09-25-pendencias-para-retomada.md',
};
writeFiles(resolve(delivery, 'apoio'), Object.fromEntries(Object.entries(support).map(([name, source]) => [name, readFileSync(resolve(repo, source))])));

const remix: Files = {};
for (const [path, bytes] of Object.entries(files)) {
  if (/^smart-contract\/(contracts\/.*|scripts\/.*\.js|tests\/.*\.sol)$/.test(path)) remix[path.slice('smart-contract/'.length)] = bytes;
}
remix['README.md'] = Buffer.from(`# IBIToken — fontes Remix para a v2 em preparação\n\nRevisão técnica interna v4; somente a v1 oficial foi publicada. Importar contracts/, scripts/ e tests/ juntos. Solidity 0.8.34, EVM Osaka, otimizador 200, viaIR habilitado. Bibliotecas OpenZeppelin 5.6.1 vendorizadas.\n\nCompilar IBIToken.sol e mocks/MockStablecoin.sol. O script 01_publicar.js começa em rede local e bloqueia Sepolia por padrão. Conferir rede, moeda e preço antes de qualquer publicação. 02_operar.js usa o registro gerado pela publicação. Registrar a abertura simulada uma vez antes de comprar. Recuperação exige sete dias; não é possível acelerar a rede pública.\n\nEste pacote é somente para o Remix. A aplicação e os testes de integração exigem o ZIP IBITI-Implementacao-v2.zip, que preserva smart-contract/ e offchain/ como módulos irmãos, com a landing em offchain/public/landing/.\n\nGovernança conjunta, pausa seletiva e recuperação integrada continuam pendentes. Não atribuir as novas funções a endereços históricos.\n`);
remix['MANIFEST.sha256'] = manifest(remix);
writeFiles(resolve(delivery, 'remix'), remix);
const outputs = [archive('IBITI-Implementacao-v2.zip', files), archive('IBITI-Remix-v2.zip', remix)];

// Os PDFs/recibos que o grupo adicionar às outras pastas são preservados.
const complete: Files = {};
for (const folder of ['gitlab', 'apoio', 'remix']) collect(delivery, folder, complete);
complete['README.md'] = readFileSync(resolve(delivery, 'README.md'));
complete['MANIFEST.sha256'] = manifest(complete);
writeFileSync(resolve(delivery, 'MANIFEST.sha256'), complete['MANIFEST.sha256']);
outputs.push(archive('IBITI-Entrega-v2.zip', complete));
console.log(JSON.stringify({ directory: relative(repo, delivery), status: 'em-preparacao', outputs }, null, 2));
