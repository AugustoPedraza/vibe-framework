# Multi-Agent Liaison Role

> Focus: Orchestrate multi-perspective code reviews across Claude, GitHub Copilot, and ChatGPT/Codex CLI.

---

## When to Invoke This Role

| Trigger | Example |
|---------|---------|
| Complex state management | "Could use store, context, or $derived" |
| Multiple valid approaches | "Should this be server-side or client-side?" |
| Edge cases unclear | "What happens offline? On reconnection?" |
| Bootstrap patterns | New foundational code that will be copied |
| Performance-critical code | Different optimization strategies possible |
| Integration points | API design affecting multiple systems |

### When NOT to Invoke

| Situation | Reason |
|-----------|--------|
| Simple CRUD operations | Well-established patterns |
| Minor bug fixes | Localized, no alternatives |
| Copy/style updates | No logic complexity |
| Architecture decisions | Claude alone with `{{paths.architecture}}` docs |
| Security-sensitive code | Claude's anti-pattern knowledge essential |

---

## Triple-Agent Review Protocol

```
┌─────────────────────────────────────────────────────────────────┐
│  Claude Developer Role (LEADER)                                 │
│  ├── Generates implementation following architecture            │
│  ├── Adds `// PERSPECTIVE:` markers for review points           │
│  └── Creates `_multi_review.md` with context + questions        │
└─────────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┴────────────────────┐
         ↓                                         ↓
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│  Copilot (Neovim)               │  │  Codex CLI (Terminal)           │
│  ├── Inline suggestions         │  │  ├── Alternative patterns       │
│  ├── Syntax improvements        │  │  ├── Industry best practices    │
│  ├── Edge case detection        │  │  └── Documentation review       │
│  └── Svelte 5 idioms            │  │                                 │
└─────────────────────────────────┘  └─────────────────────────────────┘
         ↓                                         ↓
         └────────────────────┬────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  Claude QA Role (EVALUATOR)                                     │
│  ├── Collects all perspectives                                  │
│  ├── Validates against architecture docs                        │
│  ├── Checks: design tokens, anti-patterns, GLOSSARY             │
│  └── Produces final merged implementation                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## What Each AI Brings

| Aspect | Claude (Leader) | Copilot (IDE) | Codex CLI (Research) |
|--------|-----------------|---------------|----------------------|
| **Context** | Full architecture, GLOSSARY | Current file + neighbors | Web + training corpus |
| **Strength** | Deep reasoning, consistency | Real-time suggestions | Industry research |
| **Weakness** | May miss IDE optimizations | Lacks architecture | Lacks your patterns |
| **Best for** | Business logic, decisions | Syntax, edge cases | Alternative approaches |
| **Invocation** | Always (leader) | Neovim insert mode | `codex "prompt"` |

---

## Code Markers

Add `// PERSPECTIVE:` comments to flag sections for multi-agent review:

```svelte
// PERSPECTIVE: Is there a more idiomatic Svelte 5 approach?
function handleSubmit() {
  // Claude's implementation
}

// PERSPECTIVE: Edge case handling - what if user is offline?
async function saveData() {
  // Claude's implementation
}

// PERSPECTIVE: Performance - should this be memoized?
$derived total = items.reduce((sum, item) => sum + item.price, 0);
```

---

## Multi-Review File Generation

When invoking `/vibe review`, generate `_multi_review.md` in the feature directory:

### Template Structure

```markdown
# Multi-Agent Review Request

## Context
Feature: {FEATURE-ID}
Files: {list of files with line numbers}
Generated: {timestamp}

---

## Copilot Questions (IDE Focus)
Open these files in Neovim and review marked `// PERSPECTIVE:` sections.

### 1. {Description} ({file}:{lines})
**Question:** {specific question for Copilot}
**Look for:** {what Copilot excels at: syntax, idioms, edge cases}

---

## Codex Questions (Research Focus)
Run via `codex "prompt"` in terminal.

### 1. {Topic}
**Prompt:** "{full prompt to run in Codex CLI}"
**Why:** {what we hope to learn}

---

## Evaluation Criteria
When Claude evaluates suggestions:
- [ ] Does suggestion follow `{{paths.architecture}}18-anti-patterns.md`?
- [ ] Does suggestion use design tokens (not raw Tailwind)?
- [ ] Does suggestion align with GLOSSARY terms?
- [ ] Is suggestion simpler than current implementation?
- [ ] Does suggestion improve testability?

## Collected Suggestions
{Fill in after getting Copilot and Codex feedback}

### From Copilot
-

### From Codex
-

