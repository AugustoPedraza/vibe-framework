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
