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

Three principles govern every rewrite:

1. **Library-first.** Before writing any component, check: does Radix UI, React Aria,
   shadcn/ui, or Headless UI already do this? If yes, use it. The best code is the
   code that was not written.
2. **Headless by default.** Use unstyled primitives (Radix, React Aria, Ark UI) for
   behavior. Apply styles with Tailwind CSS or your design tokens. Separate behavior
   from presentation.
3. **Open code, not dependencies.** Prefer shadcn/ui's model: copy components into
   your codebase, own them, modify them freely. No npm dependency for something you
   can own.

---

## The Overhaul Pipeline

```
Code Analysis → UI/UX Understanding → Rewrite Decision → Architecture Design
  → Component Rewrite → Verification & Polish
```

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

### Stage 3: Rewrite Decision

Determine whether to rewrite or refactor.

#### Rewrite When (≥60% of components need changes)

- Custom implementations where libraries should exist (focus trap, ARIA, keyboard)
- Accessibility violations in >30% of components
- No design system (hardcoded colors, spacing, typography throughout)
- Framework is end-of-life or fundamentally wrong for the use case
- Component files are consistently >500 lines
- The codebase is more library code than application code

#### Refactor When (<60% of components need changes)

- Architecture is sound but implementation is poor
- Some components are good and should be preserved
- Business logic is correct and must be preserved exactly
- Team can do incremental improvement

**For this skill: we assume REWRITE.** The user asked for overhaul. If the analysis
shows refactoring is better, tell the user — but proceed with rewrite unless advised
otherwise.

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

### Stage 5: Component Rewrite

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

#### Rewrite Rules

- **Never create a custom implementation if a library does it.** Check the catalog.
- **Never use inline styles.** Always Tailwind classes (Track A) or wp-admin CSS classes (Track B).
- **Never use `!important`.** Fix the specificity at the source.
- **Never hardcode colors.** Always use design tokens (HSL for Track A, wp-admin variables for Track B).
- **Never skip ARIA.** Every interactive element must be accessible.
- **Never use `div` for interactive elements.** Use `<button>`, `<a>`, `<input>`,
  or add `role` + `tabIndex` + keyboard handler.
- **Never exceed 200 lines per component.** If it's longer, split it.
- **Never use boolean prop explosions.** Use composition or variant patterns.
- **Never duplicate styling.** Extract to a shared utility or token.

#### Component Rewrite Checklist

For every component rewritten:

- [ ] Library check: confirmed no library exists (or chose shadcn/ui copy)
- [ ] Accessibility: keyboard accessible, focus visible, ARIA attributes
- [ ] Styling: Tailwind CSS (Track A) or wp-admin CSS (Track B), design tokens for colors/spacing/typography
- [ ] Composition: children/slots pattern, no config objects
- [ ] Size: < 200 lines
- [ ] Props: < 7, no boolean explosions
- [ ] Semantic HTML: correct elements (`button`, `nav`, `main`, etc.)
- [ ] Responsive: works at 320px+, no fixed pixel widths
- [ ] Dark mode: uses CSS custom properties, supports `prefers-color-scheme`
- [ ] Loading state: skeleton or spinner for async operations
- [ ] Error state: meaningful error message, not blank
- [ ] Empty state: designed, not blank
- [ ] TypeScript: strict types, no `any`

### Stage 6: Verification & Polish

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

## Pre-Delivery Checklist

Before declaring the overhaul complete:

- [ ] Code analysis complete (framework, components, architecture, a11y, tokens)
- [ ] UI map produced (reconstructed from code)
- [ ] Rewrite decision made (rewrite vs refactor)
- [ ] Architecture designed (stack, tokens, component tree)
- [ ] Every custom implementation checked against library catalog
- [ ] Every component rewritten using libraries + Tailwind + tokens
- [ ] Zero accessibility violations
- [ ] All interactive elements keyboard accessible with visible focus
- [ ] All components < 200 lines
- [ ] All components < 7 props
- [ ] No inline styles, no hardcoded colors, no `!important`
- [ ] Design tokens used consistently
- [ ] Dark mode supported via CSS custom properties
- [ ] Loading, error, empty states present
- [ ] Before/after metrics produced
- [ ] All old custom implementations deleted

---

## Gate Implications

The gate must **BLOCK** when:

- A custom implementation exists where a library should be used
- Accessibility violations remain unfixed
- Inline styles or hardcoded colors persist
- Components exceed 300 lines without justification
- No design tokens are established
- Dark mode is not supported
- Loading/error/empty states are missing
- The "before" code was not deleted (dual maintenance)

The gate must **WARN** when:

- Some components are 200-300 lines (acceptable but review)
- Animation could be simpler (CSS instead of framer-motion)
- Some tokens are approximate (not final design values)
- Bundle size increased slightly (library added, but behavior gained)

---

## Evidence Required

A ui-ux-overhaul session should produce:

- Code analysis report (framework, components, a11y, tokens, performance)
- UI map reconstructed from code
- Architecture decision document (stack choices with rationale)
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
