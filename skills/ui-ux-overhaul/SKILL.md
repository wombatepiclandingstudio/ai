---
name: ui-ux-overhaul
description: >
  Analyze existing frontend code to understand its UI/UX, then wipe and reimplement
  with hallmark quality using open-source libraries. Reads code to detect component
  architecture, accessibility gaps, design system usage, and performance issues.
  Produces a rewrite that uses Radix UI, React Aria, shadcn/ui, Tailwind CSS,
  @wordpress/components, and other open-source primitives — because the best code
  is the code that was not written. Always rewrites with better accessibility, better
  performance, and fewer lines of code. Supports two styling tracks: Tailwind CSS
  (utility-first) or WordPress admin styling (wp-admin patterns, @wordpress/components).
  Follows the OpenDesign philosophy: headless primitives, composition over
  configuration, design tokens, and copy-paste components you own.
version: "1.0"
license: MIT
metadata:
  author: personal
  type: workflow
  tags: [ui, ux, frontend, rewrite, radix-ui, react-arity, shadcn, tailwind, wordpress, wp-admin, wp-components, open-source, accessibility, design-system, components, overhaul, opendesign, hallmark]
---

# UI/UX Overhaul — Analyze, Rewrite, Elevate

Reads existing frontend code to **understand the UI/UX** (without screenshots,
without Figma, without anyone explaining it), then **wipes and reimplements** with
hallmark quality using exclusively open-source libraries. The output has better
accessibility, better performance, fewer lines of code, and zero proprietary
dependencies.

This skill embodies one principle above all: **the best code is the code that was
not written.** Every component comes from Radix UI, React Aria, shadcn/ui, or
Tailwind CSS. Custom code exists only where no library can do the job.

## Use when

- The user wants to rewrite an existing frontend with better quality
- The user mentions "UI overhaul," "UX rewrite," "rebuild the frontend," "rewrite the UI"
- The user wants to adopt Radix UI, React Aria, shadcn/ui, or Tailwind CSS
- The user wants to build WordPress admin pages with @wordpress/components
- The user mentions "wp-admin styling," "WordPress admin look and feel"
- The user wants better accessibility in their frontend
- The user wants to remove custom implementations that should use libraries
- The user mentions "OpenDesign," "hallmark quality," "impeccable UI"
- The user wants to analyze existing code and get improvement recommendations
- The user mentions "the best code is the one that was not written"

## Do not use when

- The user wants to add a feature, not rewrite the UI
- The user wants backend-only work (no UI components)
- The user is satisfied with the current UI and wants no changes
- The request is about design (visual), not code implementation

---

## Core Philosophy

> "Perfection is achieved not when there is nothing more to add, but when there
> is nothing left to take away." — Antoine de Saint-Exupéry

> "The best code is no code at all. Every line of code you write is a line that
> has to be maintained." — Jeff Atwood

### The Vibe-Code Assumption

**This skill is designed for vibe-coded repositories.** Vibe-coded repos are
guaranteed to have:
- Custom CSS everywhere (inline styles, style attributes, CSS files with !important)
- Custom modals, selects, tooltips, dropdowns that should use libraries
- No design system (hardcoded colors, spacing, typography)
- No accessibility (no ARIA, no labels, no focus management, no keyboard nav)
- No loading/error/empty states
- Components that are 500+ lines doing everything
- `div` elements used as buttons
- `onClick` handlers on non-interactive elements

**The default response to vibe-coded UI is EXTERMINATION, not renovation.**

You do not "fix" a vibe-coded modal. You DELETE it and replace it with Radix Dialog.
You do not "improve" a custom select. You DELETE it and replace it with Radix Select.
You do not "clean up" inline styles. You DELETE them and write Tailwind classes.
You do not "add" accessibility. You REWRITE the component with accessibility built in.

### The Three Principles (Ruthlessly Enforced)

1. **Library-first. No exceptions.** Before writing ANY component, check the catalog.
   If a library exists, USE IT. Writing a custom implementation when a library exists
   is a CRIME against maintainability. The best code is the code that was not written.

2. **Headless by default.** Radix UI for behavior. Tailwind CSS for styling. Design
   tokens for colors/spacing/typography. No CSS-in-JS. No inline styles. No custom CSS
   files with hardcoded values.

3. **Delete, don't modify.** When a library component replaces a custom component,
   DELETE the custom component entirely. Do not keep it "for reference." Do not
   comment it out. Do not move it to a legacy folder. DELETE IT.

### What "Exterminate" Means

| Vibe-Code Pattern | Response |
|-------------------|----------|
| Custom `<Modal>` component | DELETE it. Replace with `npx shadcn@latest add dialog` |
| Custom `<Select>` / `<Dropdown>` | DELETE it. Replace with `npx shadcn@latest add select` |
| Custom `<Tooltip>` | DELETE it. Replace with `npx shadcn@latest add tooltip` |
| Custom `<Tabs>` | DELETE it. Replace with `npx shadcn@latest add tabs` |
| Custom `<Accordion>` | DELETE it. Replace with `npx shadcn@latest add accordion` |
| Custom form validation | DELETE it. Replace with react-hook-form + zod |
| Custom drag-and-drop | DELETE it. Replace with @dnd-kit/core |
| Custom toast/notification | DELETE it. Replace with sonner |
| Custom command palette | DELETE it. Replace with cmdk |
| Inline `style={{...}}` | DELETE every occurrence. Rewrite with Tailwind classes |
| `!important` in CSS | DELETE every occurrence. Fix specificity at source |
| Hardcoded `#hex` colors | DELETE. Replace with design token references |
| Hardcoded `px` spacing | DELETE. Replace with 4px grid token references |
| `<div onClick>` without role | DELETE. Replace with `<button>` or add role+keyboard |
| `<input>` without label | DELETE the input. Rewrite with associated label |
| `outline: none` | DELETE. Replace with focus-visible ring using tokens |
| Component > 500 lines | DELETE. Split into 2-4 focused components |
| CSS file with > 100 lines of custom styles | DELETE. Replace with Tailwind utility classes |
| Multiple CSS files for one component | DELETE all. Consolidate into Tailwind |

**If you find yourself "improving" instead of "replacing," you are doing it wrong.**

---

## The Overhaul Pipeline

```
Code Analysis → UI/UX Understanding → Rewrite Decision → Architecture Design
  → Wireframe & Prototype → Component Rewrite → Verification & Polish
```

**Every stage is mandatory.** You cannot skip wireframing to "save time." The wireframe
is the specification for the rewrite — without it, you are guessing, not designing.

### Stage 1: Code Analysis

Before touching any code, understand what exists. The agent must analyze the
codebase systematically.

#### 1.1 Framework & Stack Detection

Detect from `package.json` and file patterns:

