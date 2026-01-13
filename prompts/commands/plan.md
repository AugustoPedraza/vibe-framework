# Sprint Planning Command

> `/vibe plan [sprint]` - Plan a sprint with Domain -> Designer -> PM phases

## Workflow

```
Domain Architect -> Designer -> Agile PM
```

## Before Starting

1. Load project config: `.claude/vibe.config.json`
2. Read all feature specs for the sprint
3. Read vision, glossary, design system

## AI Optimization: Parallel Feature Analysis

When planning a sprint with multiple features, analyze features in parallel:

```
┌─ Agent 1: Feature A Analysis
│   - Read feature spec
│   - Draft scenarios (Domain Architect lens)
│   - Identify dependencies
│
├─ Agent 2: Feature B Analysis
│   - Read feature spec
│   - Draft scenarios (Domain Architect lens)
│   - Identify dependencies
│
└─ Agent 3: Feature C Analysis
│   - Read feature spec
│   - Draft scenarios (Domain Architect lens)
│   - Identify dependencies
```

**Wait for all agents → Review cross-feature dependencies → Continue to Designer phase**

### When to Parallelize Planning

| Features in Sprint | Approach |
|--------------------|----------|
| 1-2 features | Sequential (no parallelization) |
| 3-5 features | Parallel (1 agent per feature, max 3) |
| 6+ features | Parallel in batches of 3 |

---

## Phases

### Phase 1: Domain Architect
- Load role: `~/.claude/vibe-ash-svelte/roles/domain-architect.md`
- Define/refine BDD scenarios for each feature
- If 3+ features: spawn parallel agents (see above)
- Identify Bootstrap Patterns for early features
- CHECKPOINT after each feature (or after all parallel agents complete)

### Phase 2: Designer
- Load role: `~/.claude/vibe-ash-svelte/roles/designer.md`
- Create wireframes or UI descriptions
- Define states (loading, error, empty)
- Verify touch targets and accessibility
- CHECKPOINT after each feature

### Phase 3: Agile PM
- Load role: `~/.claude/vibe-ash-svelte/roles/agile-pm.md`
- Review sprint scope and completeness
- Create GitHub issues
- Establish dependencies
- CHECKPOINT before creating issues

## Output

For each feature:
- Updated feature spec with scenarios
- UI wireframes or descriptions
- GitHub issue created

## Bootstrap Pattern Identification

For early features, Domain Architect should:
1. Identify what architecture patterns this feature establishes
2. Add "Bootstrap Patterns" section to feature spec
3. Reference relevant architecture docs
