---
name: vibe fix
description: Targeted fix for user-reported issues with triage routing
args: "[FEATURE-ID] \"description\""
---

# Fix Command

> `/vibe fix [FEATURE-ID] "description"` - Targeted fix for user-reported issues

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

## Anti-Patterns

- Never refactor unrelated code
- Never run full test suite initially (only related tests)
- Never skip fix tracking (enables iteration)
- Never use opus on first attempt (start with sonnet)
