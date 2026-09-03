# Premissas declaradas, pendências e próximos passos — IBIToken v1

O artefato pede que a indefinição econômica e jurídica seja tratada **como premissa declarada**, não como
justificativa para uma entrega incompleta. Este documento lista, com franqueza, o que a versão 1 assume,
o que decidimos para poder implementar, o que a implementação revelou de inconsistente nos artefatos
anteriores e o que fica para a versão 2.

## 1. Premissas assumidas no código

| # | Premissa | Onde está no código | Base | Status |
|---|---|---|---|---|
| P1 | Supply de **150 unidades** | parâmetro `emissionCap` do deploy (imutável) | whitepaper §4.2 (hipótese ilustrativa) | a validar com o valuation (Mariana Reis) |
| P2 | Reserva da IBITI = **1/3 do supply** (50) e teto por carteira = **2/15** (20) | derivados no `constructor` | §6.1, §9.2, §9.4 | decidido pelo grupo; ver inconsistências I2 e I3 |
| P3 | Validade **2027‑01‑01 → 2030‑12‑31** | parâmetros `validFrom`/`validUntil` | §4.4 (vinculada ao contrato IBITI–empreendedor) | prazo do contrato de royalties a confirmar (Apêndice C) |
| P4 | **8 apurações semestrais**, em ordem, sem verificação de datas on‑chain | `TOTAL_PERIODS`, `lastReportedPeriod` | §6.2 | simplificação declarada: a periodicidade é operacional |
| P5 | Royalty = **15% do faturamento bruto**; o bruto é o número reportado | `ROYALTY_BPS`, `reportRevenue` | §6.1 (D8) | composição das rubricas a confirmar |
| P6 | **Fotografia de saldos no momento do reporte** ("data de corte" = transação de reporte) | `reportRevenue` | §6.2 | inferência; alternativa: fechar o período em transação separada |
| P7 | **Pagamento por saque (pull)** em stablecoin; sem stablecoin, registro + liquidação em reais | `claimRoyalty`, `settleOffChain` | D9 (direção: stablecoin) e §10.6 (registro de saldo a pagar) | decisão da v1 (02/09/2026), a ratificar |
| P8 | **Unidade de conta**: menor unidade da stablecoin; sem stablecoin, centavos de real | convenção nos scripts/docs | — | convenção, não verificada pelo contrato |
| P9 | Stablecoin = qualquer ERC‑20; nos testes/Sepolia, **tBRL de teste** (6 casas) | `MockStablecoin` | D9 | a stablecoin real (ex.: em reais) segue em aberto |
| P10 | **Porta de entrada pelo saldo**, sem lista no contrato | `_enforceTransferRules` | D10, §9.2, §9.4 | decisão da v1; ver I1 |
| P11 | Após a expiração, **transferências também são rejeitadas** (não só resgates e distribuições) | `_enforceTransferRules` | inferido de §4.4 ("as três faces se extinguem") | a ratificar |
| P12 | Reemissão **herda royalties pendentes** de períodos anteriores | `reissue` | inferido de §6.2 ("a carteira reemitida recebe em seu lugar") | a ratificar |
| P13 | Verificação de identidade e vouchers **inteiramente fora da chain**; on‑chain só hashes (`saleRef`, `voucherRef`, `reportHash`) | funções administrativas | §10.4, §6.3 | premissa de arquitetura |
| P14 | **Pausa** adotada; **parâmetros econômicos imutáveis**; só admin, stablecoin (uma vez) e redução da reserva são ajustáveis | `pause`, `immutable`, `reduceReserve` | §9.1 (recomendação), §8.3 | decisão da v1, a ratificar |
| P15 | Símbolo **IBT** | `constructor` | nomenclatura em aberto (D13) | proposta |
| P16 | Unidades **não vendidas** ficam na carteira administrativa e recebem royalty como qualquer saldo | `reportRevenue` | §6.2 ("todas as carteiras com saldo > 0, incluindo a reserva") | coerente com o modelo; explicitar no whitepaper |
| P17 | Compilador Solidity 0.8.34, EVM `osaka`, OpenZeppelin 5.6 | `hardhat.config.ts` | — | Sepolia já opera nessa versão da EVM |

