# Check Command

> `/vibe check <PR_URL|PR_NUMBER>` - Standalone PR verification in isolated worktree

---

## Purpose

Run comprehensive verification on a PR in an isolated git worktree:
- Verify PRs without affecting current work
- Run backend and frontend checks in parallel
- Enforce best practices and detect anti-patterns
- Generate detailed PR review comments
- Keep user's working directory clean

**Use `/vibe check` when:**
- Reviewing someone else's PR
- Verifying your own PR before merge
- Running comprehensive checks without interrupting development
- Generating structured feedback for PR authors

---

## Usage

```bash
/vibe check <PR_URL>                    # Full URL: https://github.com/owner/repo/pull/123
/vibe check <PR_NUMBER>                 # Just number (uses current repo)
/vibe check <PR_URL> --no-comment       # Run checks only, skip comment generation
/vibe check <PR_URL> --no-design-system # Skip design system policer (for projects without design tokens)
/vibe check --cleanup                   # Remove the persistent worktree
```

---

## Workflow Overview

```
+======================================================================+
|  /vibe check <PR_URL>                                                 |
|                                                                       |
|  PHASE 1: SETUP      - Parse PR, switch worktree to PR branch         |
|  PHASE 2: VERIFY     - Spawn parallel agents (backend + frontend)     |
|                        + quality policers (best practices, anti-pattern)|
|                        + design system policer                         |
|  PHASE 3: COLLECT    - Aggregate all agent reports                    |
|  PHASE 4: REVIEW     - Present findings, user confirmation            |
|  PHASE 5: COMMENT    - Generate PR comment, user posts it             |
+======================================================================+
```

---

## Agent Architecture

### Parallel Agent Spawning

All verification agents spawn in a single message with multiple Task calls:

```
PHASE 2: VERIFY (all spawn in parallel)
├── backend-checker        (haiku, ~15k ctx)  ─┐
├── frontend-checker       (haiku, ~15k ctx)  ─┼─> Run simultaneously
├── best-practices         (haiku, ~15k ctx)  ─┤
├── anti-pattern           (haiku, ~15k ctx)  ─┤
├── code-smell-detector    (haiku, ~10k ctx)  ─┤
└── design-system-policer  (haiku, ~15k ctx)  ─┘
```

### Model Selection

| Agent | Model | Context | Rationale |
|-------|-------|---------|-----------|
| **backend-checker** | `haiku` | ~15k | Pattern matching, command execution |
| **frontend-checker** | `haiku` | ~15k | Pattern matching, command execution |
| **best-practices-policer** | `haiku` | ~15k | Rule-based pattern matching |
| **anti-pattern-detector** | `haiku` | ~15k | Rule-based detection |
| **code-smell-detector** | `haiku` | ~10k | Simple grep patterns |
| **design-system-policer** | `haiku` | ~15k | Token matching against design spec |

**Why haiku for all?** These are pattern-matching tasks against known rules. No deep reasoning needed. Saves cost and runs faster.

---

## Phase 1: SETUP

### Parse PR Input

Accept URL or number:

```bash
# Parse PR info
gh pr view {PR_NUMBER} --json headRefName,number,title,headRepositoryOwner,isCrossRepository,url
```

### Persistent Worktree (Reused Across Reviews)

Uses a single persistent worktree at `../pr-check`. Created once, reused for all PR reviews.

```
+======================================================================+
|  PR CHECK SETUP                                                       |
|  PR #123: Add user authentication                                     |
+======================================================================+

Fetching PR info...
  Branch: feature/auth-001-integration
  Author: contributor
  Type: Same-repo PR

Switching worktree to PR branch...
```

**Worktree path (always the same):**
```bash
WORKTREE_PATH="../pr-check"
```

