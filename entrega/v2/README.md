# Entrega oficial v2 — área de preparação

Esta pasta permite visualizar o que será entregue e como será organizado no GitLab. Mantém os nomes dos artefatos utilizados nas entregas anteriores. O nome/número da sprint de destino ainda não foi informado; por isso não foi inventada uma pasta “Sprint 4”. O conteúdo de `gitlab/` poderá ser colocado na sprint correspondente.

**Estado: em preparação.** Somente a v1 foi oficialmente publicada. A revisão técnica interna v4 está sendo consolidada para a próxima v2; o commit no GitHub não significa entrega no GitLab ou novo deploy público.

```text
entrega/v2/
  gitlab/
    README.md
    Implementação do Contrato Inteligente ERC-20 - versão 2/
      README.md
      FONTE.json
      MANIFEST.sha256
      smart-contract/
      offchain/
      guia-de-comunicacao/landing/
      docs/
    Deploy e Evidências Operacionais On-Chain/
      README.md
      evidencias/
        recibos/
        estados/
        capturas/
        calculos/
      [PDF em inglês: ainda a produzir]
    Memorando de oferta - versão 2/
      README.md
      [PDF em português: aguardando revisão do responsável]
  apoio/
    [guia PDF, roteiro em inglês, modelo CSV e feedback do memorando]
  remix/
    [fontes e instruções para importar no Remix]
  pacotes/
    IBITI-Implementacao-v2.zip
    IBITI-Remix-v2.zip
    IBITI-Entrega-v2.zip
  MANIFEST.sha256
```

Os colchetes indicam conteúdo pendente, não nomes de arquivos entregues. Os PDFs finais de evidências e memorando não foram fabricados nem substituídos por versões antigas. `apoio/` é material de trabalho da equipe; não deve ser apresentado como relatório final avaliado.

## O que já está materializado

A pasta de implementação contém uma cópia executável da fonte, incluindo a landing exigida pelo servidor e modelos de configuração sem segredos. O ZIP de implementação contém essa mesma estrutura. A pasta Remix e seu ZIP contêm fontes, bibliotecas e testes Solidity. O ZIP geral inclui a estrutura dos três artefatos e o material de apoio, com as pendências identificadas.

## O que ainda falta fechar

Governança conjunta, pausas seletivas e recuperação/contestação integrada seguem registradas nas pendências da implementação. Gabriel também pediu, para a próxima retomada, remodelar os pilares administrativos e aprimorar a custódia; esses desenhos não devem ser considerados fechados. Também falta consolidar o texto final do memorando, conciliar o whitepaper, congelar a revisão técnica e produzir as evidências públicas e o respectivo PDF em inglês. Nenhuma pasta vazia ou README comprova conclusão desses trabalhos.

## Atualização

Na raiz do repositório de trabalho:

```bash
npm run package:delivery --prefix smart-contract
```

O comando atualiza as cópias geradas, o material de apoio, os ZIPs e os manifestos. Alterar primeiro as fontes canônicas da raiz; não editar os módulos copiados na implementação. Os READMEs de organização e os arquivos futuros do memorando/evidências são preservados. Manter dados pessoais, chaves, `.env` privados, sessões e bancos fora desta área.

As pastas e ZIPs anteriores em `entrega/`, fora de `v2/`, ficam como histórico. Esta preparação não foi enviada ao GitLab automaticamente.

## Conferência da preparação

A rodada de testes e a execução a partir do ZIP estão registradas em [validação do pacote](<gitlab/Implementação do Contrato Inteligente ERC-20 - versão 2/docs/entrega/validacao-pacote-v2.md>). Os manifestos identificam os arquivos gerados, sem transformar esta preparação em publicação pública ou entrega concluída.
