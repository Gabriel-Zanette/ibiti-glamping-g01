# Documentação do projeto — IBIToken (tokenização do IBITI Glamping)

> **Decisões em revisão, 22/09/2026:** [entrevista de governança e operação](../docs/decisoes/2026-09-22-governanca-e-operacao.md), [glossário de domínio](../CONTEXT.md) e [ADRs](../docs/adr/). Início na abertura e entrada secundária foram confirmados; o código ainda requer adaptação.

> Grupo G01 · Módulo ADMD7 — Blockchain, criptomoedas e tokenização de ativos · Inteli
> Projeto parceiro: IBITI (Ibiti Projeto) · Empreendimento em foco: IBITI Glamping
> Última revisão: 22/09/2026 · Formato vigente: **token único, sem queima, com a experiência vinculada à
> pessoa física verificada** (ver [03](03-uso-vinculado-a-pessoa.md)).

Esta pasta explica o projeto inteiro, do problema da IBITI ao contrato implantado, num só lugar. Cada
documento é independente, mas a ordem abaixo é a leitura recomendada para quem chega agora.

| # | Documento | Responde a |
|---|---|---|
| 01 | [Visão geral](01-visao-geral.md) | O que é a IBITI, qual o problema, o que o token resolve e o que não faz |
| 02 | [Modelo do token](02-modelo-do-token.md) | As regras do IBIToken: emissão, validade, transferência, royalty, governança, números |
| 03 | [Uso vinculado à pessoa](03-uso-vinculado-a-pessoa.md) | A decisão de 10/09/2026 sobre como a hospedagem é usada, com a matriz de tradeoffs |
| 04 | [Jornadas e fluxo](04-jornadas-e-fluxo.md) | O que cada pessoa faz, passo a passo, da descoberta ao encerramento em 2030 |
| 05 | [Contrato inteligente](05-contrato-inteligente.md) | O que o `IBIToken.sol` faz, como testar e o que muda com o formato vigente |
| 06 | [Operação da IBITI](06-operacao-da-ibiti.md) | O que a IBITI faz fora da blockchain: verificação, venda, cadastro, apuração, emergências |
| 07 | [Artefatos e sprints](07-artefatos-e-sprints.md) | O que foi entregue em cada sprint, onde está e o que falta entregar |
| 08 | [Decisões e pendências](08-decisoes-e-pendencias.md) | Registro datado das decisões, o que está em aberto e as inconsistências a harmonizar |
| 09 | [Glossário](09-glossario.md) | Os termos oficiais, nos dois registros (interface e documentos/contrato) |

## Onde está cada coisa no repositório

```
ibiti-glamping-g01/
├── README.md               # porta de entrada do repositório
├── documentacao/           # esta pasta — o projeto inteiro explicado
├── smart-contract/         # workspace Remix v3 (Parte 2); v1 publicada preservada em deployments/
├── guia-de-comunicacao/    # Guia de Comunicação: documento, landing, board visual, telas SVG/PNG, tasks
├── offchain/              # cadastro, cotas por pessoa, API e interface executável
├── entrega/               # pasta e ZIP importáveis no Remix
├── docs/                  # plano desta implementação
```

## Convenções usadas nos documentos

- **Hipótese** marca números e regras ainda não validados com a IBITI (valuation, faturamento, faixas de
  benefício). Nunca são promessas.
- **Em aberto** marca decisões que o grupo ou o parceiro ainda precisam tomar. Estão todas reunidas em
  [08](08-decisoes-e-pendencias.md).
- Datas no formato dia/mês/ano. Valores em reais, quando houver.
- Os artefatos anteriores (whitepaper, guia, BPMN, contrato v1) ainda descrevem o **resgate híbrido com
  voucher**. O formato vigente é o de [03](03-uso-vinculado-a-pessoa.md); as divergências estão listadas lá
  e em [08](08-decisoes-e-pendencias.md), para serem harmonizadas pelo grupo, não corrigidas em silêncio.

## Implementação desta revisão

- [10 · Implementação off-chain](10-implementacao-offchain.md) — regras executadas, interfaces e limites.
- [11 · Validação](11-validacao.md) — evidências dos testes e estado real da Sepolia.

A documentação 01–09 foi importada do trabalho do Claude. Notas de 10/09 nesta revisão e o documento 10 distinguem o que foi implementado das decisões originais. BPMN e IBX históricos existem no diretório de origem, não neste checkout.

A revisão de 11/09 reorganiza a entrega para Remix e remove Hardhat. A v2 publicada na Sepolia não possui resgates on-chain; a v1 permanece histórica. O endereço vigente e as evidências estão no registro de publicação. Use os manuais atuais de execução, sem comandos dos relatórios históricos.

## Segunda entrega após feedback

Estado vigente: [05 · Contrato](05-contrato-inteligente.md), [evolução e critérios](../smart-contract/docs/evolucao-v1-v2.md), [testes](../smart-contract/docs/relatorio-de-testes.md). As publicações v1/v2 de 11/09 são históricas; a v3 técnica revisada permanece local.
