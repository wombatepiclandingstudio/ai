# Anti-Patterns — Capability to Gherkin

## 1. Technical language in scenarios

**Symptom:** Steps reference database tables, class names, HTTP codes, or framework methods.
**Fix:** Rewrite in business terms. "Then the customer is saved to the database" becomes
"Then the customer should be able to log in."

## 2. Implementation details as scenarios

**Symptom:** Scenarios describe *how* the system works (API calls, UI clicks, SQL queries)
rather than *what* the system should do.
**Fix:** Focus on business outcomes. The system's internal mechanism should not appear in
the Feature.

## 3. Missing actor or business value

**Symptom:** A Feature has no "As a / I want / So that" narrative.
**Fix:** Every Feature must state who benefits, what they need, and why. If actors or value
are missing from the input, infer them from the capability description or flag for review.

## 4. One giant scenario per capability

**Symptom:** A single scenario tries to test the entire happy path AND all error cases.
**Fix:** Split into granular scenarios. One business rule → one scenario. A CRUD lifecycle
spawns four scenarios (create, read, update, delete), each with its own Given/When/Then and
standardized verification steps.

## 5. Composite scenario testing multiple operations

**Symptom:** A Scenario performs create → read → update → delete in one flow.
**Fix:** Split into one Scenario per operation. Each split scenario must have independent
preconditions and a clear single outcome. This gives better failure isolation in CI: when
the update step fails, only the update Scenario fails — not the entire lifecycle.

## 6. Missing standardized verification steps

**Symptom:** A write Scenario ends after the primary `Then` outcome with no audit, UI,
cascade, or metadata checks.
**Fix:** Every state-changing Scenario must end with relevant `And` verification steps from
this set: audit log entry, UI state confirmation, cascade effects, response metadata.

## 7. Insufficient data-driven coverage

**Symptom:** Only one scenario exists for a capability that varies by input (rate limits,
media types, PII types).
**Fix:** Use `Scenario Outline` with `Examples:` tables. Each distinct business outcome is a
separate row; size by outcome, not by count (Stage 3).

## 8. Under-tagged scenarios

**Symptom:** Scenarios carry only `@capability @level2` with no semantic flow-type tag.
**Fix:** Every Scenario must carry one of: `@happy-path`, `@alternative`, `@exception`,
`@boundary`, `@cross-capability`, `@security`, `@concurrency`. Tags enable CI to run
targeted subsets (e.g. `cucumber --tags @security` for pen-test runs).

## 9. Missing cross-capability scenarios

**Symptom:** The dependency map shows 10 cross-capability relationships but only 2 are
tested.
**Fix:** For each dependency edge in the capability map, generate at least one
`@cross-capability` Scenario. These live in the most relevant Feature and reference the
dependent capability in their `Given` preconditions.

## 10. No OpenSpec linkage (when OpenSpec is in use)

**Symptom:** Gherkin files are generated but not linked to OpenSpec proposals.
**Fix:** Always create or update an OpenSpec change when the project uses OpenSpec. This
maintains the traceability chain from business capability → Gherkin spec → implementation.

## 11. Multi-persona Feature

**Symptom:** A Feature needs two "As a" lines (e.g. one for prospects, one for enrolled
members) — usually after mechanically mapping one L1 to one Feature.
**Fix:** Split along actor seams into sub-features with lineage back to the L1 (Stage 2).
A Feature is one actor pursuing one value.

## 12. OR-shaped outcome

**Symptom:** A `Then` step offers alternatives — "the enrollment is rejected or waitlisted",
"succeeds or returns an error".
**Fix:** Pin the policy. An OR cannot be asserted; decide (or surface to the owner) which
branch the business requires, and write that.

## 13. Exact-string coupling to an unborn vocabulary

**Symptom:** Steps assert audit codes, error codes, or UI labels that no product decision
has defined yet — one rename breaks dozens of scenarios.
**Fix:** Use outcome-descriptive steps (Stage 3). Reserve exact strings for when the string
itself is the business rule.

## 14. Skipping validation

**Symptom:** The generated specs are delivered on the strength of a self-graded checklist,
unparsed and unreviewed.
**Fix:** Run Stage 6: machine-parse every file, then adversarially re-read for contradictory
windows, invented attributes, vague assertions, and persona leakage.
