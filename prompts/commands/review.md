# Code Review Command

> `/vibe review [scope]` - Multi-agent code review with fresh context

## Purpose

Spawn a separate review agent with fresh context to review code. Separate context often yields better review results than self-review.

## Usage

```
/vibe review                    # Review staged changes
/vibe review [FEATURE-ID]       # Review feature implementation
/vibe review --security         # Security-focused review
/vibe review --patterns         # Pattern compliance review
/vibe review --refactoring      # Include refactoring analysis
/vibe review --all              # Full review with all analyses
```

---

## Workflow

```
Scope -> Fresh Context -> Review -> Report -> Action Items
```

### Step 1: Determine Scope

```
+======================================================================+
|  REV CODE REVIEW                                                     |
|  Scope: [staged | feature | file]                                    |
+======================================================================+
```

| Scope | What's Reviewed |
|-------|-----------------|
| `staged` | `git diff --staged` |
| `[FEATURE-ID]` | All changes for feature |
| `[file-path]` | Single file |

### Step 2: Fresh Context Load

The review agent loads ONLY:
- Architecture quick reference
- Anti-patterns document
- Relevant checklists
- The code being reviewed

**Does NOT load**: Current conversation context, implementation history

### Step 3: Review Categories

```
+---------------------------------------------------------------------+
|  REVIEW IN PROGRESS                                                  |
|                                                                      |
|  Checking:                                                           |
|  [x] Code quality & idioms                                           |
|  [x] Security vulnerabilities                                        |
|  [x] Pattern compliance                                              |
|  [x] Error handling                                                  |
|  [x] Test coverage                                                   |
|  [x] UX/Accessibility                                                |
|  [ ] Performance (if --perf flag)                                    |
+---------------------------------------------------------------------+
```

---

## Review Checklist

### Code Quality
- [ ] Follows Elixir/Svelte idioms
- [ ] No magic numbers or hardcoded values
- [ ] Functions are single-purpose
- [ ] Naming reveals intent
- [ ] No commented-out code

### Security
- [ ] No hardcoded secrets
- [ ] Input validation present
- [ ] SQL injection protected (Ash handles)
- [ ] XSS prevented (Svelte handles)
- [ ] Authorization checks in place

### Pattern Compliance
- [ ] Uses design tokens (not raw colors)
- [ ] Uses motion presets (not arbitrary durations)
- [ ] Uses z-index tokens (not hardcoded)
- [ ] Follows vertical slice principle
- [ ] YAGNI respected

### Error Handling
- [ ] All Ash errors handled
- [ ] User-friendly error messages
- [ ] Errors logged appropriately
- [ ] No silent failures

### Test Coverage
- [ ] Happy path tested
- [ ] Edge cases covered
- [ ] Error states tested
- [ ] UX states tested (loading, empty)

### UX/Accessibility
- [ ] Touch targets 44px+
- [ ] aria-labels on icon buttons
- [ ] Focus management correct
- [ ] Loading states use skeletons

---

## Review Report Format

```
+---------------------------------------------------------------------+
|  REVIEW COMPLETE                                                     |
|                                                                      |
|  Scope: [what was reviewed]                                          |
|  Files: [count]                                                      |
|                                                                      |
|  BLOCKERS (must fix):                                                |
|  ! [file:line] Security: Hardcoded API key                           |
|  ! [file:line] Error handling: Unhandled {:error, _} case            |
|                                                                      |
|  WARNINGS (should fix):                                              |
|  ~ [file:line] Pattern: Raw color used, should be design token       |
|  ~ [file:line] Naming: Function name doesn't reveal intent           |
|                                                                      |
|  SUGGESTIONS (consider):                                             |
|  ? [file:line] Could extract to helper function                      |
|  ? [file:line] Consider adding edge case test                        |
|                                                                      |
|  GOOD PATTERNS FOUND:                                                |
|  + [file:line] Clean error handling pattern                          |
|  + [file:line] Good use of motion tokens                             |
|                                                                      |
|  [f] Fix blockers  [a] Accept with warnings  [d] Details             |
+---------------------------------------------------------------------+
```

---

## Review Flags

| Flag | Focus Area |
|------|------------|
| `--security` | Security vulnerabilities only |
| `--patterns` | Design pattern compliance only |
| `--perf` | Performance concerns |
| `--a11y` | Accessibility compliance |
| `--refactoring` | Refactoring analysis (code smells, tech debt) |
| `--anti-patterns` | Anti-pattern detection |
| `--all` | Full comprehensive review (default) |

