# Vídeo IBIToken — entrega v2

- `IBIToken-v2-demonstracao-sem-voz.mp4`: montagem em MP4, sem locução, música ou captação de microfone.
- `narracao-sincronizada.md`: falas prontas para leitura, com os tempos efetivos do MP4.
- `narracao-sincronizada.srt`: as mesmas falas em formato de legenda para edição.
- `evidencias-sepolia.json`: resposta pública completa do Sourcify, incluindo fontes, configuração, implantação e `exact_match`.
- `evidencias-gravacao-local.json`: operações realmente executadas pelos cliques no console acadêmico, em Anvil.
- `evidencias-local.json`: ensaio automatizado anterior com asserções do cálculo, saques e proteções.

## Escopo que deve permanecer explícito

Na **Sepolia**, este vídeo apresenta a publicação via Remix/MetaMask, a configuração do preço de teste, o recibo no Etherscan e a verificação exata no Sourcify. Contrato: `0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520`; bloco `11783256`; transação `0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f`.

O **ciclo operacional**, incluindo cadastro, compras, apuração, saques e recuperação, é executado em **Anvil local**. As três contas do console são contas públicas de teste do Anvil; não representam três contas selecionadas na MetaMask. A data de abertura do ensaio é fictícia. Os cortes e congelamentos de imagem permitem narrar e ler resultados; a montagem não é uma tomada contínua. Não apresentar esse trecho como operações públicas da Sepolia.

A correspondência exata confirma fontes/compilação contra o bytecode e não constitui auditoria de segurança. A conferência no Etherscan é do recibo; a confirmação explícita de correspondência usada neste material é a do Sourcify.

[Recibo no Etherscan](https://sepolia.etherscan.io/tx/0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f) · [Código no Sourcify](https://repo.sourcify.dev/11155111/0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520) · [Documentação da verificação](https://docs.sourcify.dev/docs/api/).

## Reprodução local

Na raiz do repositório, com as dependências do contrato instaladas:

```sh
node smart-contract/tools/video-evidence.ts output/video/ibitoken-v2
node smart-contract/tools/video-console.ts
```

O segundo comando disponibiliza o console acadêmico em `http://localhost:8767/` e cria uma instância Anvil isolada. A primeira emissão pode levar tempo enquanto compila a fonte. Encerrar com Ctrl+C. Este console não integra o produto nem conecta contas reais; assina exclusivamente na rede local 31337. Os resultados de uma reprodução substituem os arquivos locais correspondentes: preserve uma cópia antes de repetir.

O vídeo é material de apoio; não substitui o relatório final, entregue em português conforme decisão de Gabriel registrada em 26/09/2026.
