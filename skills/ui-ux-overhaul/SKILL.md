---
name: ui-ux-overhaul
description: >
  Analyze existing frontend code to understand its UI/UX, then wipe and reimplement
  with hallmark quality using open-source libraries. Detects component architecture,
  accessibility gaps, design system usage, and performance issues from code alone.
  Rewrites using Radix UI, React Aria, shadcn/ui, Tailwind CSS, @wordpress/components.
  Supports two styling tracks: Tailwind CSS (utility-first) or WordPress admin styling
  (wp-admin 7.1+ DTCG tokens, @wordpress/components). Triggers: "UI overhaul", "UX rewrite",
  "rebuild the frontend", "rewrite the UI", "replace custom components", "Radix UI",
  "shadcn", "wp-admin styling", "hallmark quality", "OpenDesign", "the best code is
  the one that was not written", "accessibility rewrite", "add Tailwind", "remove
  custom CSS". Skip if: user wants to add a feature (not rewrite), backend-only work,
  satisfied with current UI, or request is about visual design (not code).
---

# ui-ux-overhaul

## Scope

SKILL.md contains: routing rules, decision trees, hard prohibitions, the 7-stage
pipeline, and the extermination protocol.

Implementation details live in:
- `references/library-catalog.md` — 35+ open-source components to check before writing code
- `references/code-analysis.md` — Static analysis patterns for detecting vibe-code violations
- `references/rewrite-protocol.md` — When/how to rewrite, validation checklist
- `references/condensed.md` — Stripped-down version for tools that can't read SKILL.md

---

## Zero. Core Concepts

```
Vibe-Coded Repo → Guaranteed terrible UI/UX
  ├── Custom CSS everywhere (inline, !important, hardcoded)
  ├── Custom components where libraries exist
  ├── No design system, no accessibility, no states
  └── Default response: EXTERMINATION, not renovation

Two Styling Tracks:
  ├── Track A: Tailwind CSS + Radix UI + shadcn/ui (standalone apps)
  └── Track B: wp-admin 7.1+ DTCG tokens + @wordpress/components (WordPress)

Library-First Rule:
  Before writing ANY component → check library-catalog.md
  ├── Library exists → USE IT (delete custom version)
  └── No library exists → write from scratch with tokens
```

---

## One. Routing Priority

```
User request arrives
├── Mentions "rewrite", "overhaul", "rebuild", "replace custom"?
│   └── YES → ui-ux-overhaul (this skill)
├── Mentions "add feature", "fix bug", "new component"?
│   └── YES → NOT this skill (user wants modification, not overhaul)
├── Mentions "design", "mockup", "wireframe only"?
│   └── YES → NOT this skill (user wants design, not code)
├── Backend-only, no UI?
│   └── YES → NOT this skill
└── Ambiguous?
    └── Ask: "Do you want to rewrite the existing UI, or add/fix something?"
```

---

## Two. Hard Prohibitions

> **HP-1. The default is REWRITE. Refactoring requires explicit justification
> for EVERY component being kept.** "It works" is not justification. "It's mostly
> fine" is not justification.

> **HP-2. Custom component exists where library exists → DELETE IT.**
> Check `references/library-catalog.md`. If Radix, React Aria, shadcn/ui, or
> @wordpress/components has it, the custom version is GONE.

> **HP-3. Old tests for deleted components → DELETE THEM.**
> Old tests against deleted code are FALSE CONFIDENCE. Delete the test file.
> Rewrite new tests from scratch testing BEHAVIOR, not implementation.

> **HP-4. Inline `style={{` → DELETE EVERY OCCURRENCE.**
> Replace with Tailwind classes (Track A) or wp-admin CSS (Track B).
> No "I'll fix this one later." Fix ALL of them.

> **HP-5. Hardcoded colors `#hex`, `rgb()`, `hsl()` → DELETE EVERY ONE.**
> Replace with design token references.

> **HP-6. `!important` → DELETE EVERY ONE.**
> Fix specificity at the source.

> **HP-7. `<div onClick>` without role → DELETE AND REPLACE.**
> Use `<button>` or add role + tabIndex + keyboard handler.

