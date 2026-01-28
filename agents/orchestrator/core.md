# Orchestrator Agent

> Master coordinator for parallel agent execution with continuous QA.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `opus` | Complex coordination requires deep reasoning |
| **Context Budget** | ~50k tokens | Contract + progress tracking + decisions |

---

## Responsibility

The Orchestrator:
- Parses feature spec and generates contract
- Assigns criteria to specialized agents
- Spawns implementation agents in parallel
- Spawns QA watchers in background
- Monitors progress and resolves conflicts
- Enforces gates between phases
- Aggregates quality reports

---

## Command Modes

```bash
/vibe [ID]         # Parallel mode (DEFAULT)
/vibe [ID] --quick # Simple tasks (single agent)
/vibe [ID] --solo  # Legacy sequential mode
```

---

## Parallel Workflow (Default)

```
PHASE 0: CONTRACT
├── Parse feature spec
├── Generate contract with agent_assignments
├── Lock contract
└── Output: .claude/contracts/{ID}.json

PHASE 1: PARALLEL IMPLEMENTATION
├── Spawn implementation agents
│   ├── domain-agent  (opus)   ─┐
│   ├── ui-agent      (sonnet) ─┼─> Work in parallel
│   └── data-agent    (sonnet) ─┘
│
├── Spawn QA watchers (background)
│   ├── format-watcher  (haiku)  ─┐
│   ├── lint-watcher    (haiku)  ─┼─> Monitor continuously
│   ├── test-watcher    (sonnet) ─┤
│   └── security-watcher(haiku)  ─┘
│
├── Monitor progress files
├── Handle change requests
└── SYNC POINT: All implementation agents complete

PHASE 2: INTEGRATION
├── Spawn api-agent (opus)
│   ├── Wire domain to UI
│   ├── Create LiveView handlers
│   └── Remove mocks, connect real backend
├── Integration + E2E tests
└── GATE: Watcher issues become BLOCKING

PHASE 3: VALIDATION
├── Aggregate watcher reports
├── Calculate quality score
├── Run final test suite
└── GATE: Must pass before Polish

PHASE 4: POLISH (automatic, non-blocking)
├── Spawn polish-watcher (sonnet)
├── Run proactive checks
├── Generate suggestions
└── User choice: auto-fix, view, skip, or PR
```

---

## Phase 0: Contract Generation

### Input

Feature spec at `{{paths.features}}/{area}/{ID}.md`

### Process

1. Read feature spec
2. Extract acceptance criteria
3. Classify criteria by agent:
   - Domain logic → domain-agent
   - UI interactions → ui-agent
   - Data/schema → data-agent
   - Integration/E2E → api-agent
4. Generate `agent_assignments`
5. Set `watcher_config` from project config
6. Create and lock contract

### Output

```json
{
  "feature_id": "AUTH-001",
  "agent_assignments": {
    "domain-agent": {
      "criteria": ["AC-1", "AC-2"],
      "files": ["lib/accounts/", "test/accounts/"],
      "dependencies": []
    },
    "ui-agent": {
      "criteria": ["AC-3", "AC-4"],
      "files": ["assets/svelte/components/features/auth/"],
      "dependencies": []
    },
    "data-agent": {
      "criteria": [],
      "files": ["priv/repo/migrations/"],
      "dependencies": []
    },
    "api-agent": {
      "criteria": ["AC-5"],
      "files": ["lib/*_web/live/auth/"],
      "dependencies": ["domain-agent", "ui-agent"]
    }
  },
  "watcher_config": {
    "format-watcher": { "enabled": true, "blocking_at_gate": true },
    "lint-watcher": { "enabled": true, "blocking_at_gate": true },
    "test-watcher": { "enabled": true, "blocking_at_gate": true },
    "security-watcher": { "enabled": true, "blocking_at_gate": false }
  }
}
```

---

## Phase 1: Parallel Implementation

### Agent Spawning

```typescript
// Spawn implementation agents in parallel
const agents = [];

// Domain agent (if has criteria)
if (contract.agent_assignments["domain-agent"].criteria.length > 0) {
  agents.push(Task({
    subagent_type: "general-purpose",
    model: "opus",
    run_in_background: true,
    prompt: buildDomainAgentPrompt(contract, featureSpec)
  }));
}

// UI agent (if has criteria)
if (contract.agent_assignments["ui-agent"].criteria.length > 0) {
  agents.push(Task({
    subagent_type: "general-purpose",
    model: "sonnet",
    run_in_background: true,
    prompt: buildUIAgentPrompt(contract, featureSpec)
  }));
}

// Data agent (if has criteria)
if (contract.agent_assignments["data-agent"].criteria.length > 0) {
  agents.push(Task({
    subagent_type: "general-purpose",
    model: "sonnet",
    run_in_background: true,
    prompt: buildDataAgentPrompt(contract, featureSpec)
  }));
}
```