| Signal | What It Tells You |
|--------|------------------|
| `react` in dependencies | React project |
| `next` in dependencies | Next.js (SSR/SSG) |
| `vue` in dependencies | Vue project |
| `@angular/core` | Angular project |
| `svelte` in dependencies | Svelte project |
| `tailwindcss` in devDependencies | Tailwind CSS present |
| `styled-components` | CSS-in-JS present |
| `@emotion/react` | Emotion CSS-in-JS |
| `@mui/material` | Material UI present |
| `@chakra-ui/react` | Chakra UI present |
| `antd` | Ant Design present |

#### 1.2 Component Inventory

Count and categorize every component:

```
COMPONENT INVENTORY
Total components: [N]
Files > 300 lines: [list]
Files > 500 lines: [list — immediate rewrite candidates]
Files > 1000 lines: [list — urgent]
Components with tests: [N] ([%])
Components without tests: [N] ([%])
```

#### 1.3 Architecture Analysis

Detect patterns and anti-patterns:

| Check | Good Signal | Bad Signal |
|-------|------------|------------|
| Component size | < 200 lines | > 500 lines |
| Props count | < 7 per component | > 10 per component |
| Props drilling depth | < 3 levels | > 4 levels |
| State location | Colocated with usage | Global for UI state |
| Composition pattern | Children/slots | Config objects |
| Import depth | < 4 levels | > 6 levels |
| Barrel file usage | Selective | Everything |

#### 1.4 Accessibility Audit

Scan for accessibility violations:

| Check | Violation | Severity |
|-------|-----------|----------|
| `<img>` without `alt` | Missing alt text | Critical |
| `<div onClick>` without `role` + `tabIndex` | Not keyboard accessible | Critical |
| `<input>` without `<label>` or `aria-label` | No accessible name | Critical |
| `outline: none` without replacement | No focus indicator | Critical |
| Missing `aria-expanded` on collapsible | State not announced | Major |
| Missing `aria-live` on dynamic content | Updates not announced | Major |
| Heading hierarchy skips | Poor structure | Moderate |
| No skip navigation link | Poor keyboard UX | Moderate |
| `tabIndex > 0` | Broken tab order | Moderate |
| Missing form error association | Errors not linked | Major |

#### 1.5 Design System Detection

Evaluate design token usage:

```
DESIGN SYSTEM ANALYSIS
Theme provider: [present/absent]
Design tokens: [present/absent]
Unique colors found: [N] — [< 5: good | 5-15: moderate | > 15: no tokens]
Unique spacing values: [N] — [< 5: good | 5-15: moderate | > 15: no tokens]
Unique font sizes: [N] — [< 5: good | 5-15: moderate | > 15: no tokens]
Unique border radii: [N] — [< 3: good | 3-6: moderate | > 6: no tokens]
!important usage: [N occurrences]
Inline styles in JSX: [N occurrences]
```

#### 1.6 Performance Indicators

Detect common performance issues:

| Check | Signal | Issue |
|-------|--------|-------|
| `useEffect` setting state | useEffect chains | Render loops |
| Object literals in JSX props | `style={{...}}` in render | New references each render |
| Missing `React.memo` | Large trees, no memoization | Unnecessary re-renders |
| `moment.js` in dependencies | Heavy date library | Use date-fns instead |
| `lodash` (not lodash-es) | No tree-shaking | Use lodash-es |
| No `dynamic()` or `lazy()` | No code splitting | Bundle too large |
| `dangerouslySetInnerHTML` | XSS + performance risk | Security vulnerability |

#### 1.7 Custom Code That Should Be Libraries

Detect hand-rolled implementations where libraries exist:

| Custom Implementation | Should Use | Why |
|----------------------|-----------|-----|
| Custom modal/dialog | Radix Dialog / React Aria Dialog | Focus trap, ARIA, scroll lock |
| Custom dropdown/select | Radix Select / React Aria Select | Keyboard nav, screen reader, ARIA |
| Custom tooltip/popover | Radix Tooltip / Popover | Positioning, ARIA, timing |
| Custom tabs | Radix Tabs / React Aria Tabs | Keyboard nav, ARIA, orientation |
| Custom accordion | Radix Accordion / React Aria | ARIA, animation, keyboard |
| Custom form validation | react-hook-form + zod | Schema validation, form state |
| Custom animations | framer-motion | Declarative, performant |
| Custom date picker | react-day-picker / react-datepicker | Accessibility, locale, range |
| Custom drag-and-drop | @dnd-kit/core | Accessible, touch-friendly |
| Custom notifications | sonner / react-hot-toast | Animation, stacking, a11y |
| Custom command palette | cmdk | Keyboard nav, search, a11y |
| Custom data table | @tanstack/react-table | Sorting, filtering, pagination |

**Rule:** If a custom implementation exists where a library should be used,
flag it as a rewrite candidate. The library version will be more accessible,
more maintainable, and fewer lines of code.

### Stage 1.5: Pre-Rewrite Extermination (VIBE-CODE ASSAULT)

Before proceeding to understanding or design, run the **Vibe-Code Assault** — a
systematic destruction of everything that's wrong. This is not analysis. This is
demolition preparation.

#### Step 1: Count the Damage

Run these searches and record the COUNT of each violation:

```
VIBE-CODE DAMAGE REPORT

Inline styles:           [N] occurrences of style={{
!important:              [N] occurrences in CSS
Hardcoded colors:        [N] occurrences of #hex, rgb(), rgba(), hsl()
Hardcoded spacing:       [N] occurrences of [0-9]+px in styles
Custom modals:           [N] custom modal/dialog components
Custom selects:          [N] custom select/dropdown components
Custom tooltips:         [N] custom tooltip components
Custom tabs:             [N] custom tab components
Custom accordions:       [N] custom accordion components
Custom form validation:  [N] custom validation implementations
div-as-button:           [N] div onClick without role
Inputs without labels:   [N] inputs without associated label
outline: none:           [N] occurrences
CSS files with custom:   [N] files with > 50 lines of custom CSS
Components > 500 lines:  [N] files
Components > 200 lines:  [N] files
Missing loading states:  [N] async operations without loading UI
Missing error states:    [N] async operations without error UI
Missing empty states:    [N] lists/tables without empty state
Missing dark mode:       [N] components without dark mode support
```

#### Step 2: Declare Extermination Targets

Based on the damage report, generate the **Kill List**:

```
KILL LIST

DELETE AND REPLACE:
- [Component A] → Replace with [library component]
- [Component B] → Replace with [library component]
- [CSS File X] → Delete entirely, rewrite with Tailwind
- [Inline styles in File Y] → Delete all, rewrite with Tailwind

DELETE ENTIRELY:
- [Unused component Z] → No replacement needed
- [Dead CSS rules] → Delete

REWRITE FROM SCRATCH:
- [Component C] → Too complex to fix, rewrite with library + tokens
- [Component D] → Accessibility disaster, rewrite from scratch
```

