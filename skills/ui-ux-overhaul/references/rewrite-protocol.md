# Rewrite Protocol

When and how to rewrite frontend code. Decision framework, execution strategy,
and validation approach.

## When to Rewrite vs Refactor

### Rewrite When (≥60% threshold)

| Signal | Threshold | Why |
|--------|-----------|-----|
| Components need changes | ≥60% | Refactoring more than half = rewrite |
| Custom implementations | ≥5 where libraries exist | Libraries are better in every way |
| Accessibility violations | ≥30% of components | Systemic problem, not isolated |
| No design system | 0 tokens | Foundational work needed |
| Framework end-of-life | Yes | No future in old framework |
| Component files > 500 lines | ≥30% | Architectural problem |
| Test coverage | < 20% | Can't safely refactor what you can't verify |

### Refactor When (<60% threshold)

| Signal | Threshold | Why |
|--------|-----------|-----|
| Components need changes | < 60% | Most code is salvageable |
| Architecture sound | Yes | Implementation poor, structure OK |
| Business logic correct | Yes | Must preserve exactly |
| Test coverage | > 60% | Can verify changes incrementally |
| Team has time | Yes | Gradual improvement possible |

## Rewrite Execution Strategy

### Strategy 1: Full Replacement (Recommended for Overhaul)

Wipe everything. Rebuild from scratch with the new stack.

**When:** User explicitly asked for overhaul, analysis shows ≥60% needs change.
**Risk:** High — all old code is deleted, new code must replicate behavior.
**Mitigation:** Characterization tests first, UI map as specification.

**Steps:**
1. Analyze existing code (Stage 1)
2. Produce UI map (Stage 2)
3. Write characterization tests for critical paths
4. Design new architecture (Stage 4)
5. Install libraries
6. Create design tokens
7. Build component library (ui/ directory)
8. Build feature components
9. Build pages/routes
10. Verify accessibility
11. Verify performance
12. Delete old code
13. Run characterization tests

### Strategy 2: Strangler Fig (For Risk-Averse Rewrites)

Gradually replace old components with new ones. Keep both running in parallel.

**When:** Business-critical app, can't afford downtime, team needs time to learn.
**Risk:** Medium — old and new code coexist temporarily.
**Mitigation:** Feature flags, per-component migration.

**Steps:**
1. Analyze existing code
2. Identify leaf components (no children) — replace first
3. Replace one component at a time
4. Use adapter layers to connect old and new
5. Move up the component tree
6. Remove old code when all traffic is on new

### Strategy 3: Layer-by-Layer (For Mixed Quality)

Replace styling layer first, then behavior, then architecture.

**When:** Some layers are good (behavior) but styling is bad, or vice versa.
**Risk:** Low — one layer at a time.
**Mitigation:** Keep behavior layer if it works; only replace what's broken.

**Steps:**
1. Analyze which layers need replacement
2. Replace CSS/styling first (Tailwind migration)
3. Replace component library (Radix UI adoption)
4. Replace architecture if needed
5. Verify at each layer

## Characterization Tests

Before rewriting, write tests that document CURRENT behavior:

### What to Test

| Area | What | How |
|------|------|-----|
| User flows | Login, signup, core workflows | Playwright/Cypress E2E |
| API contracts | What the frontend expects from APIs | MSW (Mock Service Worker) |
| Data display | How data is rendered | Snapshot tests |
| Interactions | Click, type, submit behavior | Component tests |
| Routing | URL → page mapping | Navigation tests |

### Characterization Test Template

```tsx
// tests/characterization/login-flow.test.tsx
test('user can log in with valid credentials', async () => {
  render(<App />);
  fireEvent.click(screen.getByText('Login'));
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'user@test.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
  await waitFor(() => {
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

**Rule:** These tests document CURRENT behavior, not desired behavior. They ensure
the rewrite preserves what users expect.

## Rewrite Checklist

### Before Starting

- [ ] UI map produced (all pages, components, data flows documented)
- [ ] Characterization tests written for critical paths
- [ ] New architecture designed (stack, tokens, component tree)
- [ ] Libraries selected and justified
- [ ] Design tokens file created

### During Rewrite

- [ ] Build component library first (ui/ directory)
- [ ] Use shadcn/ui components where available (copy, don't install)
- [ ] Apply design tokens consistently (no hardcoded values)
- [ ] Every component: semantic HTML + ARIA + Tailwind + tokens
- [ ] Every interactive element: keyboard accessible + focus visible
- [ ] Every async operation: loading state + error state
- [ ] Every list/table: empty state
- [ ] Dark mode support via CSS custom properties
- [ ] Responsive: works at 320px+, no fixed pixel widths
- [ ] < 200 lines per component, < 7 props

### After Rewrite

- [ ] Old code deleted (no dual maintenance)
- [ ] Characterization tests pass against new code
- [ ] Accessibility audit: 0 axe-core violations
- [ ] Performance comparison: bundle size reduced
- [ ] Code quality comparison: avg component size reduced
- [ ] Visual verification: all pages render correctly
- [ ] Keyboard navigation: full app navigable without mouse
- [ ] Dark mode: all components support dark mode

## Validation: Before vs After

### Metrics to Compare

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Component count | [N] | [N] | Reduced |
| Avg component size | [N] lines | [N] lines | < 200 |
| Max component size | [N] lines | [N] lines | < 300 |
| Components > 500 lines | [N] | 0 | 0 |
| Accessibility violations | [N] | 0 | 0 |
| Inline styles | [N] | 0 | 0 |
| Hardcoded colors | [N] | 0 | 0 |
| !important usage | [N] | 0 | 0 |
| Custom implementations | [N] | [N] | Reduced by >80% |
| Bundle size | [N] KB | [N] KB | Reduced |
| Lines of code | [N] | [N] | Reduced |

### Quality Checklist

| Criterion | Check |
|-----------|-------|
| Accessibility | axe-core 0 violations, keyboard navigable, screen reader tested |
| Performance | Bundle reduced, no unnecessary re-renders, code split |
| Consistency | All tokens used, no hardcoded values, consistent API patterns |
| Responsiveness | Works at 320px, no horizontal scroll, mobile-friendly |
| Dark mode | All components support dark mode via tokens |
| States | Loading, error, empty states present everywhere |
| TypeScript | Strict mode, no `any`, full type inference |
| Maintainability | < 200 lines per component, < 7 props, composition pattern |

## Common Rewrite Pitfalls

1. **Rewriting without understanding** — Analyze first, rewrite second.
2. **Preserving bugs** — Characterization tests capture current behavior; some bugs
   should NOT be preserved.
3. **Over-engineering** — Don't add abstractions the old code didn't need.
4. **Ignoring data layer** — The UI rewrite doesn't change the API; ensure contracts match.
5. **Skipping accessibility** — The whole point of the rewrite is better accessibility.
6. **Deleting without verification** — Run tests before and after deletion.
7. **Feature creep during rewrite** — Rewrite what exists, don't add new features.
8. **Library bloat** — Only add libraries that eliminate code you'd write anyway.
