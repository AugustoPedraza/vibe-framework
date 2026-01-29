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
├── Spawn quality policers (background)           [NEW]
│   ├── best-practices-policer (haiku)  ─┐
│   └── anti-pattern-detector  (haiku)  ─┴─> Monitor continuously
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
├── Quality policers continue monitoring
└── GATE: Watcher + policer issues become BLOCKING

PHASE 3: VALIDATION
├── Aggregate watcher reports
├── Run refactoring-analyzer (sonnet)             [NEW]
├── Include refactoring findings in report
├── Calculate quality score
├── Run final test suite
└── GATE: Must pass before Polish

PHASE 4: POLISH (automatic, non-blocking)
├── Spawn polish-watcher (sonnet)
├── Include refactoring suggestions               [NEW]
├── Run proactive checks
├── Generate suggestions
└── User choice: auto-fix, view, skip, or PR

PHASE 5: LEARNING (automatic after Phase 4)       [NEW]
├── Spawn continuous-learning-agent (sonnet)
├── Extract patterns from implementation
├── Analyze fix sessions (if any)
├── Update pattern index
├── Generate pitfalls from interventions
└── Append to learnings.md
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
7. **NEW: Create integration branch and feature docs**

### Integration Branch Setup (NEW)

```bash
# Create integration branch
git checkout main && git pull
git checkout -b feature/{ID}-integration

# Create feature documentation
mkdir -p docs/features/{ID}
```

**Generate `docs/features/{ID}/README.md`:**
```markdown
# {ID}: {Feature Title}

## Summary
{Summary extracted from feature spec}

## Acceptance Criteria
- [ ] AC-1: {criterion description}
- [ ] AC-2: {criterion description}
...

## Agent Assignments
| Agent | Scope |
|-------|-------|
| data-agent | {data scope from contract} |
| domain-agent | {domain scope from contract} |
| ui-agent | {ui scope from contract} |
| api-agent | {api scope from contract} |

## PRs
- [ ] PR 1: data/{ID}-models
- [ ] PR 2: domain/{ID}-resources
- [ ] PR 3: ui/{ID}-components
- [ ] PR 4: api/{ID}-handlers
```

**Generate `docs/features/{ID}/scenarios.md`:**
```markdown
# {ID} Scenarios

## Scenario 1: {Scenario Title}
**Given** {context}
**When** {action}
**Then** {outcome}

## Scenario 2: {Scenario Title}
...
```

**Initial commit:**
```bash
git add docs/features/{ID}/ .claude/contracts/{ID}.json
git commit -m "docs({ID}): add feature spec and scenarios for review context"
git push -u origin feature/{ID}-integration
```

### User Confirmation (PR Workflow)

```
+---------------------------------------------------------------------+
|  PHASE 0: CONTRACT                                                   |
|  Feature: {ID} - {Title}                                             |
+---------------------------------------------------------------------+

Creating integration branch: feature/{ID}-integration

Initial commit includes:
  - docs/features/{ID}/README.md (feature overview)
  - docs/features/{ID}/scenarios.md (acceptance criteria)
  - .claude/contracts/{ID}.json (agent assignments)

[c] Continue with stacked PRs (recommended)
[s] Skip stacking (single PR at end)
+---------------------------------------------------------------------+
```

### Output

```json
{
  "feature_id": "AUTH-001",
  "integration_branch": "feature/AUTH-001-integration",
  "pr_workflow": {
    "enabled": true,
    "branches": {
      "data": "data/AUTH-001-models",
      "domain": "domain/AUTH-001-resources",
      "ui": "ui/AUTH-001-components",
      "api": "api/AUTH-001-handlers"
    }
  },
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

### Quality Policer Spawning

```typescript
// Spawn quality policers in background (NEW)
const policers = [];

// Best practices policer - enforces coding standards
policers.push(Task({
  subagent_type: "general-purpose",
  model: "haiku",
  run_in_background: true,
  prompt: buildBestPracticesPolicerPrompt(contract, {
    rules: ['ash_patterns', 'svelte_patterns', 'design_system', 'accessibility']
  })
}));

// Anti-pattern detector - catches violations
policers.push(Task({
  subagent_type: "general-purpose",
  model: "haiku",
  run_in_background: true,
  prompt: buildAntiPatternDetectorPrompt(contract, {
    pitfalls: loadPitfalls('.claude/pitfalls.json')
  })
}));
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

### PR Checkpoint (After Sync Point)

If `pr_workflow.enabled` in contract, split files into agent branches and create PRs:

#### File Ownership Patterns

