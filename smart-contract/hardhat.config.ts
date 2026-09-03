import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import { configVariable, defineConfig } from "hardhat/config";

/**
 * Configuração do projeto IBIToken (Hardhat 3).
 *
 * - Perfil `default`: compilação rápida para desenvolvimento e testes.
 * - Perfil `production`: otimizador ligado, usado no deploy em Sepolia
 *   (`npx hardhat ignition deploy ... --network sepolia` já usa este perfil).
 * - Rede `sepolia`: os segredos são lidos de variáveis de configuração —
 *   keystore do Hardhat (`npx hardhat keystore set SEPOLIA_RPC_URL`) ou
 *   variáveis de ambiente com o mesmo nome (ver .env.example).
 */
export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.34",
      },
      production: {
        version: "0.8.34",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
  },
  verify: {
    etherscan: {
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
});
