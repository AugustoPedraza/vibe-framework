# Technical Debt Command

> `/vibe debt [description]` - Capture and triage technical debt items

## Purpose

During coding sessions, capture technical debt or out-of-scope items with user decision on priority. Items are stored in project-local `.claude/backlog.md`.

## Workflow

```
Capture -> Categorize -> User Decision -> Record -> Continue/Pause
```

## Trigger Scenarios

This command can be triggered:
1. **Manually**: User runs `/vibe debt "description"`
2. **Suggested**: AI detects out-of-scope work during development

---

## Phase 1: Capture Item

```
+======================================================================+
|  DEBT TECHNICAL DEBT CAPTURE                                         |
|  Context: [Current Feature ID] - [Current Phase]                     |
+======================================================================+
```

### Gather Information

Display debt capture form:

```
+---------------------------------------------------------------------+
|  TECHNICAL DEBT ITEM                                                 |
|                                                                      |
|  Description: [User provided or AI detected]                         |
|                                                                      |
|  Category:                                                           |
|    [1] tech-debt     - Code quality, architecture issues             |
|    [2] out-of-scope  - Feature scope creep, new requirements         |
|    [3] improvement   - Enhancement opportunities                     |
|    [4] refactor      - Code restructuring needs                      |
|                                                                      |
|  Estimated Effort:                                                   |
|    [S] Small  (< 1 day)                                              |
|    [M] Medium (1-3 days)                                             |
|    [L] Large  (3+ days)                                              |
|                                                                      |
|  Context:                                                            |
|    Current Feature: [FEATURE-ID or "none"]                           |
|    Discovered During: [Phase name or "standalone"]                   |
|    File(s) Affected: [path/to/file.ext or "TBD"]                     |
|                                                                      |
|  Enter category [1-4] and effort [S/M/L]: ___                        |
+---------------------------------------------------------------------+
```

Wait for user input before proceeding.

---

## Phase 2: User Decision (CHECKPOINT)

```
+---------------------------------------------------------------------+
|  CHECKPOINT: How should we handle this?                              |
|                                                                      |
|  [now]     - Pause current work and address this immediately         |
|  [later]   - Add to current sprint, address after current feature    |
|  [backlog] - Add to future backlog, continue current work            |
|  [skip]    - Don't record, continue current work                     |
|                                                                      |
|  Your decision: _______________                                      |
+---------------------------------------------------------------------+
```

**ALWAYS wait for user decision. Never auto-continue.**

---

## Phase 3: Record & Continue

Based on user decision:

### If "now"

1. Record item to `.claude/backlog.md` with status: `in-progress`
2. Show current work state (what will be paused)

```
+---------------------------------------------------------------------+
|  PAUSING CURRENT WORK                                                |
|                                                                      |
|  Current Feature: [ID] - [Title]                                     |
|  Current Phase: [Phase name]                                         |
|  Current Scenario: [Scenario name or N/A]                            |
|                                                                      |
|  This state will be saved. Run `/vibe status` to see paused work.    |
|                                                                      |
|  Press Enter to begin addressing debt item...                        |
+---------------------------------------------------------------------+
```

3. **CHECKPOINT**: Confirm pause
4. Begin addressing the debt item

### If "later"

1. Record item to `.claude/backlog.md` with status: `sprint`
2. Show confirmation:

```
+---------------------------------------------------------------------+
|  RECORDED TO SPRINT                                                  |
|                                                                      |
|  Item: [TD-XXX] [Description]                                        |
|  Status: Sprint (address after current feature)                      |
|                                                                      |
|  Continuing current work...                                          |
+---------------------------------------------------------------------+
```

3. Continue current work immediately

### If "backlog"

1. Record item to `.claude/backlog.md` with status: `backlog`
2. Show confirmation:

```
+---------------------------------------------------------------------+
|  RECORDED TO BACKLOG                                                 |
|                                                                      |
|  Item: [TD-XXX] [Description]                                        |
|  Status: Backlog (future sprint)                                     |
|                                                                      |
|  Continuing current work...                                          |
+---------------------------------------------------------------------+
```

3. Continue current work immediately

### If "skip"

1. Don't record
2. Show confirmation:

```
+---------------------------------------------------------------------+
|  SKIPPED                                                             |
|                                                                      |
|  Item not recorded. Continuing current work...                       |
+---------------------------------------------------------------------+
```

3. Continue current work immediately

---

## Backlog File Format

Create/update `.claude/backlog.md` in project root:

```markdown
# Technical Debt Backlog

> Auto-generated by `/vibe debt`. Edit with care.

## Current Sprint

| ID | Category | Description | Effort | Discovered | Status |
|----|----------|-------------|--------|------------|--------|

## Future Backlog

| ID | Category | Description | Effort | Discovered | Status |
|----|----------|-------------|--------|------------|--------|

## Completed

| ID | Category | Description | Completed | Resolution |
|----|----------|-------------|-----------|------------|

---

## Item Details

<!-- Detailed entries appended below -->
```

### Item Detail Format

```markdown
### TD-XXX: [Short description]

- **Category:** tech-debt | out-of-scope | improvement | refactor
- **Effort:** S | M | L
- **Discovered:** [FEATURE-ID] / [Phase name]
- **Files Affected:** `path/to/file.ext`
- **Description:** [Full description]
- **Status:** in-progress | sprint | backlog | completed
- **Created:** [Date]
- **Completed:** [Date or N/A]
- **Resolution:** [How it was resolved or N/A]
```

---

## ID Generation

Generate sequential IDs per project:

1. Read existing `.claude/backlog.md`
2. Find highest TD-XXX number
3. Increment by 1
4. Format as TD-001, TD-002, etc.

---

## Integration with Other Commands

### During `/vibe [FEATURE-ID]`

When AI detects potential debt during development:

```
+---------------------------------------------------------------------+
|  POTENTIAL DEBT DETECTED                                             |
|                                                                      |
|  While implementing [scenario], I noticed:                           |
|  "[description of debt item]"                                        |
|                                                                      |
|  [d] Capture this as technical debt                                  |
|  [c] Continue without capturing                                      |
+---------------------------------------------------------------------+
```

If user chooses `[d]`, proceed with debt capture workflow.

### During `/vibe status`

Show debt summary:

```
Technical Debt:
  In Progress: 1 item
  Sprint: 2 items (1M, 1S)
  Backlog: 5 items

  [!] TD-003 (in-progress): Add error handling to API layer
```

### During `/vibe retro`

Include debt review section:

```
+---------------------------------------------------------------------+
|  TECHNICAL DEBT REVIEW                                               |
|                                                                      |
|  New this session: 2 items captured                                  |
|  Resolved this session: 1 item                                       |
|                                                                      |
|  Sprint debt load: 3 items                                           |
|  Recommendation: < 5 items per sprint                                |
|                                                                      |
|  Review sprint debt? [y/n]: ___                                      |
+---------------------------------------------------------------------+
```

---

## Marking Items Complete

When debt is addressed, update the item:

1. Move from Current Sprint/Backlog to Completed
2. Add completion date
3. Add resolution description

```
+---------------------------------------------------------------------+
|  DEBT ITEM COMPLETED                                                 |
|                                                                      |
|  Item: TD-003 - Add error handling to API layer                      |
|                                                                      |
|  Resolution (brief description): _______________                     |
+---------------------------------------------------------------------+
```

---

## Anti-Patterns

- Never auto-decide on debt handling (always checkpoint)
- Never skip recording when user chooses now/later/backlog
- Never continue current feature work if user chose "now"
- Never mix debt IDs between projects (project-local only)
- Never delete items from backlog (move to Completed with resolution)
