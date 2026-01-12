# Retrospective Command

> `/vibe retro` - Capture learnings and extract reusable patterns

## Workflow

```
Gather Feedback -> Analyze Patterns -> Extract & Apply
```

## Step 1: Gather Feedback

Display summary:

```
+---------------------------------------------------------------------+
|  What went well?                                                    |
|  * [AI summarizes smooth parts of implementation]                   |
|                                                                     |
|  What was friction?                                                 |
|  * [AI identifies where user intervened or corrected]               |
|                                                                     |
|  Documentation gaps?                                                |
|  * [AI notes missing or unclear docs encountered]                   |
|                                                                     |
|  Your feedback: _______________                                     |
+---------------------------------------------------------------------+
```

## Step 2: Pattern Analysis

Scan implementation for reusable patterns.

### Reusability Scoring (Numeric)

| Factor | Score | Criteria |
|--------|-------|----------|
| Domain Independence | +2 | Works with any domain (no business terms) |
| Tech Generality | +2 | Common framework pattern (not edge case) |
| Repetition | +1 | Same pattern appears 2+ times in codebase |
| Non-obvious | +1 | Solution isn't immediately apparent |
| Well-documented | +1 | Already has good comments/structure |

**Score Thresholds:**
- **HIGH (5+)**: Auto-promote to `~/.claude/vibe-ash-svelte/patterns/`
- **MEDIUM (3-4)**: Consider for template repo (requires manual PR)
- **LOW (<3)**: Keep in project only, don't extract

Only suggest patterns scoring MEDIUM or HIGH.

### Pattern Detection Display

```
+---------------------------------------------------------------------+
|  POTENTIAL REUSABLE PATTERNS DETECTED                               |
|                                                                     |
|  1. [BACKEND] Ash action with custom validation                     |
|     File: lib/accounts/resources/user.ex:45-67                      |
|     Reusability: HIGH                                               |
|     Suggested: patterns/backend/ash-custom-validation.md            |
|                                                                     |
|  2. [FRONTEND] Form with real-time validation                       |
|     File: components/features/auth/LoginForm.svelte                 |
|     Reusability: MEDIUM                                             |
|     Suggested: patterns/frontend/realtime-form-validation.md        |
|                                                                     |
|  Select patterns to promote: [1,2] [a]ll [n]one [e]dit              |
+---------------------------------------------------------------------+
```

## Step 2.5: Technical Debt Review

If `.claude/backlog.md` exists, show debt summary:

```
+---------------------------------------------------------------------+
|  TECHNICAL DEBT REVIEW                                               |
|                                                                      |
|  New this session: 2 items captured                                  |
|  Resolved this session: 1 item                                       |
|                                                                      |
|  Sprint debt load: 3 items                                           |
|  Recommendation: Keep < 5 items per sprint                           |
|                                                                      |
|  Sprint Items:                                                       |
|  * TD-003 (M): Add error handling to API layer                       |
|  * TD-005 (S): Refactor duplicate validation logic                   |
|                                                                      |
|  Review sprint debt? [y] Yes [n] Skip: ___                           |
+---------------------------------------------------------------------+
```

If user reviews:
- Show each sprint item with option to:
  - `[r]` Resolve (mark completed, add resolution)
  - `[b]` Move to backlog
  - `[k]` Keep in sprint
  - `[d]` Delete (remove completely)

## Step 3: Apply Changes

### Documentation Improvements
For each approved improvement:
1. Edit target file
2. Show confirmation

### Pattern Extraction
For each approved pattern:
1. Generate pattern file using template
2. Write to `~/.claude/vibe-ash-svelte/patterns/{category}/`
3. Update `patterns/README.md` index
4. Commit to vibe-ash-svelte repo

### Session Logging
Append to `.claude/learnings.md`:
- Date and feature ID
- What went well
- Improvements applied
- Patterns extracted

## Pattern File Template

When extracting, generate:

```markdown
# Pattern: [Name]

> [One-line description]

## Problem

[What problem does this pattern solve?]

## Solution

[Description of the approach]

## Example

[Code example with generic names - NO domain terms]

## When to Use

- [Condition 1]
- [Condition 2]

## When NOT to Use

- [Anti-pattern condition]

## Tech Stack

`tag1` `tag2` `tag3`

## Source

Discovered in: [Project] / [Feature ID]
Date: [Date]
```

