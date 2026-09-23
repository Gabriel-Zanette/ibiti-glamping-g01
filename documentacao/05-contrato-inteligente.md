# 05 · Contrato inteligente — segunda entrega

Revisão de 22/09/2026. A Parte 2 acadêmica utiliza **IBIToken técnico v3**, local, ainda sem publicação pública. A versão técnica v2 de 11/09 corresponde à Parte 1 e continua histórica. [Evolução e critérios](../smart-contract/docs/evolucao-v1-v2.md).

O contrato mantém 150 IBT indivisíveis, reserva inicial de 50 e royalty de 15%. O teto é de 20 **por pessoa**, somando carteiras com o mesmo identificador opaco. O cadastro civil continua externo, mas `registerWallet` e `personOf` tornam o vínculo obrigatório antes da compra e permanente. `_update` aplica o agregado em transferências comuns e delegadas.

A tesouraria é fixada na implantação e mantém estoque, reserva e recebimento da compra mesmo após a troca de owner. Com stablecoin e preço configurados, `buyPrimary` cobra e entrega atomicamente ao comprador. Sem stablecoin, `primaryPurchase` continua entrega administrativa com pagamento externo; configurar stablecoin desabilita essa via.

`reportRevenue` exige encerramento do semestre civil e sequência até oito. O corte continua no saldo do reporte, inclusive quando há atraso. Funding ocorre na mesma transação; cada titular saca com `claimRoyalty`. Sem stablecoin no período, `settleOffChain` registra quitação externa. Expiração não apaga recebíveis.

`requestRecovery` anuncia por hash e aguarda 48 horas. `cancelRecovery` permite contestação pela origem/owner inclusive na pausa. `reissue` exige destino vazio da mesma pessoa, sem código e distinto de tesouraria/admin atual ou pendente; transfere recebíveis mesmo com saldo zero, preserva a oferta e revoga a origem. Troca de administração invalida anúncios por geração, mesmo se o ex-owner retornar. Sucessão entre pessoas não é implementada por esse fluxo.

Hospedagens e a política unused-first-v1 permanecem em `offchain/`, sem resgate, IDs por token ou queima por uso. O indexador confere identidade, recuperação pendente e tesouraria para liberar cotas. Não guarda chave administrativa: prepara o registro para assinatura externa.

Ferramentas: Remix, Solidity 0.8.34, Osaka, otimizador 200, OpenZeppelin 5.6.1; validação solc/Anvil/Node, sem Hardhat. [Guia](../smart-contract/docs/guia-de-execucao.md), [testes](../smart-contract/docs/relatorio-de-testes.md) e [limites](../smart-contract/docs/premissas-e-pendencias.md).