---

## Refactoring Analysis Phase

When `--refactoring` or `--all` is specified, spawn the refactoring-analyzer:

```
┌─ Refactoring Analyzer (sonnet)
│   - Code smell detection
│   - Technical debt scoring
│   - Martin Fowler's refactoring catalog
│   - Specific refactoring suggestions
```

### Refactoring Findings in Report

```
+---------------------------------------------------------------------+
|  REFACTORING ANALYSIS                                                |
|                                                                      |
|  Technical Debt Score: 3.2/5.0                                       |
|                                                                      |
|  CODE SMELLS DETECTED:                                               |
|  ~ [LONG METHOD] message_handler.ex:process/2                        |
|    Lines: 45 | Complexity: 12                                        |
|    Suggestion: Extract to smaller functions                          |
|                                                                      |
|  ~ [DATA CLUMPS] (user_id, org_id, role)                             |
|    Appears 5 times across modules                                    |
|    Suggestion: Extract UserContext struct                            |
|                                                                      |
|  ? [LAZY CLASS] string_helper.ex                                     |
|    LOC: 15 | Single function                                         |
|    Suggestion: Inline or expand responsibility                       |
+---------------------------------------------------------------------+
```

---

## Anti-Pattern Detection Phase

When `--anti-patterns` or `--all` is specified, spawn the anti-pattern-detector:

```
┌─ Anti-Pattern Detector (haiku)
│   - Architecture violations
│   - Performance anti-patterns
│   - Security anti-patterns
│   - UX anti-patterns
│   - Project pitfalls check
```

### Anti-Pattern Findings in Report

```
+---------------------------------------------------------------------+
|  ANTI-PATTERN DETECTION                                              |
|                                                                      |
|  ARCHITECTURE VIOLATIONS:                                            |
|  ! [LAYER SKIP] user_live.ex:45                                      |
|    LiveView calling Repo directly                                    |
|    Fix: Use domain function instead                                  |
|                                                                      |
|  PERFORMANCE ANTI-PATTERNS:                                          |
|  ~ [UNBOUNDED LIST] user.ex:get_all/0                                |
|    Ash.read! without limit                                           |
|    Fix: Add pagination or limit                                      |
|                                                                      |
|  PROJECT PITFALLS:                                                   |
|  ! [PIT-001] chat_live.ex:78                                         |
|    Missing socket prop in LiveSvelte                                 |
|    Fix: Add socket={@socket}                                         |
+---------------------------------------------------------------------+
```

---

## Multi-Agent Pattern (AI Optimization)

**Default behavior: Spawn 3 parallel review agents for comprehensive coverage.**

```
┌─ Agent 1: Security Review
│   - OWASP top 10 checks
│   - Input validation
│   - Auth/authz verification
│   - Secrets exposure
│
├─ Agent 2: Performance Review
│   - N+1 query detection
│   - Unbounded lists
│   - Memory leaks
│   - Caching opportunities
│
└─ Agent 3: Pattern Compliance Review
│   - Architecture patterns
│   - Design tokens
│   - UX consistency
│   - Code idioms
```

**Wait for all agents → Merge findings → Present unified report**

### When to Use Single Agent

Use single-agent review when:
- Reviewing very small changes (<10 lines)
- User explicitly requests single review
- Only one concern area (e.g., `--security` flag only)

### Parallel Review Output (with Consensus Markers)

```
+---------------------------------------------------------------------+
|  PARALLEL REVIEW COMPLETE                                            |
|                                                                      |
|  Agents: 3 | Files: [count] | Findings: [total]                      |
|                                                                      |
|  MERGED FINDINGS (deduplicated, prioritized):                        |
|                                                                      |
|  BLOCKERS (must fix):                                                |
|  [AGREED] ! auth.ex:45                                               |
|    Security + Pattern: Unvalidated user input                        |
|    Confidence: 0.95 | Agents: 2/3                                    |
|                                                                      |
|  WARNINGS (should fix):                                              |
|  [MAJORITY] ~ query.ex:78                                            |
|    Performance: Potential N+1 query                                  |
|    Confidence: 0.80 | Agents: 2/3                                    |
|                                                                      |
|  [SINGLE] ~ form.svelte:112                                          |
|    Pattern: Raw color (bg-blue-500 → bg-primary)                     |
|    Confidence: 0.90 | Agents: 1/3                                    |
|                                                                      |
|  SUGGESTIONS (consider):                                             |
|  [SINGLE] ? utils.ts:25                                              |
|    Syntax: Use optional chaining                                     |
|                                                                      |
|  CONSENSUS SUMMARY:                                                  |
|  [AGREED]: 1 | [MAJORITY]: 1 | [SINGLE]: 2 | [DISPUTED]: 0           |
|                                                                      |
|  [f] Fix blockers  [a] Accept with warnings  [d] Details             |
+---------------------------------------------------------------------+
```

