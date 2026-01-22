# AI Decision Trees

> Machine-parseable decision schemas for AI-assisted development

## Purpose

Provide structured decision trees that AI can parse and apply consistently. These schemas complement human-readable documentation with machine-actionable rules.

---

## Schema Format

All decision trees use YAML wrapped in HTML comments for dual-use:
- **Human-readable**: Markdown renders the YAML as a code block
- **AI-parseable**: Comments provide semantic markers for extraction

```markdown
<!-- AI:DECISION_TREE [tree_name] -->
```yaml
tree_name:
  rules:
    - condition: "expression"
      result: "outcome"
      workflow: "next_step"
```
<!-- /AI:DECISION_TREE -->
```

---

## Task Classification

<!-- AI:DECISION_TREE task_type -->
```yaml
task_type_decision:
  description: "Classify incoming task to determine appropriate workflow"
  inputs:
    - keywords: "extracted from task description"
    - file_count: "estimated files affected"
    - has_feature_spec: "boolean"
    - urgency: "normal | urgent | critical"
  rules:
    - condition: "urgency == 'critical' AND file_count == 1"
      result: "hotfix"
      workflow: "hotfix_workflow"
      phases: ["implement", "test", "deploy"]
      skip: ["planning", "design"]

    - condition: "keywords INTERSECT ['typo', 'copy', 'text'] AND file_count == 1"
      result: "trivial"
      workflow: "direct_edit"
      phases: ["implement"]
      skip: ["planning", "design", "qa"]

    - condition: "keywords INTERSECT ['bug', 'fix', 'broken'] AND file_count <= 3"
      result: "bug_fix"
      workflow: "quick_2_phase"
      phases: ["investigate", "implement", "test"]
      skip: ["design"]

    - condition: "has_feature_spec == true"
      result: "feature"
      workflow: "full_4_phase"
      phases: ["domain_architect", "qa_engineer", "designer", "developer"]
      skip: []

    - condition: "keywords INTERSECT ['refactor', 'cleanup', 'reorganize']"
      result: "refactor"
      workflow: "refactor_workflow"
      phases: ["analyze", "plan", "implement", "verify"]
      thinking_level: "think_hard"

    - condition: "keywords INTERSECT ['research', 'investigate', 'explore']"
      result: "exploration"
      workflow: "exploration_workflow"
      phases: ["research", "document"]
      skip: ["implement"]

  default:
    result: "feature"
    workflow: "full_4_phase"
```
<!-- /AI:DECISION_TREE -->

---

## Test Type Selection

<!-- AI:DECISION_TREE test_type -->
```yaml
test_type_decision:
  description: "Determine appropriate test type for a given scenario"
  inputs:
    - component_type: "resource | liveview | svelte | utility | integration"
    - has_side_effects: "boolean"
    - crosses_boundaries: "boolean"
    - user_facing: "boolean"
    - critical_path: "boolean"
  rules:
    - condition: "component_type == 'utility' AND has_side_effects == false"
      result: "unit_test"
      framework: "ExUnit or Vitest"
      location: "test/unit/ or __tests__/"
      priority: "high"

    - condition: "component_type == 'resource'"
      result: "unit_test"
      framework: "ExUnit with Ash test helpers"
      location: "test/domain/"
      priority: "high"

    - condition: "component_type == 'svelte' AND user_facing == true"
      result: "component_test"
      framework: "Vitest + Testing Library"
      location: "assets/svelte/**/__tests__/"
      priority: "high"

    - condition: "component_type == 'liveview'"
      result: "integration_test"
      framework: "Phoenix.LiveViewTest"
      location: "test/web/live/"
      priority: "high"

    - condition: "crosses_boundaries == true AND critical_path == true"
      result: "e2e_test"
      framework: "Playwright"
      location: "assets/tests/e2e/"
      priority: "critical"

    - condition: "crosses_boundaries == true"
      result: "integration_test"
      framework: "ExUnit with ConnCase"
      location: "test/web/"
      priority: "medium"

  pyramid_ratios:
    unit: "70%"
    integration: "20%"
    e2e: "10%"
```
<!-- /AI:DECISION_TREE -->

---

## Property-Based Test Selection