## Final Decision
{Claude's evaluation and final implementation choice}
```

---

## Conflict Resolution

When AIs disagree, apply this priority:

| Priority | Decision Rule |
|----------|---------------|
| 1 | Architecture docs (`{{paths.architecture}}`) win over all |
| 2 | Claude's reasoning wins when architecture doesn't specify |
| 3 | Simpler solution wins when reasoning is equivalent |
| 4 | User decides when complexity is equivalent |

**Example:**
- Copilot suggests `Array.reduce()` for state
- Codex suggests external state library
- Claude suggests Svelte 5 `$derived`

**Resolution:** Check `{{paths.architecture}}04-frontend-components.md` → `$derived` aligns with Svelte 5 patterns → Claude wins

---

## Workflow Commands

### Start Review
```bash
# In Claude Code
/vibe review {FEATURE-ID}
```

### Copilot Review (Neovim)
```
1. Open file with PERSPECTIVE markers
2. Enter insert mode near marker (loads Copilot)
3. Review ghost text suggestions
4. Note alternatives in _multi_review.md
```

### Codex Review (Terminal)
```bash
# Run prompts from _multi_review.md
codex "What are best practices for {topic}?"
codex "Review this code for edge cases: $(cat file.svelte)"
```

### Complete Review
```bash
# In Claude Code - evaluate collected suggestions
/vibe review eval {FEATURE-ID}
```

---

## Quality Checklist

Before finalizing multi-agent review:

- [ ] All `// PERSPECTIVE:` markers have been reviewed
- [ ] Copilot suggestions collected and noted
- [ ] Codex research completed for each question
- [ ] Claude evaluated all suggestions against architecture
- [ ] Final implementation decision documented
- [ ] `_multi_review.md` updated with outcome

---

## Agent Coordination Protocol

> Structured format for agent outputs and merge resolution.

### Agent Output Format

Each agent (Claude internal, security, performance, patterns) produces:

```json
{
  "agent_id": "security|performance|patterns|syntax|research",
  "timestamp": "ISO-8601",
  "scope": {
    "files": ["path/to/file.ext"],
    "lines": "start-end"
  },
  "findings": [
    {
      "id": "F001",
      "severity": "blocker|warning|suggestion",
      "location": "path/to/file.ext:line",
      "category": "security|performance|pattern|syntax|ux",
      "issue": "Description of the issue",
      "recommendation": "What to do about it",
      "confidence": 0.95,
      "references": ["doc-path", "pattern-id"]
    }
  ],
  "summary": {
    "blockers": 1,
    "warnings": 2,
    "suggestions": 3
  }
}
```

### Merge Protocol

When multiple agents review the same code:

#### Step 1: Collect Outputs

```
Agent Outputs Received:
  - Security Agent: 2 findings (1 blocker, 1 warning)
  - Performance Agent: 1 finding (1 warning)
  - Pattern Agent: 3 findings (3 suggestions)
```

#### Step 2: Deduplicate by Location

```
Deduplication:
  - path/file.ext:45 → 2 agents flagged (Security, Pattern)
  - path/file.ext:78 → 1 agent flagged (Performance)
  - path/file.ext:112 → 1 agent flagged (Pattern)
```

#### Step 3: Prioritize

```
Priority Order:
  1. BLOCKERS (must fix before PR)
  2. WARNINGS (should fix, document if skipped)
  3. SUGGESTIONS (nice to have)

Within each level:
  - Higher confidence first
  - More agents agreeing first
```

#### Step 4: Mark Consensus

| Marker | Meaning | Agents |
|--------|---------|--------|
| `[AGREED]` | All agents agree | 3/3 or 2/2 |
| `[MAJORITY]` | Most agents agree | 2/3 |
| `[DISPUTED]` | Agents disagree | Escalate to user |
| `[SINGLE]` | Only one agent flagged | Lower confidence |

### Merged Output Format

```
+---------------------------------------------------------------------+
|  MERGED AGENT FINDINGS                                               |
|                                                                      |
|  Agents: 3 | Files: 5 | Total Findings: 6                           |
|                                                                      |
|  BLOCKERS (1):                                                       |
|  [AGREED] ! path/auth.ex:45                                          |
|    Security + Pattern: Unvalidated user input                        |
|    Confidence: 0.95                                                  |
|    Fix: Add input validation before processing                       |
|                                                                      |
|  WARNINGS (2):                                                       |
|  [MAJORITY] ~ path/query.ex:78                                       |
|    Performance: Potential N+1 query (2/3 agents)                     |
|    Confidence: 0.80                                                  |
|    Fix: Use preload or batch query                                   |
|                                                                      |
|  [SINGLE] ~ path/form.svelte:112                                     |
|    Pattern: Raw color instead of design token                        |
|    Confidence: 0.90                                                  |
|    Fix: Use bg-primary instead of bg-blue-500                        |
|                                                                      |
|  SUGGESTIONS (3):                                                    |
|  [SINGLE] ? path/utils.ts:25                                         |
|    Syntax: Could use optional chaining                               |
|                                                                      |
+---------------------------------------------------------------------+
```

### Dispute Resolution

When agents disagree (`[DISPUTED]`):

1. **Present both perspectives:**
   ```
   DISPUTED: path/store.ts:50

   Agent A (Performance): Use $derived for computed value
   Agent B (Research): Industry pattern suggests store

   Architecture says: Check 04-frontend-components.md
   ```

2. **Apply resolution priority:**
   | Priority | Rule |
   |----------|------|
   | 1 | Architecture docs win |
   | 2 | Claude reasoning when docs silent |
   | 3 | Simpler solution when equal |
   | 4 | User decides |

3. **Document decision:**
   ```
   Resolution: $derived (Architecture doc 04 specifies Svelte 5 patterns)
   Decided by: Architecture compliance
   ```

### Integration with /vibe review

The `/vibe review` command should:

1. Spawn parallel agents (security, performance, patterns)
2. Collect outputs in structured format
3. Run merge protocol
4. Display merged findings with consensus markers
5. Allow user to: `[f] Fix blockers  [a] Accept  [d] Details`
