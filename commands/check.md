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

# Per-PR worktree (allows parallel PR reviews)
WORKTREE_PATH="../pr-check-{PR_NUMBER}"

# First time:
git fetch origin {BRANCH_NAME}
git worktree add $WORKTREE_PATH origin/{BRANCH_NAME}

# Subsequent reviews of same PR:
cd $WORKTREE_PATH && git fetch origin {BRANCH_NAME} && git checkout {BRANCH_NAME} && git reset --hard origin/{BRANCH_NAME} && cd -

# Cache-aware dep install (skip if deps unchanged since last review)
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

- Each PR gets its own worktree at `../pr-check-{PR_NUMBER}` (allows parallel reviews)
- Worktrees are **kept between reviews** of the same PR (faster: deps already installed)
- `--cleanup` removes the worktree for the given PR: `git worktree remove ../pr-check-{PR_NUMBER} && git worktree prune`
- `--cleanup-all` removes all PR check worktrees: `rm -rf ../pr-check-* && git worktree prune`

## Anti-Patterns

- Never run checks in user's current working directory
- Never auto-post comments without user confirmation
- Never delete worktree automatically (cleanup is explicit)
- Spawn all agents in parallel (single message, multiple Task calls)
