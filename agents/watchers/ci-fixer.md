# CI Fixer

> Monitors PR CI status and automatically fixes failures until green.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | Needs to analyze logs and reason about fixes |
| **Context Budget** | ~30k tokens | CI logs + code context + fix reasoning |
| **Max Retries** | 3 | Prevent infinite fix loops |
| **Report File** | `.claude/ci/{FEATURE-ID}/{PR-NUMBER}.json` | Fix tracking |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  run_in_background: true,
  prompt: buildCIFixerPrompt(prNumber, featureId)
})
```

---

## Responsibility

The CI Fixer:
- Monitors CI status after PR creation
- Reads failure logs from GitHub Actions
- Analyzes root cause of failures
- Applies fixes following best practices
- Commits and pushes fixes
- Re-monitors until green or max retries

**Does NOT:**
- Skip or disable tests
- Add `@skip` or `TODO` to avoid failures
- Ignore security warnings
- Make unrelated changes

---

## Trigger Points

CI Fixer spawns after PR creation at these points:

| Phase | Trigger | PRs Monitored |
|-------|---------|---------------|
| Phase 1 Sync | Stacked PRs created | data/, domain/, ui/ |
| Phase 2 Complete | API PR created | api/ |
| Phase 3 Complete | Final PR created | → main |

```
PR Created → Spawn CI Fixer → Monitor → Fix Loop → Green ✓
```

---

## CI Monitoring Flow

### Step 1: Check PR Status

```bash
# Get all checks for PR
gh pr checks {PR_NUMBER} --json name,status,conclusion,detailsUrl

# Example output:
[
  {"name": "test", "status": "completed", "conclusion": "failure", "detailsUrl": "..."},
  {"name": "lint", "status": "completed", "conclusion": "success", "detailsUrl": "..."},
  {"name": "build", "status": "in_progress", "conclusion": null, "detailsUrl": "..."}
]
```

### Step 2: Wait for All Checks

```typescript
async function waitForChecks(prNumber: number): Promise<CheckResult[]> {
  const maxWait = 10 * 60 * 1000; // 10 minutes
  const pollInterval = 30 * 1000; // 30 seconds
  const start = Date.now();

  while (Date.now() - start < maxWait) {
    const checks = await getChecks(prNumber);

    // All completed?
    if (checks.every(c => c.status === "completed")) {
      return checks;
    }

    await sleep(pollInterval);
  }

  throw new Error("CI checks timed out");
}
```

### Step 3: Identify Failures

```typescript
function identifyFailures(checks: CheckResult[]): FailedCheck[] {
  return checks
    .filter(c => c.conclusion === "failure")
    .map(c => ({
      name: c.name,
      url: c.detailsUrl,
      runId: extractRunId(c.detailsUrl)
    }));
}
```

---

## Failure Analysis Flow

### Step 1: Fetch Failure Logs

```bash
# Get failed job logs
gh run view {RUN_ID} --log-failed

# Or get specific job logs
gh api repos/{owner}/{repo}/actions/runs/{RUN_ID}/jobs \
  --jq '.jobs[] | select(.conclusion == "failure") | .id' \
  | xargs -I {} gh api repos/{owner}/{repo}/actions/jobs/{}/logs
```

### Step 2: Parse Error Output

```typescript
interface ParsedFailure {
  type: "test" | "lint" | "format" | "typecheck" | "build" | "security";
  file?: string;
  line?: number;
  message: string;
  stacktrace?: string;
  suggestion?: string;
}

