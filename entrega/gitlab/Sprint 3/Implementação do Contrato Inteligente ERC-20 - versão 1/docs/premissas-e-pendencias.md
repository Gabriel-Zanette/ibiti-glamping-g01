# Premissas e pendências

- A v2 usa Remix, Solidity 0.8.34, Osaka e OpenZeppelin 5.6.1. Testes locais usam solc, Anvil 1.7.1, ethers e Node 24. A orientação recebida em 11/09/2026 exclui Hardhat.
- A v2 está publicada na Sepolia em `0xaA6C2902A7f50Dd8C4E8a68de67EA97817Aac030`, bloco 11684811, com recibo confirmado e correspondência exata no Sourcify. A v1 continua histórica; não há migração automática.
- O responsável confirmou `unused-first-v1`: uma experiência por IBT em toda a emissão, sem renovação e com circulação apenas de direitos livres. A experiência é de 3 noites para até 5 pessoas, com serviços comuns de hospedagem. Cancelamento elegível restitui a mesma cota; antecedência e tratamento tardio/no-show estão em fechamento. O backend ainda não impõe duração, hóspedes ou prazo. Benefícios adicionais e sucessão exigem especificação própria.
- A verificação ocorre antes da compra, sob responsabilidade da IBITI. Provedor KYC, critérios, custódia, disponibilidade do hotel, apuração contábil e conversão fiat permanecem fora da implementação acadêmica.
- Valor da oferta, stablecoin real, datas econômicas 2027–2030 e infraestrutura de produção não são aprovados automaticamente pelos parâmetros de demonstração.
- O contrato limita posse por carteira; o serviço externo agrega o teto por pessoa. A assinatura de uma carteira não comprova identidade civil.
- Publicação do código no GitLab da disciplina é uma etapa distinta de deploy na Sepolia. Nenhum push é feito por compilar ou gerar o ZIP.
