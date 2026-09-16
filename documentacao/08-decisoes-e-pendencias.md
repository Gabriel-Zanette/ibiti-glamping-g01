# 08 · Decisões e pendências

> **Implementação em 10/09/2026:** consulte [10 · Implementação off-chain](10-implementacao-offchain.md). O software de cadastro e cotas já está neste repositório; aprovação, hotel e operação real da IBITI seguem pendentes. A política de cotas foi confirmada pelo responsável do projeto em 11/09/2026: uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências. O contrato v1 mantém contadores legados, sem uso no fluxo atual.

Registro datado. Uma decisão posterior substitui a anterior no mesmo tema. Itens **em aberto** são
decisões que o grupo ou o parceiro ainda precisam tomar; o Claude e os documentos não as resolvem por
conta própria.

## Decisões, por data

| Data | Decisão | Origem |
|---|---|---|
| ago/2026 | Royalties do Glamping = 15% (investimento do empreendedor terceiro) | encontro com a IBITI |
| ago/2026 | Liberdade para o time desenhar os benefícios, com estudo de viabilidade; só royalty não vende; a experiência é o gancho | encontro |
| 11/08 | Três personas (Helena, Beatriz, Gabriel); entregas em português; marcas parceiras fora das personas | time / encontro |
| 26/08 | D1 · um único token, sem queima (Passaporte = status derivado) | time |
| 26/08 | D2 · verificação obrigatória para todos, pela IBITI, fora da blockchain, antes da compra | time / encontro |
| 26/08 | D3 · preço fixo; emissão por leva de 4 anos com teto (depois: emissão única, ver 28/08) | time |
| 26/08 | D5 · validade de 4 anos; resgate híbrido com voucher (superado em 10/09) | time |
| 26/08 | D6 · Passaporte nasce na compra, vive na carteira; reemissão por perda de chave ou sucessão | time |
| 26/08 | D7 · benefícios reconhecidos; marcas parceiras fora; agregação como ideia | time |
| 26/08 | D10 · Ethereum, Sepolia, ERC-20; transferência entre portadores | time |
| 26/08 | D11 · on-chain × off-chain; duas jornadas de custódia | time |
| 26/08 | D13 · administração única da IBITI, sem multisig, sem DAO | time |
| 27/08 | Distinção residentes (trabalhadores) × hóspedes (alta renda) | correção do usuário |
| 27/08 | Escala de benefícios por quantidade NÃO decidida; é direção em estudo | correção do usuário |
| 27/08 | Captação → IBITI/ecossistema, não construção do Glamping; "apoiador fundador" abolido; hierarquia de valor (experiência, retorno, reconhecimento); teto especulativo 15% a.a. como hipótese | time / encontro |
| 27/08 | Direção do pagamento: carteira dedicada + stablecoin + distribuição pro-rata | direção da turma |
| 28/08 | Royalty sobre **faturamento bruto** (não receita líquida); 100% tokenizado; reserva 1/3 (50); teto 2/15 (20) | correção do usuário |
| 28/08 | Token **indivisível** (fracionamento revertido) | correção do usuário |
| 28/08 | Colaboradores e produtores locais não recebem token | correção do usuário |
| 28/08 | Nome **IBIToken**; ERC-20 definitivo com contadores; emissão única = piloto, sem novas levas; membership extingue em 2030; apuração semestral; mainnet definitiva, Sepolia para testes | revisão do documento unificado |
| 02/09 | v1 do contrato: transferência só para quem tem saldo; royalty por saque; pausa; parâmetros imutáveis; bloqueio após expiração; reemissão herda pendentes | usuário (arquitetura), a ratificar |
| 02/09 | Guia em português; jornada assistida principal; P0 (essencial em 30 s); landing de página única com cinco seções e páginas de detalhe | usuário |
| 03/09 | Preço fora da landing e das páginas públicas; cabeçalho navega entre páginas | usuário |
| 04/09 | Diagrama ponta a ponta em BPMN 2.0, camada técnica | usuário |
| **10/09** | **Uso da experiência vinculado à pessoa verificada, registrado fora da blockchain; token único sem queima por hospedagem mantido; sem resgate on-chain no fluxo vigente** ([03](03-uso-vinculado-a-pessoa.md)) | usuário, após debate em sala de 04/09 |

