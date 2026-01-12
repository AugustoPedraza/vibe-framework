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

### Reusability Scoring

| Factor | High Score | Low Score |
|--------|-----------|-----------|
| Domain Independence | Works with any domain | Tied to specific business logic |
| Tech Generality | Common framework use | Edge case workaround |
| Repetition | Same pattern appears 2+ times | One-off solution |
| Complexity | Non-obvious solution | Simple/obvious approach |

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