#### Step 3: Verify Kill List Completeness

The Kill List must account for 100% of violations found in Step 1. If any
violation is not in the Kill List, it was MISSED. Find it and add it.

**The Kill List is the contract.** Every item on it will be executed. No item
will be "deferred" or "addressed later." If it's on the list, it dies.

### Stage 2: UI/UX Understanding

From the code analysis, reconstruct the UI/UX without seeing it.

#### 2.1 Reconstruct the Interface

From component code, infer:
- **Layout structure** — What is the page layout? (sidebar + content? top nav + main?)
- **Navigation** — How do users move between views? (tabs? sidebar? breadcrumbs?)
- **Data flow** — What data is fetched? How is it displayed? What actions can users take?
- **Interaction patterns** — What do users click, type, drag, select?
- **State transitions** — What changes when the user acts? What feedback is shown?
- **Form patterns** — What forms exist? What fields? What validation?

#### 2.2 Produce a UI Map

```
UI MAP: [application name]

Pages/Routes:
├── /dashboard
│   ├── Layout: sidebar + main content
│   ├── Components: StatsCard, Chart, RecentActivity, QuickActions
│   └── Data: fetches /api/stats, /api/activity
├── /settings
│   ├── Layout: tabbed (Profile, Notifications, Security)
│   ├── Components: ProfileForm, NotificationToggle, PasswordChange
│   └── Data: fetches /api/user, mutates /api/user
└── /users
    ├── Layout: list + detail panel
    ├── Components: UserTable, UserDetail, UserActions
    └── Data: fetches /api/users, /api/users/:id

Navigation: Sidebar with icons, 6 items
Forms: 3 forms (profile, password, filter)
Modals: 2 custom modals (confirm delete, invite user)
Interactive elements: 15 buttons, 8 inputs, 3 dropdowns, 2 toggles
```

#### 2.3 Identify Rewrite Scope

Based on UI map and analysis:

| Component | Current Quality | Library Replacement | Rewrite Priority |
|-----------|----------------|--------------------|----|
| Custom Modal | Poor (no focus trap) | Radix Dialog | HIGH |
| Custom Select | Poor (no keyboard nav) | Radix Select / React Aria | HIGH |
| Data Table | Moderate (works, complex) | @tanstack/react-table | MEDIUM |
| Form Validation | Poor (manual checks) | react-hook-form + zod | HIGH |
| Navigation Sidebar | Good (semantic HTML) | Keep, add Radix Navigation | LOW |
| Stats Cards | Good (presentational) | Keep, restyle with Tailwind | LOW |

### Stage 3: Rewrite Decision (STRICT ENFORCEMENT)

> "Plan to throw one away; you will, anyhow." — Fred Brooks, The Mythical Man-Month

**The default is REWRITE. Refactoring requires explicit justification for EVERY
component being kept.** This is not a suggestion. This is the rule.

#### The Inversion of Proof

| Approach | Default | Justification Required |
|----------|---------|----------------------|
| **Rewrite** | YES — requires no justification | None |
| **Refactor** | NO — requires justification for EVERY component | Must pass the "Justify Keeping" checklist for each component |

If you cannot justify keeping a component, you MUST rewrite it. "It works" is
not justification. "It's mostly fine" is not justification. "I don't have time
to rewrite" is not justification.

#### Mandatory Rewrite Triggers (ANY ONE = REWRITE)

If ANY of these conditions are true, rewrite is MANDATORY. No exceptions.

**Quantitative triggers:**
- [ ] Any component > 500 lines
- [ ] > 30% of components have accessibility violations
- [ ] > 20% of components use inline styles or hardcoded colors
- [ ] > 15% code duplication across components
- [ ] Custom implementations exist where libraries should be used (3+ instances)
- [ ] Average component size > 250 lines
- [ ] No design system tokens in use (hardcoded values throughout)

**Qualitative triggers:**
- [ ] Architecture is fundamentally wrong (wrong abstraction, wrong technology)
- [ ] Original design assumptions are no longer valid
- [ ] The code has been patched so many times it's unrecognizable
- [ ] Security/accessibility failures are systemic, not isolated
- [ ] No single developer can explain the component architecture in < 5 minutes
- [ ] The team that wrote the code no longer exists

**The "Touch Count" trigger:**
- If a "simple fix" requires touching > 5 files, the architecture is the problem.
- If fixing one component requires changing 3+ other components, the coupling is structural.
- If each small fix introduces new bugs, the codebase is in a decay spiral.

#### The "Justify Keeping" Checklist (for Refactor decision ONLY)

If you believe refactoring is appropriate (against the default of rewrite), you
MUST answer YES to EVERY question for EVERY component you want to keep:

- [ ] **Purpose**: Can I state what this component does in ONE sentence?
- [ ] **Test coverage**: Does it have meaningful tests that verify BEHAVIOR (not just line coverage)?
- [ ] **Production validation**: Has it been running in production without major bugs for > 6 months?
- [ ] **Architectural fit**: Does it fit the TARGET architecture, or would it need significant rework?
- [ ] **Rewrite cost**: Could I write it from scratch in < 2x the time it would take to refactor?
- [ ] **Dependencies**: Are ALL its dependencies current and secure?
- [ ] **Accessibility**: Does it meet WCAG 2.2 AA (0 violations)?
- [ ] **Design system**: Does it use current design tokens and patterns?
- [ ] **Size**: Is it < 200 lines?
- [ ] **Props**: Does it have < 7 props?
- [ ] **Composition**: Does it use children/slots, not config objects?

**If ANY answer is "no" or "I don't know": the component MUST be rewritten.**

#### The "Delete First" Workflow

When rewrite is chosen (the default):

1. **DELETE the old code first.** Not "mark for deletion." Actually delete it.
2. **Write new code from scratch.** Do NOT copy-paste from old code. Do NOT
   modify old code. Start with a blank file and write new code that satisfies
   the requirements.
3. **Verify deletion.** Run tests/imports to confirm nothing depends on deleted code.
4. **Verify new code.** Run tests/imports to confirm new code works.
5. **Compare metrics.** Old vs new on every dimension. If any metric got worse,
   the rewrite failed.

**The "Burn the Boats" rule:**
- No fallback to old code
- No hybrid old/new running simultaneously (except during Strangler Fig migration)
- No cherry-picking from old code into new code
- Fresh mental model: understand requirements independently, not as "changes to old code"
- Complete replacement: old code is deleted, not deprecated

#### Rewrite vs Refactor: Decision Tree

