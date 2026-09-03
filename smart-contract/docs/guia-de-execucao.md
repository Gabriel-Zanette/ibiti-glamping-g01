# Guia de execução — IBIToken v1

Tudo o que é preciso para compilar, testar, demonstrar e implantar o contrato, do zero, em qualquer
máquina. Os comandos foram validados em macOS com Node.js 24; funcionam em Linux e Windows (PowerShell)
com Node.js 22 ou superior.

## 1. Requisitos

| Item | Para quê | Onde obter |
|---|---|---|
| **Node.js ≥ 22** e npm | rodar o Hardhat 3 e os testes | https://nodejs.org (LTS) |
| Git | clonar o repositório | — |
| **MetaMask** (opcional) | operar o contrato na Sepolia pela interface da carteira | https://metamask.io |
| **ETH de teste (Sepolia)** (só para deploy real) | pagar o gas do deploy e das transações | faucets públicos, ex.: https://cloud.google.com/application/web3/faucet/ethereum/sepolia |
| **URL RPC da Sepolia** (só para deploy real) | conectar o Hardhat à rede | Infura, Alchemy, QuickNode ou um RPC público (ex.: `https://ethereum-sepolia-rpc.publicnode.com`) |
| Chave de API do Etherscan (opcional) | verificar o código‑fonte no explorador | https://etherscan.io/myapikey |

Nenhuma outra ferramenta é necessária: o compilador Solidity (0.8.34) é baixado automaticamente pelo
Hardhat na primeira compilação.

## 2. Instalação

```bash
cd smart-contract
npm install
```

## 3. Compilar, testar e checar tipos

```bash
npm run build            # compila contracts/ (perfil default)
npm test                 # executa os 50 testes em uma rede simulada em memória
npx hardhat test --gas-stats   # os mesmos testes, com estatísticas de gas por função
npm run typecheck        # checagem TypeScript de testes e scripts
```

Saída esperada de `npm test`: `50 passing`. A saída integral está em
[`relatorio-de-testes.md`](relatorio-de-testes.md).

## 4. Fluxo de demonstração (rede simulada)

```bash
npm run demo
```

O script [`scripts/demo-flow.ts`](../scripts/demo-flow.ts) implanta a stablecoin de teste e o IBIToken,
executa compras primárias (Helena 20, Beatriz 10, Gabriel 5), mostra as travas rejeitando operações
inválidas, marca resgates, transfere unidades resgatadas, reporta um semestre com os números do
whitepaper, saca royalties, reemite a carteira de Helena para uma herdeira, consulta o acesso como um
parceiro do território faria e, por fim, avança o relógio da rede para além dos 4 anos. Cada passo é
narrado no terminal — serve de roteiro para a apresentação em aula ou vídeo.

## 5. Deploy local com Hardhat Ignition

```bash
npm run deploy:local
# equivale a: npx hardhat ignition deploy ignition/modules/IBITokenSepoliaDemo.ts
```

Implanta, em uma rede simulada efêmera, a stablecoin de teste (tBRL, 6 casas) e o IBIToken já apontando
para ela, e cunha 100 milhões de tBRL para a carteira administrativa (conta 0 do Hardhat). Os módulos
disponíveis:

| Módulo | Uso | Parâmetros padrão |
|---|---|---|
| `ignition/modules/IBITokenSepoliaDemo.ts` | demonstração (local ou Sepolia), com stablecoin de teste | validade iniciada em 2026‑09‑01, 4 anos; 150 unidades |
| `ignition/modules/IBIToken.ts` | deploy de referência com os parâmetros do whitepaper | validade 2027‑01‑01 → 2030‑12‑31; 150 unidades; sem stablecoin |

Todos os parâmetros podem ser sobrescritos por um arquivo JSON (modelo em
[`ignition/parameters.example.json`](../ignition/parameters.example.json)):

```bash
npx hardhat ignition deploy ignition/modules/IBIToken.ts --parameters ignition/parameters.json
```

## 6. Configurar os segredos para a Sepolia

O Hardhat 3 lê os segredos de **variáveis de configuração**. Duas formas, à escolha:

**A) Keystore criptografado do Hardhat (recomendado)** — pede uma senha e guarda os valores cifrados fora
do repositório:

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
npx hardhat keystore set ETHERSCAN_API_KEY     # opcional
```

**B) Variáveis de ambiente** — mesmo nome, exportadas no shell antes do comando (modelo em `.env.example`):

```bash
export SEPOLIA_RPC_URL="https://ethereum-sepolia-rpc.publicnode.com"
export SEPOLIA_PRIVATE_KEY="0x..."     # chave de uma carteira DE TESTE com ETH Sepolia
```

> Use sempre uma carteira criada só para testes. A chave privada nunca deve ir para o repositório
> (`.env` e `.env.*` já estão no `.gitignore`).

## 7. Deploy na Sepolia

```bash
npm run deploy:sepolia
# equivale a: npx hardhat ignition deploy ignition/modules/IBITokenSepoliaDemo.ts --network sepolia
```

O Ignition pede confirmação, envia as transações e grava os endereços em
`ignition/deployments/chain-11155111/deployed_addresses.json` (esse diretório deve ser versionado: é o
registro da entrega). A carteira que faz o deploy vira a **carteira administrativa** (parâmetro `admin`),
recebe as 150 unidades e o saldo de tBRL de teste.

Para o deploy de referência (sem stablecoin, datas do whitepaper):

```bash
npm run deploy:sepolia:producao
```

### Verificar o código‑fonte no explorador

```bash
npx hardhat ignition verify chain-11155111 --network sepolia
```

O comando envia o código dos contratos do deployment ao Etherscan (chave `ETHERSCAN_API_KEY`) e ao
Sourcify. Alternativa manual: `npx hardhat verify --network sepolia <endereço> <argumentos do construtor>`
(consulte `npx hardhat verify --help`).

## 8. Operar o contrato na Sepolia

### Pelo script (carteira administrativa)

```bash
TOKEN=0x<endereço> ACTION=status   npx hardhat run scripts/operate-sepolia.ts --network sepolia
TOKEN=0x<endereço> ACTION=purchase TO=0x<carteira verificada> UNITS=5 REF="venda#001" \
  npx hardhat run scripts/operate-sepolia.ts --network sepolia
