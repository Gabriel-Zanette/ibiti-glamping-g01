# Validação da fonte técnica v4 — 25/09/2026

Escopo: contrato, calendário, integração de compra/cotas, scripts Remix e portal local. Sem transações em rede pública. Não representa auditoria formal de produção.

## Resultados

- Suíte do contrato/integração: **56 testes aprovados**, incluindo 14 funções das suítes Solidity, regressões do feedback, royalties por tempo, limite de gas, scripts Remix nos dois formatos de artefato e jornada EVM do portal.
- Serviço off-chain: **24 testes aprovados**.
- `tsc --noEmit` aprovado em `smart-contract/` e `offchain/`.
- Compilação Solidity 0.8.34, Osaka, otimizador 200 e `viaIR`; bytecode de execução do IBIToken com aproximadamente 16,2 KB, abaixo do limite EIP-170 de 24.576 bytes. Biblioteca matemática OpenZeppelin 5.6.1 original.
- Interface: login de participante e administrador, três cotas reconhecidas, ficha privada com checklist/decisões, tela de entrada e largura de 390 px conferidos em navegador.
- PDF do memorando preservado; SHA-256 antes/depois: `959d48a3d2894fc676b51fed65ba4a9143859a559dca2d59afb1fe5b43178a42`.

## Cenários de maior relevância

1. Cinco IBT durante o semestre mais uma compra no último dia: peso em segundos exato; o novo token não recebe semestre completo.
2. Compra após fechamento e reporte atrasado: nenhum direito retroativo é concedido ao comprador.
3. Recuperação durante vigência e após fechamento: soma dos pesos é preservada; recebíveis migram sem recriar pagamentos já efetuados.
4. Carteira sem saldo e com recebível: fixture exclusivamente de regressão reproduz posição legada e testa recuperação após expiração. A fixture não adiciona saída de saldo ao token de produção.
5. Tesouraria vendida a zero: sua participação anterior continua no rateio.
6. Oito encerramentos de seis meses; 31 de agosto, 29 de fevereiro, limite exato e nono reporte; nenhum semestre pode ser apurado um segundo antes.
7. Transferência comum, autoenvio, transferência entre carteiras da mesma pessoa e `transferFrom` com allowance: recusados; compra e recuperação continuam possíveis.
8. Compra sem saldo/allowance ou acima do teto: pagamento/entrega revertidos. Mesma referência de pedido não liquida novamente.
9. Administração substituída: estoque/reserva permanecem na tesouraria; anúncios de recuperação anteriores não ressuscitam quando antigo owner retorna.
10. Portal: aprovação não cria tokens; carteira habilitada não comprova compra; transação confirmada concede cotas à mesma conta; consumo permanece off-chain.
11. Custódia IBITI: prova de carteira dedicada, consentimento do participante no pedido, assinatura financeira externa e reconhecimento das cotas.
12. Cancelamento manual e conciliação: decisão registrada, sem crédito fracionário, devolução única e proteção contra conclusão concorrente.

## Revisão independente e custo de apuração

Uma conferência separada compilou a fonte em memória e executou rede Anvil isolada. Testou duas recuperações antes de reporte, oito reportes após expiração, recuperação final de recebíveis e 56 comparações de datas UTC, incluindo 2000 e 2100. Conservou `soma dos pesos = 150 × duração` em todos os períodos verificados.

A revisão encontrou uma falha de custo no primeiro desenho: reportar após quatro anos com 150 titulares consumia cerca de **34,9 milhões de gas**, pois materializava oito períodos para cada titular. O reporte foi corrigido para consultar apenas o peso do semestre, conservando a materialização nos eventos de mudança de saldo.

Cenário corrigido: 150 titulares com 1 IBT cada, tesouraria zerada após 45 dias, reportes após quatro anos, limite EIP-7825 habilitado no verificador independente:

| Reporte | Gas estimado | Gas consumido |
| --- | ---: | ---: |
| Primeiro | 5.715.406 | 5.621.657 |
| Segundo | 5.786.810 | 5.691.945 |

Ambos abaixo de 16.777.216 por transação. O teste reproduzível em `time-weighted.test.ts` também exige estimativa e consumo abaixo desse teto, com limite explícito na transação. Medições não são promessa de preço de gas ou custo monetário em rede pública.

## Reprodução

```bash
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run demo:portal --prefix offchain
```

[Guia atual e credenciais](guia-v4.md) · [Inventário integral e pendências](../../docs/decisoes/2026-09-25-inventario-completo-token.md).

## Limites da conclusão

Os testes demonstram os casos e invariantes exercitados. Não comprovam KYC real, independência dos funcionários, veracidade de faturamento, custódia comercial, hotel em operação ou segurança de infraestrutura. Governança por pilares, dupla aprovação on-chain, pausa seletiva e integração completa da contestação continuam pendentes.
