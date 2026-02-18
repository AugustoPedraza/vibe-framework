---
name: vibe migrate
description: Test-driven migration workflow for strangler fig pattern
args: "[subcommand: init | FEATURE | status]"
---

# Migration Command

> `/vibe migrate [subcommand]` - Test-driven migration from legacy to Ash+Svelte

**Framework root**: All framework-relative paths resolve from `~/.claude/vibe-ash-svelte/`. Project paths resolve from CWD.

## Purpose

Migrate existing features using test-first approach:
1. Document current behavior
2. Write regression tests in target architecture
3. Implement migration only after tests pass against legacy
4. Verify tests pass against new code

**Safety Rule**: NO migration without test battery first.

## Worktree Gate (HARD BLOCK — must pass before any file writes)

Before ANY file creation or editing:
1. Run `git branch --show-current`
2. If on `main`/`master` → **HARD BLOCK**: print "Cannot write code on main branch. Run `/vibe migrate` from inside a worktree." **STOP.**
3. `migrate init` and `migrate status` (read-only analysis) may proceed on any branch

## Subcommands

| Subcommand | Description |
|------------|-------------|
| `/vibe migrate init` | Analyze codebase, create architecture docs |
| `/vibe migrate [FEATURE]` | Create migration spec + test requirements |
| `/vibe migrate status` | Show migration progress |

## `/vibe migrate init`

1. **Verify config** - Check `vibe.config.json` has migration section
2. **Create directory structure** - `architecture/_current/`, `architecture/_target/`, `docs/domain/features/_current/`
3. **Analyze codebase** - Scan routes, controllers, contexts; create `overview.md`
4. **Copy target architecture** - From template repo

## `/vibe migrate [FEATURE]`

1. **Analyze legacy** - Routes, tables, dependencies, dependents, current behavior
2. **Generate BDD scenarios** - Given/When/Then from analyzed behavior
3. **Generate test stubs** - In TARGET architecture (not legacy patterns)
4. **Create migration spec** - `docs/domain/features/_current/MIGRATE-[FEATURE].md`
5. **Update tracking** - Add to migration progress

**HARD BLOCK**: Implementation blocked until regression tests pass against legacy code.

## `/vibe migrate status`

Show: migrated count, in-progress, blocked (needs tests), remaining, new (native).

## Implementing: `/vibe MIGRATE-[FEATURE]`

Pre-check (HARD BLOCK):
- Regression tests written (target architecture)
- Tests pass against legacy code
- All BDD scenarios have tests

If ready, proceed with standard vibe workflow.

## Anti-Patterns

- Starting migration without tests
- Writing tests in legacy patterns
- Changing database schema before legacy is removed
- Skipping the readiness gate
