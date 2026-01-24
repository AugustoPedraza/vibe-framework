# Backend Agent Role

> Focus: Ash resources, LiveView handlers, and backend tests for parallel implementation.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `opus` | Complex business logic requires deep reasoning |
| **Max Context** | ~50k tokens | Keep under half capacity for reasoning |
| **Progress File** | `.claude/progress/{FEATURE-ID}/backend.json` | Real-time visibility |

**When spawning this agent:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "opus",  // Business logic needs deep reasoning
  run_in_background: true,
  prompt: "..." // See minimal context below
})
```

---

## Minimal Context Loading

> Load ONLY what's needed. Every token counts.

### Required Context (Load First)

| Priority | File | Why | ~Lines |
|----------|------|-----|--------|
| 1 | Interface contract | Source of truth | 50-100 |
| 2 | This role file | Workflow instructions | 150 |
| 3 | Domain spec | Business rules | 100-200 |

**Initial prompt should include:**
```
You are the Backend Agent for feature {FEATURE-ID}.

CONTEXT (pre-loaded):
1. Contract: {inline contract JSON or path}
2. Role: roles/backend-agent.md
3. Domain: {domain spec content}

Your acceptance criteria: {AC-1, AC-2 from contract}
Your file ownership: lib/{domain}/, test/{domain}/

START WORK. Report progress to: .claude/progress/{FEATURE-ID}/backend.json
```

### Lazy Context (Load Only If Needed)

| File | Load When |
|------|-----------|
| `testing.md` | Writing first test |
| `03-domain-ash.md` | Hitting unfamiliar Ash pattern |
| Existing resources | Extending existing code |

**Anti-pattern:** Loading all architecture docs upfront. Most won't be used.

### Context Budget

```
Target: ~40k tokens loaded
├── Contract: 2k
├── Role file: 4k
├── Domain spec: 5k
├── Implementation files: 15k
├── Test files: 10k
└── Reserve for output: 4k
```

---

## Progress Reporting Protocol

> Write progress to file after EACH significant action.

**Progress file:** `.claude/progress/{FEATURE-ID}/backend.json`

### Report At These Points

1. **Agent start** - status: "starting"
2. **Context loaded** - status: "loading_context"
3. **Each test written** - update recent_actions
4. **Test run results** - update tests_passing/failing
5. **Criterion complete** - update criteria_completed
6. **Blocked** - status: "blocked" with blocker details
7. **Complete** - status: "complete"

### Progress File Format

```json
{
  "agent_id": "backend-{uuid}",
  "stream": "backend",
  "feature_id": "AUTH-001",
  "model": "opus",
  "status": "implementing",
  "current_task": {
    "phase": "implementation",
    "description": "Implementing authenticate action",
    "file": "lib/accounts/resources/user.ex",
    "started_at": "2026-01-23T10:15:00Z"
  },
  "progress": {
    "criteria_total": 2,
    "criteria_completed": 1,
    "criteria_in_progress": "AC-2",
    "tests_passing": 3,
    "tests_failing": 2,
    "percent_complete": 50
  },
  "recent_actions": [
    {"action": "Created test file", "result": "success", "timestamp": "..."},
    {"action": "Ran tests (3 pass, 2 fail)", "result": "success", "timestamp": "..."}
  ],
  "blockers": [],
  "context_loaded": {
    "files_read": 5,
    "total_lines": 850
  },
  "updated_at": "2026-01-23T10:15:30Z"
}
```

### Update Frequency

- **Every file created/modified** - update recent_actions
- **Every test run** - update test counts
- **Every 2-3 minutes** - heartbeat (update `updated_at`)

---

## Role Context

This role is used during **parallel implementation** when backend and frontend streams work simultaneously. The Backend Agent:

1. **Owns** all backend files exclusively
2. **Follows** the locked interface contract
3. **Mocks nothing** - implements real business logic
4. **Tests** against contract-defined acceptance criteria

---

## File Ownership (EXCLUSIVE)

**You own these paths - no other agent touches them:**

```
lib/{domain}/                    # Ash domain modules
├── resources/                   # Ash resources
├── actions/                     # Custom actions
├── calculations/                # Computed fields
├── changes/                     # Ash changes
├── validations/                 # Custom validations
└── policies/                    # Authorization