---

## Pattern Promotion Process (AI-Driven)

### For HIGH Reusability (5+)

1. **Create pattern file**
   - Path: `~/.claude/vibe-ash-svelte/patterns/{category}/{pattern-name}.md`
   - Use Pattern File Template above
   - Replace domain-specific terms with generic names

2. **Update patterns index**
   - Edit `~/.claude/vibe-ash-svelte/patterns/README.md`
   - Add entry to appropriate category table

3. **Remind user to commit**
   ```
   Pattern extracted: patterns/{category}/{pattern-name}.md

   To share with other projects:
     cd ~/.claude/vibe-ash-svelte
     git add patterns/
     git commit -m "Add pattern: {pattern-name}"
     git push
   ```

### For MEDIUM Reusability (3-4)

1. **Note in retro summary**
   - Record pattern details in `.claude/learnings.md`
   - Flag as "potential template candidate"

2. **Ask user about template contribution**
   ```
   Pattern "{name}" scored MEDIUM (3-4).

   This could be useful in the template for new projects.
   Would you like to:
     [1] Add to template repo (I'll prepare the file, you create PR)
     [2] Keep in project learnings only
     [3] Skip
   ```

3. **If user chooses template**
   - Create file at `~/projects/vibe-ash-svelte-template/architecture/_patterns/{name}.md`
   - Show instructions for creating PR

### Pattern Categories

| Category | Location | Examples |
|----------|----------|----------|
| `backend` | `patterns/backend/` | Ash actions, notifiers, calculations |
| `frontend` | `patterns/frontend/` | Svelte components, stores, reactivity |
| `pwa` | `patterns/pwa/` | Offline, service worker, caching |
| `ux` | `patterns/ux/` | Loading states, error handling, animations |

---

## Example: Complete Retro Flow

```
/vibe retro

+---------------------------------------------------------------------+
|  What went well?                                                    |
|  * Clean TDD cycle - tests drove implementation                     |
|  * Form validation pattern worked smoothly                          |
|                                                                     |
|  What was friction?                                                 |
|  * Had to look up Ash action syntax for custom changes              |
|                                                                     |
|  Documentation gaps?                                                |
|  * No example for Ash multi-step actions                            |
|                                                                     |
|  Your feedback: _______________                                     |
+---------------------------------------------------------------------+

+---------------------------------------------------------------------+
|  POTENTIAL REUSABLE PATTERNS DETECTED                               |
|                                                                     |
|  1. [BACKEND] Ash multi-step action with rollback                   |
|     File: lib/syna/accounts/resources/user.ex:45-95                 |
|     Score: 6 (HIGH)                                                 |
|       +2 domain independent                                         |
|       +2 tech general (common Ash pattern)                          |
|       +1 non-obvious (rollback handling)                            |
|       +1 well-documented                                            |
|     → Will promote to: patterns/backend/ash-multi-step-action.md    |
|                                                                     |
|  2. [FRONTEND] Form with async validation                           |
|     File: components/features/auth/LoginForm.svelte:20-80           |
|     Score: 4 (MEDIUM)                                               |
|       +2 domain independent                                         |
|       +1 appears 2x in codebase                                     |
|       +1 non-obvious                                                |
|     → Consider for template                                         |
|                                                                     |
|  Select patterns to promote: [1,2] [a]ll [n]one [e]dit              |
+---------------------------------------------------------------------+

User: 1,2

Creating: ~/.claude/vibe-ash-svelte/patterns/backend/ash-multi-step-action.md
  ✓ Pattern file created
  ✓ README.md index updated

Pattern "Form with async validation" scored MEDIUM.
Would you like to add to template repo?
  [1] Add to template (prepare for PR)
  [2] Keep in project learnings only

User: 2

Learnings saved to: .claude/learnings.md

Retro complete. Remember to commit patterns:
  cd ~/.claude/vibe-ash-svelte && git add . && git commit -m "Add pattern: ash-multi-step-action"
```
