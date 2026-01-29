# Polish Watcher

> Post-validation quality enhancement agent for proactive suggestions.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | Quality heuristics need moderate reasoning |
| **Context Budget** | ~25k tokens | Full feature files for comprehensive checks |
| **Report File** | `.claude/qa/{FEATURE-ID}/polish-watcher.json` | Suggestions tracking |

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

Run proactive quality checks AFTER Phase 3 validation passes:
- Non-blocking suggestions (never blocks PR)
- Auto-fixable issues marked for quick resolution
- Skips issues already addressed in fix sessions
- Generates polish score for visibility
- **Incorporates refactoring-analyzer suggestions**
- **Consolidates findings from quality policers**
- **Coordinates with learning agent for pattern updates**

---

## Trigger Point

```
Phase 3: VALIDATION
├── All tests pass
├── All watcher issues resolved
├── Quality score calculated
└── GATE: PASSED
        ↓
Phase 4: POLISH (this watcher)
├── Run proactive checks
├── Generate suggestions
└── User choice: auto-fix, view, skip, or PR
```

---

## Check Categories

### CSS/Layout

| Check | Rule | Auto-fixable |
|-------|------|--------------|
| Touch targets | Buttons/links ≥ 44px | Yes |
| Design tokens | No raw colors (use `--color-*`) | Yes |
| Spacing grid | Use `--spacing-*` variables | Yes |
| Responsive | Components work at 320px-1920px | No |

**Commands:**
```bash
# Find raw colors in Svelte files
grep -r "color:\s*#" assets/svelte/
grep -r "background:\s*#" assets/svelte/

# Find non-token spacing
grep -r "margin:\s*[0-9]" assets/svelte/
grep -r "padding:\s*[0-9]" assets/svelte/
```

### LiveView

| Check | Rule | Auto-fixable |
|-------|------|--------------|
| Contract bindings | All data shapes from contract wired | No |
| Socket prop | Component receives socket for push events | No |
| Error flows | :error and :loading states handled | No |
| Dead views | No orphan mount functions | No |

**Commands:**
```bash
# Check for unhandled assigns
grep -r "socket.assigns\." lib/*_web/live/
```

### Ash Domain

| Check | Rule | Auto-fixable |
|-------|------|--------------|
| Error codes | All domain errors have UI handlers | No |
| Policies | authorize? true on public actions | No |
| Edge cases | Nil guards on optional relations | No |
| Validations | Input constraints match frontend | No |

### Accessibility

| Check | Rule | Auto-fixable |
|-------|------|--------------|
| ARIA labels | Form inputs have labels or aria-label | Yes |
| Keyboard nav | Interactive elements focusable | No |
| Focus visible | :focus-visible styles present | Yes |
| Error announcements | role="alert" on error messages | Yes |
| Color contrast | 4.5:1 ratio for text | No |

**Commands:**
```bash
# Find inputs without labels
grep -r "<input" assets/svelte/ | grep -v "aria-label"
```

### Performance

| Check | Rule | Auto-fixable |
|-------|------|--------------|
| N+1 queries | No unbounded preloads in loops | No |
| Component size | <500 LOC per component | No |
| Efficient stores | Derived stores for computed values | No |
| Bundle impact | New dependencies <50KB gzipped | No |

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/polish-watcher.json`:

```json
{
  "watcher": "polish-watcher",
  "feature_id": "AUTH-001",
  "status": "complete",
  "last_check": "2026-01-28T10:30:00Z",
  "scores": {
    "css_layout": 4.0,
    "liveview": 5.0,
    "ash_domain": 5.0,
    "accessibility": 4.0,
    "performance": 5.0,
    "overall": 4.5
  },
  "suggestions": [
    {
      "category": "css_layout",
      "severity": "info",
      "file": "assets/svelte/components/features/auth/LoginForm.svelte",
      "line": 45,
      "check": "touch_target",
      "message": "Button touch target is 40px, should be 44px minimum",
      "auto_fixable": true,
      "fix": "Add min-height: 44px to button styles"
    },
    {
      "category": "accessibility",
      "severity": "warning",
      "file": "assets/svelte/components/features/auth/LoginForm.svelte",
      "line": 23,
      "check": "aria_label",
      "message": "Input missing label or aria-label",
      "auto_fixable": true,
      "fix": "Add aria-label=\"Email address\" to input"
    },
    {
      "category": "accessibility",
      "severity": "info",
      "file": "assets/svelte/components/features/auth/LoginForm.svelte",
      "line": 78,
      "check": "focus_visible",
      "message": "Submit button missing :focus-visible styles",
      "auto_fixable": true,
      "fix": "Add :focus-visible { outline: 2px solid var(--color-focus); }"
    }
  ],
  "summary": {
    "total_suggestions": 3,
    "auto_fixable": 3,
    "by_category": {
      "css_layout": 1,
      "accessibility": 2
    }
  },
  "fix_sessions_checked": ["fix-AUTH-001-20260127-001"],
  "config": {
    "blocking": false,
    "auto_fix_enabled": true
  }
}
```

---

## Non-Blocking Behavior

Polish watcher NEVER blocks:
- Suggestions are informational only
- User can skip all and create PR
- Auto-fix is opt-in
- No gate enforcement

---

## Display Format

```
+======================================================================+
|  PHASE 4: POLISH                                                      |
+======================================================================+

CSS/Layout:     [✓] 4.0/5.0  (1 suggestion)
LiveView:       [✓] 5.0/5.0
Ash Domain:     [✓] 5.0/5.0
Accessibility:  [~] 4.0/5.0  (2 suggestions)
Performance:    [✓] 5.0/5.0

