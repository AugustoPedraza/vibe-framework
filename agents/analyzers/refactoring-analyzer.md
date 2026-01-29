# Refactoring Analyzer Agent

> Detect code smells and suggest refactoring patterns.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `sonnet` | Pattern detection needs reasoning |
| **Context Budget** | ~25k tokens | Full module analysis |
| **Report File** | `.claude/qa/{FEATURE-ID}/refactoring-analyzer.json` | Findings tracking |

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

Run during Phase 3 (Validation) or on-demand via `/vibe analyze`:
- Detect code smells using Martin Fowler's catalog
- Identify refactoring opportunities
- Score technical debt accumulation
- Suggest specific refactoring patterns with examples

---

## Trigger Points

```
Phase 3: VALIDATION
├── Aggregate watcher reports
├── Run refactoring-analyzer  ←── AUTO-TRIGGER
├── Calculate quality score
└── GATE: Must pass before Polish

On-Demand:
/vibe analyze [scope]  ←── MANUAL TRIGGER
```

---

## Detection Categories

### Method/Function Smells

| Smell | Detection | Severity | Refactoring |
|-------|-----------|----------|-------------|
| **Long Method** | >30 lines in function | warning | Extract Method |
| **Data Clumps** | Same 3+ params together repeatedly | warning | Extract Parameter Object |
| **Feature Envy** | Method uses another module's data extensively | warning | Move Method |
| **Long Parameter List** | >4 parameters | info | Introduce Parameter Object |

**Detection Commands:**
```bash
# Long methods in Elixir
grep -n "^  def " lib/**/*.ex | while read line; do
  # Count lines until next def or end
done

# Long functions in TypeScript
grep -n "function\|=>" assets/**/*.ts
```

### Class/Module Smells

| Smell | Detection | Severity | Refactoring |
|-------|-----------|----------|-------------|
| **God Class** | Module >500 LOC with multiple responsibilities | blocker | Extract Class |
| **Lazy Class** | Module <20 LOC with single simple function | info | Inline Class |
| **Speculative Generality** | Unused abstractions, unused parameters | warning | Remove Dead Code |
| **Data Class** | Module with only getters/setters, no behavior | info | Move Behavior |

**Detection Rules:**
```yaml
god_class:
  thresholds:
    elixir_module: "> 500 LOC"
    svelte_component: "> 300 LOC"
    typescript_file: "> 400 LOC"
  indicators:
    - "Multiple unrelated public functions"
    - "Many private helper functions"
    - "Imports from 5+ different domains"
```

### Coupling Smells

| Smell | Detection | Severity | Refactoring |
|-------|-----------|----------|-------------|
| **Inappropriate Intimacy** | Accessing private internals of another module | blocker | Move Method, Hide Delegate |
| **Message Chains** | `a.b.c.d.method()` chains >3 deep | warning | Hide Delegate |
| **Middle Man** | Module that only delegates to another | info | Remove Middle Man |

### Organization Smells

| Smell | Detection | Severity | Refactoring |
|-------|-----------|----------|-------------|
| **Shotgun Surgery** | One change requires edits in many files | warning | Move Method, Inline Class |
| **Divergent Change** | One class changed for multiple reasons | warning | Extract Class |
| **Parallel Inheritance** | Creating subclass requires parallel subclass elsewhere | warning | Move Method |

---

## Analysis Workflow

### Step 1: Scope Identification

```
+---------------------------------------------------------------------+
|  REFACTORING ANALYSIS                                                |
|                                                                      |
|  Scope: [feature | module | all]                                     |
|  Files: [count]                                                      |
|                                                                      |
|  Analyzing...                                                        |
|  [====================] 100%                                         |
+---------------------------------------------------------------------+
```

### Step 2: Smell Detection

For each file in scope:
1. Calculate LOC and complexity metrics
2. Check against smell patterns
3. Cross-reference with other modules for coupling
4. Score technical debt contribution

### Step 3: Report Generation