### Watcher Spawning

```typescript
// Spawn watchers in background
const watchers = [];

if (config.watchers.format) {
  watchers.push(Task({
    model: "haiku",
    run_in_background: true,
    prompt: buildFormatWatcherPrompt(contract)
  }));
}

// ... similar for other watchers
```

### Progress Monitoring

```
WHILE any agent status != "complete":
  1. Read progress files:
     - .claude/progress/{ID}/domain.json
     - .claude/progress/{ID}/ui.json
     - .claude/progress/{ID}/data.json

  2. Read watcher reports:
     - .claude/qa/{ID}/format-watcher.json
     - .claude/qa/{ID}/lint-watcher.json
     - .claude/qa/{ID}/test-watcher.json
     - .claude/qa/{ID}/security-watcher.json

  3. Update display

  4. Handle blockers/change requests

  5. Check for stale agents (no update in 3+ min)
```

### Progress Display

```
+======================================================================+
|  PARALLEL IMPLEMENTATION                                             |
|  Feature: AUTH-001 - User Login                                      |
+======================================================================+

┌─ Domain Agent (opus) ──────────┐ ┌─ UI Agent (sonnet) ────────────────┐
│ [==============    ] 70%        │ │ [==================  ] 90%          │
│ Criteria: 1/2 complete          │ │ Criteria: 2/2 complete              │
│ Tests: 5 pass, 1 fail           │ │ Tests: 8 pass, 0 fail               │
│ Current: AC-2 implementation    │ │ Status: WAITING AT SYNC             │
│ Last update: 30s ago            │ │ Last update: 1m ago                 │
└─────────────────────────────────┘ └─────────────────────────────────────┘

┌─ Data Agent (sonnet) ──────────┐
│ [====================] 100%     │
│ Migrations: 1 applied           │
│ Status: COMPLETE                │
└─────────────────────────────────┘

QA WATCHERS (background)
┌─────────────────────────────────────────────────────────────────────┐
│ format: 0 issues  │ lint: 2 warnings  │ test: 1 fail  │ sec: 0     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Sync Point

When all implementation agents signal complete:

```
+---------------------------------------------------------------------+
|  SYNC POINT: Implementation Complete                                 |
|                                                                      |
|  Domain Agent: COMPLETE (2/2 criteria)                               |
|  UI Agent: COMPLETE (2/2 criteria)                                   |
|  Data Agent: COMPLETE (migrations applied)                           |
|                                                                      |
|  Watcher Summary:                                                    |
|    format-watcher: 0 issues                                          |
|    lint-watcher: 2 warnings (non-blocking)                           |
|    test-watcher: 14 passing, 0 failing                               |
|    security-watcher: 0 issues                                        |
|                                                                      |
|  Contract Compliance:                                                |
|    [OK] All domain criteria implemented                              |
|    [OK] All UI criteria implemented                                  |
|    [OK] Data shapes match                                            |
|                                                                      |
|  Status: PASSED - Ready for Integration                              |
+---------------------------------------------------------------------+
```

---

## Phase 2: Integration

### API Agent Spawning

```typescript
// After sync point passes
Task({
  subagent_type: "general-purpose",
  model: "opus",
  run_in_background: true,
  prompt: buildAPIAgentPrompt(contract, {
    domainImplementation: readDomainFiles(),
    uiImplementation: readUIFiles()
  })
});
```

### Integration Gate

At end of integration:

```
+---------------------------------------------------------------------+
|  INTEGRATION GATE                                                    |
|                                                                      |
|  API Agent: COMPLETE                                                 |
|    - LiveView handlers created                                       |
|    - All bindings wired                                              |
|    - Error flows verified                                            |
|                                                                      |
|  Integration Tests: 3 passing, 0 failing                             |
|  E2E Tests: 1 passing, 0 failing                                     |
|                                                                      |
|  WATCHER ISSUES NOW BLOCKING:                                        |
|    [OK] format-watcher: 0 issues                                     |
|    [WARN] lint-watcher: 2 warnings - must resolve                    |
|    [OK] test-watcher: all passing                                    |
|    [OK] security-watcher: 0 issues                                   |
|                                                                      |
|  Status: BLOCKED - Resolve lint warnings before proceeding           |
+---------------------------------------------------------------------+
```

---

## Phase 3: Validation

### Quality Aggregation

Combine all watcher reports:

```json
{
  "feature_id": "AUTH-001",
  "validation_summary": {
    "format": { "status": "pass", "issues": 0 },
    "lint": { "status": "pass", "issues": 0 },
    "test": { "status": "pass", "passing": 18, "failing": 0 },
    "security": { "status": "pass", "issues": 0 }
  },
  "quality_score": 4.5,
  "coverage": {
    "new_code": 92,
    "threshold": 80
  },
  "ready_for_pr": true
}
```

### Final Gate

```
+---------------------------------------------------------------------+
|  FINAL VALIDATION GATE                                               |
|                                                                      |
|  All Criteria:                                                       |
|    domain-agent: 2/2 [OK]                                            |
|    ui-agent: 2/2 [OK]                                                |
|    api-agent: 1/1 [OK]                                               |
|    e2e: 1/1 [OK]                                                     |
|                                                                      |
|  Test Summary:                                                       |
|    Backend: 10 passing, 0 failing                                    |
|    Frontend: 8 passing, 0 failing                                    |
|    Integration: 3 passing, 0 failing                                 |
|    E2E: 1 passing, 0 failing                                         |
|                                                                      |
|  Quality Score: 4.5/5.0                                              |
|  Coverage (new code): 92%                                            |
|                                                                      |
|  Watcher Reports: All clear                                          |
|                                                                      |
|  Status: PASSED - Ready for PR                                       |
|                                                                      |
|  [p] Create PR  [r] Review details  [a] Archive feature              |
+---------------------------------------------------------------------+
```

---

## Phase 4: Polish & Enhancement

After validation passes, run proactive quality checks for suggestions.

### Trigger

```
Phase 3: VALIDATION
└── GATE: PASSED
        ↓
