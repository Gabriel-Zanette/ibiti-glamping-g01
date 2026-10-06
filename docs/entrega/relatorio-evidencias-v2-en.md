IBIToken

Deployment and<br/>on-chain operational evidence

Inteli | Module 6 | Group G01 | Official v2 delivery in preparation

Revision based on execution on 26 September 2026 (UTC). The internal technical revision is 4; the preceding official release remains v1. A new test deployment does not by itself constitute formal submission.

1. Purpose and evidence scope

This report connects economic rules, contract behavior and observed records. The delivery includes this PDF and two videos: an on-chain demonstration of approximately 6 minutes 32 seconds and an off-chain portal walkthrough. The final index identifies the published filenames. Deployment is public; purchases, royalties and recovery in this collection were executed in Anvil.

Environment | Proven by this evidence set

Sepolia / 11155111 | Creation, issuance, deployment parameters and exact verification on Sourcify. A configured price is not evidence of a purchase.

Anvil / 31337 | Registration, fictional opening, purchases, restrictions, assessment, two claims and announced/cancelled recovery. Additional regression tests in section 7.

Off-chain portal | Published companion video: participant, supervision and finance journey. Screenshots and descriptions retained from the team review; they do not evidence a Sepolia purchase.

Consolidated model

One issuance of 150 indivisible IBT; an initial reserve of 50 and a 20-token cap per registered person across linked wallets. Ordinary participant transfers are disabled. Eight semesters span four years from the recorded opening. Entitlement is proportional to units multiplied by holding time, against 15% of reported gross revenue. Under the accommodation model, one quota represents three nights; consumption is managed outside the blockchain.

<b>Currency and identities are test data.</b> tBRL is not real money. The demonstration price is 34,874.14 tBRL/IBT. An opaque ID neither proves identity nor guarantees anonymity: it depends on external registration and may be linked to other data.

2. Verified public deployment

The <b>01_publicar.js</b> script was used in Remix with human confirmation in MetaMask. Compilation: Solidity 0.8.34+commit.80d5c536, Osaka, optimizer 200, viaIR enabled and vendored OpenZeppelin 5.6.1.

IBIToken: 0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520

ADMIN / treasury: 0x549852CA58C2e843e29428a81Ab97D2d613BB749

tBRL: 0xFEc48658BdaBAfbdB572204B632d4dfCCF1F89fE

Creation tx: 0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f

Field | Verified result

Block / inclusion | 11783256 / 2026-09-26 02:22:36 UTC

Status / gas used | 1 (success) / 3,906,647

Effective gas price / fee | 2.588339865 Gwei / 0.010111730168582655 SepoliaETH

Constructor arguments | admin = ADMIN; total emission = 150; validFrom = 0; validUntil = 0; stablecoin = tBRL.

Source verification | Sourcify: creationMatch = exact_match; runtimeMatch = exact_match.

Zero validity values indicate that opening had not been recorded in this public deployment. ADMIN and treasury initially share one address, while authority and inventory are separate concepts. No public USER1/USER2 account was used for purchases in this MP4.

Figure 1. Public receipt: Success status, created contract and issuance of 150 IBT. Source: Etherscan, captured during this run.

Exact matching connects compilation to bytecode. It does not prove the memorandum is correct, that vulnerabilities are absent, or that external inputs are true. The fee above is gasUsed multiplied by effectiveGasPrice; it is not a guaranteed future cost.

3. Purchases and restrictions in Anvil

The academic console signs only in an isolated local instance, chain ID 31337. The accounts below are public test accounts, not three selected MetaMask accounts. Clicks produced real Anvil receipts; video cuts and frame holds support reading and dubbing.

ADMIN: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

USER1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8

USER2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC

Action | Observed

Register USER1 and USER2 | WalletRegistered for distinct synthetic IDs. This does not prove real KYC.

Record opening | 15 March 2027 00:00 UTC, fictional. First semester ends on 15 September 2027 00:00 UTC.

