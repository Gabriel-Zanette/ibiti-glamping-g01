# Guia de testes do IBITI — passo a passo, do primeiro clique à blockchain

Preparado em **23/09/2026**, para o código deste repositório. Você não precisa saber programar para começar. Faça uma seção por vez, copie os comandos e compare o que aconteceu com o resultado esperado.

**Comece pelas seções 1 a 4.** Depois avance para o laboratório das seções 5 a 8. Remix e Sepolia ficam nas seções 9 e 10. A seção 12 é seu caderno para registrar melhorias.

## 1. Entender as peças, sem palavras difíceis

Imagine dois cadernos:

- **On-chain:** um caderno compartilhado chamado blockchain. Guarda quem tem IBT, transferências, administração e registros de royalties. O contrato inteligente é o conjunto de regras desse caderno.
- **Off-chain:** o caderno do atendimento. Guarda cadastro, vínculo das carteiras, cotas e pedidos de hospedagem. Neste projeto, ele é um arquivo de banco de dados SQLite.
- **Passaporte:** a tela que mostra o caderno do atendimento.
- **Landing:** a vitrine pública. A simulação de aquisição nessa vitrine ainda não cria cadastro no Passaporte.
- **IBT:** unidade de participação. Existem 150 unidades, indivisíveis. Usar hospedagem não destrói um IBT.
- **Cota:** direito de pedir uma experiência. A regra definida é três noites para até cinco pessoas. Uma cota não se renova a cada ano nem reaparece porque um token mudou de carteira.
- **tBRL:** dinheiro de brincadeira para testar pagamentos. Não são reais nem os 150 IBT.
- **Carteira:** conta que assina mensagens e transações. Uma pessoa pode ter várias; o teto técnico v3 soma até 20 IBT por pessoa registrada.
- **Transação:** alteração no caderno da blockchain. **Assinar uma mensagem para entrar** não é uma compra nem uma transferência.

### Três lugares diferentes para brincar

| Lugar | O que é | Para que usar |
| --- | --- | --- |
| Anvil local, rede `31337` | Blockchain só neste computador | Testar o sistema inteiro, com dinheiro fictício e relógio controlável |
| Remix VM | Outra blockchain de laboratório, dentro do Remix | Aprender os botões e testar o contrato isolado |
| Sepolia, rede `11155111` | Blockchain pública de testes | Exercitar carteira, confirmações e integração com rede pública |

**Anvil e Remix VM não compartilham saldos.** Publicar na Remix VM não conecta automaticamente o Passaporte local àquela instância.

### Qual versão estou testando?

| Artefato | Situação na preparação deste guia |
| --- | --- |
| Código em `smart-contract/` e demonstração local | IBIToken técnico **v3** |
| Sepolia `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030` | **v2 histórica**, publicada em 11/09/2026 |
| Pasta/ZIP de entrega acadêmica com nome “versão 2” | Segunda entrega acadêmica; contém código técnico v3 |

Enviar um commit ao GitHub **não atualiza um contrato publicado**. A v3 ainda precisa de publicação própria para existir na Sepolia.

Há duas diferenças conhecidas entre o modelo decidido e o código atual:

1. A decisão é contar quatro anos desde a abertura do Glamping; o código ainda exige quatro anos civis iniciados em janeiro.
2. A decisão permite primeira aquisição de participante aprovado no mercado secundário; o código ainda exige saldo prévio no destinatário de uma transferência comum.

Estão registradas nos [ADRs de vigência](docs/adr/0001-vigencia-a-partir-da-abertura.md) e [mercado secundário](docs/adr/0002-entrada-pelo-mercado-secundario.md). Um teste pode passar para a implementação atual e, mesmo assim, revelar trabalho necessário para cumprir essas decisões.

## 2. Preparar o computador

### 2.1 Abrir a pasta certa

No Mac, abra o aplicativo **Terminal**. Ele é uma janela onde você cola instruções e aperta Enter. Não copie as marcas de crase que cercam os exemplos.

Nesta máquina, cole:

```bash
cd /Users/gabrielzanette/Documents/Github/ibiti-glamping-g01
```

Em outra máquina, use o caminho onde baixou/clonou o repositório. Os comandos com `--prefix` abaixo são executados na **raiz do projeto**, a pasta que contém `smart-contract` e `offchain`.

### 2.2 Conferir o Node e instalar as peças

```bash
node --version
npm --version
```

