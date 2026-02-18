---
name: vibe quick
description: Condensed workflow for bugs, hotfixes, and small changes
args: "[description]"
---

# Quick Mode Command

> `/vibe quick [description]` - Skip the full workflow for small tasks

**Framework root**: All framework-relative paths resolve from `~/.claude/vibe-ash-svelte/`. Project paths resolve from CWD.

## Purpose

Condensed 2-phase workflow for:
- Bug fixes
- Hotfixes
- Typo/copy fixes
- Single-file changes
- Config adjustments

**Use full `/vibe [ID]` instead for:** new features, new components, UX changes, multi-file refactors.

## Worktree Gate (HARD BLOCK — must pass before any file writes)

Before ANY file creation or editing:
1. Run `git branch --show-current`
2. If on `main`/`master` → **HARD BLOCK**: print "Cannot write code on main branch. Use `/vibe` with a feature ID for worktree isolation, or manually create a worktree first." **STOP.**
3. If NOT in a worktree (no `.env.worktree` AND `git rev-parse --show-toplevel` matches main repo root) → **WARN**: "Running outside worktree isolation. Consider using `/vibe` for full isolation."

## Workflow

### Phase 1: Dev (Condensed)

1. **Understand** - Read relevant code, identify root cause
2. **Write minimal test** (if applicable) - Reproduce the bug, verify RED
3. **Implement fix** - Minimal changes, follow existing patterns
4. **Run test** - Verify GREEN

### Phase 2: Verify (Condensed)

1. **Run full test suite** - `{{commands.test}}`
2. **Run quality checks** - `{{commands.check}}`
3. **Report results** - Tests pass? Quality clean? Offer commit/PR/done

## Auto-Detection

Suggest quick mode when user request includes:
- "fix", "bug", "broken", "hotfix", "typo", "update" (small scope)

Skip quick mode when:
- "new feature", "add", "implement"
- Involves UX decisions or multiple components
- Has acceptance scenarios defined

## Comparison

| Aspect | Quick | Full |
|--------|-------|------|
| Phases | 2 | 3 (PREP → BUILD → VERIFY) |
| Agent | Single | Single (full vertical slice) |
| PR workflow | Optional | Single PR to main |
| Validation | None | Parallel background agents |

## Anti-Patterns

- Using quick mode for new features
- Skipping tests entirely
- Large refactors in quick mode
