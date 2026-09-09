# Open-Source Library Catalog

The complete catalog of open-source libraries checked before writing any custom code.
The best code is the code that was not written.

## WordPress Admin Components (@wordpress/components)

### @wordpress/components
- **What:** 90+ React components for WordPress admin interfaces
- **Why:** Native wp-admin look and feel, consistent with WordPress core, accessible
- **Components:** Button, TextControl, TextareaControl, SelectControl, CheckboxControl, RadioControl, ToggleControl, RangeControl, NumberControl, SearchControl, ComboboxControl, ColorPicker, ColorPalette, Modal, Notice, Card, CardBody, CardHeader, Panel, PanelBody, PanelRow, TabPanel, Tabs, Tooltip, Spinner, ProgressBar, Dropdown, DropdownMenu, Popover, ConfirmDialog, Snackbar, Flex, HStack, VStack, Divider, Scrollable, Badge, Icon, Heading, Text, ExternalLink, Placeholder, Disabled, DatePicker, DateTimePicker, FormFileUpload, DropZone, ResizableBox, Guide, Navigator, ClipboardButton, Shortcut, NavigableContainer, ScrollLock, SlotFill, HigherOrder, StyleProvider, CustomSelectControl, FormToggle, FormTokenField, CircularOptionPicker, DuotonePicker, GradientPicker, PaletteEdit, AlignmentMatrixControl, AnglePickerControl, BoxControl, BorderBoxControl, BorderControl, Draggable, Autocomplete, Composite, KeyboardShortcuts, Sandbox, Surface, Elevation, TextHighlight, Tip, ThemeProvider, __experimentalInputControl
- **Install:** `npm install @wordpress/components`
- **Use for:** WordPress admin pages, plugin admin screens, Gutenberg extensions
- **Note:** Within wp-admin, enqueue via `wp_enqueue_style('wp-components')`. Outside wp-admin, import `@wordpress/components/build-style/style.css`.
- **WordPress 7.1:** Now includes `ThemeProvider` for customizing admin UI areas with the new DTCG-spec design tokens.

### @wordpress/theme (NEW in 7.1)
- **What:** Design system theming layer with DTCG-spec CSS custom properties
- **Why:** Semantic design tokens for color, typography, border, elevation, roundness — following the W3C Design Tokens Community Group specification
- **Features:**
  - CSS custom properties for all admin styling
  - `ThemeProvider` React component for customizing admin UI areas
  - Color ramp generator from accent/background seed colors
  - Tokens importable into Figma via DTCG spec
  - Supports dark mode capability
- **Install:** Ships with WordPress 7.1 core (`wp-theme` registered stylesheet)
- **Use for:** All admin UI styling, user color scheme customization, plugin branding
- **Token categories:** Color, roundness, cursor styles, elevation, typography, border
- **Key tokens:** `--wp-admin-theme-color`, `--wp-elevation-*`, `--wp-radius-*`, `--wp-color-*`

### @wordpress/data
- **What:** Redux-based state management for WordPress
- **Why:** Integrates with WordPress data layers (REST API, options, user meta)
- **Install:** `npm install @wordpress/data`
- **Use for:** Global state in WordPress admin interfaces

### @wordpress/icons
- **What:** WordPress admin icons
- **Why:** Consistent with WordPress core, tree-shakeable
- **Install:** `npm install @wordpress/icons`
- **Use for:** All icons in WordPress admin interfaces

### @wordpress/block-editor
- **What:** Gutenberg block editor components
- **Why:** Building custom blocks, sidebar controls, block patterns
- **Install:** `npm install @wordpress/block-editor`
- **Use for:** Custom Gutenberg blocks and editor extensions

### dashicons
- **What:** WordPress admin icon font
- **Why:** Built into wp-admin, no install needed
- **Usage:** `<span class="dashicons dashicons-admin-post"></span>`
- **Use for:** Legacy admin icons, menu icons

### WordPress Admin CSS Patterns

**WordPress 7.1+ (recommended):** Use the new Design System Theming tokens instead
of hardcoded CSS values. The `wp-theme` package provides DTCG-spec CSS custom
properties for color, typography, border, elevation, and roundness. Use
`ThemeProvider` to customize admin UI areas.

**Pre-7.1 fallback:** When targeting older WordPress installs, use these patterns:

**Buttons:**
```css
/* Secondary (default) */
.button { /* matches wp-admin .button */ }

/* Primary */
.button-primary { /* filled with --wp-admin-theme-color */ }

/* Link */
.button-link { /* text-only, theme color */ }
```

**Form Elements:**
```css
input[type="text"], select, textarea {
  border: 1px solid #949494;
  border-radius: 2px;
  min-height: 40px;
  padding: 0 12px;
}
input:focus {
  border-color: var(--wp-admin-theme-color);
  box-shadow: 0 0 0 1.5px var(--wp-admin-theme-color);
}
```

**Notices:**
```css
.notice-success { border-left-color: #4ab866; background: #eff9f1; }
.notice-warning { border-left-color: #f0b849; background: #fef8ee; }
.notice-error   { border-left-color: #cc1818; background: #fcf0f0; }
.notice-info    { border-left-color: #3858e9; }
```

