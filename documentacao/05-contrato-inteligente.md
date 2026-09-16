# 05 · Contrato inteligente — workspace Remix v2

Atualizado em 11/09/2026. A entrega usa **Remix IDE**, Solidity 0.8.34 e OpenZeppelin 5.6.1. A validação local usa solc, Anvil e `node:test`. Hardhat foi removido dos comandos, dependências e configuração.

## Arquitetura funcional

| Local | Responsabilidade |
|---|---|
| `smart-contract/contracts/IBIToken.sol` | ERC-20: emissão de 150 IBT, saldos, reserva de 50, teto de 20 por carteira, validade, transferências, recuperação, administração e royalties |
| `smart-contract/contracts/mocks/MockStablecoin.sol` | moeda fictícia tBRL para testar pagamentos; não aumenta a emissão de IBT |
| `smart-contract/contracts/vendor/` | dependências Solidity efetivamente herdadas; não são ativos adicionais a publicar |
| `smart-contract/scripts/` | publicação e operação diretamente no Remix |
| `smart-contract/tests/` | quatro suítes Solidity nativas, auxiliares e testes locais de integração |
| `offchain/` | pessoa, prova da carteira, saldo confirmado, cotas, pedidos, cancelamentos e histórico persistente |

Quantidade de arquivos Solidity não equivale a quantidade de contratos do produto. Existe um token do projeto e uma moeda auxiliar de testes. Não há necessidade técnica de criar seis contratos para preencher uma contagem.

## O que fica no contrato

`primaryPurchase`, `transfer` e `transferFrom` aplicam reserva, teto e regras de circulação. `reportRevenue` registra 15% do faturamento informado e fotografa os saldos; o portador saca por `claimRoyalty`. Sem stablecoin, `settleOffChain` registra a liquidação externa. Recuperação usa `reissue`; administração tem pausa e troca em dois passos.

`accessInfo` na v2 retorna saldo, membership e expiração. A v2 **não contém** `markRedeemed`, `activeUnitsOf`, `redeemedUnitsOf`, `RedemptionMarked` nem `UnitsMoved`. Pedir hospedagem altera o livro de cotas por pessoa no backend, sem chamada de resgate, queima ou flag no token.

A compra pressupõe aprovação externa; ter saldo não prova identidade civil. Datas dos oito períodos são controle operacional: o contrato limita a quantidade de reportes, mas não impõe o calendário semestral. A recuperação transfere saldo e pendências por burn/mint de igual quantidade, preservando o supply; não é queima por hospedagem.

## Executar e verificar

O [guia do Remix](../smart-contract/docs/guia-de-execucao.md) explica importação, compilação, testes e scripts. O [relatório de testes](../smart-contract/docs/relatorio-de-testes.md) distingue execução local, navegador e rede pública. O [manual off-chain](../offchain/README.md) explica a política confirmada de cotas e o serviço completo.

## Publicação e pendências

A v2 foi publicada pelo Remix/MetaMask em `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811, com 150 IBT e verificação exata no Sourcify. O backend usa banco independente. A v1 `0x111B510517087a76eF7D1914849898A0718A2734` permanece histórica; não houve migração automática. Recibos, parâmetros e fontes estão em `smart-contract/deployments/`.

A política de transferir apenas direitos livres, as faixas de benefícios, a stablecoin real, o calendário e os processos de KYC/hotel precisam de ratificação. Administração segue única; multisig não foi implementada. A validação acadêmica não substitui auditoria para produção.