## 2. Decisões tomadas para viabilizar a v1 (02/09/2026)

Registradas com o autor da arquitetura (Gabriel Zanette); **precisam ser levadas ao grupo** e refletidas no whitepaper:

| Decisão | Opções consideradas | Escolha da v1 | Motivo |
|---|---|---|---|
| Regra de transferência | (a) só para quem já tem saldo · (b) lista de carteiras aprovadas · (c) híbrido | **(a)** | é a decisão D10 registrada pelo time ("sem lista no contrato"); mais simples e verificável; trocar para (b) é mudança local em `_enforceTransferRules` |
| Pagamento do royalty | (a) registrar + saque em stablecoin · (b) registrar + envio automático em lote · (c) só registrar | **(a)** | §10.6 já previa "registro de saldo a pagar"; o saque evita que um endereço problemático bloqueie todos e distribui o custo de gas; o depósito acontece na transação do reporte |
| Pausa e ajuste de parâmetros | incluir pausa e manter parâmetros fixos · incluir ambos · nenhum | **pausa + parâmetros fixos** | pausa é salvaguarda padrão de baixo custo (Riscos Éticos §2.4); parâmetros fixos preservam os termos vendidos (§8.3) |
| Reemissão | transferência administrativa · queima + cunhagem | **queima + cunhagem** | supply constante, sem passar pelas travas de portador; semântica literal de "reemitir" |

## 3. Inconsistências expostas pela implementação (a corrigir nos artefatos anteriores)

| # | Onde | O que diz | O que a v1 faz | Ação sugerida |
|---|---|---|---|---|
| I1 | Whitepaper §3.1, §4.3, §10.1, §10.3, §10.5, §14 × §5.3, §9.2, §9.4 | "lista de carteiras aprovadas pela IBITI" × "destino já tem saldo, sem lista" | regra do saldo | harmonizar o texto para uma única regra (decisão do grupo) |
| I2 | Whitepaper §9.1 ("5% das unidades são destinadas à reserva") e §12.1 ("reserva de 5% dos tokens") × §4.2, §6.1, §9.4 (1/3 = 50 de 150) | reserva de 5% × 1/3 | 1/3 | corrigir §9.1 e §12.1 para "5 dos 15 pontos = 1/3 das unidades" |
| I3 | Riscos Éticos §2.3 ("holding cap de, no máximo, 2% dos royalties por pessoa") e Whitepaper §12.3 ("limite de 2% por carteira") × §9.2 (2 dos 15 pontos = 2/15) | 2% × 2/15 | 2/15 (20 unidades) | corrigir para "2 dos 15 pontos (2/15 do supply)" |
| I4 | Whitepaper §9.1 ("Registrar / distribuir royalty … transfere a moeda estável … automático após o reporte") | envio automático (push) | registro automático + saque (pull) | atualizar §6.2/§9.1 se a decisão da v1 for ratificada |
| I5 | Whitepaper §2.3, §9.1 ("Emitir leva", "levas de quatro anos") × §4.2, §5.3, §13 (lote único, piloto sem novas levas) | levas × lote único | emissão única no deploy | padronizar o vocabulário ("emissão única do piloto") |
| I6 | Riscos Éticos §1.1 ("recursos … para a captação necessária à implantação do Glamping"; "fracionamento") × Whitepaper §6.1 (captação → IBITI/ecossistema; token indivisível) | destino da captação e fracionamento | segue o whitepaper | alinhar o artefato de riscos ao whitepaper |
| I7 | Whitepaper §9.1 × §10.6 | pausa/ajustes "recomendados e não decididos" | pausa adotada | registrar a decisão do grupo |
| I8 | Whitepaper §4.4 (extinção das três faces) × §9.2 (rejeita resgates e distribuições) | silêncio sobre transferências após o prazo | bloqueia transferências após o prazo | explicitar a regra no whitepaper |

## 4. Perguntas em aberto (grupo e parceiro)

