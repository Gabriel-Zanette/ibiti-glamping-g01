# IBIToken — fontes Remix para a v2 em preparação

Revisão técnica interna v4; somente a v1 oficial foi publicada. Importar contracts/, scripts/ e tests/ juntos. Solidity 0.8.34, EVM Osaka, otimizador 200, viaIR habilitado. Bibliotecas OpenZeppelin 5.6.1 vendorizadas.

Compilar IBIToken.sol e mocks/MockStablecoin.sol. O script 01_publicar.js começa em rede local e bloqueia Sepolia por padrão. Conferir rede, moeda e preço antes de qualquer publicação. 02_operar.js usa o registro gerado pela publicação. Registrar a abertura simulada uma vez antes de comprar. Recuperação exige sete dias; não é possível acelerar a rede pública.

Este pacote é somente para o Remix. A aplicação e os testes de integração exigem o ZIP IBITI-Implementacao-v2.zip, que preserva smart-contract/, offchain/ e a landing como módulos irmãos.

Governança conjunta, pausa seletiva e recuperação integrada continuam pendentes. Não atribuir as novas funções a endereços históricos.