### Consensus Markers

| Marker | Meaning | Weight |
|--------|---------|--------|
| `[AGREED]` | All agents agree | High confidence |
| `[MAJORITY]` | Most agents agree (2/3) | Medium confidence |
| `[SINGLE]` | One agent flagged | Lower confidence |
| `[DISPUTED]` | Agents disagree | Requires user decision |

### Dispute Resolution

When `[DISPUTED]` findings exist:

```
+---------------------------------------------------------------------+
|  DISPUTED FINDING                                                    |
|                                                                      |
|  Location: store.ts:50                                               |
|                                                                      |
|  Agent A (Performance):                                              |
|    Use $derived for computed value                                   |
|    Reason: Reduces re-computation                                    |
|                                                                      |
|  Agent B (Research):                                                 |
|    Use external store                                                |
|    Reason: Industry pattern for shared state                         |
|                                                                      |
|  Architecture check: 04-frontend-components.md                       |
|  → Specifies: Use Svelte 5 $derived for computed values              |
|                                                                      |
|  Resolution: $derived (Architecture compliance)                      |
|                                                                      |
|  [a] Accept resolution  [o] Override  [s] Skip                       |
+---------------------------------------------------------------------+
```

See: `roles/multi-agent-liaison.md` for full Agent Coordination Protocol

---

## DRY Analysis Phase

> Detect code duplication and recommend extraction

### When to Run

DRY analysis runs automatically as part of comprehensive review (`--all`) or can be triggered explicitly:

```
/vibe review --dry              # DRY analysis only
/vibe review --all              # Includes DRY analysis
```

### Detection Rules

<!-- AI:DECISION_TREE dry_analysis -->
```yaml
dry_analysis:
  scan_for:
    - code_blocks_similarity: ">= 70%"
    - function_names_similar: "edit distance <= 2"
    - repeated_patterns: ">= 3 occurrences"
  thresholds:
    block:
      similarity: ">= 90%"
      lines: ">= 10"
      action: "MUST extract to shared module"
    warn:
      similarity: ">= 70%"
      lines: ">= 5"
      action: "SHOULD consider extraction"
    note:
      similarity: ">= 50%"
      lines: ">= 3"
      action: "Consider if pattern emerges"
  ignore:
    - test_fixtures
    - generated_code
    - configuration_files
```
<!-- /AI:DECISION_TREE -->

### DRY Report Format

```
+---------------------------------------------------------------------+
|  DRY ANALYSIS                                                        |
|                                                                      |
|  Scope: [files analyzed]                                             |
|                                                                      |
|  BLOCKERS (must extract):                                            |
|  ! [92% similar, 15 lines]                                           |
|    file_a.ex:45-60 <-> file_b.ex:23-38                               |
|    Recommendation: Extract to lib/shared/validator.ex                |
|                                                                      |
|  WARNINGS (should extract):                                          |
|  ~ [78% similar, 8 lines]                                            |
|    component_a.svelte:12-20 <-> component_b.svelte:8-16              |
|    Recommendation: Extract to shared component or utility            |
|                                                                      |
|  NOTES (monitor):                                                    |
|  ? [55% similar, 4 lines]                                            |
|    utils/a.ts:5-8 <-> utils/b.ts:10-13                               |
|    Note: Second occurrence, extract on third                         |
|                                                                      |
|  Rule of Three Tracking:                                             |
|  - "email validation pattern": 2 occurrences (1 more triggers refactor)
|  - "loading state handler": 3 occurrences (READY FOR EXTRACTION)     |
|                                                                      |
+---------------------------------------------------------------------+
```

### Extraction Recommendations

| Duplication Type | Extraction Target |
|------------------|-------------------|
| Elixir functions | Shared module in domain |
| Svelte logic | Utility function in `$lib/utils` |
| Svelte UI | Shared component |
| CSS patterns | Design token or utility class |
| Test setup | Shared fixture or factory |

