# IBIToken — guia para Deploy e Evidências Operacionais On-Chain

Material de passagem para o integrante responsável • 25/09/2026

Este guia explica o que executar, guardar e interpretar para produzir o artefato. É um documento de trabalho em português. A entrega do colega será um **PDF em inglês**, com evidências reais da versão efetivamente publicada em rede de testes. Este guia não é esse relatório final e não comprova um novo deploy.

A única entrega oficial já publicada é a **v1**. A próxima será a **v2**. O número “4” em arquivos, pacotes e registros representa uma revisão interna de desenvolvimento/testes, ainda em consolidação. Não renomear evidências antigas para fazê-las parecer evidências da nova versão.

## 1. Resultado esperado e pacote disponível

O leitor do relatório precisa conseguir identificar o contrato, reproduzir as verificações e compreender por que o comportamento observado corresponde ao modelo econômico. Uma captura de tela só é útil quando acompanhada de objetivo, estado anterior, operação, resultado e interpretação.

Arquivos que acompanham este guia:

- `docs/entrega/roteiro-minimo-relatorio-onchain-en.md`: estrutura mínima em inglês, com campos para preencher.
- `docs/entrega/registro-evidencias-modelo.csv`: índice vazio de evidências; não contém transações realizadas.
- `docs/decisoes/2026-09-25-pendencias-para-retomada.md`: limitações e decisões ainda abertas.
- `smart-contract/docs/guia-v4.md`: execução local e operação no Remix.
- `smart-contract/docs/validacao-v4.md`: registro de uma rodada anterior de validação, não um comprovante de deploy público.

Sugestão de extensão: seis a dez páginas de narrativa, ampliadas conforme a necessidade, com anexos para recibos e cálculos. Isso é uma recomendação de síntese, não uma exigência do professor. Os oito critérios de avaliação pedem consistência e análise, não quantidade de imagens.

## 2. O que o sistema atual faz

A emissão é única: **150 IBT indivisíveis**. A reserva inicial é de 50; a colocação inicial, de 100. Reduzir a reserva libera estoque para venda, sem emitir ou vender automaticamente. O limite de 20 vale para a soma das carteiras vinculadas à mesma pessoa. O vínculo usa identificador opaco; a identificação civil permanece no serviço externo.

Não há mercado secundário: transferências ordinárias entre participantes estão bloqueadas. A compra primária em stablecoin entrega os IBT e transfere o pagamento na mesma transação. Falha no pagamento desfaz a operação inteira. Isso não torna o banco de hospedagens atomicamente sincronizado; ele reconhece os eventos confirmados depois.

O preço de referência adotado é **R$ 34.874,14 por IBT**. No ensaio local, o equivalente numérico é expresso em tBRL fictício de seis casas decimais: `34874140000` unidades mínimas por IBT. Isso não estabelece conversibilidade, lastro ou pagamento comercial em reais. A moeda e o prestador da operação real continuam abertos.

A abertura é registrada uma vez, com referência documental, e inicia quatro anos civis de vigência e oito semestres de seis meses civis. Não existe uma data oficial de inauguração confirmada nos materiais verificados. Projeções financeiras não são anúncio de abertura. Cada apuração exige o encerramento do respectivo semestre.

Os royalties correspondem a 15% do faturamento informado, distribuídos segundo quantidade × tempo de posse em cada semestre, incluindo a tesouraria. O contrato exige financiamento do total devido na apuração e permite saque individual. Ele não verifica se o faturamento informado é verdadeiro.

A recuperação atual preserva saldo, recebíveis e histórico temporal da mesma pessoa. Exige anúncio, referência do caso e sete dias de espera, com destino restrito. Não é sucessão hereditária. A recuperação sem saldo é possível se houver royalties pendentes.

Fora da cadeia ficam cadastro, seleção, prazo de resposta, atendimento, custódia escolhida, hospedagens e cancelamentos manuais. Uma compra confirmada libera as cotas na mesma conta. Usar uma experiência não queima IBT nem reduz seu direito aos royalties.

