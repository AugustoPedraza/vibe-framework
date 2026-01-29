# Analyze Command

> `/vibe analyze [scope]` - On-demand refactoring and anti-pattern analysis

## Purpose

Run comprehensive code quality analysis on-demand. Combines refactoring-analyzer and anti-pattern-detector findings into a unified report with actionable suggestions.

## Usage

```
/vibe analyze                    # Analyze staged/recent changes
/vibe analyze [FEATURE-ID]       # Analyze feature implementation
/vibe analyze [path]             # Analyze specific path
/vibe analyze --all              # Full codebase analysis
```

---

## Workflow

```
Scope → Parallel Analysis → Merge Findings → Report → Action
```

---

## Step 1: Determine Scope

```
+======================================================================+
|  ANALYZE: Code Quality Analysis                                       |
|  Scope: [staged | feature | path | all]                              |
+======================================================================+
```

| Scope | What's Analyzed |
|-------|-----------------|
| `staged` | Files from `git diff --staged` |
| `[FEATURE-ID]` | All files for feature from contract |
| `[path]` | Files in specified path |
| `--all` | Full codebase (lib/, assets/) |

---

## Step 2: Parallel Analysis

Spawn analysis agents in parallel:

```
┌─ Refactoring Analyzer (sonnet)
│   - Code smell detection
│   - Technical debt scoring
│   - Refactoring suggestions
│
└─ Anti-Pattern Detector (haiku)
    - Architecture violations
    - Performance anti-patterns
    - Security anti-patterns
    - UX anti-patterns
    - Project pitfalls
```

**Agent Configuration:**
```typescript
// Spawn in parallel
const [refactoringResult, antiPatternResult] = await Promise.all([
  Task({
    subagent_type: "general-purpose",
    model: "sonnet",
    prompt: buildRefactoringAnalyzerPrompt(scope)
  }),
  Task({
    subagent_type: "general-purpose",
    model: "haiku",
    prompt: buildAntiPatternDetectorPrompt(scope)
  })
]);
```

---

## Step 3: Merge Findings

Combine reports, deduplicate, and prioritize:

```
+---------------------------------------------------------------------+
|  ANALYSIS IN PROGRESS                                                |
|                                                                      |
|  Scope: AUTH-001 implementation                                      |
|  Files: 12                                                           |
|                                                                      |
|  [====================] Refactoring Analyzer ✓                       |
|  [====================] Anti-Pattern Detector ✓                      |
|                                                                      |
|  Merging findings...                                                 |
+---------------------------------------------------------------------+
```

---

## Step 4: Combined Report

```
+======================================================================+
|  CODE QUALITY ANALYSIS REPORT                                         |
|  Scope: AUTH-001 | Files: 12 | Date: 2026-01-28                       |
+======================================================================+

OVERALL SCORES
┌─────────────────────────────────────────────────────────────────────┐
│ Technical Debt: 3.2/5.0  │ Anti-Patterns: 2 blockers  │ Smells: 4   │
└─────────────────────────────────────────────────────────────────────┘

BLOCKERS (must address)
+---------------------------------------------------------------------+
|  1. [ANTI-PATTERN] N+1 Query                                         |
|     File: lib/accounts/user.ex:45                                    |
|     Issue: Ash.read! called inside Enum.map                          |
|     Fix: Preload in initial query                                    |
|                                                                      |
|  2. [REFACTORING] God Class                                          |
|     File: lib/chat/message_handler.ex                                |
|     LOC: 650 | Responsibilities: 4                                   |
|     Fix: Extract NotificationService, ValidationService              |
+---------------------------------------------------------------------+

WARNINGS (should address)
+---------------------------------------------------------------------+
|  3. [SMELL] Long Method                                              |
|     File: lib/chat/message_handler.ex:process/2                      |
|     Lines: 45 | Complexity: 12                                       |
|     Suggestion: Extract to smaller functions                         |
|                                                                      |
|  4. [ANTI-PATTERN] Spinner over Skeleton                             |
|     File: assets/svelte/components/UserList.svelte:23                |
|     Issue: Using spinner for loading state                           |
|     Suggestion: Use skeleton loader                                  |
|                                                                      |
|  5. [SMELL] Data Clumps                                              |
|     Pattern: (user_id, org_id, role) appears 5 times                 |
|     Suggestion: Extract UserContext struct                           |
+---------------------------------------------------------------------+

INFO (consider)
+---------------------------------------------------------------------+
|  6. [SMELL] Lazy Class                                               |
|     File: lib/utils/string_helper.ex                                 |
|     LOC: 15 | Single function                                        |
|     Suggestion: Inline or expand responsibility                      |
+---------------------------------------------------------------------+

SUMMARY
┌─────────────────────────────────────────────────────────────────────┐
│ Blockers: 2  │ Warnings: 3  │ Info: 1  │ Auto-fixable: 1            │
└─────────────────────────────────────────────────────────────────────┘

[f] Fix blockers  [a] Auto-fix applicable  [v] View details
[l] Feed to learning  [e] Export report  [s] Skip
```