---

## Orthogonality Analysis Phase

> Detect coupling violations and domain boundary breaches

### When to Run

```
/vibe review --orthogonality    # Orthogonality analysis only
/vibe review --all              # Includes orthogonality analysis
```

### Coupling Detection

<!-- AI:DECISION_TREE orthogonality_analysis -->
```yaml
orthogonality_analysis:
  metrics:
    coupling_score:
      description: "0 = fully decoupled, 1 = fully coupled"
      calculation: "cross_boundary_imports / total_imports"
      thresholds:
        excellent: "< 0.2"
        acceptable: "0.2 - 0.4"
        warning: "0.4 - 0.6"
        blocker: ">= 0.6"

  domain_boundaries:
    accounts:
      allowed_imports: ["Ash", "AshPostgres", "Ecto"]
      forbidden_imports: ["Projects", "Conversations", "Billing"]
      allowed_callers: ["Web", "API"]

    projects:
      allowed_imports: ["Ash", "AshPostgres", "Accounts"]
      forbidden_imports: ["Conversations", "Billing"]
      note: "May reference Accounts for ownership"

    conversations:
      allowed_imports: ["Ash", "AshPostgres", "Accounts", "Projects"]
      forbidden_imports: ["Billing"]
      note: "Messages belong to projects"

    web:
      allowed_imports: ["all domains"]
      forbidden_imports: []
      note: "Web layer can call any domain"

  violations:
    cross_domain_query:
      description: "Domain A directly queries Domain B resources"
      severity: "blocker"
      fix: "Use domain function, not direct query"

    circular_dependency:
      description: "Domain A imports B, B imports A"
      severity: "blocker"
      fix: "Extract shared concept or use events"

    leaky_abstraction:
      description: "Implementation details exposed across boundary"
      severity: "warning"
      fix: "Add proper interface function"
```
<!-- /AI:DECISION_TREE -->

### Fan-In/Fan-Out Analysis

```
+---------------------------------------------------------------------+
|  FAN ANALYSIS                                                        |
|                                                                      |
|  High Fan-Out (many dependencies):                                   |
|  ! UserController.ex: 8 dependencies                                 |
|    -> Accounts, Projects, Notifications, Billing, Reports...         |
|    Risk: Changes ripple outward, hard to test                        |
|    Suggestion: Split into focused controllers                        |
|                                                                      |
|  High Fan-In (many dependents):                                      |
|  ~ User.ex: 12 modules depend on this                                |
|    Risk: Changes break many consumers                                |
|    Suggestion: Ensure stable interface, consider versioning          |
|                                                                      |
|  Coupling Score: 0.35 (Acceptable)                                   |
|                                                                      |
+---------------------------------------------------------------------+
```

### Orthogonality Report Format

```
+---------------------------------------------------------------------+
|  ORTHOGONALITY ANALYSIS                                              |
|                                                                      |
|  Overall Coupling Score: 0.42 (Warning)                              |
|                                                                      |
|  BLOCKERS (must fix):                                                |
|  ! Cross-domain query                                                |
|    projects_live.ex:45 directly queries Accounts.User                |
|    Fix: Use Accounts.get_user/1 instead of Ash.read!                 |
|                                                                      |
|  ! Circular dependency detected                                      |
|    Accounts -> Projects -> Accounts                                  |
|    Fix: Extract shared concept or use events                         |
|                                                                      |
|  WARNINGS (should fix):                                              |
|  ~ Domain boundary violation                                         |
|    Conversations.Message imports Projects.Channel                    |
|    Suggestion: Depend on interface, not implementation               |
|                                                                      |
|  METRICS:                                                            |
|  | Domain        | Coupling | Fan-In | Fan-Out |                     |
|  |---------------|----------|--------|---------|                     |
|  | Accounts      |   0.15   |   12   |    3    |                     |
|  | Projects      |   0.38   |    8   |    5    |                     |
|  | Conversations |   0.52   |    4   |    6    |                     |
|                                                                      |
|  [f] Fix blockers  [i] Ignore with reason  [d] Details               |
+---------------------------------------------------------------------+
```

### When to Block

| Condition | Action |
|-----------|--------|
| Coupling score >= 0.6 | Block PR |
| Circular dependency | Block PR |
| Cross-domain direct query | Block PR |
| High fan-out (>6) new module | Warning, suggest split |

---

## Integration with /vibe Workflow