O primeiro precisa mostrar **v24 ou superior**. Se não tiver Node, instale uma versão compatível pelo [site oficial do Node](https://nodejs.org/en/download), reabra o Terminal e confira novamente.

Execute uma linha por vez. Espere cada comando terminar:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm run build --prefix smart-contract
```

**Esperado:** instalação concluída e mensagem de compilação Solidity concluída. O Anvil vem nas dependências. Este projeto não usa Hardhat.

### 2.3 Pedir ao computador que faça os testes automáticos

```bash
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
```

**Esperado nesta revisão:** 48 entradas aprovadas no primeiro comando, 19 no segundo e zero falhas. Uma das 48 entradas é um agrupador: são **66 casos efetivos**, não 67 cenários diferentes. Os dois últimos comandos terminam sem erros.

Esses testes exercitam contratos em EVM local e banco de testes. Não enviam transações à Sepolia. Uma linha vermelha é motivo para guardar a mensagem e investigar; não é necessário tentar “consertar” apagando arquivos.

## 3. Testar o Passaporte pelo navegador — off-chain

Tempo sugerido: 20 a 30 minutos. Você será o atendente e o participante fictício.

### 3.1 Ligar a demonstração

No Terminal, na raiz:

```bash
npm run demo --prefix offchain
```

Espere aparecer `Demonstração ativa`. **Deixe essa janela aberta.** Ela mantém o sistema ligado.

Abra [http://localhost:3000](http://localhost:3000). Use exatamente `localhost`, pois a origem faz parte da autenticação.

O comando cria duas pessoas fictícias, que chamaremos **Alice** e **Bob**. Alice começa com 5 IBT, duas cotas usadas e três livres; Bob começa com 1 IBT e uma cota livre. A preparação também faz uma compra com tBRL e um pagamento de royalty.

O período do laboratório é **2025–2028**, para permitir testes de royalties já vencidos em 2026. Isso não define a data comercial de abertura.

### 3.2 Entrar como atendente

1. Abra `offchain/.env.demo` no editor de arquivos do Codex. É gerado a cada início da demonstração.
2. Localize `ADMIN_API_TOKEN=` e copie **somente o valor depois de `=`**.
3. Na página, abra **Área de operação acadêmica**.
4. Cole o valor em **Chave de acesso administrativo**.
5. Copie o valor de `DEMO_PERSON_ID=` para **Identificador da pessoa**.
6. Clique **Abrir atendimento**.

Esses valores são acesso ao laboratório local. Não os inclua em prints compartilhados ou no GitHub. Eles não são uma chave privada de carteira.

**Esperado:** 3 disponíveis, 0 em pedidos, 2 utilizadas, 0 em devolução e 5 unidades vinculadas. Pode haver um pedido usado e outro cancelado no histórico, criados pela preparação.

### 3.3 Pedir, confirmar e usar uma hospedagem

Use datas futuras dentro de 2028. Se executar em setembro de 2026, por exemplo, chegada **10/10/2026** e saída **13/10/2026**. Se essas datas já tiverem passado, escolha outras válidas.

| Passo | O que fazer | O que deve aparecer |
| --- | --- | --- |
| O1 | Pedir **1 cota**, preencher chegada/saída e clicar **Enviar pedido** | 2 disponíveis, 1 em pedidos, 2 utilizadas; “Pedido recebido” |
| O2 | No pedido novo, mudar chegada e saída mantendo três noites; clicar **Remarcar** | Datas mudam; contadores não mudam |
| O3 | Clicar **Confirmar (demo)** | “Confirmada (demonstração)”; ainda 2 disponíveis e 1 em pedidos |
| O4 | Clicar **Registrar uso (demo)** | 2 disponíveis, 0 em pedidos, 3 utilizadas |
| O5 | Conferir as unidades vinculadas | Continuam **5 IBT**; hospedagem não queimou tokens |
| O6 | Procurar “Cancelar pedido” na hospedagem utilizada | A ação não deve estar disponível |

**Observe uma melhoria:** o sistema permite ao operador marcar uso antes da chegada. É uma simulação administrativa, ainda sem comprovação de check-in/checkout do hotel.

### 3.4 Cancelar sem ganhar uma cota extra

1. Faça outro pedido de **1 cota**. Agora deve haver 1 disponível e 1 em pedidos.
2. Clique **Cancelar pedido**.
3. Clique **Atualizar**. No laboratório, a devolução pode já ter sido processada quando a tela atualizar; na Sepolia depende da sincronização finalizada.
4. Confira que voltaram **2 disponíveis**, com 3 utilizadas e 5 IBT.
5. Atualize mais duas vezes. O número não deve subir para 3 ou 4.

“Em devolução” significa: o pedido foi cancelado, mas o sistema ainda precisa conciliar as movimentações antes de liberar a cota.

### 3.5 Tentar coisas erradas de propósito

| Teste | Ação | Resultado esperado / descoberta |
| --- | --- | --- |
| O7 | Pedir 3 cotas quando há só 2 disponíveis | Recusa por falta de cotas; nenhum pedido extra |
| O8 | Saída anterior à chegada, ou datas iguais | Recusa; não desconta cota |
| O9 | Datas depois do fim de 2028 | Recusa por validade, neste laboratório |
| O10 | Pedir uma estadia de **uma noite**, com uma cota livre | Hoje aceita: limitação conhecida, pois três noites ainda não são validadas |
| O11 | Procurar um campo para limitar hóspedes a cinco | Não existe na tela atual: limitação conhecida |
| O12 | Após O10, cancelar o pedido e atualizar | Recupera somente a cota separada naquele pedido |
| O13 | Clicar **Sair** e entrar novamente como atendente | Histórico permanece; não reseta hospedagens usadas |
| O14 | Usar uma chave administrativa errada | Acesso recusado; dados protegidos |

### 3.6 Conferir royalties e disponibilidade do serviço

Clique **Consultar registro dos royalties**. O extrato distingue devidos e pagos. Na preparação, Alice recebeu **0,005 tBRL** do período 1: a receita fictícia foi 1 tBRL, o royalty foi 0,15 tBRL e sua participação foi 5/150. O valor pequeno é intencional; não é projeção de retorno.

Abra [http://localhost:3000/health](http://localhost:3000/health). Deve aparecer `"status":"ok"`. Abra [http://localhost:3000/config](http://localhost:3000/config): deve indicar rede `31337` e política `unused-first-v1`, sem credenciais administrativas.

### 3.7 Parar e recomeçar

Na janela que mantém a demonstração ligada, pressione **Control + C**. Para começar de novo, rode `npm run demo --prefix offchain` na raiz.

Cada execução cria **outra blockchain local e outro banco**. Reabra `.env.demo`, pois o identificador e a chave mudam. Os bancos antigos são preservados em `offchain/data/demo-...`, mas não pertencem à nova blockchain. Reiniciar a demonstração não é um teste de continuidade da mesma emissão; a persistência do banco é verificada pela suíte automática.

## 4. Testar a vitrine e a simulação de aquisição

Esta parte é independente do Passaporte. Em **outra janela** do Terminal, na raiz:

```bash
python3 -m http.server 4178 --bind 127.0.0.1 --directory guia-de-comunicacao/landing
```

Abra [http://localhost:4178](http://localhost:4178). Se a página já estiver servida nessa porta, use o servidor existente. Não precisa encerrar processos de outras tarefas.

| Teste | O que fazer | O que observar |
| --- | --- | --- |
| V1 | Abrir início, como funciona, perguntas e transparência | Links funcionam; textos não se sobrepõem; direção visual “Luz do bosque” |
| V2 | Rolar a página de início | Seções aparecem, números terminam em 150 e 100, leitura continua possível |
| V3 | Reduzir a largura da janela e usar só Tab/Enter | Menu, botões, foco e formulário continuam utilizáveis |
| V4 | Se souber usar as ferramentas do navegador, simular `prefers-reduced-motion: reduce` | Conteúdo continua visível sem depender de movimento |
| V5 | Abrir `variacoes.html` e alternar os cinco fundos | Copy e estrutura permanecem equivalentes |
| V6 | Abrir aquisição e testar quantidades 1, 2 e 20 | Totais de R$ 37.055,19; R$ 74.110,38; R$ 741.103,80 |
| V7 | Testar 0, 21, 1,5 e campo vazio | Quantidade recusada; não deve mostrar total válido |
| V8 | Usar “Pessoa de Teste” e `teste@example.com`; percorrer as duas jornadas e voltar etapas | Revisão combina com quantidade, nome e jornada escolhidos |
| V9 | Encerrar/reiniciar a simulação | Dados e resumo são limpos; quantidade volta a 1 |
| V10 | Abrir o whitepaper disponibilizado na vitrine | Download/link funciona e conteúdo corresponde à fonte vigente |

Os totais da vitrine usam o preço exibido arredondado em centavos. O valuation da colocação usa a precisão integral da planilha; não compare esses dois totais como se tivessem o mesmo arredondamento.

**Limite atual:** nenhuma compra, cobrança, reserva de estoque, verificação civil ou criação de pessoa no Passaporte acontece aqui. Anote se essa distinção ficou clara sem precisar ler o código.

## 5. Preparar o controle do laboratório

Agora vamos testar o caderno da blockchain e sua ligação com o Passaporte, sem importar chaves na carteira. Os comandos usam **somente contas fictícias que o Anvil local já disponibiliza**.

**Recomece a demonstração antes desta seção**, conforme 3.7. Não crie pedidos pela tela durante as seções 5 a 8: os resultados abaixo partem dos 5 IBT / 3 cotas livres de Alice.

### 5.1 Abrir o console

Mantenha o Terminal A rodando a demonstração. No **Terminal B**, cole:

```bash
cd /Users/gabrielzanette/Documents/Github/ibiti-glamping-g01/offchain
node --env-file=.env.demo
```

O símbolo `>` significa que entrou no console JavaScript. **Não copie o `>`**. Os próximos blocos `js` são colados ali, não no terminal comum nem no console do navegador. `undefined` é uma resposta normal ao criar uma variável.

Cole este bloco uma vez:

```js
var { JsonRpcProvider, Contract, ContractFactory, id, formatUnits, ZeroAddress } = await import('ethers');
var { readFileSync } = await import('node:fs');
var rpc = new JsonRpcProvider(process.env.RPC_URL, undefined, { cacheTimeout: -1 });
if ((await rpc.getNetwork()).chainId !== 31337n) throw Error('PARE: este roteiro exige Anvil local');
rpc.pollingInterval = 50;
var admin = await rpc.getSigner(0), alice = await rpc.getSigner(1), bob = await rpc.getSigner(2);
var a = await alice.getAddress(), b = await bob.getAddress();
var abi = JSON.parse(readFileSync('../smart-contract/build/IBIToken.json', 'utf8'));
var moedaAbi = JSON.parse(readFileSync('../smart-contract/build/MockStablecoin.json', 'utf8'));
var token = new Contract(process.env.TOKEN_ADDRESS, abi.abi, admin);
var moeda = new Contract(await token.stablecoin(), moedaAbi.abi, admin);
var api = async (caminho, dados, chave = process.env.ADMIN_API_TOKEN) => {
  var resposta = await fetch(process.env.APP_ORIGIN + caminho, {
    method: dados === undefined ? 'GET' : 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + chave },
    body: dados === undefined ? undefined : JSON.stringify(dados)
  });
  var resultado = await resposta.json();
  if (!resposta.ok) throw Error(resultado.error);
  return resultado;
};
var base = '/admin/people/' + process.env.DEMO_PERSON_ID;
var verAlice = async () => (await api(base)).quota;
var recusa = async (acao) => {
  try { await acao(); console.log('ATENÇÃO: a operação foi aceita; confira o cenário'); }
  catch (erro) { console.log('Recusado:', erro.reason ?? erro.shortMessage ?? erro.message); }
};
await verAlice();
```

**Esperado:** `balance: 5`, `available: 3`, `used: 2`, `reserved: 0`. Um número como `150n` significa o inteiro 150; o `n` é só a notação usada pelo JavaScript.

A função `recusa` mostra erros esperados sem interromper o roteiro. **Uma recusa só comprova a trava certa se o motivo corresponder ao teste.** Falta de conexão não comprova limite de saldo ou permissão.

### 5.2 Login, assinatura, repetição e logout

```js
var desafio = await api('/auth/challenge', { wallet: a }, '');
var assinatura = await alice.signMessage(desafio.message);
var sessao = (await api('/auth/verify', { id: desafio.id, signature: assinatura }, '')).token;
(await api('/me', undefined, sessao)).quota;
await recusa(() => api('/auth/verify', { id: desafio.id, signature: assinatura }, ''));
await api('/auth/logout', {}, sessao);
await recusa(() => api('/me', undefined, sessao));
await recusa(() => api(base, undefined, 'chave-errada'));
```

**Esperado:** primeira consulta funciona; repetir o desafio, reutilizar a sessão encerrada e usar chave errada são recusados. O console assina com a conta fictícia; a experiência real com MetaMask está na seção 10.

### 5.3 Verificar pedido repetido e cancelamento pela API

API é a “porta” usada pela tela para falar com o sistema. Aqui mandamos o pedido diretamente para conferir que apertar duas vezes não gasta duas cotas.

```js
var dia = (dias) => new Date(Date.now() + dias * 86400000).toISOString().slice(0, 10);
var pedido = { units: 1, arrival: dia(10), departure: dia(13), idempotencyKey: 'guia-pedido-1' };
var primeira = await api(base + '/stays', pedido);
var repetida = await api(base + '/stays', pedido);
primeira.id === repetida.id;
await verAlice();
await recusa(() => api(base + '/stays', { ...pedido, units: 2 }));
await api(base + '/stays/' + primeira.id + '/cancelled', {});
await api(base + '/stays/' + primeira.id + '/cancelled', {});
await verAlice();
```

**Esperado:** comparação `true`; apenas uma cota separada; alterar o conteúdo mantendo a mesma chave dá `IDEMPOTENCY_CONFLICT`; cancelar duas vezes devolve apenas uma cota. Depois de sincronizar, Alice volta a 3 disponíveis. Este bloco deve ser executado uma vez por demonstração nova.

### 5.4 Reprovar e aprovar o cadastro

```js
await api(base + '/verification', { verified: false });
await verAlice();
await recusa(() => api(base + '/stays', { ...pedido, idempotencyKey: 'guia-sem-aprovacao' }));
await api(base + '/verification', { verified: true });
await verAlice();
```

**Esperado:** desaprovar torna `eligible` falso e bloqueia pedido. Reaprovar devolve a elegibilidade e as cotas anteriores, sem criar cotas novas. Aprovação aqui é simulada; não consulta provedor de identidade.

## 6. Testar tokens, compra e royalties — on-chain local

Continue no mesmo console, na ordem. Estes testes fazem transações reais **na blockchain fictícia do computador**.

### 6.1 Conferir a emissão

```js
[await token.totalSupply(), await token.decimals(), await token.reservedUnits(), await token.saleableUnits()];
[await token.balanceOf(a), await token.balanceOf(b), await token.balanceOf(await token.treasury())];
formatUnits(await token.primaryUnitPrice(), 6);
```

**Esperado:** `[150n, 0n, 50n, 94n]`; saldos `[5n, 1n, 144n]`; preço `37055.19`. Foram vendidos seis dos 100 inicialmente disponíveis.

### 6.2 Transferir token não recria hospedagem usada

```js
await (await token.connect(alice).transfer(b, 4)).wait();
await verAlice();
var desafioBob = await api('/auth/challenge', { wallet: b }, '');
var sessaoBob = (await api('/auth/verify', { id: desafioBob.id, signature: await bob.signMessage(desafioBob.message) }, '')).token;
(await api('/me', undefined, sessaoBob)).quota;
```

**Esperado:** Alice fica com **1 IBT, 0 cotas livres e 2 utilizadas**. Bob fica com **5 IBT e 4 cotas livres**: sua cota inicial mais as três livres que vieram de Alice. As duas usadas não reaparecem.

**Não envie os quatro tokens de volta durante este roteiro.** A política manda primeiro as cotas livres, então uma volta pode redistribuir também a cota original de Bob. A soma de direitos se conserva, mas a distribuição não precisa voltar ao estado anterior.

### 6.3 Observar a restrição atual da primeira compra secundária

```js
var nova = await rpc.getSigner(3), enderecoNovo = await nova.getAddress();
await (await token.registerWallet(enderecoNovo, id('pessoa-ficticia-do-guia'))).wait();
await recusa(() => token.connect(bob).transfer.staticCall(enderecoNovo, 1));
```

**Esperado no código atual:** `RecipientNotHolder`. Mesmo registrada, essa carteira ainda não tem IBT. Isso reproduz a divergência da decisão de permitir primeira aquisição secundária. `staticCall` ensaia a operação sem gravar uma transação.

Esse identificador é somente para o contrato isolado. Para uma pessoa acompanhada pelo Passaporte, use o identificador preparado pela API, conforme a seção 10; inventar outro faz os cadastros divergirem.

### 6.4 Comprar com tBRL e conferir o limite pessoal

Vamos levar Alice de 1 para 20 IBT, comprando 19:

```js
var preco = await token.primaryUnitPrice();
await (await moeda.mint(a, preco * 20n)).wait();
await recusa(() => token.connect(alice).buyPrimary.staticCall(19, id('sem-aprovacao')));
await (await moeda.connect(alice).approve(await token.getAddress(), preco * 20n)).wait();
var caixaAntes = await moeda.balanceOf(await token.treasury());
await (await token.connect(alice).buyPrimary(19, id('compra-guia'))).wait();
[await token.balanceOf(a), (await moeda.balanceOf(await token.treasury())) - caixaAntes];
await verAlice();
var dinheiroAntes = await moeda.balanceOf(a);
await recusa(() => token.connect(alice).buyPrimary.staticCall(1, id('acima-do-teto')));
(await moeda.balanceOf(a)) === dinheiroAntes;
```

**Esperado:** sem aprovação do pagamento, recusa por allowance; depois Alice tem **20 IBT**, recebe **19 cotas livres** e mantém **2 utilizadas**. A tesouraria recebe `preco * 19`. A compra extra é recusada por teto; a comparação final é `true`.

Ela pode ter 19 livres e duas usadas porque recebeu direitos novos ao comprar. O limite de 20 mede saldo atual de IBT, não a soma histórica de todas as experiências já realizadas.

Também confira a autorização e o preço fixo:

```js
await recusa(() => token.connect(alice).pause.staticCall());
await recusa(() => token.setPrimaryPrice.staticCall(preco + 1n));
await recusa(() => token.transfer.staticCall(b, 1));
```

**Esperado:** participante não é administrador; preço já fixado não pode mudar; saída direta da tesouraria é bloqueada. Pagamento e entrega devem seguir a compra primária.

### 6.5 Apurar e sacar um royalty

A preparação já reportou o período 1. Nesta data, o período 2 do laboratório 2025–2028 já encerrou. Confira:

```js
await token.lastReportedPeriod();
new Date(Number(await token.periodEnd(2)) * 1000).toISOString();
```

**Esperado:** `1n` e `2026-01-01T00:00:00.000Z`. Vamos informar **1.000 tBRL de faturamento bruto**, não 1.000 de royalty:

```js
await (await moeda.mint(await admin.getAddress(), 150000000n)).wait();
await (await moeda.approve(await token.getAddress(), 150000000n)).wait();
await (await token.reportRevenue(1000000000n, id('relatorio-ficticio-guia'))).wait();
[formatUnits(await token.royaltyDue(2, a), 6), formatUnits(await token.royaltyDue(2, b), 6)];
var antesDoSaque = await moeda.balanceOf(a);
await (await token.connect(alice).claimRoyalty(2)).wait();
formatUnits((await moeda.balanceOf(a)) - antesDoSaque, 6);
await recusa(() => token.connect(alice).claimRoyalty.staticCall(2));
await api(base + '/royalties');
```

**Esperado:** royalty total de 150 tBRL; Alice tem direito a **20 tBRL**, Bob a **5 tBRL**, tesouraria a **125 tBRL**. O saque de Alice aumenta seu saldo em 20. Segundo saque do mesmo período é recusado. As cotas não mudam.

O corte usa os saldos **na hora do reporte**. Testes automáticos conferem que uma transferência posterior não altera um direito já apurado. Calendário de todos os oito períodos, reporte antecipado e nono reporte são testados na seção 11.

### 6.6 Pausar e retomar

```js
await (await token.pause()).wait();
await verAlice();
await recusa(() => token.connect(alice).transfer.staticCall(b, 1));
await recusa(() => api(base + '/stays', { ...pedido, idempotencyKey: 'guia-pausado' }));
await (await token.unpause()).wait();
await verAlice();
```

**Esperado:** durante pausa, `eligible: false`, transferência e pedido recusados. Ao retomar, saldo e histórico continuam intactos. `available: 0` durante um bloqueio não significa que os direitos foram apagados; confira novamente depois de retomar.

## 7. Recuperação, administração e expiração

### 7.1 Recuperar a carteira da mesma pessoa

Use uma carteira vazia diferente daquela do teste 6.3:

```js
var substituta = await rpc.getSigner(4), destino = await substituta.getAddress();
await (await token.requestRecovery(a, destino, id('processo-ficticio-guia'))).wait();
await verAlice();
await recusa(() => token.reissue.staticCall(a, destino));
await recusa(() => token.connect(alice).transfer.staticCall(b, 1));
```

**Esperado:** recuperação pendente bloqueia novos usos e circulação; execução imediata é recusada porque faltam 48 horas.

Primeiro teste a contestação, inclusive com o sistema pausado:

```js
await (await token.pause()).wait();
await (await token.connect(alice).cancelRecovery(a)).wait();
await (await token.unpause()).wait();
await verAlice();
```

**Esperado:** a própria origem consegue cancelar; sua posição volta a ficar elegível.

Anuncie outra vez e avance **somente o relógio do Anvil**:

```js
await (await token.requestRecovery(a, destino, id('segundo-processo-ficticio'))).wait();
var recuperacao = await token.recoveries(a);
await rpc.send('evm_setNextBlockTimestamp', [Number(recuperacao.executeAfter)]);
await rpc.send('evm_mine', []);
await (await token.reissue(a, destino)).wait();
[await token.balanceOf(a), await token.balanceOf(destino), await token.totalSupply(), await token.revoked(a)];
await verAlice();
```

**Esperado:** `[0n, 20n, 150n, true]`. O cadastro original continua com 20 IBT, 19 cotas disponíveis e duas utilizadas, agora pela carteira substituta. O backend concilia a nova carteira ao mesmo cadastro. Recebíveis pendentes migram; pagamentos anteriores permanecem no histórico da origem.

Isso é recuperação da **mesma pessoa**, não transferência de direitos para herdeiro. Na Sepolia, não é possível avançar o tempo com esses comandos: é necessário esperar o prazo real.

### 7.2 Trocar o administrador em duas etapas

```js
var gestor = await rpc.getSigner(5), enderecoGestor = await gestor.getAddress();
var tesourariaAntes = await token.treasury();
await (await token.transferOwnership(enderecoGestor)).wait();
[await token.owner(), await token.pendingOwner()];
await (await token.connect(gestor).acceptOwnership()).wait();
[await token.owner(), (await token.treasury()) === tesourariaAntes];
await recusa(() => token.pause.staticCall());
```

**Esperado:** a primeira chamada só anuncia; a segunda aceita. A tesouraria continua igual (`true`). O administrador antigo não pode mais pausar.

Devolva a administração à conta inicial para continuar:

```js
await (await token.connect(gestor).transferOwnership(await admin.getAddress())).wait();
await (await token.acceptOwnership()).wait();
```

A suíte automática também testa que uma troca A → B → A não revalida anúncios antigos de recuperação.

### 7.3 Reduzir reserva e entender que não é dinheiro em caixa

```js
await (await token.reduceReserve(49)).wait();
[await token.reservedUnits(), await token.saleableUnits(), await token.totalSupply()];
await recusa(() => token.reduceReserve.staticCall(50));
await recusa(() => token.renounceOwnership.staticCall());
```

**Esperado neste roteiro:** `[49n, 76n, 150n]`. A redução libera uma unidade do estoque; não cria token nem dinheiro. Aumentar novamente a reserva e renunciar à administração são recusados. Esta redução é só no laboratório.

### 7.4 Expirar o programa — faça por último nesta demonstração

```js
await rpc.send('evm_setNextBlockTimestamp', [Number(await token.validUntil()) + 1]);
await rpc.send('evm_mine', []);
await verAlice();
await recusa(() => token.connect(substituta).transfer.staticCall(b, 1));
var bobAntes = await moeda.balanceOf(b);
await (await token.connect(bob).claimRoyalty(2)).wait();
formatUnits((await moeda.balanceOf(b)) - bobAntes, 6);
```

**Esperado:** novos usos e transferências bloqueados por expiração; Bob ainda consegue sacar os **5 tBRL** que já lhe eram devidos. Um recebível não desaparece porque a vigência terminou.

Para voltar ao início, saia do console com `.exit`, pare a demonstração com Control + C e inicie outra. **Não volte o relógio nem restaure só a blockchain mantendo o banco adiantado.** Isso pode provocar a proteção contra divergência de histórico.

## 8. Testar o modo sem stablecoin — registro de pagamento externo

Este é outro caminho do contrato. Ele registra uma liquidação externa; não faz Pix nem movimenta conta bancária.

Comece com uma **demonstração nova** e repita a preparação da seção 5.1. O contrato abaixo será uma segunda instância, isolada do Passaporte; não mude `TOKEN_ADDRESS` no banco existente.

```js
var externo = await new ContractFactory(abi.abi, abi.bytecode, admin).deploy(await admin.getAddress(), 150, 1735689600, 1861919999, ZeroAddress);
await externo.waitForDeployment();
await (await externo.registerWallet(a, id('pessoa-ficticia-externo'))).wait();
await (await externo.primaryPurchase(a, 5, id('compra-externa-ficticia'))).wait();
await (await externo.reportRevenue(100000n, id('receita-brl-ficticia'))).wait();
formatUnits(await externo.royaltyDue(1, a), 2);
await recusa(() => externo.connect(alice).claimRoyalty.staticCall(1));
await (await externo.settleOffChain(1, a, id('comprovante-ficticio'))).wait();
[await externo.royaltyDue(1, a), await externo.royaltyPaid(1, a)];
await recusa(() => externo.settleOffChain.staticCall(1, a, id('repeticao')));
```

**Esperado:** receita de R$ 1.000,00 em centavos; royalty de R$ 150,00; parcela de Alice **R$ 5,00**. Saque on-chain é recusado nesse período. O registro externo deixa devido zero e pago `500n` centavos; não pode liquidar duas vezes.

**Melhoria a avaliar:** a referência de comprovante não verifica se o pagamento bancário aconteceu. Essa prova e sua conciliação dependem de integração e processo externos.

## 9. Testar no Remix, com botões

É uma alternativa ao console para aprender o contrato. A [documentação oficial do Remix](https://remix-ide.readthedocs.io/en/latest/run.html) descreve os ambientes e o carregamento de contratos; os scripts e parâmetros específicos estão no [guia do projeto](smart-contract/docs/guia-de-execucao.md).

1. Extraia `entrega/IBITI-Remix.zip`.
2. Abra [Remix](https://remix.ethereum.org/?nomigrationredirect), crie um workspace e importe a pasta extraída por **Import Project**.
3. No compilador, selecione **0.8.34**, EVM **Osaka**, otimizador ativado com **200** execuções.
4. Compile `contracts/IBIToken.sol` e `contracts/mocks/MockStablecoin.sol`.
5. Em **Deploy & Run**, selecione **Remix VM**, compatível com Osaka.
6. Em `scripts/01_publicar.js`, use `anoInicio: 2025` para este laboratório em 2026 e mantenha `permitirSepolia: false`.
7. Execute o script pelo comando **Run** do editor. Salve `deployments/remix-latest.json`, gerado pelo script.
8. Execute `scripts/02_operar.js` com `acao: 'status'`. Confira supply 150, reserva 50, preço e endereço.

Para cada ação seguinte, edite o objeto `config` de `02_operar.js`, selecione a conta certa no Remix e execute o script outra vez:

| Ação | Conta | Campos a preencher / preparação |
| --- | --- | --- |
| `registrar` | Administrador | `destino`: conta do participante; `identificadorPessoa`: bytes32 fictício único ou preparado pela API |
| `compra` | Participante | `quantidade: '1'`, `destino` vazio ou sua própria conta; antes, dê tBRL à conta |
| `transferencia` | Participante com saldo | `destino`: participante registrado com saldo; `quantidade: '1'` |
| `reporte` | Administrador | `faturamento: '1000.00'`; conta precisa ter tBRL para financiar os 15% |
| `saque` | Participante | `periodo: 1` após o reporte |
| `pausar` / `retomar` | Administrador | Sem destinatário |
| `anunciar-recuperacao` | Administrador | `origem`, `destino` vazio válido e referência fictícia |
| `cancelar-recuperacao` | Origem ou administrador | `origem` |
| `recuperacao` | Administrador | Mesma origem/destino; só depois do prazo |

Para dar tBRL, selecione o contrato **MockStablecoin** compilado, carregue seu endereço do registro em **Add Contract** (ou **At Address**, conforme a interface) e use `mint` com endereço do participante e `37055190000` para financiar um IBT. A moeda tem seis casas decimais. Para um identificador isolado de demonstração, pode usar `0x1111111111111111111111111111111111111111111111111111111111111111` para uma pessoa e outro valor para outra; nunca CPF ou documento. Esse identificador manual não substitui o da API quando houver Passaporte.

O script de compra já envia a aprovação da moeda antes da compra. O script não registra carteiras sozinho, não cria cotas no banco e não ignora o prazo de recuperação. O avanço de 48 horas explicado na seção 7 usa Anvil; não cole aqueles comandos no Remix VM esperando compartilhar o mesmo relógio.

Para os testes Solidity, ative **Solidity Unit Testing**, selecione os quatro arquivos `*_test.sol` e execute. O [manual oficial do plugin](https://remix-ide.readthedocs.io/en/latest/unittesting.html) explica a interface. Essa execução não inclui toda a integração Node/SQLite; use também a seção 11.

## 10. Testar na Sepolia, sem confundir com o laboratório

Sepolia é a rede de testes usada por este projeto. Os [recursos oficiais de redes Ethereum](https://ethereum.org/developers/docs/networks/) explicam testnets e apontam faucets para obter ETH de teste. Use uma carteira de testes, sem fundos reais; nunca importe as contas públicas do Anvil para guardar valor.

### 10.1 Conferir a v2 já publicada — somente leitura

Nesta máquina há configuração local em `offchain/.env.sepolia`. No Terminal comum:

```bash
cd /Users/gabrielzanette/Documents/Github/ibiti-glamping-g01/offchain
node --env-file=.env.sepolia scripts/check-sepolia.ts
```

**Esperado:** `IBITOKEN_CONFIRMED`, nome `IBIToken`, 150 unidades, zero decimais, rede Sepolia e o endereço v2 da seção 1. Isso comprova leitura e formato básico do contrato, não execução de todos os fluxos nem presença das proteções v3.

Para abrir o Passaporte configurado para essa instância:

```bash
npm run start:sepolia
```

Abra [http://localhost:3001](http://localhost:3001) e `/health`. A aprovação/cadastro desse banco é separada da demonstração; o ID de `.env.demo` não serve aqui. Não reduza a finalização para “fazer funcionar mais rápido”.

Em outra máquina, esse `.env.sepolia` não virá do Git. Prepare um arquivo local seguindo `.env.example` e os parâmetros públicos do [registro v2](smart-contract/deployments/sepolia-remix-v2-2026-09-11.json), com segredos novos e banco separado.

### 10.2 Criar uma instância v3 de laboratório público, quando quiser testar a versão atual

Esta é uma **nova publicação de teste**, feita por você; não altera nem substitui silenciosamente a v2. Use o fluxo de compilação/importação da seção 9 e, no script de publicação:

1. Mude `permitirSepolia` para `true` e rotule a instância como demonstração. `anoInicio: 2025` permite testar hospedagens e semestres já maduros em 2026; `2027` mantém o exemplo futuro e bloqueia hospedagens até o início.
2. Selecione **Browser Extension** no Remix, conecte MetaMask e confira **Sepolia** na carteira. Tenha ETH de teste para as taxas.
3. O script está configurado para reutilizar a tBRL histórica. Confirme endereço/rede; os tokens são fictícios.
4. Execute `01_publicar.js` e confirme na carteira as transações que você revisou. Aguarde os recibos.
5. Guarde `deployments/remix-latest.json`: endereço novo, `chainId`, bloco inicial e hash da transação. A mensagem “compilou” sozinha não prova publicação.

### 10.3 Conectar um banco novo à nova v3

Dentro de `offchain`, copie `.env.example` para um arquivo **novo** `.env.sepolia.v3-teste`. Não sobrescreva `.env.sepolia`.

Preencha no editor:

```dotenv
RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
CHAIN_ID=11155111
TOKEN_ADDRESS=COLE_O_ENDERECO_NOVO_DO_REGISTRO
START_BLOCK=COLE_O_STARTBLOCK_DO_REGISTRO
DATABASE_PATH=data/sepolia-v3-teste/ibiti.sqlite
PORT=3002
APP_ORIGIN=http://localhost:3002
ADMIN_API_TOKEN=COLE_UM_SEGREDO_GERADO
IDENTITY_SECRET=COLE_OUTRO_SEGREDO_GERADO
```

Para gerar cada segredo, execute duas vezes no Terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use resultados diferentes. Não altere `IDENTITY_SECRET` depois de criar pessoas nesse banco. Para outro deploy, escolha outro banco; o caminho `sepolia-v3-teste` só é novo na primeira utilização.

Confira e inicie:

```bash
node --env-file=.env.sepolia.v3-teste scripts/check-sepolia.ts
node --env-file=.env.sepolia.v3-teste src/server.ts
```

Abra [http://localhost:3002](http://localhost:3002). Se o RPC estiver indisponível, configure outro endpoint Sepolia confiável; não mude a rede nem desative as verificações.

### 10.4 Criar uma pessoa, ligar sua carteira e comprar

1. Na **Área de operação acadêmica**, use o novo `ADMIN_API_TOKEN` e deixe o identificador vazio.
2. Clique **Abrir atendimento**. Cadastre um CPF de teste usado pelas fixtures, como `52998224725`, sem associá-lo a dados de uma pessoa real. Salve o ID retornado.
3. Clique **Registrar aprovação de demonstração**.
4. Na MetaMask, selecione a conta de teste do **participante**, diferente da tesouraria/administrador, na rede Sepolia.
5. Clique **Vincular carteira conectada** e assine a mensagem. Isso vincula no banco, mas ainda falta o cadastro on-chain da v3.
6. Em outro Terminal, entre em `offchain` e execute `node --env-file=.env.sepolia.v3-teste`. Cole o bloco abaixo, substituindo ID e carteira pelos seus valores de teste:

```js
var resposta = await fetch(process.env.APP_ORIGIN + '/admin/people/COLE_O_ID/onchain-registration', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.ADMIN_API_TOKEN },
  body: JSON.stringify({ wallet: 'COLE_A_CARTEIRA_DO_PARTICIPANTE' })
});
var registro = await resposta.json();
console.log(registro);
```

7. O retorno deve ter `status: 'AWAITING_ADMIN_SIGNATURE'`, destino igual ao contrato novo, rede Sepolia e `personId` em bytes32. Se vier `error`, resolva o vínculo antes de continuar.
8. No Remix, selecione a conta **administradora**. Em `02_operar.js`, use `acao: 'registrar'`, `destino` com a carteira do participante e `identificadorPessoa` com **o `personId` retornado**, não o ID textual do cadastro. Execute e confirme na carteira.
9. Carregue a tBRL pelo endereço do registro e chame `mint` com a carteira do participante e `37055190000` para um IBT de teste.
10. Selecione a conta do **participante** no Remix/MetaMask. Use `acao: 'compra'`, `quantidade: '1'` e `destino` vazio. Confirme a aprovação e a compra.
11. Aguarde a finalização e atualize o Passaporte. Com vigência iniciada, espere 1 IBT e uma cota disponível.
12. Saia da área administrativa e clique **Entrar com minha carteira**. Assine com o participante e repita pedido, remarcação e cancelamento da seção 3.

**Esperado na jornada do participante:** acesso apenas ao próprio cadastro e sem botões administrativos de confirmar/registrar uso. Para simular o atendimento, entre novamente pela área administrativa com o ID correto.

Para uma transferência, prepare um segundo participante com cadastro, vínculo, registro on-chain e uma compra inicial, pois a restrição atual exige saldo no destinatário. Para royalties, reporte um período já encerrado e financie o administrador com tBRL; depois saque com o participante. Siga os campos da seção 9, que usam o mesmo script.

### 10.5 O que registrar na rede pública

- Rede, versão, endereço do IBT e da moeda, data/hora e bloco de criação.
- Hash e recibo de cada cadastro on-chain, aprovação, compra, transferência, reporte e saque.
- Saldo e cotas antes/depois; tempo até o Passaporte refletir uma transação finalizada.
- Resultado da carteira errada, ausência de ETH de teste, assinatura rejeitada e reconexão após logout.
- Para recuperação, hora do anúncio e `executeAfter`; esperar as **48 horas reais** e verificar bloqueio/cancelamento/execução.

Não é necessário publicar CPFs, mensagens de login ainda válidas, tokens de sessão, banco ou `.env` junto das evidências. Contratos e transações da testnet são públicos; use referências fictícias.

## 11. Cobrir os casos difíceis com a suíte automática

Nem todo problema é fácil de provocar clicando: dois pedidos simultâneos, uma reorganização da blockchain ou o retorno de um antigo administrador. Os testes existentes criam situações controladas para isso.

Todos os comandos desta tabela são executados na **raiz do repositório**, fora do console `>`:

| Área | Comando | O que observar nos nomes dos testes |
| --- | --- | --- |
| Cadastro e login | `node --test offchain/test/auth.test.ts offchain/test/api.test.ts` | Assinatura errada, expirada, reutilizada, origem errada, isolamento entre pessoas, acesso admin, preparação de cadastro on-chain |
| Banco e cotas | `node --test offchain/test/ledger.test.ts` | CPF normalizado, vínculo exclusivo, persistência, duas conexões, cancelamento repetido, remarcação, pausa, validade, divergência de identidade |
| Contratos Solidity | `npm run test:contracts --prefix smart-contract` | Emissão, ERC-20, reserva, administração, royalties e liquidação externa nas quatro suítes |
| Proteções v3 | `node --test smart-contract/tests/feedback.test.ts` | Teto agregado em várias carteiras; `transferFrom` e allowance; calendário completo; recuperação de recebíveis; pagamento atômico; troca de administrador |
| Integração de verdade | `npm run test:integration --prefix smart-contract` | Contrato EVM + banco; circulação sem recriar cota; recuperação; rede errada; contrato errado; histórico incompleto; consumo legado; reorganização |
| Scripts do Remix | `node --test smart-contract/tests/scripts.test.ts` | Publicação/operação usando os dois formatos de artefatos do Remix |

**Esperado:** zero falhas. O comando completo da seção 2 já inclui esses grupos; a tabela serve para repetir só uma área depois de uma alteração.

### Matriz final de cobertura e limites

| Ponto | Como conferir | Limite que ainda precisa ficar visível |
| --- | --- | --- |
| Supply, reserva, preço e indivisibilidade | 6.1, 6.4, 7.3 + suítes Solidity | Redução de reserva é poder administrativo; não é caixa de garantia |
| Compra primária com/sem stablecoin | 6.4 e 8 | Modo externo não prova pagamento; tBRL não é dinheiro real |
| Limite de 20 em várias carteiras | `feedback.test.ts` | Unicidade da pessoa depende da verificação externa |
| Transferência e conservação de cotas | 6.2 + integração | ERC-20 não carrega a informação das cotas na carteira |
| Primeira entrada secundária | 6.3 | Decisão aprovada ainda não implementada |
| Pedido, confirmação, uso, remarcação e devolução | 3 e 5.3 | Sem inventário real, bloqueio de quarto ou integração hoteleira |
| Reserva em aberto enquanto tokens são transferidos | `ledger.test.ts` e integração | Token não é travado on-chain pela reserva; saldo pode impedir confirmação/uso |
| Cancelar com rede indisponível / reembolso na ordem certa | `ledger.test.ts` | Cancelamento pode ocorrer; disponibilidade da cota aguarda conciliação |
| Login, logout, cadastro e vínculo | 5.2, 5.4 e 10.4 | Prova de chave não comprova identidade civil; só carteiras EOA, sem ERC-1271 |
| Royalties, fotografia, saque único e moeda por período | 6.5, 8 e integração | Reporte do faturamento depende de uma fonte externa confiável |
| Oito períodos, limites de tempo e expiração | 7.4 + `feedback.test.ts` | Calendário atual não implementa quatro anos desde abertura |
| Recuperação, cancelamento e recebíveis sem saldo | 7.1 + `feedback.test.ts` | 48h é escolha técnica; não implementa sucessão entre pessoas |
| Troca de owner, tesouraria e anúncios antigos | 7.2 + `feedback.test.ts` | Governança final e distribuição de responsáveis ainda em definição |
| Reorg, rede, contrato e emissão errados | Integração | Sistema bloqueia; não reconstrói consumos silenciosamente |
| Persistência e tentativas concorrentes | `ledger.test.ts` | Duas conexões SQLite não provam suporte a vários servidores em produção |
| Vitrine, aquisição e linguagem | 4 | Entrada demonstrativa ainda separada do backend |
| Pacotes e fonte entregue | Conferir manifesto e versões em `entrega/` | Nome acadêmico “v2” não significa contrato técnico v2 |

Para auditar o manifesto do pacote completo no Mac, extraia `entrega/IBITI-Implementacao-v2.zip` em uma pasta nova, abra o Terminal **nessa pasta extraída** e execute `shasum -a 256 -c MANIFEST.sha256`. O esperado é `OK` para cada arquivo listado. Não execute o comando na raiz deste repositório: o manifesto pertence ao pacote extraído.

## 12. Transformar o que você viu em melhorias

Depois de cada teste, responda: “Eu entendi o que aconteceu?”, “O saldo mudou como esperado?”, “Eu saberia continuar sem alguém me explicar?”. Não confunda um erro esperado de proteção com defeito.

Use quatro resultados: **passou**, **falhou**, **limitação conhecida**, **não testado**. Um teste não executado não deve ser marcado como aprovado.

Copie este modelo para seu caderno de testes:

```text
Teste: O1 — pedir uma hospedagem
Data/hora:
Ambiente: Anvil / Remix VM / Sepolia
Versão e endereço do contrato:
Preparação: saldo, cotas livres e pedidos existentes
O que fiz, em ordem:
O que eu esperava:
O que aconteceu:
Resultado: passou / falhou / limitação conhecida / não testado
Evidência: print sem credenciais, erro, ID do pedido ou hash da transação
Impacto para o participante:
Sugestão de melhoria:
Prioridade: alta / média / baixa
```

### Melhorias já identificáveis neste roteiro

| Prioridade sugerida | Descoberta | Como reproduzir / avaliar |
| --- | --- | --- |
| Alta | Calendário ainda diverge da vigência desde abertura | Comparar `periodEnd` e construtor com ADR 0001; suíte atual valida anos civis |
| Alta | Primeira entrada secundária aprovada ainda bloqueada | 6.3 produz `RecipientNotHolder` |
| Alta | Regras de três noites e até cinco pessoas não são impostas | O10/O11; verificar aceite de uma noite e ausência de campo de hóspedes |
| Alta | Pedido não protege tokens contra transferência | Rodar cenário de reserva pendente na suíte; avaliar proteção/aviso ao comprador e hóspede |
| Alta | Cadastro, KYC, hotel e pagamento externo dependem de operação simulada | 3, 8 e 10.4; distinguir dado preenchido de comprovação real |
| Média | Uso pode ser registrado antes de a hospedagem ocorrer | O4 com datas futuras; definir evidências e transições operacionais |
| Média | Vitrine termina antes do cadastro efetivo | Concluir V8/V9 e procurar a pessoa no Passaporte; não existe integração |
| Média | Tela ainda chama a política de hospedagens de “hipótese” | Ler rodapé do Passaporte; a política `unused-first-v1` já foi confirmada |
| Média | Comunicação do teto na documentação da landing fala por carteira | Comparar seu README com teto pessoal v3 e fluxo público que ignora saldo prévio |
| Média | Extrato de royalties é exibido como dados técnicos | 3.6; avaliar tabela em linguagem simples, valor, moeda, período e situação |
| Média | Algumas recusas aparecem como códigos pouco claros | Registrar mensagem durante os testes negativos e propor texto acionável |
| Média | Falta uma jornada visível de recuperação e contestação | 7.1 exige console/Remix; avaliar aviso de prazo, estado e contato do atendimento |
| Média | Finalização pode parecer tela parada | 10.4; medir espera e verificar se o participante entende o que falta |
| Baixa | Acessibilidade e leitura em celular precisam de avaliação contínua | V2–V4; anotar corte de texto, foco perdido ou movimento desconfortável |

As prioridades são propostas para avaliação, não decisões já aprovadas pela IBITI. Este guia documenta as diferenças encontradas; não declara que elas foram corrigidas.

## 13. Se travar, faça isto

| Sintoma | Próxima ação |
| --- | --- |
| `command not found: node` | Instalar Node 24+ e reabrir o Terminal |
| `ENOENT` / pacote não encontrado | Conferir `pwd`, entrar na raiz e instalar as dependências dos dois módulos |
| `Cannot find ... build/IBIToken.json` | Rodar `npm run build --prefix smart-contract` na raiz antes do console |
| `EADDRINUSE` | Já há serviço na porta. Use a janela original ou outra porta; não mate processos desconhecidos |
| Preciso mudar a porta da demo | Na raiz, usar `PORT=3005 DEMO_RPC_PORT=8546 npm run demo --prefix offchain`; abrir a URL impressa e reler `.env.demo` |
| Login/admin deixou de funcionar após reiniciar | Reabrir `.env.demo`; ID e chave são da nova execução |
| `UNAUTHORIZED` | Conferir chave/token, pessoa e ambiente; entrar novamente |
| `AWAITING_FINALITY` | Aguardar a blockchain finalizar e atualizar; não diminuir a exigência de confirmação |
| `WALLET_NOT_LINKED` | Vincular por assinatura antes do login; só conectar MetaMask não cadastra a carteira |
| `NOT_ELIGIBLE` | Conferir aprovação, saldo, vigência, pausa, recuperação e concordância de `personOf` |
| `RecipientNotHolder` | Na versão atual, destinatário precisa de compra inicial; registrar a pendência da decisão nova |
| `PeriodNotClosed` | Período ainda aberto; conferir `periodEnd`. Na Sepolia, esperar; no laboratório, usar cenário temporal controlado |
| `RecoveryNotReady` | Não passaram 48 horas desde o anúncio válido |
| Rede/contrato/histórico incompatível | Conferir endereço, chain ID, bloco inicial e banco da mesma emissão; não reaproveitar banco de outra blockchain |
| `SEPOLIA_CHECK_FAILED` | Conferir conexão, RPC e contrato; a mensagem não significa necessariamente defeito no token |
| Console mostra `...` e não executa | Falta fechar algum parêntese/chave. Control + C cancela a entrada; cole o bloco completo novamente |
| Quero sair do console `>` | Digitar `.exit`; os comandos `npm` voltam a ser executados no Terminal comum |
| Data de hospedagem inválida em outro ano | Demo tem janela fixa 2025–2028; depois desse intervalo, o roteiro precisa de nova janela de teste |

## 14. Evidência da preparação deste guia

Verificações executadas em 23/09/2026:

- Node `24.19.0`; compilação Solidity `0.8.34`, Osaka, otimizador 200 concluída.
- Suíte `smart-contract`: 48 entradas aprovadas, zero falhas; suíte `offchain`: 19 aprovadas, zero falhas. São 66 casos efetivos.
- Typecheck dos dois módulos sem erros.
- Demonstração local com `/health` em `ok`, cadastro com 5 IBT / 3 cotas livres / 2 utilizadas e login assinado pela conta fictícia.
- Consulta **somente de leitura** à v2 Sepolia retornou `IBITOKEN_CONFIRMED`, supply 150, zero decimais e bloco finalizado `11767084`.
- Os 19 blocos JavaScript das seções 5 a 7 foram extraídos deste documento e executados em sequência contra a demonstração, com conferências adicionais de saldos, cotas, recebíveis e permissões. Resultado: `ROTEIRO LOCAL COMPLETO: OK`.
- O modo sem stablecoin da seção 8 foi executado em uma demonstração nova: liquidação de 500 centavos para Alice, devido zerado e repetição recusada. Resultado: `ROTEIRO SEM STABLECOIN: OK`.
- Os campos iniciais e a área de operação do Passaporte foram conferidos no navegador; isso não equivale a executar todos os testes manuais de interface.
- Links locais deste guia sem destinos ausentes; whitepaper da landing idêntico à fonte; manifesto SHA-256 do ZIP completo e da pasta de entrega conferidos. ZIPs sem bancos, arquivos de ambiente privados ou dependências instaladas.

As confirmações de interface MetaMask, publicação v3 na Sepolia, espera de 48h pública, plugin Solidity Unit Testing no navegador, acessibilidade completa e operação real do hotel **não foram realizadas nesta rodada**. As seções correspondentes são instruções para sua execução, não comprovantes de que aconteceram.

Fontes do funcionamento: [código do token](smart-contract/contracts/IBIToken.sol), [API](offchain/src/api.ts), [livro de cotas](offchain/src/ledger.ts), [demo](offchain/scripts/demo.ts), [guia técnico](smart-contract/docs/guia-de-execucao.md) e [relatório de testes anterior](smart-contract/docs/relatorio-de-testes.md). As decisões posteriores estão em [docs/adr](docs/adr/) e [governança e operação](docs/decisoes/2026-09-22-governanca-e-operacao.md).