| Agent | File Patterns |
|-------|---------------|
| data-agent | `priv/repo/migrations/**`, `priv/repo/seeds.exs`, `priv/resource_snapshots/**` |
| domain-agent | `lib/{app}/**/resources/**`, `lib/{app}/**/actions/**`, `lib/{app}/**/*.ex` (not `_web`) |
| ui-agent | `assets/svelte/**`, `assets/css/**`, `assets/js/**` (not app.js) |
| api-agent | `lib/{app}_web/**`, `assets/js/app.js` |
| shared | `test/**`, `docs/**` → included in final PR only |

#### Branch Splitting Process

```bash
# For each layer (data, domain, ui):
for layer in data domain ui; do
  git checkout feature/{ID}-integration
  git checkout -b {layer}/{ID}-{chunk}

  # Keep only files matching layer patterns
  # (Use git filter or selective checkout based on ownership patterns)

  git push -u origin {layer}/{ID}-{chunk}

  gh pr create --base feature/{ID}-integration \
    --title "feat({layer}): {description} ({N}/M)" \
    --body "$(cat <<'EOF'
## Summary
Part of {ID} feature implementation.

## Changes
- {list of files changed}

## Reviewable as standalone
This PR contains only the {layer} layer changes and can be reviewed independently.

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
done
```

#### User Confirmation Display

```
+---------------------------------------------------------------------+
|  SYNC POINT: Parallel Implementation Complete                        |
|                                                                      |
|  Agent Work Ready for Review:                                        |
|                                                                      |
|  [1] data-agent    → data/{ID}-models                               |
|      {N} files: migrations, seeds, fixtures                          |
|      ~{X} lines                                                      |
|                                                                      |
|  [2] domain-agent  → domain/{ID}-resources                          |
|      {N} files: Ash resources, accounts                              |
|      ~{X} lines                                                      |
|                                                                      |
|  [3] ui-agent      → ui/{ID}-components                             |
|      {N} files: Svelte components, stores                            |
|      ~{X} lines                                                      |
|                                                                      |
|  [a] Create all 3 PRs → feature/{ID}-integration (recommended)      |
|  [1-3] Create specific PR only                                       |
|  [s] Skip PRs, continue to Integration                               |
+---------------------------------------------------------------------+
```

#### PR Summary Tracking

After PRs are created, update the feature README:

```bash
# Update docs/features/{ID}/README.md with PR links
sed -i 's/- \[ \] PR 1:/- [x] PR 1: #123/' docs/features/{ID}/README.md
git add docs/features/{ID}/README.md
git commit -m "docs({ID}): update PR tracking"
git push
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

### API Agent Branch Workflow

If `pr_workflow.enabled`:

```bash
# Create API branch from integration
git checkout feature/{ID}-integration
git checkout -b api/{ID}-handlers