1. **Regra de transferência definitiva** (I1) — grupo.
2. **Stablecoin real** para o pagamento (em reais? qual emissor?) e **periodicidade** confirmada após o valuation — grupo, com Mariana Reis.
3. **Custodiante da jornada assistida** (quem opera `transfer`/`claimRoyalty` em nome de Helena) — IBITI.
4. **Guarda da chave administrativa** (carteira de hardware? procedimento de rotação em dois passos? multiassinatura na v2?) — IBITI.
5. **Prazo do contrato de royalties** IBITI–empreendedor, que fixa `validFrom`/`validUntil` — Joaquim Monteiro / Mariana Reis.
6. **Composição do faturamento bruto** e **origem do relatório** cujo hash é publicado; segunda assinatura ou auditor externo (roadmap §13) — Mariana Reis.
7. **Escala de benefícios por quantidade** e **agregação de experiências** (faixas de posse): o contrato já expõe `accessInfo`; as faixas ficam fora da chain até a decisão — grupo, com Joaquim Monteiro.
8. **Datas dos semestres on‑chain?** (hoje só a ordem é garantida) — grupo.
9. **Nomenclatura oficial** (nome/símbolo/estados) — grupo.
10. **Critérios de aprovação** de novos portadores e de reemissão (documento de processo fora da chain) — IBITI.

## 5. Rastreabilidade das decisões D1–D13 na v1

| Decisão | Situação na v1 |
|---|---|
| D1 · Um único token, sem queima | implementado: um contrato, `markRedeemed` sem queima, sem `burn` público |
| D2 · Verificação obrigatória fora da chain | implementado: só a carteira administrativa cria portadores (`primaryPurchase`) |
| D3 · Preço fixo, emissão única com teto | supply imutável no deploy; **preço fica fora da chain** (pagamento em reais/assistido) |
| D4 · Indivisível; transferência só entre portadores; resgatado transfere | implementado: `decimals() = 0`, regra do saldo, contadores movidos |
| D5 · Validade 4 anos; resgate híbrido com voucher | implementado: `validFrom`/`validUntil`, `voucherRef` |
| D6 · Passaporte = status derivado; reemissão por perda/sucessão | implementado: `isMember`, `reissue` |
| D7 · Benefícios reconhecidos; escala por quantidade em estudo | `accessInfo` expõe os dados; faixas fora da chain |
| D8 · 15% do bruto, 100% tokenizado, reserva 5/15, teto 2/15 | implementado |
| D9 · Carteira dedicada + stablecoin + distribuição pro‑rata | implementado como registro pro‑rata + depósito no reporte + saque; stablecoin real em aberto |
| D10 · Ethereum/Sepolia, ERC‑20 com contadores, sem lista | implementado |
| D11 · On‑chain/off‑chain; duas jornadas | implementado no desenho (custodiante opera pelo portador); custodiante em aberto |
| D12 · Funções e travas | implementadas (§2 do README); pausa adotada; ajustes restritos |
| D13 · Administração única; nomenclatura | `Ownable2Step`; símbolo IBT proposto |

## 6. Escopo previsto para a versão 2

- Harmonizar o whitepaper (I1–I8) e ratificar as decisões da v1 em reunião do grupo.
- Se o grupo optar pela lista de aprovados: `approveWallet`/`revokeApproval` e troca da regra em `_enforceTransferRules`, com testes.
- **Segunda assinatura** no reporte de receita (empreendedor do Glamping) ou validação por auditor — reduz a dependência de uma única parte (§6.3, §11.3).
- **Multiassinatura** para a carteira administrativa (ex.: Safe) mantendo a governança única da IBITI como instituição.
- Stablecoin real na Sepolia (ou mock fiel à escolhida) e, se decidido, datas de semestre verificadas on‑chain.
- Deploy verificado na Sepolia com o **registro da entrega** preenchido (endereços e transações) e demonstração das duas jornadas de custódia.
- Testes de segurança: análise estática (Slither), testes de fuzz (Solidity tests/Foundry) e revisão externa (roadmap §13, etapa 3).
- Interface mínima para parceiros do território (consulta `accessInfo`) e para o sistema de resgate.
