# Implementação final do IBIToken

> Execução nesta sessão com superpowers:executing-plans, testes antes das correções e revisão independente ao final. Pedido de correção já autorizado pelo usuário.

**Objetivo:** corrigir as sete sugestões do feedback e produzir entrega coerente e reproduzível.
**Arquitetura:** manter um ERC-20 e o serviço de cotas, reforçando as invariantes no núcleo do contrato. Separar governança, tesouraria, identidade e recuperação.
**Tecnologias:** Solidity 0.8.34, OpenZeppelin 5.6.1, Remix, solc/Anvil, Node 24, ethers, SQLite.
**Especificação:** ../specs/2026-09-21-implementacao-final-design.md

## Restrições globais

Português; sem Hardhat; não editar deploys históricos ou trabalho prévio da landing; 150/50/20 e 15% preservados; oito semestres; sem emissão adicional nem queima por hospedagem.

## Foco da revisão

- Transferência interna da mesma pessoa no teto não pode contar entrada duas vezes.
- Transferência direta da tesouraria não pode contornar pagamento/cadastro.
- Recuperação após troca de owner ou durante pausa deve permitir cancelamento seguro.
- Recuperação com saldo zero deve revogar carteira e preservar o histórico de cotas.
- Sincronização não pode trocar a identidade de uma pessoa nem tratar novo owner como estoque.

## Tarefas

- [x] 1. Reproduzir falhas em `smart-contract/tests/feedback.test.ts`: calendário precoce, confisco, troca de administrador, múltiplas carteiras e royalty sem saldo. Rodar `node --test tests/feedback.test.ts` e registrar falhas esperadas.
- [x] 2. Corrigir `contracts/IBIToken.sol`: registerWallet/personOf/personBalance; treasury; calendário; requestRecovery/cancelRecovery/reissue; buyPrimary/setPrimaryPrice. Atualizar suítes Solidity e criar cenários temporais reais em Anvil. Executar `npm test --prefix smart-contract`.
- [x] 3. Ajustar `offchain/src/chain.ts`, `ledger.ts`, API de preparo de vínculo e `scripts/demo.ts`; testes reais de identidade e recuperação; executar `npm test --prefix offchain` e testes de integração.
- [x] 4. Atualizar scripts Remix e testar as duas organizações de artefatos. Documentar decisões, calendário, procedimentos e matriz dos oito critérios; alinhar whitepaper sem alterar premissas financeiras.
- [x] 5. Rodar build, testes, typechecks, revisão independente e pacote Remix/Parte 2. Registrar evidências exatas, limitações e condição de publicação.

## Registro

A janela de 48 horas e a tesouraria imutável são escolhas técnicas desta correção, não políticas ratificadas pela IBITI. O trabalho segue no diretório atual para entregar mudanças revisáveis junto do projeto; alterações prévias permanecem intocadas. Aprovações processuais de skills não são solicitadas novamente: a instrução atual autoriza a correção completa e as orientações superiores determinam preparar o resultado concreto.

Validação final: 48 entradas smart-contract (47 casos + agrupador), 19 offchain; typechecks aprovados; demo HTTP ok. Revisão independente apontou dois casos, ambos corrigidos e revalidados. Sem commits/push/deploy nesta tarefa; mudanças locais revisáveis.
