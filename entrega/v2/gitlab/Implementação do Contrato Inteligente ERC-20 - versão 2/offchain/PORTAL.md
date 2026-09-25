# Passaporte, waitlist e jornada integrada

Implementação local de 25/09/2026. Cadastro e administração funcionam sem RPC. Não é operação comercial de custódia/KYC contratada.

## Demonstração pronta para teste

`npm run demo:portal` cria a rede local e acessos de teste por perfil; ver [guia e credenciais](../smart-contract/docs/guia-v4.md). Para operação manual com configuração própria, seguir abaixo.

## Executar

Requer Node 24+ e dependências de `offchain/` instaladas (`npm ci`). Dentro de `offchain/`:

1. Copiar `.env.portal.example` para `.env` **somente se ainda não houver configuração**; preservar configurações e bancos existentes.
2. Gerar e preencher `IDENTITY_SECRET` com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Preservar esse segredo: ele protege a deduplicação e cifra o CPF privado.
3. Ajustar `SERVICE_HOLIDAYS` para o calendário de atendimento. Sem feriados configurados, o cálculo exclui apenas sábados e domingos. O prazo exato aparece no portal.
4. Executar `npm run operator:create` para cada funcionário. A senha fica oculta no terminal; criar contas individuais, com pelo menos 15 caracteres. Papéis: `cadastro`, `financeiro`, `atendimento`, `supervisao`.
5. Executar `npm start` e abrir a landing em `http://localhost:3000/` (login/cadastro em `/conta`).

A aplicação escuta somente na interface local. O bootstrap de operadores exige acesso ao ambiente local, não tem endpoint público e não concede poder de assinatura de contrato. O segredo administrativo compartilhado das versões anteriores não autentica no servidor novo. A API legada permanece disponível apenas para testes/demonstração histórica que explicitamente a utilizam.

## O que funciona

- Inscrição persistente com nome, e-mail, telefone, CPF validado, quantidade pretendida e três opções de custódia. CPF cifrado; vínculo civil deduplicado por HMAC. Uma conta pública não pode reivindicar CPF de cadastro anterior.
- Login por e-mail/senha em todos os momentos, inclusive depois da compra. Hash de senha com scrypt e sal individual; sessões aleatórias com hash no banco, cookie HttpOnly/SameSite, expiração e logout. A conta não equivale à chave da carteira.
- Fila, busca, ficha e checklist acadêmico provisório; análise, pedido de complemento, aprovação e reprovação, com responsável, motivo interno, resposta pública e versão. Atualização concorrente é recusada. CPF só é apresentado a cadastro/supervisão.
- Prazo de cinco dias úteis desde cadastro completo. Complemento suspende o relógio pelo tempo de espera, sem reiniciar os cinco dias. Atraso aparece na fila e na conta; não aprova automaticamente. Resultado é comunicado pelo próprio portal; nenhum e-mail é declarado como enviado.
- Mesmo UUID da pessoa em conta, candidatura, vínculo, cotas e hospedagens. Não pedir UUID, carteira ou novo cadastro para reservar.
- Vínculo por assinatura com prova durável, separado da sessão do portal. Cadastro/supervisão prepara registro no contrato; a carteira autorizada no contrato assina a transação.
- Cotação, autorização e compra primária em stablecoin, com leitura do preço no contrato, confirmação e conciliação. Operação usa bigint e verifica rede, remetente, destino, calldata, recibo, eventos e bloco. O indexador existente é a única origem do saldo/cotas.
- Pedido de hospedagem de três noites, compromisso imediato da cota e confirmação/conclusão pelo atendimento/supervisão.
- **Cancelamento manual provisório**, última decisão do usuário: pedido preserva a cota comprometida; atendimento/supervisão decide com motivo. Devolução integral aguarda conciliação e ocorre uma vez; retenção não recria cotas. Casos de crédito parcial ficam em análise. Não existem meias cotas.

## Custódia e assinatura

