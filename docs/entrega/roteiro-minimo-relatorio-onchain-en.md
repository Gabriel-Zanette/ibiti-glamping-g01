# IBIToken — Deployment and On-Chain Operational Evidence

**Draft template — replace every bracketed field with observed results.**

Official submission: v2 • Internal revision: [revision/commit] • Network: [name and chain ID] • Evidence collected: [UTC dates] • Authors: [names]

This template is a suggested structure, not a claim that deployment has occurred. Do not include unexecuted scenarios as successful tests. The previously published official version is v1.

## 1. Purpose and scope

Explain which release and rules were evaluated, why on-chain operation matters, and what the report proves. Identify the academic test environment and distinguish public-network evidence from local simulations. State the coverage limitations at the outset.

## 2. System and deployment record

Describe the fixed supply, identity linkage, primary purchase, royalty accounting and separate accommodation ledger in one concise paragraph. A small diagram may show participant → contract → finalized events → off-chain quota ledger.

| Item | Observed value / evidence |
| --- | --- |
| Source revision and source manifest | [commit; dirty state; manifest link] |
| Network / chain ID | [network / ID] |
| Token / payment token | [addresses and explorer links] |
| Compiler / EVM / optimizer / viaIR | [exact values] |
| Constructor arguments | [values and meaning] |
| Deployment transaction / block | [hash, link, block, UTC timestamp] |
| Source verification | [link and status] |
| Initial supply / reserve / decimals / personal cap | [observed values] |
| Treasury / owner / primary price | [values, currency and decimals] |
| Opening and period boundaries | [actual simulated dates; source of reference] |

State who controls each test wallet. Do not disclose private keys or civil identity data. Explain that internal revision “4” does not mean an official fourth release.

## 3. Operational evidence

Use the following block for each selected scenario. Core scenarios should include deployment, primary purchase and relevant protection rules; include royalties and recovery according to the coverage actually achieved. The assignment does not prescribe a fixed number of screenshots.

### [E-ID] — [Business rule or operation]

**Objective:** [What rule does this scenario investigate?]

**Environment and preconditions:** [Network, contract, caller role, balance/allowance, period state.]

**Action:** [Function, arguments, units and transaction hash/link; label calls that were not broadcast.]

**Before → after:** [State values tied to block numbers/hashes.]

**Observed result:** [Receipt status, relevant events, computed amount; expected versus actual.]

**Evidence:** [Readable figure, receipt JSON, explorer link, calculation file.]

**Interpretation:** [How the result supports the operational/economic rule and what it does not establish.]

**Example caption format:** “Figure [n]. [Action] on [network], block [n]. The receipt records [event]; [state change] confirms [rule]. Source: [explorer link].” This is a format example, not a completed evidence caption.

Suggested scenarios: fixed issuance; opening/early-report rejection; paid primary purchase; aggregate cap across two wallets; prohibited secondary transfer; funded royalty report and claim; owner transition with preserved treasury; recovery announcement/cancellation and delayed execution if observed; global pause and off-chain accommodation reconciliation.

## 4. Economic reconciliation

Reproduce a purchase and a royalty allocation using actual balances and block timestamps. Explain:

- Payment = units × fixed primary price, using the payment token's decimals.
- Royalty pool R = floor(reported gross revenue × 1500 / 10000).
- Weight W = sum(balance × elapsed seconds within the period).
- Entitlement = floor(R × W / (150 × period duration)).
- Actual funding = sum of individual entitlements; explain rounding differences.

Compare a longer-held position and a later purchase. Distinguish a revenue share from a return on the purchase price. State that revenue and the opening milestone are external declarations, even though the calculation is on-chain.

## 5. Critical interpretation

Discuss traceability (events and receipts), persistence (past transactions remain observable), verifiability (source/state reconciliation), finality (included versus finalized), and execution costs. Report measured gas costs in test ETH and distinguish them from the token price.

Explain primary-purchase atomicity and delayed synchronization of accommodation quotas. Explain why six-month boundaries and a seven-day recovery delay cannot be accelerated on a public network. Identify any backdated opening as a test assumption, including its effect on treasury accrual.

## 6. Evolution from v1 and remaining limitations

| Revision | Operational reason | Evidence / remaining limitation |
| --- | --- | --- |
| Aggregate limit per person | Prevent concentration through multiple wallets | [E-ID] |
| Civil-semester calendar | Prevent consuming future reporting periods early | [E-ID] |
| Time-weighted royalties | Allocate value by actual holding time | [E-ID] |
| No secondary market | Align circulation and experience management | [E-ID] |
| Treasury separated from owner | Preserve primary-sale continuity | [E-ID] |
| Delayed recovery | Improve traceability and contestability | [E-ID and actual coverage] |

Update the limitations after the final source is frozen. In the current source, joint contract governance, selective pauses and the complete external recovery/contest workflow are not finished. Portal roles do not prove on-chain multisignature authorization. Do not present a mock currency, test identity checks or local key management as production integrations.

## 7. Conclusion and evidence index

State only conclusions supported by observed operations. Identify what remains untested publicly and what would be required to close those gaps.

Attach the completed evidence register, public links, relevant raw receipts, calculation inputs and reproducibility instructions. Keep screenshots readable and avoid a log dump in the main narrative. Check that the final PDF is in English and that all bracketed placeholders have been resolved or explicitly marked as unavailable.
