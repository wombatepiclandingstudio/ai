# Example: Customer Management Capability → Gherkin

This example demonstrates the full conversion pipeline for a single L1 capability with three
L2 sub-capabilities, drawn from the legacy-capability-extractor domain model.

## Input Capability Map (Markdown, from a6-domain-model.md)

````markdown
# Domain Model — Banking Platform

## Capability Hierarchy

Banking Platform
├── BC-001: Customer Onboarding
│   ├── BC-001-01: Customer Registration & Account Provisioning
│   ├── BC-001-02: Customer Profile Management
│   └── BC-001-03: Customer Communication
├── BC-002: Account Management
│   ├── ...
└── ...
````

### BC-001: Customer Onboarding

**Description:** Orchestrates customer acquisition from registration through KYC.

**Business Value:** Provides a 360-degree customer view for personalized service.

**Key Operations (L2):**

#### BC-001-01: Customer Registration & Account Provisioning

**Description:** Creates new customer records and provisions their primary accounts.

**Key Operations:**
- Create customer account (POST /api/v1/origination/customers)
- Validate email/phone uniqueness
- Register customer in core banking system
- Provision primary current account

**Key Entities:**
- OWNS: Customer (customers table)
- CREATES: Person (persons table)
- PROVISIONS: Account (accounts table)

**External Dependencies:**
- Core Banking System (customer registration)
- Email service (welcome email)

**Cross-Capability Dependencies:**
- → BC-002 Account Management (provisions primary account)

#### BC-001-02: Customer Profile Management

**Description:** Allows existing customers to view and update their personal information.

**Key Operations:**
- View current profile
- Update contact information
- Update communication preferences
- Audit profile changes

#### BC-001-03: Customer Communication

**Description:** Delivers outbound communications to customers based on their preferences.

**Key Operations:**
- Send order updates (email)
- Send payment reminders (SMS)
- Send account change confirmations (physical mail)
- Log communication delivery

**Actors:** Customer Service Representative, Marketing Team

---

## Output: Gherkin Feature File

`specs/customer-onboarding.feature`

```gherkin
# Traceability: legacy-capability-extractor a6-domain-model.md → BC-001 Customer Onboarding
# L2: BC-001-01 (Registration), BC-001-02 (Profile Management), BC-001-03 (Communication)
# Depends on: BC-002 Account Management

@capability @level1 @customer-onboarding
Feature: Customer Onboarding
  Orchestrates customer acquisition from registration through KYC.
  Provides 360-degree customer view for personalized service.

  As a Customer Service Representative
  I want to manage customer acquisition, profiles, and communication
  So that we can provide personalized service and maintain a complete customer view

  Background:
    Given the core banking system is available
    Given the email notification service is available
    Given standard test data is loaded

  # ============================================================
  # L2: BC-001-01 — Customer Registration & Account Provisioning
  # ============================================================

  @capability @level2 @registration @happy-path
  Scenario: Customer Registration & Account Provisioning — happy path
    Given a new customer wants to register
    When the customer submits valid registration information
    Then the customer record should be created in the system
    And a unique customer ID should be assigned
    And a welcome email should be sent to the customer
    And a primary current account should be provisioned
    And the customer should be registered in the core banking system

  @capability @level2 @registration @exception
  Scenario: Customer Registration — duplicate email rejected
    Given a customer with email "existing@example.com" already exists
    When a new registration is submitted with email "existing@example.com"
    Then registration should be rejected
    And an error message should be displayed to the registrant
    And no customer record should be created
    And no welcome email should be sent

  @capability @level2 @registration @boundary
  Scenario: Customer Registration — minimum required fields
    Given a new customer registers with only the minimum required fields
    When the registration form is submitted
    Then the customer should be created with a pending status
    And the customer should be prompted to complete their profile later

  # ============================================================
  # L2: BC-001-02 — Customer Profile Management
  # ============================================================

  @capability @level2 @profile-management @happy-path
  Scenario: Customer Profile Management — update contact information
    Given an existing customer with profile "John Doe"
    When the customer updates their email address to "john.updated@example.com"
    Then the contact information should be saved to the system
    And the updated information should be reflected across all systems
    And an audit log entry should be created

  @capability @level2 @profile-management @alternative
  Scenario: Customer Profile Management — update communication preference
    Given an existing customer with communication preference "email"
    When the customer changes their preference to "sms"
    Then the communication preference should be updated
    And future communications should be sent via SMS
    And the previous preference should remain in the audit log

  @capability @level2 @profile-management @exception
  Scenario: Customer Profile Management — invalid email format
    Given an existing customer is editing their profile
    When the customer enters an invalid email format "not-an-email"
    Then the update should be rejected
    And an error message should be displayed
    And the original email should remain unchanged

  # ============================================================
  # L2: BC-001-03 — Customer Communication
  # ============================================================

  @capability @level2 @communication @happy-path
  Scenario Outline: Customer Communication — by channel preference
    Given a customer with communication preference "<preference>"
    When a communication is sent regarding "<topic>"
    Then the communication should be delivered via "<channel>"
    And the delivery should be logged

    Examples:
      | preference | topic          | channel         |
      | email      | order update   | email           |
      | sms        | payment due    | text message    |
      | mail       | account change | physical letter |

  @capability @level2 @communication @exception
  Scenario: Customer Communication — delivery failure handling
    Given a customer whose email service is unreachable
    When a communication is sent to that customer
    Then the delivery should fail gracefully
    And the failure should be logged
    And the system should retry delivery up to 3 times
    And a notification should be sent to the operations team
```

## Conversion Notes

1. **Feature mapping:** BC-001 (L1) → Feature. BC-001-01/02/03 (L2) → Scenarios.
2. **Narrative:** Derived from the capability's description and business value.
3. **Background:** Shared preconditions from external dependencies (core banking system,
   email service) — common to ALL scenarios in this Feature.
4. **Scenario types:** Happy path for all L2s; alternative flow for profile preferences;
   exception handling for invalid input and delivery failures; boundary for minimum fields.
5. **Cross-capability:** The Feature header documents the dependency on BC-002 (Account
   Management). The Background's "core banking system is available" Given reflects this.
6. **Tags:** `@capability` (universal), `@level1` (on Feature), `@level2` (on Scenarios),
   per-L2 tags (`@registration`, `@profile-management`, `@communication`), and flow-type
   tags (`@happy-path`, `@exception`, `@alternative`, `@boundary`).
7. **Scenario Outline:** Used for BC-001-03 because the communication logic varies by
   channel preference — ideal for data-driven testing.
8. **Business language:** All steps describe outcomes in stakeholder terms. No database
   table names, class names, or HTTP methods appear in the scenario steps.
