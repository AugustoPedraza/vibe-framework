# Continuous Learning Agent

> Capture learnings, update patterns, and evolve the system.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | Needs reasoning for synthesis |
| **Context Budget** | ~30k tokens | Session history + patterns |
| **Output Files** | Multiple (see below) | Learning artifacts |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "sonnet",
  run_in_background: true,
  prompt: "..." // See below
})
```

---

## Responsibility

Run after Phase 4 completion or on-demand via `/vibe learn`:
- Extract reusable patterns from completed work
- Update patterns/index.json with new patterns
- Analyze human interventions for pitfall generation
- Track pattern usage and success rates
- Suggest pattern deprecation for low-success patterns

---

## Trigger Points

```
PHASE 4: POLISH
├── Polish watcher suggestions applied
└── User creates PR or skips
        ↓
PHASE 5: LEARNING (automatic)  ←── AUTO-TRIGGER
├── Spawn continuous-learning-agent
├── Extract patterns from implementation
├── Analyze fix sessions
├── Update pattern index
└── Generate pitfalls from interventions

On-Demand:
/vibe learn  ←── MANUAL TRIGGER
```

---

## Learning Sources

### 1. Fix Sessions

Repeated fixes indicate missing patterns:

```yaml
fix_sessions:
  source: ".claude/sessions/fix-*.json"
  signal: "Same type of fix applied 2+ times"
  action: "Extract as pattern"
  example:
    - "Added socket prop to LiveSvelte 3 times"
    - "→ Create pattern: liveview-svelte-integration"
```

### 2. Human Interventions

Corrections indicate knowledge gaps:

```yaml
human_interventions:
  source: "Session conversation history"
  detection_patterns:
    - id: explicit_correction
      signals: ["no, you should", "that's wrong", "you forgot"]
      severity: high
    - id: redo_request
      signals: ["try again", "redo this", "start over"]
      severity: high
    - id: manual_fix
      signals: ["I'll fix it", "I fixed it", "I had to change"]
      severity: medium
    - id: repeated_error
      signals: ["again", "same mistake", "keep forgetting"]
      severity: critical
  action: "Generate pitfall entry"
```

### 3. Successful Implementations

Clean implementations can become patterns:

```yaml
successful_implementations:
  source: "Completed feature files"
  criteria:
    - "No fix sessions required"
    - "Passed validation first try"
    - "High polish score (4.5+)"
  scoring:
    domain_independence: +2
    tech_generality: +2
    repetition: +1
    non_obvious: +1
    well_documented: +1
  threshold:
    high: 5+  # Auto-promote to patterns/
    medium: 3-4  # Consider for extraction
    low: <3  # Keep local
```

### 4. Watcher Reports

Recurring issues from watchers:

```yaml
watcher_reports:
  source: ".claude/qa/{ID}/*.json"
  signal: "Same issue type across 3+ features"
  action: "Create pitfall or update existing"
```

### 5. Refactoring Suggestions

Structural patterns from refactoring-analyzer:

```yaml
refactoring_suggestions:
  source: ".claude/qa/{ID}/refactoring-analyzer.json"
  signal: "Successful refactoring applied"
  action: "Document as pattern if generalizable"
