import { Contract, Interface, ZeroAddress, formatUnits } from "ethers";
import type { Provider } from "ethers";
import { ensure, address } from "./ledger.ts";
import type { ChainSync } from "./chain.ts";
const ABI = [
  "function primarySaleUsed(address,bytes32) view returns(bool)",
  "function stablecoin() view returns(address)",
  "function primaryUnitPrice() view returns(uint256)",
  "function saleableUnits() view returns(uint256)",
  "function personOf(address) view returns(bytes32)",
  "function personBalance(bytes32) view returns(uint256)",
  "function buyPrimary(uint256,bytes32)",
  "event PrimaryPurchase(address indexed to,uint256 units,bytes32 saleRef)",
  "event PrimaryPayment(address indexed buyer,uint256 amount)",
];
const ERC20 = [
  "function decimals() view returns(uint8)",
  "function symbol() view returns(string)",
  "function balanceOf(address) view returns(uint256)",
  "function approve(address,uint256) returns(bool)",
];
export type Quote = {
  chainId: number;
  from: string;
  to: string;
  data: string;
  approval: { from: string; to: string; data: string };
  units: number;
  amount: string;
  displayAmount: string;
  symbol: string;
  saleRef: string;
};
export interface PurchaseGateway {
  pricing?(): Promise<{ unitPrice: string; decimals: number; symbol: string }>;
  prepare(
    personId: string,
    wallet: string,
    units: number,
    saleRef: string,
  ): Promise<Quote>;
  verify(
    quote: Quote,
    hash: string,
  ): Promise<"submitted" | "confirmed" | "failed">;
}
export class Purchases implements PurchaseGateway {
  chain: ChainSync;
  provider: Provider;
  constructor(chain: ChainSync) {
    this.chain = chain;
    this.provider = chain.provider;
  }
  async pricing() {
    ensure(
      Number((await this.provider.getNetwork()).chainId) === this.chain.chainId,
      "WRONG_CHAIN",
    );
    const contract = new Contract(
      await this.chain.token.getAddress(),
      ABI,
      this.provider,
    );
    const blockTag = await this.provider.getBlockNumber();
    const [stable, price] = await Promise.all([
      contract.stablecoin({ blockTag }),
      contract.primaryUnitPrice({ blockTag }),
    ]);
    ensure(stable !== ZeroAddress && price > 0n, "PRIMARY_PAYMENT_UNAVAILABLE");
    const currency = new Contract(stable, ERC20, this.provider);
    const [decimals, symbol] = await Promise.all([
      currency.decimals({ blockTag }),
      currency.symbol({ blockTag }),
    ]);
    return {
      unitPrice: String(price),
      decimals: Number(decimals),
      symbol: String(symbol),
    };
  }
  async prepare(
    personId: string,
    wallet: string,
    units: number,
    saleRef: string,
  ): Promise<Quote> {
    ensure(
      Number.isSafeInteger(units) && units > 0 && units <= 20,
      "INVALID_UNITS",
    );
    await this.chain.assertCurrent(personId);
    const state = this.chain.ledger.state();
    ensure(
      state &&
        !state.paused &&
        state.timestamp >= state.validFrom &&
        state.timestamp <= state.validUntil,
      "NOT_ELIGIBLE",
    );
    const from = address(wallet);
    ensure(
      this.chain.ledger.requireWallet(from) === personId,
      "FORBIDDEN_WALLET",
    );
    ensure(state.registeredWallets?.includes(from), "WALLET_NOT_REGISTERED");
    const to = await this.chain.token.getAddress(),
      contract = new Contract(to, ABI, this.provider),
      blockTag = state.number;
    const [stable, price, stock, held] = await Promise.all([
      contract.stablecoin({ blockTag }),
      contract.primaryUnitPrice({ blockTag }),
      contract.saleableUnits({ blockTag }),
      contract.personBalance(this.chain.ledger.personChainId(personId), {
        blockTag,
      }),
    ]);
    ensure(stable !== ZeroAddress && price > 0n, "PRIMARY_PAYMENT_UNAVAILABLE");
    ensure(
      BigInt(units) <= stock && held + BigInt(units) <= 20n,
      "INSUFFICIENT_STOCK",
    );
    // Contratos históricos sem deduplicação não são compatíveis com este checkout.
    try {
      ensure(
        !(await contract.primarySaleUsed(from, saleRef, { blockTag })),
        "PURCHASE_ALREADY_CONFIRMED",
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "PURCHASE_ALREADY_CONFIRMED"
      )
        throw error;
      throw Error("INCOMPATIBLE_CONTRACT_CHECKOUT");
    }
    const currency = new Contract(stable, ERC20, this.provider);
    const [decimals, symbol] = await Promise.all([
      currency.decimals({ blockTag }),
      currency.symbol({ blockTag }),
    ]);
    const amount = price * BigInt(units);
    return {
      chainId: this.chain.chainId,
      from,
      to,
      data: new Interface(ABI).encodeFunctionData("buyPrimary", [
        units,
        saleRef,
      ]),
      approval: {
        from,
        to: String(stable),
        data: new Interface(ERC20).encodeFunctionData("approve", [to, amount]),
      },
      units,
      amount: String(amount),
      displayAmount: formatUnits(amount, Number(decimals)),
      symbol: String(symbol),
      saleRef,
    };
  }
  async verify(
    quote: Quote,
    hash: string,
  ): Promise<"submitted" | "confirmed" | "failed"> {
    ensure(/^0x[0-9a-fA-F]{64}$/.test(hash), "INVALID_TRANSACTION");
    ensure(
      Number((await this.provider.getNetwork()).chainId) === quote.chainId,
      "WRONG_CHAIN",
    );
    const tx = await this.provider.getTransaction(hash);
    ensure(
      tx &&
        tx.to &&
        address(tx.to) === address(quote.to) &&
        address(tx.from) === address(quote.from) &&
        tx.data.toLowerCase() === quote.data.toLowerCase() &&
        tx.value === 0n,
      "TRANSACTION_MISMATCH",
    );
    const receipt = await this.provider.getTransactionReceipt(hash);
    if (!receipt) return "submitted";
    if (receipt.status !== 1) return "failed";
    const iface = new Interface(ABI);
    const events = receipt.logs
      .filter((l) => address(l.address) === address(quote.to))
      .map((l) => {
        try {
          return iface.parseLog(l);
        } catch {
          return null;
        }
      });
    ensure(
      events.some(
        (e) =>
          e?.name === "PrimaryPurchase" &&
          address(e.args.to) === address(quote.from) &&
          Number(e.args.units) === quote.units &&
          e.args.saleRef === quote.saleRef,
      ) &&
        events.some(
          (e) =>
            e?.name === "PrimaryPayment" &&
            address(e.args.buyer) === address(quote.from) &&
            String(e.args.amount) === quote.amount,
        ),
      "TRANSACTION_MISMATCH",
    );
    const state = await this.chain.sync();
    if (receipt.blockNumber > state.number) return "submitted";
    ensure(
      (await this.provider.getBlock(receipt.blockNumber))?.hash ===
        receipt.blockHash,
      "CHAIN_REORG",
    );
    return "confirmed";
  }
}
