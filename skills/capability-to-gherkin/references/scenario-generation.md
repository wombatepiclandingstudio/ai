# Scenario Generation Reference — Capability to Gherkin

## Feature Template

```gherkin
@capability @level2 @<l2-tag>
Feature: <L1 Capability Name>
  <L1 description>

  As a <business actor>
  I want to <L2 capability in business terms>
  So that <business value or outcome>

  Background:
    Given the system is in a valid initial state
    And standard test data is loaded

  @capability @level2 @<l2-tag> @happy-path
  Scenario: <L2 Capability Name> — happy path
    Given <preconditions from capability>
    When <triggering event>
    Then <expected outcome>
    And <additional verification>

  @capability @level2 @<l2-tag> @exception
  Scenario: <L2 Capability Name> — error case
    Given <error-triggering preconditions>
    When <invalid or failing action>
    Then <error is handled>
    And <system state is consistent>
```

## Scenario Outline Template

Use when the same business rule applies across multiple data values (rate limits, media types,
PII types, settings, filters). Size by distinct business outcome — one row per outcome.

```gherkin
@capability @level2 @<l2-tag> @boundary
Scenario Outline: <description>
  Given <context with "<param>">
  When <action>
  Then <outcome with "<result>">

  Examples:
    | param    | result        |
    | value-1  | outcome-A     |
    | value-2  | outcome-A     |
    | value-3  | outcome-B     |
```

## Standardized Verification Steps

Every state-changing Scenario must end with relevant `And` steps:

| Type | Pattern | When |
|------|---------|------|
| Audit log | `And an audit log entry should be recorded for the <event>` | Any write |
| Visible state | `And the <thing> should appear in the <view/list/feed>` | User-facing |
| Cascade | `And the downstream "<related-record>" should reflect the change` | Propagation |
| Metadata | `And the response metadata should include "<header>"` | API actions |

Use outcome-descriptive phrasing. Exact strings only when the string IS the business rule.

## Example — Full Scenario with Verification

```gherkin
@capability @level2 @order-fulfillment @happy-path
Scenario: Order shipment dispatch
  Given an order with status "ready_to_ship"
  When the fulfillment team marks it as shipped
  Then the order status should be "shipped"
  And an audit log entry should be recorded for the shipment
  And the shipment appears in the customer's order feed
  And the downstream invoice should be marked as finalized
  And the response metadata should include a "X-Shipped-At" timestamp
```

## Split Composite Scenarios

**Anti-pattern:**
```gherkin
Scenario: Customer lifecycle management
  Given a new customer is created
  And the customer's details are updated
  And the customer is archived
  Then all changes are reflected correctly   # which step failed?
```

**Correct:**
```gherkin
Scenario: Customer record creation
  Given no customer with that identifier exists
  When a new customer is registered
  Then the customer record should exist
  And an audit log entry should be created
  And the response metadata should include a creation timestamp

Scenario: Customer record update
  Given an existing customer record
  When the customer's details are updated
  Then the record should reflect the new values
  And the previous values should be preserved in the change history
```

## Rate Limit Example

```gherkin
@capability @level2 @api-rate-limiting @boundary
Scenario Outline: API request rate limit enforcement
  Given the rate limit window is "<window>"
  And "<request-count>" requests have already been made
  When the client sends one more request
  Then the response should be "<status>"
  And the response metadata should include a "Retry-After" header of "<retry-after>" seconds

  Examples:
    | window  | request-count | status      | retry-after |
    | 1 minute | 49           | 200 OK      | 0           |
    | 1 minute | 50           | 200 OK      | 0           |
    | 1 minute | 51           | 429 Too Many| 60          |
    | 1 minute | 100          | 429 Too Many| 60          |
```
