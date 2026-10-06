# Implementação do Contrato Inteligente ERC-20 — versão 2

IBITI Glamping · Grupo G01 · segunda entrega acadêmica em preparação. A revisão interna v4 identifica o desenvolvimento destinado à versão oficial v2.

## Conteúdo

- `smart-contract/`: contratos, bibliotecas licenciadas, scripts Remix, compilação e testes.
- `offchain/`: portal, landing, cadastro, compras, livro de cotas e testes.
- [Execução e contas de demonstração](docs/EXECUCAO.md).
- [Modelo, evolução da v1 e limitações](docs/MODELO-E-LIMITES.md).

## Executar

Node.js 24+. Na raiz desta pasta:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run demo:portal --prefix offchain
```

Abrir `http://localhost:3000/`. A demonstração cria rede Anvil e banco isolados, com pessoas e moeda fictícias. Acessos e sequência de compra estão no guia. `Ctrl+C` encerra a demonstração. Manter as duas pastas irmãs para executar integrações.

## Escopo

150 IBT indivisíveis, reserva inicial de 50, teto agregado de 20 por pessoa, compra primária atômica, ausência de mercado secundário, royalties proporcionais ao tempo e oito semestres desde a abertura. Cotas de hospedagem ficam no serviço externo; cancelamento é manual.

Governança conjunta, pausa seletiva, contestação integrada e custódia comercial permanecem pendentes, detalhadas no documento de modelo. Os testes locais não comprovam essas funcionalidades nem substituem evidências em rede pública.

`MANIFEST.sha256` identifica os arquivos; `FONTE.json` registra a origem e os ajustes de empacotamento. Históricos, planos internos, PDFs de referência, roteiros e vídeos ficam fora deste artefato. Evidências públicas estão na pasta própria de Deploy. A atualização desta cópia é feita pelo empacotador do repositório de trabalho.