USER1: approve + buyPrimary | Buys 2 IBT at the start. Cost: 69,748.28 tBRL.

USER2: approve + buyPrimary | Buys 2 IBT at the exact midpoint. Same cost. Only Anvil time advances.

Unregistered purchase | WalletNotRegistered

Transfer USER1 to USER2 | SecondaryTransfersDisabled

Premature reporting | PeriodNotClosed

After both purchases | IBT | tBRL

ADMIN / treasury | 146 | 139,496.56

USER1 | 2 | 0

USER2 | 2 | 0

Operational interpretation

Each buyer received exactly the required test amount. Spending approval is a separate transaction. In buyPrimary, tBRL payment and IBT delivery happen together: a failure reverts both. The order reference prevents replaying the same purchase. This does not make the external accommodation ledger atomic or prove a PIX payment.

The three rejections above were checked through <b>eth_call</b>: they were not mined and have no transaction hash or paid gas. Disabling a secondary market blocks ordinary transfers while preserving controlled recovery. The person-level cap still relies on preventing one real person from receiving multiple different registry IDs.

4. Royalties and recovery: measured results

The test semester lasts <b>15,897,600 seconds</b>. USER1 accumulated 31,795,200 token-seconds; USER2 accumulated 15,897,600. Fictional revenue G = 150,000 tBRL; fund R = 22,500 tBRL.

R = floor(G × 1500 / 10000)<br/>W = Σ(units × seconds held during the semester)<br/>entitlement = floor(R × W / (150 × duration))

Holder | Due | Claimed | Final outstanding

USER1 | 300 tBRL | 300 tBRL | 0

USER2 | 150 tBRL | 150 tBRL | 0

Treasury | 22,050 tBRL | 0 | 22,050 tBRL

The deposit was 22,500 tBRL; 22,050 remained in the contract after the two claims. Treasury participates through inventory and reserve, receiving 98% in this example. Its currency balance after sales and funding is 116,996.56 tBRL. Claims did not consume participant IBT.

<b>Rounding:</b> the contract transfers the sum of individual entitlements (<b>totalDue</b>), which may be below R. A rounding difference is not deposited and remains with the funder. It was zero in this test. The memorandum should state the economic treatment of that difference.

Recovery | Result

requestRecovery | USER1 to a new empty wallet for the same person; request recorded.

reissue / eth_call | RecoveryNotReady; executeAfter = request + 604,800 seconds (7 days).

cancelRecovery | RecoveryCancelled. USER1 retains 2 IBT; no balance was transferred.

Execution after seven days was not performed in the video; it was validated in the additional tests in section 7. The delay provides a contestation window but does not automatically integrate support with the contract. The old holder or owner can cancel on-chain; the complete external workflow and independent review remain pending. The destination cannot be treasury, owner, pendingOwner or another registered person and must satisfy the remaining code restrictions.

5. Architecture, operation and critical analysis

Account, custody and accommodation

The portal account brings together application, approval, wallet binding, orders and quotas. Names, contacts and documents remain in external systems; the contract receives opaque IDs. Approving an application grants neither tokens nor stays. A purchase recognized by the indexer updates rights in the external ledger. Using a quota does not burn IBT or, by itself, reduce royalties. Cancellations remain manual and provisional.

Three custody modes are envisaged: IBITI custody, assisted self-custody and direct self-custody. The automated institutional demonstration path works only through the Anvil adapter. It does not represent production key custody, real payment or a contracted service. Portal separation between supervision and finance is application authorization; it is not a contract-enforced multisignature requirement.

Finality and persistence

A receipt with status 1 proves successful inclusion, not finality by itself. Reorganizations may occur before finalization. The indexer design uses finalized state before making quotas available, introducing a delay after purchase. The transaction is not atomic with the off-chain database; idempotency, failure handling and reconciliation remain necessary.

Verifiability and concentrated authority

Events record opening, registration, purchase, reporting, claims and recovery. Receipts and bytecode support independent verification when the correct network is specified. Local operations do not appear on Etherscan. The owner remains a single authority: it reports revenue, registers wallets and opening, and can pause operations including claims. Two-step ownership transfer does not automatically move treasury or remove compromised-key risk.