> **HP-8. `<input>` without label → DELETE AND REWRITE.**
> Every input must have associated label or aria-label.

> **HP-9. Component > 200 lines → SPLIT.**
> Hard limit. No exceptions.

> **HP-10. No loading/error/empty states → ADD THEM.**
> Every async operation needs loading + error states.
> Every list/table needs empty state.

> **HP-11. No dark mode → ADD IT.**
> Use CSS custom properties. Support `prefers-color-scheme`.

> **HP-12. CSS file with custom styles → DELETE FILE.**
> Replace with Tailwind utility classes. Only the token file survives.

> **HP-13. Wireframes are MANDATORY before code.**
> You cannot skip wireframing to "save time."
> No wireframe = no code. Period.

---

## Three. Decision Trees

### 3.1 Rewrite vs Refactor

```
START: Default = REWRITE
│
├── ANY mandatory trigger true? → REWRITE
│   ├── Component > 500 lines
│   ├── > 30% components with a11y violations
│   ├── > 20% inline styles or hardcoded colors
│   ├── 3+ custom implementations where libraries exist
│   └── Architecture fundamentally wrong
│
├── ALL triggers false?
│   ├── Run "Justify Keeping" checklist for each component
│   │   ├── ALL pass ALL items → REFACTOR (with documented justification)
│   │   └── ANY fails ANY item → REWRITE
│   └── See `references/rewrite-protocol.md` for full checklist
│
└── User explicitly requests refactor despite triggers?
    └── WARN about risk, then proceed (document acceptance)
```

### 3.2 Styling Track Selection

```
Is this a WordPress admin page / plugin / Gutenberg extension?
├── YES → Track B: wp-admin 7.1+ DTCG tokens + @wordpress/components
└── NO → Track A: Tailwind CSS + Radix UI + shadcn/ui
```

### 3.3 Component Replacement

```
Component exists in codebase
├── Check references/library-catalog.md
│   ├── Library exists (Radix/shadcn/wp-components)
│   │   ├── Has tests? → DELETE tests, REWRITE testing new behavior
│   │   ├── DELETE custom component
│   │   └── INSTALL + USE library component
│   └── No library exists
│       ├── Write from scratch
│       ├── Use Tailwind + design tokens
│       ├── Ensure accessibility (keyboard, ARIA, focus)
│       └── Add loading/error/empty states
└── Verify: < 200 lines, < 7 props, composition pattern
```

---

## Four. The 7-Stage Pipeline

Every stage is mandatory. You cannot skip stages.

```
Stage 1: Code Analysis
  → Stage 1.5: Vibe-Code Assault (extermination prep)
    → Stage 2: UI/UX Understanding
      → Stage 3: Rewrite Decision
        → Stage 4: Architecture Design
          → Stage 5: Wireframe & Prototype
            → Stage 6: Component Rewrite
              → Stage 7: Verification & Polish
```

### Stage 1 — Code Analysis

Detect: framework, component inventory, accessibility violations, design system
usage, performance indicators, custom implementations that should be libraries.

See `references/code-analysis.md` for detection patterns and search queries.

### Stage 1.5 — Vibe-Code Assault

Before any design, run systematic destruction preparation:

**Step 1: Damage Report** — Count every violation type:
```
Inline styles:           [N]
!important:              [N]
Hardcoded colors:        [N]
Custom modals:           [N]
Custom selects:          [N]
div-as-button:           [N]
Inputs without labels:   [N]
Components > 500 lines:  [N]
Tests for custom comps:  [N]
```

**Step 2: Kill List** — Every violation gets a target:
```
DELETE AND REPLACE:
- [Component A] → Replace with [library]
  └─ Tests: DELETE old, REWRITE new
DELETE ENTIRELY:
- [Unused component] → No replacement
REWRITE FROM SCRATCH:
- [Component C] → Library + tokens
  └─ Tests: DELETE old, REWRITE new
```

**Step 3: Completeness Check** — 100% of violations must be in Kill List.

### Stage 2 — UI/UX Understanding

Reconstruct the interface from code: layout, navigation, data flow, interactions,
forms, states. Produce a UI map.

### Stage 3 — Rewrite Decision

