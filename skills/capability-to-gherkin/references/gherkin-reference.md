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
- Recommended tags for this skill: `@capability`, `@level1`, `@level2`, a per-L2 descriptor
  tag (e.g. `@registration`), and a flow-type tag (`@happy-path`, `@alternative`,
  `@exception`, `@boundary`).

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
2. **Business language** — Write steps in terms stakeholders understand. Avoid "click button"
   or "POST to /api" — describe the business action instead.
3. **Declarative, not imperative** — Describe *what* should happen, not *how* to click through
   a UI. ("The customer can log in" instead of "Click the login button and enter text.")
4. **Use Background sparingly** — Only for preconditions shared by ALL scenarios.
5. **Prefer Scenario Outline** when the same logic applies to multiple data sets.
6. **Data tables for complex input** — More readable than chains of `And` steps.
7. **Meaningful scenario titles** — Names should describe the business situation being tested.
8. **Consistent step wording** — Reuse the same Given/When/Then phrasing across scenarios so
   step definitions can be shared.
9. **Never assert UI state in business terms** — If a step says "Then the customer should be
   added to the database," the definition can check the DB; the stakeholder only sees the
   business outcome.

## Common Syntax Pitfalls

| Pitfall | Example (wrong) | Fix |
|---------|-----------------|-----|
| Missing colon after keyword | `Feature Customer Management` | `Feature: Customer Management` |
| Wrong indentation | Steps at Feature level | Indent steps under `Scenario:` |
| Placeholder not in angle brackets | `Scenario Outline: <name>` without `Examples:` | Add `Examples:` table |
| Mixing step types | `Given` after `Then` | Reorder: Given → When → Then |
| Using "should" in Given/When | `Given the customer should exist` | `Given the customer exists` ("should" is for Then) |
| Scenario outside Feature | `Scenario:` at top level | Scenarios must be inside a `Feature:` |