Cost, limits and economic interpretation

The public deployment cost is measured in section 2; purchase costs in this collection are local and must not be presented as fees paid on Sepolia. Reporting iterates through tracked participants and cost depends on state. This report claims no public benchmark with 150 holders. Fifteen percent of revenue is the allocation base, not a guaranteed 15% return on the purchase price.

The contract does not verify actual revenue, physical opening or document authenticity. A hash can establish integrity against a preserved file; it does not validate its content. Civil identity data should not be placed on a permanent public network.

6. Portal journey and on-chain boundary

This section retains the contribution of the team report published on 26 September 2026 (commit 76b826fe). The companion video shows a local academic environment without real charges. The steps below are not Sepolia transactions; accounts and data are demonstrative.

Step and actor | Effect and interpretation

Visitor: simulate interest | From 1 to 20 IBT, at BRL 34,874.14. Simulation creates neither an order nor a contract balance.

Ana: request accommodation | 3 available quotas become 2 available and 1 reserved. Completing the stay records 1 used quota without burning IBT.

Beatriz: order 2 IBT | BRL 69,748.28, IBITI custody. An approved applicant must still complete a purchase to receive quotas.

Supervision: review and bind | Reviews the application and authorizes wallet-to-opaque-ID binding. Contract registration uses registerWallet.

Finance and participant: purchase | Prepare wallet and order; obtain acceptance of the amount; execute a test purchase. The portal receipt belongs to Anvil.

Indexer: recognize purchase | The portal recognizes the event and displays 2 IBT and 2 quotas. Entering a hash alone grants no rights.

Figure 2. Staged order and preparation of a test wallet. Source: screenshots from the team report. Interface labels remain in Portuguese.

Access separation helps attribute responsibility in the portal, but does not prove production-key separation or replace contract multisig. The demonstrated custody adapter is Anvil-only.

6. Portal journey: purchase and use

Figure 3. Supervision authorizes wallet binding; the participant reviews and accepts the order amount.

Figure 4. Finance executes the test purchase; the portal displays a local receipt and the BRL 69,748.28 amount.

Figure 5. Accommodation used without reducing IBT balance; another participant receives quotas after purchase.

The account combines registration, approval, purchase and experiences. The wallet holds tokens; the external ledger tracks available, reserved and used quotas. Consumption does not change royalty weights. The contract cannot observe a physical stay, so this layer depends on the external system and its operators. Cancellations remain manual and provisional.

7. v1 feedback: regression evidence

The feedback.test.ts and time-weighted.test.ts suites were rerun on 26 September 2026 using Anvil 31337 and the current source. This section provides additional automated-test evidence, not video scenes or Sepolia transactions. Commands and source identifiers appear on the next page.

v1 issue / correction | Procedure and observed result

Concentration per person | Two wallets receive the same ID. After 20 IBT in the first, buying 1 through the second reverts PersonCapExceeded; the aggregate remains 20.

Recovery to administrator | Attempts to recover 20 IBT to owner, pendingOwner and treasury are rejected with InvalidAddress. The holder position remains intact.

Ownership rotation | After acceptance by the new owner, buying 1 IBT succeeds; original treasury retains 149 and saleable stock is 99. Selling down to the reserve leaves 50; another sale reverts ReserveProtected.

Eight premature periods | For every semester, reporting before close reverts PeriodNotClosed; reporting after close succeeds. A ninth report reverts AllPeriodsReported.

Receivables without balance | A legacy-position fixture simulates zero balance after two reports. Recovery after expiry migrates 5,000 currency base units; historical payment remains intact and a duplicate claim is rejected.

Announcement and enforced delay | Execution one second before the deadline reverts RecoveryNotReady. After seven local days, 20 IBT migrate without changing the 150 supply; the source is revoked and identity is preserved.

Payment and delivery | A purchase with approval transfers currency to treasury and delivers IBT. Without balance or allowance, delivery and the person aggregate revert.