```

---

## Learning Workflow

### Step 1: Human Intervention Analysis

Scan session for corrections:

```
+---------------------------------------------------------------------+
|  HUMAN INTERVENTION ANALYSIS                                         |
|                                                                      |
|  Session: AUTH-001 implementation                                    |
|  Interventions Detected: 2                                           |
|                                                                      |
|  1. [HIGH] Explicit Correction                                       |
|     User: "you forgot to add socket={@socket}"                       |
|     Category: Forgot required step                                   |
|     Existing pitfall: None                                           |
|     → Create PIT-XXX                                                 |
|                                                                      |
|  2. [MEDIUM] Manual Fix                                              |
|     User edited: LoginForm.svelte after AI edit                      |
|     Changed: Added $effect cleanup                                   |
|     Category: Missing cleanup pattern                                |
|     Existing pitfall: PIT-003 (update times_missed)                  |
|                                                                      |
|  [c] Create pitfalls  [s] Skip  [v] View details                     |
+---------------------------------------------------------------------+
```

### Step 2: Pattern Extraction

Analyze implementation for reusable patterns:

```
+---------------------------------------------------------------------+
|  PATTERN EXTRACTION                                                  |
|                                                                      |
|  Analyzing implementation files...                                   |
|                                                                      |
|  DETECTED PATTERNS:                                                  |
|                                                                      |
|  1. [HIGH: 6] Ash action with async notification                     |
|     File: lib/accounts/resources/user.ex:45-80                       |
|     Factors:                                                         |
|       +2 domain independent                                          |
|       +2 tech general (common Ash pattern)                           |
|       +1 appears 2x in codebase                                      |
|       +1 non-obvious (async timing)                                  |
|     → Will promote to: patterns/backend/ash-async-notification.md    |
|                                                                      |
|  2. [MEDIUM: 4] Form with real-time validation                       |
|     File: assets/svelte/components/features/auth/LoginForm.svelte    |
|     Factors:                                                         |
|       +2 domain independent                                          |
|       +1 appears 2x in codebase                                      |
|       +1 well-documented                                             |
|     → Consider for extraction                                        |
|                                                                      |
|  [1,2] Select to extract  [a] All  [s] Skip                          |
+---------------------------------------------------------------------+
```

### Step 3: Pattern Usage Feedback

Collect feedback on patterns used:

```
+---------------------------------------------------------------------+
|  PATTERN USAGE FEEDBACK                                              |
|                                                                      |
|  Patterns used this session:                                         |
|                                                                      |
|  1. async-result-extraction                                          |
|     Used in: lib/accounts/resources/user.ex                          |
|     How well did it work? [1-5]: ___                                 |
|     Feedback (optional): _______________                             |
|                                                                      |
|  2. liveview-form-binding                                            |
|     Used in: lib/syna_web/live/auth_live.ex                          |
|     How well did it work? [1-5]: ___                                 |
|                                                                      |
|  [s] Skip feedback  [Enter] Submit                                   |
+---------------------------------------------------------------------+
```

### Step 4: Update Pattern Index

Apply changes to patterns/index.json:

```json
{
  "patterns": [
    {
      "id": "ash-async-notification",
      "name": "Ash Action with Async Notification",
      "path": "backend/ash-async-notification.md",
      "category": "backend",
      "tags": ["ash", "async", "notification"],
      "triggers": ["notification", "async action", "after action"],
      "problem_keywords": ["notify after save", "async callback"],
      "solution_summary": "Use Ash notifier with async: true for post-action notifications",
      "reusability_score": 6,
      "usage_stats": {
        "times_used": 1,
        "success_rate": 1.0,
        "feedback": ["Discovered in Syna / AUTH-001"]
      },
      "created": "2026-01-28",
      "last_updated": "2026-01-28"
    }
  ],
  "last_updated": "2026-01-28T10:30:00Z"
}
```

### Step 5: Generate/Update Pitfalls

Write to `.claude/pitfalls.json`:

```json
{
  "pitfalls": [
    {
      "id": "PIT-004",
      "category": "liveview",
      "description": "Missing socket prop in Svelte component used with LiveView",
      "example": "User correction: 'you forgot to add socket={@socket}'",
      "solution": "Always pass socket={@socket} to LiveSvelte components",
      "check": {
        "type": "grep_pattern",
        "pattern": "live_svelte.*socket=",
        "paths": ["lib/*_web/live/"],
        "should_match": true
      },
      "severity": "blocker",
      "discovered_in": "AUTH-001",
      "discovered_at": "2026-01-28",
      "discovered_via": "human_intervention_analysis",
      "times_caught": 0,
      "times_missed": 1
    }
  ],
  "last_updated": "2026-01-28T10:30:00Z"
}
```

### Step 6: Learning Summary

Append to `.claude/learnings.md`:

```markdown
## 2026-01-28 - AUTH-001: User Login

### Implementation Summary
- Feature completed with 1 fix session
- Polish score: 4.5/5.0
- Time to completion: ~45 min

### Patterns Extracted
- **ash-async-notification** (HIGH: 6)
  - Async notification after Ash action
  - Promoted to patterns/backend/

### Pitfalls Generated
- **PIT-004**: Missing socket prop in LiveSvelte
  - From human correction
  - Severity: blocker

