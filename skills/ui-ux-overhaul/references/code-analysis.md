# Code Analysis Reference

How to analyze frontend code to understand UI/UX without screenshots, without Figma,
and without anyone explaining the interface.

## Framework Detection

### From package.json

```bash
# React
grep -q '"react"' package.json && echo "React"

# Next.js
grep -q '"next"' package.json && echo "Next.js"

# Vue
grep -q '"vue"' package.json && echo "Vue"

# Angular
grep -q '"@angular/core"' package.json && echo "Angular"

# Svelte
grep -q '"svelte"' package.json && echo "Svelte"
```

### From File Patterns

| Pattern | Framework |
|---------|-----------|
| `*.tsx`, `*.jsx` | React |
| `*.vue` | Vue |
| `*.svelte` | Svelte |
| `*.component.ts` | Angular |

### From Styling

| Import Pattern | Styling Approach |
|---------------|-----------------|
| `tailwindcss` in devDeps | Tailwind CSS |
| `styled-components` | CSS-in-JS |
| `@emotion/react` | Emotion |
| `*.module.css` | CSS Modules |
| `style={{` in JSX | Inline styles |
| `@vanilla-extract` | Vanilla Extract |
| `panda.config` | Panda CSS |

## Component Inventory

### Count Components

```bash
# React components (function declarations)
grep -r "export.*function\|export default function\|const.*= .*=>" src/ --include="*.tsx" --include="*.jsx" | wc -l

# Files > 300 lines
find src/ -name "*.tsx" -o -name "*.jsx" | xargs wc -l | awk '$1 > 300 {print}'

# Files > 500 lines (rewrite candidates)
find src/ -name "*.tsx" -o -name "*.jsx" | xargs wc -l | awk '$1 > 500 {print}'

# Files > 1000 lines (urgent)
find src/ -name "*.tsx" -o -name "*.jsx" | xargs wc -l | awk '$1 > 1000 {print}'
```

### Component Size Classification

| Size | Classification | Action |
|------|---------------|--------|
| < 100 lines | Small, focused | Keep |
| 100-200 lines | Moderate, acceptable | Review |
| 200-300 lines | Large, review needed | Consider splitting |
| 300-500 lines | Too large | Split or rewrite |
| > 500 lines | God component | Rewrite immediately |

## Architecture Pattern Detection

### Compound Components

Look for named exports attached to a parent:

```tsx
// GOOD: Compound component pattern
export const Table = { Header, Row, Cell, Body };

// BAD: Configuration object
<DataTable columns={...} data={...} renderHeader={...} renderRow={...} />
```

### Props Drilling Detection

```bash
# Count props per component (components with many props pass them through)
grep -r "props\." src/ --include="*.tsx" | awk -F'.' '{print $1}' | sort | uniq -c | sort -rn | head -20

# Components that receive and pass props without using them
# (manual analysis: look for props received but only passed to children)
```

### State Location

```bash
# Global state (potential anti-pattern for UI state)
grep -r "useSelector\|useStore\|useRecoilState\|useAtom" src/ --include="*.tsx" | wc -l

# Context usage (good for theme/auth, bad for frequently changing values)
grep -r "createContext\|useContext" src/ --include="*.tsx" | wc -l

# Local state (good)
grep -r "useState\|useReducer" src/ --include="*.tsx" | wc -l

# URL state (best for filters/sort/pagination)
grep -r "useSearchParams\|useRouter\|useQuery" src/ --include="*.tsx" | wc -l
```

## Accessibility Audit

### Critical Violations

```bash
# Images without alt
grep -r "<img" src/ --include="*.tsx" | grep -v "alt=" | wc -l

# Click handlers on non-interactive elements
grep -r "onClick" src/ --include="*.tsx" | grep -v "<button\|<a \|<input\|<select\|<textarea" | wc -l

# Inputs without labels
grep -r "<input" src/ --include="*.tsx" | grep -v "aria-label\|<label\|aria-labelledby" | wc -l

# Outline removal without replacement
grep -r "outline.*none\|outline.*0" src/ --include="*.css" --include="*.scss" | wc -l

# tabIndex > 0 (breaks tab order)
grep -r "tabIndex={[1-9]}" src/ --include="*.tsx" | wc -l
```

### Structural Issues

```bash
# Heading hierarchy (look for h1-h6)
grep -rE "<h[1-6]" src/ --include="*.tsx" | awk -F'<h' '{print $2}' | awk -F'>' '{print $1}' | sort -n

# Missing landmark roles
grep -r "<main\|<nav\|<header\|<footer\|<aside" src/ --include="*.tsx" | wc -l

# Missing skip navigation
grep -r "skip.*main\|skip.*content" src/ --include="*.tsx" | wc -l
```

### Form Accessibility

```bash
# Form error association (aria-describedby)
grep -r "aria-describedby" src/ --include="*.tsx" | wc -l

# Required fields
grep -r "required" src/ --include="*.tsx" | grep -v "aria-required" | wc -l

# aria-invalid usage
grep -r "aria-invalid" src/ --include="*.tsx" | wc -l
```

## Design System Detection

### Token Usage Analysis