<!-- AI:DECISION_TREE property_test -->
```yaml
property_test_decision:
  description: "Determine if property-based testing is appropriate"
  inputs:
    - function_is_pure: "boolean"
    - has_inverse: "boolean"
    - has_mathematical_property: "boolean"
    - handles_user_input: "boolean"
    - has_edge_cases: "boolean"
  rules:
    - condition: "function_is_pure == true AND has_inverse == true"
      result: "roundtrip_property"
      pattern: "encode(decode(x)) == x"
      example: "JSON serialization, URL encoding, encryption"
      generators: ["arbitrary data matching input type"]

    - condition: "has_mathematical_property == true"
      result: "invariant_property"
      pattern: "property holds for all valid inputs"
      example: "sort is idempotent, length always positive"
      generators: ["lists, numbers, domain objects"]

    - condition: "handles_user_input == true"
      result: "fuzzing_property"
      pattern: "function never crashes on any input"
      example: "parser, validator, sanitizer"
      generators: ["strings, unicode, edge cases"]

    - condition: "has_edge_cases == true"
      result: "boundary_property"
      pattern: "function handles boundaries correctly"
      example: "empty list, max int, null"
      generators: ["boundary values + random"]

  skip_when:
    - "function has side effects"
    - "function depends on external state"
    - "function is trivial (< 3 lines)"
    - "function is I/O bound"
```
<!-- /AI:DECISION_TREE -->

---

## Thinking Level Selection

<!-- AI:DECISION_TREE thinking_level -->
```yaml
thinking_level_decision:
  description: "Select appropriate extended thinking level"
  inputs:
    - task_complexity: "trivial | simple | moderate | complex | critical"
    - is_bootstrap: "boolean"
    - has_multiple_approaches: "boolean"
    - affects_architecture: "boolean"
    - reversibility: "easy | moderate | difficult"
  rules:
    - condition: "task_complexity == 'trivial'"
      result: "none"
      description: "Direct implementation, no extended thinking"

    - condition: "task_complexity == 'simple' AND has_multiple_approaches == false"
      result: "think"
      description: "Basic reasoning, simple decisions"
      token_budget: "low"

    - condition: "has_multiple_approaches == true OR task_complexity == 'moderate'"
      result: "think_hard"
      description: "Multiple options, trade-offs to consider"
      token_budget: "medium"

    - condition: "affects_architecture == true OR reversibility == 'difficult'"
      result: "think_harder"
      description: "Complex refactoring, architecture decisions"
      token_budget: "high"

    - condition: "is_bootstrap == true OR task_complexity == 'critical'"
      result: "ultrathink"
      description: "Foundational code that will be copied"
      token_budget: "maximum"
```
<!-- /AI:DECISION_TREE -->

---

## Refactoring Decision

<!-- AI:DECISION_TREE refactoring -->
```yaml
refactoring_decision:
  description: "Decide when and how to refactor"
  inputs:
    - occurrence_count: "number of times pattern appears"
    - code_smell: "type of smell detected"
    - risk_level: "low | medium | high"
    - test_coverage: "percentage"
  rules:
    - condition: "occurrence_count < 3"
      result: "defer"
      action: "Note for future, don't refactor yet"
      reason: "Rule of Three - wait for third occurrence"

    - condition: "occurrence_count >= 3 AND test_coverage >= 80"
      result: "refactor_now"
      action: "Extract to shared module/component"
      thinking_level: "think_hard"

    - condition: "occurrence_count >= 3 AND test_coverage < 80"
      result: "add_tests_first"
      action: "Write characterization tests, then refactor"
      thinking_level: "think_hard"

    - condition: "code_smell == 'long_function' AND risk_level == 'low'"
      result: "refactor_now"
      action: "Extract method"
      thinking_level: "think"

    - condition: "code_smell == 'shotgun_surgery'"
      result: "plan_first"
      action: "Document all affected files, plan migration"
      thinking_level: "think_harder"

  code_smells:
    long_function:
      indicators: ["> 25 lines", "> 3 nesting levels"]
    duplication:
      indicators: [">= 3 occurrences", ">= 70% similarity"]
    shotgun_surgery:
      indicators: ["change requires > 3 files"]
    feature_envy:
      indicators: ["method uses more external data than own"]
    data_clump:
      indicators: ["same 3+ params appear together"]
```
<!-- /AI:DECISION_TREE -->

---

## Error Handling Strategy

