import { Contract, Interface, formatUnits } from 'ethers';
import type { Provider, Log } from 'ethers';
import { address, ensure, Ledger } from './ledger.ts';
import type { ChainState, Movement } from './ledger.ts';
export const ABI = [
  'function name() view returns(string)', 'function symbol() view returns(string)', 'function decimals() view returns(uint8)',
  'function emissionCap() view returns(uint256)', 'function totalSupply() view returns(uint256)',
  'function balanceOf(address) view returns(uint256)', 'function validFrom() view returns(uint64)', 'function validUntil() view returns(uint64)',
  'function maxPerWallet() view returns(uint256)', 'function paused() view returns(bool)', 'function owner() view returns(address)',
  'function revoked(address) view returns(bool)', 'function stablecoin() view returns(address)', 'function lastReportedPeriod() view returns(uint8)',
  'function royaltyDue(uint8,address) view returns(uint256)', 'function royaltyPaid(uint8,address) view returns(uint256)',
  'function periodInfo(uint8) view returns(tuple(uint256 grossRevenue,uint256 royaltyAmount,uint256 totalDue,uint256 snapshotSupply,uint256 holderCount,bytes32 reportHash,uint64 reportedAt,bool onChain))',
  'function primaryPurchase(address,uint256,bytes32)', 'function transfer(address,uint256) returns(bool)', 'function reissue(address,address)',
  'function reportRevenue(uint256,bytes32)', 'function claimRoyalty(uint8)',
  'event Transfer(address indexed from,address indexed to,uint256 value)',
  'event Emission(address indexed admin,uint256 emissionCap,uint256 reservedUnits,uint256 maxPerWallet,uint64 validFrom,uint64 validUntil)',
  'event Reissued(address indexed oldWallet,address indexed newWallet,uint256 units)',
  // Compatibilidade de leitura com a v1 já publicada; resgates legados continuam bloqueados.
  'event Reissued(address indexed oldWallet,address indexed newWallet,uint256 units,uint256 redeemedUnits)',
  'event RedemptionMarked(address indexed holder,uint256 units,bytes32 voucherRef,uint256 activeRemaining)',
];
const iface = new Interface(ABI);
const ZERO = '0x0000000000000000000000000000000000000000';
export class ChainSync {
  ledger: Ledger; provider: Provider; token: Contract; startBlock: number; chainId: number;
  private running?: Promise<ChainState>;
  constructor(ledger: Ledger, provider: Provider, tokenAddress: string, startBlock: number, chainId: number) {
    this.ledger = ledger; this.provider = provider; this.token = new Contract(address(tokenAddress), ABI, provider);
    this.startBlock = startBlock; this.chainId = chainId;
    ensure(Number.isSafeInteger(startBlock) && startBlock >= 0, 'INVALID_START_BLOCK');
    ensure([31337,11155111].includes(chainId), 'UNSUPPORTED_CHAIN');
  }
  sync(): Promise<ChainState> {
    if (!this.running) this.running = this.run().finally(() => { this.running = undefined; });
    return this.running;
  }
  private async run(): Promise<ChainState> {
    const refundFence = this.ledger.refundFence();
    ensure(Number((await this.provider.getNetwork()).chainId) === this.chainId, 'WRONG_CHAIN');
    const target = await this.provider.getBlock(this.chainId === 11155111 ? 'finalized' : 'latest');
    ensure(target?.hash, 'CHAIN_UNAVAILABLE');
    if (this.chainId === 11155111) ensure(Date.now()/1000 - target.timestamp < 1800, 'CHAIN_STALE');
    const cursor = this.ledger.state();
    if (cursor) {
      const previous = await this.provider.getBlock(cursor.number);
      ensure(previous?.hash === cursor.hash && target.number >= cursor.number, 'CHAIN_REORG');
    }
    const tokenAddress = await this.token.getAddress();
    ensure(await this.provider.getCode(tokenAddress, target.number) !== '0x', 'CONTRACT_NOT_FOUND');
    const blockTag = target.number;
    let values: unknown[];
    try {
      values = await Promise.all([
        this.token.name({blockTag}), this.token.decimals({blockTag}), this.token.emissionCap({blockTag}), this.token.totalSupply({blockTag}),
        this.token.validFrom({blockTag}), this.token.validUntil({blockTag}), this.token.paused({blockTag}), this.token.maxPerWallet({blockTag}), this.token.owner({blockTag}),
      ]);
    } catch { throw new Error('INCOMPATIBLE_CONTRACT'); }
    ensure(values[0] === 'IBIToken' && Number(values[1]) === 0 && Number(values[2]) === 150 && Number(values[3]) === 150, 'INCOMPATIBLE_CONTRACT');
    const state: ChainState = { number: target.number, hash: target.hash, timestamp: target.timestamp, validFrom: Number(values[4]), validUntil: Number(values[5]), paused: Boolean(values[6]), maxPerWallet: Number(values[7]), owner: address(String(values[8])) };
    const allLogs: Log[] = [];
    for (let from = cursor ? cursor.number + 1 : this.startBlock; from <= target.number; from += 2000) {
      allLogs.push(...await this.provider.getLogs({ address: tokenAddress, fromBlock: from, toBlock: Math.min(target.number, from + 1999) }));
    }
    const movements = this.movements(allLogs);
    if (!cursor) ensure(movements.some(m => m.kind === 'emission'), 'EMISSION_NOT_FOUND_CHECK_START_BLOCK');
    ensure((await this.provider.getBlock(target.number))?.hash === target.hash, 'CHAIN_REORG');
    this.ledger.applyBlock(state, movements, this.chainId === 31337 ? Number.MAX_SAFE_INTEGER : state.timestamp * 1000, refundFence);
    return state;
  }
  private movements(logs: Log[]): Movement[] {
    const parsed = logs.sort((a,b) => a.blockNumber-b.blockNumber || a.index-b.index).map(log => ({ log, event: iface.parseLog({topics:[...log.topics],data:log.data}) }));
    ensure(!parsed.some(p => p.event?.name === 'RedemptionMarked'), 'LEGACY_REDEMPTIONS_REQUIRE_MIGRATION');
    const reissued = new Set(parsed.filter(p => p.event?.name === 'Reissued').map(p => p.log.transactionHash));
    const emissions = new Set(parsed.filter(p => p.event?.name === 'Emission').map(p => p.log.transactionHash));
    const out: Movement[] = [];
    for (const {log,event} of parsed) {
      if (!event) continue;
      const id = `${this.chainId}:${log.transactionHash}:${log.index}`;
      if (event.name === 'Reissued') out.push({id,from:address(event.args.oldWallet),to:address(event.args.newWallet),units:Number(event.args.units),kind:'reissue'});
      if (event.name === 'Transfer') {
        const from = String(event.args.from).toLowerCase(), to = String(event.args.to).toLowerCase();
        if (reissued.has(log.transactionHash) && (from === ZERO || to === ZERO)) continue;
        ensure(to !== ZERO && (from !== ZERO || emissions.has(log.transactionHash)), 'UNEXPECTED_MINT_OR_BURN');
        out.push({id,from,to,units:Number(event.args.value),kind:from === ZERO ? 'emission' : 'transfer'});
      }
    }
    return out;
  }
  async assertCurrent(personId: string) {
    const state = await this.sync();
    if (this.chainId !== 11155111) return;
    const head = await this.provider.getBlock('latest'); ensure(head?.hash, 'CHAIN_UNAVAILABLE');
    ensure(Date.now()/1000 - head.timestamp < 120, 'CHAIN_STALE');
    const blockTag = head.number;
    const q = this.ledger.quota(personId);
    const latest = await Promise.all(this.ledger.wallets(personId).map(async w => {
      const [balance, revoked] = await Promise.all([this.token.balanceOf(w.address,{blockTag}),this.token.revoked(w.address,{blockTag})]);
      ensure(Number(balance) === w.balance && Boolean(revoked) === Boolean(w.revoked), 'AWAITING_FINALITY'); return Number(balance);
    }));
    const pendingLogs = head.number > state.number ? await this.provider.getLogs({address:await this.token.getAddress(),fromBlock:state.number+1,toBlock:head.number}) : [];
    const related = new Set(this.ledger.wallets(personId).map(w=>w.address));
    ensure(!pendingLogs.some(l => {
      const e=iface.parseLog({topics:[...l.topics],data:l.data});
      if (e?.name === 'RedemptionMarked') return true;
      return e?.name === 'Transfer' && (related.has(String(e.args.from).toLowerCase()) || related.has(String(e.args.to).toLowerCase()));
    }), 'AWAITING_FINALITY');
    ensure(!await this.token.paused({blockTag}) && head.timestamp <= state.validUntil && head.timestamp >= state.validFrom, 'NOT_ELIGIBLE');
    ensure(latest.reduce((a,b)=>a+b,0) === q.balance, 'AWAITING_FINALITY');
  }
  async royalties(personId: string) {
    const state = await this.sync(); const blockTag = state.number;
    const count = Number(await this.token.lastReportedPeriod({blockTag}));
    const stablecoin = await this.token.stablecoin({blockTag});
    const currency = stablecoin === ZERO ? null : new Contract(stablecoin, ['function decimals() view returns(uint8)', 'function symbol() view returns(string)'], this.provider);
    const decimals = currency ? Number(await currency.decimals({blockTag})) : 2;
    const symbol = currency ? String(await currency.symbol({blockTag})) : 'BRL';
    const rows = [];
    for (let period=1;period<=count;period++) {
      const info = await this.token.periodInfo(period,{blockTag});
      const periodDecimals = info.onChain ? decimals : 2;
      const periodSymbol = info.onChain ? symbol : 'BRL';
      const wallets = await Promise.all(this.ledger.wallets(personId).map(async w => ({wallet:w.address,due:String(await this.token.royaltyDue(period,w.address,{blockTag})),paid:String(await this.token.royaltyPaid(period,w.address,{blockTag}))})));
      rows.push({period,wallets,symbol:periodSymbol,due:formatUnits(wallets.reduce((sum,w)=>sum+BigInt(w.due),0n),periodDecimals),paid:formatUnits(wallets.reduce((sum,w)=>sum+BigInt(w.paid),0n),periodDecimals)});
    }
    return {block:state.number,stablecoin,decimals,symbol,periods:rows};
  }
}