```
START: Default = REWRITE
  │
  ├─ ANY mandatory trigger true? → REWRITE (no further analysis needed)
  │
  ├─ ALL mandatory triggers false?
  │   │
  │   ├─ Run "Justify Keeping" checklist for each component
  │   │   │
  │   │   ├─ ALL components pass ALL checklist items? → REFACTOR (with justification)
  │   │   │
  │   │   └─ ANY component fails ANY checklist item? → REWRITE
  │   │
  │   └─ Document which components passed/failed and why
  │
  └─ User explicitly requests refactor despite triggers? → WARN, then proceed with refactor
     (document the risk acceptance)
```

#### Anti-Patterns (Leniency Traps)

| Anti-Pattern | Why It Fails | Enforcement |
|-------------|-------------|-------------|
| "I'll just fix this one thing" | The "one thing" connects to 10 other things | If fix touches > 3 files, justify architecture |
| "The existing code is mostly fine" | Agent hasn't looked deeply enough | Must list 5 specific problems before deciding "fine" |
| "I'll refactor incrementally" | Creates half-old, half-new system worse than either | If > 50 small changes across > 10 files, rewrite |
| "Let me preserve the architecture" | Architecture IS the problem | Ask: "Would I design this way from scratch?" If no, rewrite |
| "It's too complex to rewrite" | Complexity is the REASON to rewrite | If no one can explain it in < 5 min, it's too complex to keep |
| "We don't have time" | Maintenance cost exceeds rewrite cost within 12-18 months | Calculate ongoing maintenance cost vs one-time rewrite |
| "The tests pass" | Green CI masks logically hollow tests | Mutation testing, not just line coverage |
| "It's been working for years" | Survivorship bias — it works until it doesn't | "Working" ≠ maintainable, secure, or accessible |

**For this skill: the user asked for OVERHAUL. "Overhaul" means rewrite.
If you find yourself doing a minor refactor, STOP. You are doing it wrong.**

### Stage 4: Architecture Design

Design the new architecture before writing code.

#### 4.1 Technology Stack Decision

Choose a styling track based on the target environment:

**Track A: Tailwind CSS (standalone apps, Next.js, general React)**

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React (or detected framework) | Match existing |
| **Styling** | Tailwind CSS | Utility-first, no CSS-in-JS overhead |
| **Components** | Radix UI (headless primitives) | Best accessibility, composition API |
| **Accessible hooks** | React Aria (when Radix lacks a primitive) | Most comprehensive a11y |
| **Copy-paste components** | shadcn/ui (built on Radix + Tailwind) | Own the code, modify freely |
| **Forms** | react-hook-form + zod | Schema validation, minimal re-renders |
| **Tables** | @tanstack/react-table | Sorting, filtering, pagination |
| **Animations** | framer-motion (sparingly) | Declarative, only when motion adds value |
| **Icons** | lucide-react | Consistent, tree-shakeable |
| **State** | React state + URL state | Minimal global state |

**Track B: WordPress Admin (wp-admin, plugin admin pages, Gutenberg extensions)**

| Layer | Choice | Why |
|-------|--------|-----|
| **Framework** | React (within WordPress) | WordPress uses React |
| **Styling** | wp-admin CSS + @wordpress/components | Native admin look and feel |
| **Components** | @wordpress/components (90+ built-in) | Matches wp-admin patterns exactly |
| **State** | @wordpress/data (Redux-based) | WordPress state management |
| **Forms** | @wordpress/components form controls | Native admin form patterns |
| **Icons** | dashicons + @wordpress/icons | WordPress admin icons |
| **Blocks** | @wordpress/block-editor (if building blocks) | Gutenberg integration |

#### 4.2 Design Token Foundation

Before components, establish tokens:

```css
/* tokens.css */
:root {
  /* Colors — HSL for rational manipulation */
  --color-background: 0 0% 100%;
  --color-foreground: 240 10% 3.9%;
  --color-primary: 240 5.9% 10%;
  --color-primary-foreground: 0 0% 98%;
  --color-muted: 240 4.8% 95.9%;
  --color-muted-foreground: 240 3.8% 46.1%;
  --color-border: 240 5.9% 90%;
  --color-ring: 240 5.9% 10%;
  --color-destructive: 0 84.2% 60.2%;
  --color-success: 142 76% 36%;
  --color-warning: 38 92% 50%;

  /* Spacing — 4px grid */
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem;  /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem;    /* 16px */
  --space-6: 1.5rem;  /* 24px */
  --space-8: 2rem;    /* 32px */
  --space-12: 3rem;   /* 48px */
  --space-16: 4rem;   /* 64px */

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;

  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadows — multi-layer for depth */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  /* Z-index scale */
  --z-dropdown: 50;
  --z-sticky: 100;
  --z-modal: 200;
  --z-toast: 300;
}
```