## 3. Antes de executar: congelar a versão e o ambiente

Não capturar as evidências definitivas enquanto mudanças necessárias ainda estiverem em andamento. Governança conjunta, pausa seletiva e recuperação integrada ao atendimento são decisões aceitas ainda incompletas. O grupo precisa implementar e validar essas mudanças, ou explicitar a limitação no relatório e no memorando. Não descrevê-las como prontas.

Na versão escolhida para a entrega, guardar:

1. Commit, branch, data e situação de `git status --short`. Se houver alterações não commitadas, o commit sozinho não identifica a fonte executada.
2. Cópia exata das fontes e arquivos de dependências usados; manifesto SHA-256 dos arquivos. Não incluir `.env`, banco de pessoas, sessões ou chaves privadas.
3. Entrada e saída da compilação, ABI, bytecode, versão completa do compilador, configurações e argumentos do construtor.
4. Rede, chain ID, endereço do token, endereço/decimais da moeda de teste, conta publicadora e papéis de cada carteira.
5. Recibo da criação, bloco inicial e link do explorador. Não sobrescrever o registro histórico da v1.

Configuração do projeto: Node.js 24+, Solidity **0.8.34**, OpenZeppelin **5.6.1** vendorizada, EVM **Osaka**, otimizador habilitado com **200 runs** e **viaIR habilitado**. Não há Hardhat. Manter essas configurações no Remix; confirmar compatibilidade da rede escolhida antes de publicar.

