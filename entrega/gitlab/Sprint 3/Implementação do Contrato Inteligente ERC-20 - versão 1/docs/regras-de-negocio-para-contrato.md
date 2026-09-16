# Arquitetura e regras executáveis · versão 2

## Contratos

| Arquivo | Responsabilidade |
|---|---|
| `contracts/IBIToken.sol` | ERC-20 indivisível, emissão única, reserva, teto, transferência, membership, recuperação, pausa e royalties |
| `contracts/mocks/MockStablecoin.sol` | ERC-20 fictício para testar pagamentos; nunca usar como moeda real |
| `contracts/vendor/openzeppelin/` | Componentes originais de ERC-20, permissões, pausa e proteção contra reentrada |

Não há motivo funcional para publicar os componentes herdados separadamente. Os contratos em `tests/` são exclusivamente testes.

## Regras do token

- 150 IBT, zero decimais, 50 reservados inicialmente e teto de 20 por carteira. Redução de reserva é decisão administrativa explícita.
- O administrador entrega tokens após verificação off-chain. Transferências de portadores exigem destinatário já com saldo, respeitam teto e expiração. Ter saldo não prova identidade civil.
- Administração em duas etapas; renúncia desabilitada; pausa de transferências, reporte e saque.
- Reemissão por recuperação invalida a carteira antiga, move saldo e royalties pendentes e preserva o supply. Queima/cunhagem da recuperação não representa uso de hospedagem.
- Reporte de faturamento bruto calcula 15%, fotografa os saldos e registra direitos pro-rata, com no máximo oito períodos. Datas semestrais dependem da operação externa.
- Com stablecoin, o reporte deposita a soma devida e cada carteira saca seu valor. Sem stablecoin, o contrato registra a liquidação externa. A moeda pode ser definida uma única vez; períodos antigos preservam sua modalidade.

## Cotas e hospedagens

`offchain/` vincula carteiras a uma pessoa, sincroniza eventos e saldos da rede, mantém as cotas em SQLite e registra pedidos. Identidade civil e operação real do hotel são responsabilidades ainda pendentes da IBITI.

A política `unused-first-v1`, confirmada pelo responsável do projeto em 11/09/2026, concede inicialmente uma experiência por IBT para toda a emissão, sem renovação periódica. Transferências carregam apenas direitos ainda livres, sem recriar direitos consumidos. Pedidos em aberto reservam direitos e cancelamentos aguardam sincronização antes de devolver cotas. O projeto definiu 3 noites para até 5 pessoas e serviços comuns de hospedagem. Cancelamento elegível devolve a mesma cota. Antecedência e tratamento tardio/no-show seguem em fechamento; duração, hóspedes e prazo ainda não são impostos pelo backend.

Não existe `markRedeemed`, contador de unidades usadas ou ID individual de token na v2. `accessInfo` retorna somente saldo, condição de membro e expiração. O evento `Reissued` contém origem, destino e quantidade. O backend também lê o evento antigo da v1 e bloqueia qualquer resgate legado que exija migração.

## Fluxo de execução

1. Cadastro aprovado e carteira comprovada por assinatura no sistema externo.
2. Compra primária registrada pelo administrador no contrato.
3. Serviço sincroniza posse e transferências confirmadas; combina saldo com o histórico pessoal.
4. Pedido de hospedagem reserva a cota no banco, sem transação on-chain.
5. Reporte e saque dos royalties ocorrem independentemente do uso de hospedagens.

Nenhum sistema de cotas consegue operar somente com o saldo atual: circular IBT entre pessoas não pode renovar direitos usados. O histórico externo faz parte da entrega funcional.
