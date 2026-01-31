# API Agent - Stub Mode

> Early-start mode for API agent to begin work during Phase 1.

---

## Purpose

The API agent traditionally waits for Phase 1 (parallel implementation) to complete before starting Phase 2 (integration). This creates a bottleneck - 15-30 minutes of wasted time while the api-agent could be working.

**Stub mode** allows the API agent to:
1. Start during Phase 1
2. Create scaffolding while waiting
3. Switch to "wiring mode" when dependencies complete

---

## Agent Configuration (Stub Mode)

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | Scaffolding doesn't need opus reasoning |
| **Context Budget** | ~15k tokens | Minimal - just contract + templates |
| **Progress File** | `.claude/progress/{FEATURE-ID}/api-stub.json` | Track stub work |

**Spawning configuration:**
```typescript
// Spawn during Phase 1 (early)
Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  run_in_background: true,
  prompt: buildApiAgentStubPrompt(contract)
})
```

---

## Stub Mode Behavior

### Phase 1 (Stub Mode) - While Other Agents Work

```
WHILE domain-agent.status != "complete" OR ui-agent.status != "complete":

  1. Create LiveView scaffolding
     - Module structure with socket assigns
     - Empty event handlers (documented stubs)
     - Route entries

  2. Create integration test scaffolding
     - Test module structure
     - Scenario outlines from contract
     - Mock setup

  3. Watch for interface updates
     - Monitor contract for data_shapes changes
     - Update stubs to match

  4. Document integration points
     - List expected domain actions
     - List expected UI events
     - Note any ambiguities
```

### Stub Code Pattern

```elixir
defmodule MyAppWeb.FeatureLive do
  use MyAppWeb, :live_view

  # STUB: Will be wired when domain-agent completes
  # Expected: Accounts.authenticate(email, password)

  def mount(_params, _session, socket) do
    {:ok, assign(socket,
      # Assigns from contract.data_shapes.view_state
      form: nil,           # TODO: AshPhoenix.Form.for_create
      loading: false,
      error: nil
    )}
  end

  # STUB: Event handlers from contract.api_contract.actions

  def handle_event("submit_login", %{"email" => _, "password" => _} = params, socket) do
    # TODO: Wire to Accounts.authenticate
    # Expected output: {:ok, user} | {:error, :invalid_credentials}
    {:noreply, socket}
  end

  # STUB: Push events from contract.ui_contract.push_events

  defp push_login_success(socket, user) do
    # TODO: push_to_svelte(socket, "auth", "login:success", %{user: user})
    socket
  end
end
```

---

## Transition to Wiring Mode

When dependencies complete, API agent transitions from stub to wiring:

### Trigger Conditions

```
IF domain-agent.status == "complete" AND ui-agent.status == "complete":
  TRANSITION to wiring mode
```

### Wiring Mode Process

```
1. Read completed domain code
   - Extract actual action signatures
   - Note any deviations from contract

2. Read completed UI code
   - Extract actual event names
   - Note any deviations from contract

3. Replace stubs with real implementations
   - Wire domain actions
   - Wire UI events
   - Remove TODO comments

4. Run integration tests
   - Connect scaffolded tests to real code
   - Add assertions
```

### Progress Update

```json
{
  "agent": "api-agent",
  "phase": "wiring",
  "transitioned_at": "2026-01-30T12:00:00Z",
  "stub_files": [
    "lib/app_web/live/feature_live.ex",
    "test/app_web/live/feature_live_test.exs"
  ],
  "wiring_status": {
    "domain_actions": 2,
    "ui_events": 3,
    "wired": 0,
    "remaining": 5
  }
}
```

---

## Benefits

| Metric | Without Stub Mode | With Stub Mode |
|--------|-------------------|----------------|
| Phase 2 start | After Phase 1 sync | During Phase 1 |
| Scaffolding time | Phase 2 | Overlapped |
| Time saved | 0 | 15-30 min |
| Integration issues | Found in Phase 2 | Found during Phase 1 |

---

## Stub Templates

### LiveView Stub

```elixir
defmodule <%= @module %>Web.<%= @feature %>Live do
  @moduledoc """
  STUB: Generated from contract <%= @contract.feature_id %>
  Awaiting: domain-agent, ui-agent completion
  """
  use <%= @module %>Web, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, assign(socket, <%= for {k, v} <- @initial_assigns do %>
      <%= k %>: <%= inspect(v) %>,<% end %>
    )}
  end

  <%= for action <- @contract.api_contract.actions do %>
  # STUB: <%= action.name %>
  # Inputs: <%= inspect(action.inputs) %>
  # Outputs: <%= inspect(action.outputs) %>
  @impl true
  def handle_event("<%= action.liveview_event %>", params, socket) do
    # TODO: Wire to <%= @contract.api_contract.domain %>.<%= action.name %>
    {:noreply, socket}
  end
  <% end %>
end
```

### Integration Test Stub

```elixir
defmodule <%= @module %>Web.<%= @feature %>LiveTest do
  use <%= @module %>Web.ConnCase, async: true
  import Phoenix.LiveViewTest

  # STUB: Scenarios from contract
  <%= for scenario <- @contract.acceptance_criteria.scenarios do %>
  describe "<%= scenario.given %>" do
    test "<%= scenario.when %> then <%= scenario.then %>", %{conn: conn} do
      # TODO: Implement when wiring complete
      flunk("Not implemented")
    end
  end
  <% end %>
end
```

---

## Related

- `api-agent.md` - Full API agent behavior
- `../orchestrator/core.md` - Orchestrator workflow
- `../../templates/contracts/interface-contract.schema.json` - Contract format
