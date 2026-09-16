# Publicações e versões

## Versão 2 vigente na Sepolia

- IBIToken: `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`; **150 IBT**, zero decimais.
- Bloco: **11684811**.
- Transação: [0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c](https://sepolia.etherscan.io/tx/0x415a6618a50981407552e4297c48ab0e66c724d03d846cc3f9c165b5a114fb5c).
- Publicação: Remix IDE / MetaMask, em 11/09/2026 às 22:23:24 UTC.
- Compilador: Solidity 0.8.34+commit.80d5c536, otimizador 200, EVM Osaka.
- Administração: `0x549852CA58C2e843e29428a81Ab97D2d613BB749`; recebeu os 150 IBT, dos quais 50 são reserva inicial e 100 estoque para colocação.
- Limite: 20 IBT por carteira, exceto a administrativa.
- tBRL reutilizada: `0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE`; 6 decimais. Não houve nova publicação nem mint de tBRL.
- Vigência de demonstração: 1789152828 a 1915296828 (1.460 dias). Os timestamps estão no registro; não definem o calendário econômico de produção.
- Custo efetivo: 0.005952505222443527 ETH de teste; gas utilizado: 2414333.
- Verificação: [Sourcify, correspondência exata](https://repo.sourcify.dev/11155111/0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030/) e [Blockscout](https://eth-sepolia.blockscout.com/address/0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030?tab=contract). Etherscan não foi submetido, pois não há chave de API configurada.
- [Registro completo](../deployments/sepolia-remix-v2-2026-09-11.json), [recibo](../deployments/sepolia-remix-v2-2026-09-11.receipt.json) e [fontes/entrada do compilador](../deployments/source/Sepolia-v2-2026-09-11/).

A v2 remove as funções e os contadores legados de resgate. Hospedagens e cotas continuam no backend, por pessoa. O workspace do navegador chama-se **IBITI-v2-Sepolia**. A compilação e a publicação foram feitas no Remix, sem Hardhat.

## Backend da demonstração

O serviço em http://localhost:3001 usa `TOKEN_ADDRESS=0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, `START_BLOCK=11684811` e banco separado `data/sepolia-v2-2026-09-11/ibiti.sqlite`. A configuração anterior e o banco v1 foram preservados. O banco novo começa sem pessoas e hospedagens; o indexador reconstrói a emissão a partir do bloco inicial.

Aguarde finalização da Sepolia antes de usar cotas. Até o bloco de emissão estar finalizado, a verificação pode indicar contrato indisponível. Não reduzir a exigência de finalização para antecipar usos.

Na validação após a publicação, `/health` respondeu `status: ok` no bloco finalizado **11684822**. A leitura do banco confirmou 150 IBT e 150 direitos potenciais na carteira administrativa, sem pessoas ou hospedagens cadastradas. Esses direitos ainda não são hospedagens liberadas a clientes. O resultado está em `backendVerification` no registro completo da v2.

## Versão 1 histórica

- IBIToken: `0x111B510517087a76eF7D1914849898A0718A2734`, bloco **11679925**, 150 IBT.
- tBRL: `0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE`, bloco **11679913**.
- [Registro v1](../deployments/sepolia-remix-2026-09-11.json).
- Fonte exata preservada em `deployments/source/Sepolia-2026-09-11.sol`.

A versão 1 não é proxy: editar arquivos não a atualiza. A versão 2 é outra emissão de teste, com outro endereço; não soma uma emissão extra ao mesmo IBIToken nem migra automaticamente posições, royalties ou hospedagens. O contrato válido da entrega é o endereço v2 acima. Não repetir o deploy ao retomar a tarefa.

## Reproduzir uma nova implantação

Siga [o guia do Remix](guia-de-execucao.md). Outra implantação é uma nova instância de demonstração e exige um registro próprio e banco independente. O backend reconhece eventos de recuperação v1 e v2, mas bloqueia a sincronização se encontrar consumo legado de hospedagens.
