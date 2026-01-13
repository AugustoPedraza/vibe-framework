# Quick Mode Command

> `/vibe quick [description]` - Condensed workflow for bugs, hotfixes, and small changes

## Purpose

Skip the full 4-phase workflow for tasks that don't need it:
- Bug fixes
- Hotfixes
- Typo/copy fixes
- Single-file changes
- Config adjustments

**Use full `/vibe [ID]` instead when:**
- New features
- New components
- UX changes
- Multi-file refactors
- Anything that needs Designer review

---

## Workflow (2 Phases)

```
DEV PHASE (condensed) → VERIFY PHASE (condensed)
```

### Phase 1: Dev (Condensed)

```
+======================================================================+
|  DEV QUICK FIX                                                        |
|  Task: [description]                                                  |
+======================================================================+
```

1. **Understand the issue**
   - Read relevant code
   - Identify the root cause
   - Note affected files

2. **Write minimal test** (if applicable)
   - Test that reproduces the bug
   - Run test → Should fail (RED)

3. **Implement fix**
   - Make minimal changes needed
   - Follow existing patterns
   - Don't refactor unrelated code

4. **Run test** → Should pass (GREEN)

5. **Quick summary**
   ```
   +---------------------------------------------------------------------+
   |  FIX IMPLEMENTED                                                     |
   |                                                                      |
   |  Changed:                                                            |
   |    * file1.ex:42 - [what changed]                                    |
   |    * file2.svelte:15 - [what changed]                                |
   |                                                                      |
   |  Test: [PASS/FAIL/SKIPPED]                                           |
   |                                                                      |
   |  Ready for verification? [Enter]                                     |
   +---------------------------------------------------------------------+
   ```

### Phase 2: Verify (Condensed)

```
+======================================================================+
|  VERIFY QUICK FIX                                                     |
|  Running: Quality checks                                              |
+======================================================================+
```

1. **Run full test suite**
   ```bash
   {{commands.test}}
   ```

2. **Run quality checks**
   ```bash
   {{commands.check}}
   ```

3. **Report results**
   ```
   +---------------------------------------------------------------------+
   |  VERIFICATION COMPLETE                                               |
   |                                                                      |
   |  Tests: [PASS] 142/142                                               |
   |  Quality: [PASS] No issues                                           |
   |                                                                      |
   |  Options:                                                            |
   |    [c] Commit changes                                                |
   |    [p] Create PR                                                     |
   |    [d] Done (leave uncommitted)                                      |
   +---------------------------------------------------------------------+
   ```

---

## When AI Should Suggest Quick Mode

Auto-detect and suggest quick mode when user request includes:

| Indicator | Example |
|-----------|---------|
| "fix" | "fix the login button" |
| "bug" | "there's a bug in validation" |
| "broken" | "the form is broken" |
| "hotfix" | "hotfix for production" |
| "typo" | "typo in the header" |
| "update" (small) | "update the copy to say X" |

**Confirmation prompt:**
```
This looks like a bug fix. Use quick workflow? [Y/n]
```

---

## Skip Quick Mode When

- User explicitly asks for full workflow
- Task mentions "new feature", "add", "implement"
- Task involves UX decisions
- Task affects multiple components
- Task has acceptance scenarios defined

---

## Comparison: Quick vs Full

| Aspect | Quick Mode | Full Mode |
|--------|------------|-----------|
| Phases | 2 | 4 |
| Designer review | Skip | Required |
| QA test generation | Minimal | Full scenarios |
| Checkpoints | 2 | 4+ |
| PR | Optional | Recommended |
| Retro | Skip | Offered |

---

## Anti-Patterns

- Using quick mode for new features
- Skipping tests entirely
- Not running quality checks
- Large refactors in quick mode
- Ignoring failing tests
