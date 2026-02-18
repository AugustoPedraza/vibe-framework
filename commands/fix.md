---
name: vibe fix
description: Targeted fix for user-reported issues with triage routing
args: "[FEATURE-ID] \"description\""
---

# Fix Command

> `/vibe fix [FEATURE-ID] "description"` - Targeted fix for user-reported issues

**Framework root**: All framework-relative paths resolve from `~/.claude/vibe-ash-svelte/`. Project paths resolve from CWD.

## Purpose

Fix user-reported issues by routing to specialized agents with minimal overhead:
- Triage-based agent routing
- Model escalation on retry (sonnet -> opus)
- Iterative fix tracking

**Use `/vibe fix` instead of `/vibe quick` when:**
- Issue relates to existing feature implementation
- You want automatic agent routing
- You may need to iterate ("still broken")

## Usage

```bash
/vibe fix "button is misaligned"              # Standalone (infers feature from git diff)
/vibe fix AUTH-001 "form doesn't submit"      # With feature ID
```

## Triage System

| Pattern Match | Category | Start Layer |
|--------------|----------|-------------|
| button, layout, style, spacing, color, css | `ui` | UI (references/ui-layer.md) |
| validation, error, constraint, rule, policy | `logic` | DOMAIN (references/domain-layer.md) |
| submit, event, click, handler, flow, socket | `integration` | API (references/api-layer.md) |
| migration, schema, database, query, index | `data` | DATA (references/data-layer.md) |
| login broken, flow fails, end-to-end | `mixed` | API → full vertical slice |

Priority: exact match -> multiple matches -> default to API layer

## Workflow

### Phase 0: TRIAGE

- Analyze feedback keywords -> determine category and agent(s)
- Load feature context (from git diff or provided ID)
- Create TaskCreate with metadata: `{category, agents, attempt: 1}`

### Phase 1: TARGETED FIX

Agent behavior:
- Load ONLY relevant files
- Make minimal changes (no refactoring)
- Start with sonnet, escalate to opus on retry

### Phase 2: QUICK VERIFY

Run only related tests:
```bash
# UI fixes: cd assets && npm test -- --testPathPattern="ComponentName"
# Domain fixes: mix test test/domain/ --max-cases 20
# Integration: mix test test/integration/
```

### Iteration: "Still Broken"

When user reports again:
1. Load previous fix context from TaskCreate metadata
2. Review previous attempt's changes
3. Escalate model: sonnet -> opus
4. Escalate scope: quick -> standard verification
5. Track new attempt

## Research-Assisted Fix

If the fix involves browser interaction, DOM behavior, or CSS quirks (focus, scroll, events, positioning):

1. **Before attempting fix**: run multi-source research for the specific symptom
   - `WebSearch` "{stack} {symptom} best practice" → official docs
   - `WebSearch` "{stack} {symptom} site:stackoverflow.com OR site:github.com" → community solutions
   - `WebFetch` top 2-3 results across different source tiers
2. **PAUSE** — Present top approaches from community + official sources with trade-offs:
   ```
   Fix for: {description}

   **Option A: {name}** ({source tier} — {url})
   - {1-2 sentence description}
   - Pros: {why this works}
   - Cons: {trade-offs}

   **Option B: {name}** ({source tier} — {url})
   - {1-2 sentence description}
   - Pros: {why this works}
   - Cons: {trade-offs}

   Which approach? (or describe a different one)
   ```
3. Human selects approach → apply it (not trial-and-error)
4. If research yields a reusable solution: capture as pattern (see `patterns/TEMPLATE.md`)

**Skip research for**: logic bugs, missing imports, typos, test assertion errors — these don't need community input.

## Anti-Patterns

- Never refactor unrelated code
- Never run full test suite initially (only related tests)
- Never skip fix tracking (enables iteration)
- Never use opus on first attempt (start with sonnet)
