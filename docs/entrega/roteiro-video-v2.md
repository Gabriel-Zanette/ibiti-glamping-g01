# IBIToken — roteiro de planejamento da entrega v2

**Para dublar o MP4 entregue, usar [narração sincronizada](../../output/video/ibitoken-v2/narracao-sincronizada.md).** Este documento preserva o planejamento; suas cenas públicas propostas não representam automaticamente cenas executadas. No MP4 atual, publicação/verificação são Sepolia; compras, saques e recuperação foram gravados em Anvil.

Roteiro ajustado a pedido de Gabriel. Vídeo sem voz; as falas abaixo são sugestões para a dublagem posterior. Gravação no Google Chrome do usuário, com confirmações de transação feitas pelo próprio usuário na MetaMask.

## Identificação e continuidade

A próxima entrega oficial é **v2**. A fonte usa `contractVersion: 4` para identificar a revisão interna de desenvolvimento; isso não a transforma em uma quarta entrega oficial. O roteiro antigo intitulado “v3” foi substituído.

Separar visualmente **SEPOLIA · rede pública de testes** de **ANVIL · ensaio local com avanço de tempo**. Os hashes, blocos e endereços precisam vir da execução mostrada. Publicação histórica e seu `exact_match` não comprovam a fonte atual. Não preencher cenas pendentes com confirmações ou recibos inventados.

## Cenas e falas sugeridas

Os tempos são reservas de edição, não marcações finais. A montagem e as legendas receberão os tempos efetivos dos trechos capturados.

| Cena | Tempo estimado | Ação e imagem | Fala sugerida para dublagem |
| --- | --- | --- | --- |
| 1. Apresentação | 12 s | Título: IBIToken — demonstração da entrega v2. Indicar as duas redes usadas. | “Vamos acompanhar a publicação e as operações do IBIToken. As transações públicas usam a Sepolia. Para demonstrar um semestre completo, usamos também uma rede local identificada na tela.” |
| 2. Regras no código | 25 s | Remix: `IBIToken.sol`, emissão 150 no script/construtor, reserva de um terço, teto de 20 por carteira e pessoa, `RECOVERY_DELAY = 7 days`. | “São 150 IBT indivisíveis, com reserva inicial de 50. O limite de 20 vale para a soma das carteiras registradas da mesma pessoa. O contrato não permite emissão adicional.” |
| 3. Papéis e contas | 20 s | MetaMask: ADMIN, USER1, USER2. Mostrar somente nomes e endereços públicos. | “ADMIN inicia como administrador e tesouraria. USER1 e USER2 representam participantes distintos. A tesouraria permanece separada do cargo de administrador, mesmo quando o responsável muda.” |
| 4. Compilação e publicação | 30 s | Solidity 0.8.34, Osaka, otimizador 200, viaIR. Abrir `01_publicar.js`, confirmar Sepolia. Usuário confirma implantação e configuração de preço. | “Publicamos a fonte atual pelo Remix. A MetaMask apresenta cada autorização. O preço de demonstração é 34.874,14 tBRL por IBT. tBRL é uma moeda fictícia de teste.” |
| 5. Recibo | 18 s | Console e JSON: rede, endereço, hash, bloco, status. | “O recibo identifica a transação, o contrato e o bloco em que ela foi incluída. Esses dados permitem que outra pessoa confira a mesma operação de forma independente.” |
| 6. Código público | 22 s | Etherscan do novo endereço; Sourcify do MESMO endereço, somente após verificar `exact_match`. | “Qualquer pessoa pode consultar as transações e examinar o código publicado. A correspondência exata relaciona as fontes compiladas ao bytecode implantado; ela não equivale a uma auditoria de segurança.” |
| 7. Abertura e cadastro | 30 s | Na instância acadêmica, registrar uma abertura expressamente simulada. ADMIN registra USER1 e USER2 com identificadores sintéticos opacos. Mostrar `personOf`. | “A vigência começa no marco de abertura registrado e dura quatro anos, divididos em oito semestres. Aqui, a abertura é simulada para o ensaio. A identificação pessoal acontece fora da blockchain; na rede fica apenas um identificador opaco.” |
| 8. Compra de USER1 | 30 s | Selecionar USER1. Aprovar somente o custo da compra na moeda de teste; chamar `buyPrimary`. Mostrar saldos antes/depois e eventos da transação. | “Primeiro, o participante autoriza o gasto da moeda de teste. Na transação seguinte, o pagamento e a entrega dos IBT acontecem juntos: se a compra falhar, nenhum dos dois movimentos é concluído.” |
| 9. Compra de USER2 | 20 s | Repetir com USER2, outra referência de pedido, e mostrar os saldos agregados por pessoa. | “O segundo participante segue o mesmo processo. O cadastro, o limite por pessoa, a reserva e a referência de compra são conferidos pelo contrato.” |
| 10. Restrições | 25 s | Tentar USER1 → USER2, ambos cadastrados: rejeição por ausência de transferências ordinárias. Separadamente, simular compra por endereço não cadastrado e decodificar a rejeição. | “O modelo atual não possui mercado secundário. Mesmo dois participantes cadastrados não podem transferir IBT livremente. Uma compra por carteira sem cadastro também é rejeitada, por uma regra distinta.” |
| 11. Transição para o ensaio temporal | 12 s | Cartela persistente: ANVIL · rede local · tempo avançado somente no teste. Mostrar chain ID 31337. | “Para observar meses de participação sem esperar meses reais, passamos agora a uma instância local do mesmo código. Nenhum relógio da Sepolia foi alterado.” |
| 12. Tempo de posse | 35 s | USER1 compra 2 IBT no começo do semestre; USER2 compra 2 na metade exata. Mostrar tempo acumulado, duração e fórmula. | “Os royalties consideram quantidade e tempo. Com dois tokens durante todo o semestre, USER1 acumula o dobro da participação de USER2, que comprou a mesma quantidade na metade. Comprar perto do fechamento não dá direito a um semestre completo.” |
| 13. Apuração financiada | 25 s | Antes do fim: rejeição. Avançar apenas Anvil até `periodEnd(1)`. ADMIN informa faturamento sintético de 150.000 tBRL, aprova e chama `reportRevenue`. | “O contrato impede a apuração antecipada. Depois do fechamento, aplica 15% ao faturamento informado e financia as parcelas na mesma transação. A blockchain verifica o cálculo e o depósito, mas não comprova que o faturamento informado é verdadeiro.” |
| 14. Saques individuais | 25 s | Mostrar parcelas esperadas e efetivas: USER1 300 tBRL e USER2 150 tBRL no exemplo temporal exato. Sacar com cada conta; verificar recebível zerado e impossibilidade de saque repetido. | “Cada participante saca a sua parcela. Neste exemplo controlado, USER1 recebe 300 tBRL e USER2 recebe 150. O denominador inclui os 150 tokens e a duração do semestre; a tesouraria também participa do rateio.” |
| 15. Recuperação | 30 s | Anunciar USER1 → nova carteira vazia da MESMA pessoa. Mostrar prazo de sete dias; tentativa imediata rejeitada; cancelar. Preferir cena Sepolia, se executada; identificar local quando aplicável. | “A recuperação de acesso exige anúncio e espera de sete dias. O destino não pode ser a tesouraria ou outro titular. A execução antecipada é barrada e o pedido pode ser cancelado. A integração completa do atendimento e da contestação ainda está em desenvolvimento.” |
| 16. Evidências e estado final | 30 s | Eventos e recibos das operações Sepolia no explorador; coletor JSON separado por rede. Conferir oferta, reserva, saldos, períodos, recebíveis e recuperação cancelada. | “Os eventos, recibos e estados finais formam uma trilha verificável. O arquivo de evidências identifica a rede de cada resultado e distingue uma rejeição simulada de uma transação efetivamente minerada.” |
| 17. Limitações | 25 s | Cartela curta: testnet; abertura simulada; tempo local; KYC/faturamento externos; governança em evolução. | “Esta é uma demonstração acadêmica. tBRL não é dinheiro real, a data usada não anuncia a inauguração e o tempo foi avançado apenas localmente. Identidade e receita dependem de informação externa. Governança por pilares, pausa seletiva e custódia institucional continuam em aprimoramento.” |

