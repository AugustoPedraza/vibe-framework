# UX Governor Validation Rules

> Detailed validation rules for `/vibe lint`

## Design Token Rules

### DT001: No Raw Tailwind Colors

**Severity:** Error

**Invalid Patterns:**
```
bg-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d{2,3}
text-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d{2,3}
border-(red|blue|green|yellow|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\d{2,3}
```

**Valid Tokens:**
```
bg-primary, bg-primary-hover, bg-primary-active
bg-secondary, bg-secondary-hover
bg-success, bg-success-soft
bg-warning, bg-warning-soft
bg-error, bg-error-soft
bg-info, bg-info-soft
bg-background, bg-surface, bg-surface-raised, bg-surface-sunken
text-text, text-text-secondary, text-text-muted, text-text-disabled
text-on-primary, text-on-secondary, text-on-success, text-on-warning, text-on-error
border-border, border-border-strong, border-border-focus
```

**Common Mappings:**
| Invalid | Valid |
|---------|-------|
| `bg-blue-500` | `bg-primary` |
| `bg-blue-600` | `bg-primary-hover` |
| `bg-red-500` | `bg-error` |
| `bg-green-500` | `bg-success` |
| `bg-yellow-500` | `bg-warning` |
| `bg-gray-100` | `bg-surface-sunken` |
| `bg-gray-200` | `bg-surface` |
| `bg-gray-800` | `bg-surface-raised` |
| `bg-white` | `bg-background` |
| `text-gray-500` | `text-text-muted` |
| `text-gray-700` | `text-text-secondary` |
| `text-gray-900` | `text-text` |
| `text-white` | `text-on-primary` |
| `border-gray-200` | `border-border` |
| `border-gray-400` | `border-border-strong` |

---

### DT002: No Arbitrary Values

**Severity:** Error

**Invalid Patterns:**
```
\[([\d.]+)(px|rem|em|%|vh|vw)\]
```

**Examples:**
```svelte
<!-- INVALID -->
<div class="w-[300px] h-[50vh] p-[15px]">
<div class="text-[14px] leading-[1.6]">

<!-- VALID -->
<div class="w-full max-w-sm p-4">
<div class="text-sm leading-normal">
```

---

### DT003: Standard Spacing Only

**Severity:** Error

**Valid Spacing Values:**
`0`, `px`, `0.5`, `1`, `2`, `3`, `4`, `6`, `8`, `12`, `16`, `20`, `24`

**Invalid Examples:**
```
p-5, p-7, p-9, p-10, p-11, p-14, p-15, p-18
m-5, m-7, m-9, m-10, m-11, m-14, m-15, m-18
gap-5, gap-7, gap-9, gap-10, gap-11
space-x-5, space-y-7
```

**Mapping:**
| Invalid | Valid Alternative |
|---------|-------------------|
| `p-5` | `p-4` or `p-6` |
| `p-7` | `p-6` or `p-8` |
| `p-9` | `p-8` or `p-12` |
| `p-10` | `p-8` or `p-12` |

---

### DT004: Named Z-Index Only

**Severity:** Error

**Invalid Patterns:**
```
z-\d+
```

**Valid Tokens:**
| Token | Purpose |
|-------|---------|
| `z-below` | Below base content |
| `z-base` | Base content |
| `z-raised` | Raised elements |
| `z-dropdown` | Dropdown menus |
| `z-sticky` | Sticky elements |
| `z-overlay` | Overlays |
| `z-modal` | Modals |
| `z-popover` | Popovers |
| `z-toast` | Toast notifications |
| `z-tooltip` | Tooltips |

---

### DT005: Standard Border Radius

**Severity:** Error

**Valid Radius:**
`rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`

**Invalid:**
`rounded-xl`, `rounded-2xl`, `rounded-3xl`

---

## Component Rules

### CP001: Component Exists

**Severity:** Error

**Check:** Component type must exist in `components.json`

**Available Components:**
- Form: Button, Input, Select, Textarea, Checkbox, FormField, Toggle
- Layout: Page, PageHeader, Card, Section
- Display: Avatar, Badge, Skeleton, Icon
- Interactive: Modal, Tabs, Dropdown, Sheet
- Data: DataTable, AnimatedList, InfiniteScroll, Pagination, EmptyState
- Realtime: RealtimeList, TypingIndicator
- Auth: AuthForm, OAuthButton
- Navigation: CommandPalette, Breadcrumbs, Sidebar
- Notification: NotificationCenter, ActivityFeed

---

### CP002: Props Valid

**Severity:** Error

**Check:** Props must match component API from `components.json`

**Example Validation:**
```svelte
<!-- Button API -->
variant: "primary" | "secondary" | "ghost" | "danger"
size: "sm" | "md" | "lg"
loading: boolean
disabled: boolean
type: "button" | "submit" | "reset"

<!-- VALID -->
<Button variant="primary" size="md" loading={true}>

<!-- INVALID -->
<Button variant="blue" size="extra-large">
```

---

### CP005: No Class Prop Override

**Severity:** Warning

**Check:** Components should use variant/size props, not class overrides

**Reason:** Components are designed with specific variants. Class overrides break consistency.