**Cards:**
```css
.card { border: 1px solid rgba(0,0,0,0.1); border-radius: 8px; padding: 16px 24px; }
.postbox { border: 1px solid #c3c4c7; box-shadow: 0 1px 1px rgba(0,0,0,0.04); }
```

**Tables:**
```css
.widefat { border: 1px solid #c3c4c7; width: 100%; background: #fff; }
.widefat th, .widefat td { padding: 8px 10px; }
```

**Tabs:**
```css
.nav-tab { border: 1px solid #c3c4c7; background: #f0f0f1; }
.nav-tab-active { background: #fff; border-bottom-color: #fff; font-weight: 600; }
```

## Component Libraries (Headless/Unstyled)

### Radix UI
- **What:** Low-level, unstyled, accessible React component primitives
- **Why:** Best-in-class WAI-ARIA compliance, `asChild` render delegation, fully typed
- **Components:** Dialog, Select, Tabs, Accordion, Tooltip, Popover, DropdownMenu, NavigationMenu, ContextMenu, AlertDialog, Checkbox, Switch, RadioGroup, Slider, Progress, Avatar, Separator, ScrollArea, Collapsible, Label, Slot
- **Install:** `npx shadcn@latest add [component]`
- **Use for:** Every interactive component that needs accessibility

### React Aria (Adobe)
- **What:** 50+ hooks and components for accessible UIs with custom styles
- **Why:** Most comprehensive accessibility testing (multiple screen readers, devices), internationalization (30+ languages), adaptive interactions
- **Components:** Button, Checkbox, ComboBox, DatePicker, Dialog, DropZone, FocusRing, ListBox, Menu, Modal, NumberField, Popover, RadioGroup, SearchField, Select, Slider, Switch, Tabs, TextField, ToggleButton, Tooltip
- **Install:** `npm install react-aria react-stately`
- **Use for:** When Radix lacks a primitive, or when you need hooks-level control

### Headless UI (Tailwind Labs)
- **What:** Unstyled, accessible components for React and Vue
- **Why:** Designed for Tailwind CSS, minimal API
- **Components:** Dialog, Disclosure, Listbox, Menu, Popover, RadioGroup, Switch, Tab, Transition
- **Install:** `npm install @headlessui/react`
- **Use for:** Tailwind-native projects wanting simple APIs

### @wordpress/components
- **What:** 90+ React components for WordPress admin interfaces
- **Why:** Native wp-admin look and feel, consistent with WordPress core, accessible
- **Components:** Button, TextControl, SelectControl, CheckboxControl, RadioControl, ToggleControl, Modal, Notice, Card, Panel, TabPanel, Tooltip, Spinner, Dropdown, Popover, ConfirmDialog, Snackbar, Flex, DatePicker, and 70+ more
- **Install:** `npm install @wordpress/components`
- **Use for:** WordPress admin pages, plugin admin screens, Gutenberg extensions
- **Note:** Within wp-admin, enqueue via `wp_enqueue_style('wp-components')`

### Ark UI
- **What:** Headless UI for React, Solid, Vue, Svelte (state machine powered)
- **Why:** Framework-agnostic, state machine logic, 45+ components
- **Install:** `npm install @ark-ui/react`
- **Use for:** Multi-framework projects, complex stateful components

### Zag.js
- **What:** State machine-powered UI component logic
- **Why:** Eliminates impossible states, framework-agnostic
- **Install:** `npm install @zag-js/core`
- **Use for:** Complex components (multi-select, date picker, drag-and-drop)

## Styled Component Libraries (Copy-Paste)

### shadcn/ui
- **What:** Copy-paste components built on Radix UI + Tailwind CSS
- **Why:** You own the code (no npm dependency), beautiful defaults, AI-readable
- **Install:** `npx shadcn@latest add [component]`
- **Components:** 45+ components including accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, checkbox, collapsible, command, context-menu, data-table, date-picker, dialog, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toggle, tooltip
- **Use for:** Default choice for React + Tailwind projects

### Park UI
- **What:** Styled components on Ark UI + Panda CSS
- **Why:** Pre-styled design system on headless primitives
- **Install:** `npm install @park-ui/panda-preset`
- **Use for:** Panda CSS projects

### React Spectrum (Adobe)
- **What:** Full React component library with Adobe's Spectrum design system
- **Why:** Complete, production-ready design system
- **Install:** `npm install @adobe/react-spectrum`
- **Use for:** When you want Adobe-quality components with minimal design effort

## Forms & Validation

### react-hook-form
- **What:** Performant forms with minimal re-renders
- **Why:** Schema validation, minimal re-renders, tiny bundle
- **Install:** `npm install react-hook-form`
- **Use for:** Every form in the application

### Zod
- **What:** TypeScript-first schema validation
- **Why:** Type inference, composable schemas, runtime validation
- **Install:** `npm install zod`
- **Use for:** Form validation, API response validation, environment variables

