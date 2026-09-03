import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

/**
 * Deploy de DEMONSTRAÇÃO (rede local ou Sepolia): implanta uma stablecoin de teste (tBRL, 6 casas),
 * o IBIToken já apontando para ela, e cunha saldo de tBRL para a carteira administrativa poder
 * depositar os royalties nos reportes. A validade começa no deploy, para que resgates possam ser
 * demonstrados imediatamente, e termina 4 anos depois.
 */
const FOUR_YEARS = 1461n * 24n * 60n * 60n;

export default buildModule("IBITokenSepoliaDemoModule", (m) => {
  const admin = m.getParameter("admin", m.getAccount(0));
  const emissionCap = m.getParameter("emissionCap", 150n);
  // Datas fixas (determinísticas, para o Ignition reconciliar reexecuções): validade já iniciada.
  const validFrom = m.getParameter("validFrom", 1788220800n); // 2026-09-01T00:00:00Z
  const validUntil = m.getParameter("validUntil", 1788220800n + FOUR_YEARS);
  const initialStablecoinSupply = m.getParameter("initialStablecoinSupply", 100_000_000_000_000n); // 100 milhões de tBRL

  const stablecoin = m.contract("MockStablecoin", ["Stablecoin de Teste", "tBRL", 6]);
  const token = m.contract("IBIToken", [admin, emissionCap, validFrom, validUntil, stablecoin]);

  m.call(stablecoin, "mint", [admin, initialStablecoinSupply]);

  return { stablecoin, token };
});