```svelte
<!-- BAD -->
<Button class="bg-red-500 hover:bg-red-600">Delete</Button>

<!-- GOOD -->
<Button variant="danger">Delete</Button>
```

---

## UI State Rules

### US001: Loading State Present

**Severity:** Error

**Check:** Components with async operations must handle loading state

**Detection:**
- Find `await`, `pushEventAsync`, `fetch` calls
- Verify corresponding `{#if loading}` block exists
- Check for Skeleton or loading indicator

**Required Pattern:**
```svelte
<script>
  let loading = false;

  async function handleAction() {
    loading = true;
    try {
      await doAsync();
    } finally {
      loading = false;
    }
  }
</script>

{#if loading}
  <Skeleton variant="card" />
{:else}
  <!-- content -->
{/if}
```

---

### US002: Error State Present

**Severity:** Error

**Check:** Components with async operations must handle error state

**Required Pattern:**
```svelte
<script>
  let error: string | null = null;

  async function handleAction() {
    error = null;
    try {
      await doAsync();
    } catch (e) {
      error = 'Something went wrong';
    }
  }
</script>

{#if error}
  <Alert variant="error">{error}</Alert>
{/if}
```

---

### US003: Empty State for Data

**Severity:** Error

**Check:** Lists and data components must handle empty state

**Applies to:**
- `AnimatedList`
- `DataTable`
- `InfiniteScroll`
- Any `{#each}` over data

**Required Pattern:**
```svelte
{#if items.length === 0}
  <EmptyState
    preset="default"
    title="No items yet"
    description="Create your first item"
  />
{:else}
  {#each items as item}
    <ItemCard {item} />
  {/each}
{/if}
```

---

## Accessibility Rules

### A11Y001: Icon Buttons Have Labels

**Severity:** Error

**Check:** Buttons containing only icons must have aria-label

**Detection:**
```svelte
<!-- Icon-only button (needs label) -->
<Button on:click={close}>
  <Icon name="hero-x-mark" />
</Button>

<!-- Has text (no label needed) -->
<Button on:click={close}>
  <Icon name="hero-x-mark" />
  Close
</Button>
```

**Fix:**
```svelte
<Button on:click={close} aria-label="Close dialog">
  <Icon name="hero-x-mark" />
</Button>
```

---

### A11Y002: Form Inputs Have Labels

**Severity:** Error

**Check:** Input, Select, Textarea must have associated label

**Valid Patterns:**
```svelte
<!-- Using FormField wrapper -->
<FormField label="Email">
  <Input type="email" />
</FormField>

<!-- Using aria-label -->
<Input type="email" aria-label="Email address" />

<!-- Using explicit label -->
<label for="email">Email</label>
<Input id="email" type="email" />
```

---

### A11Y003: Touch Targets 44px

**Severity:** Warning

**Check:** Interactive elements should be at least 44x44px

**Components to check:**
- Button (check size prop)
- Checkbox
- Toggle
- Clickable icons

**Safe values:**
- `size="md"` or `size="lg"` on Button
- Default sizes on Checkbox, Toggle

---

### A11Y004: Focus Visible

**Severity:** Error

**Check:** No `outline-none` without `focus-visible` alternative

```svelte
<!-- BAD -->
<button class="outline-none">

<!-- GOOD -->
<button class="outline-none focus-visible:ring-2 focus-visible:ring-border-focus">

<!-- BEST (use component) -->
<Button>  <!-- Components handle focus correctly -->
```

---

## Motion Rules

### MT001: Uses Motion Tokens

**Severity:** Warning

**Check:** Animations use defined motion system

**Valid Classes:**
- `transition-colors`
- `transition-transform`
- `transition-opacity`
- `duration-150`, `duration-200`, `duration-300`
- `ease-out`, `ease-in-out`

**Invalid:**
- Custom keyframe animations without reduced-motion check
- Arbitrary durations: `duration-[400ms]`

---

### MT002: Respects Reduced Motion

**Severity:** Warning

**Check:** Animations respect `prefers-reduced-motion`

**Required Pattern:**
```svelte
<div class="motion-safe:animate-fade-in motion-reduce:opacity-100">
```

Or in JavaScript:
```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
```

---

## Feature Spec Rules

### FS001: ui_spec Present

**Severity:** Warning

**Check:** Feature spec has ui_spec YAML block

**Required for:** `/vibe generate` to work

---

### FS002: All States Defined

**Severity:** Warning

**Check:** ui_spec.states has all 4 states

```yaml
states:
  loading:    # Required
  error:      # Required
  empty:      # Required (can be applicable: false)
  success:    # Required
```

---

### FS003: Wireframe Present

**Severity:** Warning

**Check:** Feature spec has wireframe section

---

### FS004: Scenario Format

**Severity:** Warning

**Check:** Acceptance scenarios use Given/When/Then

```markdown
#### Scenario: Name
- **Given** precondition
- **When** action
- **Then** outcome
```

---

### FS005: Copy From UX_COPY

**Severity:** Warning

**Check:** User-facing text follows UX_COPY.md patterns

**Bad patterns:**
- "must be at least X"
- "Please enter a valid"
- "Invalid input"
- "Field is required"

**Good patterns:**
- "Enter your full name"
- "Check your email address"
- "Use 6 or more characters"
- "Required"