Zero-balance test limitation: LegacyPositionFixture creates an inherited state without enabling a secondary market in the current version. It exercises recovery, not an allowed secondary sale. Clock advancement is a local-test facility only.

7. Test reproduction and scope

Result of this execution: <b>31/31</b> tests passed; zero failures.

Run from the implementation artifact folder with Node.js 24 and lockfile-installed dependencies. The command compiles contracts and starts isolated Anvil instances; it uses no user funds or private keys.

cd smart-contract<br/>npm ci<br/>node --test --test-concurrency=1 --test-reporter=tap tests/feedback.test.ts tests/time-weighted.test.ts

SHA-256 | contracts/IBIToken.sol<br/>445c041752cf7081cf2ab82f1e4953249bcd65babb1eb31c0a945169dca84960

SHA-256 | tests/feedback.test.ts<br/>ba644fd556daf733d2e03ae5a99a768439a38925ad80e0e37fb1072cac02c5b3

SHA-256 | tests/time-weighted.test.ts<br/>235bb72e44334e793408bdb744710728d5d02ae6280d5bd05266af5c88307b29

Source, tests and package-lock.json are in the implementation artifact published beside this folder. Source and both test files were compared with GitLab and have identical SHA-256 values. Hashes identify files used in this review; they do not certify authorship, security or absence of defects. The TAP output of this run is embedded in the PDF as a supporting attachment.

Additional economic rule | Test and interpretation

Late purchase | Five tokens held longer and one bought on the final day accumulate separate weights. Delayed reporting does not move the semester boundary.

Recovery and time | Migration preserves unreported weights, receivables and historical payments without counting time twice.

Civil calendar | Tests cover a 29 February anniversary and purchase rejection after four years. Test dates do not announce the real Glamping opening.

The evolution fixes edge cases observed in v1 and makes economic protections executable. Identity still depends on external registration; revenue and opening depend on administrative inputs. These tests are neither an independent audit nor a substitute for public-network usage evidence.

8. Evolution, evidence and remaining work

Change from v1 | Rationale and evidence

Manual delivery → paid purchase | Payment and delivery together; local receipts and PrimaryPayment/PrimaryPurchase events.

Wallet cap → person cap | Closes concentration across linked wallets; verified code. Two wallets belonging to the same person were not exercised in this video.

Balance snapshot → holding time | Avoids full-semester entitlement for late entry; measured 300/150 amounts.

Fixed dates → recorded opening | Calendar tied to operation; premature reporting rejected locally.

Secondary transfers → disabled | Consolidated project decision; local rejection even between registered holders.

Immediate recovery → 7 days | Traceable request and cancellation; early execution rejected.

<b>Tests versus video:</b> multiple wallets for one person, ownership rotation and completed recovery were verified in section 7 tests; they were not filmed in the on-chain demonstration. Sepolia purchases and a complete public cycle remain unevidenced in this collection.

<b>Implementation limitations:</b> shared pillar governance, 2-of-3 treasury, selective pausing and integrated contestation; production KYC and custody; external substantiation of revenue and opening. The published memorandum still needs reconciliation with current rules. In particular, the code blocks purchases before opening despite the proposed pre-opening fundraising.

How to complete public usage evidence

Registration and purchase do not require a six-month wait: in a public demonstration instance, register synthetic participants, record a clearly labeled test opening, obtain test tBRL, execute approve and buyPrimary, and preserve receipts, events and before/after balances. This requires new signed transactions, not a wording change. Do not represent a fictional physical opening as real. Opening had not been recorded in the current deployment at the evidence cutoff.

Reporting and completed recovery obey real time on a public network. Local tests with clock advancement demonstrate these rules now without asserting that time elapsed on Sepolia. A rejected eth_call is a simulation, not a mined transaction.

9. Files and verifiable index

Verifiable index

Delivery location: <b>Sprint 4 / Deploy e Evidências Operacionais On-Chain</b>. The English PDF is the assessment report; the Portuguese version is a review copy. The videos published in the same folder are listed below. This local revision does not automatically update GitLab.