# API agent commits here
git add lib/{app}_web/**
git commit -m "feat(api): wire LiveView handlers for {ID}"
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

### Phase 2 PR Checkpoint

After integration gate passes:

```
+---------------------------------------------------------------------+
|  PHASE 2 COMPLETE: Integration                                       |
|                                                                      |
|  [4] api-agent     → api/{ID}-handlers                              |
|      {N} files: LiveView, router                                     |
|      ~{X} lines                                                      |
|                                                                      |
|  [p] Create PR → feature/{ID}-integration                           |
|  [s] Skip, continue to Validation                                    |
+---------------------------------------------------------------------+
```

```bash
# Create API PR
git push -u origin api/{ID}-handlers

gh pr create --base feature/{ID}-integration \
  --title "feat(api): LiveView handlers for {ID} (4/4)" \
  --body "$(cat <<'EOF'
## Summary
Part of {ID} feature implementation - API/LiveView wiring.

## Changes
- LiveView modules created
- Router entries added
- Component bindings wired

## Dependencies
Requires PRs 1-3 to be merged first.

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Phase 3: Validation

### Refactoring Analysis

Run refactoring-analyzer before quality aggregation:

```typescript
// After all watchers report
const refactoringResult = await Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  prompt: buildRefactoringAnalyzerPrompt(contract, {
    files: contract.files,
    scope: featureId
  })
});

// Include in validation report
validation.refactoring = refactoringResult;
```

### Quality Aggregation

Combine all watcher reports and policer reports:

```json
{
  "feature_id": "AUTH-001",
  "validation_summary": {
    "format": { "status": "pass", "issues": 0 },
    "lint": { "status": "pass", "issues": 0 },
    "test": { "status": "pass", "passing": 18, "failing": 0 },
    "security": { "status": "pass", "issues": 0 },
    "best_practices": { "status": "pass", "blockers": 0, "warnings": 1 },
    "anti_patterns": { "status": "pass", "blockers": 0, "warnings": 0 },
    "refactoring": { "status": "info", "debt_score": 3.2, "suggestions": 2 }
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

### Phase 3 Final PR Checkpoint

If `pr_workflow.enabled`:

```
+---------------------------------------------------------------------+
|  PHASE 3 COMPLETE: Validation                                        |
|                                                                      |
|  Quality Score: 4.5/5.0                                              |
|  All tests passing                                                   |
|                                                                      |
|  Integration Branch: feature/{ID}-integration                       |
|  PRs merged: 4/4                                                     |
|    ✓ #123 data/{ID}-models                                          |
|    ✓ #124 domain/{ID}-resources                                     |
|    ✓ #125 ui/{ID}-components                                        |
|    ✓ #126 api/{ID}-handlers                                         |
|                                                                      |
|  [p] Create final PR → main                                          |
|  [w] Wait for PR reviews first                                       |
+---------------------------------------------------------------------+
```

#### Final PR Creation

```bash
# Ensure integration branch is up to date with all merged PRs
git checkout feature/{ID}-integration
git pull

# Create final PR to main
gh pr create --base main \
  --title "feat: {ID} - {feature title}" \
  --body "$(cat <<'EOF'
## Summary
{Feature description from spec}

## Changes
This PR brings together all reviewed agent work:
- ✓ #123 data/{ID}-models - Migrations, seeds
- ✓ #124 domain/{ID}-resources - Ash resources, actions
- ✓ #125 ui/{ID}-components - Svelte components, stores
- ✓ #126 api/{ID}-handlers - LiveView handlers, routing

## Quality Metrics
- Quality Score: 4.5/5.0
- Test Coverage (new code): 92%
- All watchers passing

## Acceptance Criteria
- [x] AC-1: {criterion}
- [x] AC-2: {criterion}
...

## Test Plan
- [x] All unit tests passing
- [x] All integration tests passing
- [x] E2E tests passing
- [x] Manual testing completed

---
🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

#### PR Status Tracking

The orchestrator tracks PR status in `.claude/pr-status/{ID}.json`:

```json
{
  "feature_id": "AUTH-001",
  "integration_branch": "feature/AUTH-001-integration",
  "prs": [
    {
      "number": 123,
      "branch": "data/AUTH-001-models",
      "status": "merged",
      "merged_at": "2026-01-29T10:00:00Z"
    },
    {
      "number": 124,
      "branch": "domain/AUTH-001-resources",
      "status": "merged",
      "merged_at": "2026-01-29T10:05:00Z"
    },
    {
      "number": 125,
      "branch": "ui/AUTH-001-components",
      "status": "open",
      "reviews_requested": true
    },
    {
      "number": 126,
      "branch": "api/AUTH-001-handlers",
      "status": "draft"
    }
  ],
  "final_pr": null
}
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

---

## Phase 5: Learning

### Trigger

After Phase 4 completes (PR created or skipped):

```
Phase 4: POLISH
├── Polish suggestions applied or skipped
└── PR created or skipped
        ↓
Phase 5: LEARNING (automatic)
├── Spawn continuous-learning-agent
└── Non-blocking, runs in background
```

### Learning Agent Spawning

```typescript
// After Phase 4 completes
if (phase4Complete) {
  Task({
    subagent_type: "general-purpose",
    model: "sonnet",
    run_in_background: true,
    prompt: buildContinuousLearningAgentPrompt({
      featureId: contract.feature_id,
      fixSessions: loadFixSessions(featureId),
      watcherReports: loadWatcherReports(featureId),
      refactoringReport: loadRefactoringReport(featureId),
      currentPatterns: loadPatternIndex(),
      currentPitfalls: loadPitfalls()
    })
  });
}
```

### Learning Outputs

```
+---------------------------------------------------------------------+
|  PHASE 5: LEARNING                                                   |
|                                                                      |
|  Extracting learnings from AUTH-001...                               |
|                                                                      |
|  Interventions analyzed: 2                                           |
|  Pitfalls created: 1                                                 |
|  Patterns extracted: 1 (ash-async-notification)                      |
|  Pattern feedback recorded: 2 patterns                               |
|                                                                      |
|  Files updated:                                                      |
|  * patterns/backend/ash-async-notification.md                        |
|  * patterns/index.json                                               |
|  * .claude/pitfalls.json                                             |
|  * .claude/learnings.md                                              |
|                                                                      |
|  Learning complete. Feature AUTH-001 archived.                       |
+---------------------------------------------------------------------+
```

---

## Quality Checklist

Orchestrator responsibilities:

- [ ] Contract generated with valid agent_assignments
- [ ] All criteria assigned to appropriate agents
- [ ] No file ownership conflicts
- [ ] Progress files created and monitored
- [ ] Quality policers spawned and monitoring
- [ ] Watcher reports aggregated
- [ ] Policer reports aggregated
- [ ] Refactoring analysis included
- [ ] Sync point enforced
- [ ] Gates enforced
- [ ] Quality score calculated
- [ ] PR ready with full summary
- [ ] Learning agent triggered after completion
