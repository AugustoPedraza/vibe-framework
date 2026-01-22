# Estimation Command

> `/vibe estimate [scope]` - Three-point estimation with PERT calculation

## Purpose

Fill Practice #19: "Estimate to Avoid Surprises" from The Pragmatic Programmer.

Provide structured estimation with confidence intervals, historical tracking, and retrospective integration for calibration.

## Usage

```
/vibe estimate [FEATURE-ID]      # Estimate a feature
/vibe estimate --task "desc"     # Estimate ad-hoc task
/vibe estimate --calibrate       # Review historical accuracy
/vibe estimate --history         # Show past estimates
```

---

## Workflow

```
Scope -> Analysis -> Three-Point Estimate -> PERT Calculation -> Record
```

### Step 1: Scope Analysis

```
+======================================================================+
|  EST ESTIMATION                                                       |
|  Scope: [FEATURE-ID or task description]                              |
+======================================================================+
|                                                                       |
|  Analyzing scope...                                                   |
|                                                                       |
|  Components identified:                                               |
|  - [ ] Backend: [resource/action count]                               |
|  - [ ] Frontend: [component/view count]                               |
|  - [ ] Tests: [test file count]                                       |
|  - [ ] Integration: [touchpoints]                                     |
|                                                                       |
+======================================================================+
```

### Step 2: Three-Point Estimation

<!-- AI:DECISION_TREE estimation_method -->
```yaml
estimation_method:
  rules:
    - condition: "components <= 2 AND no_unknowns"
      method: "simple"
      description: "Single estimate, high confidence"
    - condition: "components <= 5 AND familiar_stack"
      method: "three_point"
      description: "O/M/P with standard PERT"
    - condition: "components > 5 OR unfamiliar_tech"
      method: "decomposed"
      description: "Break down, estimate parts, sum with buffer"
    - condition: "high_uncertainty OR research_required"
      method: "spike_first"
      description: "Timeboxed spike before estimation"
```
<!-- /AI:DECISION_TREE -->

### Three-Point Input

```
+---------------------------------------------------------------------+
|  THREE-POINT ESTIMATE                                                |
|                                                                      |
|  Task: [description]                                                 |
|                                                                      |
|  Optimistic (O): _____ [best case, everything goes right]            |
|  Most Likely (M): _____ [realistic, typical conditions]              |
|  Pessimistic (P): _____ [worst case, complications arise]            |
|                                                                      |
|  Units: [hours | story points | days]                                |
|                                                                      |
+---------------------------------------------------------------------+
```

### Step 3: PERT Calculation

```
+---------------------------------------------------------------------+
|  PERT ANALYSIS                                                       |
|                                                                      |
|  Formula: E = (O + 4M + P) / 6                                       |
|  Standard Deviation: SD = (P - O) / 6                                |
|                                                                      |
|  Results:                                                            |
|  - Expected (E): [value]                                             |
|  - Standard Deviation: [value]                                       |
|  - 68% Confidence: E +/- 1*SD = [range]                              |
|  - 95% Confidence: E +/- 2*SD = [range]                              |
|                                                                      |
|  Recommendation: Commit to [95% upper bound] externally              |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## AI-Friendly Output Schema

<!-- AI:SCHEMA estimation_output -->
```json
{
  "estimate_id": "EST-2026-001",
  "scope": {
    "feature_id": "FEATURE-ID",
    "description": "Brief description",
    "components": ["backend", "frontend", "tests"]
  },
  "three_point": {
    "optimistic": 4,
    "most_likely": 8,
    "pessimistic": 16,
    "unit": "hours"
  },
  "pert": {
    "expected": 8.67,
    "standard_deviation": 2.0,
    "confidence_68": { "low": 6.67, "high": 10.67 },
    "confidence_95": { "low": 4.67, "high": 12.67 }
  },
  "factors": {
    "complexity": "medium",
    "unknowns": ["third-party API behavior"],
    "dependencies": ["AUTH-001"],
    "risks": ["API rate limiting unclear"]
  },
  "recommendation": {
    "internal_target": 8.67,
    "external_commitment": 12.67,
    "buffer_percentage": 46
  },
  "created_at": "2026-01-22T10:00:00Z",
  "actual": null,
  "variance": null
}
```
<!-- /AI:SCHEMA -->

---

## Estimation Factors

### Complexity Multipliers

| Factor | Multiplier | When to Apply |
|--------|------------|---------------|
| New technology | 1.5x | First time using library/framework |
| Third-party integration | 1.3x | External API dependency |
| Multiple team coordination | 1.4x | Cross-team dependencies |
| Legacy code modification | 1.3x | Existing complex codebase |
| Security requirements | 1.2x | Auth, encryption, audit logging |
| Performance requirements | 1.2x | Specific latency/throughput targets |

### Reduction Factors

| Factor | Multiplier | When to Apply |
|--------|------------|---------------|
| Similar prior work | 0.8x | Done nearly identical task before |
| Excellent documentation | 0.9x | Clear specs, examples available |
| Pair programming | 0.85x | Two developers collaborating |

---

## Historical Tracking

### Recording Actuals

After completing a task, record actual time:

```
/vibe estimate --actual EST-2026-001 12.5
```

```
+---------------------------------------------------------------------+
|  ESTIMATE CLOSED                                                     |
|                                                                      |
|  ID: EST-2026-001                                                    |
|  Estimated (E): 8.67 hours                                           |
|  Actual: 12.5 hours                                                  |
|  Variance: +44% (over)                                               |
|                                                                      |
|  Analysis:                                                           |
|  - Within 95% confidence range: YES                                  |
|  - Primary variance cause: [user input or auto-detected]             |
|                                                                      |
|  Updated calibration factor: 1.15 (was 1.10)                         |
|                                                                      |
+---------------------------------------------------------------------+
```

### Calibration Review

```
/vibe estimate --calibrate
```

```
+---------------------------------------------------------------------+
|  ESTIMATION CALIBRATION REPORT                                       |
|                                                                      |
|  Period: Last 30 days                                                |
|  Estimates: 15                                                       |
|                                                                      |
|  Accuracy Metrics:                                                   |
|  - Mean Absolute Percentage Error (MAPE): 23%                        |
|  - Estimates within 95% CI: 87% (13/15)                              |
|  - Bias: Tends to underestimate by 15%                               |
|                                                                      |
|  By Category:                                                        |
|  | Category    | Count | Avg Variance | Trend    |                   |
|  |-------------|-------|--------------|----------|                   |
|  | Backend     |   6   |    +12%      | Improving|                   |
|  | Frontend    |   5   |    +28%      | Stable   |                   |
|  | Integration |   4   |    +35%      | Worsening|                   |
|                                                                      |
|  Recommendations:                                                    |
|  - Apply 1.35x multiplier to integration estimates                   |
|  - Frontend estimates need more buffer for unknowns                  |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## Integration with Retrospectives

