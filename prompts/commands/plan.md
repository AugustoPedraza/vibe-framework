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

## Phases

### Phase 1: Domain Architect
- Load role: `~/.claude/vibe-ash-svelte/roles/domain-architect.md`
- Define/refine BDD scenarios for each feature
- Identify Bootstrap Patterns for early features
- CHECKPOINT after each feature

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
