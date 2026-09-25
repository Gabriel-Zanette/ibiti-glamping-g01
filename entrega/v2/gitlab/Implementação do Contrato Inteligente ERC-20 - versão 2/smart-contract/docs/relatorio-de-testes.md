> **Registro da revisão técnica v3 (22/09), preservado como trajetória.** A fonte atual é v4: [guia vigente](guia-v4.md), [inventário de regras e pendências](../../docs/decisoes/2026-09-25-inventario-completo-token.md). Calendário fixo, transferências, corte por fotografia e espera de 48h abaixo foram superados. Memorando v2 já recebido e revisado em feedback separado.

# Validação da Parte 2 — IBIToken técnico v3

Rodada de 22/09/2026, Node 24.19.0, Solidity 0.8.34, OpenZeppelin 5.6.1, EVM Osaka, otimizador 200, Anvil 1.7.1. Todos os testes abaixo executaram em ambiente local. Não houve deploy público da v3 nem reexecução do plugin do Remix no navegador.

## Resultado

| Comando / grupo | Resultado |
| --- | --- |
| `npm test --prefix smart-contract` | 48 entradas aprovadas, zero falhas; inclui um agrupador de testes Solidity |
| Funções Solidity nas quatro suítes | 14 funções executadas em Anvil e chamadas estáticas conferidas |
| `tests/feedback.test.ts` | 24 cenários de regressão e proteção econômica |
| `tests/offchain.test.ts` | 7 integrações com EVM real e SQLite |
| `tests/scripts.test.ts` | 2 fluxos Remix, com layouts de artefatos root e legacy |
| `npm test --prefix offchain` | 19 testes aprovados, zero falhas |
| `npm run typecheck` nos dois módulos | Sem erros |
| `npm run build --prefix smart-contract` | ABI/bytecode gerados; limite EIP-170 verificado |
| Demo real e `/health` | HTTP ok; compra atômica, 5 IBT, 2 cotas usadas, 3 disponíveis e royalty sacado |

São **66 casos efetivos**: 14 + 24 + 7 + 2 + 19. A soma das contagens do Node é 67 porque inclui o agrupador Solidity. Não somar novamente execuções estáticas, transações, testes seletivos repetidos ou testes da primeira entrega.

## Regressões e trajetória

A reprodução inicial produziu cinco falhas esperadas na implementação anterior: apuração antecipada aceita, recuperação para administrador aceita, compra após troca de owner revertida, concentração em múltiplas carteiras aceita e royalty sem saldo irrecuperável. O arquivo de regressões foi então adaptado às interfaces de cadastro e anúncio para demonstrar as novas garantias.

A revisão independente identificou mais dois problemas durante a implementação: anúncio revalidado no retorno de um ex-administrador (A → B → A), e recuperação para contrato sem função de movimentar IBT. Ambos foram reproduzidos em testes que falharam, corrigidos e reexecutados com sucesso; a revisão conferiu as correções.

As antigas suítes Solidity foram reorganizadas em 14 funções compactas. Casos com relógio, múltiplas contas, pagamentos e integração estão na suíte Node/Anvil. Isso conserva testes nativos importáveis no Remix sem ultrapassar o tamanho máximo de bytecode ao embutir o construtor do token em cada suíte. A contagem foi reconstruída a partir da execução atual, não herdada do relatório antigo.

## Cobertura relevante

- Teto agregado em compras/transfer/transferFrom; movimento interno da mesma pessoa; rollback de allowance; devolução e conservação de supply.
- Cadastro obrigatório, exclusividade e autorização; compra não pode ser contornada por transferência da tesouraria.
- Owner em dois passos, estoque/reserva contínuos e elegibilidade de participante que assume administração.
- Todos os oito semestres: um segundo antes rejeitado, instante exato aceito; 2028 bissexto; nono período rejeitado; janela inválida rejeitada.
- Recuperação anunciada, prazo, cancelamento durante pausa, congelamento, destino estrangeiro/com saldo/contratual/administrativo, geração administrativa, revogação, identidade e supply preservados.
- Recebíveis sem saldo e após expiração; pagamentos antigos preservados; saque único; conciliação e cotas não recriadas.
- Compra stablecoin com preço fixo, saldo/allowance insuficientes e violação de teto sem cobrança; reportes com funding atômico, fotografia e inclusão da reserva.
- API autenticada, preparação de calldata de cadastro, identificação divergente, evento de recuperação zero, reorg, rede/endereço incorretos, finalização, cotas persistentes, cancelamento e idempotência.

## Limites da evidência

Os scripts usam provider EIP-1193 ligado ao Anvil; somente o sistema de arquivos do Remix é simulado. Isso não comprova cliques, MetaMask ou execução do plugin no navegador nesta rodada. As funções Solidity rodam em EVM real local. A demonstração usa janela 2025–2028 para ter períodos maduros; o roteiro padrão de publicação usa 2027–2030.

Não foi feita auditoria formal de segurança, integração real com BRZ, teste de produção/Mainnet, KYC/hotel reais, sucessão jurídica ou migração de bancos/contratos existentes. A compatibilidade de leitura de contratos históricos não lhes acrescenta novas travas. Recibos e relatórios antigos descrevem somente suas respectivas versões.

Reprodução: [guia de execução](guia-de-execucao.md). Rastreabilidade das decisões: [evolução v1 → v2 acadêmica](evolucao-v1-v2.md). Fontes primárias dos mecanismos de herança e transferências: [OpenZeppelin ERC-20](https://docs.openzeppelin.com/contracts/5.x/api/token/erc20) e [Ownable2Step](https://docs.openzeppelin.com/contracts/5.x/api/access).

## Reprodução do pacote entregue

O ZIP completo foi extraído em diretório temporário limpo. `npm ci` dos dois módulos, compilação, 48 entradas da suíte do contrato, 19 testes do serviço e os dois typechecks passaram novamente. O manifesto SHA-256 foi conferido. As versões, hashes de fontes e síntese dos resultados estão em [validacao-v3.json](validacao-v3.json). O runtime do IBIToken tem 15.148 bytes, abaixo do limite EIP-170 de 24.576.