### Auto-Generated Retro Items

When variance > 30%, automatically flag for retrospective:

```yaml
retro_items:
  - type: "estimation_variance"
    estimate_id: "EST-2026-001"
    expected: 8.67
    actual: 12.5
    variance: "+44%"
    questions:
      - "What unknowns weren't accounted for?"
      - "Should this factor into future estimates?"
      - "Was the scope creep or estimation error?"
```

### Retrospective Integration

During `/vibe retro`:

```
+---------------------------------------------------------------------+
|  ESTIMATION REVIEW                                                   |
|                                                                      |
|  Flagged estimates from this sprint:                                 |
|                                                                      |
|  EST-2026-001: Feature X (+44% over)                                 |
|    Cause: Third-party API had undocumented rate limits               |
|    Action: Add "API exploration spike" to similar estimates          |
|                                                                      |
|  EST-2026-003: Feature Y (-20% under)                                |
|    Cause: Reused existing component, faster than expected            |
|    Action: Reduce estimate when component reuse identified           |
|                                                                      |
+---------------------------------------------------------------------+
```

---

## Estimation Checklists

### Before Estimating

- [ ] Read feature spec completely
- [ ] Identify all components (backend, frontend, tests, docs)
- [ ] List known unknowns
- [ ] Check for similar past estimates
- [ ] Identify dependencies and blockers
- [ ] Consider integration touchpoints

### Estimation Sanity Checks

- [ ] Pessimistic is at least 2x optimistic
- [ ] Most likely is between O and P (not just average)
- [ ] Includes time for testing, not just coding
- [ ] Includes time for code review iterations
- [ ] Accounts for context switching if multi-tasking

### After Estimating

- [ ] Recorded in estimation log
- [ ] Communicated with appropriate confidence level
- [ ] External commitments use 95% upper bound
- [ ] Dependencies notified of timeline

---

## Anti-Patterns

### Estimation Mistakes

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Single-point estimates | No uncertainty communication | Always use three-point |
| Optimism bias | Consistently underestimate | Track actuals, apply calibration |
| Anchoring | First number heard dominates | Estimate independently first |
| Pressure estimates | "Just give me a number" | Push back, explain uncertainty |
| Forgetting overhead | Only counting coding time | Include testing, review, deployment |

### Communication Mistakes

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Treating estimates as commitments | Expectation mismatch | Distinguish estimate vs commitment |
| Not updating estimates | Stale information | Re-estimate when scope changes |
| Hiding uncertainty | False confidence | Always share confidence intervals |

---

## Quick Reference

### PERT Formulas

```
Expected Value (E) = (O + 4M + P) / 6
Standard Deviation (SD) = (P - O) / 6

68% Confidence Interval = E +/- SD
95% Confidence Interval = E +/- 2*SD
99% Confidence Interval = E +/- 3*SD
```

### Estimation Units

| Unit | Use When | Convert |
|------|----------|---------|
| Hours | Small tasks, < 1 day | - |
| Story Points | Relative sizing, sprint planning | 1 SP ~ 4-8 hours |
| Days | Multi-day tasks | 1 day ~ 6 productive hours |

### Communication Templates

**Internal (to team):**
> "I estimate this at 8-9 hours, with a range of 5-13 hours depending on [unknowns]."

**External (to stakeholders):**
> "We're targeting completion by [date based on 95% CI], with [date based on E] being likely if no complications arise."

---

## File Storage

Estimates are stored in `{{paths.features}}/_estimates/` as YAML:

```yaml
# _estimates/2026-01.yaml
estimates:
  - id: EST-2026-001
    feature_id: AUTH-001
    created: 2026-01-15
    three_point: { o: 4, m: 8, p: 16 }
    pert: { e: 8.67, sd: 2.0 }
    actual: 12.5
    closed: 2026-01-18
    variance: +44%
    notes: "API rate limiting discovery"
```
