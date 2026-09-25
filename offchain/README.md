> **Fonte v4 e demo atual:** usar `npm run demo:portal` e o [guia atual com acessos](../smart-contract/docs/guia-v4.md). Os comandos de demonstração/controle compartilhado abaixo descrevem a interface histórica.

> **Atualização 25/09/2026:** a jornada com waitlist, contas individuais e três modalidades de custódia está documentada em [PORTAL.md](PORTAL.md). As instruções de API administrativa compartilhada abaixo são históricas; o servidor atual as desabilita.

# Passaporte IBITI — hospedagens por pessoa

Serviço executável do modelo de 10/09/2026: um ERC-20 para posse e royalty; hospedagens controladas por pessoa física fora da blockchain. Integra a v3 técnica local e mantém leitura das versões históricas publicadas na Sepolia, sem resgate on-chain; mantém compatibilidade de leitura da v1 histórica sem chamar `markRedeemed`. Não há IDs por unidade do token.

Node.js **24+**, ethers 6 e SQLite nativo do Node. API e interface em português, restritas a `127.0.0.1`. Não guarda chaves privadas. Dados reais de hóspedes e integrações da IBITI não são necessários para demonstrar.

## Executar a demonstração completa

Na raiz do repositório:

```bash
npm ci --prefix smart-contract
npm run build --prefix smart-contract
npm ci --prefix offchain
npm run demo --prefix offchain
```

