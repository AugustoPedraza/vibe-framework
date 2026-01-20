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
| `--all` | Full comprehensive review (default) |

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
