import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
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
  return /\.(sol|ts|js|cjs|mjs|json|md|html|css|svg|jpg|jpeg|png|webp|pdf|py|csv|sha256)$/.test(name)
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
for (const folder of ['smart-contract', 'offchain', 'guia-de-comunicacao/landing', 'docs']) collect(repo, folder, files);
files['README.md'] = readFileSync(resolve(root, 'docs/README-entrega.md'));
files['output/pdf/IBIToken-Guia-Deploy-Evidencias-v2.pdf'] = readFileSync(resolve(repo, 'output/pdf/IBIToken-Guia-Deploy-Evidencias-v2.pdf'));
files['FONTE.json'] = Buffer.from(JSON.stringify({
  officialRelease: 'v2', status: 'em-preparacao', internalRevision: 4,
  sourceBaseCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' }).trim(),
  includesWorkingTree: true,
  note: 'O commit-base não inclui necessariamente as mudanças locais. MANIFEST.sha256 identifica os bytes empacotados; não há afirmação de novo deploy público.'
}, null, 2) + '\n');
for (const required of ['smart-contract/contracts/IBIToken.sol', 'smart-contract/contracts/OpeningCalendar.sol', 'offchain/public/portal.html', 'offchain/.env.portal.example', 'guia-de-comunicacao/landing/index.html', 'guia-de-comunicacao/landing/assets/territorio-referencia.jpg']) {
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
remix['README.md'] = Buffer.from(`# IBIToken — fontes Remix para a v2 em preparação\n\nRevisão técnica interna v4; somente a v1 oficial foi publicada. Importar contracts/, scripts/ e tests/ juntos. Solidity 0.8.34, EVM Osaka, otimizador 200, viaIR habilitado. Bibliotecas OpenZeppelin 5.6.1 vendorizadas.\n\nCompilar IBIToken.sol e mocks/MockStablecoin.sol. O script 01_publicar.js começa em rede local e bloqueia Sepolia por padrão. Conferir rede, moeda e preço antes de qualquer publicação. 02_operar.js usa o registro gerado pela publicação. Registrar a abertura simulada uma vez antes de comprar. Recuperação exige sete dias; não é possível acelerar a rede pública.\n\nEste pacote é somente para o Remix. A aplicação e os testes de integração exigem o ZIP IBITI-Implementacao-v2.zip, que preserva smart-contract/, offchain/ e a landing como módulos irmãos.\n\nGovernança conjunta, pausa seletiva e recuperação integrada continuam pendentes. Não atribuir as novas funções a endereços históricos.\n`);
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
