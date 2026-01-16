# Lint Command (UX Governor)

> `/vibe lint [path]` - Validate UX consistency and design token compliance

## Purpose

Automated enforcement of UX patterns and design system compliance:
- Validate design token usage (no raw Tailwind)
- Check component prop compliance
- Verify all UI states are handled
- Ensure accessibility requirements
- Validate feature spec completeness

**Output:** Validation report with errors, warnings, and suggestions

---

## Workflow

```
Scan Files -> Apply Rules -> Report Issues -> Suggest Fixes
```

---

## Scan Scope

### Default (no path)
Scan all relevant files:
- `assets/svelte/components/features/**/*.svelte`
- `lib/syna_web/components/**/*.ex`
- `docs/domain/features/**/*.md`

### With Path
Scan specific file or directory:
```bash
/vibe lint assets/svelte/components/features/auth/
/vibe lint docs/domain/features/auth/AUTH-001.md
```

---

## Validation Rules

### Category: Design Tokens (Severity: Error)

| Rule ID | Description | Pattern | Fix |
|---------|-------------|---------|-----|
| `DT001` | No raw Tailwind colors | `bg-blue-500`, `text-gray-400` | Use `bg-primary`, `text-text-muted` |
| `DT002` | No arbitrary values | `w-[300px]`, `p-[15px]` | Use standard spacing |
| `DT003` | No non-standard spacing | `p-5`, `m-7`, `gap-9` | Use `p-4` or `p-6` |
| `DT004` | No raw z-index | `z-10`, `z-50` | Use `z-modal`, `z-dropdown` |
| `DT005` | No non-standard radius | `rounded-xl`, `rounded-2xl` | Use `rounded-lg` or `rounded-full` |

**Token Reference (from CLAUDE.md):**

Colors:
- `primary`, `primary-hover`, `on-primary`
- `secondary`, `secondary-hover`, `on-secondary`
- `success`, `warning`, `error`, `info` (and `-soft` variants)
- `background`, `surface`, `surface-raised`, `surface-sunken`
- `text`, `text-secondary`, `text-muted`, `text-disabled`
- `border`, `border-strong`, `border-focus`

Spacing:
- `0`, `px`, `0.5`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `20`, `24`

Radius:
- `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`

Z-Index:
- `z-below`, `z-base`, `z-raised`, `z-dropdown`, `z-sticky`
- `z-overlay`, `z-modal`, `z-popover`, `z-toast`, `z-tooltip`

### Category: Component Props (Severity: Error)

| Rule ID | Description | Check |
|---------|-------------|-------|
| `CP001` | Component exists | Type matches `components.json` |
| `CP002` | Props valid | Props match component API |
| `CP003` | Variant valid | Variant value in allowed list |
| `CP004` | Size valid | Size value in allowed list |
| `CP005` | No class prop | Components use variant/size, not class |

### Category: UI States (Severity: Error)

| Rule ID | Description | Check |
|---------|-------------|-------|
| `US001` | Loading state present | Has loading/skeleton handling |
| `US002` | Error state present | Has error handling UI |
| `US003` | Empty state for data | Lists/tables have empty state |
| `US004` | Success feedback | Actions have success indication |

### Category: Accessibility (Severity: Error)

| Rule ID | Description | Check |
|---------|-------------|-------|
| `A11Y001` | Icon buttons have aria-label | `<Button>` with only icon |
| `A11Y002` | Form inputs have labels | Input/Select has associated label |
| `A11Y003` | Touch targets 44px | Interactive elements sized correctly |
| `A11Y004` | Focus visible | No `outline-none` without alternative |
| `A11Y005` | Color not sole indicator | Status has icon/text, not just color |

### Category: Motion (Severity: Warning)

| Rule ID | Description | Check |
|---------|-------------|-------|
| `MT001` | Uses motion tokens | Uses defined animation classes |
| `MT002` | Respects reduced motion | Has `motion-reduce` consideration |
| `MT003` | No raw transitions | Uses motion system, not custom |

### Category: Feature Spec (Severity: Warning)

| Rule ID | Description | Check |
|---------|-------------|-------|
| `FS001` | ui_spec present | Feature spec has ui_spec block |
| `FS002` | All states defined | ui_spec.states has all 4 states |
| `FS003` | Wireframe present | Feature spec has wireframe |
| `FS004` | Scenarios have format | Given/When/Then structure |
| `FS005` | Copy from UX_COPY | User-facing text matches patterns |

---

## Output Format

