# 02 · Modelo do token (IBIToken)

> **Implementação em 10/09/2026:** consulte [10 · Implementação off-chain](10-implementacao-offchain.md). O software de cadastro e cotas já está neste repositório; aprovação, hotel e operação real da IBITI seguem pendentes. A política de cotas foi confirmada pelo responsável do projeto em 11/09/2026: uma experiência por IBT em toda a emissão, sem renovação; só direitos livres acompanham transferências. O contrato v1 mantém contadores legados, sem uso no fluxo atual.

Este documento consolida as regras do ativo como valem hoje. As decisões originais do grupo (D1–D13, de
26/08/2026, revisadas em 28/08 e 02/09) estão registradas com data em [08](08-decisoes-e-pendencias.md). O
uso da experiência segue o formato de 10/09/2026, descrito em [03](03-uso-vinculado-a-pessoa.md).

## 1. O ativo em uma tabela

| Parâmetro | Valor | Situação |
|---|---|---|
| Nome · símbolo | IBIToken · IBT | nome oficial; símbolo é proposta |
| Padrão | ERC-20, **sem casas decimais** (indivisível) | decidido; ERC-721 avaliado e rejeitado |
| Rede | Ethereum; Sepolia para desenvolvimento e testes; mainnet como definitiva futura | decidido |
| Faces de cada unidade | membership (Passaporte IBITI) + fração do royalty **on-chain**; experiência de hospedagem **como direito da pessoa verificada** | formato vigente (03) |
| Emissão | **única, no deploy: 150 unidades**, teto imutável; sem mint e sem burn depois | decidido; 150 é hipótese do valuation |
| Reserva da IBITI | **50 unidades = 1/3 do supply = 5 dos 15 pontos do royalty**, fora de venda salvo decisão expressa; só pode diminuir | decidido |
| Unidades à venda | 100 (2/3 do supply = 10 dos 15 pontos) | decidido |
| Preço | fixo, igual para todos; referência **R$ 53.008,93** por unidade; captação máxima ≈ R$ 5,3 mi | hipótese do valuation |
| Teto por carteira | **20 unidades = 2/15 do supply = 2 dos 15 pontos**; carteira administrativa isenta | decidido |
| Validade | **4 anos: 01/01/2027 a 31/12/2030**; ao fim, as três faces se extinguem, inclusive o membership | decidido; piloto sem nova emissão |
| Royalty | **15% do faturamento bruto** do Glamping (diárias + alimentação + demais serviços), 100% tokenizado, fração igual por unidade | decidido; rubricas do bruto a confirmar |
| Apuração | **semestral**, 8 apurações em 4 anos; valor devido pro-rata ao saldo no momento do reporte | decidido |
| Pagamento | registro on-chain + depósito em stablecoin no reporte + saque pelo portador; sem stablecoin, liquidação em reais | decisão da v1, a ratificar |
| Transferência | só para carteira que **já tem saldo** (portanto já verificada); porta de entrada única = compra primária pela IBITI | decisão da v1; whitepaper ainda cita "lista aprovada" |
| Verificação | obrigatória para todos, feita pela IBITI fora da blockchain antes da compra | decidido |
| Governança | administração única da IBITI, carteira administrativa, troca em dois passos, sem renúncia, com pausa de emergência | decidido; pausa a ratificar |

## 2. Escassez, validade e fracionamento (o que o TAPI pede)

- **Escassez.** Emissão única com teto de 150. Não há segunda leva no piloto. Novas emissões após 2030
  são decisão futura da IBITI, condicionada à adoção, e não são prometidas.
- **Validade.** Quatro anos, vinculados ao prazo do contrato de royalties entre IBITI e empreendedor. A
  expiração é por data, não por destruição: após 31/12/2030 não há transferências, hospedagens nem novas
  apurações; a última apuração e os saques pendentes seguem possíveis.
- **Fracionamento.** Não existe. Cada unidade reúne inseparavelmente membership, royalty e o direito a
  uma hospedagem. Frações criariam posições só financeiras, sem sentido no contexto. A decisão anterior
  de token fracionável foi revertida em 28/08/2026.

## 3. Quem pode comprar e quem pode receber

