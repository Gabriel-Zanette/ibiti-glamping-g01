# 12 · Conferência da primeira entrega do contrato inteligente

> **Conferência histórica, anterior à reorganização de 11/09/2026.** Os apontamentos abaixo documentam aquele estado. O workspace v2 remove Hardhat e resgates legados; execução e resultados atuais estão em [05](05-contrato-inteligente.md) e [11](11-validacao.md). A situação do envio no GitLab precisa ser conferida no repositório acadêmico; esta revisão local não comprova entrega remota.

Verificação em **11/09/2026**, baseada no enunciado enviado pelo usuário, no estado local deste repositório, na `main` do GitLab da disciplina e em execução numa cópia limpa. Ambiente: macOS, Node **24.19.0**.

**Conclusão: a implementação funcional e a publicação Sepolia estão comprovadas; o artefato acadêmico ainda não está integralmente entregue.** Faltam a publicação do pacote atual no GitLab e a consolidação das instruções/documentação. O alinhamento integral com a versão oficial do whitepaper não pôde ser confirmado nesta leitura.

O texto enviado avalia a implementação completa — código, testes, premissas, justificativas e execução reproduzível — e define **GitLab** como local de entrega. Publicar o contrato na Sepolia não substitui esse requisito. O enunciado não exige explicitamente mainnet, interface hoteleira real, auditoria formal ou código verificado especificamente no Etherscan.

## Matriz de atendimento

| Exigência do enunciado | Situação | Evidência e limite |
|---|---|---|
| Contrato funcional, compilável e executável em EVM | Atendida tecnicamente | Compilação limpa com Solidity 0.8.34; demonstração local executada; IBIToken publicado na Sepolia. |
| Emissão, transferência, controle e gerenciamento do ativo | Atendida no piloto | Supply de 150 IBT, reserva 50, teto por carteira 20, compra primária, transferências, pausa, recuperação, administração e royalties implementados e testados. |
| Adaptação ao projeto, em vez de exemplo genérico | Atendida no código | Regras próprias de reserva, ingresso de portadores, validade, 15% de royalty e hospedagens por pessoa no serviço off-chain. |
| Implementação testada | Atendida tecnicamente | **55 testes do projeto do contrato + 16 do serviço off-chain passaram** nesta conferência. Os 55 incluem 5 de integração. Ambas as checagens TypeScript passaram. |
| Reprodução a partir das instruções fornecidas | Parcial | A sequência completa com os dois projetos funciona. O guia de `smart-contract/` omite a instalação de `offchain/` e falha numa instalação limpa; detalhes abaixo. |
| Coerência entre modelo, arquitetura e comportamento | Parcial na documentação | O fluxo vigente usa cotas por pessoa, mas alguns documentos ainda orientam resgate on-chain e sugerem `markRedeemed` como espelho opcional, incompatível com o indexador atual. |
| Alinhamento com whitepaper e estrutura organizacional | Parcialmente verificável | Há mapas de regras, decisões e premissas locais. O whitepaper oficial está listado no GitLab, mas sua leitura integral não foi obtida nesta sessão; não se certifica alinhamento integral. |
| Justificativas e premissas econômicas/jurídicas declaradas | Atendida documentalmente | `premissas-e-pendencias.md`, documentos 02, 08 e 10 e decisões de arquitetura. Hipóteses declaradas são permitidas nesta primeira entrega; não precisam ser apresentadas como decisões definitivas da IBITI. |
| Organização do código e documentação em português | Atendida localmente, com ajustes de consistência | Contratos, módulos, testes, scripts e serviço separados; explicações em português. A documentação histórica precisa deixar de funcionar como roteiro operacional vigente. |
| Repositório GitLab contendo código, documentação e execução | **Não atendida na main consultada** | A raiz do GitLab apresenta `Sprint 1`, `Sprint 2` e README padrão; o pacote atual `smart-contract/` + `offchain/` não consta da árvore consultada. As alterações locais ainda estão sem commit e o remoto local aponta ao GitHub. |

Os critérios de compreensão do grupo e maturidade analítica têm evidências no código, nos testes e nas justificativas, mas sua avaliação final pertence aos docentes. A existência de código gerado e testes aprovados não comprova, por si só, domínio por todos os integrantes.

## Pendências concretas antes da entrega

### 1. Colocar o pacote correto no GitLab

Repositório consultado: [G01 / main](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/tree/main?ref_type=heads), commit da raiz `0558f19ee995f524273132bcdf32a87a2e5b1e28`. Foram inspecionadas a raiz e as pastas Sprint 1 e Sprint 2. O README permanece com o modelo inicial em inglês.

A entrega precisa incluir fontes, testes, lockfiles, documentação vigente, instruções e [evidências do deploy](../smart-contract/deployments/sepolia-remix-2026-09-11.json). Os testes do contrato importam `../../offchain/src/`; enviar apenas `smart-contract/` deixa o pacote incompleto. Não enviar `.env`, chaves, bancos locais nem `node_modules`.