### Valibot
- **What:** Modular schema validation (smaller than Zod)
- **Why:** 10x smaller bundle than Zod, same API surface
- **Install:** `npm install valibot`
- **Use for:** When bundle size matters more than ecosystem

## Tables & Data

### @tanstack/react-table
- **What:** Headless table library for React
- **Why:** Sorting, filtering, pagination, grouping, virtualization — all headless
- **Install:** `npm install @tanstack/react-table`
- **Use for:** Every data table in the application

### AG Grid
- **What:** Feature-rich data grid
- **Why:** Enterprise features (pivoting, column groups, CSV export)
- **Install:** `npm install ag-grid-community`
- **Use for:** Complex data grids with enterprise needs

## Drag & Drop

### @dnd-kit/core
- **What:** Accessible, lightweight drag-and-drop toolkit
- **Why:** Touch-friendly, accessible, composable, small bundle
- **Install:** `npm install @dnd-kit/core`
- **Use for:** Every drag-and-drop interaction

### @dnd-kit/sortable
- **What:** Sortable preset for @dnd-kit
- **Why:** Accessible sorting with keyboard support
- **Install:** `npm install @dnd-kit/sortable`
- **Use for:** Reorderable lists, kanban boards

## Command & Search

### cmdk
- **What:** Accessible command palette component
- **Why:** Keyboard navigation, search, nested commands, composable
- **Install:** `npx shadcn@latest add command`
- **Use for:** Command palettes, search interfaces, navigation

### Fuse.js
- **What:** Lightweight fuzzy search
- **Why:** Client-side fuzzy search, tiny bundle
- **Install:** `npm install fuse.js`
- **Use for:** Search filtering in command palettes

## Animations

### framer-motion
- **What:** Declarative React animations
- **Why:** Simple API, performant (GPU-accelerated), layout animations
- **Install:** `npm install framer-motion`
- **Use for:** Page transitions, layout animations, gesture-based interactions
- **Rule:** Use sparingly. CSS transitions first. framer-motion only for complex orchestration.

### tailwindcss-animate
- **What:** Animation utilities for Tailwind CSS
- **Why:** Pre-built animations, compatible with Tailwind
- **Install:** `npm install tailwindcss-animate`
- **Use for:** Simple enter/exit animations, loading states

## Toast & Notifications

### sonner
- **What:** An opinionated toast component
- **Why:** Beautiful, lightweight, accessible, customizable
- **Install:** `npx shadcn@latest add sonner`
- **Use for:** All toast notifications

### react-hot-toast
- **What:** Lightweight toast library
- **Why:** Tiny bundle, simple API
- **Install:** `npm install react-hot-toast`
- **Use for:** When sonner is too heavy

## Icons

### lucide-react
- **What:** Beautiful, consistent icon set
- **Why:** Tree-shakeable, consistent style, 1000+ icons
- **Install:** `npm install lucide-react`
- **Use for:** All icons in the application

### heroicons
- **What:** SVG icons by Tailwind Labs
- **Why:** Designed for Tailwind, consistent style
- **Install:** `npm install @heroicons/react`
- **Use for:** Alternative to lucide-react

## Utilities

### clsx / classnames
- **What:** Conditional class name utility
- **Why:** Compose class names without string concatenation
- **Install:** `npm install clsx`
- **Use for:** Every className that needs conditions

### tailwind-merge
- **What:** Merge Tailwind classes intelligently
- **Why:** Resolves conflicts (e.g., `px-2 px-4` → `px-4`)
- **Install:** `npm install tailwind-merge`
- **Use for:** Component libraries where classes are overridden

### cva (class-variance-authority)
- **What:** Create variant-based component APIs
- **Why:** Type-safe variants, composable
- **Install:** `npm install class-variance-authority`
- **Use for:** Button variants, badge variants, etc.

## State Management

### Zustand
- **What:** Small, fast, scalable state management
- **Why:** Simple API, no providers, tiny bundle
- **Install:** `npm install zustand`
- **Use for:** Global state that can't live in URL or server state

### Jotai
- **What:** Primitive and flexible state management
- **Why:** Atomic state, bottom-up approach, no boilerplate
- **Install:** `npm install jotai`
- **Use for:** Fine-grained reactivity, derived state

### TanStack Query
- **What:** Server state management
- **Why:** Caching, background refetching, optimistic updates
- **Install:** `npm install @tanstack/react-query`
- **Use for:** Every API call in the application

## URL State

### nuqs
- **What:** Type-safe search params state for Next.js
- **Why:** URL as state store, shareable, bookmarkable
- **Install:** `npm install nuqs`
- **Use for:** Filters, search, pagination, sorting

## Date & Time

### date-fns
- **What:** Modern date utility library
- **Why:** Tree-shakeable, immutable, 200+ functions
- **Install:** `npm install date-fns`
- **Use for:** All date operations (replaces moment.js)

### react-day-picker
- **What:** Flexible date picker component
- **Why:** Accessible, customizable, lightweight
- **Install:** `npx shadcn@latest add date-picker`
- **Use for:** Date selection in forms
