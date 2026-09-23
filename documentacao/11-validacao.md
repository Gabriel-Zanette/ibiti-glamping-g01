# 11 · Validação — atualização 11/09/2026

> **Revisão final em 22/09/2026:** a Parte 2 agora usa IBIToken técnico v3, local. Teto pessoal on-chain, tesouraria separada, calendário civil, compra atômica e recuperação com 48h estão implementados. As descrições de 10–11/09 abaixo são histórico da Parte 1; consulte [05](05-contrato-inteligente.md) e a [matriz de evolução](../smart-contract/docs/evolucao-v1-v2.md) para o estado vigente.


A arquitetura vigente usa Remix e validação local com solc 0.8.34 + Anvil 1.7.1. Hardhat foi removido. Instalação limpa com Node 24.19.0: a rodada inicial passou em 59 casos efetivos (37 Solidity, 5 integração contrato/cotas, 1 fluxo dos scripts e 16 off-chain). Após a publicação, a leitura de artefatos dos scripts foi corrigida para o Remix 2.5.7: a regressão reproduziu a falha, os dois formatos foram reexecutados e passaram, elevando o catálogo a **60 casos efetivos**. As demais suítes não foram repetidas. TypeScript do contrato passou novamente; a checagem do backend permanece a da rodada inicial.

O [relatório atual](../smart-contract/docs/relatorio-de-testes.md) contém comandos, contagem e limites. Os testes Solidity e scripts foram executados localmente em Anvil; a execução do plugin dentro do navegador ainda não foi comprovada. A API da demonstração respondeu status: ok, com 5 IBT, 3 hospedagens disponíveis e 2 usadas.

## Rede pública

As evidências de 11/09 anteriores à reorganização continuam válidas para a **v1**: IBIToken 0x111B510517087a76eF7D1914849898A0718A2734, bloco 11679925, 150 IBT, reserva 50, teto por carteira 20; tBRL 0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE, bloco 11679913. Recibos status=1, código de criação conferido e Sourcify com sucesso informado pelo Remix. A fonte histórica exata foi preservada.

**A v2 foi publicada pelo Remix/MetaMask na Sepolia** em `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811, com 150 IBT. Recibo confirmado, estado conferido e Sourcify exact_match, incluindo comparação das 17 fontes verificadas com as locais. O serviço em localhost:3001 foi reconfigurado para a v2 com banco novo, preservando a v1; usa blocos finalizados. A demonstração Anvil permanece em localhost:3000.

## Cenários relevantes

- CPF normalizado é único; carteira não pode ser reatribuída a outra pessoa.
- Assinatura errada, repetição, expiração e mudança de domínio são rejeitadas.
- Histórico persiste ao reabrir banco; alterar segredo sobre banco existente é rejeitado.
- Consumo e cancelamento são transacionais; duas conexões não gastam além da cota.
- Transferência de tokens usados não recria hospedagens; ida e volta conserva direitos.
- Reemissão preserva consumo, transfere direitos restantes e invalida acesso da carteira antiga.
- Pedido em aberto pode ser cancelado após transferência sem duplicar direitos; ausência de saldo impede confirmar/usar.
- Pausa, início da validade, expiração, falta de aprovação, limite por pessoa e datas inválidas impedem novos pedidos.
- Remarcação preserva cota; conclusão depois da chegada é permitida; uso concluído não pode ser cancelado.
- Integração com contrato real comprova que hospedagem não chama `markRedeemed`, mantém o ERC-20 e preserva royalty.
- Rede errada, outro contrato, histórico sem emissão, consumo legado e reorganização já contabilizada impedem sincronização insegura.

## Limites da evidência

Os testes de contrato e fluxo completo de pessoa/hospedagem/royalty usam EVM local. Na Sepolia foram realmente executadas, pelo Remix e confirmadas pelo titular na MetaMask, as publicações de IBIToken e tBRL e a criação de saldo simulado de tBRL. Os recibos e parâmetros estão no [registro de publicação](../smart-contract/docs/deploy-modelo-pessoa.md). Não foram feitas compras, cadastros de clientes, hospedagens nem reportes de receita na Sepolia nesta etapa. A publicação não representa reserva hoteleira ou pagamento real.

As dependências atuais dos dois projetos passaram no npm audit sem avisos conhecidos. Isso não substitui auditoria de código. A política de cotas foi confirmada em 11/09; prazo de cancelamento e custódia seguem em fechamento. KYC, hotel, custódia e apuração de receita reais continuam pendentes da IBITI.