Abra [Passaporte local](http://localhost:3000). A demonstração cria uma EVM local, implanta IBIToken e stablecoin de teste, registra duas pessoas fictícias, entrega 5 e 1 unidades, demonstra uso de 2 hospedagens, cancelamento e pagamento de royalty. É **rede local, não Sepolia**.

Na **Área de operação acadêmica**, use `ADMIN_API_TOKEN` e `DEMO_PERSON_ID` do arquivo local `offchain/.env.demo`. O primeiro cadastro mostra 5 unidades, 3 hospedagens disponíveis e 2 utilizadas. Os valores de acesso não são versionados; esse cadastro não corresponde a uma pessoa real. O login com carteira exige MetaMask ou carteira EOA equivalente e vínculo por assinatura.

`Ctrl+C` encerra a EVM e o serviço. Cada execução cria um banco novo em `data/demo-<timestamp>/`; os bancos anteriores são preservados, mas pertencem à respectiva EVM efêmera. Não reaproveite um banco local contra uma EVM reiniciada. Para mudar portas, use `DEMO_RPC_PORT` e `PORT`.

## Usar na Sepolia

A versão 2 foi publicada em 11/09/2026: **150 IBT**, contrato `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco de criação **11684811**. O serviço usa um banco novo, separado da v1. A configuração anterior e o banco antigo foram preservados; não houve migração de pessoas ou histórico. A tBRL é outro contrato e serve apenas para simular dinheiro nos testes de royalties.

Nesta máquina, o arquivo local `.env.sepolia` já contém a configuração e segredos gerados da aplicação (sem chave de carteira). Para iniciar:

```bash
npm run start:sepolia --prefix offchain
```

Abra [Passaporte Sepolia](http://localhost:3001). O banco Sepolia é separado do banco da demonstração local em `http://localhost:3000`. Para conferir o contrato diretamente, execute dentro de `offchain/`: `node --env-file=.env.sepolia scripts/check-sepolia.ts`.

Em outra máquina, prepare sua configuração:

1. Use o **IBIToken** do [registro de deploy](../smart-contract/docs/deploy-modelo-pessoa.md), ou implante uma nova instância somente se desejar outro piloto. O IBX antigo é incompatível.
2. Copie `.env.example` para `.env`, configure `TOKEN_ADDRESS`, `START_BLOCK` (bloco da emissão), RPC e dois segredos diferentes de pelo menos 32 caracteres. Gere segredos com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
3. Dentro de `offchain/`, execute:

```bash
npm run check:sepolia
npm start
```

O serviço lê o bloco **finalized** e espera transações pendentes antes de autorizar solicitações, confirmações ou remarcações. Uma transferência pode levar vários minutos para ficar disponível. Saldo zero, pausa, expiração, CPF não aprovado, total acima de 20 por pessoa, inconsistência de rede ou falha RPC impedem novos usos. Cancelamento continua possível sem RPC; a devolução das cotas aguarda sincronização e aparece como “em devolução”.

O backend não assina deploy, compras, transferências ou royalties. Essas transações são feitas pela carteira autorizada através dos scripts de `smart-contract/` ou da carteira do portador. Não envie chave privada pelo chat nem a grave no frontend.

## Política de cotas implementada

**Política confirmada pelo responsável do projeto em 11/09/2026: `unused-first-v1`.** Uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências.

- Uma hospedagem por unidade, por toda a emissão; não há reposição anual.
- A emissão inicializa 150 direitos potenciais; a reserva administrativa não libera hospedagens para clientes.
- O serviço acompanha eventos `Transfer` e `Reissued`, preservando quantidades agregadas de direitos disponíveis. Não identifica tokens individuais.
- Transferências movem primeiro até N direitos ainda não comprometidos, para N tokens transferidos. Token cuja hospedagem já foi usada não gera outra no destinatário.
- Carteiras são vinculadas de forma exclusiva ao mesmo cadastro; cotas, pedidos e histórico são apresentados por pessoa. Não se pode desvincular e reapresentar uma carteira como pessoa nova.
- A solicitação separa a cota imediatamente; confirmar não desconta novamente. Cancelamento registra a devolução pendente uma única vez; a cota só volta a ficar disponível após sincronizar um bloco que cubra o instante do cancelamento. Hospedagem concluída não pode ser cancelada. Remarcação só muda datas.
- Direitos de pedidos pendentes/confirmados ficam com o solicitante. Se ele transferir saldo necessário, confirmação/uso ficam bloqueados. Cancelar agenda a devolução dos direitos à origem, após processar as transferências anteriores; a pessoa precisa voltar a ter saldo para usá-los. Não há bloqueio on-chain do token durante uma reserva.
- Limite utilizável: menor entre direitos livres e saldo agregado menos cotas de pedidos em aberto. Direitos antigos cancelados podem permanecer no cadastro sem saldo utilizável.
- Reemissão move saldo contábil e cotas sem nova concessão; associações de pedidos acompanham a carteira recuperada e sessões da antiga são invalidadas. Vincule a carteira nova à mesma pessoa para recuperação. Sucessão entre pessoas requer conciliação operacional da IBITI.

Exemplo: Ana tem 5 tokens e usa 4 hospedagens. Ao enviar 4 tokens para Bia, que já tinha 1, só 1 hospedagem disponível acompanha o envio. Bia passa a ter 5 tokens e 2 hospedagens disponíveis; circular os tokens não recria as 4 usadas.

A experiência definida pelo projeto é de 3 noites para até 5 pessoas, com os serviços comuns da hospedagem. O backend ainda não aplica limites de noites/hóspedes ou prazo de cancelamento; não confundir a definição comercial com validação implementada. Prazo e cancelamento tardio/no-show seguem em fechamento.

## API

JSON em todos os POSTs. `Authorization: Bearer <ADMIN_API_TOKEN>` nas rotas `/admin/`; nas rotas `/me`, usar o token retornado pela assinatura. O membro não escolhe um `personId` para consultar dados de terceiros.

| Método e rota | Dados / resultado |
|---|---|
| `GET /config` | rede, endereço, versão da política; sem segredos |
| `GET /health` | testa RPC, contrato e sincronização; retorna bloco |
| `POST /admin/people` | `{cpf}` → cadastro pseudonimizado, ainda não aprovado; CPF normalizado é único |
| `POST /admin/people/:id/verification` | `{verified: true/false}` → aprovação **simulada** pela operação autorizada |
| `POST /admin/people/:id/wallet-challenge` | `{wallet}` → desafio de vínculo, válido por 5 minutos |
| `POST /auth/challenge` | `{wallet}` → desafio de login de carteira já vinculada |
| `POST /auth/verify` | `{id, signature}` → sessão de uma hora; só aceita assinatura da carteira e uso único |
| `POST /auth/logout` | encerra a sessão |
| `GET /me` ou `/admin/people/:id` | pessoa, saldo, cotas e pedidos |
| `GET /me/royalties` ou `/admin/people/:id/royalties` | valores devidos/pagos por carteira e totais formatados por período, preservando a moeda de cada período |
| `POST /me/stays` ou `/admin/people/:id/stays` | `{units, arrival: "YYYY-MM-DD", departure, idempotencyKey}` |
| `POST <base>/stays/:stayId/cancelled` | cancela e agenda devolução; repetições não devolvem cotas adicionais |
| `POST <base>/stays/:stayId/reschedule` | `{arrival, departure}` |
| `POST /admin/people/:id/stays/:stayId/confirmed` | confirma na demonstração |
| `POST /admin/people/:id/stays/:stayId/completed` | registra uso na demonstração |

Datas são dias UTC, sem inventário de quartos nem confirmação de disponibilidade. Uma cota representa a experiência, não automaticamente uma diária por noite. Quantidade de noites e catálogo de benefícios continuam com o parceiro.

## Persistência e limites

SQLite usa transações `BEGIN IMMEDIATE`, chave única de idempotência, auditoria de mudanças e eventos on-chain deduplicados. CPF é validado sintaticamente e convertido em HMAC com segredo local; não fica em texto claro. Isso **não comprova identidade real**. Carteiras, datas e histórico ainda são dados privados: mantenha banco, backups e segredos fora do Git e com acesso restrito. Não trocar `IDENTITY_SECRET` sobre banco existente; a configuração é vinculada ao banco para evitar cadastros duplicados.

A solução é um piloto local de um operador, sem inventário hoteleiro, custódia real, disparo de e-mails, gateway fiat, provedor KYC, recuperação de segredos, multi-instância de aplicação ou publicação em produção. Rodar vários processos atendendo pedidos contra o mesmo banco não é o modelo suportado; os testes de duas conexões validam a transação SQLite, não um serviço distribuído.

A consulta fixa o bloco e verifica seu hash. Reorganização de bloco já contabilizado, histórico incompleto ou `RedemptionMarked` legado bloqueiam uso e exigem conciliação; o serviço não apaga nem reconstrói consumos automaticamente. Contratos com resgates anteriores precisam de migração explícita do histórico pessoal antes da ativação, ou de um novo deploy de demonstração sem consumo legado.

## Validação

```bash
npm test --prefix offchain
npm run typecheck --prefix offchain
npm test --prefix smart-contract
npm run typecheck --prefix smart-contract
```

Os testes de integração em `smart-contract/tests/offchain.test.ts` usam o contrato real na EVM do Anvil. Autenticação de carteira segue mensagem com domínio, rede, nonce e expiração conforme [ERC-4361](https://eips.ethereum.org/EIPS/eip-4361); nesta versão só EOAs são suportadas (sem ERC-1271). Consulta de rede usa [ethers](https://docs.ethers.org/v6/api/providers/) e persistência usa [SQLite do Node](https://nodejs.org/api/sqlite.html).

### Ordem de cancelamento e sincronização

Cancelamentos geram uma fila de devolução com instante UTC. O indexador primeiro aplica os eventos de transferência/recuperação, depois devolve as cotas cuja data já foi coberta pelo bloco finalizado. Isso evita entregar ao destinatário cotas de uma reserva que foi cancelada enquanto uma transferência ainda aguardava finalização. Na EVM local da demonstração, só são liberados cancelamentos que já existiam antes de iniciar a consulta, sem espera de finalização. Uma barreira de sequência exclui cancelamentos criados durante a coleta do snapshot. Cotas pendentes não podem ser usadas nem transferidas pelo livro de direitos. Nenhum token é bloqueado ou queimado.

## Revisão final de implementação — 22/09/2026

O teto pessoal passou a ser imposto no contrato técnico v3; o serviço continua conciliando o mesmo identificador. `personChainId(id)` deriva bytes32 de UUID aleatório, nunca de CPF. O fluxo de assinatura cadastra a carteira localmente; depois o administrador obtém a transação por `POST /admin/people/:id/onchain-registration` com `{ "wallet": "0x..." }` e a assina no Remix. O retorno contém rede, destino e calldata, mas o backend não transmite nem guarda chave privada.

A leitura reconhece `treasury()` e preserva a exclusão do estoque mesmo após trocar owner. A elegibilidade exige concordância entre cadastro e `personOf`; uma recuperação anunciada também bloqueia hospedagens até cancelamento/execução conciliados. Falhas RPC não desabilitam essa validação silenciosamente. Compatibilidade histórica é apenas leitura: ausência do seletor treasury distingue as instâncias antigas, que não ganham as novas proteções.

`Reissued` com zero unidades também revoga origem, preserva pessoa e pedidos e remove sessões. O destino vazio herda cadastro; divergência entre pessoas reverte o lote de sincronização. O indexador lê royalties de todas as carteiras da pessoa, preservando pagos anteriores.

A demonstração local utiliza janela civil **2025–2028** para reportes já maduros e realiza compra atômica com tBRL. O roteiro padrão de nova publicação usa **2027–2030**. Nenhum contrato Sepolia ou banco existente foi migrado. Ver [guia](../smart-contract/docs/guia-de-execucao.md) e [evolução da entrega](../smart-contract/docs/evolucao-v1-v2.md).