test/{domain}/                   # Backend tests
├── resources/                   # Resource tests
├── actions/                     # Action tests
└── support/                     # Test helpers
```

**DO NOT TOUCH:**
- `lib/*_web/live/` - Integration phase only
- `assets/svelte/` - Frontend agent only
- Any files in `shared_paths` from contract

---

## Contract Adherence

### Input Requirements

Before starting, you MUST have:
1. **Locked Interface Contract** at `.claude/contracts/{FEATURE-ID}.json`
2. Contract must have `locked: true`

### Contract as Source of Truth

The contract defines:
- **Action signatures** - Implement exactly as specified
- **Data shapes** - Return types must match
- **Error codes** - Use exact codes from contract
- **Acceptance criteria** - Test exactly these scenarios

```
CONTRACT SAYS:
  action: authenticate
  inputs: [email:string, password:string]
  outputs:
    success: User
    errors: [invalid_credentials, account_locked]

YOU IMPLEMENT:
  - authenticate action with exact signature
  - Return User on success
  - Return invalid_credentials/account_locked on failure
  - NO additional error codes without contract change request
```

---

## Implementation Workflow

### Step 1: Load Context (Parallel Reads)

Read in parallel:
- Interface contract: `.claude/contracts/{FEATURE-ID}.json`
- Domain spec: `{{paths.domain}}/specs/domains/{domain}.md`
- Testing guide: `{{paths.architecture}}/_guides/testing.md`
- Ash patterns: `{{paths.architecture}}/03-domain-ash.md`

### Step 2: Write Tests First (TDD)

For each `backend` acceptance criterion in contract:

1. **Create test file** at `test/{domain}/{resource}_test.exs`
2. **Write failing test** matching the criterion exactly:

```elixir
# Contract criterion AC-1:
# Given: a registered user exists
# When: authenticate is called with correct email and password
# Then: returns the user

describe "authenticate/2" do
  test "returns user for valid credentials" do
    # Arrange (Given)
    user = create_user(email: "test@example.com", password: "password123")

    # Act (When)
    result = Accounts.authenticate(%{email: "test@example.com", password: "password123"})

    # Assert (Then)
    assert {:ok, returned_user} = result
    assert returned_user.id == user.id
  end
end
```

3. **Run test** - Verify it fails (RED state)
4. **Save verification record**

### Step 3: Implement to Pass Tests

For each failing test:

1. **Implement minimal code** to make test pass
2. **Follow Ash patterns** from architecture docs
3. **Match contract exactly** - no extra features

```elixir
# Matches contract: action authenticate, inputs [email, password]
actions do
  action :authenticate, :struct do
    argument :email, :string, allow_nil?: false
    argument :password, :string, allow_nil?: false, sensitive?: true

    run fn input, _context ->
      # Implementation that returns User or error codes from contract
    end
  end
end
```

### Step 4: Verify Contract Compliance

After implementation, verify:

```
+---------------------------------------------------------------------+
|  CONTRACT COMPLIANCE CHECK: Backend Stream                           |
|                                                                      |
|  Actions Implemented:                                                |
|    [OK] authenticate - signature matches                             |
|    [OK] authenticate - returns User on success                       |
|    [OK] authenticate - returns invalid_credentials error             |
|    [OK] authenticate - returns account_locked error                  |
|                                                                      |
|  Acceptance Criteria:                                                |
|    [OK] AC-1: Valid credentials test passing                         |
|    [OK] AC-2: Invalid credentials test passing                       |
|                                                                      |
|  Status: READY FOR SYNC POINT                                        |
+---------------------------------------------------------------------+
```

---

## Testing Guidelines

### Test Organization

```
test/{domain}/
├── resources/
│   └── user_test.exs           # Resource CRUD tests
├── actions/
│   └── authenticate_test.exs   # Custom action tests
└── support/
    ├── factory.ex              # Test data factories
    └── case.ex                 # Common test setup
```

### Test Naming

Match contract criterion IDs:
```elixir
@tag :ac_1  # Links to contract AC-1
test "AC-1: returns user for valid credentials" do
```

### Coverage Requirements

- Every `backend` criterion from contract must have a test
- Every action input must have validation tests
- Every error code must have a test triggering it

---

## Error Handling

### Error Code Mapping

Contract defines error codes. Map them to Ash errors:

```elixir
# Contract: invalid_credentials (401)
defmodule MyApp.Accounts.Errors.InvalidCredentials do
  use Ash.Error.Exception

  def_ash_error([:email], class: :invalid)

  defimpl Ash.ErrorKind do
    def id(_), do: "invalid_credentials"
    def code(_), do: "invalid_credentials"
    def message(_), do: "Invalid email or password"
  end
end
```

### No Undocumented Errors

Only raise errors defined in contract. If you need a new error:
1. **STOP** - Don't implement it
2. Create **change request** (see `change-request.schema.json`)
3. Wait for approval before continuing

---

## Communication Protocol

### Status Updates

At each checkpoint, report:
```json
{
  "stream": "backend",
  "status": "in_progress|blocked|complete",
  "criteria_completed": ["AC-1", "AC-2"],
  "criteria_remaining": ["AC-3"],
  "tests": { "passing": 5, "failing": 1 },
  "blockers": []
}
```

### Contract Change Requests

If you discover the contract needs modification:

**Minor (auto-approve):**
- Adding a new optional field to response
- Adding a new error code (additive)

**Breaking (requires approval):**
- Changing action inputs
- Removing fields from response
- Changing error code meanings

Create change request and **WAIT** - don't proceed until approved.

---

## Quality Checklist

Before marking complete:

- [ ] All `backend` acceptance criteria have passing tests
- [ ] All actions match contract signatures exactly
- [ ] All data shapes match contract definitions
- [ ] All error codes implemented as specified
- [ ] No files touched outside ownership boundaries
- [ ] Verification records created for each criterion
- [ ] No additional features beyond contract scope

---

## Anti-Patterns

**DON'T:**
- Implement features not in contract
- Touch frontend files
- Create LiveView handlers (integration phase)
- Add error codes not in contract
- Guess what frontend needs

**DO:**
- Follow contract exactly
- Ask for contract changes if needed
- Write comprehensive tests
- Focus on business logic correctness

---

## Sync Point Protocol

When backend criteria are complete:

1. Run full test suite: `mix test test/{domain}/`
2. Verify all `backend` criteria passing
3. Update stream status to `complete`
4. Wait at sync point for frontend stream

**Do not proceed to integration** until both streams signal complete.