### During Implementation

After Developer phase, offer review:

```
DEVELOPER PHASE COMPLETE

Ready for QA validation.

[r] Quick review first  [q] Skip to QA  [Enter] Continue
```

### Before PR Creation

```
PR READY

Run code review before creating PR?

[y] Yes, review  [n] Create PR directly
```

---

## Anti-Patterns for Review

- Don't review your own code in same context (bias)
- Don't skip security review for "small" changes
- Don't ignore warnings repeatedly (fix or document why)
- Don't review without loading anti-patterns doc

---

## External Multi-Agent Review (`--multi`)

> `/vibe review --multi [FEATURE-ID]` - Get perspectives from Copilot + Codex CLI

### When to Use

| Trigger | Example |
|---------|---------|
| Multiple valid approaches | "Could use store, context, or $derived" |
| Edge cases unclear | "What happens offline?" |
| Bootstrap patterns | Foundational code that will be copied |
| Performance-critical | Different optimization strategies |

### Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. Claude adds // PERSPECTIVE: markers to complex sections     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. Generate _multi_review.md with questions for each tool      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         ↓                                         ↓
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│  3a. Copilot (Neovim)           │  │  3b. Codex CLI (Terminal)       │
│  Open files, enter insert mode  │  │  Run prompts from review file   │
│  near PERSPECTIVE markers       │  │  codex "prompt"                 │
└─────────────────────────────────┘  └─────────────────────────────────┘
         ↓                                         ↓
         └────────────────────┬────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  4. Claude evaluates all suggestions against architecture       │
│     - Apply conflict resolution priority                        │
│     - Document decisions in _multi_review.md                    │
└─────────────────────────────────────────────────────────────────┘
```

### Code Markers

Add these to flag sections for external review:

```svelte
// PERSPECTIVE: Is there a more idiomatic Svelte 5 approach?
function handleSubmit() { ... }

// PERSPECTIVE: Edge case - what if user is offline?
async function saveData() { ... }
```

### _multi_review.md Template

Generated at `{feature_dir}/_multi_review.md`:

```markdown
# Multi-Agent Review Request

## Context
Feature: {FEATURE-ID}
Files: {list of files}

## Copilot Questions (IDE Focus)
### 1. {title} ({file}:{lines})
**Question:** {specific question}
**Look for:** Syntax, idioms, edge cases

## Codex Questions (Research Focus)
### 1. {topic}
**Prompt:** codex "{prompt}"
**Why:** {rationale}

## Collected Suggestions
### From Copilot
-

### From Codex
-

## Final Decision
{Claude's evaluation}
```

### Evaluation Criteria

When Claude evaluates external suggestions:

| Priority | Rule |
|----------|------|
| 1 | Architecture docs win over all suggestions |
| 2 | Claude's reasoning wins when architecture silent |
| 3 | Simpler solution wins when reasoning equal |
| 4 | User decides when complexity equal |

### Tools Reference

| Tool | How to Use | Best For |
|------|------------|----------|
| Copilot | Neovim insert mode near markers | Syntax, Svelte idioms |
| Codex | `codex "your prompt"` | Industry research, alternatives |

See `~/.claude/vibe-ash-svelte/roles/multi-agent-liaison.md` for full protocol.

---

## Feed to Learning Agent

After review completion, findings can be fed to the learning agent:

```
+---------------------------------------------------------------------+
|  REVIEW COMPLETE                                                     |
|                                                                      |
|  Total findings: 12                                                  |
|  Blockers: 2 | Warnings: 6 | Info: 4                                 |
|                                                                      |
|  Feed findings to learning agent?                                    |
|  This will:                                                          |
|  - Analyze recurring issues for pitfall generation                   |
|  - Extract patterns from successful code                             |
|  - Update pattern success rates                                      |
|                                                                      |
|  [l] Feed to learning  [f] Fix blockers  [s] Skip                    |
+---------------------------------------------------------------------+
```

When selected:

```typescript
// Feed review findings to learning
Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  prompt: buildLearningFromReviewPrompt({
    reviewFindings: findings,
    refactoringReport: refactoringAnalysis,
    antiPatternReport: antiPatternDetection,
    scope: reviewScope
  })
});
```

The learning agent will:
1. Identify recurring issues (3+ occurrences → pitfall candidate)
2. Find successful patterns in reviewed code
3. Update pattern index with usage feedback
4. Generate pitfalls for repeated violations
