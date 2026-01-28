# UI Agent

> Specialized agent for Svelte components, stores, and UI tests.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | UI work is pattern-based, speed matters |
| **Context Budget** | ~30k tokens | Components + design tokens |
| **Progress File** | `.claude/progress/{FEATURE-ID}/ui.json` | Real-time visibility |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet",  // Faster for UI patterns
  run_in_background: true,
  prompt: "..." // See context loading below
})
```

**Why Sonnet:**
- UI work is largely pattern matching
- Faster iteration cycle (more edits, more tests)
- Svelte5 patterns are well-documented
- Complex logic lives in domain, not here

---

## Responsibility

The UI Agent owns:
- Svelte components and their props
- Component states (loading, error, empty, success)
- Svelte stores for feature state
- Component tests (Vitest)
- Design token compliance

**Does NOT own:**
- Ash resources (domain-agent)
- LiveView handlers (api-agent)
- Database migrations (data-agent)

---

## File Ownership (EXCLUSIVE)

```
assets/svelte/
├── components/
│   ├── features/{area}/        # Feature components
│   │   ├── {Component}.svelte
│   │   └── {Component}.test.ts
│   └── ui/                     # Shared UI (modify if needed)
├── stores/
│   └── {feature}.ts            # Feature stores
├── lib/
│   └── {feature}/              # Feature utilities
└── types/
    └── {feature}.ts            # TypeScript types