<!-- AI:DECISION_TREE error_handling -->
```yaml
error_handling_decision:
  description: "Determine appropriate error handling strategy"
  inputs:
    - error_type: "user | auth | business | system | network"
    - context: "form | api | background | realtime"
    - recoverable: "boolean"
  rules:
    - condition: "error_type == 'user' AND context == 'form'"
      result: "inline_validation"
      ui: "Field-level error hints"
      log: false
      sentry: false

    - condition: "error_type == 'auth'"
      result: "auth_error"
      ui: "Toast + redirect to login"
      log: true
      sentry: false

    - condition: "error_type == 'business'"
      result: "business_error"
      ui: "User-friendly message in context"
      log: true
      sentry: false

    - condition: "error_type == 'system'"
      result: "system_error"
      ui: "Generic 'Something went wrong'"
      log: true
      sentry: true

    - condition: "error_type == 'network' AND recoverable == true"
      result: "retry"
      ui: "Retry button with offline indicator"
      log: false
      sentry: false
      retry_strategy: "exponential_backoff"

    - condition: "error_type == 'network' AND recoverable == false"
      result: "offline_queue"
      ui: "Queued indicator, sync when online"
      log: false
      sentry: false
```
<!-- /AI:DECISION_TREE -->

---

## Component Selection

<!-- AI:DECISION_TREE component_selection -->
```yaml
component_selection_decision:
  description: "Select appropriate UI component for use case"
  inputs:
    - options_count: "number of choices"
    - selection_type: "single | multiple"
    - display_context: "mobile | desktop | both"
    - content_type: "text | mixed | action"
  rules:
    - condition: "options_count == 2 AND selection_type == 'single'"
      result: "toggle"
      component: "Switch or SegmentedControl"
      anti_pattern: "dropdown"

    - condition: "options_count >= 2 AND options_count <= 5 AND selection_type == 'single'"
      result: "segmented"
      component: "SegmentedControl or RadioGroup"
      anti_pattern: "dropdown"

    - condition: "options_count > 5 AND options_count <= 10"
      result: "chips"
      component: "ChipGroup with scroll"
      anti_pattern: "long dropdown"

    - condition: "options_count > 10"
      result: "searchable"
      component: "Combobox with search"
      anti_pattern: "scrolling dropdown"

    - condition: "display_context == 'mobile' AND content_type == 'action'"
      result: "bottom_sheet"
      component: "BottomSheet"
      anti_pattern: "centered modal"

    - condition: "selection_type == 'multiple'"
      result: "checkbox_group"
      component: "CheckboxGroup or MultiSelect chips"
      anti_pattern: "multi-select dropdown"
```
<!-- /AI:DECISION_TREE -->

---

## Usage in Code

### Extracting Decision Trees

AI agents can extract and apply these trees:

```typescript
// Example: Parse decision tree from markdown
function extractDecisionTree(markdown: string, treeName: string): DecisionTree {
  const regex = new RegExp(
    `<!-- AI:DECISION_TREE ${treeName} -->\\s*\`\`\`yaml([\\s\\S]*?)\`\`\`\\s*<!-- /AI:DECISION_TREE -->`,
    'm'
  );
  const match = markdown.match(regex);
  if (match) {
    return parseYaml(match[1]);
  }
  return null;
}
```

### Applying Rules

```typescript
function applyDecisionTree(tree: DecisionTree, inputs: Record<string, any>): Decision {
  for (const rule of tree.rules) {
    if (evaluateCondition(rule.condition, inputs)) {
      return {
        result: rule.result,
        action: rule.action || rule.workflow,
        metadata: rule
      };
    }
  }
  return tree.default;
}
```

---

## Adding New Decision Trees

When adding a new decision tree:

1. **Define inputs clearly** - What information is needed?
2. **Order rules specific to general** - Most specific conditions first
3. **Include default case** - Handle unexpected inputs
4. **Add anti-patterns** - What NOT to do
5. **Document in this file** - Keep all trees in one place

### Template

```yaml
<!-- AI:DECISION_TREE new_tree_name -->
```yaml
new_tree_name:
  description: "What this tree decides"
  inputs:
    - input_1: "description"
    - input_2: "description"
  rules:
    - condition: "expression"
      result: "outcome"
      action: "what to do"
  default:
    result: "fallback"
```
<!-- /AI:DECISION_TREE -->
```
