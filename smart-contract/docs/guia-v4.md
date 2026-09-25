# Executar e conferir a próxima entrega oficial v2

25/09/2026. Estas instruções substituem o calendário fixo e o rateio por fotografia das instruções de 22/09. A única versão oficial publicada é a v1. A revisão interna de testes chamada v4 será consolidada na v2 oficial após validação. Não há Hardhat.

## Verificação local

Node 24+, dependências das duas pastas (`npm ci --prefix smart-contract` e `npm ci --prefix offchain`). Na raiz:

```bash
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run demo:portal --prefix offchain
```

O último comando cria Anvil e banco novos e isolados, publica os contratos somente na rede local, registra abertura simulada, aprova uma identidade sintética e concilia uma compra de três IBT. Inclui também contas aprovadas sem compra, com modalidades distintas. Não altera bases anteriores. O processo precisa permanecer aberto; `Ctrl+C` encerra portal e Anvil. Para usar outra porta, definir `DEMO_PORT`. Banco e rede são efêmeros; reiniciar cria outra demonstração, não reconecta um banco antigo à emissão nova.

Acessar `http://localhost:3000/` para cadastro, ou `http://localhost:3000/conta#entrar` para login. Credenciais exclusivamente de teste:

| Papel | E-mail | Senha |
| --- | --- | --- |
| Participante aprovado, 3 cotas livres | participante@demo.ibiti.test | Teste local Ibiti 2026! |
| Primeira compra IBITI, aprovada e sem saldo | compra@demo.ibiti.test | Teste local Ibiti 2026! |
| Autocustódia direta, aprovada e sem saldo | direta@demo.ibiti.test | Teste local Ibiti 2026! |
| Supervisão: análise, ficha, aprovação/reprovação e hospedagens | admin@demo.ibiti.test | Admin local Ibiti 2026! |
| Financeiro: carteira institucional e pedidos | financeiro@demo.ibiti.test | Admin local Ibiti 2026! |

Bruno e Clara são candidaturas pendentes para experimentar aprovação/reprovação. Login é o mesmo endereço; o papel autenticado define a tela. Alternar com “Sair” ou usar janela anônima para sessão independente.

Para testar novo cadastro, usar somente dados sintéticos e CPF com dígitos verificadores válidos, ainda não usado na base. Gerar um identificador sintético com dígitos válidos. Não usar o CPF de Ana (`52998224725`), Bruno (`11144477735`) Clara (`93541134780`), Beatriz (`12345678909`) ou Daniel (`98765432100`), pois a deduplicação deve impedir nova conta para esses registros.

Para testar cotas: entrar como participante, escolher check-in futuro e uma cota. A interface calcula três noites. Confirmar pelo administrador na ficha de Ana; cancelamento é uma solicitação manual que pode ser analisada na mesma ficha. A aprovação cadastral de um novo usuário não concede saldo: a modalidade IBITI oferece o fluxo completo de compra local sem extensão, seguindo a sequência descrita abaixo. A demo já conclui essa compra para Ana, permitindo testar experiências sem extensão de carteira. Não existe PIX ficticiamente reconhecido como pagamento.

A simulação usa **R$ 34.874,14 por IBT**, conforme memorando v2; a demo liquida o equivalente numérico em moeda fictícia tBRL, e a abertura simulada não é anúncio de inauguração. As contas Anvil e a moeda de teste não devem receber recursos reais.

## Compra institucional sem extensão

Entrar como `compra@demo.ibiti.test` e solicitar a quantidade. Financeiro: **Compras → Abrir pedido → Preparar carteira de teste**. Admin: **Compras → Abrir pedido → Autorizar vínculo para compra**. Financeiro: **Preparar pedido**. Participante: **Autorizar pedido**, conferindo o valor. Financeiro: **Concluir compra de teste**. A confirmação libera cotas na mesma conta. Para testar perfis simultâneos, usar sessões de navegador separadas; abas comuns compartilham o login.

## Compilação no Remix

- Solidity **0.8.34**, EVM **Osaka**, otimizador habilitado com **200 runs** e **viaIR habilitado**.
- Importar `contracts/` completo, incluindo `OpeningCalendar.sol`, bibliotecas OpenZeppelin 5.6.1, `Math`, `SafeCast` e `Panic`.
- Compilar `IBIToken.sol` e, para simulação, `mocks/MockStablecoin.sol`.
- `scripts/01_publicar.js` inicia com datas `0/0`; a compra permanece fechada. O registro identifica `contractVersion:4`.
- `scripts/02_operar.js` inclui ação `abertura`, com `aberturaUtc` ISO 8601 e `referencia`. O registro só pode ocorrer uma vez, após o marco informado. Datas simuladas devem ser identificadas como tal.
- Não existe ação de transferência ordinária. A sequência funcional é registro da pessoa/carteira → abertura → preço/moeda configurados → autorização da moeda → compra → fechamento do semestre → reporte financiado → saque.
- Anúncio de recuperação exige sete dias; avanço artificial de tempo cabe somente na rede local de testes.

A compilação local verifica o limite EIP-170 dos contratos e das suítes. `viaIR` também mantém as suítes Solidity, que embutem o bytecode de criação do token, dentro do limite de publicação. Arquivos de bibliotecas vendorizadas conservam código e licença originais.

## Estado e limites

Royalties por tempo, teto pessoal, tesouraria separada, ausência de transferências ordinárias, abertura relativa e recuperação de sete dias estão na fonte. Governança por pilares, segunda aprovação crítica, pausa seletiva e tesouraria 2 de 3 continuam pendentes. O portal não integra fornecedor KYC, serviço de custódia, conversão/PIX, e-mail ou MFA.

[Inventário completo](../../docs/decisoes/2026-09-25-inventario-completo-token.md) · [Feedback do memorando](../../docs/decisoes/2026-09-25-feedback-memorando-v2.md).
