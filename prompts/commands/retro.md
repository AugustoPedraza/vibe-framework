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

## Step 2.7: Pattern Usage Feedback

> Collect feedback on patterns used during implementation to improve pattern index.

If patterns were used this session (from checkpoint or handoffs):

```
+---------------------------------------------------------------------+
|  PATTERN USAGE FEEDBACK                                              |
|                                                                      |
|  Patterns used this session:                                         |
|                                                                      |
|  1. async-result-extraction                                          |
|     Used in: lib/syna_web/live/home_live.ex                          |
|     How well did it work?                                            |
|       [5] Perfect - no adaptation needed                             |
|       [4] Good - minor tweaks                                        |
|       [3] OK - needed some adaptation                                |
|       [2] Rough - significant changes required                       |
|       [1] Poor - didn't really apply                                 |
|     Feedback (optional): _______________                             |
|                                                                      |
|  2. liveview-navigation                                              |
|     Used in: assets/lib/utils/navigation.ts                          |
|     How well did it work? [1-5]: ___                                 |
|     Feedback (optional): _______________                             |
|                                                                      |
|  [s] Skip feedback                                                   |
+---------------------------------------------------------------------+
```

### Update Pattern Index with Feedback

For each pattern with feedback:

1. **Read current stats** from `patterns/index.json`
2. **Update usage_stats**:
   ```json
   "usage_stats": {
     "times_used": previous + 1,
     "success_rate": weighted_average(previous_rate, new_score/5),
     "feedback": [...previous, "new feedback text"]
   }
   ```
3. **Write updated index**

### Success Rate Calculation

```
new_success_rate = (previous_rate × previous_uses + (score/5)) / (previous_uses + 1)
```

Example:
- Previous: 80% success rate, used 4 times
- New feedback: score 4 (80%)
- New rate: (0.8 × 4 + 0.8) / 5 = 0.8 (80%)

### Low Success Rate Alert

If pattern success_rate drops below 0.6 (60%):

```
⚠️  Pattern "async-result-extraction" has low success rate (55%)

Recent feedback:
  - "Needed heavy adaptation for list items"
  - "Pattern didn't fit pagination scenario"

Consider:
  [1] Review and update pattern
  [2] Add variant for different use cases
  [3] Mark as deprecated
  [4] Keep as-is for now
```

---

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

2. **Update pattern index (index.json)**
   - Read `~/.claude/vibe-ash-svelte/patterns/index.json`
   - Add new pattern entry with:
     ```json
     {
       "id": "{pattern-name}",
       "name": "{Pattern Title}",
       "path": "{category}/{pattern-name}.md",
       "category": "{category}",
       "tags": ["tag1", "tag2"],
       "triggers": ["keyword1", "keyword2"],
       "problem_keywords": ["problem1", "problem2"],
       "solution_summary": "Brief description of what the pattern does",
       "reusability_score": {calculated_score},
       "related": ["{related-pattern-ids}"],
       "usage_stats": {
         "times_used": 1,
         "success_rate": 1.0,
         "feedback": ["Discovered in {Project} / {Feature-ID}"]
       }
     }
     ```
   - Update `last_updated` timestamp

3. **Update patterns README**
   - Edit `~/.claude/vibe-ash-svelte/patterns/README.md`
   - Add entry to appropriate category table

4. **Remind user to commit**
   ```
   Pattern extracted: patterns/{category}/{pattern-name}.md
   Index updated: patterns/index.json

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
