# UI/UX Overhaul (condensed)

Condensed version of `SKILL.md`. Canonical source: `SKILL.md`.

## Trigger Phrases

- "UI overhaul", "UX rewrite", "rebuild the frontend", "rewrite the UI"
- "Radix UI", "React Aria", "shadcn/ui", "Tailwind CSS"
- "hallmark quality", "impeccable UI", "OpenDesign"
- "the best code is the one that was not written"
- "accessibility rewrite", "replace custom components"

## When to use

- User wants to rewrite frontend with better quality
- User wants to adopt open-source component libraries
- User wants better accessibility
- User wants to remove custom implementations that should use libraries

## Do not use when

- User wants to add a feature, not rewrite
- User is satisfied with current UI
- Request is about backend, not frontend

## Core Principles

1. **Library-first.** Check Radix UI, React Aria, shadcn/ui before writing anything.
2. **Headless by default.** Unstyled primitives for behavior, Tailwind for styles.
3. **Open code.** Copy-paste components you own (shadcn/ui model).

## Six-Stage Pipeline

```
Code Analysis → UI/UX Understanding → Rewrite Decision → Architecture Design
  → Component Rewrite → Verification & Polish
```

### Stage 1 — Code Analysis
Detect: framework, component inventory, architecture patterns, accessibility violations,
design system usage (tokens, colors, spacing), performance indicators, custom implementations
that should be libraries.

### Stage 2 — UI/UX Understanding
Reconstruct the interface from code: layout, navigation, data flow, interactions, forms,
modals. Produce a UI map.

### Stage 3 — Rewrite Decision
Rewrite if ≥60% components need changes, custom libs exist where libraries should be,
accessibility violations >30%, or no design system. Refactor otherwise.

### Stage 4 — Architecture Design
Stack: React + Tailwind CSS + Radix UI + shadcn/ui + react-hook-form + zod + @tanstack/react-table
+ lucide-react. Design tokens: CSS custom properties (HSL colors, 4px spacing grid, type scale).

### Stage 5 — Component Rewrite
For each component:
1. Check library catalog → if library exists, use it
2. If no library: rewrite with Tailwind + tokens + semantic HTML + ARIA
3. Verify: accessibility, performance, size (<200 lines, <7 props)
4. Delete old component

### Stage 6 — Verification & Polish
Accessibility (axe-core 0 violations), performance (bundle reduced), code quality
(avg <200 lines, no `any`), visual (tokens consistent, dark mode, responsive).

## Library-First Rule

Before writing ANY component:

| Need | Library |
|------|---------|
| Dialog/Modal | Radix Dialog / shadcn dialog |
| Select | Radix Select / shadcn select |
| Tabs | Radix Tabs / shadcn tabs |
| Accordion | Radix Accordion |
| Tooltip | Radix Tooltip |
| Command Palette | cmdk |
| Data Table | @tanstack/react-table |
| Form Validation | react-hook-form + zod |
| Date Picker | react-day-picker / shadcn date-picker |
| Drag & Drop | @dnd-kit/core |
| Toast | sonner / shadcn sonner |
| Switch | Radix Switch |
| Checkbox | Radix Checkbox |
| Radio | Radix Radio Group |
| Navigation | Radix NavigationMenu |
| Dropdown | Radix DropdownMenu |

## Rewrite Rules

- Never create custom if library exists
- Never use inline styles (Tailwind only)
- Never use `!important`
- Never hardcode colors (design tokens)
- Never skip ARIA
- Never use `div` for interactive elements
- Never exceed 200 lines per component
- Never use boolean prop explosions

## Anti-Patterns

1. Custom modal when Radix Dialog exists
2. Custom select when Radix Select exists
3. Inline styles → Tailwind
4. Hardcoded colors → tokens
5. `!important` → fix specificity
6. Boolean props → composition
7. Component > 500 lines → split
8. No loading/error/empty states
9. Missing keyboard navigation
10. Missing ARIA attributes
11. No dark mode support

## Gate (BLOCK)

- Custom implementation exists where library should be used
- Accessibility violations unfixed
- Inline styles or hardcoded colors persist
- Components > 300 lines without justification
- No design tokens established
- Dark mode not supported
- Loading/error/empty states missing
- Old code not deleted

## Gate (WARN)

- Components 200-300 lines
- Animation could be simpler
- Tokens approximate (not final)
- Bundle size increased slightly
