# IBIToken — revisão final orientada pelo feedback

Pedido: corrigir a última implementação, demonstrar a evolução deliberada da Parte 1 à Parte 2 e entregar código, testes e instruções em português. A versão técnica passará a 3 para não confundir a Parte 2 acadêmica com o deploy denominado v2 em 11/09.

## Decisões e alternativas

1. Identificador opaco `bytes32` por pessoa, vínculo permanente por carteira e saldo agregado atualizado no núcleo ERC-20. Teto de 20 aplicado em compra, transfer/transferFrom e recuperação. Identidade civil continua externa: registro falso pelo emissor permanece risco explícito. Não publicar CPF nem hash simples de CPF.
2. Tesouraria imutável, inicialmente igual ao administrador do deploy. `owner()` controla governança; não controla isenção, estoque ou reserva. Alternativa de mover estoque em cada troca rejeitada porque mistura custódia e governança. Perda da chave da tesouraria continua risco e recomenda custódia institucional/multisig para operação real.
3. Recuperação com anúncio, hash de processo, espera de 48 horas e cancelamento pelo administrador ou origem. Destino vazio, da mesma pessoa ou ainda sem vínculo; nunca tesouraria, administrador atual/pendente ou contrato. Origem e destino ficam bloqueados durante a espera. Royalties pendentes são recuperáveis mesmo com saldo zero e depois da expiração. Direitos pagos permanecem no histórico original. Sucessão para outra pessoa não é disfarçada de recuperação de chave.
4. Oito semestres civis em UTC, gerados de validFrom (1º de janeiro) ao fim de quatro anos; anos bissextos respeitados. Só se reporta a partir do primeiro segundo do semestre seguinte. Reportes atrasados são possíveis, inclusive após expiração; permanece fotografia no reporte, com consequência explicada.
5. Com stablecoin: preço unitário configurado uma vez, compra pelo próprio comprador, pagamento e entrega atômicos. Sem stablecoin: entrega administrativa com referência e limitação de liquidação externa explícita. Transferência direta da tesouraria não pode contornar a compra. Preço é parâmetro da demonstração, não revisão do valuation.
6. Serviço preserva cotas unused-first-v1, reconhece tesouraria e concilia vínculo on-chain com cadastro. Sem backend assinando transações; preparação de registro e scripts Remix fazem a ponte.

## Escopo e limites

150 IBT, reserva inicial 50, teto pessoal 20, royalty 15%, sem resgate on-chain, Remix/Solidity 0.8.34/OpenZeppelin 5.6.1 e sem Hardhat. Validade econômica 2027–2030; demonstrações podem usar outra janela civil explicitamente identificada. Preservar fontes/recibos históricos e alterações prévias do usuário. Não publicar na rede nem no GitLab nesta correção local. Whitepaper e entrega terão status explícito; não alegar upgrade de contratos publicados.

## Evidência esperada

Reproduzir falhas originais; testes Solidity e Anvil para agregado pessoal, administração, calendário exato, recuperação/cancelamento/zero saldo e compra atômica; integração com SQLite, scripts Remix e typecheck. Empacotar Parte 2 separada da Parte 1. Matriz feedback → decisão → código → teste → critério de avaliação.