**For wp-admin environments (WordPress 7.1+)**, use the new Design System Theming
layer. Tokens follow the [W3C DTCG specification](https://www.designtokens.org/)
 and are exposed as CSS custom properties:

```css
/* WordPress 7.1 Design System tokens (DTCG-spec) */
:root {
  /* Accent — generated from seed colors via ThemeProvider */
  --wp-admin-theme-color: #3858e9;
  --wp-admin-theme-color--rgb: 56, 88, 233;
  --wp-admin-theme-color-darker-10: #2145e6;
  --wp-admin-theme-color-darker-20: #183ad6;
  --wp-admin-border-width-focus: 1.5px;

  /* Semantic color tokens */
  --wp-color-success: #4ab866;
  --wp-color-warning: #f0b849;
  --wp-color-error: #cc1818;
  --wp-color-info: #3858e9;

  /* Elevation tokens */
  --wp-elevation-xs: 0 4px 4px rgba(0,0,0,0.01), 0 3px 3px rgba(0,0,0,0.02);
  --wp-elevation-s: 0 8px 8px rgba(0,0,0,0.02), 0 1px 2px rgba(0,0,0,0.05);
  --wp-elevation-m: 0 16px 16px rgba(0,0,0,0.02), 0 4px 5px rgba(0,0,0,0.03);
  --wp-elevation-l: 0 50px 43px rgba(0,0,0,0.02), 0 30px 36px rgba(0,0,0,0.04);

  /* Roundness tokens */
  --wp-radius-xs: 1px;
  --wp-radius-s: 2px;
  --wp-radius-m: 4px;
  --wp-radius-l: 8px;
  --wp-radius-full: 9999px;
}
```

Use the `ThemeProvider` React component to customize admin UI areas:

```jsx
import { ThemeProvider } from '@wordpress/components';

// Override theme color for a specific admin section
<ThemeProvider accent="#e91e63" background="#fafafa">
  <MyAdminComponent />
</ThemeProvider>
```

The color ramp generator creates full color scales from seed accent/background colors:

```jsx
import { createTheme } from '@wordpress/theme';

const theme = createTheme({
  accent: '#3858e9',
  background: '#f0f0f1',
});
// Generates a harmonious color scale with accessible contrast
```

**Pre-7.1 fallback** (for older WordPress installs), use the legacy wp-admin SCSS
variables — see `references/library-catalog.md` for the complete legacy token set.

#### 4.3 Component Architecture

Design the new component tree. Choose based on styling track:

**Track A: Tailwind CSS**

```
src/
├── components/
│   ├── ui/              # shadcn/ui components (owned, copy-paste)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx   # Radix Dialog
│   │   ├── select.tsx   # Radix Select
│   │   ├── table.tsx    # @tanstack/react-table
│   │   ├── form.tsx     # react-hook-form
│   │   └── ...
│   ├── layout/          # Layout components
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── page.tsx
│   └── features/        # Feature-specific components
│       ├── dashboard/
│       ├── settings/
│       └── users/
├── hooks/               # Custom hooks (minimal)
├── lib/                 # Utilities
├── styles/
│   └── tokens.css       # Design tokens
└── app/                 # Routes/pages
```

**Track B: WordPress Admin**

```
src/
├── components/
│   ├── admin/           # @wordpress/components wrappers
│   │   ├── button.tsx   # Button from @wordpress/components
│   │   ├── form.tsx     # TextControl, SelectControl, etc.
│   │   ├── table.tsx    # WP_List_Table or custom
│   │   ├── notice.tsx   # Notice component
│   │   ├── modal.tsx    # Modal component
│   │   ├── card.tsx     # Card, CardBody, CardHeader
│   │   ├── panel.tsx    # Panel, PanelBody, PanelRow
│   │   └── tabs.tsx     # TabPanel, Tabs
│   ├── layout/          # Admin layout (admin menu, header)
│   └── features/        # Feature-specific components
├── store/               # @wordpress/data stores
├── styles/
│   └── admin.css        # wp-admin overrides (if needed)
└── plugins/             # WordPress plugin entry points
```

### Stage 5: Wireframe & Prototype (MANDATORY — DO NOT SKIP)

> "A wireframe is a conversation with the future. Without it, you are monologuing
> at the code." — This skill

Before writing ANY code, create wireframes and prototypes that validate the new
design. This is not optional. This is not "nice to have." This is the specification
that the rewrite follows. Without it, you are guessing, not designing.

#### Why Wireframing Is Mandatory

1. **It catches design errors before code.** A wireframe takes 30 minutes. A code
   rewrite of a bad design takes days.
2. **It validates the UI map.** The UI map from Stage 2 is abstract. Wireframes
   make it concrete. Does the layout actually work? Do the interactions flow?
3. **It forces you to think about states.** Empty states, error states, loading states,
   success states — wireframes force you to design ALL of them, not just the happy path.
4. **It prevents "code-first design."** When you write code first, you design what's
   easy to code, not what's good for users. Wireframes invert this.

#### Fidelity Levels

Choose the right fidelity for the situation:

| Fidelity | Time | Detail | When to Use |
|----------|------|--------|-------------|
| **Low** (sketches) | 30 min – 2 hrs | Basic layout, no colors/fonts, boxes and lines | Early concept validation, brainstorming |
| **Medium** (wireframes) | 2 – 8 hrs | Layout, content, basic interaction, placeholder content | Team alignment, feedback gathering |
| **High** (prototypes) | 8+ hrs | Visual design, interactions, animations, real content | Developer handoff, user testing |

**For this skill: Medium fidelity is the default.** High fidelity only when the
user explicitly requests it or when the design is complex enough to need interaction
validation.

#### Wireframe Process

1. **List all screens** from the UI map (Stage 2).
2. **For each screen, create a wireframe** with:
   - Layout structure (header, sidebar, content, footer)
   - Navigation elements
   - Content areas (what data is displayed, where)
   - Interactive elements (buttons, forms, toggles, dropdowns)
   - States: empty, loading, error, success, partial data
3. **Define interaction flows** between screens:
   - User trigger → Screen transition → Result
   - Form submission → Validation → Success/Error
   - Navigation → Page load → Data display
4. **Validate against the library catalog:**
   - Does each interactive element have a library component?
   - Are the wireframe patterns compatible with Radix/shadcn/wp-components?
5. **Get feedback (if team exists)** before proceeding to code.

#### Wireframe Template

For each screen, produce:

```
SCREEN: [Screen Name]
Route: [URL path]
Purpose: [One sentence — what does this screen do?]

LAYOUT:
┌─────────────────────────────────────────┐
│ [Header: Logo, Search, User Menu]       │
├──────┬──────────────────────────────────┤
│      │                                  │
│ [Nav]│  [Main Content Area]             │
│      │                                  │
│      │  ┌────────────────────────────┐  │
│      │  │ [Content Block 1]          │  │
│      │  └────────────────────────────┘  │
│      │  ┌────────────────────────────┐  │
│      │  │ [Content Block 2]          │  │
│      │  └────────────────────────────┘  │
│      │                                  │
├──────┴──────────────────────────────────┤
│ [Footer]                                │
└─────────────────────────────────────────┘

COMPONENTS:
- [Component Name] → [Library: Radix/shadcn/wp-components]
- [Component Name] → [Library: ...]

STATES:
- Empty: [What shows when no data?]
- Loading: [Skeleton/spinner?]
- Error: [Error message? What action?]
- Success: [Confirmation? Toast?]

INTERACTIONS:
- [Element] → [Trigger] → [Action]
- [Form] → [Submit] → [Validate → Success: redirect | Error: inline error]
```

#### Prototype Component Template

When wireframing interactive elements, use this template structure:

```tsx
// Component: [Name]
// Wireframe: [Screen Name] — [Section]
// Library: [Radix/shadcn/wp-components — which component]

import React from 'react';

interface Props {
  // TODO: Define props based on wireframe
}

export function ComponentName({ }: Props) {
  // TODO: Add state and effects based on wireframe interactions

  return (
    <div>
      {/* TODO: Add component markup based on wireframe */}
    </div>
  );
}
```

#### Interaction Flow Definition

For every user flow, define:

```
FLOW: [Flow Name]
Trigger: [What starts this flow?]
Steps:
  1. [User action] → [System response]
  2. [User action] → [System response]
  3. [User action] → [System response]
Edge cases:
  - [What if step 2 fails?]
  - [What if user cancels at step 3?]
  - [What if network is unavailable?]
```

#### Wireframe Validation Checklist

Before proceeding to code, verify:

- [ ] Every screen from the UI map has a wireframe
- [ ] Every interactive element is mapped to a library component
- [ ] Every screen has empty, loading, error, and success states designed
- [ ] Every user flow has edge cases documented
- [ ] Every form has validation rules defined
- [ ] Navigation between all screens is defined
- [ ] Responsive behavior is considered (mobile/tablet/desktop)
- [ ] Accessibility is considered (keyboard flow, screen reader labels)
- [ ] The wireframe uses the correct design tokens (from Stage 4)
- [ ] The wireframe is consistent with the chosen styling track (Tailwind or wp-admin)

**If ANY screen is missing a wireframe, DO NOT proceed to code.**

### Stage 6: Component Rewrite

For each component, follow the rewrite protocol.

#### Rewrite Protocol Per Component

1. **Read the existing component.** Understand what it does, what data it uses,
   what interactions it supports.
2. **Check the library catalog.** (`references/library-catalog.md`) — Is there a
   Radix, React Aria, shadcn/ui, or @wordpress/components component that does this?
3. **If library exists:** Replace with the library component. Apply design tokens.
   Delete the custom implementation.
4. **If no library exists:** Rewrite using:
   - **Track A:** Tailwind CSS for styling (no inline styles, no CSS-in-JS)
   - **Track B:** @wordpress/components + wp-admin CSS patterns
   - Design tokens for colors, spacing, typography
   - Semantic HTML as the foundation
   - ARIA attributes where semantic HTML is insufficient
   - Composition pattern (children/slots) over configuration (props explosion)
5. **Verify accessibility.** Every interactive element must:
   - Be keyboard accessible
   - Have visible focus indicator
   - Have appropriate ARIA attributes
   - Pass axe-core checks
6. **Verify performance.** No unnecessary re-renders, no object literals in props,
   no missing memoization where needed.
7. **Delete the old component.** The best code is the code that was not written.

#### Rewrite Rules (ZERO TOLERANCE)

These are not suggestions. These are MANDATORY. Violation = the rewrite failed.

1. **Custom component exists where library exists → DELETE IT.** No exceptions.
   Check the catalog. If Radix, React Aria, shadcn/ui, or @wordpress/components
   has it, the custom version is GONE.

2. **Inline styles → DELETE EVERY ONE.** Search for `style={{`. Every occurrence
   is replaced with Tailwind classes. No "I'll fix this one later." Fix ALL of them.

3. **`!important` → DELETE EVERY ONE.** Search the CSS. Every `!important` is
   removed and the specificity is fixed at the source.

4. **Hardcoded colors → DELETE EVERY ONE.** Search for `#[0-9a-fA-F]`, `rgb(`,
   `rgba(`, `hsl(`. Every hardcoded color is replaced with a design token reference.

5. **Hardcoded spacing → DELETE EVERY ONE.** Search for `[0-9]+px` in styles.
   Every hardcoded pixel value is replaced with a 4px grid token.

6. **Missing ARIA → REWRITE THE COMPONENT.** Not "add ARIA to the existing code."
   Rewrite from scratch with accessibility built into the structure.

7. **`div` as button → DELETE AND REPLACE.** `<div onClick>` is not a button.
   Replace with `<button>` or a proper interactive element with role+keyboard.

8. **Missing label on input → DELETE AND REWRITE.** Every `<input>` must have
   an associated `<label>` or `aria-label`. Rewrite the form component.

9. **`outline: none` → DELETE.** Replace with a focus-visible ring using design
   tokens. The focus indicator is mandatory.

10. **Component > 200 lines → SPLIT.** No component should be longer than 200
    lines. If it is, it's doing too much. Split it into focused components.

11. **CSS file with custom styles → DELETE FILE.** Replace with Tailwind utility
    classes. The only CSS file that should exist is the design token file.

12. **No loading/error/empty states → ADD THEM.** Every async operation needs
    a loading state, an error state, and the component needs an empty state.

13. **No dark mode → ADD IT.** Use CSS custom properties. Support
    `prefers-color-scheme`. No component should be light-only.

14. **No responsive design → ADD IT.** Every component must work at 320px+.
    No fixed pixel widths. Use Tailwind responsive prefixes.

15. **No TypeScript strict → ENABLE IT.** Strict mode, no `any`, full type
    inference. Every prop must be typed.

#### Component Rewrite Checklist

For every component rewritten — ALL items must pass, no exceptions:

- [ ] **Library check:** Confirmed no library exists (or chose shadcn/ui copy)
- [ ] **Old component DELETED:** Not deprecated, not commented out — DELETED
- [ ] **New component from scratch:** Written new, not modified from old
- [ ] **Accessibility:** Keyboard accessible, focus visible, ARIA attributes, labels
- [ ] **Styling:** Tailwind CSS only (Track A) or wp-admin CSS (Track B)
- [ ] **Design tokens:** All colors/spacing/typography from tokens
- [ ] **No inline styles:** Zero `style={{` in the entire component
- [ ] **No hardcoded values:** Zero `#hex`, `rgb()`, `[0-9]+px` in the component
- [ ] **Composition:** children/slots pattern, no config objects
- [ ] **Size:** < 200 lines (HARD LIMIT)
- [ ] **Props:** < 7, no boolean explosions
- [ ] **Semantic HTML:** `<button>`, `<nav>`, `<main>`, `<header>`, etc.
- [ ] **Responsive:** Works at 320px+, no fixed pixel widths
- [ ] **Dark mode:** Uses CSS custom properties, supports `prefers-color-scheme`
- [ ] **Loading state:** Skeleton or spinner for async operations
- [ ] **Error state:** Meaningful error message, not blank
- [ ] **Empty state:** Designed, not blank
- [ ] **TypeScript:** Strict mode, no `any`, all props typed

### Stage 7: Verification & Polish

After all components are rewritten, verify the whole.

#### 6.1 Accessibility Verification

Run automated accessibility checks:
- axe-core scan (0 violations target)
- Keyboard navigation test (full app navigable without mouse)
- Screen reader test (semantic structure announced correctly)
- Focus management test (modals trap focus, escaping returns focus)

#### 6.2 Performance Verification

Compare before and after:
- Bundle size: should decrease (libraries tree-shake, custom code removed)
- Component count: should decrease (libraries replace multiple custom components)
- Lines of code: should decrease (the best code is no code)
- Re-render count: should decrease (libraries optimize internally)

#### 6.3 Code Quality Verification

- Average component size: should be < 200 lines
- Maximum component size: should be < 300 lines
- Props per component: should be < 7
- Import depth: should be < 4 levels
- `any` usage: should be 0
- Duplicate code: should be < 5%

#### 6.4 Visual Verification

- Design token consistency: all colors, spacing, typography from tokens
- Responsive behavior: works at all breakpoints
- Dark mode: all components support dark mode
- Transitions: consistent, purposeful motion (not gratuitous)
- Empty states: all lists/tables have designed empty states
- Error states: all async operations have error handling

#### 6.5 Final Report

```
UI/UX OVERHAUL REPORT

Before:
- Components: [N]
- Avg size: [N] lines
- Max size: [N] lines
- Accessibility violations: [N]
- Custom implementations: [N]
- Unique colors: [N]
- Libraries used: [list]

After:
- Components: [N] ([reduction]%)
- Avg size: [N] lines ([reduction]%)
- Max size: [N] lines
- Accessibility violations: 0
- Custom implementations: [N] (only where no library exists)
- Unique colors: [N] (from design tokens)
- Libraries used: [list — all open source]

Lines of code: [before] → [after] ([reduction]%)
Bundle size: [before] → [after] ([reduction]%)
```

---

## The Library-First Rule

**Before writing ANY component, check this list:**

### Track A: Tailwind CSS + Radix UI + shadcn/ui

| Need | Library | Install |
|------|---------|---------|
| Dialog / Modal | Radix Dialog | `npx shadcn@latest add dialog` |
| Select / Dropdown | Radix Select | `npx shadcn@latest add select` |
| Tabs | Radix Tabs | `npx shadcn@latest add tabs` |
| Accordion | Radix Accordion | `npx shadcn@latest add accordion` |
| Tooltip | Radix Tooltip | `npx shadcn@latest add tooltip` |
| Popover | Radix Popover | `npx shadcn@latest add popover` |
| Command Palette | cmdk | `npx shadcn@latest add command` |
| Data Table | @tanstack/react-table | `npm install @tanstack/react-table` |
| Form Validation | react-hook-form + zod | `npm install react-hook-form zod` |
| Date Picker | react-day-picker | `npx shadcn@latest add date-picker` |
| Drag & Drop | @dnd-kit/core | `npm install @dnd-kit/core` |
| Notifications | sonner | `npx shadcn@latest add sonner` |
| Toast | sonner | `npx shadcn@latest add sonner` |
| Skeleton | Radix Slot | `npx shadcn@latest add skeleton` |
| Switch / Toggle | Radix Switch | `npx shadcn@latest add switch` |
| Checkbox | Radix Checkbox | `npx shadcn@latest add checkbox` |
| Radio Group | Radix Radio Group | `npx shadcn@latest add radio-group` |
| Slider | Radix Slider | `npx shadcn@latest add slider` |
| Progress | Radix Progress | `npx shadcn@latest add progress` |
| Avatar | Radix Avatar | `npx shadcn@latest add avatar` |
| Badge | Tailwind only | Utility classes |
| Button | Tailwind + Radix Slot | `npx shadcn@latest add button` |
| Card | Tailwind only | Utility classes |
| Input | HTML + Tailwind | `npx shadcn@latest add input` |
| Label | Radix Label | `npx shadcn@latest add label` |
| Separator | Radix Separator | `npx shadcn@latest add separator` |
| Scroll Area | Radix ScrollArea | `npx shadcn@latest add scroll-area` |
| Navigation Menu | Radix NavigationMenu | `npx shadcn@latest add navigation-menu` |
| Context Menu | Radix ContextMenu | `npx shadcn@latest add context-menu` |
| Dropdown Menu | Radix DropdownMenu | `npx shadcn@latest add dropdown-menu` |
| Alert Dialog | Radix AlertDialog | `npx shadcn@latest add alert-dialog` |
| Aspect Ratio | Radix AspectRatio | `npx shadcn@latest add aspect-ratio` |
| Collapsible | Radix Collapsible | `npx shadcn@latest add collapsible` |
| Sheet | Radix Dialog (side variant) | `npx shadcn@latest add sheet` |
| Table | HTML + Tailwind | `npx shadcn@latest add table` |
| Form | react-hook-form + Zod | `npx shadcn@latest add form` |

### Track B: WordPress Admin (@wordpress/components)

| Need | Component | Import |
|------|-----------|--------|
| Button | `Button` | `@wordpress/components` |
| Button Group | `ButtonGroup` | `@wordpress/components` |
| Text Input | `TextControl` | `@wordpress/components` |
| Textarea | `TextareaControl` | `@wordpress/components` |
| Select | `SelectControl` | `@wordpress/components` |
| Checkbox | `CheckboxControl` | `@wordpress/components` |
| Radio | `RadioControl` | `@wordpress/components` |
| Toggle/Switch | `ToggleControl` | `@wordpress/components` |
| Range Slider | `RangeControl` | `@wordpress/components` |
| Number Input | `NumberControl` | `@wordpress/components` |
| Search | `SearchControl` | `@wordpress/components` |
| Combobox | `ComboboxControl` | `@wordpress/components` |
| Color Picker | `ColorPicker` / `ColorPalette` | `@wordpress/components` |
| Modal | `Modal` | `@wordpress/components` |
| Notice | `Notice` | `@wordpress/components` |
| Card | `Card` / `CardBody` / `CardHeader` | `@wordpress/components` |
| Panel | `Panel` / `PanelBody` / `PanelRow` | `@wordpress/components` |
| Tabs | `TabPanel` / `Tabs` | `@wordpress/components` |
| Tooltip | `Tooltip` | `@wordpress/components` |
| Spinner | `Spinner` | `@wordpress/components` |
| Progress | `ProgressBar` | `@wordpress/components` |
| Dropdown | `Dropdown` / `DropdownMenu` | `@wordpress/components` |
| Popover | `Popover` | `@wordpress/components` |
| Confirm Dialog | `ConfirmDialog` | `@wordpress/components` |
| Snackbar | `Snackbar` | `@wordpress/components` |
| Flex Layout | `Flex` / `HStack` / `VStack` | `@wordpress/components` |
| Divider | `Divider` | `@wordpress/components` |
| Scrollable | `Scrollable` | `@wordpress/components` |
| Badge | `Badge` | `@wordpress/components` |
| Icon | `Icon` | `@wordpress/components` |
| Heading | `Heading` | `@wordpress/components` |
| Text | `Text` | `@wordpress/components` |
| External Link | `ExternalLink` | `@wordpress/components` |
| Placeholder | `Placeholder` | `@wordpress/components` |
| Disabled | `Disabled` | `@wordpress/components` |
| Date Picker | `DatePicker` / `DateTimePicker` | `@wordpress/components` |
| File Upload | `FormFileUpload` | `@wordpress/components` |
| Drop Zone | `DropZone` | `@wordpress/components` |
| Resizable Box | `ResizableBox` | `@wordpress/components` |
| Guide | `Guide` / `GuideStep` | `@wordpress/components` |
| Navigator | `Navigator` | `@wordpress/components` |
| Clipboard Button | `ClipboardButton` | `@wordpress/components` |
| Shortcut | `Shortcut` | `@wordpress/components` |

---

## Anti-Patterns

1. **Custom modal** when Radix Dialog exists → Replace
2. **Custom select** when Radix Select exists → Replace
3. **Custom tooltip** when Radix Tooltip exists → Replace
4. **Inline styles** in JSX → Use Tailwind classes
5. **Hardcoded colors** → Use design tokens
6. **`!important`** → Fix specificity at source
7. **Boolean prop explosions** → Use composition or variants
8. **Component > 500 lines** → Split into smaller components
9. **No loading states** → Add skeletons/spinners
10. **No error states** → Add meaningful error UI
11. **No empty states** → Design empty states, not blank screens
12. **Missing keyboard navigation** → Add keyboard support
13. **Missing ARIA** → Add appropriate attributes
14. **No dark mode** → Use CSS custom properties
15. **`div` as button** → Use `<button>` or add role + keyboard

---

## Pre-Delivery Checklist (MANDATORY — ALL items must pass)

Before declaring the overhaul complete, EVERY item must be verified. No exceptions.
No "mostly done." No "close enough." ALL must pass.

### Rewrite Verification (non-negotiable)

- [ ] Code analysis complete (framework, components, architecture, a11y, tokens)
- [ ] Mandatory rewrite triggers evaluated — any ONE = rewrite
- [ ] If refactor was chosen: "Justify Keeping" checklist completed for EVERY retained component
- [ ] Every old component was DELETED (not deprecated, not commented out — deleted)
- [ ] New code written from scratch (not modified from old code)
- [ ] No cherry-picking from old code into new code
- [ ] Before/after metrics show improvement on ALL dimensions

### Component Quality (non-negotiable)

- [ ] Every custom implementation replaced with library (Radix, React Aria, shadcn/ui, @wordpress/components)
- [ ] Every component < 200 lines (NO exceptions without explicit justification)
- [ ] Every component < 7 props (NO exceptions)
- [ ] Every component uses composition (children/slots), not config objects
- [ ] Zero inline styles in entire codebase
- [ ] Zero hardcoded colors — all from design tokens
- [ ] Zero `!important` usage
- [ ] Design tokens established and used consistently

### Accessibility (non-negotiable)

- [ ] Zero axe-core violations
- [ ] Every interactive element keyboard accessible
- [ ] Every interactive element has visible focus indicator
- [ ] Every form input has associated label
- [ ] Every image has alt text
- [ ] Every dynamic region has aria-live
- [ ] Heading hierarchy is correct (no skips)
- [ ] Landmark roles present (main, nav, header, footer)

### States (non-negotiable)

- [ ] Every async operation has loading state (skeleton or spinner)
- [ ] Every async operation has error state (meaningful message, not blank)
- [ ] Every list/table has empty state (designed, not blank)
- [ ] Every destructive action has confirmation

### Design System (non-negotiable)

- [ ] Dark mode supported via CSS custom properties
- [ ] Responsive: works at 320px+, no fixed pixel widths
- [ ] Typography from token scale (not arbitrary font sizes)
- [ ] Spacing from 4px grid (not arbitrary pixel values)
- [ ] Colors from token palette (not arbitrary hex/rgb values)

### TypeScript (non-negotiable)

- [ ] Strict mode enabled
- [ ] Zero `any` types
- [ ] All props typed with interfaces
- [ ] No type assertions (`as`) unless absolutely necessary

---

## Gate Implications (STRICT)

The gate must **BLOCK** when ANY of these are true:

### Rewrite Integrity Blocks

- A mandatory rewrite trigger was true but refactor was chosen without documented risk acceptance
- "Justify Keeping" checklist was not completed for retained components
- Old code was not deleted (dual maintenance — old + new coexisting)
- New code was modified from old code (not written from scratch)
- Before/after metrics show NO improvement or regression on any dimension

### Component Quality Blocks

- ANY component > 200 lines
- ANY component has > 7 props
- ANY inline styles exist
- ANY hardcoded colors exist
- ANY `!important` usage exists
- ANY custom implementation exists where a library should be used
- Design tokens not established or not used consistently

### Accessibility Blocks

- ANY axe-core violation
- ANY interactive element not keyboard accessible
- ANY interactive element without visible focus
- ANY form input without associated label
- ANY image without alt text

### State Blocks

- ANY async operation without loading state
- ANY async operation without error state
- ANY list/table without empty state

### Design System Blocks

- Dark mode not supported
- Responsive design not working at 320px
- Typography not from token scale
- Spacing not from 4px grid

The gate must **WARN** when:

- Components are 150-200 lines (at the limit)
- Animation could be simpler (CSS instead of framer-motion)
- Some tokens are approximate (not final design values)
- Bundle size increased slightly (library added, but behavior gained)

**The gate does NOT warn about "close enough." It blocks.**

---

## Evidence Required

A ui-ux-overhaul session should produce:

- Code analysis report (framework, components, a11y, tokens, performance)
- UI map reconstructed from code
- Architecture decision document (stack choices with rationale)
- **Wireframes for every screen** (layout, components, states, interactions)
- **Interaction flow definitions** (user triggers → system responses → edge cases)
- **Wireframe validation checklist** (all screens covered, all states designed)
- Design token file (CSS custom properties)
- Rewritten components (all using libraries + Tailwind)
- Accessibility verification (axe-core results, keyboard test)
- Performance comparison (before/after bundle size, component count)
- Code quality comparison (before/after metrics)
- Deletion log (what old code was removed)

---

## Test Cases

### Test Case 1: Full UI overhaul with custom modal
**Input:** A React app with 20 components, including a custom Modal (400 lines, no focus trap, no ARIA), a custom Select (350 lines, no keyboard nav), inline styles throughout, hardcoded colors, no loading/error states.
**Expected output:** Code analysis identifying all issues. Rewrite replacing Modal with Radix Dialog (via shadcn/ui), Select with Radix Select, all styling migrated to Tailwind with design tokens. Loading/error/empty states added. Before/after metrics.
**Assertion:** Custom Modal and Select are replaced with library components. No inline styles remain. No hardcoded colors. All components have loading/error states. Lines of code reduced by >40%.

### Test Case 2: Accessibility-focused rewrite
**Input:** A form-heavy app with 15 inputs, no labels, no error associations, no focus indicators, `div` elements used as buttons throughout.
**Expected output:** All inputs labeled, error messages linked via `aria-describedby`, focus indicators restored, `div` buttons replaced with `<button>` or proper role+keyboard. axe-core violations = 0.
**Assertion:** Zero axe-core violations. All form fields have labels. All interactive elements are keyboard accessible. Focus indicators visible.

### Test Case 3: Design system establishment
**Input:** A React app with 15 unique colors, 12 unique spacing values, 8 unique font sizes — all hardcoded in CSS files. No theme provider, no tokens.
**Expected output:** Design token file created (CSS custom properties). All hardcoded values migrated to tokens. Theme provider established. Dark mode support added via `prefers-color-scheme`.
**Assertion:** Unique hardcoded colors reduced to 0 (all from tokens). Spacing values mapped to 4px grid. Dark mode toggle functional. Token file has ≤5 colors, ≤7 spacing values, ≤5 font sizes.