### Pattern Usage
| Pattern | Score | Feedback |
|---------|-------|----------|
| async-result-extraction | 4/5 | Needed minor adaptation |
| liveview-form-binding | 5/5 | Perfect fit |

### Recommendations
- Update polish-watcher to check for socket prop
- Consider adding socket prop to LiveSvelte template
```

---

## Output Files

| File | Purpose |
|------|---------|
| `patterns/{category}/{name}.md` | New pattern files |
| `patterns/index.json` | Updated pattern registry |
| `.claude/pitfalls.json` | Project-specific pitfalls |
| `.claude/learnings.md` | Session learning log |

---

## Pattern File Template

```markdown
# Pattern: {Name}

> {One-line description}

## Problem

{What problem does this pattern solve?}

## Solution

{Description of the approach}

## Example

{Code example with generic names - NO domain terms}

## When to Use

- {Condition 1}
- {Condition 2}

## When NOT to Use

- {Anti-pattern condition}

## Tech Stack

`tag1` `tag2` `tag3`

## Source

Discovered in: {Project} / {Feature ID}
Date: {Date}
```

---

## Success Rate Management

### Calculation

```
new_success_rate = (previous_rate × previous_uses + (score/5)) / (previous_uses + 1)
```

### Low Success Alert

When pattern drops below 60%:

```
+---------------------------------------------------------------------+
|  LOW SUCCESS RATE ALERT                                              |
|                                                                      |
|  Pattern: async-result-extraction                                    |
|  Current success rate: 55%                                           |
|  Uses: 5                                                             |
|                                                                      |
|  Recent feedback:                                                    |
|  - "Needed heavy adaptation for list items"                          |
|  - "Pattern didn't fit pagination scenario"                          |
|                                                                      |
|  Recommendations:                                                    |
|  [1] Review and update pattern                                       |
|  [2] Add variant for different use cases                             |
|  [3] Mark as deprecated                                              |
|  [4] Keep as-is                                                      |
+---------------------------------------------------------------------+
```

---

## Integration with Other Agents

### Receives From:
- **Orchestrator**: Trigger after Phase 4
- **Refactoring Analyzer**: Structural patterns
- **Polish Watcher**: Quality insights
- **Anti-Pattern Detector**: Recurring issues

### Outputs To:
- **Pattern Index**: New and updated patterns
- **Pitfalls**: New pitfall entries
- **Anti-Pattern Detector**: Updated pitfalls for checking

---

## Prompt Template

```
You are the Continuous Learning Agent for {FEATURE-ID}.

RESPONSIBILITY: Extract learnings and evolve the system

LEARNING SOURCES:
1. Fix sessions: {list from .claude/sessions/}
2. Human interventions: {detected from conversation}
3. Successful implementations: {files from feature}
4. Watcher reports: {from .claude/qa/}
5. Refactoring suggestions: {from analyzer}

CURRENT PATTERNS: {loaded from patterns/index.json}
CURRENT PITFALLS: {loaded from .claude/pitfalls.json}

TASKS:
1. Analyze human interventions for pitfall generation
2. Score implementation patterns for extraction
3. Collect pattern usage feedback
4. Update pattern index with stats
5. Generate/update pitfalls
6. Write learning summary

PATTERN SCORING:
- Domain independence: +2
- Tech generality: +2
- Repetition (2+): +1
- Non-obvious: +1
- Well-documented: +1

THRESHOLDS:
- HIGH (5+): Auto-promote to patterns/
- MEDIUM (3-4): Consider extraction
- LOW (<3): Keep local

PITFALL SEVERITY:
- Repeated error → blocker
- Explicit correction → warning
- Manual fix → warning

OUTPUT FILES:
- patterns/{category}/{name}.md (if HIGH score)
- patterns/index.json (always update)
- .claude/pitfalls.json (if interventions found)
- .claude/learnings.md (always append)

START LEARNING EXTRACTION.
```

---

## Quality Checklist

Before completing:
- [ ] Human interventions analyzed
- [ ] Pattern candidates scored
- [ ] Usage feedback collected (if patterns used)
- [ ] Pattern index updated
- [ ] Pitfalls generated (if applicable)
- [ ] Learning summary written
- [ ] Low success patterns flagged