```
+======================================================================+
|  UX GOVERNOR REPORT                                                   |
|  Scanned: [N] files                                                   |
+======================================================================+

ERRORS (must fix):

  DT001 | assets/svelte/components/features/auth/LoginForm.svelte:45
        | Raw Tailwind color: bg-blue-500
        | Fix: Use bg-primary instead

  A11Y001 | assets/svelte/components/features/auth/LoginForm.svelte:67
          | Icon button missing aria-label
          | Fix: Add aria-label="Close" to Button

  US001 | assets/svelte/components/features/chat/MessageList.svelte:23
        | Missing loading state
        | Fix: Add {#if loading} block with Skeleton

WARNINGS (should fix):

  MT002 | assets/svelte/components/features/auth/LoginForm.svelte:89
        | Animation doesn't respect reduced motion
        | Fix: Wrap in prefers-reduced-motion check

  FS003 | docs/domain/features/auth/AUTH-002.md
        | Missing wireframe section
        | Fix: Add ASCII wireframe to spec

+---------------------------------------------------------------------+
|  SUMMARY                                                             |
|                                                                      |
|  Errors:   [N] (blocking)                                            |
|  Warnings: [N] (recommended)                                         |
|  Passed:   [N] rules                                                 |
|                                                                      |
|  Status: [FAIL / PASS with warnings / PASS]                          |
+---------------------------------------------------------------------+
```

---

## Rule Implementations

### DT001: Raw Tailwind Colors

**Detect:**
```regex
class="[^"]*\b(bg|text|border|ring|from|to|via)-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d{1,3}\b
```

**Examples:**
```svelte
<!-- BAD -->
<div class="bg-blue-500 text-white">

<!-- GOOD -->
<div class="bg-primary text-on-primary">
```

### US001: Loading State

**Detect in Svelte:**
- Look for async operations (await, pushEventAsync)
- Check for corresponding loading state handling
- Verify Skeleton or loading indicator present

**Pattern:**
```svelte
<!-- REQUIRED if async exists -->
{#if loading}
  <Skeleton variant="..." />
{:else}
  <!-- content -->
{/if}
```

### A11Y001: Icon Button Labels

**Detect:**
```svelte
<!-- BAD: Icon-only button without label -->
<Button variant="ghost" on:click={close}>
  <Icon name="hero-x-mark" />
</Button>

<!-- GOOD: Has aria-label -->
<Button variant="ghost" on:click={close} aria-label="Close dialog">
  <Icon name="hero-x-mark" />
</Button>
```

### CP005: No Class Prop

**Detect:**
```svelte
<!-- BAD: Using class to override -->
<Button class="mt-4 bg-red-500">

<!-- GOOD: Using variant prop -->
<Button variant="danger">
```

---

## Integration

### With `just check`

Add to project's `justfile`:

```just
lint-ux:
    @echo "Running UX Governor..."
    # Invoked by /vibe lint

check: compile format-check lint-ux test
```

### With CI/CD

Add to GitHub Actions:

```yaml
- name: UX Lint
  run: |
    # Run UX governor validation
    # (Implemented via Claude Code in development)
    echo "UX validation in development mode"
```

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Check for obvious token violations
if grep -r "bg-blue-\|bg-red-\|bg-green-\|text-gray-" assets/svelte/; then
  echo "ERROR: Raw Tailwind colors detected. Run /vibe lint for details."
  exit 1
fi
```

---

## Fix Mode

### `--fix`

Automatically fix simple issues:

```bash
/vibe lint --fix
```

**Auto-fixable:**
- `DT001`: Replace common color patterns
- `DT003`: Replace non-standard spacing
- `DT004`: Replace raw z-index

**Not auto-fixable (require manual review):**
- `US001-004`: State handling requires context
- `A11Y001`: Label text needs human judgment
- `FS001-005`: Spec content requires domain knowledge

### Fix Report

```
+---------------------------------------------------------------------+
|  AUTO-FIX RESULTS                                                    |
|                                                                      |
|  Fixed:                                                              |
|    [x] DT001 in LoginForm.svelte:45 (bg-blue-500 -> bg-primary)      |
|    [x] DT003 in Card.svelte:12 (p-5 -> p-4)                          |
|                                                                      |
|  Remaining (manual fix required):                                    |
|    [ ] A11Y001 in LoginForm.svelte:67                                |
|    [ ] US001 in MessageList.svelte:23                                |
+---------------------------------------------------------------------+
```

---

## Options

### `--severity [level]`

Filter by severity:

```bash
/vibe lint --severity error    # Only errors
/vibe lint --severity warning  # Errors + warnings
```

### `--rule [rule-id]`

Check specific rule:

```bash
/vibe lint --rule DT001
/vibe lint --rule A11Y001
```

### `--category [category]`

Check specific category:

```bash
/vibe lint --category tokens
/vibe lint --category accessibility
/vibe lint --category states
```

### `--json`

Output as JSON for tooling:

```bash
/vibe lint --json > lint-report.json
```

---

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Pass (no errors) |
| 1 | Errors found |
| 2 | Invalid path/config |

---

## Anti-Patterns

- Never ignore errors (they indicate real problems)
- Never auto-fix accessibility issues (requires judgment)
- Never skip state validation for data components
- Never allow raw Tailwind in production code
- Never suppress warnings without understanding why
