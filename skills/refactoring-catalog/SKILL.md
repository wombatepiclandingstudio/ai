---
name: refactoring-catalog
description: >
  Refactor code safely using Martin Fowler's proven catalog of behavior-preserving
  transformations. Paste code with code smells (long methods, large classes, duplication,
  feature envy, switch statements) — get specific refactoring recommendations with
  before/after examples, the exact catalog technique to apply, and test verification
  steps. Includes automated smell detection guidance and the full Composing Methods,
  Moving Features, Organizing Data, Simplifying Conditionals, and Generalization catalog.
---

**Scope:** Applies Martin Fowler's disciplined refactoring technique: a series of small, behavior-preserving transformations that improve internal structure without changing external behavior. Each refactoring is a named, proven technique with clear mechanics.

---

## Zero — Core Concepts

**Seven Principles of Refactoring:**

1. **Refactoring is behavior-preserving** — external behavior never changes
2. **Small, incremental steps** — each change is tiny and safe
3. **Tests are mandatory** — never refactor without a test suite
4. **Code smells are signals** — they tell you where to refactor
5. **The catalog is a vocabulary** — named techniques with proven mechanics
6. **Clean code is the goal** — obvious, minimal, no duplication, passes all tests
7. **Refactoring is continuous** — not a one-time activity; part of daily development

**When to Refactor:**

| Trigger | Action |
|---------|--------|
| **The Rule of Three** | When you find yourself doing the same thing three times, refactor |
| **Before adding a feature** | Clean up so the new feature is easier to add |
| **After adding a feature** | Refactor to improve the design you just worked with |
| **When fixing a bug** | Understand the code better; clean up while you're in there |
| **During code review** | Use the catalog to identify opportunities |
| **Technical debt accumulates** | When code becomes hard to understand or modify |

---

## One — When to Use

- The user asks to refactor, clean up, or restructure existing code
- Code smells are identified (long methods, large classes, duplication, etc.)
- Before adding a feature to messy code — clean up first
- After adding a feature — improve the design you just worked with
- When fixing a bug — understand the code better while you're in there
- During code review — identify refactoring opportunities
- The user mentions "technical debt," "code smells," "clean code," or "design improvement"

**Do NOT use when:**

