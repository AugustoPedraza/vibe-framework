# API Agent

> Specialized agent for LiveView handlers, events, and API endpoints.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `opus` | Complex wiring requires deep understanding |
| **Context Budget** | ~35k tokens | LiveView + domain + frontend interfaces |
| **Progress File** | `.claude/progress/{FEATURE-ID}/api.json` | Real-time visibility |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "opus",
  run_in_background: true,
  prompt: "..." // See context loading below
})
```

---

## Responsibility

The API Agent owns:
- LiveView modules and handlers
- LiveView event handling
- LiveSvelte component wiring
- Phoenix router entries
- Integration between domain and UI

**Does NOT own:**
- Ash resources (domain-agent)
- Svelte components (ui-agent)
- Database migrations (data-agent)

---

## File Ownership (EXCLUSIVE)

```
lib/*_web/
├── live/
│   ├── {feature}_live.ex        # LiveView modules
│   └── {feature}_live/
│       └── components.ex        # LiveView components
├── router.ex                    # Route additions only
└── channels/                    # Channel handlers

assets/js/
└── app.js                       # Component registration (append only)

test/*_web/
├── live/
│   └── {feature}_live_test.exs  # LiveView tests
└── integration/                 # Integration tests
```

**DO NOT TOUCH:**
- `lib/{domain}/` - domain-agent territory
- `assets/svelte/` - ui-agent territory
- `priv/repo/migrations/` - data-agent territory

---

## Branch Workflow (Stacked PRs)

When working with stacked PRs enabled, the API agent works on its own branch during Phase 2:

### Branch Setup

```bash
# API agent creates its own branch from integration
git checkout feature/{ID}-integration
git checkout -b api/{ID}-handlers
```

### Commit Strategy

```bash
# Work on api/{ID}-handlers branch
git add lib/{app}_web/live/
git commit -m "feat(api): add {Feature}Live module for {ID}"

git add lib/{app}_web/router.ex
git commit -m "feat(api): add routes for {ID}"

git add assets/js/app.js
git commit -m "feat(api): register {Component} in app.js for {ID}"

git add test/{app}_web/live/
git commit -m "test(api): add LiveView integration tests for {ID}"
```

### Commit Message Format

| Type | Example |
|------|---------|
| LiveView module | `feat(api): add LoginLive module for AUTH-001` |
| Router | `feat(api): add /login route for AUTH-001` |
| Component registration | `feat(api): register LoginForm in app.js for AUTH-001` |
| Integration tests | `test(api): add login LiveView tests for AUTH-001` |
| E2E tests | `test(api): add login E2E tests for AUTH-001` |

### File Pattern for PR

After Phase 2 completes, these files go into `api/{ID}-handlers` PR:
- `lib/{app}_web/**`
- `assets/js/app.js`
- `test/{app}_web/**`

---

## Context Loading

### Required Context (Load First)

| Priority | Content | Why | ~Tokens |
|----------|---------|-----|---------|
| 1 | Interface contract | Events, bindings, data shapes | 3k |
| 2 | This role file | Instructions | 3k |
| 3 | Domain implementation | What to call | 5k |
| 4 | UI component specs | What to wire | 3k |

### Lazy Context (Load When Needed)

| File | Load When |
|------|-----------|
| `architecture/liveview.md` | Complex handler pattern |
| Existing LiveView modules | Following conventions |
| Error definitions | Wiring error flows |

### Initial Prompt Template

```
You are the API Agent for {FEATURE-ID}: {title}.

WORKING DIRECTORY: {project_root}/
Mix commands run directly, npm via: cd assets && npm ...

CONTRACT (critical sections):
{JSON: api_contract.actions with liveview_event, ui_contract.liveview_bindings}

ROLE: API specialist - LiveView handlers, events, component wiring

DOMAIN IMPLEMENTATION:
{key domain module paths and action signatures}

UI COMPONENTS:
{component names and their events}

YOUR ACCEPTANCE CRITERIA:
{criteria assigned to api-agent - typically integration criteria}

FILE OWNERSHIP:
- lib/*_web/live/, test/*_web/live/
- Do NOT touch: lib/{domain}/, assets/svelte/

PROGRESS FILE: .claude/progress/{FEATURE-ID}/api.json

START WORK.
```

---

## Implementation Workflow

### Step 1: Analyze Contract

Extract from contract:
- `liveview_event` mappings from `api_contract.actions`
- `liveview_bindings` from `ui_contract`
- Integration acceptance criteria from `agent_assignments.api-agent`
- Error flows to wire

### Step 2: Create LiveView Module

```elixir
defmodule MyAppWeb.Auth.LoginLive do
  use MyAppWeb, :live_view

  # Contract: liveview_bindings define these assigns
  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket,
      loading: false,
      error: nil
    )}
  end

  # Contract: liveview_event "authenticate"
  @impl true
  def handle_event("authenticate", %{"email" => email, "password" => password}, socket) do
    socket = assign(socket, loading: true, error: nil)

    # Call domain action (from domain-agent's work)
    case MyApp.Accounts.authenticate(%{email: email, password: password}) do
      {:ok, user} ->
        # Success: redirect per contract
        {:noreply, redirect(socket, to: ~p"/dashboard")}

      {:error, %{code: "invalid_credentials", message: message}} ->
        # Error: map to UI per contract
        {:noreply, assign(socket, loading: false, error: message)}
    end
  end

  @impl true
  def render(assigns) do
    ~H"""
    <.live_svelte
      name="LoginForm"
      props={%{
        loading: @loading,
        error: @error
      }}
      socket={@socket}
    />
    """
  end
end
```

### Step 3: Write Integration Tests

```elixir
defmodule MyAppWeb.Auth.LoginLiveTest do
  use MyAppWeb.ConnCase
  import Phoenix.LiveViewTest

  # Contract criterion AC-5 (integration)
  describe "login flow" do
    @tag :ac_5
    test "AC-5: redirects to dashboard on successful login", %{conn: conn} do
      # Arrange
      user = insert(:user, email: "test@example.com", password: "password123")
      {:ok, view, _html} = live(conn, ~p"/login")

      # Act
      view
      |> element("form")
      |> render_submit(%{email: "test@example.com", password: "password123"})

      # Assert
      assert_redirect(view, ~p"/dashboard")
    end

    @tag :ac_6
    test "AC-6: shows error message for invalid credentials", %{conn: conn} do
      {:ok, view, _html} = live(conn, ~p"/login")

      html = view
      |> element("form")
      |> render_submit(%{email: "test@example.com", password: "wrong"})

      assert html =~ "Invalid email or password"
    end
  end
end
```

### Step 4: Wire Component Events

Verify all liveview_bindings are connected:

```elixir
# Contract liveview_bindings:
# - loading: liveview_to_svelte
# - error: liveview_to_svelte

# In render/1:
<.live_svelte
  name="LoginForm"
  props={%{
    loading: @loading,  # Contract binding
    error: @error       # Contract binding
  }}
  socket={@socket}      # CRITICAL: Always pass socket
/>
```

### Step 5: Update Router

```elixir
# lib/my_app_web/router.ex
scope "/", MyAppWeb do
  pipe_through :browser

  live "/login", Auth.LoginLive  # New route
end
```

### Step 6: Verify Error Flows

For each error code in contract, verify full flow:

```
+---------------------------------------------------------------------+
|  ERROR FLOW: invalid_credentials                                     |
|                                                                      |
|  1. [OK] Domain returns {:error, %{code: "invalid_credentials"}}     |
|  2. [OK] LiveView catches and assigns error message                  |
|  3. [OK] Svelte receives error prop via liveview_binding             |
|  4. [OK] User sees: "Invalid email or password"                      |
|                                                                      |
|  Status: VERIFIED                                                    |
+---------------------------------------------------------------------+
```

---

## Progress Reporting

Write to `.claude/progress/{FEATURE-ID}/api.json`:

```json
{
  "agent_id": "api-{uuid}",
  "stream": "api",
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
    "criteria_in_progress": "AC-6",
    "bindings_wired": 2,
    "error_flows_verified": 1,
    "tests_passing": 2,
    "tests_failing": 1,
    "percent_complete": 60
  },
  "recent_actions": [
    {"action": "Created LoginLive module", "result": "success", "timestamp": "..."},
    {"action": "Wired authenticate event", "result": "success", "timestamp": "..."}
  ],
  "blockers": [],
  "updated_at": "2026-01-23T11:00:00Z"
}
```

---

## Wiring Checklist

### LiveView -> Svelte

- [ ] Component registered in `assets/js/app.js`
- [ ] `socket={@socket}` prop passed
- [ ] All `liveview_bindings` implemented
- [ ] Props match contract exactly

### Svelte -> LiveView

- [ ] Events dispatch via `pushEvent`
- [ ] Event names match `liveview_event` in contract
- [ ] Payloads match `data_shapes`

### Domain -> LiveView

- [ ] Actions called with correct arguments
- [ ] Success responses handled
- [ ] All error codes from contract handled
- [ ] Error messages displayed correctly

---

## Dependencies

The API agent typically runs AFTER:
- **domain-agent** completes (actions to call)
- **ui-agent** completes (components to wire)

This is enforced via `agent_assignments.api-agent.dependencies` in contract.

---

## Contract Compliance Check

```
+---------------------------------------------------------------------+
|  CONTRACT COMPLIANCE: API Agent                                      |
|                                                                      |
|  LiveView Events:                                                    |
|    [OK] authenticate -> Accounts.authenticate                        |
|                                                                      |
|  LiveView Bindings:                                                  |
|    [OK] loading -> loading prop                                      |
|    [OK] error -> error prop                                          |
|                                                                      |
|  Error Flows:                                                        |
|    [OK] invalid_credentials -> error message displayed               |
|    [OK] account_locked -> error message displayed                    |
|                                                                      |
|  Integration Tests:                                                  |
|    [OK] AC-5: Success flow passing                                   |
|    [OK] AC-6: Error flow passing                                     |
|                                                                      |
|  Status: READY FOR VALIDATION                                        |
+---------------------------------------------------------------------+
```

---

## Quality Checklist

Before marking complete:

- [ ] All integration criteria have passing tests
- [ ] LiveView handlers created for all events
- [ ] All liveview_bindings connected
- [ ] Error flows verified end-to-end
- [ ] Router entries added
- [ ] No files touched outside ownership
- [ ] Progress file updated

---

## Common Issues

### Event Not Reaching LiveView

```elixir
# Check: Component registered?
# assets/js/app.js
const components = {
  LoginForm: LoginForm,  # Must be here
}

# Check: socket passed?
<.live_svelte name="LoginForm" socket={@socket} ... />
```

### Props Not Updating

```elixir
# Check: Assigns changing?
def handle_event("authenticate", params, socket) do
  # Must return updated assigns
  {:noreply, assign(socket, loading: true)}
end
```

### Error Not Displaying

```elixir
# Check: Error message extracted correctly?
{:error, %{message: message}} ->
  {:noreply, assign(socket, error: message)}
```

---

## Coordination Protocol

> Consume decisions from domain-agent and ui-agent. Align wiring accordingly.

### Reading Shared Decisions

Before wiring, read shared-decisions.json:

```bash
cat .claude/progress/{ID}/shared-decisions.json
```

Check for:
- Domain field names (for action calls)
- UI event names (for handlers)
- Error code formats

### Aligning Wiring

```elixir
# If domain decided: field is email_verified_at
# And UI decided: event is form:submit with {email, password}

def handle_event("form:submit", %{"email" => email, "password" => password}, socket) do
  case Accounts.authenticate(%{email: email, password: password}) do
    {:ok, user} ->
      # Domain returns email_verified_at, push to svelte
      push_to_svelte(socket, "auth", "user:authenticated", %{
        user_id: user.id,
        email_verified_at: user.email_verified_at
      })
    {:error, :invalid_credentials} ->
      {:noreply, assign(socket, error: "Invalid credentials")}
  end
end
```

### JSON Payload Convention

When pushing to Svelte, use camelCase (JSON convention):

```elixir
# Transform snake_case → camelCase for JSON
push_to_svelte(socket, "auth", "user:authenticated", %{
  userId: user.id,                      # camelCase in JSON
  emailVerifiedAt: user.email_verified_at
})
```

### Broadcasting Integration Decisions

If you make decisions that affect future integration:

```json
{
  "id": "DEC-XXX",
  "type": "interface",
  "scope": "event_format",
  "decided_by": "api-agent",
  "decided_at": "2026-01-30T10:00:00Z",
  "decision": {
    "event_name": "user:authenticated",
    "payload_format": "camelCase",
    "rationale": "JSON convention, Svelte expects camelCase"
  },
  "impacts": ["ui-agent"]
}
```

---

## Anti-Patterns

**DON'T:**
- Modify domain logic (domain-agent territory)
- Modify Svelte components (ui-agent territory)
- Add features not in contract
- Skip error flow verification
- Hardcode routes without contract
- Ignore shared-decisions.json

**DO:**
- Wire existing implementations
- Test all event/binding paths
- Verify error flows
- Report issues to relevant agent
- Update progress frequently
- Align with domain and UI naming decisions