| **11/09** | Workspace funcional do Remix com `contracts`, `scripts` e `tests`; **sem Hardhat** | exigência relatada pelo usuário após alinhamento com colegas/professor |
| **11/09** | v2 local remove contadores de resgate; testes Solidity nativos; Anvil somente para validação local; v1 publicada preservada como evidência | implementação técnica do modelo por pessoa |

| **11/09** | Uma experiência por IBT em toda a emissão, sem renovação; transferem-se somente cotas livres | confirmação expressa do usuário |
| **11/09** | Experiência: 3 noites, até 5 pessoas e serviços comuns de hospedagem; cancelamento elegível restitui a mesma cota | usuário |
| **11/09** | Valuation será revisto por outro integrante; preservar os números históricos nesta versão | usuário |
| **11/09** | v2 publicada no Remix/MetaMask, Sepolia, bloco 11684811; backend separado; Sourcify exact_match | recibo e verificação |
| **11/09** | Alertar no chat quando uma futura alteração do token afetar ou contradizer o whitepaper | usuário; regra incluída na skill |

## Em aberto

### Fechamento do projeto

- Prazo mínimo para cancelamento com restituição e tratamento de cancelamento tardio/no-show.
- Autocustódia assistida ou custodiante; a primeira foi recomendada, sem aprovação presumida.
- Revisão financeira pelo integrante responsável, sem antecipar o novo preço nesta versão.
- Implementar duração, hóspedes e prazo no backend após fechar o regulamento; o código atual ainda não impõe essas condições.
- Executar a suíte completa do plugin de testes e os scripts de operação no navegador; a compilação e o deploy já foram comprovados.
- Atualizar cópias externas de whitepaper, guia, BPMN e entrega remota no GitLab.

### Condições externas para produção

KYC/critério ético real, disponibilidade e serviços do hotel, atendimento e sucessão, apuração contábil, formalização dos royalties, contratação/onboarding de conversão e eventual custódia, segurança e infraestrutura de produção. A direção de rede/ativo é Ethereum Mainnet, ERC-20 e BRZ/Transfero; isso não prova contratação ou integração. Não há multisig, DAO ou renovação automática prometidos na v2.

As definições vigentes e seus limites estão no [whitepaper revisado](../whitepaper/whitepaper_ibiti_revisado.md), capítulos 5, 8, 9, 10 e Apêndice C.

## Inconsistências históricas dos artefatos anteriores

A revisão local do whitepaper já corrige os pontos abaixo. A tabela preserva a origem das divergências; não descreve o conteúdo vigente da nova versão. Cópias externas devem ser conciliadas.

| # | Onde | O que diz | O que vale |
|---|---|---|---|
| I1 | Whitepaper (várias seções) | "lista de carteiras aprovadas" × "destino já tem saldo" | regra do saldo (v1), a ratificar |
| I2 | Whitepaper §9.1, §12.1 | reserva de 5% | 1/3 (50 unidades) |
| I3 | Riscos Éticos §2.3, Whitepaper §12.3 | 2% por carteira | 2/15 (20 unidades) |
| I4 | Whitepaper §9.1 | envio automático do royalty | registro + saque (v1), a ratificar |
| I5 | Whitepaper §2.3, §9.1 | "levas" | emissão única do piloto |
| I6 | Riscos Éticos §1.1 | captação financia a obra; fracionamento | captação → IBITI; indivisível |
| I7 | Whitepaper §9.1 × §10.6 | pausa "recomendada e não decidida" | adotada na v1, a ratificar |
| I8 | Whitepaper §4.4 × §9.2 | silêncio sobre transferências após o prazo | bloqueadas (v1) |
| **I9** | Whitepaper §4.4, §5, §9, §10.3–10.5; Guia (A6–A7, vocabulário, catálogo); BPMN fase 4; premissas P13 | resgate híbrido com voucher e contadores como verdade | uso vinculado à pessoa (10/09) |
