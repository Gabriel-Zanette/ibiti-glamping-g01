# Áreas de entrega — IBITI

A preparação atual está em **[v2/](v2/README.md)**, separada das cópias anteriores. Contém o espelho dos três artefatos do GitLab, fonte executável, apoio para os responsáveis, pacote Remix e ZIPs com manifestos.

A v2 oficial ainda está em preparação; “v4” é somente revisão técnica interna. O GitHub guarda o trabalho e o espelho local; isso não representa envio da entrega ao GitLab nem novo deploy público.

Regenerar a área atual na raiz do repositório:

```bash
npm run package:delivery --prefix smart-contract
```

`npm run package:remix --prefix smart-contract` também regenera o conjunto para manter as fontes sincronizadas. Os arquivos `IBITI-Remix.zip`, `IBITI-Implementacao-v2.zip` e `gitlab/` fora de `v2/` são históricos de preparações anteriores; não usá-los como fonte atual. A primeira entrega permanece preservada.
