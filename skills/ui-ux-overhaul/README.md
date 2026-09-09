# UI/UX Overhaul

A portable, cross-tool AI coding agent **skill** (open [Agent Skills](https://github.com/agentskills/agentskills) standard) that analyzes existing frontend code, understands the UI/UX, then wipes and reimplements with hallmark quality using exclusively open-source libraries. The `SKILL.md` in this folder is the single source of truth.

## The Problem

Frontend codebases accumulate custom implementations where libraries should exist. Custom modals without focus traps. Custom selects without keyboard navigation. Inline styles. Hardcoded colors. No design system. No loading states. No error states. The result: inaccessible, inconsistent, unmaintainable UI code that reimplements what Radix UI, React Aria, shadcn/ui, and @wordpress/components already do better.

## What It Does

Given an existing frontend codebase, this skill runs a **six-stage overhaul pipeline** with two styling tracks:

| Track | Environment | Styling | Components |
|-------|------------|---------|------------|
| **A: Tailwind** | Standalone apps, Next.js, general React | Tailwind CSS | Radix UI + shadcn/ui |
| **B: WordPress** | wp-admin, plugin admin pages, Gutenberg | wp-admin CSS | @wordpress/components |

| Stage | What | Output |
|-------|------|--------|
| Code Analysis | Framework detection, component inventory, a11y audit, design system detection | Analysis report |
| UI/UX Understanding | Reconstruct the interface from code | UI map |
| Rewrite Decision | Rewrite vs refactor determination | Decision with rationale |
| Architecture Design | Stack choices, design tokens, component tree | Architecture document |
| Component Rewrite | Replace custom code with libraries + Tailwind | Rewritten components |
| Verification & Polish | Accessibility, performance, code quality verification | Before/after metrics |

## What It Covers

- **Code analysis from source** — Detects framework, component architecture, accessibility gaps, design system usage, performance indicators, and custom implementations that should be libraries.
- **Library-first rule** — 35+ open-source components (Radix UI, React Aria, shadcn/ui, @tanstack/react-table, react-hook-form, cmdk, dnd-kit, sonner) checked before writing any custom code.
- **Design token foundation** — Establishes CSS custom properties for colors (HSL), spacing (4px grid), typography, radii, shadows, and z-index before any component work.
- **Hallmark quality** — Every component: keyboard accessible, focus visible, ARIA attributes, loading/error/empty states, dark mode, responsive, < 200 lines, < 7 props.
- **The best code is no code** — Libraries replace custom implementations. Tailwind replaces CSS-in-JS. shadcn/ui gives you components you own. Custom code only where no library exists.
- **Before/after metrics** — Component count, average size, accessibility violations, lines of code, bundle size — all measured and compared.

## Use It

> "Analyze the frontend code in src/ and tell me what to fix"

> "Rewrite the UI with Radix UI and Tailwind CSS"

> "The modals and selects are custom — replace them with accessible libraries"

> "I want hallmark quality — impeccable, accessible, minimal code"

The agent recognizes the intent from the skill's `description` and follows the six-stage pipeline.

## Companion Skills

- **backoffice-design** — Design patterns for operator-facing UIs (applies during Architecture Design)
- **test-case-validation** — Validate test cases for the rewritten components
- **waterfall-blueprint** — Can produce the SRS that the UI should satisfy

## Credits

- Radix UI — Headless, accessible React primitives
- React Aria (Adobe) — Accessible hooks and components
- shadcn/ui — Copy-paste components you own
- Tailwind CSS — Utility-first CSS
- Refactoring UI (Adam Wathan & Steve Schoger) — Design principles
- OpenDesign philosophy — Open code, composition, accessibility
- [aj-geddes/useful-ai-prompts](https://github.com/aj-geddes/useful-ai-prompts) — Wireframe prototyping skill (fidelity levels, prototyping tools, wireframe examples, prototype testing, component template)