---

## Step 5: Actions

### Fix Blockers

Routes to `/vibe fix` with pre-filled context:

```
/vibe fix --from-analysis AUTH-001 --issue 1
```

### Auto-Fix

For auto-fixable issues:
1. Apply transformations
2. Run quick verification
3. Show diff
4. Confirm or revert

### Feed to Learning

Sends findings to continuous-learning-agent:
- Recurring issues become pitfalls
- Successful fixes become patterns
- Updates pattern success rates

---

## Report Schema

Written to `.claude/qa/{SCOPE}/analysis-report.json`:

```json
{
  "analysis": "combined",
  "scope": "AUTH-001",
  "timestamp": "2026-01-28T10:30:00Z",
  "files_analyzed": 12,
  "sources": {
    "refactoring_analyzer": ".claude/qa/AUTH-001/refactoring-analyzer.json",
    "anti_pattern_detector": ".claude/qa/AUTH-001/anti-pattern-detector.json"
  },
  "scores": {
    "technical_debt": 3.2,
    "anti_patterns": {
      "blockers": 2,
      "warnings": 1
    },
    "code_smells": 4
  },
  "findings": [
    {
      "id": "AN-001",
      "source": "anti_pattern_detector",
      "category": "performance",
      "type": "n_plus_1",
      "severity": "blocker",
      "file": "lib/accounts/user.ex",
      "line": 45,
      "message": "N+1 query detected",
      "fix": "Preload in initial query",
      "auto_fixable": false
    }
  ],
  "summary": {
    "blockers": 2,
    "warnings": 3,
    "info": 1,
    "auto_fixable": 1
  }
}
```

---

## Flags

| Flag | Description |
|------|-------------|
| `--refactoring` | Only run refactoring analysis |
| `--anti-patterns` | Only run anti-pattern detection |
| `--security` | Focus on security anti-patterns |
| `--performance` | Focus on performance issues |
| `--export` | Export report to markdown |
| `--json` | Output as JSON |

---

## Examples

### Quick Analysis

```
/vibe analyze

ANALYZE: staged changes

Scanning 3 files...

Findings:
  1 warning: Raw color in Button.svelte
  0 blockers

Quality: Good (no blockers)
```

### Feature Analysis

```
/vibe analyze AUTH-001

ANALYZE: AUTH-001 implementation

Spawning analyzers...
  [✓] Refactoring Analyzer
  [✓] Anti-Pattern Detector

Blockers: 2
Warnings: 3

[v] View full report  [f] Fix blockers
```

### Full Codebase

```
/vibe analyze --all

ANALYZE: Full codebase

Warning: This may take a while for large codebases.
Continue? [y/n]

Analyzing 156 files...
[==================== ] 95%
```

---

## Integration

### With Review Command

```
/vibe review --all  # Includes /vibe analyze automatically
```

### With Learn Command

```
/vibe analyze AUTH-001
  ↓
[l] Feed to learning
  ↓
/vibe learn AUTH-001  # Extracts patterns from fixes
```

### With Fix Command

```
/vibe analyze AUTH-001
  ↓
[f] Fix blockers
  ↓
/vibe fix --from-analysis AUTH-001 --issue 1
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Run on every save | Run periodically or before PR |
| Ignore all warnings | Address blockers, document accepted warnings |
| Skip learning step | Feed findings to improve future detection |
| Analyze without context | Load feature spec for context |
