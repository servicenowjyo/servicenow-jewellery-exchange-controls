# Reproduce the verified automated build

The lab has already been built in your PDI. Open `/jewellery_finance_demo.do` to inspect it. To reproduce in a fresh disposable PDI, keep Global scope and rollback capture enabled in Scripts - Background. Run in this exact order, returning to a fresh runner page after schema creation:
1. `01-Create_Schema_PDI_ONLY.js`
2. `02-Install_Policy_PDI_ONLY.js`
3. `Seed_Originals_PDI_ONLY.js`
4. `Seed_Cases_PDI_ONLY.js`
5. `04-Verify_PDI_ONLY.js`
6. `05-Create_Dashboard_PDI_ONLY.js`

The install script creates before-insert classification, before-update intake protection, and after-insert review-task rules. Existing synthetic case IDs are skipped on rerun. It creates no Flow Designer flow. **Do not activate a Flow Designer alternative at the same time as the after-insert review rule**, or duplicate review tasks may result. The script creates the PDI demo schema only; manual mandatory fields, unique indexes and ACLs below remain hardening work, not completed features. Table field amounts use Integer with a validation limit of 1,000,000,000 paise.

# Step-by-step PDI lab
Build in your developer instance only. Your earlier Course Request lab already demonstrated extending Task: repeat that pattern for a **new** Jewellery Exchange Case table; do not modify Course Request or the invoice project.

1. Sign in to your `.service-now.com` developer instance as admin. In System Update Sets > Local Update Sets create `Jewellery Exchange Controls Demo`, set Current. Never put credentials in the project.
2. Use System Definition > Tables > New. Create `Jewellery Original`, name `u_jewel_original`, no parent. Add fields from `servicenow/SCHEMA.csv`. Put a unique index on `u_item_key`. Original amounts are trusted snapshots, not claimant input.
3. Create `Jewellery Redemption`, name `u_jewel_redemption`, no parent; unique `u_original_item`. This only represents a previously redeemed item for the lab. No payout automation.
4. Create `Jewellery Exchange Case`, `u_jewel_exchange_case`, extends Task. Add schema fields. Make custom result fields read-only in dictionary; retain inherited Number, State, Assignment group and Work notes. Use correlation_id for JEX identities; require it and configure a unique index for this dedicated table after checking existing values.
5. Create Script Include `JewelleryExchangePolicy` in Global; Active, not Client callable. Paste `servicenow/JewelleryExchangePolicy.js`. Match the class name exactly. These scripts assume Global `u_` table names; use your actual scoped names consistently if building scoped instead.
6. Add advanced Business Rule `Evaluate jewellery intake`, table Jewellery Exchange Case, Before, Insert only, Order 100. Paste `Before_Insert.js`. Add `Preserve evaluated intake`, Before, Update only, paste `Prevent_Intake_Changes.js`. Do not call current.update() in these rules.
7. On a disposable PDI, System Definition > Scripts - Background: run `Seed_Originals_PDI_ONLY.js`, inspect ten SYN bill items and one consumed ledger record. Then run `Seed_Cases_PDI_ONLY.js` once. These scripts skip matching records on rerun. Do not use in production.
8. Open `/u_jewel_exchange_case_list.do`. Add Number, Correlation ID, Original item, Claimed paise, Expected paise, Triage, Reasons. **Sequential expected: JEX-001..004 and JEX-010 ready; JEX-005..009, JEX-011 and JEX-012 held.** This differs deliberately from the local batch's duplicate-group treatment.
9. Inspect JEX-005: original ₹50,000 -> credit ₹27,500; claimed ₹28,750; variance ₹1,250; CREDIT_MISMATCH. Inspect JEX-006 for CUSTOMER_MISMATCH and ALREADY_EXCHANGED; JEX-007 for HIGH_VALUE_REVIEW; JEX-011 for repeat intake.
10. Build a Flow Designer flow: record created on this table, run once. If Triage = HOLD, create a child Task (parent = trigger case) assigned to your selected demo review group; short description `Jewellery exception review — <case number>`. If ready, create a child Task requesting maker/checker approval. Keep the parent open. A child task is a review request, not approval or payout. Add an approval action only after configuring a real demo approver and rejection branch. Never auto-close or issue credit.
11. Create reports: count by Triage; count by Reasons (multi-reason string, not deduplicated reason analytics); list outstanding review tasks. Save to `Jewellery Finance Demo` dashboard. Do not sum mismatch amounts as actual loss or savings.
12. Capture actual PDI list, mismatch case, flow execution details and reports into `evidence/screenshots/servicenow-*.jpg`. Redact names, instance identifiers and other unrelated data if sharing publicly. Record observed counts in `evidence/PLATFORM_STATUS.md`. Current verified status is recorded in PLATFORM_STATUS.md; do not confuse it with the optional Flow Designer extension.
13. Verify payload edits rejected, duplicate case IDs blocked, original snapshots protected and review task created once. Enforce table/field ACLs: intake users can create cases and read their authorized cases; reviewers can update Work notes/State only; trusted-snapshot and redemption writes restricted to a separate service role. Dictionary read-only is not sufficient security. Test ACLs using impersonation before production consideration.
14. Production prerequisite: audited merchant policy and tax base, real POS/ERP data owner, unique immutable item identifier, protected source/customer verification, atomic single-redemption reservation, roles/segregation of duties, safe retries, performance testing, merchant/legal signoff. This PDI lab is not a production financial system.