Esta conclusão é sobre a **main observada**; não certifica inexistência de cópias em outras branches, repositórios ou plataformas. Nenhum commit, push ou alteração no GitLab foi feito durante a conferência.

### 2. Corrigir e unificar o roteiro de execução

No [guia do contrato](../smart-contract/docs/guia-de-execucao.md), a instalação das linhas 24–29 contempla somente `smart-contract/`. Os testes de integração agora também dependem de `offchain/`. Em cópia limpa, instalando apenas as dependências do contrato e executando build/testes, a compilação passou e o teste falhou com:

```text
Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'ethers'
imported from .../offchain/src/ledger.ts
```

Após instalar as dependências de `offchain/`, passaram os 55 testes do contrato, os 16 do serviço e as duas checagens de tipos. A receita funcional, a partir da raiz do pacote, é:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run demo --prefix offchain
```

Também harmonizar Node **24+** (o serviço declara esse requisito), a contagem atual de testes e o roteiro Remix com Solidity **0.8.34**, otimização 200 e EVM Osaka. O guia antigo ainda menciona Node 22, 50 testes e compilação genérica com 0.8.24 ou superior. A receita atual do README da raiz já instala os dois projetos.

### 3. Retirar instruções contraditórias de hospedagem

- O guia ainda oferece `ACTION=redeem` nas linhas 138–139. O [script operacional](../smart-contract/scripts/operate-sepolia.ts) desativa expressamente essa ação nas linhas 55–56.
- [05 · Contrato inteligente](05-contrato-inteligente.md), linha 35, descreve `markRedeemed` como espelho opcional. No [indexador](../offchain/src/chain.ts), linha 70, qualquer evento `RedemptionMarked` bloqueia a sincronização com `LEGACY_REDEMPTIONS_REQUIRE_MIGRATION`.
- O README técnico e seus diagramas ainda desenvolvem o fluxo antigo após o aviso inicial. Para o avaliador, deve existir uma apresentação principal única: hospedagem e consumo por pessoa fora da blockchain; token preservado; royalties por saldo.

Manter funções legadas no contrato não obriga, por si só, um novo deploy para atender este enunciado. É necessário explicar seu papel e não instruir o operador a misturá-las com o fluxo vigente. Sua remoção definitiva seria outra alteração de contrato, sujeita a testes e publicação própria.

### 4. Fechar a rastreabilidade com o whitepaper oficial

Na Sprint 2 foram localizados [whitepaper em PDF](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/blob/main/Sprint%202/whitepaper_ibiti_glamping.pdf?ref_type=heads) e [conteúdo em Markdown](https://git.inteli.edu.br/graduacao/2026-2a/t19/g01/-/blob/main/Sprint%202/whitepaperibiticonteudo_completo.md?ref_type=heads). A visualização do Markdown permaneceu carregando e o link `Open raw` retornou **404** no navegador autenticado.

Antes de afirmar alinhamento integral, comparar a versão oficial legível com o modelo vigente e registrar expressamente as diferenças: cotas pessoais off-chain, tratamento de transferências, teto por carteira versus pessoa, pagamento por saque e calendário operacional dos oito reportes. Pode ser feito por atualização do documento ou por um adendo de rastreabilidade, mantendo premissas provisórias claramente identificadas.

## Execuções e evidências desta conferência

- Foi criada uma cópia temporária de `smart-contract/` e `offchain/`, sem dependências instaladas, artefatos compilados, bancos ou configurações locais. A instalação utilizou os lockfiles (`npm ci`). O cache de compiladores do sistema permaneceu disponível.
- Compilação: dois arquivos Solidity compilados com 0.8.34/Osaka. Testes: 55 + 16 aprovados; TypeScript: ambos aprovados.
- A demonstração da cópia limpa rodou nas portas 3012/18546, sem alterar os serviços existentes. Confirmou 5 IBT no cadastro fictício, 3 cotas disponíveis, 2 utilizadas, cancelamento registrado e royalty pago de 5.000 unidades mínimas de tBRL. `/health` respondeu `ok`. O processo de teste foi encerrado ao final.
- Sepolia: `check-sepolia.ts` retornou `IBITOKEN_CONFIRMED`, 150 IBT, zero decimais e administrador esperado. A leitura consultou bloco finalizado **11682117**, posterior à criação **11679925**.
- O serviço Sepolia existente em `localhost:3001/health` respondeu **ok**, com snapshot finalizado **11682086** na consulta. A espera de finalização informada logo após o deploy já terminou.
- Os recibos e a verificação Sourcify permanecem documentados em [deploy-modelo-pessoa.md](../smart-contract/docs/deploy-modelo-pessoa.md). A verificação específica no Etherscan continua separada e não é requisito expresso deste enunciado.

As compras, hospedagens e pagamentos do fluxo completo foram demonstrados em **EVM local**; esta conferência não executou novas transações na Sepolia. Integrações reais da IBITI e decisões econômicas/jurídicas finais não foram contabilizadas como pendências técnicas obrigatórias desta primeira entrega.
