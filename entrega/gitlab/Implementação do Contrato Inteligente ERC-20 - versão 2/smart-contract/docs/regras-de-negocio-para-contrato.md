# Regras executáveis — versão técnica 3 / Parte 2

| Regra | Implementação |
| --- | --- |
| Emissão única | Construtor exige 150; zero decimais; sem mint/burn público |
| Reserva | 50 na tesouraria; piso apenas pode diminuir |
| Identidade | registerWallet exige owner; endereço vinculado uma única vez a bytes32 não nulo |
| Limite | 20 por pessoa agregada e por carteira; tesouraria é a única isenta |
| Compra | Stablecoin: buyPrimary pelo comprador, preço fixado uma vez, pagamento e entrega atômicos; sem stablecoin: primaryPurchase administrativo |
| Entrada | Compra primária para carteira registrada; secundária apenas para carteira registrada já com saldo; retorno à tesouraria permitido |
| Estoque | Transfer/transferFrom da tesouraria não contornam compra |
| Calendário | Jan–Jun/Jul–Dez UTC por quatro anos; validFrom em 1º de janeiro; validUntil último segundo do quarto ano |
| Apuração | Sequencial, até oito, só a partir do primeiro segundo após fechamento; atrasos permitidos |
| Royalty | 15% do bruto informado, pro rata sobre 150, inclui estoque/reserva, fotografia no reporte |
| Arredondamento | Piso inteiro de cada parcela; deposita somente soma devidos |
| Pagamento | Funding atômico, saque individual e nonReentrant; registra externo somente para período sem stablecoin |
| Recuperação | requestRecovery → espera 48h → reissue; cancelRecovery por origem/owner mesmo na pausa |
| Destino de recuperação | Vazio, sem recebíveis, sem código, sem vínculo estrangeiro; não tesouraria, owner ou pendingOwner |
| Preservação | Mantém pessoa e total de 150; move recebíveis mesmo sem IBT/após prazo; conserva pagos históricos |
| Troca de owner | Ownable2Step; mantém tesouraria; incrementa geração e invalida anúncios antigos |
| Pausa/expiração | Pausa circulação, compra, reporte, execução de recuperação e pagamento; expiração bloqueia circulação, preserva obrigações e recuperação |
| Hospedagem | Livro externo unused-first-v1; não há markRedeemed, NFT ou queima por uso |

Os vínculos são pseudônimos públicos correlacionáveis, não anonimato garantido. A operação deve atribuir o mesmo identificador à mesma pessoa e guardar a prova civil fora da cadeia. A assinatura da carteira e o approve ERC-20 têm propósitos distintos.

A API prepara o registro para assinatura administrativa; não tem chave privada e não transmite esse ato. O indexador concilia vínculos e bloqueia hospedagens se o cadastro divergir do contrato ou houver recuperação pendente. A recuperação preserva cotas e pedidos da mesma pessoa, inclusive com zero IBT.

O preço de teste de 37.055,19 tBRL usa seis decimais e é parâmetro fixado uma vez. Não modifica o valuation de precisão integral da planilha. Exemplos temporais de testes usam janela demonstrativa 2025–2028; scripts de publicação usam por padrão 2027–2030.
