// Ensaio acadêmico para o vídeo: executa somente em Anvil e preserva os recibos.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { id, parseUnits, ZeroAddress } from 'ethers';
import { localChain } from './local-chain.ts';

const destination = resolve(process.argv[2] ?? '../output/video/ibitoken-v2');
mkdirSync(destination, { recursive: true });
const chain = await localChain();
const records: any[] = [];
const encode = (value: unknown) => JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v, 2);
try {
  await chain.provider.send('anvil_setBlockTimestampInterval', [0]);
  const [admin, user1, user2, replacement, outsider] = chain.signers;
  const stable = await chain.deploy('MockStablecoin', ['Teste', 'tBRL', 6]);
  const token = await chain.deploy('IBIToken', [admin.address, 150, 0, 0, await stable.getAddress()]);
  const txRecord = async (label: string, promise: Promise<any>) => {
    const tx = await promise;
    const receipt = await tx.wait();
    assert.equal(receipt.status, 1);
    const block = await chain.provider.getBlock(receipt.blockNumber);
    const events = receipt.logs.map((log: any) => {
      const contract = log.address.toLowerCase() === String(token.target).toLowerCase() ? token : stable;
      try {
        const parsed = contract.interface.parseLog(log);
        return { address: log.address, name: parsed?.name, args: Array.from(parsed?.args ?? []) };
      } catch { return { address: log.address, topics: log.topics, data: log.data }; }
    });
    records.push({ label, kind: 'mined-transaction', network: 'Anvil local', chainId: 31337,
      hash: tx.hash, from: tx.from, to: tx.to, blockNumber: receipt.blockNumber,
      blockHash: receipt.blockHash, timestamp: block!.timestamp, status: receipt.status,
      gasUsed: receipt.gasUsed, events });
    console.log('CONFIRMADO', label, tx.hash);
  };
  const rejection = async (label: string, action: () => Promise<any>, expected: string) => {
    let rejected = false;
    try { await action(); } catch (error: any) {
      const data = error.data ?? error.info?.error?.data;
      const decoded = token.interface.parseError(data);
      assert.equal(decoded?.name, expected);
      records.push({ label, kind: 'eth_call-rejected', network: 'Anvil local', chainId: 31337,
        error: decoded!.name, args: Array.from(decoded!.args), transactionHash: null,
        note: 'Simulação eth_call; nenhuma transação foi minerada e não houve gas pago.' });
      rejected = true;
    }
    assert.ok(rejected, 'A operação deveria ser rejeitada: ' + label);
    console.log('REJEITADO', label, expected);
  };
  const warp = async (timestamp: number) => {
    await chain.provider.send('evm_setNextBlockTimestamp', [timestamp]);
    await chain.provider.send('evm_mine', []);
    records.push({ kind: 'local-time-advance', timestamp, iso: new Date(timestamp * 1000).toISOString(),
      note: 'Avanço exclusivo do Anvil. Não representa tempo decorrido na Sepolia.' });
  };
  const price = parseUnits('34874.14', 6);
  const gross = parseUnits('150000', 6);
  const opening = Date.UTC(2027, 2, 15) / 1000;
  await txRecord('Emissão IBIToken local', Promise.resolve(token.deploymentTransaction()));
  await txRecord('Preço primário', token.setPrimaryPrice(price));
  await txRecord('Registrar USER1', token.registerWallet(user1.address, id('video-identidade-sintetica-1')));
  await txRecord('Registrar USER2', token.registerWallet(user2.address, id('video-identidade-sintetica-2')));
  await warp(opening);
  await txRecord('Abertura simulada', token.recordOpening(opening, id('abertura-apenas-para-ensaio-academico')));
  const end = Number(await token.periodEnd(1));
  const middle = opening + (end - opening) / 2;
  assert.ok(Number.isSafeInteger(middle));
  await txRecord('tBRL fictício para USER1', stable.mint(user1.address, price * 2n));
  await txRecord('tBRL fictício para USER2', stable.mint(user2.address, price * 2n));
  await txRecord('USER1 autoriza pagamento', stable.connect(user1).approve(token.target, price * 2n));
  await txRecord('USER1 compra 2 IBT no início', token.connect(user1).buyPrimary(2, id('video-compra-local-user1')));
  assert.equal(await token.balanceOf(user1.address), 2n);
  assert.equal(await stable.balanceOf(user1.address), 0n);
  await rejection('Compra sem cadastro', () => token.connect(outsider).buyPrimary.staticCall(1, id('sem-cadastro')), 'WalletNotRegistered');
  await rejection('Apuração antes do fechamento', () => token.reportRevenue.staticCall(gross, id('antecipada')), 'PeriodNotClosed');
  await warp(middle);
  await txRecord('USER2 autoriza pagamento', stable.connect(user2).approve(token.target, price * 2n));
  await txRecord('USER2 compra 2 IBT na metade', token.connect(user2).buyPrimary(2, id('video-compra-local-user2')));
  assert.equal(await token.balanceOf(user2.address), 2n);
  assert.equal(await stable.balanceOf(user2.address), 0n);
  await rejection('Transferência USER1 para USER2', () => token.connect(user1).transfer.staticCall(user2.address, 1), 'SecondaryTransfersDisabled');
  await warp(end);
  const weights = { user1: await token.tokenSecondsOf(1, user1.address), user2: await token.tokenSecondsOf(1, user2.address) };
  assert.equal(weights.user1, weights.user2 * 2n);
  await txRecord('Autorizar financiamento do royalty', stable.approve(token.target, gross * 15n / 100n));
  await txRecord('Apuração e depósito do semestre 1', token.reportRevenue(gross, id('relatorio-sintetico-video-semestre1')));
  const due = { user1: await token.royaltyDue(1, user1.address), user2: await token.royaltyDue(1, user2.address), treasury: await token.royaltyDue(1, admin.address) };
  assert.equal(due.user1, parseUnits('300', 6));
  assert.equal(due.user2, parseUnits('150', 6));
  await txRecord('Saque de USER1', token.connect(user1).claimRoyalty(1));
  await txRecord('Saque de USER2', token.connect(user2).claimRoyalty(1));
  assert.equal(await stable.balanceOf(user1.address), due.user1);
  assert.equal(await stable.balanceOf(user2.address), due.user2);
  assert.equal(await token.royaltyDue(1, user1.address), 0n);
  assert.equal(await token.royaltyDue(1, user2.address), 0n);
  await txRecord('Anúncio de recuperação', token.requestRecovery(user1.address, replacement.address, id('caso-sintetico-video')));
  const recovery = await token.recoveries(user1.address);
  assert.equal(recovery.executeAfter, BigInt(end + 7 * 86400));
  await rejection('Recuperação antes de sete dias', () => token.reissue.staticCall(user1.address, replacement.address), 'RecoveryNotReady');
  await txRecord('Cancelar recuperação', token.cancelRecovery(user1.address));
  assert.equal((await token.recoveries(user1.address)).destination, ZeroAddress);
  assert.equal(await token.totalSupply(), 150n);
  assert.equal(await token.reservedUnits(), 50n);
  const result = { generatedAt: new Date().toISOString(), status: 'verified', officialDelivery: 'v2', internalRevision: 4,
    network: 'Anvil local — não é Sepolia', chainId: 31337, simulatedOpening: true,
    sourceSha256: createHash('sha256').update(readFileSync(new URL('../contracts/IBIToken.sol', import.meta.url))).digest('hex'),
    accounts: { admin: admin.address, user1: user1.address, user2: user2.address, recoveryDestination: replacement.address },
    token: token.target, stablecoin: stable.target, primaryUnitPrice: price, currencyDecimals: 6,
    calendar: { opening, middle, firstPeriodEnd: end, validUntil: await token.validUntil() },
    revenue: { gross, royalty: gross * 15n / 100n, weights, dueBeforeClaims: due },
    final: { supply: await token.totalSupply(), reserve: await token.reservedUnits(), cap: await token.maxPerWallet(),
      adminIBT: await token.balanceOf(admin.address), user1IBT: await token.balanceOf(user1.address), user2IBT: await token.balanceOf(user2.address),
      user1tBRL: await stable.balanceOf(user1.address), user2tBRL: await stable.balanceOf(user2.address),
      user1Due: await token.royaltyDue(1, user1.address), user2Due: await token.royaltyDue(1, user2.address),
      lastReportedPeriod: await token.lastReportedPeriod(), recoveryCancelled: true }, records };
  writeFileSync(resolve(destination, 'evidencias-local.json'), encode(result) + '\n');
  console.log('EVIDENCIAS VERIFICADAS', resolve(destination, 'evidencias-local.json'));
} finally { await chain.stop(); }
