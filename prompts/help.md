# /vibe - AI-Assisted Development

## COMMANDS

```
/vibe [ID]           Full autonomous workflow (start here)
/vibe quick [desc]   Bug/hotfix without feature spec
/vibe fix [desc]     Targeted fix when paused
/vibe pivot          Course correction when approach fails
/vibe migrate [cmd]  Legacy system migration
```

## OPTIONS

| Option | Description |
|--------|-------------|
| `--help`, `-h` | Show this help |

---

## WORKFLOW (Fully Autonomous)

```
/vibe AUTH-001

Phase 0: CONTRACT    → validate spec, generate scaffold, setup PRs
Phase 1: PARALLEL    → domain/ui/data agents + watchers + pattern matching
Phase 2: INTEGRATION → api-agent wires everything, PRs created
Phase 3: VALIDATION  → quality score + multi-agent review
Phase 4: POLISH      → auto-fix suggestions, create final PR
Phase 5: LEARNING    → extract patterns, archive feature

DONE! (Only pauses if issues found)
```

### Strategic Pause Points (Only 5)

The system only pauses when human judgment is required:

1. **Tests failing** - Cannot auto-fix test logic
2. **Security critical** - Requires acknowledgment
3. **Quality below 4.0** - May need scope adjustment
4. **Review blockers** - Must fix before PR
5. **Conflicts unresolved** - Naming/interface disputes

Everything else auto-proceeds with notification.

---

## EXAMPLES

```bash
# Feature implementation (full workflow)
/vibe AUTH-001                    # Autonomous end-to-end

# Bug fixes (no spec needed)
/vibe quick "fix login button"    # Quick single-agent fix

# Recovery when paused
/vibe fix "N+1 query in user_list" # Targeted fix for blocker

# Course correction
/vibe pivot                       # When approach isn't working

# Legacy migration
/vibe migrate init                # Analyze current state
/vibe migrate PROFILE             # Migrate specific feature
```

---

## AUTO-PROCEED BEHAVIOR

| Situation | Behavior |
|-----------|----------|
| Format issues | Auto-fix |
| Lint warnings | Notify, proceed |
| Tests passing | Auto-proceed |
| Tests failing | **PAUSE** |
| Quality >= 4.0 | Auto-proceed to review |
| Quality < 4.0 | **PAUSE** |
| Review no blockers | Auto-proceed |
| Review has blockers | **PAUSE** |
| PR creation | Auto-create |
| Polish suggestions | Auto-fix safe ones |

---

## ABSORBED COMMANDS

These commands are now automatic parts of the workflow:

| Was | Now |
|-----|-----|
| `/vibe generate` | Auto in Phase 0 (if ui_spec exists) |
| `/vibe validate` | Auto in Phase 0 |
| `/vibe lint` | Watchers run continuously |
| `/vibe patterns` | Auto-matched in Phase 1 |
| `/vibe review` | Auto in Phase 3 |
| `/vibe analyze` | Included in review |
| `/vibe learn` | Auto in Phase 5 |
| `/vibe archive` | Auto in Phase 5 |

---

## PROJECT REQUIREMENTS

Create `.claude/vibe.config.json` in your project:

```json
{
  "project": {
    "name": "MyProject",
    "core_kpi": "Primary success metric"
  },
  "stack": {
    "backend": ["elixir", "ash"],
    "frontend": ["svelte"]
  },
  "paths": {
    "features": "docs/domain/features/"
  }
}
```

---

---

## PARALLEL FEATURES

Vibe automatically manages parallel feature development:

### Starting a Second Feature

When you run `/vibe [ID]` with another feature running:
- Vibe detects the active feature
- Checks for file ownership overlap (collision risk)
- Suggests: wait, proceed with worktree, or pick alternative

### Collision Detection

Features modifying same files = collision risk

| Overlap | Risk | Recommendation |
|---------|------|----------------|
| < 30% | Low | Proceed normally |
| 30-70% | Medium | Worktree recommended |
| > 70% | High | Wait suggested |

### Worktrees (Automatic)

If you proceed with a conflicting feature:
1. Vibe creates git worktree automatically
2. You open new Claude session in worktree directory
3. Merge conflicts resolved in final PR

```
Worktree ready: ../project-AUTH-002

Next steps:
  1. Open new terminal
  2. cd ../project-AUTH-002
  3. Run: claude
  4. Run: /vibe AUTH-002
```

### Pick Alternative

Vibe queries GitHub project "Ready" column and suggests features with no collision with active work.

### Context Auto-Clear

After feature completion (Phase 5):
- Feature removed from tracking
- Context cleared automatically
- Ready for next feature

---

## CI AUTO-FIX

Vibe automatically monitors and fixes CI failures after PR creation.

### How It Works

```
PR Created → CI runs → Failure? → Auto-fix → Push → Re-run CI
                         ↓
                      Success? → Continue to next phase
```

### What Gets Fixed

| Failure Type | Auto-Fix Approach |
|--------------|-------------------|
| Test failures | Analyze assertion, fix code or test |
| Lint errors | Apply auto-fix or manual correction |
| Format issues | Run formatter |
| Build errors | Fix imports, syntax, types |
| TypeScript errors | Fix type annotations |

### Max Retries

- **3 attempts** per PR before pausing
- After 3 failures: human intervention requested
- Summary shows what was tried and what remains

### When It Runs

- After stacked PRs (data/, domain/, ui/)
- After API PR
- After final PR to main

### No Human Needed

If CI passes (even after fixes), vibe proceeds automatically.
You only get notified if:
- CI passes with fixes applied (info)
- Max retries reached (pause)

---

## MORE INFO

- Framework: `~/.claude/vibe-ash-svelte/`
- Orchestrator: `agents/orchestrator/core.md`
- Patterns: `patterns/`
- Parallel Features: `agents/coordination/`
