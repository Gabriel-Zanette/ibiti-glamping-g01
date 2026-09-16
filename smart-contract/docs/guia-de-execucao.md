# Executar o IBIToken no Remix

Workspace da versão 2. O fluxo principal usa somente o [Remix IDE](https://remix.ethereum.org/) no navegador. Não requer Hardhat nem Node.

## 1. Abrir o workspace

Extraia `IBITI-Remix.zip` para uma pasta chamada `IBITI-Remix` (ou use a pasta pronta em `entrega/IBITI-Remix/`). No File Explorer do Remix, abra o menu de workspaces, escolha **New workspace → Import Project** e selecione essa pasta. Import Project recebe uma pasta, não um arquivo ZIP. Preserve as subpastas `contracts/`, `scripts/` e `tests/`. Em `contracts/vendor/openzeppelin/` estão as dependências reais e versionadas do token.

## 2. Compilar

No Solidity Compiler, selecione **0.8.34**, EVM **Osaka**, otimizador habilitado e **200 runs**. Compile `contracts/IBIToken.sol` e `contracts/mocks/MockStablecoin.sol`. Mantenha habilitada a geração de metadados do compilador.

O contrato principal é `IBIToken`. `MockStablecoin` representa apenas moeda de teste. Bibliotecas e contratos auxiliares de teste não são ativos a publicar.

## 3. Rodar testes nativos

Ative o plugin **Solidity Unit Testing**. Selecione `tests` como diretório e execute os quatro arquivos terminados em `_test.sol`: Token, Governance, Royalties e Settlement. Eles usam `beforeEach`, `require` e retorno booleano: qualquer condição incorreta reverte o teste. São 37 testes Solidity.

Não selecione `tests/helpers/`: contém apenas carteiras e fixtures de teste. Os testes criam suas próprias instâncias isoladas, sem usar carteiras reais nem Sepolia.

## 4. Demonstrar na Remix VM

Em Deploy & Run Transactions selecione **Remix VM**. Abra `scripts/01_publicar.js` e clique em Run. O script publica a moeda de teste e o IBIToken, cria 1.000 tBRL fictícios e salva os endereços em `deployments/remix-latest.json`. A emissão continua sendo 150 IBT.

Abra `scripts/02_operar.js`. O padrão `acao: 'status'` apenas consulta. Edite `config` para:

| Ação | Conta e campos |
|---|---|
| `compra` | administrador; `destino`, `quantidade`, `referencia` |
| `transferencia` | portador; `destino` já com saldo e `quantidade` |
| `reporte` | administrador; `faturamento` na moeda de pagamento e `referencia` |
| `saque` | portador; `periodo` já reportado |
| `recuperacao` | administrador; `origem` e `destino` |
| `pausar` / `retomar` | administrador |

Exemplo: compre 5 IBT para a segunda conta, reporte 1.000 tBRL de faturamento com a primeira conta e saque o período 1 com a segunda. O royalty total será 150 tBRL e o portador de 5 IBT receberá 5 tBRL. Esse faturamento é fictício.

As demais funções administrativas e consultas também ficam disponíveis em Deployed Contracts, no próprio Remix. O pedido de hospedagem é operado no Passaporte off-chain e não tem função de resgate neste contrato.

## 5. Publicar na Sepolia

Selecione Browser Extension / MetaMask na rede Sepolia. A v2 já está publicada em `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811. Use esse endereço para operar a entrega atual. A v1 em `0x111B510517087a76eF7D1914849898A0718A2734` é histórica. Recibos, parâmetros e fontes estão no repositório, em `smart-contract/docs/deploy-modelo-pessoa.md`.

Somente se desejar outra instância de teste, para uma nova publicação deliberada da v2, revise `scripts/01_publicar.js`, habilite `permitirSepolia`, confira o endereço da stablecoin e as datas e execute. A MetaMask apresentará a transação. O script reutiliza a tBRL existente na Sepolia e publica somente o novo IBIToken. As datas padrão são de demonstração, começando no bloco atual, por 1.460 dias.

Salve o registro com endereço, rede, hash e bloco de criação. Uma nova instância tem nova emissão de teste e não migra saldos, royalties nem histórico da v1. A v2 é uma publicação de demonstração separada, não atualização do endereço antigo. Para conectar o backend, configure o novo endereço e o bloco de emissão, com um banco separado. Não reutilize um banco de outra instância. Aguarde a finalização da Sepolia antes de autorizar hospedagens.

## Sistema completo

O ZIP é o workspace do token. O cadastro, autenticação e controle de cotas ficam no diretório `offchain/` do repositório. Eles exigem Node 24 e suas instruções próprias. O Remix não hospeda backend nem banco de dados.

Referências oficiais: [testes Solidity](https://remix-ide.readthedocs.io/en/latest/unittesting.html), [scripts no Remix](https://remix-ide.readthedocs.io/en/latest/running_js_scripts.html), [Anvil para validação local](https://getfoundry.sh/anvil/overview/).
