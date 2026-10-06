# Portal e serviço de cotas

Cadastro, análise da waitlist, compra e uso de cotas compartilham a mesma identidade. A landing está em `public/landing/`; o portal autenticado, em `public/portal.html`. Para a demonstração com contas prontas, seguir o [guia de execução](../docs/EXECUCAO.md).

## Configuração manual

Node.js 24+; instalar dependências nas duas pastas conforme o guia. Dentro de `offchain/`:

1. Copiar `.env.portal.example` para `.env` somente se não existir configuração.
2. Gerar `IDENTITY_SECRET` com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` e guardá-lo: protege deduplicação e cifra o CPF privado.
3. Ajustar `SERVICE_HOLIDAYS`. Sem feriados, o prazo exclui somente sábados e domingos.
4. Executar `npm run operator:create` para criar contas individuais dos responsáveis. Papéis: `cadastro`, `financeiro`, `atendimento` e `supervisao`.
5. Executar `npm start`. Landing em `http://localhost:3000/`; conta em `/conta`. O servidor escuta apenas na interface local.

Cadastro e análise podem funcionar sem RPC. Para compras, configurar juntos `RPC_URL`, `TOKEN_ADDRESS` e `START_BLOCK`. Preservar `DATABASE_SCOPE`: o primeiro vínculo identifica rede/contrato no banco e impede misturar emissões. Não reutilizar bancos antigos com outro contrato.

A criação de operadores não concede poderes de assinatura do contrato. CPF é acessível somente a cadastro/supervisão. Financeiro acompanha compras; atendimento acompanha hospedagens. Login usa e-mail/senha e sessão; não exige carteira para reservar.

## Fluxo financeiro

Aprovação → prova e registro da carteira → preparação do pedido → autorização do participante → assinatura de pagamento/compra → confirmação e conciliação → cotas na mesma conta. O indexador verifica a operação; informar um hash não cria saldo. Preço consultado no contrato, cálculo inteiro e referência única protegem os termos do pedido.

Na custódia IBITI, cada pessoa tem carteira dedicada; no servidor normal, a assinatura é externa. O adaptador da demonstração usa exclusivamente Anvil e moeda fictícia. Em autocustódia, a chave pertence ao participante, com ou sem assistência.

Pedidos enviados são atualizados com a página aberta. Falha de comunicação exige conciliação; não refazer pagamento por timeout. Troca de modalidade é permitida antes de envio/conclusão e invalida preparações incompatíveis.

## Cotas e cancelamento

Uma cota solicita experiência de três noites. A solicitação compromete a cota; atendimento/supervisão confirma e conclui. Cancelamento é manual provisório: solicitação mantém a cota comprometida até a decisão, registrada com motivo. Devolução integral ocorre uma única vez após conciliação; retenção não recria cotas. Não há crédito fracionário automático.

## Verificação e limites

Executar `npm test` e `npm run typecheck` nesta pasta; a suíte em `smart-contract/tests/portal.test.ts` valida também a integração EVM. Não há KYC comercial, PIX, custodiante contratado, MFA, envio de e-mail ou inventário real de hospedagens. Ver [modelo e limites](../docs/MODELO-E-LIMITES.md).