## Orientação da edição

- Sem locução, música ou captação de microfone.
- Mostrar o cursor e destacar apenas o controle ou resultado relevante; ampliar campos pequenos sem esconder a rede ou o endereço.
- Usar legendas curtas de ação: “Selecionar USER1”, “Autorizar tBRL”, “Confirmar compra”, “Conferir saldo”. As falas completas ficam neste documento.
- Cortar esperas de carregamento/confirmação; indicar o salto de edição quando necessário. Não representar uma assinatura do usuário como aprovação automática.
- A abertura é simulada em uma instância acadêmica. Nunca apresentá-la como fato oficial do Glamping.
- Uma consulta `staticCall` ou falha na estimativa de gas é uma rejeição sem transação minerada; não atribuir a ela hash ou gas pago.
- O cancelamento da recuperação pode ser demonstrado imediatamente. O atendimento externo não está integrado de ponta a ponta; não prometer contestação automatizada ou dupla aprovação já implantada.
- Os valores de 300/150 tBRL só devem aparecer se os recibos do ensaio confirmarem compras nos instantes exatos. Usar os valores medidos caso os instantes mudem.

## Correções em relação ao roteiro recebido

1. “v3” passa a “entrega oficial v2”, com revisão interna 4 explicitada apenas como referência técnica.
2. A transferência secundária bem-sucedida é substituída pela rejeição deliberada.
3. Royalties passam de fotografia do saldo para quantidade × tempo no semestre.
4. Recuperação passa de 48 horas para sete dias.
5. O calendário fixo 2025–2028 é substituído por quatro anos desde a abertura; datas do ensaio são identificadas como sintéticas.
6. Publicação e `exact_match` históricos não podem ser reutilizados como prova da nova fonte.
7. Confirmação humana na MetaMask, legendas de ação e guia de dublagem substituem qualquer voz gerada.
