---
name: vibe check
description: Standalone PR verification with parallel agents
args: "<PR_URL|PR_NUMBER> [--no-comment] [--no-design-system] [--cleanup]"
---

# Check Command

> `/vibe check <PR_URL|PR_NUMBER>` - Standalone PR verification in isolated worktree

**Framework root**: All framework-relative paths resolve from `~/.claude/vibe-ash-svelte/`. Project paths resolve from CWD.

## Purpose

Run comprehensive verification on a PR in an isolated git worktree:
- Verify PRs without affecting current work
- Run backend and frontend checks in parallel
- Enforce best practices and detect anti-patterns
- Generate detailed PR review comments

## Usage

```bash
/vibe check <PR_URL>                    # Full verification
/vibe check <PR_NUMBER>                 # Just number (uses current repo)
/vibe check <PR_URL> --no-comment       # Skip comment generation
/vibe check <PR_URL> --no-design-system # Skip design system policer
/vibe check --cleanup                   # Remove the persistent worktree
```

## Workflow

**Phase 1: SETUP** - Parse PR, switch persistent worktree (`../pr-check`) to PR branch, install deps
**Phase 2: VERIFY** - Spawn 6 parallel agents (all via Task tool, `run_in_background: true`)
**Phase 3: COLLECT** - Aggregate all agent reports
**Phase 4: REVIEW** - Present categorized findings
**Phase 5: COMMENT** - Generate PR comment, post via `gh pr comment`

## Phase 1: SETUP

```bash
# Parse PR info
gh pr view {PR_NUMBER} --json headRefName,number,title,headRepositoryOwner,isCrossRepository,url
```

### Worktree resolution (reuse before create)

Before creating a new worktree, check if one already exists for the PR branch:

```bash
git fetch origin {BRANCH_NAME}

# 1. Check all existing worktrees for a match
git worktree list --porcelain
# Parse output: look for any worktree whose `branch` is refs/heads/{BRANCH_NAME}

# 2. Decision tree:
#    a) Existing worktree found on {BRANCH_NAME}:
#       - Compare HEAD against origin/{BRANCH_NAME}
#       - If HEAD matches origin → reuse as-is (WORKTREE_PATH = that path)
#       - If HEAD differs → warn "worktree is X commits behind/ahead", then:
#           git -C $WORKTREE_PATH merge-base --is-ancestor origin/{BRANCH_NAME} HEAD
#           If local is ahead (has unpushed commits) → reuse as-is, note in report
#           If local is behind → `git -C $WORKTREE_PATH pull --ff-only origin {BRANCH_NAME}`
#       - SKIP worktree creation entirely
#
#    b) No matching worktree but ../pr-check-{PR_NUMBER} exists (leftover from prior review):
#       - cd ../pr-check-{PR_NUMBER} && git checkout {BRANCH_NAME} && git reset --hard origin/{BRANCH_NAME}
#       - WORKTREE_PATH="../pr-check-{PR_NUMBER}"
#
#    c) No match at all → create fresh:
#       - git worktree add ../pr-check-{PR_NUMBER} origin/{BRANCH_NAME}
#       - WORKTREE_PATH="../pr-check-{PR_NUMBER}"
```

### Cache-aware dep install

```bash
cd $WORKTREE_PATH
MIX_SUM=$(md5sum mix.lock 2>/dev/null | cut -d' ' -f1)
NPM_SUM=$(md5sum assets/package-lock.json 2>/dev/null | cut -d' ' -f1)
# Compare against .claude/.dep-checksums — only install if changed:
# mix.lock changed  → mix deps.get && mix compile
# package-lock.json changed → cd assets && npm ci
# Neither changed → skip entirely
# Write new checksums after successful install
```

Validate design system file exists (unless `--no-design-system`):
`{WORKTREE_PATH}/architecture/design-system.md`

## Phase 2: VERIFY (Parallel Agents)

> **Parity note**: These 6 agents mirror what `/vibe` Phase 3 checks inline. If `/vibe` created the PR, `/vibe check` should find zero new issues.

Spawn ALL agents in a single message with multiple Task calls:

| Agent | Responsibility |
|-------|---------------|
| backend-checker | `mix format --check-formatted`, `mix credo --strict`, `mix compile --warnings-as-errors`, `mix test` |
| frontend-checker | prettier, eslint, svelte-check, tsc, vitest, npm audit |
| best-practices-policer | Ash patterns, Svelte 5 runes, design tokens, accessibility |
| anti-pattern-detector | Architecture violations, N+1 queries, security, UX anti-patterns |
| code-smell-detector | Long functions, deep nesting, dead code, TODOs, debug statements |
| design-system-policer | Raw colors, spacing, typography, z-index, touch targets |

Each agent writes JSON report to `{WORKTREE_PATH}/.claude/check-reports/`.

## Phase 3: COLLECT

Read and aggregate all report JSONs. Calculate totals: blockers, warnings, by category.

## Phase 4: REVIEW

Present categorized results. Use TaskCreate to track issues found.

## Phase 5: COMMENT

Generate markdown PR comment with:
- Summary table (category / status / blockers / warnings)
- Categorized issues with file:line references
- Actionable fix suggestions

Post via: `gh pr comment {PR_NUMBER} --body "$(cat comment.md)"`

## Worktree Management

- **Reuse first**: if any existing worktree is already on the PR branch, use it — don't create a duplicate
- This means if the user ran `/vibe` to create the PR from a worktree, `/vibe check` reuses that same worktree
- Fallback: each PR gets its own worktree at `../pr-check-{PR_NUMBER}` (allows parallel reviews)
- Worktrees are **kept between reviews** of the same PR (faster: deps already installed)
- `--cleanup` removes the `pr-check-{PR_NUMBER}` worktree (not user-created worktrees): `git worktree remove ../pr-check-{PR_NUMBER} && git worktree prune`
- `--cleanup-all` removes all `pr-check-*` worktrees: `rm -rf ../pr-check-* && git worktree prune`

## Anti-Patterns

- Never run checks on the **main/master branch** working directory — always use a feature branch worktree
- Never create a new worktree when an existing one already tracks the PR branch (reuse it)
- Never `git reset --hard` a worktree that is ahead of origin (user may have unpushed work)
- Never auto-post comments without user confirmation
- Never delete worktree automatically (cleanup is explicit)
- Spawn all agents in parallel (single message, multiple Task calls)