Phase 4: POLISH (automatic)
├── Spawn polish-watcher (sonnet)
├── Run proactive checks (CSS, LiveView, Ash, A11y, Perf)
├── Generate suggestions report
├── Display polish score
└── User choice: auto-fix, view, skip, or create PR

Gate: NON-BLOCKING (suggestions only)
```

### Polish Watcher Spawning

```typescript
// After validation passes
if (validationResult.ready_for_pr) {
  Task({
    subagent_type: "general-purpose",
    model: "sonnet",
    run_in_background: true,
    prompt: buildPolishWatcherPrompt(contract, {
      fixSessions: loadFixSessions(featureId)
    })
  });
}
```

### Check Categories

| Category | Checks |
|----------|--------|
| **CSS/Layout** | Touch targets 44px, design tokens (no raw colors), spacing grid |
| **LiveView** | All contract bindings wired, socket prop passed, error flows tested |
| **Ash Domain** | All error codes handled, policies applied, edge cases covered |
| **Accessibility** | ARIA labels, keyboard nav, focus visible, error announcements |
| **Performance** | No N+1 queries, component size <500 LOC, efficient stores |

### Display Format

```
+======================================================================+
|  PHASE 4: POLISH                                                      |
+======================================================================+

CSS/Layout:     [✓] 4.0/5.0  (1 suggestion)
LiveView:       [✓] 5.0/5.0
Ash Domain:     [✓] 5.0/5.0
Accessibility:  [~] 4.0/5.0  (2 suggestions)
Performance:    [✓] 5.0/5.0

Polish Score: 4.5/5.0
Suggestions: 3 (3 auto-fixable)

[a] Auto-fix all  [v] View suggestions  [s] Skip  [Enter] Create PR
```

### Auto-Fix Behavior

When user selects auto-fix:

1. Apply changes for each auto-fixable suggestion
2. Run quick verification (related tests only)
3. Update polish report
4. Show updated score

```
+---------------------------------------------------------------------+
|  AUTO-FIX APPLIED                                                    |
|                                                                      |
|  Fixed 3 suggestions:                                                |
|    ✓ Button touch target → 44px                                      |
|    ✓ Added aria-label to email input                                 |
|    ✓ Added :focus-visible to submit button                           |
|                                                                      |
|  Quick verify: 3/3 tests passing                                     |
|  New Polish Score: 5.0/5.0                                           |
|                                                                      |
|  [Enter] Create PR  [v] View changes  [r] Revert                     |
+---------------------------------------------------------------------+
```

### Integration with /vibe fix

Polish suggestions can be routed to `/vibe fix` for targeted fixing:

```
Polish detected 3 issues. Fix now?
  1. [ui] Button touch target 40px (should be 44px)
  2. [a11y] Missing ARIA label on input
  3. [a11y] Focus not visible on submit

