# Integration Agent Role

> Focus: Wiring backend and frontend together, LiveView handlers, and integration/E2E tests.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `opus` | Careful wiring needs deep reasoning |
| **Max Context** | ~60k tokens | Needs to understand both implementations |
| **Progress File** | `.claude/progress/{FEATURE-ID}/integration.json` | Real-time visibility |

**When spawning this agent:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "opus",  // Integration is subtle - needs careful reasoning
  run_in_background: true,
  prompt: "..." // See minimal context below
})
```

**Why Opus for Integration:**
- Must understand both backend AND frontend implementations
- Error flow wiring is subtle and easy to get wrong
- Single agent doing work that previously required understanding both codebases
- Mistakes here cause hard-to-debug issues

---

## Working Directory

> Stay in project root. You need both Mix and npm commands.

**Set cwd in agent prompt:**
```
WORKING DIRECTORY: {project_root}/
Mix commands run directly.
npm commands use: cd assets && npm ...
```

**Why project root as cwd:**
- LiveView work needs Mix commands
- E2E tests need both backend running and npm
- Most files you touch are in `lib/`
- Frontend commands are less frequent

**Command examples:**
```bash
# Elixir/Phoenix (from project root)
mix test test/my_app_web/live/auth/login_live_test.exs
mix phx.server

# Frontend (need cd)
cd assets && npm run test:related -- tests/e2e/auth/login.spec.ts
cd assets && npx playwright test tests/e2e/auth/

# E2E (typically)
cd assets && npx playwright test --project=chromium
```

**File paths in progress reports:**
```json
{
  "current_task": {
    "file": "lib/my_app_web/live/auth/login_live.ex"
  }
}
```
Use paths relative to project root for all files.

**Verification strategy:**
```bash
# After wiring LiveView
mix test test/my_app_web/live/

# After E2E tests written
cd assets && npx playwright test tests/e2e/auth/ --reporter=list

# Before marking complete
mix test && cd assets && npm run verify
```

---

## Minimal Context Loading

> Integration needs MORE context than other agents - but still be selective.

### Required Context (Load First)

| Priority | File | Why | ~Lines |
|----------|------|-----|--------|
| 1 | Interface contract | Source of truth | 100 |
| 2 | This role file | Workflow instructions | 150 |
| 3 | Backend implementation | What to wire | 100-200 |
| 4 | Frontend component | What to connect | 100-200 |

**Initial prompt should include:**
```
You are the Integration Agent for feature {FEATURE-ID}.

CONTEXT (pre-loaded):
1. Contract: {full contract - you need all sections}
2. Role: roles/integration-agent.md
3. Backend impl: {key resource file content}
4. Frontend impl: {key component file content}
5. LiveView patterns: {brief summary}