```bash
# Unique color values (hardcoded)
grep -rohE '#[0-9a-fA-F]{3,8}\|rgb[a]?([^)]*)\|hsl[a]?([^)]*)' src/ | sort | uniq -c | sort -rn

# Unique spacing values (hardcoded px)
grep -rohE '[0-9]+px' src/ | sort | uniq -c | sort -rn

# Unique font sizes
grep -rohE 'font-size:\s*[0-9]+px\|text-\[.*px\]' src/ | sort | uniq -c | sort -rn

# Unique border radii
grep -rohE 'border-radius:\s*[0-9]+px\|rounded-\[.*px\]' src/ | sort | uniq -c | sort -rn

# !important usage
grep -r "!important" src/ | wc -l
```

### Token Consistency Scoring

| Metric | < 5 values | 5-15 values | > 15 values |
|--------|-----------|-------------|-------------|
| Colors | Good tokens | Moderate | No tokens |
| Spacing | Good tokens | Moderate | No tokens |
| Font sizes | Good tokens | Moderate | No tokens |
| Border radii | Good tokens | Moderate | No tokens |

## Performance Indicators

### Re-render Issues

```bash
# useEffect setting state (render loops)
grep -r "useEffect" src/ --include="*.tsx" -A 5 | grep "setState\|set[A-Z]" | wc -l

# Object literals in JSX props (new references each render)
grep -r "style={{" src/ --include="*.tsx" | wc -l

# Missing memoization in large trees
grep -r "React.memo\|memo(" src/ --include="*.tsx" | wc -l
```

### Bundle Issues

```bash
# Heavy libraries
grep -q "moment" package.json && echo "Use date-fns instead"
grep -q '"lodash"' package.json && echo "Use lodash-es instead"
grep -q '"antd"' package.json && echo "Consider Radix UI"

# No code splitting
grep -r "dynamic\|lazy\|React.lazy" src/ --include="*.tsx" | wc -l

# Barrel file imports (potential tree-shaking issues)
grep -r "from '@/components'" src/ --include="*.tsx" | wc -l
```

## Custom Code That Should Be Libraries

### Detection Patterns

| Custom Code Pattern | Library Replacement |
|--------------------|--------------------|
| `<div onClick...` with modal-like behavior | Radix Dialog |
| Custom dropdown with `position: absolute` | Radix Select |
| Custom tooltip with `setTimeout` | Radix Tooltip |
| Custom tabs with `useState` for active tab | Radix Tabs |
| Custom accordion with `useState` for open | Radix Accordion |
| Custom form validation with `useState` | react-hook-form + zod |
| Custom drag-and-drop with `onDrag*` | @dnd-kit/core |
| Custom toast with `useState` + timer | sonner |
| Custom command palette with filter logic | cmdk |
| Custom date picker with calendar grid | react-day-picker |

### Quantify Custom Implementations

```bash
# Custom modal/dialog patterns
grep -r "useEffect.*escape\|onKeyDown.*Escape\|TrapFocus\|FocusTrap" src/ --include="*.tsx" | wc -l

# Custom select/dropdown patterns
grep -r "position.*absolute.*dropdown\|showDropdown\|isOpen.*setIsOpen" src/ --include="*.tsx" | wc -l

# Custom tooltip patterns
grep -r "onMouseEnter.*tooltip\|showTooltip\|tooltipRef" src/ --include="*.tsx" | wc -l

# Custom form validation
grep -r "validate.*=\|validation.*=\|errors.*set" src/ --include="*.tsx" | wc -l
```

## Analysis Output Template

```
UI/UX CODE ANALYSIS REPORT

Framework: [React/Vue/Svelte/Angular] + [Next.js/Nuxt/etc.]
Styling: [Tailwind/CSS-in-JS/Modules/Inline]

COMPONENTS
Total: [N]
< 200 lines: [N] (good)
200-300 lines: [N] (review)
300-500 lines: [N] (split)
> 500 lines: [N] (rewrite)

ARCHITECTURE
Composition pattern: [good/poor]
Props drilling depth: [max depth]
State management: [local/context/global]
Barrel file usage: [none/selective/heavy]

ACCESSIBILITY
Critical violations: [N]
Major violations: [N]
Moderate violations: [N]
Images without alt: [N]
Click handlers without keyboard: [N]
Inputs without labels: [N]
Outline removed: [N]

DESIGN SYSTEM
Theme provider: [present/absent]
Design tokens: [present/absent]
Unique colors: [N] ([score])
Unique spacing: [N] ([score])
Unique font sizes: [N] ([score])
!important usage: [N]
Inline styles: [N]

PERFORMANCE
useEffect state setting: [N]
Object literals in props: [N]
Missing memoization: [N]
Code splitting: [present/absent]
Heavy libraries: [list]

CUSTOM IMPLEMENTATIONS (should be libraries)
Custom modals: [N]
Custom selects: [N]
Custom tooltips: [N]
Custom form validation: [N]
Custom drag-and-drop: [N]
Custom toasts: [N]
Total custom: [N]

REWRITE CANDIDATES
[Component] ([lines] lines) — [reason]
[Component] ([lines] lines) — [reason]
```