Published file | Scope

IBIToken-v2-demonstracao-sem-voz.mp4 | Approximately 6min32s. Public deployment and local operational demonstration. Replaces the former 2min40s cut.

IBIToken-v2-explicacao-do-sistema-off-chain.mp4 | Portal, roles and accommodation. Identified as video 1 in the previous team report. Supplementary; not evidence of a public purchase.

Local records and test output accompany this PDF as embedded attachments, accessible from a PDF reader attachment panel. They do not depend on an output folder published on GitLab. Web viewers may require downloading the PDF to display attachments.

buyPrimary USER1 | Anvil | block 11 | gas 314737<br/>0xb1ff3a0fa3e04bfa28a736439e7977c90c2b5c4e2d7cd5a69a3c4027ce24532a

buyPrimary USER2 | Anvil | block 14 | gas 320927<br/>0xdfb961ffb0f6ea9f0cb012498a06cf6499097b655ba09c9b6312dc410c4ded7b

reportRevenue | Anvil | block 17 | gas 344717<br/>0x5c55d3c71d200bf87dafeed1914534ac368620e5c203a525b18ee4de96b90268

claimRoyalty USER1 | Anvil | block 18 | gas 92949<br/>0xbce186b1b9e77f4c287aef67a444bb93f873406ad7e14be23872debb5265e46a

claimRoyalty USER2 | Anvil | block 19 | gas 92949<br/>0x5ba6d23669af16fd55069f2439bcf2a60753242fb9bc431f9771d595bb6cb343

cancelRecovery | Anvil | block 21 | gas 41586<br/>0x4839d0894b51b8d2ab0b6261b9289400e06d02e3cef0d94d44991f37e87b5b18

<link href="https://sepolia.etherscan.io/tx/0x132a696441b2a2feae4e2ea4b233c90e2f4534afaff84c9d7064a8d84ac0ec4f" color="#245b45">Etherscan: public deployment receipt</link> | <link href="https://repo.sourcify.dev/11155111/0x021DD3c028FC0FFaA45F6D8cb0D0912fD1850520" color="#245b45">Sourcify: exact_match and source</link>

Conclusion: deployment and verification are public; purchases, distribution, claims and regressions were demonstrated locally. Results substantiate specific fixes to v1 feedback without proving commercial operation or a complete Sepolia cycle.

10. How to audit the local records

A local hash is not an Etherscan link. It identifies a transaction in a specific Anvil run; chain ID 31337 can be reused by other instances. Chain ID alone does not identify a run; also check contract, block, events and context.

Embedded attachment | Content and limit

anvil-records.json | Original collection with contracts, test accounts, calendar, balances and decoded events per operation. Preserves video hashes; it is not a full chain dump or every raw RPC receipt.

sepolia-deployment-receipt.json | Public deployment RPC receipt, including raw logs. Can be compared with Etherscan and a Sepolia RPC.

regression-tests.tap | Full output of the 31 rerun tests, with names, results and duration. Read alongside test source and section 7 hashes.

evidence-manifest.json | SHA-256 of attachments, source and tests; ties this revision to preserved files. A hash supports integrity comparison, not content truth.

To reproduce, run section 7 tests. Addresses, blocks, hashes and timestamps can change in a new run; compare invariants: supply 150, protected reserve, aggregate cap 20, before/after states, expected rejections and non-duplicated payments. Do not require a new run to generate historical hashes.

Remaining collection improvement: automatically preserve the complete transaction (method, calldata, arguments, sender and recipient), full RPC receipt, block hash/timestamp, before/after queries at identified blocks and, where useful, an Anvil dump. Missing fields from a stopped instance cannot be reconstructed from a hash alone. A new collection must be labeled as new while retaining original video records.

Attachments are data reported by the team collector. Rerunning source verifies behavior but does not turn the historical local chain into an independently public record. That level of verifiability requires public-network operations and receipts.