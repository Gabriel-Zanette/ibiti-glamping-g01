/** Adaptador EXCLUSIVO de demonstração Anvil. Nunca importado pelo servidor de produção. */
import {
  Contract,
  Wallet,
  JsonRpcProvider,
  keccak256,
  toUtf8Bytes,
  parseEther,
} from "ethers";
import type { Signer } from "ethers";
import type { CustodyGateway } from "../src/custody.ts";
import type { Quote } from "../src/purchase.ts";
import { Ledger, ensure, address } from "../src/ledger.ts";
export class LocalCustody implements CustodyGateway {
  readonly mode = "local-demo" as const;
  ledger: Ledger;
  provider: JsonRpcProvider;
  tokenAddress: string;
  owner: Signer;
  constructor(
    ledger: Ledger,
    provider: JsonRpcProvider,
    tokenAddress: string,
    owner: Signer,
  ) {
    this.ledger = ledger;
    this.provider = provider;
    this.tokenAddress = tokenAddress;
    this.owner = owner;
  }
  private async assertLocal() {
    const url = new URL(this.provider._getConnection().url);
    ensure(
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) &&
        Number((await this.provider.getNetwork()).chainId) === 31337,
      "LOCAL_DEMO_ONLY",
    );
    ensure(
      String(await this.provider.send("web3_clientVersion", []))
        .toLowerCase()
        .includes("anvil"),
      "LOCAL_DEMO_ONLY",
    );
  }
  private async signer(person: string): Promise<Signer> {
    await this.assertLocal();
    const link = this.ledger.db
      .prepare(
        "SELECT wallet FROM portal_wallet_links WHERE person_id=? AND custody='ibiti' ORDER BY verified_at LIMIT 1",
      )
      .get(person) as { wallet: string } | undefined;
    const derived = new Wallet(
      keccak256(
        toUtf8Bytes("ibiti-local-custody:" + this.ledger.secret + ":" + person),
      ),
      this.provider,
    );
    if (!link || address(derived.address) === link.wallet) return derived;
    // Compatibilidade apenas com as carteiras desbloqueadas das fixtures Anvil anteriores.
    const accounts = (await this.provider.send("eth_accounts", [])) as string[];
    ensure(
      accounts.some((a) => address(a) === link.wallet),
      "LOCAL_CUSTODY_WALLET_UNAVAILABLE",
    );
    return this.provider.getSigner(link.wallet);
  }
  async wallet(person: string) {
    const signer = await this.signer(person),
      wallet = await signer.getAddress();
    if ((await this.provider.getBalance(wallet)) < parseEther("0.01"))
      await (
        await this.owner.sendTransaction({
          to: wallet,
          value: parseEther("0.1"),
        })
      ).wait();
    return wallet;
  }
  async sign(person: string, message: string) {
    return (await this.signer(person)).signMessage(message);
  }
  async register(wallet: string, personChainId: string) {
    await this.assertLocal();
    const token = new Contract(
      this.tokenAddress,
      [
        "function personOf(address) view returns(bytes32)",
        "function registerWallet(address,bytes32)",
      ],
      this.owner,
    );
    const person = await token.personOf(wallet);
    if (person === personChainId) return null;
    const tx = await token.registerWallet(wallet, personChainId);
    await tx.wait();
    return String(tx.hash);
  }
  async execute(
    person: string,
    quote: Quote,
    submitted: (hash: string) => void,
  ) {
    const signer = await this.signer(person);
    ensure(
      address(await signer.getAddress()) === address(quote.from),
      "FORBIDDEN_WALLET",
    );
    ensure(
      address(quote.to) === address(this.tokenAddress) &&
        quote.chainId === 31337,
      "LOCAL_DEMO_ONLY",
    );
    const token = new Contract(
      this.tokenAddress,
      ["function stablecoin() view returns(address)"],
      this.provider,
    );
    const stable = new Contract(
      await token.stablecoin(),
      [
        "function mint(address,uint256)",
        "function balanceOf(address) view returns(uint256)",
      ],
      this.owner,
    );
    const balance = await stable.balanceOf(quote.from);
    if (balance < BigInt(quote.amount))
      await (
        await stable.mint(quote.from, BigInt(quote.amount) - balance)
      ).wait();
    await (
      await signer.sendTransaction({
        to: quote.approval.to,
        data: quote.approval.data,
      })
    ).wait();
    const tx = await signer.sendTransaction({ to: quote.to, data: quote.data });
    submitted(tx.hash);
    await tx.wait();
    return tx.hash;
  }
}
