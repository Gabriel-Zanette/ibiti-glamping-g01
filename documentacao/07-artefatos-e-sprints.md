# 07 · Artefatos e sprints

> **Implementação em 10/09/2026:** consulte [10 · Implementação off-chain](10-implementacao-offchain.md). O software de cadastro e cotas já está neste repositório; aprovação, hotel e operação real da IBITI seguem pendentes. A política de cotas foi confirmada pelo responsável do projeto em 11/09/2026: uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências. O contrato v1 mantém contadores legados, sem uso no fluxo atual.

O módulo roda em sprints de duas semanas no Adalove. Entregas oficiais vão para o GitLab do Inteli
(`git.inteli.edu.br/graduacao/2026-2a/t19/g01`). Entregas em **português**.

## Sprint 1 · Entendimento

| Artefato | Conteúdo | Onde |
|---|---|---|
| Entendimento da Experiência do Usuário | canvas de personas focado em Web3 (Helena, Beatriz, Gabriel), implicação de jornadas paralelas | GitLab `Sprint 1/` |
| Diagnóstico e gestão | PDFs | GitLab `Sprint 1/` |

## Sprint 2 · Modelo

| Artefato | Conteúdo | Onde |
|---|---|---|
| Whitepaper Técnico do Ativo Digital | 14 seções: contexto, tokenomics, Passaporte, royalties, atores, governança, smart contracts (tabela regra de negócio → regra computacional), arquitetura, riscos, ODS, roadmap | GitLab `Sprint 2/` (.md) |
| Riscos Éticos e Impacto | .md e .pdf | GitLab `Sprint 2/` |
| Gestão e matriz de riscos | .md e .pdf | GitLab `Sprint 2/` |

Papéis na Sprint 2: Leon (Scrum Master), Adriana, Thomas, Gabriel Zanette (arquitetura e operação), Erik,
Lavinia. O whitepaper unificado passou por revisão em 28/08/2026 (nome IBIToken, ERC-20 definitivo,
piloto sem novas levas, apuração semestral, números do valuation).

## Sprint 3 · Implementação e comunicação

| Artefato | Conteúdo | Onde | Situação |
|---|---|---|---|
| Implementação do Contrato Inteligente ERC-20, versão 1 | Workspace Remix v2, testes Solidity, scripts, integração off-chain e evidências da v1 na Sepolia | [`smart-contract/`](../smart-contract/README.md) | construído localmente; envio acadêmico no GitLab a conferir |
| Guia de Comunicação | documento estratégico (README), landing de página única com cinco seções e três páginas de detalhe, board visual, telas A1–A11 / E1–E2 / P1 / T1 em SVG e PNG, tasks para o issue board | [`guia-de-comunicacao/`](../guia-de-comunicacao/README.md) | v1.5; **não entregue no GitLab** |
| Diagrama de fluxo ponta a ponta | BPMN 2.0: 5 pools, 10 raias, 9 fases; gerador em Python; SVG, PNG, .bpmn, Mermaid | `diagrama-de-fluxo/` no diretório de origem `ibiti-token` | construído; não entregue |

Os três foram compartilhados com os colegas num repositório privado no GitHub
(`Gabriel-Zanette/ibiti-glamping-g01`). A entrega oficial no GitLab é feita pelo usuário após revisão.

A **versão 2 do contrato** é uma entrega de sprint seguinte. Escopo previsto: harmonizar o whitepaper,
ratificar as decisões da v1, refletir o uso vinculado à pessoa ([03](03-uso-vinculado-a-pessoa.md)),
segunda assinatura no reporte ou auditor, multiassinatura, stablecoin real, deploy verificado na Sepolia
com registro da entrega, testes de segurança (Slither, fuzz, revisão externa).

## Histórico: atividade individual IBX (agosto/2026)

Antes do IBIToken, o usuário fez uma atividade ponderada individual: o **IBX (IBITI Experience Token)**,
ERC-20 com cap de 1 milhão, 18 decimais, mint em tranches, queima no resgate, implantado na Sepolia
(`0x38d5881D3b120793c983B23064Acf31AA60db2Ba`). Está em `contracts/IBX.sol` e `docs/` na raiz. Serve
como registro histórico; o modelo vigente é o do IBIToken, que difere em quase tudo (150 unidades
indivisíveis, sem queima, sem mint após o deploy, royalty on-chain).

## O que ainda falta entregar ou fechar

- Entrega oficial dos artefatos da Sprint 3 no GitLab.
- Convite dos colegas ao repositório privado do GitHub.
- Harmonização dos artefatos com o formato vigente (lista em [08](08-decisoes-e-pendencias.md)).
- Materiais anexos ao TAPI (Manifesto Comercial, Apresentação do Conceito Glamping) e as tabelas de dados:
  não recebidos.