function parseFailureLogs(logs: string): ParsedFailure[] {
  const failures: ParsedFailure[] = [];

  // Test failures
  const testPattern = /FAILED.*?(\S+\.exs?):(\d+)/g;
  // Lint errors
  const lintPattern = /error:.*?(\S+):(\d+):(\d+):(.*)/g;
  // TypeScript errors
  const tsPattern = /error TS\d+:.*?(\S+\.tsx?)\((\d+),(\d+)\):(.*)/g;
  // Build errors
  const buildPattern = /ERROR|error\[E\d+\]|CompileError/g;

  // ... parse and categorize

  return failures;
}
```

### Step 3: Categorize Failure Type

| Pattern | Type | Fix Strategy |
|---------|------|--------------|
| `FAILED test/` | test | Read test, understand assertion, fix code or test |
| `** (Mix)` | build | Read compile error, fix syntax/imports |
| `error:` + lint rule | lint | Apply lint fix or adjust code |
| `TS\d+:` | typecheck | Fix type annotations or code |
| `Formatting` | format | Run formatter |
| `security` | security | Address vulnerability |

---

## Fix Strategies

### Test Failures

```typescript
async function fixTestFailure(failure: ParsedFailure): Promise<Fix> {
  // 1. Read the failing test
  const testCode = await readFile(failure.file);

  // 2. Read the code being tested
  const sourceFile = inferSourceFile(failure.file);
  const sourceCode = await readFile(sourceFile);

  // 3. Analyze the failure
  const analysis = analyzeTestFailure({
    test: testCode,
    source: sourceCode,
    error: failure.message,
    stacktrace: failure.stacktrace
  });

  // 4. Determine fix location (test or source)
  if (analysis.fixLocation === "source") {
    return generateSourceFix(analysis);
  } else {
    return generateTestFix(analysis);
  }
}
```

### Lint Failures

```typescript
async function fixLintFailure(failure: ParsedFailure): Promise<Fix> {
  // Many lint issues are auto-fixable
  const autoFixResult = await exec(`mix credo --format json`);

  // For non-auto-fixable issues
  if (!autoFixResult.fixed) {
    return {
      file: failure.file,
      type: "edit",
      description: `Fix lint: ${failure.message}`,
      changes: generateLintFix(failure)
    };
  }
}
```

### Format Failures

```typescript
async function fixFormatFailure(): Promise<Fix> {
  // Format is always auto-fixable
  await exec("mix format");
  await exec("cd assets && npm run format");

  return {
    type: "command",
    description: "Auto-format code",
    commands: ["mix format", "npm run format"]
  };
}
```

### Build Failures

```typescript
async function fixBuildFailure(failure: ParsedFailure): Promise<Fix> {
  // Analyze compile error
  const analysis = analyzeBuildError(failure);

  switch (analysis.cause) {
    case "missing_import":
      return generateImportFix(analysis);
    case "undefined_function":
      return generateFunctionFix(analysis);
    case "type_mismatch":
      return generateTypeFix(analysis);
    case "syntax_error":
      return generateSyntaxFix(analysis);
    default:
      throw new Error(`Cannot auto-fix build error: ${analysis.cause}`);
  }
}
```

### TypeCheck Failures

```typescript
async function fixTypeCheckFailure(failure: ParsedFailure): Promise<Fix> {
  // Read the file with type error
  const code = await readFile(failure.file);

  // Common fixes:
  // - Add missing type annotations
  // - Fix type mismatches
  // - Add null checks
  // - Import missing types

  return generateTypeFix(code, failure);
}
```

---

## Fix Application Flow

### Step 1: Generate Fix

```typescript
const fix = await generateFix(failure);
```

### Step 2: Apply Fix

```typescript
async function applyFix(fix: Fix): Promise<void> {
  if (fix.type === "edit") {
    await editFile(fix.file, fix.changes);
  } else if (fix.type === "command") {
    for (const cmd of fix.commands) {
      await exec(cmd);
    }
  }
}
```

### Step 3: Verify Locally

```typescript
async function verifyFix(failure: ParsedFailure): Promise<boolean> {
  // Run the specific check that failed
  switch (failure.type) {
    case "test":
      return await runTest(failure.file);
    case "lint":
      return await runLint(failure.file);
    case "format":
      return await checkFormat();
    case "build":
      return await runBuild();
    case "typecheck":
      return await runTypeCheck();
  }
}
```

### Step 4: Commit and Push

```bash
# Stage changes
git add -A

# Commit with descriptive message
git commit -m "fix(ci): resolve ${FAILURE_TYPE} failure

${FAILURE_DESCRIPTION}

Fix: ${FIX_DESCRIPTION}

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

# Push to trigger new CI run
git push
```

---

## Retry Logic

```typescript
async function fixCILoop(prNumber: number, maxRetries: number = 3): Promise<CIResult> {
  let attempt = 0;

  while (attempt < maxRetries) {
    attempt++;
    console.log(`CI Fix attempt ${attempt}/${maxRetries}`);

    // Wait for checks to complete
    const checks = await waitForChecks(prNumber);

    // Check for failures
    const failures = identifyFailures(checks);

    if (failures.length === 0) {
      return { status: "success", attempts: attempt };
    }

    // Try to fix each failure
    for (const failure of failures) {
      try {
        const fix = await generateFix(failure);
        await applyFix(fix);
        await verifyFix(failure);
      } catch (e) {
        console.log(`Could not auto-fix: ${e.message}`);
        // Continue to next failure
      }
    }

    // Commit and push all fixes
    await commitAndPush(failures);

    // Wait for new CI run
    await sleep(5000);
  }

  // Max retries reached
  return {
    status: "failed",
    attempts: attempt,
    remainingFailures: await getFailures(prNumber)
  };
}
```

---

## Report Schema

Write to `.claude/ci/{FEATURE-ID}/{PR-NUMBER}.json`:

```json
{
  "feature_id": "AUTH-001",
  "pr_number": 123,
  "branch": "data/AUTH-001-models",
  "status": "success",
  "attempts": [
    {
      "number": 1,
      "started_at": "2026-02-02T10:00:00Z",
      "checks": {
        "test": "failure",
        "lint": "success",
        "build": "success"
      },
      "failures": [
        {
          "type": "test",
          "file": "test/accounts/user_test.exs",
          "line": 45,
          "message": "Expected {:ok, user}, got {:error, :not_found}",
          "fix_applied": {
            "file": "lib/accounts/resources/user.ex",
            "description": "Add email lookup to get action",
            "commit": "abc123"
          }
        }
      ],
      "completed_at": "2026-02-02T10:02:00Z"
    },
    {
      "number": 2,
      "started_at": "2026-02-02T10:03:00Z",
      "checks": {
        "test": "success",
        "lint": "success",
        "build": "success"
      },
      "failures": [],
      "completed_at": "2026-02-02T10:05:00Z"
    }
  ],
  "final_status": "success",
  "total_fixes": 1,
  "completed_at": "2026-02-02T10:05:00Z"
}
```

---

## Display Formats

### Monitoring

```
═══════════════════════════════════════════════════════════════
  CI MONITOR: PR #123 (data/AUTH-001-models)
