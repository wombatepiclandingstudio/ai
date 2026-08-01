# Gherkin Reference Guide

A concise reference for Gherkin syntax and step-definition conventions across BDD frameworks.
This is the detail behind Stage 4 of the `SKILL.md` pipeline.

## Primary Resources

| Resource | Description | Link |
|----------|-------------|------|
| Cucumber Gherkin Reference | Official syntax and keyword documentation | https://cucumber.io/docs/gherkin/reference |
| Behat Gherkin Guide | Business-readable DSL documentation | https://docs.behat.org/en/v2.5/guides/1.gherkin.html |
| Gherkin Syntax Tutorial | Step-by-step writing guide | https://automationpanda.com/2017/01/27/bdd-101-gherkin-by-example |
| Writing Better Gherkin | Best practices and patterns | https://cucumber.io/docs/bdd/better-gherkin |

## Gherkin Keywords

### Feature

```gherkin
Feature: Customer Management
  Manages all customer-related activities and data.

  As a Customer Service Representative
  I want to manage customer information and interactions
  So that we can provide personalized service
```

- `Feature:` — Title (one line). Should match the L1 capability name.
- Description (optional, free-text after the title) — Explains the feature's purpose.
- `As a ...` — The business role benefiting from this feature.
- `I want to ...` — The capability the role needs.
- `So that ...` — The business value or outcome.

### Background

```gherkin
Background:
  Given the system is initialized with standard test data
  And the customer management module is loaded
```

- Shared preconditions for ALL scenarios in the Feature.
- Do not put feature-specific setup here — use it only for truly universal preconditions.

### Scenario

```gherkin
@capability @level2 @happy-path
Scenario: Customer Registration — happy path
  Given a new customer wants to register
  When the customer submits valid registration information
  Then the customer should be added to the database
  And a welcome email should be sent
```

- `Scenario:` — Title describing the flow being tested.
- `Given` — Preconditions (state the system must be in).
- `When` — The triggering event or action.
- `Then` — The expected outcome or verification.
- `And` — Additional steps of the same type as the preceding keyword.
- `But` — A negative condition (rarely needed; prefer `And` with clear language).

### Scenario Outline

```gherkin
@capability @level2 @communication
Scenario Outline: Customer Communication — by preference
  Given a customer with communication preference "<preference>"
  When a communication is sent regarding "<topic>"
  Then the communication should be delivered via "<channel>"

  Examples:
    | preference | topic         | channel         |
    | email      | order update  | email           |
    | sms        | payment due   | text message    |
    | mail       | account change| physical letter |
```

- Use when the same scenario should run with multiple data sets.
- `Scenario Outline:` + `Examples:` table with placeholder columns.
- Placeholders in `<angle brackets>` are replaced by table values at runtime.

### Data Tables

```gherkin
Given the following customers exist:
  | name        | email              | status  |
  | John Doe    | john@example.com   | active  |
  | Jane Smith  | jane@example.com   | pending |
```

- Use for multi-row/multi-column structured input.
- More readable than long chains of `And` steps.

### Tags

```gherkin
@capability @level1
Feature: Customer Management

  @capability @level2 @registration
  Scenario: Customer Registration
    ...

  @capability @level2 @registration @exception
  Scenario: Registration with Invalid Email
    ...
```

- Tags annotate Features and Scenarios for filtering and organization.
- Place tags on the line(s) immediately above the element they annotate.
- Required base tags: `@capability`, `@level1`, `@level2`, a per-L2 descriptor tag (e.g.
  `@registration`), and a semantic flow-type tag.
- Semantic flow-type tags: `@happy-path`, `@alternative`, `@exception`, `@boundary`,
  `@cross-capability`, `@security`, `@concurrency`.
- Use `@openspec` when the feature originated from an OpenSpec proposal.

### Semantic tag reference

| Tag               | Purpose                                              | CI use case                    |
|-------------------|------------------------------------------------------|--------------------------------|
| `@happy-path`     | Standard successful execution                        | Always run                     |
| `@alternative`    | Valid but non-default path                           | Regression suite               |
| `@exception`      | Error handling and validation failures               | Error-path suite               |
| `@boundary`       | Edge values, rate limits, threshold checks           | Nightly edge-case run          |
| `@cross-capability` | Exercises dependency on another capability           | Integration suite              |
| `@security`       | AuthZ, authN, PII handling, access control           | Pen-test / security scan       |
| `@concurrency`    | Race conditions, simultaneous writes, load behavior  | Concurrency / load test suite  |

## Standardized Verification Steps

Every Scenario that mutates state must end with relevant `And` verification steps. Apply the
subset appropriate to the capability. These steps are mandatory for all write operations.

### Audit log entry

```gherkin
And an audit log entry should be created with "ORDER_SHIPPED"
```

Records the action in the system audit trail. Use the business action name in all-caps.

### UI state confirmation

```gherkin
And the UI should show "Shipped — tracking ABC123"
```

Confirms the end-user-facing state after an operation. Use for any UI-facing capability.

### Cascade effects

```gherkin
And the downstream invoice should be marked as finalized
```

Confirms that related records or downstream systems reflect the state change.

### Response metadata

```gherkin
And the response metadata should include an "X-Shipped-At" timestamp
```

Confirms API-level headers or metadata returned with the response. Use for all API-facing
capabilities.

### Combined example

```gherkin
@capability @level2 @order-fulfillment @happy-path
Scenario: Order shipment dispatch
  Given an order with status "ready_to_ship"
  When the fulfillment team marks it as shipped
  Then the order status should be "shipped"
  And an audit log entry should be created with "ORDER_SHIPPED"
  And the UI should show "Shipped — tracking ABC123"
  And the downstream invoice should be marked as finalized
  And the response metadata should include an "X-Shipped-At" timestamp
```