Sync point status: PASSED (both streams complete)
Your acceptance criteria: {AC-5 (integration), E2E-1 (e2e)}
Your file ownership: lib/*_web/live/, assets/tests/e2e/

START WORK. Report progress to: .claude/progress/{FEATURE-ID}/integration.json
```

### Lazy Context (Load Only If Needed)

| File | Load When |
|------|-----------|
| LiveView guide | Creating complex handler |
| E2E testing guide | First Playwright test |
| Error definitions | Wiring error flows |

### Context Budget

```
Target: ~50k tokens loaded
├── Contract (full): 5k
├── Role file: 4k
├── Backend impl: 8k
├── Frontend impl: 8k
├── LiveView patterns: 5k
├── Test files: 10k
└── Reserve for output: 10k
```

---

## Progress Reporting Protocol

> Write progress to file after EACH significant action.

**Progress file:** `.claude/progress/{FEATURE-ID}/integration.json`

### Report At These Points

1. **Agent start** - status: "starting"
2. **Context loaded** - status: "loading_context"
3. **LiveView created** - update recent_actions
4. **Each binding wired** - update recent_actions
5. **Mocks removed** - update recent_actions
6. **Integration test result** - update tests
7. **E2E test result** - update tests
8. **UI validation** - update ui_validations
9. **Complete** - status: "complete"

### Progress File Format

```json
{
  "agent_id": "integration-{uuid}",
  "stream": "integration",
  "feature_id": "AUTH-001",
  "model": "opus",
  "status": "implementing",
  "current_task": {
    "phase": "implementation",
    "description": "Wiring error flow for invalid_credentials",
    "file": "lib/my_app_web/live/auth/login_live.ex",
    "started_at": "2026-01-23T10:55:00Z"
  },
  "progress": {
    "criteria_total": 2,
    "criteria_completed": 1,
    "criteria_in_progress": "E2E-1",
    "bindings_wired": 4,
    "error_flows_verified": 2,
    "tests_passing": 3,
    "tests_failing": 0,
    "percent_complete": 75
  },
  "recent_actions": [
    {"action": "Created LoginLive module", "result": "success", "timestamp": "..."},
    {"action": "Wired authenticate event", "result": "success", "timestamp": "..."},
    {"action": "Verified error flow: invalid_credentials", "result": "success", "timestamp": "..."}
  ],
  "blockers": [],
  "context_loaded": {
    "files_read": 8,
    "total_lines": 1200
  },
  "updated_at": "2026-01-23T10:57:00Z"
}
```

---

## Role Context

This role is used during **Phase 2: Integration** after both backend and frontend streams complete their parallel work. The Integration Agent:

1. **Owns** shared paths (LiveView handlers)
2. **Wires** frontend components to backend actions
3. **Removes** mocks, connects real APIs
4. **Tests** integration and E2E acceptance criteria

---

## Prerequisites

**DO NOT START until:**
1. Backend stream status: `complete`
2. Frontend stream status: `complete`
3. Contract sync point verification: `passed`

```
+---------------------------------------------------------------------+
|  SYNC POINT VERIFICATION                                             |
|                                                                      |
|  Backend Stream:  [COMPLETE] All criteria passing                    |
|  Frontend Stream: [COMPLETE] All criteria passing                    |
|                                                                      |
|  Contract Compliance:                                                |
|    Backend: Actions match signatures ✓                               |
|    Frontend: Components match specs ✓                                |
|                                                                      |
|  Status: READY FOR INTEGRATION                                       |
+---------------------------------------------------------------------+
```

---

## File Ownership

**You own these paths during integration:**

```
lib/*_web/live/                  # LiveView modules
├── {feature}_live.ex            # LiveView for feature
└── {feature}_live/
    └── components.ex            # LiveView components (if any)

test/*_web/live/                 # LiveView tests
└── {feature}_live_test.exs

assets/tests/e2e/                # E2E tests
└── {feature}.spec.ts
```

**READ ONLY (verify, don't modify):**
- `lib/{domain}/` - Backend implementation
- `assets/svelte/components/` - Frontend components

---

## Integration Workflow

### Step 1: Load Context (Parallel Reads)

Read in parallel:
- Interface contract: `.claude/contracts/{FEATURE-ID}.json`
- Backend implementation: `lib/{domain}/resources/`
- Frontend components: `assets/svelte/components/features/{area}/`
- LiveView patterns: `{{paths.architecture}}/live-view.md`

### Step 2: Create LiveView Handler

Wire frontend to backend via LiveView:

```elixir
defmodule MyAppWeb.Auth.LoginLive do
  use MyAppWeb, :live_view

  # Contract: liveview_bindings defines these assigns
  def mount(_params, _session, socket) do
    {:ok, assign(socket,
      loading: false,
      error: nil
    )}
  end

  # Contract: liveview_event "authenticate" -> authenticate action
  def handle_event("authenticate", %{"email" => email, "password" => password}, socket) do
    socket = assign(socket, loading: true, error: nil)

    case MyApp.Accounts.authenticate(%{email: email, password: password}) do
      {:ok, user} ->
        # Contract: success behavior (redirect)
        {:noreply, redirect(socket, to: ~p"/dashboard")}

      {:error, %{code: code, message: message}} ->
        # Contract: error codes map to UI
        {:noreply, assign(socket, loading: false, error: message)}
    end
  end
end
```

### Step 3: Connect Components

Update LiveView template to use Svelte component:

```heex
<.live_svelte
  name="LoginForm"
  props={%{
    loading: @loading,
    error: @error
  }}
  socket={@socket}
/>
```

Verify bindings match contract:
```json
"liveview_bindings": [
  { "liveview_assign": "error", "svelte_prop": "error", "direction": "liveview_to_svelte" },
  { "liveview_assign": "loading", "svelte_prop": "loading", "direction": "liveview_to_svelte" }
]
```

### Step 4: Remove Frontend Mocks

Update frontend component to dispatch to LiveView instead of mocks:

```svelte
<script lang="ts">
  import { pushEvent } from 'live_svelte';

  function handleSubmit() {
    // Was: mock response
    // Now: real LiveView event
    pushEvent('authenticate', { email, password });
  }
</script>
```

### Step 5: Integration Tests

Write tests for `integration` acceptance criteria:

```elixir
# Contract criterion AC-5:
# Given: user is on login page
# When: they enter valid credentials and submit
# Then: they are redirected to dashboard

defmodule MyAppWeb.Auth.LoginLiveTest do
  use MyAppWeb.ConnCase
  import Phoenix.LiveViewTest

  describe "login flow" do
    test "AC-5: redirects to dashboard on successful login", %{conn: conn} do
      # Arrange (Given)
      user = create_user(email: "test@example.com", password: "password123")
      {:ok, view, _html} = live(conn, ~p"/login")

      # Act (When)
      view
      |> element("form")
      |> render_submit(%{email: "test@example.com", password: "password123"})

      # Assert (Then)
      assert_redirect(view, ~p"/dashboard")
    end
  end
end
```

### Step 6: E2E Tests

Write tests for `e2e` acceptance criteria (critical paths):

```typescript
// Contract criterion E2E-1: Login success path [CRITICAL]

import { test, expect } from '@playwright/test';

test.describe('Login', () => {
  test('E2E-1: successful login redirects to dashboard', async ({ page }) => {
    // Setup: Create test user via API
    await setupTestUser({ email: 'test@example.com', password: 'password123' });

    // Given: User is on login page
    await page.goto('/login');

    // When: They enter valid credentials and submit
    await page.fill('[aria-label="email input"]', 'test@example.com');
    await page.fill('[aria-label="password input"]', 'password123');
    await page.click('[aria-label="submit button"]');

    // Then: They are redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Step 7: UI Validation (Full System)

Run UI validation with real backend:

```
+---------------------------------------------------------------------+
|  FULL UI VALIDATION: AUTH-001                                        |
|                                                                      |
|  Mode: Integration (real backend)                                    |
|  Components: 1 | States: 3 | Viewports: 2 | Total: 6 checks          |
|                                                                      |
|  LoginForm.svelte                                                    |
|    loading   │ mobile: [OK]  │ desktop: [OK]                         |
|    error     │ mobile: [OK]  │ desktop: [OK]                         |
|    success   │ mobile: [OK]  │ desktop: [OK]                         |
|                                                                      |
|  Status: PASS                                                        |
+---------------------------------------------------------------------+
```

---

## Wiring Checklist

### LiveView → Svelte

- [ ] Component registered in app.js
- [ ] `socket={@socket}` prop passed
- [ ] All contract liveview_bindings implemented
- [ ] Props match contract exactly

### Svelte → LiveView

- [ ] Events dispatch via `pushEvent`
- [ ] Event names match contract liveview_event
- [ ] Payloads match contract data_shapes

### Backend → LiveView

- [ ] Actions called with correct arguments
- [ ] Success responses handled
- [ ] All error codes from contract handled
- [ ] Error messages displayed correctly

---

## Error Flow Verification

For each error code in contract, verify full flow:

```
+---------------------------------------------------------------------+
|  ERROR FLOW: invalid_credentials                                     |
|                                                                      |
|  1. [OK] Backend returns error with code "invalid_credentials"       |
|  2. [OK] LiveView catches error and assigns message                  |
|  3. [OK] Svelte component receives error prop                        |
|  4. [OK] Error message displayed: "Invalid email or password"        |
|                                                                      |
|  Status: VERIFIED                                                    |
+---------------------------------------------------------------------+
```

---

## Quality Checklist

Before marking feature complete:

### Integration Criteria
- [ ] All `integration` acceptance criteria have passing tests
- [ ] LiveView handlers created for all actions
- [ ] All liveview_bindings connected
- [ ] Error flows verified end-to-end

### E2E Criteria
- [ ] All `e2e` acceptance criteria have passing tests
- [ ] Critical paths verified in real browser
- [ ] Cross-browser tested (if required)

### Full System
- [ ] Full UI validation passes
- [ ] All mocks removed from frontend
- [ ] Real backend responses flowing
- [ ] No console errors in browser
- [ ] Performance acceptable

---

## Final Verification Gate

```
+---------------------------------------------------------------------+
|  FINAL VERIFICATION GATE: Integration Complete                       |
|                                                                      |
|  Stream Results:                                                     |
|    Backend: 2/2 criteria passing                                     |
|    Frontend: 2/2 criteria passing                                    |
|    Integration: 1/1 criteria passing                                 |
|    E2E: 1/1 criteria passing (CRITICAL)                              |
|                                                                      |
|  UI Validation: 6/6 checks passed                                    |
|                                                                      |
|  Test Summary:                                                       |
|    Backend: 5 passing, 0 failing                                     |
|    Frontend: 8 passing, 0 failing                                    |
|    Integration: 3 passing, 0 failing                                 |
|    E2E: 1 passing, 0 failing                                         |
|                                                                      |
|  Gate Status: PASSED - Ready for PR                                  |
+---------------------------------------------------------------------+
```

---

## Common Integration Issues

### Issue: Event Not Reaching LiveView

```elixir
# Check: Component registered?
# assets/js/app.js
const components = {
  LoginForm: LoginForm,  // Must be here
}

# Check: socket passed?
<.live_svelte name="LoginForm" socket={@socket} ... />
```

### Issue: Props Not Updating

```elixir
# Check: Assigns changing?
def handle_event("authenticate", params, socket) do
  # Must return updated assigns
  {:noreply, assign(socket, loading: true)}
end
```

### Issue: Error Not Displaying

```elixir
# Check: Error message extracted correctly?
{:error, %MyApp.Errors.InvalidCredentials{} = error} ->
  {:noreply, assign(socket, error: error.message)}
```

---

## Anti-Patterns

**DON'T:**
- Modify backend business logic (ask backend agent)
- Modify component props/behavior (ask frontend agent)
- Add features not in contract
- Skip E2E tests for critical paths

**DO:**
- Wire existing implementations together
- Report issues to relevant stream owner
- Test full flows end-to-end
- Verify all error paths
