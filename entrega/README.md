# Entrega do workspace Remix

Extraia `IBITI-Remix.zip` e importe a pasta pelo menu **New workspace → Import Project** no Remix. A pasta `IBITI-Remix/` já está extraída para uso local. Ela é gerada: edite os fontes canônicos em `../smart-contract/`.

Para regenerar, execute na raiz `npm run package:remix --prefix smart-contract`. A lista explícita de arquivos exclui bancos, segredos, ferramentas Node e fontes históricas. O sistema de cotas completo também requer `../offchain/`.

A v2 ainda não foi publicada na Sepolia. O endereço anterior corresponde à v1. Instruções e evidências estão em `../smart-contract/docs/`.
