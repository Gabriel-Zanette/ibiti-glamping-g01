> **Registro da revisão técnica v3 (22/09), preservado como trajetória.** A fonte atual é v4: [guia vigente](guia-v4.md), [inventário de regras e pendências](../../docs/decisoes/2026-09-25-inventario-completo-token.md). Calendário fixo, transferências, corte por fotografia e espera de 48h abaixo foram superados. Memorando v2 já recebido e revisado em feedback separado.

# Execução — Parte 2 acadêmica / IBIToken técnico v3

## 1. Validar o repositório completo

Requisitos: Node.js 24+ e instalação das dependências dos dois módulos. Anvil 1.7.1 vem no pacote npm; não instalar Hardhat. Na raiz:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
```

Os testes compilam Solidity 0.8.34 com Osaka e otimizador 200; iniciam Anvil em portas livres, verificam transações reais e encerram a EVM. `feedback.test.ts` avança somente o relógio da EVM local para testar 48 horas e os oito semestres. Não altera relógio do computador ou da Sepolia.

As suítes Solidity compactas são importáveis no Remix; os cenários temporais e a integração ficam em Node/Anvil. A separação evita ultrapassar o limite EIP-170 por embutir a criação do token em contratos de teste grandes. O compilador verifica esse limite também nos contratos de teste.

## 2. Importar no Remix

1. Gere `npm run package:remix --prefix smart-contract` ou utilize `entrega/IBITI-Remix.zip`.
2. Extraia o ZIP. Em https://remix.ethereum.org/?nomigrationredirect, abra **New workspace → Import Project** e selecione a pasta extraída.
3. No compilador Solidity, selecione **0.8.34**, EVM **Osaka**, otimizador **200**.
4. Compile `contracts/IBIToken.sol` e `contracts/mocks/MockStablecoin.sol`.
5. No plugin **Solidity Unit Testing**, selecione os quatro arquivos `*_test.sol`. As datas 2025–2028 desses testes são demonstrativas; não definem validade comercial. As mesmas funções são executadas pelo comando local acima.

O token não usa contratos de teste como dependências. O plugin do navegador não foi reexecutado nesta revisão; sua compatibilidade de compilação e as funções foram verificadas em Anvil.

## 3. Publicar uma demonstração local

Selecione **Remix VM** em Deploy & Run Transactions. Abra `scripts/01_publicar.js` e execute. O script cria moeda fictícia tBRL de seis decimais e IBIToken com 150 unidades, reserva 50, teto 20 por pessoa e preço 37.055,19 tBRL. O estoque fica na carteira administrativa inicial, que também é tesouraria imutável. tBRL não é dinheiro e não altera o supply de IBT.

Por padrão, `anoInicio: 2027` define 01/01/2027 00:00 UTC até 31/12/2030 23:59:59 UTC. Para observar reportes já maduros no Remix durante 2026, pode-se usar `anoInicio: 2025` **em outra instância explicitamente demonstrativa**. Nenhuma função administrativa ignora os fechamentos ou a espera de recuperação.

O registro `deployments/remix-latest.json` identifica rede, contrato, bloco, transação, tesouraria e preço. Salve-o. Os scripts aceitam artefatos na raiz `artifacts/` ou junto do fonte.

## 4. Cadastrar pessoa e registrar carteira

O contrato aceita apenas carteira registrada antes da compra. Fluxo do serviço:

1. `POST /admin/people` com CPF de demonstração; aprovar com `/admin/people/:id/verification`.
2. Solicitar `/admin/people/:id/wallet-challenge`; o titular assina a mensagem; `/auth/verify` comprova controle e vincula a carteira.
3. `POST /admin/people/:id/onchain-registration` com `{ "wallet": "0x..." }` e credencial administrativa. Retorna `to`, `chainId`, `personId` e `data` para assinatura do administrador. O backend não possui chave nem transmite a transação.
4. No script `02_operar.js`, definir `acao: 'registrar'`, `destino` e `identificadorPessoa` com o bytes32 retornado. Executar com a conta owner.

Carteiras da mesma pessoa devem receber **o mesmo** identificador. Não publicar CPF, hash simples de CPF ou documentos. No teste manual sem serviço, usar identificadores aleatórios de 32 bytes, mantendo o mesmo para cada pessoa. O contrato impede reatribuir uma carteira; a prova de unicidade civil é responsabilidade externa.

## 5. Comprar e transferir

Na moeda simulada, use `mint(carteiraCompradora, 37055190000)` para fornecer exatamente 37.055,19 tBRL de teste para um IBT. Essa função é um faucet acadêmico, não emissão de valor real.

Com a carteira do comprador selecionada, execute `02_operar.js` com `acao: 'compra'`, `quantidade` e referência. O script aprova o pagamento e chama `buyPrimary`. A transação de compra cobra e entrega atomicamente. A aprovação é uma transação anterior; uma falha de compra não cobra nem entrega IBT. Consulte `primaryUnitPrice` para conferir o preço em unidades mínimas.

`primaryPurchase(destino,units,ref)` funciona apenas com stablecoin zero, pelo owner, e depende de pagamento externo. Em modo stablecoin ela reverte. Não há entrega direta da tesouraria por `transfer` ou `transferFrom`.

Na secundária, `acao: 'transferencia'` exige destino registrado e já com saldo. Limite 20 considera todas as carteiras da pessoa. Retorno à tesouraria é permitido; não promete recompra/pagamento.

## 6. Apurar e receber

O admin informa faturamento bruto, não o royalty pronto. No script, `acao: 'reporte'` calcula aprovação máxima necessária e chama `reportRevenue`. O contrato aplica 15%, registra parcelas, inclui a tesouraria e deposita somente a soma devida. Depois o titular usa `acao: 'saque'` e `periodo`.

| Período | Primeiro instante permitido (UTC) |
| --- | --- |
| 2027-1 | 01/07/2027 00:00 |
| 2027-2 | 01/01/2028 00:00 |
| 2028-1 | 01/07/2028 00:00 |
| 2028-2 | 01/01/2029 00:00 |
| 2029-1 | 01/07/2029 00:00 |
| 2029-2 | 01/01/2030 00:00 |
| 2030-1 | 01/07/2030 00:00 |
| 2030-2 | 01/01/2031 00:00 |

`periodEnd(n)` expõe a data. Reportes atrasados permanecem possíveis, em ordem. O corte é no saldo da apuração, não numa fotografia retroativa do semestre. Expiração não impede saque de recebíveis.

## 7. Recuperar acesso e trocar administrador

Após conferir identidade e a nova carteira EOA da mesma pessoa, o admin executa `acao: 'anunciar-recuperacao'` com origem, destino e referência do processo. O destino precisa estar vazio, sem recebíveis ou vínculo com outra pessoa; não pode ser tesouraria, admin atual/pendente nem endereço com código. `recoveries(origem)` informa `executeAfter`.

Aguardar 48 horas reais da rede; então usar `acao: 'recuperacao'`. Antes disso a chamada reverte. Origem e destino ficam bloqueados para circulação durante a espera. Origem ou owner podem executar `acao: 'cancelar-recuperacao'`, inclusive na pausa. A recuperação funciona com saldo zero se houver royalty pendente; o backend preserva pessoa, consumo e pedidos e invalida sessões antigas.

Use `transferOwnership(novoOwner)` e aceite pela nova conta com `acceptOwnership`. Tesouraria/reserva/estoque não mudam. Anúncios anteriores ficam inválidos por geração administrativa, inclusive se o antigo owner voltar; cancelar e anunciar novamente. Multisig é uma alternativa de custódia, não uma integração implantada aqui.

## 8. Demonstração do serviço

```bash
npm run demo --prefix offchain
```

Abra http://localhost:3000. O comando usa Anvil local e janela demonstrativa **2025–2028**, compra real com tBRL, cadastro e cotas; guarda configuração privada em `offchain/.env.demo` e banco em `offchain/data/`. CTRL+C encerra o processo. Se portas estiverem ocupadas, defina `PORT` e `DEMO_RPC_PORT`. Não publicar arquivos `.env`, bancos ou chaves. O serviço confirma hospedagem simulada, sem hotel/KYC reais.

## 9. Sepolia e entrega

A v3 técnica **não foi publicada** nesta revisão. Os endereços de 11/09 são v1/v2 históricos e não aceitam o novo fluxo. Uma publicação deliberada usa `permitirSepolia: true`, Remix/MetaMask, rede Sepolia e recibo próprio. O script reutiliza tBRL; não pedir nem compartilhar chave privada. Registrar endereço/bloco somente após confirmação.

Nova instância exige banco separado e configuração `TOKEN_ADDRESS`/`START_BLOCK`; não reutilizar o histórico de outra emissão. Aguardar blocos finalizados. Não se migraram automaticamente pessoas, cotas, royalties ou saldo. O pacote completo contém a Parte 2 preparada para o GitLab; publicar no repositório acadêmico é uma etapa posterior.