Apply decision tree from Three.1. Default: REWRITE.

### Stage 4 — Architecture Design

Choose styling track (Three.2). Establish design tokens. Design component tree.

See `references/library-catalog.md` for component choices per track.

### Stage 5 — Wireframe & Prototype (MANDATORY)

Every screen gets a wireframe with: layout, components, states (empty/loading/error/success),
interactions. No wireframe = no code.

See `references/rewrite-protocol.md` for wireframe templates.

### Stage 6 — Component Rewrite

For each component:
1. Check library catalog → if exists, DELETE custom + USE library
2. If no library → write from scratch with tokens + accessibility
3. DELETE old tests, REWRITE new tests (behavior, not implementation)
4. Verify: < 200 lines, < 7 props, all states present

### Stage 7 — Verification & Polish

Run: axe-core (0 violations), keyboard navigation, before/after metrics,
TypeScript strict, bundle size comparison.

---

## Five. Error Handling

| Error Scenario | Handling |
|---------------|----------|
| Library not found in catalog | Check npm/GitHub. If it exists and is maintained, use it. If not, write from scratch. |
| Component has no tests | Write tests AFTER rewriting (behavior tests against new component). |
| Component has tests but they test implementation | DELETE old tests. Write new behavior tests. |
| Design tokens conflict with existing tokens | Use the new tokens. Old hardcoded values are deleted. |
| User resists deletion of "working" code | Apply HP-1. Show the "Justify Keeping" checklist. If it fails any item, it goes. |
| Wireframing reveals the design doesn't work | Fix the wireframe. Do NOT start coding until wireframe is validated. |
| Library component doesn't match exact behavior | Use the library component. Adapt your wrapper. Do NOT write a custom version. |
| Dark mode breaks existing layout | Fix the layout with CSS custom properties. Dark mode is mandatory (HP-11). |
| Test coverage drops after rewrite | Expected. Old tests tested old code. New tests test new behavior. Coverage will recover. |
| Bundle size increases slightly | Acceptable if a11y/performance/code quality improved. Log the trade-off. |

---

## Six. Key Rules

> **KR-1. The Kill List is the contract.** Every item on it will be executed.
> No item will be "deferred." If it's on the list, it dies.

> **KR-2. Delete first, write second.** Old code is deleted BEFORE new code
> is written. No "keep for reference." No "comment out." DELETE.

> **KR-3. Library-first, always.** Check the catalog before writing ANY component.
> Writing custom when a library exists = crime against maintainability.

> **KR-4. Tests die with their component.** Old tests → DELETE. New tests →
> WRITE from scratch testing behavior. Never adapt old tests.

> **KR-5. Wireframe before code.** No wireframe = no code. The wireframe
> is the specification. Without it, you are guessing.

> **KR-6. 200 lines is a hard limit.** No component exceeds 200 lines.
> If it does, it's doing too much. Split it.

> **KR-7. Accessibility is not optional.** Every interactive element must be
> keyboard accessible, have visible focus, have ARIA attributes, have labels.

> **KR-8. Design tokens are mandatory.** No hardcoded colors, spacing, or
> typography. Everything from tokens.

---

## Seven. Evidence Required

A completed overhaul produces:
- Code analysis report
- Kill List (100% of violations accounted for)
- UI map
- Wireframes for every screen
- Interaction flow definitions
- Architecture document (stack + tokens)
- Rewritten components (all using libraries + tokens)
- Rewritten tests (behavior-based, not implementation-based)
- Deletion log (what was killed)
- Before/after metrics (lines, bundle, a11y, component count)
- axe-core verification (0 violations)

---

## Reference Guides

| Guide | Contents |
|-------|----------|
| [library-catalog.md](references/library-catalog.md) | 35+ components: Radix, React Aria, shadcn, @wordpress/components |
| [code-analysis.md](references/code-analysis.md) | Static analysis patterns, search queries, violation detection |
| [rewrite-protocol.md](references/rewrite-protocol.md) | Rewrite vs refactor decision, validation, wireframe templates |
| [condensed.md](references/condensed.md) | Stripped-down version for AGENTS.md/CLAUDE.md |