| Modalidade | Controle da carteira | Fluxo funcional | Limite |
| --- | --- | --- | --- |
| IBITI | Operador institucional, em carteira dedicada à pessoa. | Financeiro prova controle e prepara pedido; participante autoriza o pedido na conta; financeiro assina pagamento na carteira; participante usa cotas pelo login. | Guarda/backup de chaves ocorrem fora deste backend. Não existe custodiante contratado, geração automática segura de carteiras ou conversor PIX. Não usar carteira coletiva. |
| Autocustódia assistida | Participante. | Mesmo fluxo de vínculo e compra, com explicações e atendimento. | Orientação não dá à equipe acesso à chave. |
| Autocustódia direta | Participante. | Pessoa opera sua carteira conectada e autoriza a compra. | Pessoa confere rede, taxas e backups. |

A preferência pode mudar enquanto não houver compra enviada/concluída. Mudar invalida preparações e exige prova correspondente ao novo modo. **Depois que uma transação foi enviada à blockchain, o portal não pode prometer desfazê-la.** Nesse intervalo é necessário conciliar o resultado. Isso é a fronteira técnica entre mudar a escolha no formulário e mover uma posição já autorizada.

No servidor normal, a custódia IBITI é operação auditada de carteira externa dedicada. A demonstração local possui adaptador exclusivo Anvil para preparar carteira e executar compra autorizada sem extensão; ele não é importado pelo servidor normal. O ambiente acadêmico usa saldo de teste. Para dinheiro real, contratação, guarda institucional, financiamento da carteira, conciliação de pagamento externo e recuperação de acesso devem ser definidos pelo operador. O portal não apresenta um PIX como compra atômica confirmada.

## Conectar contrato

Preencher juntos `RPC_URL`, `TOKEN_ADDRESS` e `START_BLOCK`. Manter `DATABASE_SCOPE` do portal para não perder a waitlist; o primeiro vínculo grava rede/contrato/bloco no banco e impede reutilização com outra emissão. Não misturar este banco com os bancos históricos da Sepolia.

O checkout exige a versão local com `primarySaleUsed`: cada par comprador/referência de pedido só liquida uma vez. Falha no pagamento reverte também essa marca. Contratos históricos que não expõem essa proteção são recusados pelo checkout; editar Solidity não modifica contratos já publicados.

A aprovação cadastral não concede IBT; o registro on-chain não comprova compra; hash enviado pelo navegador não concede cota. Falha de RPC preserva o cadastro e deixa etapas financeiras pendentes. Hash recebido é salvo antes da reconciliação. Nunca repetir uma compra criando outro pedido por causa de um timeout.

## Política de cancelamento consultada

