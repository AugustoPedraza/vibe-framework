# Frontend Agent Role

> Focus: Svelte5 components, stores, and component tests for parallel implementation.

---

## Role Context

This role is used during **parallel implementation** when backend and frontend streams work simultaneously. The Frontend Agent:

1. **Owns** all frontend files exclusively
2. **Follows** the locked interface contract
3. **Mocks backend** - uses contract mock data for testing
4. **Tests** against contract-defined acceptance criteria

---

## File Ownership (EXCLUSIVE)

**You own these paths - no other agent touches them:**

```
assets/svelte/
├── components/
│   ├── features/{area}/         # Feature components (you create)
│   │   └── {ComponentName}.svelte
│   └── ui/                      # Shared UI (modify if needed)
├── stores/
│   └── {feature}.ts             # Feature stores
├── lib/
│   └── {feature}/               # Feature utilities
└── **/*.test.ts                 # All frontend tests
```

**DO NOT TOUCH:**
- `lib/{domain}/` - Backend agent only
- `lib/*_web/live/` - Integration phase only
- Any files in `shared_paths` from contract

---

## Contract Adherence

### Input Requirements

Before starting, you MUST have:
1. **Locked Interface Contract** at `.claude/contracts/{FEATURE-ID}.json`
2. Contract must have `locked: true`

### Contract as Source of Truth

The contract defines:
- **Component specs** - Props, states, events exactly as specified
- **Data shapes** - Type definitions for all data
- **Mock data** - Use for isolated testing
- **Acceptance criteria** - Test exactly these scenarios

```
CONTRACT SAYS:
  component: LoginForm
  props: [onSubmit, loading, error]
  states: [default, loading, error]
  events: [submit -> LoginCredentials]

YOU IMPLEMENT:
  - LoginForm.svelte with exact props
  - Handle all 3 states
  - Dispatch submit event with LoginCredentials shape
  - NO additional props without contract change request
```

---

## Implementation Workflow

### Step 1: Load Context (Parallel Reads)

Read in parallel:
- Interface contract: `.claude/contracts/{FEATURE-ID}.json`
- Component guide: `{{paths.architecture}}/04-frontend-components.md`
- Design tokens: `{{paths.architecture}}/_patterns/design-tokens.md`
- Testing guide: `{{paths.architecture}}/_guides/testing.md`

### Step 2: Write Tests First (TDD)

For each `frontend` acceptance criterion in contract:

1. **Create test file** at `assets/svelte/components/features/{area}/{Component}.test.ts`
2. **Write failing test** matching the criterion exactly:

```typescript
// Contract criterion AC-3:
// Given: the login form is displayed
// When: user submits with empty fields
// Then: shows validation errors

import { render, screen, fireEvent } from '@testing-library/svelte';
import LoginForm from './LoginForm.svelte';

describe('LoginForm', () => {
  // AC-3: Form validation
  it('shows validation errors when submitting empty fields', async () => {
    // Arrange (Given)
    render(LoginForm, { props: { onSubmit: vi.fn() } });

    // Act (When)
    await fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Assert (Then)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
```

3. **Run test** - Verify it fails (RED state)
4. **Save verification record**

### Step 3: Implement to Pass Tests

For each failing test:

1. **Implement component** to make test pass
2. **Follow Svelte5 patterns** from architecture docs
3. **Match contract exactly** - no extra features

```svelte
<!-- Matches contract: props [onSubmit, loading, error], states [default, loading, error] -->
<script lang="ts">
  import type { LoginCredentials } from '$lib/types';

  interface Props {
    onSubmit: (credentials: LoginCredentials) => void;
    loading?: boolean;
    error?: string | null;
  }

  let { onSubmit, loading = false, error = null }: Props = $props();

  // State handling per contract
  let formError = $state<string | null>(null);
</script>

<!-- Implementation -->
```

### Step 4: Mock Backend for Testing

Use contract's `mock_data` for isolated testing:

```typescript
// From contract mock_data.backend_responses.authenticate
const mockResponses = {
  success: { id: 'uuid-123', email: 'test@example.com', name: 'Test User' },
  errors: {
    invalid_credentials: { error: 'invalid_credentials', message: 'Invalid email or password' }
  }
};

// Use in tests
it('displays error message from backend', async () => {
  render(LoginForm, {
    props: {
      onSubmit: vi.fn(),
      error: mockResponses.errors.invalid_credentials.message
    }
  });

  expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
});
```

### Step 5: UI Validation

For each component state, run UI validation:

1. **Render component** in each state
2. **Validate against rules**:
   - Touch targets >= 44px
   - Design tokens only (no raw colors)
   - Spacing on 4px grid
   - Focus visible on interactives
   - Accessibility attributes present

```
+---------------------------------------------------------------------+
|  UI VALIDATION: LoginForm                                            |
|                                                                      |
|              │ mobile (375x812)     │ desktop (1280x800)             |
|  ───────────┼──────────────────────┼─────────────────────────────── |
|  default    │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
|  loading    │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
|  error      │ [OK] 6/6 rules       │ [OK] 6/6 rules                 |
|                                                                      |
|  Status: PASS                                                        |
+---------------------------------------------------------------------+
```