- The user is writing new code from scratch (no existing code to refactor)
- There are no tests and the user won't write characterization tests first
- The user wants to rewrite the entire system (that's a rewrite, not refactoring)
- The request is about performance optimization (refactoring preserves behavior, not improves performance)

---

## Two — Hard Prohibitions

> **HR-1.** Do NOT refactor without a test suite — tests are mandatory.

> **HR-2.** Do NOT change external behavior — refactoring is behavior-preserving only.

> **HR-3.** Do NOT make large, risky changes — always small, incremental steps.

> **HR-4.** Do NOT continue if tests fail after a refactoring step — fix or revert first.

> **HR-5.** Do NOT introduce new code smells while fixing existing ones.

> **HR-6.** Do NOT refactor without first identifying the code smell (use the catalog).

> **HR-7.** Do NOT skip automated smell detection — run tools before manual review.

> **HR-8.** Do NOT refactor code with no tests without writing characterization tests first (use legacy-code-workshop).

---

## Three — Decision Tree: Which Refactoring to Apply

```
What code smell are you seeing?
├── Long Method (function does too much)
│   └── APPLY → Extract Method
│               Turn code fragment into its own method with descriptive name
├── Large Class (too many fields/methods)
│   └── Does it have two distinct responsibilities?
│       ├── YES → Extract Class
│       └── NO → Is it doing too little?
│           ├── YES → Inline Class
│           └── NO → Extract Class (split by cohesion)
├── Duplicate Code
│   ├── Same code in subclasses?
│   │   └── APPLY → Pull Up Method
│   ├── Same code in one class?
│   │   └── APPLY → Extract Method
│   └── Same code in different classes?
│       └── APPLY → Extract Method + Pull Up or Extract Superclass
├── Feature Envy (method uses another class's data more)
│   └── APPLY → Move Method
│               Move to the class where it's used most
├── Switch Statements (long chains of if-else/switch)
│   └── APPLY → Replace Conditional with Polymorphism
├── Data Clumps (fields always appear together)
│   └── APPLY → Extract Class
├── Long Parameter List
│   └── APPLY → Introduce Parameter Object
├── Primitive Obsession
│   └── APPLY → Replace Data Value with Object
├── Temporary Field (used only in certain circumstances)
│   └── APPLY → Extract Class
├── Message Chains (a.getB().getC())
│   └── APPLY → Hide Delegate
├── Middle Man (class just delegates everything)
│   └── APPLY → Remove Middle Man
├── Divergent Change (one class changed for many reasons)
│   └── APPLY → Extract Class
├── Shotgun Surgery (one change touches many classes)
│   └── APPLY → Move Method / Move Field
├── Parallel Inheritance Hierarchies
│   └── APPLY → Move Method
├── Refused Bequest (subclass doesn't use inherited members)
│   └── APPLY → Replace Inheritance with Delegation
├── Dead Code
│   └── APPLY → Remove
├── Comments (explaining bad code)
│   └── APPLY → Fix the code, not the comment
└── Speculative Generality (code created "just in case")
    └── APPLY → Inline Class / Remove
```

---

## Four — Process: Refactoring Mechanics

Every refactoring follows this process:

1. **Ensure tests exist** — characterize current behavior
2. **Make a small change** — one behavior-preserving transformation
3. **Run tests** — verify nothing broke
4. **Repeat** — make the next small change
5. **Clean up** — remove any intermediate artifacts

### Code Smells Catalog

**Bloaters:**

| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Long Method** | A method that does too much | Extract Method |
| **Large Class** | A class with too many fields/methods | Extract Class |
| **Primitive Obsession** | Using primitives instead of small objects | Replace Data Value with Object |
| **Long Parameter List** | Methods with too many parameters | Introduce Parameter Object |
| **Data Clumps** | Groups of fields that always appear together | Extract Class |

**Object-Orientation Abusers:**

| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Switch Statements** | Long chains of switch/if-else | Replace Conditional with Polymorphism |
| **Temporary Field** | Fields used only in certain circumstances | Extract Class |
| **Refused Bequest** | Subclass doesn't use inherited members | Replace Inheritance with Delegation |
| **Alternative Classes** | Classes that do the same thing but differently | Unify Interface |

**Change Preventers:**

| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Divergent Change** | One class changed for many different reasons | Extract Class |
| **Shotgun Surgery** | One change requires modifications in many classes | Move Method / Move Field |
| **Parallel Inheritance Hierarchies** | Subclassing one requires subclassing another | Move Method |

**Dispensables:**

| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Comments** | Comments that explain bad code | Fix the code, not the comment |
| **Duplicate Code** | Same structure in more than one place | Extract Method / Pull Up Method |
| **Lazy Class** | A class not doing enough to earn its keep | Inline Class |
| **Data Class** | Classes that only hold data | Move Method / Encapsulate Collection |
| **Dead Code** | Code never executed or reachable | Remove |
| **Speculative Generality** | Code created "just in case" | Inline Class / Remove |

**Couplers:**

| Smell | Description | Primary Refactoring |
|-------|-------------|-------------------|
| **Feature Envy** | A method uses data from another class more than its own | Move Method |
| **Inappropriate Intimacy** | Classes too dependent on each other's internals | Move Method / Hide Delegate |
| **Message Chains** | Navigating through multiple objects (`a.getB().getC()`) | Hide Delegate |
| **Middle Man** | A class that does nothing but delegate | Remove Middle Man |

### Refactoring Catalog by Category

**Composing Methods:**

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Extract Method** | Turn a code fragment into its own method with a descriptive name | Long method, unclear intent |
| **Inline Method** | Put the method's body into the callers and remove the method | Method body is as clear as the name |
| **Extract Variable** | Assign a complex expression to a named temporary variable | Complex expressions |
| **Inline Temp** | Use the variable expression everywhere instead of a temp | Temp is used once |
| **Replace Temp with Query** | Extract the expression into a method | Temp's value is used in multiple places |
| **Split Temporary Variable** | If a temp is assigned more than once, split into separate variables | Same temp for unrelated purposes |
| **Remove Assignments to Parameters** | Don't reassign parameters; use a local variable instead | Side-effect on parameters |
| **Replace Method with Method Object** | Turn a long method into its own object so locals become fields | Very long local variables |
| **Substitute Algorithm** | Replace the method body with a cleaner algorithm | Simpler way to express |

**Moving Features Between Objects:**

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Move Method** | Move a method to the class where it's used most | Method used more in another class |
| **Move Field** | Move a field to the class where it's used most | Field used more in another class |
| **Extract Class** | Split a class doing work that should be two classes | Two responsibilities |
| **Inline Class** | Fold a class into another | Class isn't doing enough alone |
| **Hide Delegate** | Encapsulate delegation | Client shouldn't know about delegate |
| **Remove Middle Man** | Remove the middleman if a class just delegates everything | Too much delegation |
| **Introduce Foreign Method** | Create a method in a class that takes another class's instance | Adding behavior to third-party class |
| **Introduce Local Extension** | Create a subclass or wrapper to extend a class | Need to add methods to existing class |

**Organizing Data:**

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Self Encapsulate Field** | Replace direct field access with getter/setter | Need to control access |
| **Replace Data Value with Object** | Turn a simple value into an object | Value with behavior needed |
| **Change Value to Reference** | Turn a value into a shared reference | Need shared identity |
| **Change Reference to Value** | Turn a reference into an immutable value | No shared identity needed |
| **Replace Array with Object** | Replace an array with an object with named fields | Array has different elements with meaning |
| **Replace Magic Number with Symbolic Constant** | Use named constants instead of literal numbers | Magic numbers in code |
| **Encapsulate Field** | Make a public field private with accessors | Public field needs control |
| **Encapsulate Collection** | Return read-only views of collections | Need to control collection access |
| **Replace Type Code with Class** | Replace type codes with a class | Type-safe alternatives needed |
| **Replace Type Code with Subclasses** | Replace type codes with polymorphic subclasses | Different behavior per type |
| **Replace Type Code with State/Strategy** | Replace type codes with state or strategy pattern | Type changes at runtime |
| **Replace Subclass with Fields** | Replace subclasses with fields in parent | Subclasses don't differ in behavior |

**Simplifying Conditional Expressions:**

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Decompose Conditional** | Extract the condition into a method | Complex condition |
| **Consolidate Conditional Expression** | Combine several conditionals into one | Same result from different conditions |
| **Consolidate Duplicate Conditional Fragments** | Move duplicate code outside conditionals | Same code in if/else branches |
| **Remove Control Flag** | Replace control flag variable with break/return | Variable used to control flow |
| **Replace Nested Conditional with Guard Clauses** | Use early returns for special cases | Deep nesting |
| **Replace Conditional with Polymorphism** | Replace type-checking with polymorphism | Long switch/if-else on type |
| **Introduce Null Object** | Return a Null Object instead of null | Repeated null checks |
| **Introduce Assertion** | Add assertions to state invariants | Precondition/postcondition |

**Simplifying Method Calls:**

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Rename Method** | Rename to clearly communicate purpose | Name doesn't reveal intent |
| **Add Parameter** | Add a parameter | Need more information |
| **Remove Parameter** | Remove unused parameter | Parameter no longer needed |
| **Separate Query from Modifier** | Split method into query and modifier | Method does two things |
| **Parameterize Method** | Merge methods that differ only in values | Similar methods with different parameters |
| **Replace Parameter with Explicit Methods** | Create separate methods instead of boolean parameter | Boolean flag controls behavior |
| **Preserve Whole Object** | Pass the whole object instead of extracted values | Many values from one object |
| **Replace Parameter with Method Call** | Call the object instead of passing value | Value derivable from another object |
| **Introduce Parameter Object** | Group parameters that always go together | Long parameter lists |
| **Remove Setting Method** | Remove setters for fields that shouldn't change | Field should be immutable |
| **Hide Method** | Make a method private | Method not needed by other classes |
| **Replace Constructor with Factory Method** | Use a factory for more expressive construction | Complex construction logic |
| **Replace Error Code with Exception** | Use exceptions instead of return codes | Error codes force coupling |
| **Replace Exception with Test** | Check before calling instead of catching | Caller should check first |

**Dealing with Generalization:**

| Refactoring | Description | When to Use |
|-------------|-------------|-------------|
| **Pull Up Field** | Move field to parent class | Same field in multiple subclasses |
| **Pull Up Method** | Move method to parent if identical in subclasses | Duplicate method in subclasses |
| **Pull Up Constructor Body** | Factor common constructor logic to parent | Duplicate constructor code |
| **Push Down Method** | Move method to subclass if only it needs it | Method only relevant in one subclass |
| **Push Down Field** | Move field to subclass if only it uses it | Field only relevant in one subclass |
| **Extract Subclass** | Create a subclass for a portion of a class | Part of a class has different responsibility |
| **Extract Superclass** | Create a parent for two similar classes | Common features across classes |
| **Extract Interface** | Create interface for shared operations | Multiple classes share method signatures |
| **Collapse Hierarchy** | Merge subclass and parent if no longer different | Subclass adds nothing |
| **Form Template Method** | Move invariant parts to parent, vary the rest | Subclasses differ only in steps |
| **Replace Inheritance with Delegation** | Use composition instead of inheritance | Subclass doesn't need inherited behavior |
| **Replace Delegation with Inheritance** | Use inheritance when delegation is excessive | Wrapper does nothing but delegate |

### Automated Smell Detection

| Smell | Tool/Technique | What to Look For |
|-------|---------------|------------------|
| Long Method | `wc -l` per function, IDE "method length" | Functions > 20 lines |
| Large Class | `wc -l` per class, LCOM metric | Classes > 300 lines or LCOM > 10 |
| Duplicate Code | `jscpd`, `CPD` (PMD), `sonarqube` | Copy-pasted blocks > 5 lines |
| Deep Nesting | `radon` (Python), `CodeClimate` | Nesting depth > 3 |
| Magic Numbers | `grep -n '[0-9]\{3,\}' src/` | Numeric literals > 2 digits |
| Long Parameter List | AST analysis, IDE inspection | Methods > 3 parameters |
| Feature Envy | LCOM/CBO metrics | Methods using another class's data more than own |
| Dead Code | `deadcode` (Python), `ts-prune` (TS) | Unused exports, unreachable code |

**Workflow:**
1. Run automated tools first (fast, comprehensive)
2. Prioritize findings by risk (high CC + high change frequency = fix first)
3. Apply refactoring catalog techniques to each prioritized smell
4. Verify with tests after each change

---

## Five — Error Handling

| Error | Recovery |
|-------|----------|
| Tests fail after refactoring step | Revert immediately; the refactoring was not behavior-preserving |
| No tests exist | Stop; write characterization tests first (use legacy-code-workshop) |
| Refactoring introduces new smell | Choose a different technique from the catalog; do not proceed |
| Large refactoring needed | Break into smaller refactorings; use Mikado method for planning |
| Automated tool reports false positive | Manually verify; tools flag candidates, not certainties |
| Refactoring changes external behavior | Revert; refactoring must be behavior-preserving only |

---

## Six — Key Rules

| ID | Rule |
|----|------|
| **HR-1** | Never refactor without tests |
| **HR-2** | Refactoring is behavior-preserving only |
| **HR-3** | Small, incremental steps only |
| **HR-4** | Fix or revert if tests fail |
| **HR-5** | Don't introduce new smells |
| **HR-6** | Identify the smell first (catalog lookup) |
| **HR-7** | Automated detection before manual review |
| **HR-8** | Characterization tests before refactoring untested code |
| **R3** | Rule of Three — refactor on the third duplication |
| **MECHANICS** | Ensure tests → Small change → Run tests → Repeat → Clean up |
| **SMELL** | Code smells are signals, not problems themselves |
| **VOCABULARY** | The catalog is a named vocabulary with proven mechanics |

---

## Seven — Evidence & Checklist

**Pre-Delivery Checklist:**

- [ ] All existing tests pass
- [ ] New tests added for any new behavior (if any)
- [ ] No duplicate code introduced
- [ ] Method names reveal intent
- [ ] Functions are small and do one thing
- [ ] One level of abstraction per function
- [ ] Conditionals are simplified (guard clauses, polymorphism)
- [ ] No magic numbers — all replaced with named constants
- [ ] Data is properly encapsulated
- [ ] Classes have single responsibility
- [ ] No feature envy — methods live with their data
- [ ] The boy scout rule applied — code is cleaner than before

**Gate Implications:**

| Gate | Condition |
|------|-----------|
| **BLOCK** | Refactoring is attempted without a test suite |
| **BLOCK** | External behavior changes during refactoring |
| **BLOCK** | Large, risky changes are made instead of small incremental steps |
| **BLOCK** | Tests fail after a refactoring step and aren't fixed |
| **BLOCK** | The refactoring introduces new code smells |
| **WARN** | Not all identified code smells are addressed (prioritize) |
| **WARN** | Some refactorings require more test coverage to proceed safely |
| **WARN** | The refactoring is part of a larger plan that isn't yet complete |

**Evidence Required:**

- A list of code smells identified
- The refactoring(s) applied from the catalog
- Before/after code showing the transformation
- Test results confirming behavior is preserved
- Any new tests written to support the refactoring

---

## Reference Guides

| Topic | See |
|-------|-----|
| Clean Code principles for the goal state | `clean-code-review` skill |
| Breaking dependencies for untested code | `legacy-code-workshop` skill |
| Pragmatic practices for continuous refactoring | `pragmatic-development` skill |
| Metrics to quantify code smells | `software-metrics-quality` skill |
| Detailed test cases and examples | `references/condensed.md` |
