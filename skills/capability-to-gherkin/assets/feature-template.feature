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

  @capability @level2 @<l2-tag> @boundary
  Scenario Outline: <L2 Capability Name> — boundary values
    Given <preconditions>
    When the input contains "<boundary-value>"
    Then <expected boundary behavior>

    Examples:
      | boundary-value |
      | <min-value>    |
      | <max-value>    |
      | <empty>        |

  # Add additional scenarios for:
  #   @alternative   — valid but different path
  #   @cross-capability — exercises dependencies on other Features