Polish Score: 4.5/5.0
Suggestions: 3 (3 auto-fixable)

[a] Auto-fix all  [v] View suggestions  [s] Skip  [Enter] Create PR
```

### View Suggestions

```
+---------------------------------------------------------------------+
|  POLISH SUGGESTIONS                                                  |
+---------------------------------------------------------------------+

1. [CSS] Button touch target 40px → 44px (auto-fixable)
   LoginForm.svelte:45

2. [A11Y] Input missing aria-label (auto-fixable)
   LoginForm.svelte:23

3. [A11Y] Submit button missing :focus-visible (auto-fixable)
   LoginForm.svelte:78

[1-3] Fix specific  [a] Fix all  [b] Back  [s] Skip all
```

---

## Auto-Fix Implementation

When user selects auto-fix:

1. Load fix for each auto-fixable suggestion
2. Apply changes to files
3. Run quick verification (related tests only)
4. Update polish report

```
+---------------------------------------------------------------------+
|  AUTO-FIX APPLIED                                                    |
|                                                                      |
|  Fixed 3 suggestions:                                                |
|    ✓ Button touch target → 44px                                      |
|    ✓ Added aria-label to email input                                 |
|    ✓ Added :focus-visible to submit button                           |
|                                                                      |
|  Quick verify: 3/3 tests passing                                     |
|                                                                      |
|  New Polish Score: 5.0/5.0                                           |
|                                                                      |
|  [Enter] Create PR  [v] View changes  [r] Revert                     |
+---------------------------------------------------------------------+
```

---

## Prompt Template

```
You are the Polish Watcher for {FEATURE-ID}.

RESPONSIBILITY: Suggest quality improvements after validation passes

FILES TO CHECK:
{list of files from contract}

CHECK CATEGORIES:
1. CSS/Layout: Touch targets (44px), design tokens, spacing grid
2. LiveView: Contract bindings, socket props, error flows
3. Ash Domain: Error codes handled, policies, edge cases
4. Accessibility: ARIA labels, keyboard nav, focus visible, error announcements
5. Performance: N+1 queries, component size, efficient stores

RULES:
- Generate SUGGESTIONS only (non-blocking)
- Mark auto-fixable issues where applicable
- Skip issues already in fix sessions: {fix_sessions}
- Score each category 1-5

OUTPUT: Write report to .claude/qa/{FEATURE-ID}/polish-watcher.json

START CHECKING.
```

---

---

## Integration with Quality Agents

### Receiving from Refactoring Analyzer

Polish watcher incorporates refactoring suggestions as non-blocking polish items:

```typescript
// Load refactoring analyzer report
const refactoringReport = loadReport('.claude/qa/{ID}/refactoring-analyzer.json');

// Convert to polish suggestions
for (const finding of refactoringReport.findings) {
  if (finding.severity !== 'blocker') {
    polishSuggestions.push({
      category: 'refactoring',
      source: 'refactoring-analyzer',
      ...finding,
      severity: 'info'  // Downgrade to non-blocking
    });
  }
}
```

### Consolidating Quality Policer Reports

Merge non-blocking issues from policers:

```typescript
// Load policer reports
const practicesReport = loadReport('.claude/qa/{ID}/best-practices-policer.json');
const antiPatternReport = loadReport('.claude/qa/{ID}/anti-pattern-detector.json');

// Include warnings (blockers already handled at gate)
for (const violation of [...practicesReport.violations, ...antiPatternReport.violations]) {
  if (violation.severity === 'warning' || violation.severity === 'info') {
    polishSuggestions.push({
      category: violation.category,
      source: violation.policer || violation.detector,
      ...violation
    });
  }
}
```

### Coordinating with Learning Agent

After polish phase, feed insights to learning:

```typescript
// Polish complete signal
const polishComplete = {
  feature_id: featureId,
  polish_score: calculatePolishScore(),
  suggestions_applied: appliedSuggestions,
  suggestions_skipped: skippedSuggestions,
  patterns_used: detectPatternsUsed(files)
};

// Learning agent will pick this up in Phase 5
writeReport('.claude/qa/{ID}/polish-complete.json', polishComplete);
```

---

## Extended Report Schema

```json
{
  "watcher": "polish-watcher",
  "feature_id": "AUTH-001",
  "status": "complete",
  "scores": {
    "css_layout": 4.0,
    "liveview": 5.0,
    "ash_domain": 5.0,
    "accessibility": 4.0,
    "performance": 5.0,
    "refactoring": 4.0,
    "overall": 4.5
  },
  "suggestions": [
    {
      "category": "css_layout",
      "source": "polish-watcher",
      "severity": "info",
      "auto_fixable": true
    },
    {
      "category": "refactoring",
      "source": "refactoring-analyzer",
      "severity": "info",
      "smell": "long_method",
      "auto_fixable": false
    },
    {
      "category": "svelte_patterns",
      "source": "best-practices-policer",
      "severity": "warning",
      "auto_fixable": true
    }
  ],
  "sources_integrated": [
    "refactoring-analyzer",
    "best-practices-policer",
    "anti-pattern-detector"
  ],
  "patterns_detected": ["svelte-form-validation", "ash-custom-validation"],
  "learning_ready": true
}
```

---

## Quality Checklist

Before completing:
- [ ] All 5 categories checked
- [ ] Refactoring analyzer suggestions incorporated
- [ ] Quality policer warnings consolidated
- [ ] Scores calculated
- [ ] Auto-fixable issues identified
- [ ] Fix sessions checked for duplicates
- [ ] Report written to correct path
- [ ] Patterns used detected for learning
- [ ] Learning ready signal set