**First time (worktree doesn't exist):**
```bash
git fetch origin {BRANCH_NAME}
git worktree add $WORKTREE_PATH origin/{BRANCH_NAME}
```

**Subsequent reviews (worktree exists, switch branch):**
```bash
cd $WORKTREE_PATH
git fetch origin {BRANCH_NAME}
git checkout {BRANCH_NAME}
git reset --hard origin/{BRANCH_NAME}
cd -
```

**For fork PR (first time seeing this fork):**
```bash
# Add remote if not exists
git remote add fork-{FORK_OWNER} https://github.com/{FORK_OWNER}/{REPO}.git 2>/dev/null || true
git fetch fork-{FORK_OWNER} {BRANCH_NAME}

# Switch branch in worktree
cd $WORKTREE_PATH
git checkout -B {BRANCH_NAME} fork-{FORK_OWNER}/{BRANCH_NAME}
cd -
```

### Install Dependencies

Sequential (required before parallel checks):

```bash
cd $WORKTREE_PATH
mix deps.get && mix compile
cd assets && npm ci
```

```
Installing dependencies...
  mix deps.get ✓
  mix compile ✓
  npm ci ✓

Ready to verify.
```

### Validate Design System File (Hard Requirement)

Before spawning verification agents, check for the design system spec:

```bash
# Check if design-system.md exists (unless --no-design-system flag)
DESIGN_SYSTEM_PATH="${WORKTREE_PATH}/{{paths.design_system:-architecture/design-system.md}}"

if [ ! -f "$DESIGN_SYSTEM_PATH" ]; then
  # BLOCK - Cannot proceed without design system spec
  exit_with_error "Design system file required"
fi
```

**Error Display When Missing:**

```
+======================================================================+
|  PR CHECK BLOCKED                                                     |
|  Missing required file: architecture/design-system.md                 |
+======================================================================+

The design system specification file is required for verification.

To fix:
  1. Copy template:
     cp ~/.claude/vibe-ash-svelte/templates/design-system-template.md \
        architecture/design-system.md

  2. Customize with your project's tokens:
     - OKLCH color palette
     - Spacing scale
     - Typography scale
     - Component sizes

  3. Commit the file to your branch

Then re-run: /vibe check {PR_NUMBER}

Or skip design system checks: /vibe check {PR_NUMBER} --no-design-system
```

**Skip Option:**

With `--no-design-system` flag, the design-system-policer agent is skipped. Other 5 agents still run.

---

## Phase 2: VERIFY (Parallel Agents)

**Spawn ALL agents in a single message with multiple Task calls:**

```typescript
// Single message, 6 parallel Task calls
Task({ subagent_type: "general-purpose", model: "haiku", run_in_background: true,
       prompt: "BACKEND CHECKER: Run in {WORKTREE_PATH}..." })
Task({ subagent_type: "general-purpose", model: "haiku", run_in_background: true,
       prompt: "FRONTEND CHECKER: Run in {WORKTREE_PATH}..." })
Task({ subagent_type: "general-purpose", model: "haiku", run_in_background: true,
       prompt: "BEST PRACTICES POLICER: Check {WORKTREE_PATH}..." })
Task({ subagent_type: "general-purpose", model: "haiku", run_in_background: true,
       prompt: "ANTI-PATTERN DETECTOR: Scan {WORKTREE_PATH}..." })
Task({ subagent_type: "general-purpose", model: "haiku", run_in_background: true,
       prompt: "CODE SMELL DETECTOR: Scan {WORKTREE_PATH}..." })
Task({ subagent_type: "general-purpose", model: "haiku", run_in_background: true,
       prompt: "DESIGN SYSTEM POLICER: Validate {WORKTREE_PATH}..." })  // NEW
```

```
+======================================================================+
|  RUNNING VERIFICATION                                                 |
|  6 agents spawned in parallel                                         |
+======================================================================+

┌─────────────────────────────────────────────────────────────────────┐
│ backend-checker    [running...]                                      │
│ frontend-checker   [running...]                                      │
│ best-practices     [running...]                                      │
│ anti-pattern       [running...]                                      │
│ code-smell         [running...]                                      │
│ design-system      [running...]                                      │
└─────────────────────────────────────────────────────────────────────┘

You can continue working in your main worktree.
Agents will complete in background.
```

### Backend Checker Agent

**Prompt:**
```
You are the Backend Checker for PR #{PR_NUMBER}.

RESPONSIBILITY: Run all backend verification in {WORKTREE_PATH}

COMMANDS (run sequentially):
1. cd {WORKTREE_PATH} && mix format --check-formatted
2. cd {WORKTREE_PATH} && mix credo --strict
3. cd {WORKTREE_PATH} && mix compile --warnings-as-errors
4. cd {WORKTREE_PATH} && mix test
5. cd {WORKTREE_PATH} && mix sobelow --config (if sobelow installed)
6. cd {WORKTREE_PATH} && mix deps.audit (if deps_audit installed)

For each command:
- Record exit code (0 = pass, non-zero = fail)
- Capture all output
- Parse issues with file paths and line numbers

OUTPUT: Write JSON report to {WORKTREE_PATH}/.claude/check-reports/backend.json

SCHEMA:
{
  "checker": "backend",
  "checks": [
    {
      "tool": "mix format",
      "status": "pass|fail",
      "issues": [
        {"file": "path", "line": N, "message": "...", "severity": "error|warning"}
      ]
    }
  ],
  "summary": {
    "total_checks": N,
    "passed": N,
    "failed": N,
    "total_issues": N,
    "blockers": N,
    "warnings": N
  }
}

Create the .claude/check-reports directory if it doesn't exist.
```

### Frontend Checker Agent

**Prompt:**
```
You are the Frontend Checker for PR #{PR_NUMBER}.

RESPONSIBILITY: Run all frontend verification in {WORKTREE_PATH}/assets

COMMANDS (run sequentially):
1. cd {WORKTREE_PATH}/assets && npm run format:check (or npx prettier --check .)
2. cd {WORKTREE_PATH}/assets && npm run lint (or npx eslint .)
3. cd {WORKTREE_PATH}/assets && npm run check (svelte-check)
4. cd {WORKTREE_PATH}/assets && npx tsc --noEmit
5. cd {WORKTREE_PATH}/assets && npm test -- --run
6. cd {WORKTREE_PATH}/assets && npm audit --json

For each command:
- Record exit code (0 = pass, non-zero = fail)
- Capture all output
- Parse issues with file paths and line numbers

OUTPUT: Write JSON report to {WORKTREE_PATH}/.claude/check-reports/frontend.json

SCHEMA:
{
  "checker": "frontend",
  "checks": [
    {
      "tool": "eslint",
      "status": "pass|fail",
      "issues": [
        {"file": "path", "line": N, "message": "...", "severity": "error|warning", "rule": "rule-name"}
      ]
    }
  ],
  "summary": {
    "total_checks": N,
    "passed": N,
    "failed": N,
    "total_issues": N,
    "blockers": N,
    "warnings": N
  }
}

Create the .claude/check-reports directory if it doesn't exist.
```

### Best Practices Policer Agent

**Prompt:**
```
You are the Best Practices Policer for PR #{PR_NUMBER}.

RESPONSIBILITY: Enforce coding standards in {WORKTREE_PATH}

CATEGORIES TO CHECK:

1. ash_patterns:
   - Resources use `Ash.Resource` macro with domain
   - Actions have proper arguments and returns
   - Public actions have `authorize? true`
   - Sensitive data has field policies

2. svelte_patterns:
   - Use $state, $derived, $effect (NOT legacy export let, $:)
   - $effect with subscriptions returns cleanup function
   - Components use $props() not `export let`
   - Dynamic content uses {@render} with snippets

3. phoenix_patterns:
   - mount/3 assigns only required initial state
   - handle_event/3 validates params
   - Subscribe in mount, handle in handle_info/2

4. design_system:
   - No raw colors (#fff, rgb()) - use var(--color-*)
   - Use --spacing-* variables, not arbitrary px values
   - Use --font-* tokens, not raw font declarations
   - Use --z-* tokens, not raw z-index numbers

5. accessibility:
   - Interactive elements have accessible names (ARIA)
   - Form inputs have associated labels
   - Images have alt attributes
   - Focus visible on interactive elements

DETECTION COMMANDS:
```bash
# Legacy Svelte syntax
grep -r "export let " {WORKTREE_PATH}/assets/svelte/**/*.svelte
grep -r "\$:" {WORKTREE_PATH}/assets/svelte/**/*.svelte

# Raw colors
grep -rE "(color|background|border):\s*#" {WORKTREE_PATH}/assets/svelte/
grep -rE "rgb\(|rgba\(|hsl\(" {WORKTREE_PATH}/assets/svelte/

# Missing authorize
grep -rn "create\s\+:" {WORKTREE_PATH}/lib/ | grep -v "authorize"
```

OUTPUT: Write JSON report to {WORKTREE_PATH}/.claude/check-reports/best-practices.json

SCHEMA:
{
  "policer": "best-practices",
  "violations": [
    {
      "id": "BP-001",
      "category": "svelte_patterns|ash_patterns|phoenix_patterns|design_system|accessibility",
      "rule": "rule_name",
      "severity": "blocker|warning|info",
      "file": "path",
      "line": N,
      "message": "description",
      "current": "current code",
      "expected": "expected code",
      "auto_fixable": true|false
    }
  ],
  "summary": {
    "total_violations": N,
    "blockers": N,
    "warnings": N,
    "by_category": {"svelte_patterns": N, "ash_patterns": N, ...}
  }
}
```

### Anti-Pattern Detector Agent

**Prompt:**
```
You are the Anti-Pattern Detector for PR #{PR_NUMBER}.

RESPONSIBILITY: Detect anti-patterns in {WORKTREE_PATH}

CATEGORIES TO CHECK:

1. architecture_violations:
   - Breaking vertical slice (domain A calling domain B directly)
   - Wrong layer access (LiveView calling Repo directly)
   - Shared mutable state outside defined stores

2. performance_anti_patterns:
   - N+1 queries (Enum.map with Ash/Repo call inside)
   - Unbounded lists (Ash.read! without limit)
   - Memory leaks (event listeners without cleanup)
   - Large payloads (serializing entire records)

3. security_anti_patterns:
   - SQL injection (raw SQL with interpolation)
   - XSS vulnerabilities ({@html} with user input)
   - Hardcoded secrets (api_key, password in code)
   - Missing authorization on data access

4. ux_anti_patterns:
   - Spinners over skeletons (Loading..., animate-spin)
   - Missing empty states (conditional without else)
   - Missing error states (await without try/catch)

DETECTION COMMANDS:
```bash
# N+1 queries
grep -rn "Enum.map.*Ash\." {WORKTREE_PATH}/lib/
grep -rn "for.*<-.*do.*Ash\." {WORKTREE_PATH}/lib/

# Unbounded reads
grep -rn "Ash.read!" {WORKTREE_PATH}/lib/ | grep -v "limit:"

# Hardcoded secrets
grep -rn "api_key\|password\|secret" --include="*.ex" --include="*.ts" {WORKTREE_PATH}/lib/ {WORKTREE_PATH}/assets/

# Dangerous HTML
grep -rn "{@html" {WORKTREE_PATH}/assets/svelte/

# Spinners
grep -rn "Loading\.\.\.\|spinner\|animate-spin" {WORKTREE_PATH}/assets/
```

Load project-specific pitfalls from {WORKTREE_PATH}/.claude/pitfalls.json if it exists.

OUTPUT: Write JSON report to {WORKTREE_PATH}/.claude/check-reports/anti-patterns.json

SCHEMA:
{
  "detector": "anti-pattern",
  "violations": [
    {
      "id": "AP-001",
      "category": "architecture_violations|performance_anti_patterns|security_anti_patterns|ux_anti_patterns|project_specific",
      "pattern": "pattern_name",
      "severity": "blocker|warning",
      "file": "path",
      "line": N,
      "message": "description",
      "code_snippet": "problematic code",
      "fix": {
        "description": "how to fix",
        "example": "example fix code"
      },
      "auto_fixable": true|false
    }
  ],
  "summary": {
    "total_violations": N,
    "blockers": N,
    "warnings": N,
    "by_category": {...}
  }
}
```

### Code Smell Detector Agent

**Prompt:**
```
You are the Code Smell Detector for PR #{PR_NUMBER}.

RESPONSIBILITY: Detect code smells in {WORKTREE_PATH}

CHECKS:
1. Long functions (>50 lines)
2. Deep nesting (>3 levels of indentation)
3. Magic numbers/strings (unexplained literals)
4. Dead code (unused functions/variables)
5. TODO/FIXME/HACK comments
6. Debug statements left in code:
   - console.log
   - IO.inspect
   - dbg()
   - Logger.debug (in production paths)
7. Duplicated code blocks (similar patterns repeated)

DETECTION COMMANDS:
```bash
# TODO/FIXME/HACK
grep -rn "TODO\|FIXME\|HACK" {WORKTREE_PATH}/lib/ {WORKTREE_PATH}/assets/

# Debug statements
grep -rn "console\.log\|IO\.inspect\|dbg()" {WORKTREE_PATH}/lib/ {WORKTREE_PATH}/assets/

# Long files (indicator of long functions)
wc -l {WORKTREE_PATH}/lib/**/*.ex {WORKTREE_PATH}/assets/**/*.svelte | sort -n
```

For function length and nesting, read files and analyze structure.

OUTPUT: Write JSON report to {WORKTREE_PATH}/.claude/check-reports/code-smells.json

SCHEMA:
{
  "detector": "code-smell",
  "smells": [
    {
      "id": "CS-001",
      "type": "long_function|deep_nesting|magic_number|dead_code|todo_comment|debug_statement|duplication",
      "severity": "warning|info",
      "file": "path",
      "line": N,
      "message": "description",
      "details": {
        "function_name": "name",
        "line_count": N,
        "nesting_depth": N
      }
    }
  ],
  "summary": {
    "total_smells": N,
    "by_type": {"long_function": N, "todo_comment": N, ...}
  }
}
```

### Design System Policer Agent

**Prompt:**
```
You are the Design System Policer for PR #{PR_NUMBER}.

RESPONSIBILITY: Validate code against project design system tokens

SPEC FILE: {WORKTREE_PATH}/{{paths.design_system:-architecture/design-system.md}}

WORKFLOW:
1. Read and parse the design system spec file
2. Extract all token tables:
   - Colors (OKLCH values → --color-* tokens)
   - Spacing (px values → --space-* tokens)
   - Typography (font sizes → --font-* tokens)
   - Z-index layers (numbers → --z-* tokens)
   - Border radius (px values → --radius-* tokens)
3. Scan CSS/Svelte files in {WORKTREE_PATH}/assets/ for raw values
4. For each raw value found:
   - Match to appropriate token (exact, nearest, or range)
   - Record violation with file, line, current value, expected token
5. Check component sizes against mobile PWA requirements:
   - Touch targets minimum 44px
   - Safe area usage for edge layouts

DETECTION COMMANDS:
```bash
# Raw OKLCH colors
grep -rE "oklch\([^)]+\)" {WORKTREE_PATH}/assets/

# Raw RGB colors
grep -rE "rgba?\([^)]+\)" {WORKTREE_PATH}/assets/

# Raw HEX colors
grep -rE "(color|background|border):\s*#[0-9a-fA-F]+" {WORKTREE_PATH}/assets/

# Raw spacing
grep -rE "(margin|padding|gap):\s*[0-9]+px" {WORKTREE_PATH}/assets/

# Raw z-index
grep -rE "z-index:\s*[0-9]+" {WORKTREE_PATH}/assets/

# Raw font-size
grep -rE "font-size:\s*[0-9]+px" {WORKTREE_PATH}/assets/
```

SEVERITY RULES:
- blocker: Touch target violations (< 44px for interactive elements)
- warning: Raw color, spacing, typography, z-index values
- info: Border radius, line-height (lower priority)

OUTPUT: Write JSON report to {WORKTREE_PATH}/.claude/check-reports/design-system.json

SCHEMA:
{
  "policer": "design-system",
  "spec_path": "architecture/design-system.md",
  "tokens_parsed": {
    "colors": N,
    "spacing": N,
    "typography": N,
    "z_index": N
  },
  "violations": [
    {
      "id": "DS-001",
      "category": "color|spacing|typography|z-index|touch-target",
      "severity": "blocker|warning|info",
      "file": "path",
      "line": N,
      "message": "description",
      "current": "raw value found",
      "expected": "token to use",
      "token_match": {
        "token": "--color-primary",
        "value": "oklch(50% 0.12 250)"
      },
      "auto_fixable": true|false
    }
  ],
  "summary": {
    "total_violations": N,
    "blockers": N,
    "warnings": N,
    "by_category": {"color": N, "spacing": N, "typography": N, ...},
    "auto_fixable": N
  }
}

Create the .claude/check-reports directory if it doesn't exist.
```

---

## Phase 3: COLLECT

Wait for all agents to complete, then read and aggregate reports:

```typescript
// Read all report files
const backend = readJSON(`${WORKTREE_PATH}/.claude/check-reports/backend.json`);
const frontend = readJSON(`${WORKTREE_PATH}/.claude/check-reports/frontend.json`);
const bestPractices = readJSON(`${WORKTREE_PATH}/.claude/check-reports/best-practices.json`);
const antiPatterns = readJSON(`${WORKTREE_PATH}/.claude/check-reports/anti-patterns.json`);
const codeSmells = readJSON(`${WORKTREE_PATH}/.claude/check-reports/code-smells.json`);
const designSystem = readJSON(`${WORKTREE_PATH}/.claude/check-reports/design-system.json`);

// Aggregate
const aggregated = {
  pr: { number, title, branch, url },
  summary: {
    total_issues: sum of all issues,
    blockers: sum of blockers,
    warnings: sum of warnings,
    by_category: { backend, frontend, best_practices, anti_patterns, code_smells, design_system }
  },
  backend,
  frontend,
  best_practices: bestPractices,
  anti_patterns: antiPatterns,
  code_smells: codeSmells,
  design_system: designSystem
};
```

---

## Phase 4: REVIEW

Present categorized results to user:

```
+======================================================================+
|  PR CHECK RESULTS - PR #123                                           |
|  Branch: feature/auth-001-integration                                 |
+======================================================================+

SUMMARY: 15 issues (8 blockers, 7 warnings)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BACKEND (3 issues)
  [B1] mix test FAIL - test/accounts/user_test.exs:45
       validates password complexity
  [B2] mix credo WARN - lib/accounts/user.ex:1
       Missing @moduledoc
  [B3] mix sobelow WARN - lib/accounts/queries.ex:45
       SQL injection risk

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRONTEND (4 issues)
  [F1] eslint ERROR - LoginForm.svelte:12
       unused variable 'email'
  [F2] eslint ERROR - authStore.ts:8
       no-explicit-any
  [F3] npm test FAIL - LoginForm.test.ts:23
       Test assertion failed
  [F4] format WARN - 3 files need formatting

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BEST PRACTICES (3 issues)
  [BP1] BLOCKER - LoginForm.svelte:5
        legacy 'export let' → use $props()
  [BP2] BLOCKER - user.ex:78
        missing authorize? on public action
  [BP3] WARN - LoginForm.svelte:45
        raw color #3b82f6 → var(--color-primary)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANTI-PATTERNS (3 issues)
  [AP1] BLOCKER - user.ex:45
        N+1 query in Enum.map
  [AP2] WARN - UserList.svelte:23
        spinner → skeleton loader
  [AP3] BLOCKER - chat_live.ex:78
        missing socket prop (PIT-001)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CODE SMELLS (2 issues)
  [CS1] WARN - user.ex:100
        function 65 lines (max 50)
  [CS2] WARN - LoginForm.svelte:89
        TODO: fix validation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM (3 issues)
  [DS1] WARN - Button.svelte:45
        oklch(50% 0.12 250) → var(--color-primary)
  [DS2] WARN - Card.svelte:12
        margin: 12px → var(--space-3)
  [DS3] WARN - Modal.svelte:8
        z-index: 500 → var(--z-modal)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTIONS:
  [c] Generate PR comment with all issues
  [s] Select specific issues to include
  [v] View issue details (enter ID like B1, F2, BP1)
  [q] Quit (worktree preserved for next review)
```

### View Issue Details

When user enters an issue ID:

```
+---------------------------------------------------------------------+
|  ISSUE DETAILS: BP1                                                  |
+---------------------------------------------------------------------+

Category: svelte_patterns
Rule: props_usage
Severity: BLOCKER

File: assets/svelte/components/features/auth/LoginForm.svelte
Line: 5

Current:
  export let onSubmit;

Expected:
  let { onSubmit } = $props();

Auto-fixable: Yes

Why this matters:
  Svelte 5 runes ($props) provide better TypeScript support and
  clearer component contracts than legacy export let syntax.

[b] Back to summary  [n] Next issue
```

---

## Phase 5: COMMENT

Generate comprehensive PR comment:

```markdown
## PR Verification Report

**PR:** #123 - Add user authentication
**Branch:** feature/auth-001-integration
**Checked at:** 2026-02-03T10:30:00Z

### Summary

| Category | Status | Blockers | Warnings |
|----------|--------|----------|----------|
| Backend | :x: | 1 | 2 |
| Frontend | :x: | 2 | 2 |
| Best Practices | :x: | 2 | 1 |
| Anti-Patterns | :x: | 2 | 1 |
| Code Smells | :white_check_mark: | 0 | 2 |
| Design System | :white_check_mark: | 0 | 3 |

---

### Backend Issues

#### Test Failures
- [ ] **test/accounts/user_test.exs:45** - `validates password complexity`

#### Lint Warnings
- [ ] **lib/accounts/user.ex:1** - Missing @moduledoc

#### Security
- [ ] **lib/accounts/queries.ex:45** - SQL injection risk (sobelow)

---

### Frontend Issues

#### ESLint Errors
- [ ] **LoginForm.svelte:12** - unused variable 'email'
- [ ] **authStore.ts:8** - no-explicit-any

#### Test Failures
- [ ] **LoginForm.test.ts:23** - Test assertion failed

#### Formatting
- [ ] 3 files need formatting (`npm run format`)

---

### Best Practices Violations

- [ ] **LoginForm.svelte:5** - BLOCKER: legacy 'export let' → use `$props()`
- [ ] **user.ex:78** - BLOCKER: missing `authorize? true` on public action
- [ ] **LoginForm.svelte:45** - raw color `#3b82f6` → `var(--color-primary)`

---

### Anti-Patterns Detected

- [ ] **user.ex:45** - BLOCKER: N+1 query in Enum.map → preload in initial query
- [ ] **UserList.svelte:23** - spinner → skeleton loader for better UX
- [ ] **chat_live.ex:78** - BLOCKER: missing socket prop (project pitfall PIT-001)

---

### Code Smells

- [ ] **user.ex:100** - function 65 lines (max recommended: 50)
- [ ] **LoginForm.svelte:89** - TODO comment: "fix validation"

---

### Design System Violations

- [ ] **Button.svelte:45** - `oklch(50% 0.12 250)` → `var(--color-primary)`
- [ ] **Card.svelte:12** - `margin: 12px` → `var(--space-3)`
- [ ] **Modal.svelte:8** - `z-index: 500` → `var(--z-modal)`

---

<sub>Generated by `/vibe check` - [Claude Code](https://claude.ai/claude-code)</sub>
```

### User Confirmation

```
+---------------------------------------------------------------------+
|  PR COMMENT READY                                                    |
|                                                                      |
|  About to generate comment for PR #123                               |
|  Issues included: 15 (8 blockers, 7 warnings)                        |
|                                                                      |
|  [p] Preview comment                                                 |
|  [Enter] Copy to clipboard                                           |
|  [g] Post via gh CLI (gh pr comment)                                 |
|  [c] Cancel                                                          |
+---------------------------------------------------------------------+
```

**If user selects [g]:**
```bash
gh pr comment {PR_NUMBER} --body "$(cat comment.md)"
```

**Confirmation:**
```
Comment posted to PR #123.
View at: https://github.com/owner/repo/pull/123#issuecomment-{ID}
```

---

## Worktree Management

### Persistent Worktree (Default)

The worktree at `../pr-check` is **kept between reviews**. This is faster since:
- No need to recreate worktree each time
- Dependencies already installed
- Just switch branches and run checks

```
+---------------------------------------------------------------------+
|  REVIEW COMPLETE                                                     |
|                                                                      |
|  Worktree ready for next review: ../pr-check                         |
|  Current branch: feature/auth-001-integration                        |
|                                                                      |
|  To investigate manually:                                            |
|    cd ../pr-check                                                    |
+---------------------------------------------------------------------+
```

### Explicit Cleanup (--cleanup flag)

To remove the persistent worktree:

```bash
/vibe check --cleanup
```

```bash
cd {ORIGINAL_DIR}
git worktree remove ../pr-check
git worktree prune
# Remove fork remotes if any
git remote | grep "^fork-" | xargs -I {} git remote remove {}
```

```
+---------------------------------------------------------------------+
|  CLEANUP COMPLETE                                                    |
|                                                                      |
|  Removed: ../pr-check                                                |
|  Pruned worktree references                                          |
|  Removed fork remotes                                                |
+---------------------------------------------------------------------+
```

---

## Report Directory Structure

```
{WORKTREE_PATH}/.claude/check-reports/
├── backend.json
├── frontend.json
├── best-practices.json
├── anti-patterns.json
├── code-smells.json
└── design-system.json
```

---

## Anti-Patterns for This Command

- **Never run checks in user's current working directory** - Always use the persistent worktree
- **Never auto-post comments without explicit user confirmation** - Always ask first
- **Never delete worktree automatically** - Keep it for reuse, cleanup is explicit
- **Never use opus/sonnet for pattern-matching tasks** - Use haiku for all checkers
- **Never run agents sequentially when they can run in parallel** - Single message, multiple Task calls

---

## Error Handling

### PR Not Found

```
Error: PR #999 not found.

Verify:
  - PR number is correct
  - You have access to the repository
  - gh CLI is authenticated (gh auth status)
```

### Worktree Has Uncommitted Changes

```
Warning: Worktree ../pr-check has uncommitted changes.

[d] Discard changes and switch branch
[c] Cancel
```

### Dependency Install Failure

```
Error: mix deps.get failed in worktree.

This could indicate:
  - Missing Elixir/OTP version
  - Private dependency access issues

[r] Retry
[s] Skip deps, continue with checks (may fail)
[c] Cancel
```

### Agent Timeout

```
Warning: frontend-checker timed out after 5 minutes.

[r] Retry agent
[s] Skip and continue with available results
[c] Cancel
```

---

## Integration with Other Commands

### After `/vibe` Feature Development

```
/vibe AUTH-001        # Develop feature
/vibe check 123       # Verify your own PR before requesting review
```

### With `/vibe fix`

If check finds issues, user can fix them:

```
Issues found. Fix now?
  [f] Run /vibe fix to address blockers
  [c] Generate comment only
  [q] Quit
```

---

## Verification Checklist

After implementation, verify:
- [ ] Test with a real PR URL from the repo
- [ ] Verify persistent worktree created at `../pr-check` on first run
- [ ] Verify subsequent runs switch branches (no new worktree)
- [ ] Verify all 6 agents spawn in parallel (single Task message)
- [ ] Verify design-system-policer reads architecture/design-system.md
- [ ] Verify design system violations report correct token suggestions
- [ ] Verify user can continue working in main worktree during check
- [ ] Verify all reports aggregate correctly
- [ ] Test `--cleanup` flag removes worktree
- [ ] Test `--no-comment` flag skips comment generation
- [ ] Test `--no-design-system` flag skips design system policer
- [ ] Test with fork PR (cross-repository)
- [ ] Test blocking behavior when design-system.md is missing