O compilador aceita entrada JSON padronizada para explicitar fontes e configurações. Preservar essa entrada ajuda a reproduzir e verificar o código publicado. Referência: [Solidity — Using the Compiler](https://docs.soliditylang.org/en/v0.8.34/using-the-compiler.html).

Comandos a partir da raiz do repositório:

```bash
npm ci --prefix smart-contract
npm ci --prefix offchain
npm run build --prefix smart-contract
npm test --prefix smart-contract
npm test --prefix offchain
npm run typecheck --prefix smart-contract
npm run typecheck --prefix offchain
npm run package:remix --prefix smart-contract
```

Guardar os resultados efetivos da rodada final, inclusive data e revisão. Não copiar a contagem de testes de um documento antigo como se fosse a da fonte final. Testes locais são evidência complementar, não substituem a operação pública.

## 4. Publicação em rede de testes

Para aplicações, a documentação Ethereum recomenda Sepolia. Ela é a escolha coerente com o piloto histórico deste projeto; o guia não recomenda uma publicação comercial. Sepolia usa chain ID **11155111**. Anvil local usa **31337**. Referência: [Ethereum — Networks](https://ethereum.org/developers/docs/networks/).

Sequência no Remix:

1. Importar o pacote completo, incluindo `OpeningCalendar.sol`, bibliotecas e `mocks/MockStablecoin.sol`. Compilar com os parâmetros da seção anterior.
2. Selecionar a carteira e a rede de testes em Deploy & Run. Conferir a rede no provedor; obter ETH de teste para gas.
3. Preparar uma moeda de teste de seis decimais e registrar seu endereço. O valor legado em `scripts/01_publicar.js` é uma configuração histórica: não presumir que essa moeda serve para a nova execução sem verificar código, decimais e saldo disponível.
4. Em `01_publicar.js`, conferir `precoUnitario`, `stablecoinSepolia` e só então habilitar `permitirSepolia`. O script bloqueia Sepolia por padrão. Não trocar a moeda sem conferir as seis casas utilizadas pelo script.
5. Executar a publicação. O construtor usado pelo script é `(admin, 150, 0, 0, stablecoin)`. O endereço inicial de tesouraria é o mesmo do administrador, mas depois permanece separado das trocas de owner.
6. Preservar `deployments/remix-latest.json` com nome específico da execução. `contractVersion: 4` identifica a revisão técnica interna, não uma quarta entrega oficial.
7. Conferir criação, código e parâmetros pelo explorador. Verificar a fonte com as configurações e argumentos exatos; a verificação aumenta a transparência, mas não equivale a auditoria de segurança.

O script cria e abastece a moeda somente no ambiente local; os 1.000 tBRL iniciais vão para o administrador. Isso **não financia um comprador**, cujo custo mínimo é de 34.874,14 tBRL por IBT. Na rede pública, preparar explicitamente moeda fictícia suficiente em cada carteira de teste, sem usar recursos reais.

Referência de interface: [Remix — Deploy & Run Transactions](https://remix-ide.readthedocs.io/en/latest/udapp.html). A fonte do projeto e o resultado observado prevalecem sobre imagens de versões diferentes da ferramenta.

## 5. Carteiras e roteiro operacional

Usar somente identidades sintéticas e carteiras de teste. Papéis sugeridos: A administrador/tesouraria inicial; B comprador; B2 outra carteira da mesma pessoa; C outro participante; R carteira de recuperação; A2 sucessor administrativo. Não publicar dados civis ou reutilizar chaves Anvil publicamente conhecidas na rede pública.

`02_operar.js` lê o registro da publicação e confere a rede e o código. Selecionar o signatário correto para cada operação:

- **Abertura:** A usa ação `abertura`, com data ISO 8601 com fuso e referência do marco. A data precisa já ter ocorrido. A transação é irreversível; verificar os oito `periodEnd` depois.
- **Cadastro:** A usa `registrar`, com carteira e identificador opaco `bytes32`. B e B2 recebem o mesmo identificador para testar o limite pessoal. C recebe outro. Não usar CPF nem hash simples de CPF como identificador público.
- **Compra:** B possui moeda de teste e ETH para gas. A ação `compra` primeiro aprova a moeda ao contrato e depois chama `buyPrimary`. São duas transações distintas; a entrega do IBT e o débito do preço estão juntos na segunda. Usar referência de venda única por comprador.
- **Apuração:** depois do fechamento, A usa `reporte`; aprova o valor necessário e informa receita e referência do relatório. Guardar o documento sintético que sustenta a receita, sua unidade e método de hash.
- **Saque:** B usa `saque` para um período apurado e confere crédito da moeda e redução de recebíveis. Saque não transfere IBT.
- **Recuperação:** A anuncia com `anunciar-recuperacao`. Ler o prazo registrado. `cancelar-recuperacao` pode ser chamado por A ou pela carteira antiga; um chamado externo sozinho não faz isso. `recuperacao` só executa após sete dias.

O script usa `ethers.id(config.referencia)`, isto é, hash do texto da referência. Isso não é automaticamente um hash dos bytes de um PDF. Se o relatório precisar de verificação de integridade, definir e registrar como o arquivo, seu hash e essa referência se relacionam. Não afirmar autenticidade ou auditoria financeira só porque existe um hash.

Funções não expostas pelo roteiro de ações, como `reduceReserve`, `transferOwnership` e `acceptOwnership`, podem ser chamadas no painel do contrato compilado. Manter a mesma fonte/ABI e registrar seus recibos da mesma forma.

## 6. Matriz de evidências recomendadas

Esta matriz é um roteiro adaptado ao IBIToken. Não é uma lista de requisitos adicionais inventados para a disciplina. Priorizar evidências que demonstrem publicação, compra, restrições, rateio e os limites do sistema.

### E01 — Publicação e estado inicial

Guardar criação, endereço, chain ID, bloco e código verificado. Ler `totalSupply = 150`, `decimals = 0`, reserva 50, teto 20, `treasury`, `owner`, moeda e preço. Antes da abertura, datas são zero e a compra deve ser recusada. Interpretar: oferta fixa e condições explícitas para iniciar a operação.

### E02 — Abertura e calendário

Registrar uma abertura declaradamente de teste; conferir os oito encerramentos e os quatro anos civis. Mostrar que uma segunda abertura ou apuração antecipada é rejeitada. Interpretar: o administrador não pode consumir oito semestres antes de seus encerramentos nem reiniciar a vigência.

### E03 — Compra primária paga

Mostrar saldo e allowance da moeda, estoque e saldo IBT antes/depois. Relacionar `PrimaryPurchase`, `PrimaryPayment` e eventos `Transfer` ao recibo. Conferir preço × quantidade, saída da tesouraria e entrega ao comprador. Demonstrar uma compra sem fundos/allowance e ausência de entrega parcial.

### E04 — Teto por pessoa e ausência de revenda

Comprar em B e B2, vinculadas à mesma pessoa, e tentar ultrapassar 20 no agregado. Tentar `transfer` e `transferFrom` entre participantes, inclusive com allowance. As operações devem falhar sem alterar saldos. A recuperação é uma exceção controlada, não um mercado secundário disfarçado.

### E05 — Receita, tempo de posse e recebimento

Fazer duas compras em instantes diferentes, guardar os timestamps e reproduzir o cálculo da próxima seção. Após fechamento, registrar receita financiada e sacar o recebível. Conferir `periodInfo`, `RoyaltyRegistered`, saldo do contrato e saldo do beneficiário. Novo saque sem recebível deve falhar. Não apresentar a receita sintética como receita real do Glamping.

### E06 — Continuidade administrativa e reserva

Registrar `transferOwnership` e o aceite por A2. Conferir que tesouraria, saldo administrativo e reserva permanecem no endereço institucional e que a compra continua funcionando. Reduzir a reserva em uma execução dedicada e demonstrar a mudança do estoque vendável sem emissão. Explicar o poder ainda concentrado do owner.

### E07 — Recuperação e contestação

Registrar anúncio, destino, referência e `executeAfter`. Tentar destino administrativo e destino de outra pessoa; comprovar as recusas. Cancelar um anúncio e conferir que ele não pode ser executado. Execução completa exige sete dias reais na rede pública. Testar também o caso sem saldo e com recebíveis em ambiente local, rotulado como tal.

### E08 — Pausa e integração com experiências

Mostrar quais operações a pausa atual bloqueia e que ela é global, inclusive para saques. Retomar e verificar continuidade. Como evidência complementar, mostrar que compra confirmada gera cotas no portal e que reservar hospedagem altera o livro externo sem queimar tokens. Captura do portal não substitui o recibo da compra.

## 7. Demonstrar o rateio com um cálculo verificável

Usar as unidades mínimas da stablecoin e os timestamps dos blocos. Seja G a receita informada; R = piso(G × 1500 / 10000). Para o semestre, D = `periodEnd(p) − periodStart(p)`. Para uma carteira, W é a soma de cada saldo multiplicado pelos segundos em que aquele saldo valeu dentro do período.

O recebível individual é **piso(R × W / (150 × D))**. A reserva participa do mesmo denominador. Uma compra no último dia contribui apenas pelo tempo restante; não recebe como um token mantido durante todo o semestre. Recuperação preserva a participação acumulada da pessoa.

Exemplo para substituir por dados observados: uma carteira compra 5 IBT no instante t1 e mais 1 no instante t2. Com t1 e t2 dentro do semestre, W = 5 × (fim − t1) + 1 × (fim − t2). Usar os timestamps exatos de inclusão das transações; não assumir que seis meses equivalem sempre a 180 dias.

O contrato deposita a soma dos valores individualmente devidos, `totalDue`. Por arredondamento para baixo, ela pode ser menor que R; essa diferença não é automaticamente depositada como recebível. Mostrar a reconciliação e registrar que a destinação econômica dos arredondamentos ainda precisa ser formalizada. Não confundir royalty de 15% da receita com retorno de 15% sobre o investimento.

O relatório de faturamento é responsabilidade externa. A blockchain torna verificável o valor declarado, o cálculo e o depósito; não transforma uma declaração incorreta em receita verdadeira.

## 8. Como lidar com o tempo sem falsear evidências

Em Anvil, os testes podem avançar o relógio. Em Sepolia, o grupo não pode acelerar seis meses ou sete dias. Não mudar as constantes do contrato final apenas para obter uma demonstração rápida e depois afirmar que se testou a mesma versão.

Caminho simples: executar em Sepolia publicação, abertura de teste, cadastro, compra, recusas e anúncio/cancelamento de recuperação. Complementar com os testes locais de semestre completo e recuperação madura, identificando a rede de cada resultado e a cobertura pública que ficou incompleta.

Se for necessário demonstrar apuração também na rede pública, uma **instância exclusiva de testes** pode registrar abertura simulada no passado, de modo que o primeiro encerramento ocorra pouco depois das compras de teste. Escolher a data com antecedência, conferir `periodEnd(1)` e esperar o relógio real alcançar o encerramento. Isso mantém semestres civis do código, mas é uma simulação do marco de abertura, não uma inauguração real nem seis meses de operação observados.

Nesse cenário, registrar que o contrato contabiliza o estoque inicial da tesouraria desde a abertura informada, inclusive antes da publicação. Os compradores acumulam apenas o tempo efetivo após suas compras. Explicitar essa hipótese para não interpretar o resultado como medição histórica real.

Para recuperação completa na rede pública, planejar o anúncio pelo menos sete dias antes da captura final. Se não houver esse tempo, apresentar o anúncio, a recusa antecipada e o cancelamento públicos, com a execução completa apenas nos testes locais. Não esconder a lacuna de cobertura.

## 9. O que salvar em cada operação

Cada evidência deve ter um identificador E01, E02 etc. e um pequeno registro:

- Objetivo, rede, endereço, ator/papel, função, argumentos e unidade dos valores.
- Estado anterior com número/hash do bloco; estado posterior com bloco correspondente.
- Hash e link da transação, status do recibo, timestamp UTC, eventos relevantes e seus argumentos.
- `gasUsed`, preço efetivo do gas e custo: gasUsed × effectiveGasPrice / 10^18, em ETH de teste. Não confundir com preço do IBT ou despesa comercial em reais.
- Resultado esperado, observado e interpretação; falhas ou divergências precisam ser explicadas.
- Nome dos arquivos brutos e caminho da captura, com dados pessoais e segredos excluídos.

Uma leitura por `eth_call` não é transação nem consome gas pago. Uma rejeição em `estimateGas` pode não ter hash e não estar registrada na cadeia. Rotular como simulação/chamada rejeitada. Uma transação efetivamente incluída e revertida tem recibo de falha e pode consumir gas; nesse caso há hash público. Não inventar hashes para erros pré-envio.

Confirmar recibo não é sinônimo de finalização. O sincronizador deste projeto usa o bloco `finalized` em Sepolia e `latest` em Anvil; a espera no portal pode ser maior na rede pública. Conferir cadeia canônica e estado do sincronizador antes de afirmar que as cotas foram liberadas. Não reduzir essa proteção para acelerar a filmagem.

Sugestão de pasta: `evidencias/v2/<rede>/<execucao>/`, com `manifesto`, `recibos`, `estados`, `capturas`, `calculos` e `relatorios-sinteticos`. O índice CSV fornecido serve para localizar esses arquivos. Preservar os originais; usar recortes de imagem apenas para legibilidade, sem alterar resultados.

## 10. Análise crítica e relação com a avaliação

**Operacionalização e coerência:** E01–E05 devem conectar código publicado, transações e regras observadas. A compra tem pagamento e entrega atômicos, enquanto a liberação das cotas depende de sincronização externa.

**Compreensão da infraestrutura:** diferenciar assinatura, envio, inclusão, recibo, finalização e leitura. Explicar gas, irreversibilidade, chamadas revertidas e por que os timestamps importam no rateio.

**Organização e clareza:** escolher poucas capturas legíveis, cada uma com contexto, resultado e interpretação. Anexar recibos/links para conferência independente. A narrativa deve permanecer compreensível sem conhecer esta conversa.

**Interpretação crítica:** discutir poderes do administrador, veracidade da receita, limites de identidade, custódia, pausas, cobertura de testes e disponibilidade hoteleira. Não apresentar KYC externo, multisig 2 de 3 ou governança por pilares como implementados na fonte atual.

**Conexão econômica:** explicar indivisibilidade, cap pessoal, denominador 150, tempo de posse, reserva, preço versus royalty, oito semestres e consumo off-chain de experiências. O token não representa promessa de valorização ou revenda.

**Maturidade e trajetória:** comparar v1 e futura v2 com mudanças verificáveis: limite por pessoa, calendário, rateio por tempo, fim do mercado secundário, tesouraria separada e recuperação com espera. Relacionar cada mudança à proteção operacional pretendida, sem atribuir as funções novas ao contrato histórico.

Isso cobre os oito critérios: operacionalização; coerência código/operação; compreensão da infraestrutura; organização das evidências; análise crítica; alinhamento econômico; clareza e maturidade; relação entre técnica e decisões do projeto.

## 11. Limites que precisam aparecer na entrega

A fonte atual ainda concentra poderes em um owner. O portal separa perfis, mas isso não equivale a exigir duas assinaturas no contrato. A tesouraria é um endereço estável; controle 2 de 3 não foi estabelecido. A pausa é global. Contestação de uma pessoa sem chave depende de ação autorizada que cancele o anúncio on-chain.

Identidade híbrida real, cofre institucional de chaves, MFA, recuperação de conta, notificações, pagamentos comerciais e inventário hoteleiro continuam dependentes de integração. A moeda tBRL é um mock; a abertura da demo e seu faturamento são sintéticos. A cópia histórica do whitepaper pode divergir do modelo atual.

Identificadores opacos reduzem exposição direta de dados civis, mas transações e relações entre carteiras continuam públicas. Referências e hashes não provam veracidade dos documentos. Não divulgar dossiês de participantes nas evidências.

O procedimento de recuperação rejeita destino com código de contrato; uma futura carteira institucional inteligente deve ser compatibilizada com essa restrição antes de prometer suporte. Sucessão entre pessoas não está implementada. Esses são limites a explicar ou corrigir, não detalhes a omitir.

## 12. Checklist final do responsável

- A versão oficial e a revisão técnica estão claramente distinguidas; endereço histórico não aparece como novo.
- A fonte congelada corresponde ao contrato observado, com compilação e argumentos reproduzíveis.
- Rede, endereço, moeda, contas de teste e marco de abertura simulado estão identificados.
- Há criação pública e interações efetivamente executadas, com recibos, links e estados comparáveis.
- As recusas distinguem simulação de transação revertida; as evidências locais estão rotuladas.
- Rateio e arredondamento foram recalculados com timestamps e unidades corretos.
- As capturas têm legenda e interpretação; todos os números se apoiam em registros preservados.
- Limitações técnicas, integração off-chain e decisões pendentes estão explícitas e conciliadas com o memorando.
- O PDF final está em inglês, legível e com links funcionais; nenhum segredo ou dado civil foi incluído.
- Outra pessoa do grupo conferiu a cadeia fonte → operação → evidência → conclusão antes da entrega.

## 13. Roteiro mínimo para redigir em inglês

1. **Purpose and scope:** versão, rede, objetivo e condição acadêmica.
2. **System and deployment:** componentes, responsabilidades, configurações e identidade do contrato.
3. **Operational evidence:** publicação, compra, proteção por pessoa/circulação, calendário e royalties; recuperação/governança conforme cobertura obtida.
4. **Economic reconciliation:** preço pago, token-segundos, denominador e recebíveis.
5. **Critical interpretation:** rastreabilidade, persistência, finalização, gas, confiança externa e limitações.
6. **Evolution and limitations:** o que mudou da v1 e o que permanece incompleto.
7. **Conclusion and evidence index:** conclusões proporcionais aos testes realizados e links para conferir cada afirmação.

O arquivo `roteiro-minimo-relatorio-onchain-en.md` transforma esse roteiro em um esqueleto editável. Preencher todos os campos com resultados reais; remover seções sem evidência ou declarar sua cobertura como incompleta.
