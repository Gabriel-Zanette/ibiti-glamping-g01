import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deploy "de referência" do IBIToken com os parâmetros do modelo do whitepaper:
 *  - emissão única de 150 unidades (reserva 50 · teto 20 por carteira, derivados no contrato);
 *  - validade de 4 anos: 2027-01-01 00:00:00 UTC → 2030-12-31 23:59:59 UTC (8 semestres);
 *  - sem stablecoin configurada (royalties registrados on-chain, liquidação em reais fora da chain;
 *    a IBITI pode configurar a stablecoin depois com `setStablecoin`).
 *
 * Todos os valores podem ser sobrescritos com --parameters (ver docs/guia-de-execucao.md).
 */
export default buildModule("IBITokenModule", (m) => {
  const admin = m.getParameter("admin", m.getAccount(0));
  const emissionCap = m.getParameter("emissionCap", 150n);
  const validFrom = m.getParameter("validFrom", 1798761600n); // 2027-01-01T00:00:00Z
  const validUntil = m.getParameter("validUntil", 1924991999n); // 2030-12-31T23:59:59Z
  const stablecoin = m.getParameter("stablecoin", "0x0000000000000000000000000000000000000000");

  const token = m.contract("IBIToken", [admin, emissionCap, validFrom, validUntil, stablecoin]);

  return { token };
});