TOKEN=0x<endereço> ACTION=redeem   HOLDER=0x<carteira> UNITS=1 REF="voucher#2027-0001" \
  npx hardhat run scripts/operate-sepolia.ts --network sepolia
TOKEN=0x<endereço> ACTION=report   GROSS=3398738.38 REF="relatorio-2027-S1.pdf" \
  npx hardhat run scripts/operate-sepolia.ts --network sepolia
TOKEN=0x<endereço> ACTION=reissue  FROM=0x<antiga> TO=0x<nova> \
  npx hardhat run scripts/operate-sepolia.ts --network sepolia
TOKEN=0x<endereço> ACTION=access   HOLDER=0x<carteira> \
  npx hardhat run scripts/operate-sepolia.ts --network sepolia
```

`GROSS` é informado em unidades da stablecoin configurada (ex.: `3398738.38` tBRL); o script aprova o
depósito do royalty automaticamente antes do reporte.

### Pela MetaMask (portadores)

1. *Importar tokens* → endereço do contrato → símbolo **IBT**, **0** casas decimais.
2. Enviar unidades para **outra carteira que já tenha saldo** (transferência para carteira vazia é rejeitada
   pelo contrato — comportamento esperado).
3. Para sacar o royalty, use a aba *Write Contract* do Etherscan (contrato verificado) → `claimRoyalty(período)`,
   ou o script acima com a chave do portador.

### Pelo Etherscan (contrato verificado)

*Read Contract* expõe `accessInfo`, `isMember`, `saleableUnits`, `periodInfo`, `royaltyDue` etc.;
*Write Contract* permite à carteira administrativa executar `primaryPurchase`, `markRedeemed`,
`reportRevenue`, `reissue`, `pause`.

### Pelo Remix (alternativa sem Hardhat)

Cole `contracts/IBIToken.sol` e `contracts/mocks/MockStablecoin.sol` no Remix; os imports
`@openzeppelin/contracts/...` são resolvidos automaticamente. Compile com **0.8.24 ou superior** e faça o
deploy pelo *Injected Provider (MetaMask)* informando os cinco argumentos do construtor
(`admin`, `emissionCap`, `validFrom`, `validUntil`, `stablecoin`).

## 9. Roteiro sugerido de demonstração (aula ou vídeo)

| Passo | O que mostrar | Regra evidenciada |
|---|---|---|
| 1 | `status` do contrato recém‑implantado: supply 150, reserva 50, à venda 100 | emissão única, reserva |
| 2 | `purchase` para a carteira A (5) e para a carteira B (3) | compra primária, porta de entrada |
| 3 | Na MetaMask, A envia 2 unidades para B; depois tenta enviar 1 para uma carteira vazia (falha) | transferência só entre portadores |
| 4 | B tenta receber além de 20 unidades (falha) | teto por carteira |
| 5 | `redeem` de 1 unidade de A; `access` de A mostra 1 resgatada | resgate sem queima |
| 6 | A envia todas as unidades para B: a resgatada chega marcada | sem gasto duplo |
| 7 | `report` do semestre; `access`/`royaltyDue` mostram o valor por carteira; B executa `claimRoyalty(1)` | royalty pro‑rata, saque |
| 8 | `reissue` de A para uma nova carteira; A fica revogada | perda de chave / sucessão |

## 10. Solução de problemas

| Sintoma | Causa provável | O que fazer |
|---|---|---|
| `npm install` avisa sobre `esbuild` e `allow-scripts` | política de scripts do npm 11 | inofensivo; ignore (ou `npm approve-scripts esbuild`) |
| Erro ao baixar o `solc` | sem acesso à internet na primeira compilação | conecte‑se e rode `npm run build` de novo |
| `HHE11 ... not in an interactive shell` | `hardhat --init` em terminal não interativo | não é necessário: o projeto já está inicializado |
| `insufficient funds` no deploy | carteira sem ETH Sepolia | use um faucet |
| `ERC20InsufficientAllowance` no `reportRevenue` | a IBITI não aprovou o depósito da stablecoin | `approve` no contrato da stablecoin (o script `operate-sepolia.ts` faz isso) |
| `RecipientNotHolder` ao transferir | destino sem saldo | é a regra: só a carteira administrativa cria portadores |
| `Reconciliation failed` no Ignition | módulo alterado após um deploy anterior na mesma rede | use `--deployment-id <novo-nome>` ou apague `ignition/deployments/<chain>` (apenas em redes de teste) |

## 11. Registro da entrega na Sepolia (preencher após o deploy)

| Item | Valor |
|---|---|
| Endereço do IBIToken | — |
| Endereço da stablecoin de teste | — |
| Tx do deploy | — |
| Tx da compra primária | — |
| Tx da transferência entre portadores | — |
| Tx do resgate | — |
| Tx do reporte de receita | — |
| Código verificado | — |
