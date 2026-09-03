# IBITI Glamping · Tokenização — entregas do Grupo G01 (Sprint 3)

Repositório de trabalho do **Grupo G01** no módulo **ADMD7 — Blockchain, criptomoedas e tokenização de ativos**
(Inteli), projeto parceiro **IBITI (Ibiti Projeto)**. Reúne os dois artefatos da Sprint 3 em revisão pelo grupo
antes da publicação oficial no GitLab da disciplina.

| Artefato | Pasta | O que tem |
|---|---|---|
| **Implementação do Contrato Inteligente ERC-20 — versão 1** | [`smart-contract/`](smart-contract/README.md) | contrato `IBIToken` (Solidity, OpenZeppelin 5), 50 testes automatizados, fluxo de demonstração, módulos de deploy (local e Sepolia), documentação em português |
| **Guia de Comunicação** | [`guia-de-comunicacao/`](guia-de-comunicacao/README.md) | documento estratégico, landing page animada e páginas de detalhe, board visual com o fluxo compra → recebimento → resgate tela a tela, telas em SVG (Figma) e PNG, tasks para o issue board |

## Como ver rapidamente

- **Landing page** (uma página, cinco seções com animação de rolagem): abra
  [`guia-de-comunicacao/landing/index.html`](guia-de-comunicacao/landing/index.html) no navegador.
  Páginas de detalhe: `como-funciona.html`, `perguntas.html`, `transparencia.html` na mesma pasta.
- **Board do guia** (princípios, tom de voz, terminologia, telas anotadas, mensagens do sistema):
  [`guia-de-comunicacao/board/index.html`](guia-de-comunicacao/board/index.html).
- **Telas para o Figma**: arraste os arquivos de [`guia-de-comunicacao/mockups/svg/`](guia-de-comunicacao/mockups/svg/)
  para o Figma (vetores e textos editáveis); PNGs de referência em `mockups/png/`.
- **Contrato**: `cd smart-contract && npm install && npm test` (Node.js 22+). Guia completo em
  [`smart-contract/docs/guia-de-execucao.md`](smart-contract/docs/guia-de-execucao.md).

## Base conceitual

Whitepaper Técnico do Ativo Digital (Sprint 2), Entendimento da Experiência do Usuário (Sprint 1) e Riscos
Éticos e Impacto (Sprint 2), no GitLab do grupo. As decisões tomadas na implementação que ainda precisam ser
ratificadas pelo grupo, e as inconsistências encontradas nos artefatos anteriores, estão em
[`smart-contract/docs/premissas-e-pendencias.md`](smart-contract/docs/premissas-e-pendencias.md).

## Estado

Versão em revisão interna (02/09/2026). Nada aqui foi entregue ainda no GitLab. Os textos das telas e a
landing seguem a versão 1.3 do guia; números de preço e projeção são hipóteses do valuation, não promessas.