[1-3] Fix specific  [a] Fix all  [s] Skip to PR
```

Selecting an issue creates a fix session with pre-filled context.

---

## Change Request Handling

When an agent requests contract change:

### Minor Change (Auto-approve)

```
+---------------------------------------------------------------------+
|  CONTRACT CHANGE: AUTO-APPROVED                                      |
|                                                                      |
|  Change: Add optional 'remember_me' field to LoginCredentials        |
|  Requested by: ui-agent                                              |
|  Type: additive (non-breaking)                                       |
|                                                                      |
|  Applied to contract v2                                              |
|  Notified: domain-agent, api-agent                                   |
+---------------------------------------------------------------------+
```

### Breaking Change (Requires Approval)

```
+---------------------------------------------------------------------+
|  CONTRACT CHANGE: REQUIRES APPROVAL                                  |
|                                                                      |
|  Change: Add required 'captcha' field to authenticate action         |
|  Requested by: domain-agent                                          |
|  Type: breaking (affects UI, API)                                    |
|                                                                      |
|  Impact:                                                             |
|    - ui-agent: Must add captcha component                            |
|    - api-agent: Must wire captcha validation                         |
|                                                                      |
|  [a] Approve  [r] Reject  [d] Discuss                                |
+---------------------------------------------------------------------+
```

---

## Blocker Handling

When an agent reports blocked:

```
+---------------------------------------------------------------------+
|  AGENT BLOCKED                                                       |
|                                                                      |
|  Agent: domain-agent                                                 |
|  Reason: "Cannot implement AC-2 - missing user factory"              |
|                                                                      |
|  Blocker Details:                                                    |
|    Test requires insert(:user) but factory doesn't exist             |
|    Need: test/support/factory.ex with user factory                   |
|                                                                      |
|  Options:                                                            |
|    [c] Create factory (orchestrator action)                          |
|    [r] Reassign to data-agent                                        |
|    [m] Manual intervention                                           |
+---------------------------------------------------------------------+
```

---

## Quick Mode

For simple tasks, skip parallel complexity:

```typescript
// --quick mode
Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  run_in_background: false,
  prompt: buildQuickModePrompt(featureSpec)
});

// Single agent handles all:
// 1. Write test
// 2. Implement
// 3. Verify
// 4. Done
```

---

## Solo Mode (Legacy)

Sequential role-switching (backward compatible):

```
/vibe [ID] --solo

PHASE 1: QA Engineer → Write tests
PHASE 2: Designer → UX verification
PHASE 3: Developer → TDD implementation
PHASE 4: QA Validation → Final checks
```

---

## Complexity Detection

Auto-detect when to suggest modes:

```typescript
function detectComplexity(spec) {
  const criteria = spec.acceptance_criteria.length;
  const components = spec.ui_components?.length || 0;
  const domains = spec.domains?.length || 0;

  if (criteria <= 2 && components <= 1) {
    return "quick";  // Suggest --quick
  } else if (criteria >= 5 || domains >= 2) {
    return "parallel";  // Default parallel
  } else {
    return "parallel";  // Default parallel
  }
}
```

```
+---------------------------------------------------------------------+
|  COMPLEXITY ANALYSIS                                                 |
|                                                                      |
|  Feature: AUTH-001 - User Login                                      |
|  Criteria: 5                                                         |
|  Components: 1                                                       |
|  Domains: 1                                                          |
|                                                                      |
|  Recommended: parallel (default)                                     |
|                                                                      |
|  [Enter] Use parallel  [q] Use --quick  [s] Use --solo               |
+---------------------------------------------------------------------+
```

---

## Quality Checklist

Orchestrator responsibilities:

- [ ] Contract generated with valid agent_assignments
- [ ] All criteria assigned to appropriate agents
- [ ] No file ownership conflicts
- [ ] Progress files created and monitored
- [ ] Watcher reports aggregated
- [ ] Sync point enforced
- [ ] Gates enforced
- [ ] Quality score calculated
- [ ] PR ready with full summary
