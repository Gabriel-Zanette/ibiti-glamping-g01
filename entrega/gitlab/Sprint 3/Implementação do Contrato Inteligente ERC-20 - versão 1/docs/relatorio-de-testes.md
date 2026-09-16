# Relatório de testes — IBIToken v2 / Remix

Validação em 11/09/2026, macOS, Node 24.19.0. Instalação limpa com npm ci nos dois projetos, sem dependências, artefatos ou caches anteriores. Compilador solc **0.8.34**, EVM **Osaka**, otimizador **200**; Anvil **1.7.1**. Nenhum teste depende de Hardhat.

## Resultado

| Grupo | Casos efetivos | Resultado |
|---|---:|---|
| Solidity: Token | 16 | passaram |
| Solidity: Governance | 8 | passaram |
| Solidity: Royalties | 9 | passaram |
| Solidity: Settlement | 4 | passaram |
| Integração contrato + cotas | 5 | passaram |
| Scripts JavaScript entregues ao Remix | 2 fluxos: artefatos na raiz e junto da fonte | passaram |
| Serviço off-chain | 16 | passaram |
| **Total atual** | **60** | **zero falhas nos casos validados** |

A rodada inicial executou 59 casos efetivos: 44 pass no projeto do contrato, incluindo o contêiner de quatro suítes Solidity, e 16 no serviço. Na publicação foi constatado que o Remix 2.5.7 usa artifacts/ na raiz. A regressão reproduziu a falha do script nesse formato; os scripts foram corrigidos para aceitar também os caminhos anteriores. Os dois fluxos de scripts foram reexecutados e passaram, elevando o catálogo a 60 casos efetivos. As demais suítes, sem alteração, não foram repetidas. TypeScript passou novamente no projeto do contrato; a checagem do backend permanece a da rodada inicial.

## O que foi exercitado

- Emissão, indivisibilidade, reserva, teto, compras, transferências, permissões, pausa, expiração, recuperação e administração em duas etapas.
- Ausência de funções públicas de emissão adicional, queima por uso ou resgate; hospedagem preserva os saldos de IBT.
- Apuração de 15%, fotografia de saldos, arredondamento, depósito atômico, saque sem duplicação, oito períodos e liquidação externa.
- Pessoa e carteira únicas, assinatura, isolamento de acesso, persistência, concorrência, consumo, cancelamento durante sincronização e transferências sem recriar cotas.
- Rede/contrato incorretos, histórico incompleto, reorganização e consumo legado bloqueiam sincronização insegura.
- Arquivos reais 01_publicar.js e 02_operar.js, nos dois formatos de diretório de artefatos: publicação da moeda fictícia e dos 150 IBT, compra de 5, reporte de 1.000 tBRL, saque de 5 tBRL, recuperação, pausa e retomada.

## Reprodução

Na pasta deste artefato:

    npm ci
    npm ci --prefix offchain
    npm test
    npm test --prefix offchain
    npm run typecheck
    npm run typecheck --prefix offchain
    npm run package:remix
    npm run demo --prefix offchain

Cada teste local inicia seu próprio Anvil em porta livre e o encerra ao terminar. As quatro suítes Solidity são compiladas como contratos reais e cada caso executa após beforeEach. O compilador verifica o limite EIP-170 para os contratos e testes gerados.

## Limite da evidência

As 37 funções Solidity foram executadas em **Anvil**. O teste dos scripts usa provider EIP-1193 conectado ao Anvil e simula somente a API de arquivos do Remix. Isso valida o bytecode e as operações, mas não comprova execução do plugin no navegador. A importação pelo seletor de pasta falhou. O workspace IBITI-v2-Sepolia foi carregado por um script de arquivos executado no próprio Remix; a compilação e a publicação do IBIToken foram concluídas no navegador. A ação status de scripts/02_operar.js foi executada com sucesso no próprio Remix contra a v2 Sepolia: 150 IBT, reserva 50, teto 20, não pausado, zero períodos. As 37 funções do plugin Solidity e o fluxo completo dos scripts de operação ainda não foram executados no navegador.

A demonstração foi iniciada sem Hardhat em http://localhost:3000: 5 IBT na pessoa fictícia, 2 hospedagens usadas, 3 disponíveis e royalty pago. O endpoint /health respondeu status: ok.

Em seguida, a **v2 foi publicada pelo Remix/MetaMask na Sepolia**: `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811, transação `0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c`. Recibo status=1; 150 IBT, zero decimais, reserva 50, teto 20, proprietário, tBRL e datas conferidos por RPC. O código de criação corresponde ao local desconsiderando metadados; o Sourcify confirmou correspondência exata de criação e execução e suas 17 fontes foram comparadas às locais. O Blockscout também informou verificação concluída no Remix. Etherscan não foi submetido por falta de chave de API. Custo: 0.005952505222443527 ETH de teste. Recibos, argumentos e entrada do compilador estão em deployments/. Não houve compra ou pagamento novo de royalties nessa implantação.

O backend Sepolia v2 também respondeu `/health` com `status: ok` após alcançar o bloco finalizado 11684822. O banco independente registrou 150 IBT e 150 direitos potenciais na administração, zero pessoas e zero hospedagens. A conferência foi somente de leitura; não cadastrou participantes nem realizou novas transações. Evidência em `backendVerification` no registro de publicação v2.

O npm audit dos dois projetos reportou zero vulnerabilidades conhecidas após atualizar dependências auxiliares. Isso não constitui auditoria do smart contract. KYC, hotel e apuração de receita reais continuam fora do protótipo.


## Validação da pasta do artefato para GitLab — 11/09/2026

Reexecutados na cópia organizada para esta entrega: 37 casos Solidity em Anvil, 5 integrações contrato/off-chain, 2 fluxos de scripts Remix e 16 casos off-chain (60 casos efetivos), sem falhas. Os dois typechecks também passaram. O resumo do runner Node inclui um contêiner adicional e exibe 45 entradas no pacote do contrato; esse contêiner não é um caso extra. A validação utilizou as versões de dependências já instaladas pelos lockfiles do projeto. A fonte IBIToken.sol permaneceu byte a byte igual à fonte da v2 publicada.
