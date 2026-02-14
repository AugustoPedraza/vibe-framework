# No Shortcuts — The Boy Scout Rule

> Auto-loaded rule. NEVER bypass quality gates. Fix the issue, don't work around it.

## Absolute Rules

1. **NEVER exclude files from commits to bypass pre-commit hooks** — fix the underlying issue
2. **NEVER use `--no-verify`, `--no-check`, or any flag that skips validation**
3. **NEVER use `.skip`, `@tag :skip`, or `TODO` to bypass test failures** — fix the test or the code
4. **NEVER ignore hook output** — if a hook says BLOCKER, fix it before proceeding
5. **NEVER selectively stage files to avoid quality checks on modified files**
6. **NEVER comment out failing assertions** — fix the code under test

## Common Scenarios

### Hook says "BLOCKER: Component is 707 lines (limit: 300)"

```
WRONG: git add file1.ex file2.ex  # (skip the .svelte file)
WRONG: git commit --no-verify

RIGHT: Decompose the component into <300 line pieces, THEN commit ALL files
```

### Pre-commit reformats files

```
WRONG: git checkout -- reformatted-file.svelte  # discard the formatting

RIGHT: git add reformatted-file.svelte  # re-stage the formatted version, then commit
```

### Test is failing

```
WRONG: test.skip("broken test", ...)
WRONG: @tag :skip

RIGHT: Fix the test or the code. If stuck after 3 attempts, PAUSE and ask the user.
```

## Decision Tree: Hook Blocks a Commit

```
1. Hook blocks → READ the error message carefully
2. Identify the issue (size, format, lint, test, etc.)
3. FIX the issue in the source code
4. Re-stage the fixed files: git add <fixed-files>
5. Re-attempt the commit
6. If the fix creates new issues → repeat from step 1
7. If stuck after 3 cycles → PAUSE and explain the situation to the user
```

## Why This Matters

Excluding files or skipping hooks leaves violations in the codebase. The next developer (or agent) inherits the debt. The boy scout rule: **leave the code better than you found it** — never worse.
