# Pivot Command

> `/vibe pivot` - Course correction when implementation diverges from plan

## Purpose

Formal process to recover when things go off-track:
- Tests keep failing unexpectedly
- Scope creep detected
- Blockers discovered mid-implementation
- Original approach isn't working
- User says "this isn't working"

---

## Workflow

```
ASSESS → DECIDE → RESUME
```

### Phase 1: Assess

```
+======================================================================+
|  PIVOT ASSESSMENT                                                     |
|  Context: [Current Feature] - [Current Phase]                         |
+======================================================================+
```

**Gather information:**

```
+---------------------------------------------------------------------+
|  DIVERGENCE ANALYSIS                                                  |
|                                                                       |
|  Original Plan:                                                       |
|    Feature: [ID]                                                      |
|    Scenario: [Current scenario]                                       |
|    Expected: [What was supposed to happen]                            |
|                                                                       |
|  What Happened:                                                       |
|    [AI describes what actually occurred]                              |
|    [List specific issues encountered]                                 |
|                                                                       |
|  Why It Diverged:                                                     |
|    [ ] Spec was incomplete/wrong                                      |
|    [ ] Approach was wrong                                             |
|    [ ] Unexpected technical blocker                                   |
|    [ ] Scope expanded beyond original                                 |
|    [ ] External dependency issue                                      |
|                                                                       |
|  Is this assessment correct? [Enter to continue]                      |
+---------------------------------------------------------------------+
```

### Phase 2: Decide

```
+---------------------------------------------------------------------+
|  PIVOT OPTIONS                                                        |
|                                                                       |
|  Choose how to proceed:                                               |
|                                                                       |
|  [s] Update spec - The specification was wrong/incomplete             |
|      → Go back to Designer phase with updated requirements            |
|                                                                       |
|  [a] Change approach - Try different implementation strategy          |
|      → Stay in Dev phase, try alternative approach                    |
|                                                                       |
|  [d] Capture as debt - This is out of scope for current task          |
|      → Record in backlog, continue with reduced scope                 |
|                                                                       |
|  [r] Rollback and restart - Start fresh with lessons learned          |
|      → Revert changes, go back to QA phase                            |
|                                                                       |
|  [x] Abandon - Stop work on this feature entirely                     |
|      → User decides to not proceed                                    |
|                                                                       |
|  Select option: ___                                                   |
+---------------------------------------------------------------------+
```

### Phase 3: Resume

Based on user decision:

**[s] Update Spec:**
1. Document what needs to change in feature spec
2. Return to Designer phase
3. Review UX implications
4. Update scenarios if needed
5. Continue from Designer checkpoint

**[a] Change Approach:**
1. Document alternative approach
2. Update implementation plan
3. Continue from current scenario
4. Note: May need to update/delete existing tests

**[d] Capture as Debt:**
1. Record item in `.claude/backlog.md`
2. Document what's being deferred
3. Update feature scope (mark scenarios as "DEFERRED")
4. Continue with remaining scenarios

**[r] Rollback and Restart:**
1. Identify what to revert
2. Git reset/revert changes
3. Document lessons learned
4. Return to QA phase with fresh start

**[x] Abandon:**
1. Confirm with user
2. Document why abandoned
3. Clean up any partial changes
4. End workflow

---

## When to Trigger Pivot

**AI should suggest `/vibe pivot` when:**

| Signal | Example |
|--------|---------|
| Repeated test failures | Same test fails 3+ times with different fixes |
| User frustration | "This isn't working", "Let's try something else" |
| Scope creep | Implementing things not in original spec |
| Blocked | Can't proceed due to external factor |
| Circular debugging | Going in circles without progress |

**Suggestion format:**
```
It looks like we're stuck. Would you like to run /vibe pivot to reassess? [Y/n]
```

---

## Pivot Log

After each pivot, append to `.claude/learnings.md`:

```markdown
## Pivot: [Feature ID] - [Date]

**Original Plan:** [Brief description]
**Divergence:** [What went wrong]
**Decision:** [s/a/d/r/x]
**Outcome:** [Result of pivot]
**Lesson:** [What to do differently next time]
```

---

## Anti-Patterns

- Pivoting without understanding the root cause
- Choosing "rollback" when "change approach" would work
- Not documenting the pivot decision
- Pivoting multiple times on the same issue (indicates deeper problem)
- Using pivot to avoid difficult implementation (procrastination)

---

## Recovery Checklist

After any pivot:

- [ ] Decision documented
- [ ] User confirmed direction
- [ ] Appropriate phase selected
- [ ] Tests updated (if approach changed)
- [ ] Spec updated (if spec was wrong)
- [ ] Debt captured (if scope reduced)
- [ ] Resume workflow from correct phase
