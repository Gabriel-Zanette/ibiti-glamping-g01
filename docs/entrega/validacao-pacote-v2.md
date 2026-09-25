# Validação da preparação oficial v2

Rodada de 25/09/2026, anterior ao commit da estrutura de entrega e da revisão de interface. A preparação permanece incompleta do ponto de vista de governança, integrações e PDFs finais; estes resultados verificam o código e o pacote disponíveis, não um novo deploy público.

## Fonte canônica

- `npm test --prefix smart-contract`: 57 testes, 57 aprovados, zero falhas. Inclui suítes Solidity em Anvil, regressões do feedback, integração das cotas/portal, compra institucional, scripts Remix e royalties por tempo, inclusive apuração com 150 titulares.
- `npm test --prefix offchain`: 28 testes, 28 aprovados, zero falhas.
- `npm run typecheck --prefix smart-contract` e `npm run typecheck --prefix offchain`: concluídos sem erros.

## Cópia extraída do ZIP

O ZIP de implementação foi extraído em diretório isolado, sem reutilizar os módulos da raiz. As dependências foram instaladas ali com `npm ci --ignore-scripts --no-audit --no-fund` nos dois módulos.

- Compilação das fontes extraídas: Solidity 0.8.34+commit.80d5c536.Emscripten.clang, Osaka, viaIR, otimizador 200; concluída.
- Os 28 testes off-chain passaram novamente nessa cópia.
- As duas verificações TypeScript passaram nessa cópia.
- O servidor da cópia extraída iniciou em porta isolada e respondeu 200, com conteúdo não vazio, para `/`, `/conta`, `/portal.js`, `/portal.css`, `/simulation` e `/assets/territorio-referencia.jpg`.
- Manifesto SHA-256 e conteúdo do ZIP foram conferidos. Não foram incluídos banco, configuração privada, sessão, node_modules ou chave de execução; os `.env.*.example` são apenas modelos.

A suíte completa do contrato foi executada na fonte canônica; não foi repetida integralmente na cópia extraída. A conferência do manifesto identifica os mesmos arquivos de código. As alterações finais de memória e documentação foram incorporadas ao regenerar os pacotes, sem alterar o comportamento testado.

## Escopo editorial

As três pastas do GitLab estão visíveis em `entrega/v2/gitlab/`. O PDF final de evidências em inglês e o memorando final em português ainda serão adicionados pelos responsáveis. O PDF de guia em `apoio/` é preparação, não evidência de operações públicas. A estrutura da primeira entrega permanece preservada.

Os pilares administrativos e a custódia serão retomados para remodelagem por solicitação de Gabriel. Essa intenção foi registrada sem apresentar o desenho atual como definitivo ou implementar novas regras durante o empacotamento.
