# Relatório de testes — IBIToken v1

Saída integral de `npx hardhat test --gas-stats`, executado em 2026-09-02 na rede simulada do Hardhat 3
(solc 0.8.34, perfil `default`, sem otimizador). Reproduzível com:

```bash
npm install
npx hardhat test --gas-stats
```

## Resultado

```text
No contracts to compile

Running Solidity tests


Running Mocha tests


  IBIToken
    Emissão única (deploy)
      ✔ tem nome IBIToken, símbolo IBT e zero casas decimais (token indivisível) (55ms)
      ✔ cunha todo o supply (150) na carteira administrativa, com reserva 50 e teto 20 por carteira
      ✔ emite o evento Emission com os parâmetros da emissão
      ✔ não existe função de mint nem de burn na interface pública
      ✔ rejeita parâmetros inválidos no deploy
    Compra primária (porta de entrada única)
      ✔ entrega unidades a uma carteira verificada e registra a venda
      ✔ só a carteira administrativa pode executar a compra primária
      ✔ rejeita quantidade zero
      ✔ aplica o teto de 20 unidades por carteira (2/15 do supply)
      ✔ protege a reserva da IBITI: no máximo 100 unidades vão a mercado
      ✔ a reserva só pode ser reduzida por decisão expressa (nunca aumentada)
      ✔ a transferência direta da carteira administrativa obedece às mesmas travas
    Transferências entre portadores
      ✔ permite transferir para quem já tem saldo (portador verificado)
      ✔ rejeita transferência para carteira sem saldo (não verificada)
      ✔ transferFrom (custodiante autorizado) segue as mesmas regras
      ✔ aplica o teto por carteira também no mercado secundário
      ✔ permite devolver unidades à carteira administrativa (isenta do teto)
      ✔ saldo insuficiente reverte com o erro padrão do ERC-20
      ✔ mantém o registro de portadores coerente com os saldos
    Resgate da experiência (marcação sem queima)
      ✔ move unidades de ativas para resgatadas sem alterar saldo nem supply
      ✔ rejeita resgatar mais unidades do que as ativas (resgate único por unidade)
      ✔ só a carteira administrativa marca resgates, e nunca zero unidades
      ✔ rejeita resgates antes do início da validade
    Transferência de unidades já resgatadas
      ✔ move primeiro unidades ativas e depois resgatadas, que chegam marcadas
      ✔ quando a quantidade cabe nas ativas, nenhuma unidade resgatada se move
      ✔ uma unidade resgatada não pode ser resgatada de novo pelo novo portador (sem gasto duplo)
    Royalties — reporte de receita e registro pro-rata
      ✔ calcula 15% do faturamento bruto e registra o devido a cada carteira na fotografia de saldos
      ✔ a fotografia é a do momento do reporte: transferências posteriores não alteram o registro
      ✔ unidades resgatadas continuam contando para o royalty (o token não é consumido)
      ✔ exige que a IBITI tenha aprovado a stablecoin: sem allowance o reporte inteiro reverte
      ✔ aceita no máximo 8 semestres, em ordem
      ✔ um semestre sem faturamento registra royalty zero e avança o período
      ✔ só a carteira administrativa reporta; períodos não reportados não são consultáveis
    Royalties — saque em stablecoin (pull)
      ✔ cada portador saca o que lhe cabe; segundo saque reverte
      ✔ a reserva da IBITI também saca a sua parte
      ✔ quem não tinha saldo na fotografia não tem o que sacar; período inexistente reverte
      ✔ pendingRoyaltyOf soma os períodos ainda não sacados
      ✔ liquidação fora da chain não se aplica a período pago on-chain
    Royalties — liquidação em reais fora da blockchain
      ✔ sem stablecoin, o reporte apenas registra o devido e a IBITI marca os pagamentos
      ✔ a stablecoin pode ser definida uma única vez; períodos anteriores seguem fora da chain
    Reemissão por perda de chave ou sucessão
      ✔ move saldo, contadores e royalties pendentes para a nova carteira e invalida a antiga
      ✔ a carteira revogada não recebe, não transfere, não resgata nem saca
      ✔ valida os parâmetros da reemissão (saldo, endereços, teto, carteira administrativa)
      ✔ depois da reemissão, o próximo reporte contempla a nova carteira e não a antiga
    Validade de 4 anos
      ✔ após a expiração, transferências e resgates são rejeitados; membership se extingue
      ✔ o fechamento do último semestre e os saques continuam possíveis depois da expiração
    Pausa de emergência
      ✔ congela transferências, compras, resgates, reportes e saques; unpause restaura
    Administração única da IBITI
      ✔ troca de carteira administrativa em dois passos, com entrega da reserva à nova carteira
      ✔ a renúncia à administração está desabilitada
    Invariantes
      ✔ soma dos saldos = supply; resgatadas <= saldo; registro de portadores = carteiras com saldo


  50 passing (480ms)


50 passing (50 mocha)
```

