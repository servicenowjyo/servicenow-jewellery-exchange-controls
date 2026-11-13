# Verified platform evidence — November 13, 2026

The user signed into their ServiceNow developer instance. Codex created three isolated `u_jewel_` tables (case extends Task), Script Include, three Business Rules, demo navigation module, native list columns and an admin-content custom UI Page. No real merchant or customer data was used.

Observed persisted cases: 12. READY_FOR_APPROVAL: 5. HOLD: 7. Exactly one review task per case: 12 total. Intake-edit rejection tested and passed. Review tasks are assigned to the PDI admin for demonstration; this does not demonstrate segregation of duties or completed approval. No credit, refund or payout was executed.

`servicenow-verification.txt` contains the captured server output. `schema-log.txt` and `servicenow-seed-log.txt` contain captured creation/seed messages. `platform-dashboard-dom.txt` is captured rendered page content.

Screenshots are actual browser captures, not generated platform mockups:
- servicenow-dashboard.jpg — custom UI Page querying live synthetic case records and review count.
- servicenow-native-list.jpg — native case list, twelve records.
- servicenow-held-cases.jpg — native HOLD filter, seven records.
- servicenow-review-tasks.jpg — native list of generated human-review tasks.
- servicenow-verification.jpg — script result and immutable-intake test.

Local engine: 20 tests passed; 12 claims, 4 ready/8 held. Batch logic holds both duplicated claims; sequential PDI logic holds only the later claim. The infographic intentionally states LOCAL demo counts. No production saving or merchant handling-time baseline was measured.

Not implemented/verified: Flow Designer flow, native reports, merchant integration, formal approval completion, ERP posting, tax calculation, unique database constraints, full role/ACL model or concurrency safety. These remain documented extensions/prerequisites. Automated schema scripts do not create the manual unique indexes/ACLs described in the guide. The dashboard hides data from non-admin via server-side check; table-level access has only been tested as admin. This is a PDI-only learning lab.