Qualquer pessoa pode comprar, mas **todos passam pela verificação da IBITI**, que quer filtrar quem entra
como apoiador. A verificação acontece fora da blockchain, antes da compra primária, e vincula a pessoa à
carteira. **Colaboradores e produtores locais não recebem token**; são alcançados só indiretamente, pela
atividade econômica do território. Emissão administrativa para esses atores não é uma opção considerada.

Transferências entre membros são permitidas, só para carteiras que já detêm token (logo, já verificadas),
até o teto de 20 por carteira. Uma unidade cuja hospedagem já foi usada transfere normalmente e leva
consigo o membership e o royalty; o que acontece com hospedagens ainda não usadas está em aberto (ver 03).

## 4. Passaporte IBITI (membership)

É um **status derivado da posse**, não um segundo ativo. Nasce na compra, vive na carteira e viaja com o
token. Qualquer parceiro do território pode verificar a condição de membro consultando o contrato, sem
acesso a dado pessoal. Perda de chave ou sucessão: a IBITI **reemite** para uma nova carteira, revoga a
antiga e transfere ao herdeiro por processo fora da blockchain.

Benefícios reconhecidos pelo projeto: janelas exclusivas e prioridade de reserva; acesso a eventos e
rituais do território; experiências em outros empreendimentos do território; reconhecimento como apoiador
do projeto IBITI. Benefícios de marcas parceiras ficaram fora. A **escala de benefícios por quantidade de
unidades** (quem tem 1, 5, N) é direção em estudo, não decisão. A **agregação** (trocar cinco hospedagens
por uma experiência maior, por exemplo alugar um espaço do território) é ideia registrada, a detalhar.

## 5. Royalties

- **Base:** 15% do faturamento bruto do Glamping. A IBITI detém 15 pontos; cada unidade é 1/150 desses 15
  pontos (0,1 ponto por unidade na projeção).
- **Reserva:** a IBITI retém 5 dos 15 pontos (50 unidades). As unidades não vendidas ficam na carteira
  administrativa e recebem royalty como qualquer saldo.
- **Ciclo semestral:** o Glamping transfere a parcela da IBITI; o financeiro da IBITI apura, gera o
  relatório e publica o faturamento bruto no contrato com a carteira administrativa, junto com o hash do
  relatório. O contrato calcula os 15%, fotografa os saldos e registra o valor devido por carteira.
- **Pagamento:** com stablecoin configurada, o total devido é depositado no contrato na mesma transação e
  cada portador saca o que lhe cabe (na jornada assistida, o custodiante saca por ele). Sem stablecoin, a
  IBITI paga em reais e registra o pagamento no contrato. A stablecoin real está em aberto.
- **Renovação após 2030:** não prometida. A "reconversão de royalty em experiência" só existe como
  hipótese condicionada a uma continuidade que a IBITI decidirá.

## 6. Números do valuation (hipóteses declaradas pelos colegas)

| Item | Valor |
|---|---|
| Supply | 150 unidades (100 à venda + 50 reserva) |
| Preço por unidade | R$ 53.008,93 (valor presente dos royalties 2027–2030 a 20% a.a. de desconto ÷ 150) |
| Captação máxima | ≈ R$ 5,3 milhões |
| Royalty acumulado projetado | ≈ R$ 88.611 por unidade (~13,7% a.a. implícito, dentro do teto de 15% a.a.) |
| Operação projetada | 6 → 20 unidades de hospedagem; diária R$ 7.333 → R$ 9.760; ocupação 39%; consumo médio R$ 2.000 por hospedagem |

Todos a validar com Mariana Reis. O preço **não aparece** na landing nem nas páginas públicas; é
apresentado pela IBITI na conversa inicial, antes de qualquer compromisso.

## 7. Custódia: duas jornadas sobre o mesmo contrato

- **Assistida (principal):** a pessoa paga em reais, a IBITI (ou um custodiante a definir) guarda a
  carteira e opera transferências e saques em nome dela. Nada de blockchain aparece.
- **Expert:** a pessoa usa a própria carteira, recebe as unidades após a verificação e opera sozinha.

O custodiante da jornada assistida está em aberto.
