# Landing IBIToken + MetaMask

Versão separada da landing fornecida pelo Grupo G01, preparada para abrir no VS Code e consultar uma carteira MetaMask na rede de testes Sepolia.

## O que a conexão faz

- solicita acesso à conta escolhida na MetaMask somente após o clique;
- troca a carteira para a Sepolia (`11155111`), adicionando a rede se necessário;
- confere se o contrato publicado existe;
- consulta `balanceOf` no IBIToken e mostra o saldo de IBT;
- reage à troca de conta e de rede.

A landing **não** solicita assinatura, não envia transação e não executa compra. O cadastro, a aprovação e a compra completa continuam pertencendo ao portal/off-chain do projeto.

Contrato consultado: `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`. Ele corresponde ao piloto publicado na Sepolia em `smart-contract/deployments/sepolia-remix-v2-2026-09-11.json`.

## Executar no VS Code

Requer Node.js 20 ou superior.

```bash
cd landing-metamask
npm run dev
```

Abra `http://127.0.0.1:4173`. Evite abrir o HTML diretamente com `file://`: extensões de carteira podem restringir páginas locais.

## Testar

```bash
cd landing-metamask
npm test
```

Os testes usam somente módulos nativos do Node e simulam o provedor EIP-1193 da carteira; não precisam de chave privada, saldo ou dependências externas.

## Arquivos

- `index.html`: landing completa e interface da carteira;
- `metamask.js`: conexão, troca de rede e consulta do saldo;
- `server.mjs`: servidor local mínimo para desenvolvimento;
- `tests/metamask.test.mjs`: regressão do fluxo de leitura.