```
+---------------------------------------------------------------------+
|  REFACTORING OPPORTUNITIES                                           |
|                                                                      |
|  BLOCKERS (must address):                                            |
|  ! [GOD CLASS] lib/accounts/user.ex                                  |
|    LOC: 650 | Responsibilities: 4 detected                           |
|    Suggestion: Extract NotificationPreferences, SessionManager       |
|                                                                      |
|  WARNINGS (should address):                                          |
|  ~ [LONG METHOD] lib/chat/message_handler.ex:process/2               |
|    Lines: 45 | Cyclomatic: 12                                        |
|    Suggestion: Extract validation, transformation steps              |
|                                                                      |
|  ~ [DATA CLUMPS] (user_id, org_id, role) appears 5 times             |
|    Files: controller.ex, live.ex, context.ex                         |
|    Suggestion: Extract UserContext struct                            |
|                                                                      |
|  INFO (consider):                                                    |
|  ? [LAZY CLASS] lib/utils/string_helper.ex                           |
|    LOC: 15 | Functions: 1                                            |
|    Suggestion: Inline into caller or expand responsibility           |
|                                                                      |
|  Technical Debt Score: 3.2/5.0                                       |
|                                                                      |
|  [f] Fix blockers  [v] View details  [s] Skip  [l] Feed to learning  |
+---------------------------------------------------------------------+
```

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/refactoring-analyzer.json`:

```json
{
  "analyzer": "refactoring-analyzer",
  "feature_id": "AUTH-001",
  "scope": "feature",
  "status": "complete",
  "timestamp": "2026-01-28T10:30:00Z",
  "metrics": {
    "files_analyzed": 12,
    "total_loc": 2450,
    "avg_complexity": 4.2
  },
  "findings": [
    {
      "id": "RF-001",
      "category": "class_module",
      "smell": "god_class",
      "severity": "blocker",
      "file": "lib/accounts/user.ex",
      "metrics": {
        "loc": 650,
        "responsibilities": 4,
        "complexity": 28
      },
      "suggestion": {
        "refactoring": "Extract Class",
        "details": "Extract NotificationPreferences and SessionManager to separate modules",
        "example": "See patterns/backend/extract-class.md"
      },
      "auto_fixable": false
    },
    {
      "id": "RF-002",
      "category": "method_function",
      "smell": "long_method",
      "severity": "warning",
      "file": "lib/chat/message_handler.ex",
      "line": 45,
      "function": "process/2",
      "metrics": {
        "loc": 45,
        "cyclomatic": 12
      },
      "suggestion": {
        "refactoring": "Extract Method",
        "details": "Extract validate_message/1, transform_content/1, persist_message/1",
        "auto_fixable": true
      }
    }
  ],
  "debt_score": 3.2,
  "summary": {
    "blockers": 1,
    "warnings": 2,
    "info": 1,
    "auto_fixable": 1
  }
}
```

---

## Integration with Other Agents

### Feeds To:
- **Polish Watcher**: Includes refactoring suggestions in polish report
- **Continuous Learning Agent**: Extracts patterns from successful refactorings
- **Review Command**: Part of comprehensive code review

### Receives From:
- **Orchestrator**: Triggered in Phase 3 or via `/vibe analyze`
- **Anti-Pattern Detector**: Cross-references architectural violations

---

## Prompt Template

```
You are the Refactoring Analyzer for {SCOPE}.

RESPONSIBILITY: Detect code smells and suggest refactoring patterns

FILES TO ANALYZE:
{list of files}

DETECTION CATEGORIES:
1. Method/Function: Long method, data clumps, feature envy
2. Class/Module: God class, lazy class, speculative generality
3. Coupling: Inappropriate intimacy, message chains
4. Organization: Shotgun surgery, divergent change

MARTIN FOWLER'S CATALOG REFERENCE:
- Extract Method: When you have a code fragment that can be grouped together
- Extract Class: When a class is doing work that should be done by two
- Move Method: When a method is used more by another class than its own
- Replace Parameter with Object: When you have a group of parameters that go together

THRESHOLDS:
- Long method: >30 lines
- God class: >500 LOC (Elixir), >300 LOC (Svelte)
- Long parameter list: >4 parameters
- Message chain: >3 deep

RULES:
- Score each finding by severity (blocker, warning, info)
- Provide specific refactoring suggestions
- Reference patterns where applicable
- Calculate overall technical debt score (1-5)

OUTPUT: Write report to .claude/qa/{SCOPE}/refactoring-analyzer.json

START ANALYSIS.
```

---

## Quality Checklist

Before completing:
- [ ] All files in scope analyzed
- [ ] Metrics calculated (LOC, complexity)
- [ ] Smells categorized by severity
- [ ] Refactoring suggestions provided
- [ ] Debt score calculated
- [ ] Report written to correct path
