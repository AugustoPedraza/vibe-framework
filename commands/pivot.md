---
name: vibe pivot
description: Course correction when implementation diverges from plan
---

# Pivot Command

> `/vibe pivot` - Course correction when things go off-track

## Purpose

Formal process to recover when:
- Tests keep failing unexpectedly
- Scope creep detected
- Blockers discovered mid-implementation
- Original approach isn't working
- User says "this isn't working"

## Workflow: ASSESS -> DECIDE -> RESUME

### Phase 1: Assess

Gather information:
- What was the original plan?
- What actually happened?
- Why did it diverge? (spec wrong, approach wrong, blocker, scope expanded, external dependency)

### Phase 2: Decide

Options:

| Option | Action |
|--------|--------|
| **Update spec** | Go back to Phase 0 with updated requirements |
| **Research** | Multi-source web search (official + community), present approaches to human, then proceed with chosen one |
| **Change approach** | Stay in current phase, try alternative strategy |
| **Capture as debt** | Record in backlog, continue with reduced scope |
| **Rollback** | Revert changes, restart with lessons learned |
| **Abandon** | Stop work on this feature entirely |

### Phase 3: Resume

Based on decision:
- Update spec -> return to Phase 0
- Change approach -> update plan, continue from current scenario
- Debt -> record in backlog, mark scenarios as "DEFERRED"
- Rollback -> git revert, return to Phase 0
- Abandon -> clean up partial changes, end workflow

## When to Suggest Pivot

| Signal | Example |
|--------|---------|
| Repeated failures | Same test fails 3+ times |
| User frustration | "This isn't working" |
| Scope creep | Implementing things not in spec |
| Blocked | External dependency issue |
| Circular debugging | Going in circles |

## Pivot Log

Write to auto memory (`memory/pitfalls.md`):
- Original plan, divergence, decision, outcome, lesson learned

## Anti-Patterns

- Pivoting without understanding root cause
- Choosing "rollback" when "change approach" would work
- Not documenting the pivot decision
- Using pivot to avoid difficult implementation
