# Traceability: <capability-map-source> → <L1 ID> <L1 Capability Name>
# L2: <L2 ID> (<L2 Name>), ...
# Depends on: <other L1 capabilities if any>

@capability @level1 @<l1-tag>
Feature: <L1 Capability Name>
  <L1 capability description>
  <Business value statement, if available>

  As a <primary business actor>
  I want to <L1 capability in business terms>
  So that <business value or outcome>

  Background:
    Given the system is in a valid initial state
    And standard test data is loaded

  # --- Happy Path ---
  @capability @level2 @<l2-tag> @happy-path
  Scenario: <L2 Capability Name> — happy path
    Given <preconditions from capability>
    When <triggering event>
    Then <expected outcome>
    And an audit log entry should be recorded for the <event>
    And the response metadata should include a timestamp
    # For user-facing capabilities, also add: And the <thing> should appear in the <view/list/feed>

  # --- Exception / Error ---
  @capability @level2 @<l2-tag> @exception
  Scenario: <L2 Capability Name> — error case
    Given <error-triggering preconditions>
    When <invalid or failing action>
    Then <error is handled>
    And <a single observable state assertion, e.g. the record remains unchanged>
    And an audit log entry should be recorded for the rejected <action>

  # --- Boundary / Edge (Scenario Outline) ---
  @capability @level2 @<l2-tag> @boundary
  Scenario Outline: <L2 Capability Name> — boundary values
    Given <preconditions>
    When the input contains "<boundary-value>"
    Then <expected boundary behavior>
    And the response metadata should include "<relevant-header>"

    Examples:
      | boundary-value | expected-behavior       |
      | <min-value>    | <behavior-at-min>       |
      | <max-value>    | <behavior-at-max>       |
      | <empty>        | <behavior-when-empty>   |

  # --- Data-Driven (Scenario Outline for rate limits, media types, PII, etc.) ---
  @capability @level2 @<l2-tag> @boundary
  Scenario Outline: <L2 Capability Name> — <data-driven-aspect>
    Given <preconditions for this data set>
    When the input "<input-value>" is provided
    Then <expected outcome for this row>
    And the response metadata should include "<relevant-header>"

    Examples:
      | input-value | expected outcome        |
      | <value-1>   | <outcome-for-value-1>   |
      | <value-2>   | <outcome-for-value-2>   |
      | <value-3>   | <outcome-for-value-3>   |

  # --- Security ---
  @capability @level2 @<l2-tag> @security
  Scenario: <L2 Capability Name> — unauthorized access
    Given an existing <entity>
    And a user without "<required-permission>" is authenticated
    When the user attempts the <operation>
    Then the request should be rejected as unauthorized
    And an audit log entry should be recorded for the denied access attempt
    And no sensitive data should be returned in the response

  # --- Concurrency ---
  @capability @level2 @<l2-tag> @concurrency
  Scenario: <L2 Capability Name> — concurrent modification
    Given <entity> exists in the system
    When two concurrent operations modify <entity> simultaneously
    Then exactly one operation should succeed
    And the other should fail with a concurrency conflict
    And an audit log entry should be recorded for the concurrency conflict

  # --- Cross-Capability ---
  @capability @level2 @<l2-tag> @cross-capability
  Scenario: <L2 Capability Name> — depends on <related L1 capability>
    Given the <related L1 capability> is in a valid state
    When <operation in this capability>
    Then <outcome>
    And the downstream <related-entity> should reflect the change
    And an audit log entry should be recorded for the cross-capability change

  # RULE: Never combine multiple operations (composite lifecycle) in one Scenario.
  # Split CRUD or lifecycle flows into separate Scenarios, each with its own Given/When/Then
  # and verification steps (audit log, visible state, cascade effects, response metadata).
  # See assets/scenario-examples.md section 8 for anti-pattern vs. correct split examples.

  # Add additional scenarios for:
  #   @alternative   — valid but different path
  #   User-facing: add "And the <thing> should appear in the <view>" to the Then steps
#   @regression  — bug finding from the map, stated as the required business outcome
  #   Data-driven: use Scenario Outline + Examples for rate limits, media types, PII,
  #   setting keys, and filter values