## Estatísticas de gas

Valores em unidades de gas por chamada (mínimo, média, mediana, máximo e número de chamadas durante a suíte).
Leituras: o custo de `reportRevenue` cresce com o número de carteiras com saldo (no cenário dos testes, 3 a 5
carteiras); o limite superior é dado pelo próprio supply (150 carteiras). O tamanho do bytecode (perfil sem
otimizador) fica abaixo do limite de 24 576 bytes da EVM; o perfil `production`, usado no deploy em Sepolia,
liga o otimizador.

```text
╔═══════════════════════════════════════════════════════════════════════════╗
║                           Gas Usage Statistics                            ║
╚═══════════════════════════════════════════════════════════════════════════╝
╔═══════════════════════════════════════════════════════════════════════════╗
║ contracts/IBIToken.sol:IBIToken                                           ║
╟────────────────────┬─────────┬─────────┬─────────┬─────────┬──────────────╢
║ Function name      │ Min     │ Average │ Median  │ Max     │ #calls       ║
╟────────────────────┼─────────┼─────────┼─────────┼─────────┼──────────────╢
║ acceptOwnership    │ 28661   │ 28661   │ 28661   │ 28661   │ 1            ║
║ accessInfo         │ 29848   │ 29848   │ 29848   │ 29848   │ 2            ║
║ activeUnitsOf      │ 26753   │ 26762   │ 26765   │ 26765   │ 7            ║
║ approve            │ 46936   │ 46936   │ 46936   │ 46936   │ 1            ║
║ balanceOf          │ 24337   │ 24346   │ 24349   │ 24349   │ 23           ║
║ claimRoyalty       │ 74908   │ 89565   │ 92008   │ 92008   │ 7            ║
║ decimals           │ 21491   │ 21491   │ 21491   │ 21491   │ 1            ║
║ emissionCap        │ 21502   │ 21502   │ 21502   │ 21502   │ 1            ║
║ holderCount        │ 23661   │ 23661   │ 23661   │ 23661   │ 2            ║
║ holders            │ 29080   │ 32526   │ 32839   │ 34092   │ 8            ║
║ isExpired          │ 21481   │ 21481   │ 21481   │ 21481   │ 1            ║
║ isMember           │ 24442   │ 25965   │ 26726   │ 26726   │ 6            ║
║ lastReportedPeriod │ 23692   │ 23692   │ 23692   │ 23692   │ 5            ║
║ markRedeemed       │ 54980   │ 55021   │ 54980   │ 55352   │ 9            ║
║ maxPerWallet       │ 21545   │ 21545   │ 21545   │ 21545   │ 1            ║
║ name               │ 24462   │ 24462   │ 24462   │ 24462   │ 1            ║
║ owner              │ 23786   │ 23786   │ 23786   │ 23786   │ 3            ║
║ pause              │ 28203   │ 28203   │ 28203   │ 28203   │ 1            ║
║ pendingOwner       │ 23645   │ 23645   │ 23645   │ 23645   │ 1            ║
║ pendingRoyaltyOf   │ 30022   │ 30022   │ 30022   │ 30022   │ 2            ║
║ periodInfo         │ 40401   │ 40401   │ 40401   │ 40401   │ 5            ║
║ primaryPurchase    │ 123111  │ 123190  │ 123123  │ 123507  │ 22           ║
║ redeemedUnitsOf    │ 24404   │ 24413   │ 24416   │ 24416   │ 11           ║
║ reduceReserve      │ 30579   │ 30579   │ 30579   │ 30579   │ 1            ║
║ reissue            │ 122342  │ 146827  │ 145113  │ 174742  │ 4            ║
║ reportRevenue      │ 137567  │ 313069  │ 314948  │ 352332  │ 35           ║
║ reservedUnits      │ 23622   │ 23622   │ 23622   │ 23622   │ 1            ║
║ revoked            │ 24419   │ 24419   │ 24419   │ 24419   │ 1            ║
║ royaltyDue         │ 24711   │ 24721   │ 24723   │ 24723   │ 22           ║
║ royaltyPaid        │ 24678   │ 24678   │ 24678   │ 24678   │ 2            ║
║ saleableUnits      │ 28145   │ 28366   │ 28421   │ 28421   │ 5            ║
║ setStablecoin      │ 30756   │ 30756   │ 30756   │ 30756   │ 1            ║
║ settleOffChain     │ 55514   │ 55514   │ 55514   │ 55514   │ 1            ║
║ symbol             │ 24438   │ 24438   │ 24438   │ 24438   │ 1            ║
║ totalSupply        │ 23631   │ 23631   │ 23631   │ 23631   │ 3            ║
║ transfer           │ 53237   │ 68326   │ 57209   │ 120376  │ 14           ║
║ transferFrom       │ 59386   │ 59386   │ 59386   │ 59386   │ 1            ║
║ transferOwnership  │ 48256   │ 48256   │ 48256   │ 48256   │ 1            ║
║ unpause            │ 28221   │ 28221   │ 28221   │ 28221   │ 1            ║
║ validFrom          │ 21441   │ 21441   │ 21441   │ 21441   │ 1            ║
║ validUntil         │ 21506   │ 21506   │ 21506   │ 21506   │ 1            ║
╟────────────────────┼─────────┼─────────┼─────────┼─────────┼──────────────╢
║ Deployment         │ Min     │ Average │ Median  │ Max     │ #deployments ║
╟────────────────────┼─────────┼─────────┼─────────┼─────────┼──────────────╢
║                    │ 4454748 │ 4464175 │ 4454748 │ 4478315 │ 5            ║
╟────────────────────┼─────────┼─────────┴─────────┴─────────┴──────────────╢
║ Bytecode size      │ 18903   │                                            ║
╚════════════════════╧═════════╧════════════════════════════════════════════╝
╔═══════════════════════════════════════════════════════════════════════════╗
║ contracts/mocks/MockStablecoin.sol:MockStablecoin                         ║
╟────────────────────┬─────────┬─────────┬─────────┬─────────┬──────────────╢
║ Function name      │ Min     │ Average │ Median  │ Max     │ #calls       ║
╟────────────────────┼─────────┼─────────┼─────────┼─────────┼──────────────╢
║ approve            │ 24956   │ 41669   │ 47240   │ 47240   │ 4            ║
║ balanceOf          │ 24282   │ 24282   │ 24282   │ 24282   │ 7            ║
║ mint               │ 68911   │ 68911   │ 68911   │ 68911   │ 3            ║
╟────────────────────┼─────────┼─────────┼─────────┼─────────┼──────────────╢
║ Deployment         │ Min     │ Average │ Median  │ Max     │ #deployments ║
╟────────────────────┼─────────┼─────────┼─────────┼─────────┼──────────────╢
║                    │ 933704  │ 933704  │ 933704  │ 933704  │ 3            ║
╟────────────────────┼─────────┼─────────┴─────────┴─────────┴──────────────╢
║ Bytecode size      │ 3765    │                                            ║
╚════════════════════╧═════════╧════════════════════════════════════════════╝
```
