# Implementação de cotas de hospedagem por pessoa

> Histórico da implementação de 10/09, anterior à migração para Remix. Em 11/09 o fluxo foi reorganizado sem Hardhat e a v2 local removeu os resgates. Resultados atuais: [relatório de validação](../documentacao/11-validacao.md).

Pedido do usuário em 10/09/2026; base: documentação produzida pelo Claude na mesma data. Execução neste repositório, sem alterar o diretório de origem.

## Arquitetura

Manter o contrato IBIToken v1 compatível: ele cuida de posse, membership e royalty. O novo serviço TypeScript usa ethers para consultar a rede e SQLite para identidade pseudonimizada, vínculo de carteiras, cotas e reservas. Nenhum CPF ou hospedagem é escrito na blockchain. O serviço não guarda chaves privadas de clientes.

O software representa a operação acadêmica e permite simular a aprovação de identidade; os critérios e a execução real do KYC continuam com a IBITI. O acesso administrativo é autenticado. Carteiras próprias comprovam controle por assinatura de desafio de uso único.

## Execução e verificação

- [x] Localizar skill e documentação; separar IBX histórico de IBIToken.
- [x] Instalar `ibiti-context` no Codex com regras vigentes e referências.
- [x] Implementar cadastro por pessoa e autenticação; testar CPF duplicado, assinatura inválida/repetida, autorização e persistência.
- [x] Implementar leitura consistente do contrato e contabilização de cotas; testar soma de carteiras, validade, pausa, transferência e recuperação sem recriar direitos.
- [x] Implementar solicitação, confirmação, uso, cancelamento e remarcação, com idempotência e transações; testar concorrência e ausência de saldo.
- [x] Demonstrar compra → consulta → hospedagem → cancelamento → transferência → royalty em EVM local com o contrato real.
- [x] Configurar e verificar a conexão Sepolia; registrar separadamente o que depende de endereço e assinatura de deploy.
- [x] Harmonizar documentação e pontos do guia que ainda apresentam voucher como fluxo vigente.

## Decisões e limites

Uma hospedagem por unidade é hipótese configurada do piloto, não tabela de benefícios validada. Não basta subtrair usos do saldo atual: transferências poderiam multiplicar hospedagens. A política de transferência precisa preservar a quantidade total de direitos, sem IDs por token.

O endereço encontrado no início era o IBX histórico `0x38d5881D3b120793c983B23064Acf31AA60db2Ba`, incompatível. Em 11/09 o IBIToken correto foi publicado pelo Remix e confirmado na MetaMask do titular: `0x111B510517087a76eF7D1914849898A0718A2734`, bloco 11679925. Não há chave privada da carteira no serviço off-chain. A moeda auxiliar tBRL é separada dos 150 IBT.

## Evidências e pendências finais

71 testes passaram (16 no serviço e 55 no projeto do contrato, incluindo 5 de integração). TypeScript de ambos os projetos passou. Interface validada com solicitação e cancelamento no navegador. IBIToken e tBRL publicados na Sepolia em 11/09; recibos, código e estado conferidos, verificação Sourcify confirmada. Serviço configurado com contrato e bloco inicial reais na porta 3001. Política secundária implementada como hipótese provisória, sem interpretar resposta acidental como autorização. Exportações SVG/PNG antigas e artefatos oficiais externos continuam identificados como históricos.

Revisão independente identificou uma condição de corrida entre cancelamento e sincronização de transferência. Corrigida com devolução pendente, aplicada após a movimentação on-chain; regressão cobre as duas ordens. O extrato também preserva a moeda de períodos antigos liquidados em reais após configuração de stablecoin.