Fonte: [tarifário IBITI](https://ibiti.com/pt-br/tarifario/), consultado em 25/09/2026, e [tarifário do subdomínio testing](https://testing.ibiti.com/tarifario/). A regra de períodos regulares apresentada é: antecedência de 31 dias ou mais sem multa; de 30 a 8 dias, metade retida e metade em crédito; até 7 dias, retenção integral. Há condições específicas para grupos/feriados/eventos, que precisam ser conferidas no contrato da reserva. Não aplicar automaticamente uma regra única para todo pacote.

Essas faixas tratam de dinheiro de hospedagem. Não determinam automaticamente como fracionar uma cota ou devolver valor da compra do IBT. Por decisão posterior do usuário, o sistema mantém revisão manual e **não** implementa crédito fracionário. A versão acadêmica aceita é `manual-review-v1`; não alterar política retroativamente sobre reservas existentes.

## Limites explícitos e continuidade

- O checklist é provisório acadêmico. HMAC/CPF válido não comprovam identidade nem autenticidade de documento. Não há fornecedor KYC, upload de dossiê ou biometria integrado.
- E-mail de aviso, MFA, recuperação automatizada de senha e gestão institucional das chaves são integrações ainda ausentes. Perda de senha não permite mudar carteira; a recuperação precisa de verificação externa. Dados e banco local não constituem sistema pronto para operação comercial.
- A revisão interna v4, destinada à versão oficial v2, usa abertura relativa, tempo de posse e bloqueio de transferências ordinárias, conforme ADRs 0001/0003/0004. Proprietário único, pausa global e ausência de segunda aprovação permanecem limitações. O memorando v2 recebido tem [feedback de conciliação](../docs/decisoes/2026-09-25-feedback-memorando-v2.md), sem edição do PDF.

## Verificação

`npm test` e `npm run typecheck` em `offchain/`. O teste `smart-contract/tests/portal.test.ts` roda a jornada com Anvil, contrato e pagamento de teste reais, sem rede externa; execute com `node --test smart-contract/tests/portal.test.ts` a partir da raiz. Ele cobre retomada idempotente, recusa de transação alheia, deduplicação da compra e reconhecimento da cota no mesmo cadastro.

Validação inicial: 24 testes do serviço, suíte contratual existente sem regressões, integração EVM com autocustódia e custódia institucional (incluindo consentimento na conta), rejeição de assinatura recuperável e tratamento de falha RPC após envio. Revisão independente dos controles de compra e cancelamento encerrada após correções. Cadastro, recarga, mudança de custódia, administração e layout de 390px foram conferidos no navegador.

Quando a carteira informa rejeição explícita (`4001`), o pedido volta à preparação e permite mudar a preferência. Timeout ou falha de comunicação mantém o estado pendente; o hash deve ser conciliado. A referência da compra é protegida no contrato contra liquidação repetida. A guarda institucional das chaves e o financiamento da carteira continuam externos ao portal.

## Refinamento de 25/09 — landing, simulação e administração

A landing inicia a jornada em `/`; cadastro/login ficam em `/conta`. Quantidade é uma intenção editável, também após aprovação; mudar não reserva tokens, não cobra e não reinicia a análise. Pedidos preparados devem ser desfeitos antes de alterar seus termos; pedidos enviados são conciliados. A simulação consulta `GET /simulation` e usa R$ 34.874,14 do memorando v2, sem depender da rede. O pedido reconfere o preço efetivo no contrato.

A administração exibe apenas as áreas permitidas: Candidaturas, Compras e Hospedagens. Financeiro acessa somente Compras; a assistência institucional integra essa fila, sem aba duplicada. Candidaturas ordenadas por prazo ativo, badges de dias úteis, fichas em diálogo. “Autorizar carteira para compra” substitui “Habilitar” e explica a etapa de assinatura. O participante pode desfazer um pedido institucional ainda preparado, inclusive após dar consentimento; não pode cancelar uma assinatura iniciada ou transação enviada.

Pedidos enviados e posições são atualizados a cada 15 segundos com a página aberta e visível. Não há botão “Conferir confirmação”. Transação incerta nunca volta automaticamente ao botão de pagar. Acompanhar após fechar a página exige reabrir o portal; não há trabalhador permanente de reconciliação.

Validação do refinamento: 27 testes off-chain, integração real com Anvil e verificação de tipos nos dois projetos. Navegador: landing → simulação → cadastro → aprovação em diálogo → ajuste de quantidade; navegação por abas; uso de cota e cancelamento manual; layout de 390px. Teste adicional com carteira de ensaio e transação EVM mantida pendente confirmou a atualização automática da compra e das cotas sem clique de confirmação.

Detalhes em [registro do refinamento](../docs/decisoes/2026-09-25-refinamento-do-portal.md). As pendências ficam em [lista para retomada](../docs/decisoes/2026-09-25-pendencias-para-retomada.md).

## Compra por etapa e responsável

Ver [fluxo, permissões, preço, custódia local e validação](../docs/decisoes/2026-09-25-portal-por-etapa-e-responsavel.md). Quem tem saldo entra em Experiências, sem simulador; Compras e Minha conta ficam separadas. A intenção da waitlist não cria pedido financeiro. Somente solicitação do participante aprovado inicia a fila de compra.