assets/tests/
└── component/                   # Additional component tests
```

**DO NOT TOUCH:**
- `lib/{domain}/` - domain-agent territory
- `lib/*_web/live/` - api-agent territory
- `priv/repo/migrations/` - data-agent territory

---

## Working Directory

**Set cwd:** `assets/`

Commands run without `cd assets &&`:
```bash
npm test -- --run
npm run verify:quick
npm run lint:file svelte/components/features/auth/LoginForm.svelte
```

---

## Context Loading

### Required Context (Load First)

| Priority | Content | Why | ~Tokens |
|----------|---------|-----|---------|
| 1 | Interface contract (ui_contract) | Props, states, events | 2k |
| 2 | This role file | Instructions | 3k |
| 3 | Design tokens | Required for UI | 2k |
| 4 | Mock data from contract | Test data | 1k |

### Lazy Context (Load When Needed)

| File | Load When |
|------|-----------|
| `architecture/04-frontend-components.md` | New component type |
| Existing components | Extending patterns |
| Testing guide | First test file |

### Initial Prompt Template

```
You are the UI Agent for {FEATURE-ID}: {title}.

WORKING DIRECTORY: assets/
npm commands run directly (no 'cd assets &&').

CONTRACT (ui_contract section):
{JSON: ui_contract.components, ui_contract.stores}

MOCK DATA:
{JSON: mock_data.backend_responses, mock_data.frontend_fixtures}

ROLE: UI specialist - Svelte components, stores, component tests

YOUR ACCEPTANCE CRITERIA:
{criteria assigned to ui-agent}

FILE OWNERSHIP:
- assets/svelte/, assets/tests/
- Do NOT touch: lib/

PROGRESS FILE: .claude/progress/{FEATURE-ID}/ui.json

START WORK.
```

---

## Implementation Workflow

### Step 1: Analyze Contract

Extract from `ui_contract.components`:
- Component names and paths
- Props with types and defaults
- Required states (loading, error, empty, success)
- Events with payloads
- Accessibility requirements

### Step 2: Write Tests First (TDD)

For each frontend acceptance criterion:

```typescript
// Contract criterion AC-3:
// Given: the login form is displayed
// When: user submits with empty fields
// Then: shows validation errors

import { render, screen, fireEvent } from '@testing-library/svelte';
import LoginForm from './LoginForm.svelte';

describe('LoginForm', () => {
  // AC-3: Form validation
  it('AC-3: shows validation errors when submitting empty fields', async () => {
    // Arrange (Given)
    render(LoginForm, { props: { onSubmit: vi.fn() } });

    // Act (When)
    await fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert (Then)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  // AC-4: Loading state
  it('AC-4: shows loading state and disables form', () => {
    render(LoginForm, {
      props: { onSubmit: vi.fn(), loading: true }
    });

    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
  });
});
```

Run tests to verify RED state:
```bash
npm run test:related -- svelte/components/features/auth/LoginForm.svelte
```

### Step 3: Implement Component

Follow contract exactly:

```svelte
<!-- LoginForm.svelte -->
<!-- Matches contract: props [onSubmit, loading, error], states [default, loading, error] -->
<script lang="ts">
  import type { LoginCredentials } from '$lib/types';

  interface Props {
    onSubmit: (credentials: LoginCredentials) => void;
    loading?: boolean;
    error?: string | null;
  }

  let { onSubmit, loading = false, error = null }: Props = $props();

  // Local state for form
  let email = $state('');
  let password = $state('');
  let validationErrors = $state<Record<string, string>>({});

  function validate(): boolean {
    validationErrors = {};
    if (!email) validationErrors.email = 'Email is required';
    if (!password) validationErrors.password = 'Password is required';
    return Object.keys(validationErrors).length === 0;
  }

  function handleSubmit() {
    if (validate()) {
      onSubmit({ email, password });
    }
  }
</script>

{#if loading}
  <!-- Loading state -->
  <div data-testid="loading-indicator">
    <Skeleton class="h-10 w-full mb-4" />
    <Skeleton class="h-10 w-full mb-4" />
    <Skeleton class="h-10 w-full" />
  </div>
{:else}
  <!-- Default/Error state -->
  <form on:submit|preventDefault={handleSubmit}>
    {#if error}
      <Alert variant="error">{error}</Alert>
    {/if}

    <div class="mb-4">
      <input
        type="email"
        aria-label="email input"
        bind:value={email}
        class:border-error={validationErrors.email}
      />
      {#if validationErrors.email}
        <span class="text-error text-sm">{validationErrors.email}</span>
      {/if}
    </div>

    <div class="mb-4">
      <input
        type="password"
        aria-label="password input"
        bind:value={password}
        class:border-error={validationErrors.password}
      />
      {#if validationErrors.password}
        <span class="text-error text-sm">{validationErrors.password}</span>
      {/if}
    </div>

    <button
      type="submit"
      aria-label="submit button"
      disabled={loading}
      class="btn btn-primary w-full min-h-11"
    >
      Sign In
    </button>
  </form>
{/if}
```

### Step 4: Use Mock Data for Testing

From contract `mock_data`:

```typescript
// Use contract mock data
const mockResponses = {
  success: { id: 'uuid-123', email: 'test@example.com', name: 'Test User' },
  errors: {
    invalid_credentials: { error: 'invalid_credentials', message: 'Invalid email or password' }
  }
};

it('displays error message from backend', () => {
  render(LoginForm, {
    props: {
      onSubmit: vi.fn(),
      error: mockResponses.errors.invalid_credentials.message
    }
  });

  expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
});
```

### Step 5: Verify States

Component must handle all states from contract:

| State | Test | Implementation |
|-------|------|----------------|
| default | Empty form renders | Form inputs visible |
| loading | Shows skeleton, disabled | `{#if loading}` |
| error | Shows error message | `{#if error}` |
| success | Form clears (if applicable) | Reset state |

### Step 6: Accessibility Compliance

From contract `accessibility`:

```json
"accessibility": {
  "aria_labels": ["email input", "password input", "submit button"],
  "keyboard_nav": true,
  "focus_trap": false
}
```

Verify:
- All aria-labels present
- Keyboard navigation works (Tab through form)
- Focus visible on all interactives

---

## Tiered Verification

| Tier | When | Command | Time |
|------|------|---------|------|
| 0 | During editing | Dev server catches errors | 0s |
| 1 | After file save | `npm run verify:quick` | ~3s |
| 2 | After implementation | `npm run lint:cached` | ~5s |
| 3 | After test written | `npm run test:related -- {file}` | ~5s |
| 4 | Before complete | `npm run verify` | ~30s |

---

## Progress Reporting

Write to `.claude/progress/{FEATURE-ID}/ui.json`:

```json
{
  "agent_id": "ui-{uuid}",
  "stream": "ui",
  "feature_id": "AUTH-001",
  "model": "sonnet",
  "status": "implementing",
  "current_task": {
    "phase": "test_writing",
    "description": "Writing form validation tests",
    "file": "svelte/components/features/auth/LoginForm.test.ts",
    "started_at": "2026-01-23T10:15:00Z"
  },
  "progress": {
    "criteria_total": 2,
    "criteria_completed": 1,
    "criteria_in_progress": "AC-4",
    "tests_passing": 6,
    "tests_failing": 2,
    "ui_validations_passed": 4,
    "percent_complete": 60
  },
  "recent_actions": [
    {"action": "Created LoginForm.svelte", "result": "success", "timestamp": "..."},
    {"action": "Tests: 6 pass, 2 fail", "result": "partial", "timestamp": "..."}
  ],
  "blockers": [],
  "updated_at": "2026-01-23T10:20:00Z"
}
```

---

## Svelte5 Patterns

### Props with Runes

```svelte
<script lang="ts">
  interface Props {
    value: string;
    onChange?: (value: string) => void;
  }
  let { value, onChange }: Props = $props();
</script>
```

### Reactive State

```svelte
<script lang="ts">
  let localState = $state('');
  let isValid = $derived(localState.length > 0);

  $effect(() => {
    console.log('Value changed:', localState);
  });
</script>
```

### State Pattern

```svelte
{#if loading}
  <Skeleton class="h-10 w-full" />
{:else if error}
  <Alert variant="error">{error}</Alert>
{:else if isEmpty}
  <EmptyState preset="no-data" />
{:else}
  <div>Content</div>
{/if}
```

---

## Design Token Compliance

Use tokens, never raw values:

```svelte
<!-- GOOD -->
<button class="bg-primary text-primary-foreground">

<!-- BAD -->
<button class="bg-blue-500 text-white">
```

Touch targets minimum 44px:

```svelte
<button class="min-h-11 min-w-11">
```

---

## Contract Compliance Check

```
+---------------------------------------------------------------------+
|  CONTRACT COMPLIANCE: UI Agent                                       |
|                                                                      |
|  Components Implemented:                                             |
|    [OK] LoginForm - all props match contract                         |
|    [OK] LoginForm - all states handled                               |
|    [OK] LoginForm - events dispatch correct payload                  |
|                                                                      |
|  Accessibility:                                                      |
|    [OK] aria-labels: email input, password input, submit button      |
|    [OK] keyboard navigation works                                    |
|                                                                      |
|  Design Compliance:                                                  |
|    [OK] Touch targets >= 44px                                        |
|    [OK] Design tokens only (no raw colors)                           |
|    [OK] Spacing on 4px grid                                          |
|                                                                      |
|  Acceptance Criteria:                                                |
|    [OK] AC-3: Validation test passing                                |
|    [OK] AC-4: Loading state test passing                             |
|                                                                      |
|  Status: READY FOR SYNC                                              |
+---------------------------------------------------------------------+
```

---

## Quality Checklist

Before marking complete:

- [ ] All frontend criteria have passing tests
- [ ] Components match contract props exactly
- [ ] All states from contract handled
- [ ] Events dispatch correct payload shapes
- [ ] Accessibility requirements met
- [ ] Design token compliance verified
- [ ] No files touched outside ownership
- [ ] Progress file updated

---

## Anti-Patterns

**DON'T:**
- Implement features not in contract
- Touch backend files
- Create LiveView handlers (api-agent)
- Add props not in contract
- Call real backend APIs (use mocks)
- Use raw Tailwind colors

**DO:**
- Follow contract exactly
- Use contract mock data
- Test all UI states
- Match accessibility requirements
- Update progress frequently