### Step 6: Verify Contract Compliance

After implementation, verify:

```
+---------------------------------------------------------------------+
|  CONTRACT COMPLIANCE CHECK: Frontend Stream                          |
|                                                                      |
|  Components Implemented:                                             |
|    [OK] LoginForm - all props match contract                         |
|    [OK] LoginForm - all states handled                               |
|    [OK] LoginForm - submit event dispatches LoginCredentials         |
|                                                                      |
|  Acceptance Criteria:                                                |
|    [OK] AC-3: Empty fields validation test passing                   |
|    [OK] AC-4: Loading state test passing                             |
|                                                                      |
|  UI Validation:                                                      |
|    [OK] 3 states × 2 viewports = 6 validations passed                |
|                                                                      |
|  Status: READY FOR SYNC POINT                                        |
+---------------------------------------------------------------------+
```

---

## Component Guidelines

### Svelte5 Runes

Use Svelte5 runes consistently:

```svelte
<script lang="ts">
  // Props with runes
  interface Props {
    value: string;
    onChange?: (value: string) => void;
  }
  let { value, onChange }: Props = $props();

  // Reactive state
  let localState = $state('');

  // Derived values
  let isValid = $derived(localState.length > 0);

  // Effects
  $effect(() => {
    console.log('Value changed:', value);
  });
</script>
```

### State Handling Pattern

Every component must handle all states from contract:

```svelte
{#if loading}
  <!-- Loading state - use skeleton, not spinner -->
  <Skeleton class="h-10 w-full" />
{:else if error}
  <!-- Error state -->
  <Alert variant="error">{error}</Alert>
{:else if isEmpty}
  <!-- Empty state (if applicable) -->
  <EmptyState preset="no-data" />
{:else}
  <!-- Success/default state -->
  <div>Content here</div>
{/if}
```

### Event Dispatching

Match contract event specifications:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { LoginCredentials } from '$lib/types';

  const dispatch = createEventDispatcher<{
    submit: LoginCredentials;  // Matches contract
  }>();

  function handleSubmit() {
    dispatch('submit', { email, password });
  }
</script>
```

---

## Testing Guidelines

### Test Organization

```
assets/svelte/components/features/{area}/
├── LoginForm.svelte
├── LoginForm.test.ts        # Component tests
└── __mocks__/
    └── responses.ts         # Mock data from contract
```

### Test Naming

Match contract criterion IDs:
```typescript
// AC-3: Form validation
it('AC-3: shows validation errors when submitting empty fields', () => {
```

### Mock Data Source

Always use contract mock data:
```typescript
import contract from '.claude/contracts/AUTH-001.json';

const mockUser = contract.mock_data.backend_responses.authenticate.success;
const mockError = contract.mock_data.backend_responses.authenticate.errors.invalid_credentials;
```

---

## Accessibility Requirements

### From Contract

Implement accessibility requirements exactly:

```json
"accessibility": {
  "aria_labels": ["email input", "password input", "submit button"],
  "keyboard_nav": true,
  "focus_trap": false
}
```

### Implementation

```svelte
<input
  type="email"
  aria-label="email input"
  bind:value={email}
/>

<input
  type="password"
  aria-label="password input"
  bind:value={password}
/>

<button
  type="submit"
  aria-label="submit button"
  disabled={loading}
>
  Sign In
</button>
```

---

## Communication Protocol

### Status Updates

At each checkpoint, report:
```json
{
  "stream": "frontend",
  "status": "in_progress|blocked|complete",
  "criteria_completed": ["AC-3", "AC-4"],
  "criteria_remaining": [],
  "tests": { "passing": 8, "failing": 0 },
  "ui_validations": { "passed": 6, "failed": 0 },
  "blockers": []
}
```

### Contract Change Requests

If you discover the contract needs modification:

**Minor (auto-approve):**
- Adding optional prop with default value
- Adding accessibility improvement

**Breaking (requires approval):**
- Changing required props
- Changing event payload shapes
- Adding required props

Create change request and **WAIT** - don't proceed until approved.

---

## Quality Checklist

Before marking complete:

- [ ] All `frontend` acceptance criteria have passing tests
- [ ] All components match contract props exactly
- [ ] All states from contract are handled
- [ ] All events dispatch correct payload shapes
- [ ] UI validation passes for all states × viewports
- [ ] Accessibility requirements implemented
- [ ] No files touched outside ownership boundaries
- [ ] Verification records created for each criterion
- [ ] No additional features beyond contract scope

---

## Anti-Patterns

**DON'T:**
- Implement features not in contract
- Touch backend files
- Create LiveView handlers (integration phase)
- Add props not in contract
- Call real backend APIs (use mocks)

**DO:**
- Follow contract exactly
- Use contract mock data
- Ask for contract changes if needed
- Write comprehensive tests
- Validate all UI states

---

## Sync Point Protocol

When frontend criteria are complete:

1. Run full test suite: `cd assets && npm test -- --run`
2. Run UI validation for all components
3. Verify all `frontend` criteria passing
4. Update stream status to `complete`
5. Wait at sync point for backend stream

**Do not proceed to integration** until both streams signal complete.