## Step-Definition Conventions by Framework

### Cucumber (JavaScript/TypeScript)

```javascript
// features/step_definitions/customer.steps.js
import { Given, When, Then } from '@cucumber/cucumber';

Given('a new customer wants to register', function () {
  // setup
});

When('the customer submits valid registration information', function () {
  // action
});

Then('the customer should be added to the database', function () {
  // assertion
});
```

- Steps live in `features/step_definitions/`.
- Each step is a regex or string match against Gherkin step text.
- Use `function () {}` (not arrow functions) to access `this` (the World).

### Cucumber (Java)

```java
// src/test/java/stepdefs/CustomerSteps.java
package stepdefs;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.cucumber.java.en.Then;

public class CustomerSteps {
    @Given("a new customer wants to register")
    public void a_new_customer_wants_to_register() { /* ... */ }
}
```

- Step classes in `src/test/java/stepdefs/`.
- Annotation per keyword: `@Given`, `@When`, `@Then`, `@And`, `@But`.
- Package name should match `glue` in `cucumber.properties` or runner config.

### SpecFlow (.NET)

```csharp
// Features/StepDefinitions/CustomerSteps.cs
[Binding]
public sealed class CustomerSteps
{
    [Given(@"a new customer wants to register")]
    public void GivenANewCustomerWantsToRegister() { /* ... */ }
}
```

- `.feature` files go in `Features/`.
- Step definitions in `Features/StepDefinitions/` with `[Binding]` classes.
- Regex uses `@"..."` verbatim strings with `@"..."`.

### Behat (PHP)

```php
// features/bootstrap/CustomerContext.php
use Behat\Behat\Context\Context;
use Behat\Gherkin\Node\PyStringNode;

class CustomerContext implements Context
{
    /**
     * @Given a new customer wants to register
     */
    public function aNewCustomerWantsToRegister() { /* ... */ }
}
```

- Context classes implement `Behat\Behat\Context\Context`.
- Steps are annotated with `@Given`, `@When`, `@Then`, etc.
- Contexts are registered in `behat.yml` under `contexts:`.

### Pytest-BDD (Python)

```python
# features/steps/customer_steps.py
from pytest_bdd import scenarios, given, when, then

scenarios('../features/customer.feature')

@given("a new customer wants to register")
def new_customer():
    # setup
    pass
```

- Scenarios imported from `.feature` files.
- Step functions decorated with `@given`, `@when`, `@then`.
- Fixtures can inject state between steps.

## Best Practices

1. **One rule per scenario** — Don't combine multiple business rules in a single Scenario.
2. **Split composite scenarios** — A Scenario that walks a CRUD lifecycle or multiple
   operations must be split into one Scenario per operation. Each split Scenario has its own
   Given/When/Then and ends with verification `And` steps.
3. **Use Scenario Outline + Examples for variable data** — When the same rule applies to
   multiple distinct data values (rate limits, media types, PII types, setting keys, filter
   values), use `Scenario Outline` with `Examples:`. Each row is an independent test
   execution.
4. **Standardized verification steps** — Every state-changing Scenario must end with `And`
   verification steps: audit log entry, UI state confirmation, cascade effects, and response
   metadata. These are mandatory for write operations.
5. **Semantic tags** — Every Scenario carries a flow-type tag: `@happy-path`, `@alternative`,
   `@exception`, `@boundary`, `@cross-capability`, `@security`, `@concurrency`. These enable
   targeted CI execution (e.g. `cucumber --tags @security`).
6. **Cross-capability coverage** — For each dependency edge in the capability map, generate a
   `@cross-capability` Scenario. Missing dependency coverage is a gate violation.
7. **Business language** — Write steps in terms stakeholders understand. Avoid "click button"
   or "POST to /api" — describe the business action instead.
8. **Declarative, not imperative** — Describe *what* should happen, not *how* to click through
   a UI. ("The customer can log in" instead of "Click the login button and enter text.")
9. **Use Background sparingly** — Only for preconditions shared by ALL scenarios.
10. **Data tables for complex input** — More readable than chains of `And` steps.
11. **Meaningful scenario titles** — Names should describe the business situation being tested.
12. **Consistent step wording** — Reuse the same Given/When/Then phrasing across scenarios so
    step definitions can be shared.

## Common Syntax Pitfalls

| Pitfall | Example (wrong) | Fix |
|---------|-----------------|-----|
| Missing colon after keyword | `Feature Customer Management` | `Feature: Customer Management` |
| Wrong indentation | Steps at Feature level | Indent steps under `Scenario:` |
| Placeholder not in angle brackets | `Scenario Outline: <name>` without `Examples:` | Add `Examples:` table |
| Mixing step types | `Given` after `Then` | Reorder: Given → When → Then |
| Using "should" in Given/When | `Given the customer should exist` | `Given the customer exists` ("should" is for Then) |
| Scenario outside Feature | `Scenario:` at top level | Scenarios must be inside a `Feature:` |
| Composite scenario (CRUD in one) | Create + read + update + delete in one Scenario | Split: one Scenario per operation |
| Missing verification steps | Write Scenario ends with only primary `Then` | Add `And` audit log, UI state, cascade, metadata checks |
| Data-driven capability as plain Scenario | One Scenario for all rate limit values | Use `Scenario Outline` + `Examples:` with one row per value |
| Missing semantic tag | Only `@capability @level2` on a Scenario | Add `@happy-path`, `@boundary`, `@security`, etc. |
| Missing cross-capability Scenario | Dependency edge in map with no `@cross-capability` Scenario | Add one Scenario per dependency edge |