═══════════════════════════════════════════════════════════════

Waiting for checks...
  ⏳ test       running...
  ✓  lint       passed
  ✓  build      passed
```

### Failure Detected

```
═══════════════════════════════════════════════════════════════
  CI FAILURE DETECTED (Attempt 1/3)
═══════════════════════════════════════════════════════════════

Failed check: test
  File: test/accounts/user_test.exs:45
  Error: Expected {:ok, user}, got {:error, :not_found}

Analyzing failure...
  Root cause: User.get!/1 doesn't handle email lookup
  Fix location: lib/accounts/resources/user.ex

Applying fix...
  ✓ Added get_by_email action
  ✓ Local test passes
  ✓ Committed: fix(ci): add email lookup to User resource

Pushing to trigger new CI run...
```

### Success

```
═══════════════════════════════════════════════════════════════
  CI PASSED ✓
═══════════════════════════════════════════════════════════════

PR #123: All checks passing
  ✓ test   (fixed in attempt 1)
  ✓ lint
  ✓ build

Total fixes applied: 1
Proceeding to next phase...
```

### Max Retries Reached

```
═══════════════════════════════════════════════════════════════
  CI FIX LIMIT REACHED (3/3 attempts)
═══════════════════════════════════════════════════════════════

PR #123: Still failing after 3 fix attempts

Remaining failures:
  ✗ test - test/accounts/complex_test.exs:89
    "integration test timeout"
    Could not auto-fix: Test requires external service

Fix attempts made:
  1. Added missing import (test passed, new failure)
  2. Fixed assertion syntax (test passed, new failure)
  3. Increased timeout (still failing)

**PAUSED** - Human intervention required

Options:
  [r] Retry with fresh analysis
  [s] Skip this check (not recommended)
  [m] Manual fix mode
```

---

## Best Practices Enforcement

### DO:
- Fix the actual root cause, not symptoms
- Verify fixes locally before pushing
- Use descriptive commit messages
- Preserve existing functionality
- Follow project coding standards

### DON'T:
- Skip or disable failing tests
- Add broad exception handlers
- Ignore security warnings
- Make unrelated changes
- Commit without local verification

---

## Failure Types Reference

| CI Check | Common Failures | Auto-Fix Approach |
|----------|----------------|-------------------|
| **test** | Assertion failure | Analyze expected vs actual, fix logic |
| **test** | Missing fixture | Create fixture or factory |
| **test** | Timeout | Optimize or mock slow operations |
| **lint** | Style violation | Apply formatter or fix manually |
| **lint** | Unused variable | Remove or use the variable |
| **lint** | Missing docs | Add documentation |
| **format** | Formatting diff | Run auto-formatter |
| **build** | Missing import | Add import statement |
| **build** | Undefined function | Fix typo or add function |
| **build** | Type error | Fix type annotation |
| **typecheck** | Type mismatch | Adjust types or add cast |
| **security** | Vulnerable dep | Update dependency |

---

## Integration with Orchestrator

The orchestrator:
1. Creates PR
2. Spawns CI Fixer with PR number
3. Waits for CI Fixer to report success or max retries
4. If success: proceeds to next phase
5. If max retries: PAUSES for human intervention

```typescript
// In orchestrator
const prNumber = await createPR(branch, base);

const ciResult = await Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  prompt: buildCIFixerPrompt(prNumber, featureId)
});

if (ciResult.status === "success") {
  // Continue to next phase
} else {
  // PAUSE with diagnostic summary
  displayCIFailureSummary(ciResult);
}
```

---

## Prompt Template

```
You are the CI Fixer for PR #{PR_NUMBER} ({FEATURE_ID}).

RESPONSIBILITY: Monitor CI and automatically fix failures

COMMANDS:
- Check status: gh pr checks {PR_NUMBER}
- Get logs: gh run view {RUN_ID} --log-failed
- Verify locally: mix test {file} / npm test

MAX RETRIES: 3

FIX APPROACH:
1. Parse failure logs
2. Identify root cause
3. Generate minimal fix
4. Verify locally
5. Commit with descriptive message
6. Push and re-monitor

BEST PRACTICES:
- Fix root cause, not symptoms
- Never skip or disable tests
- Preserve existing functionality
- Verify before pushing

REPORT FILE: .claude/ci/{FEATURE_ID}/{PR_NUMBER}.json

START MONITORING.
```

---

## Related

- `test-watcher.md` - Local test monitoring during development
- `lint-watcher.md` - Local lint monitoring
- `format-watcher.md` - Local format monitoring
- `../orchestrator/core.md` - Orchestrator integration
