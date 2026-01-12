# Task Implementation Command

> `/vibe [FEATURE-ID]` - Implement a feature using TDD with UX integration

## Workflow

```
QA Engineer -> Designer -> Developer -> QA Validation
```

## Before Starting

1. Load project config: `.claude/vibe.config.json`
2. Read feature spec: `{{paths.features}}/{area}/{ID}.md`
3. Load vibe orchestrator: `~/.claude/vibe-framework/prompts/vibe.md`

## Phases

### Phase 1: QA Engineer
- Generate test stubs from acceptance scenarios
- Include UX test requirements (loading, error, empty states)
- CHECKPOINT before proceeding

### Phase 2: Designer
- Verify UX requirements from feature spec
- Confirm component selection
- Check PWA requirements if applicable
- CHECKPOINT before proceeding

### Phase 3: Developer
- TDD: RED -> GREEN -> REFACTOR
- Implement only what tests require (YAGNI)
- Follow UX implementation checklist
- CHECKPOINT after each scenario

### Phase 4: QA Validation
- Run full test suite
- Run quality checks
- UX verification checklist
- Offer PR creation
- Offer retrospective

## Bootstrap Features

For features that establish new patterns:
1. Check feature spec for "Bootstrap Patterns" section
2. Reference architecture docs for each pattern
3. Show "Patterns Established" summary at checkpoint

## Anti-Patterns

- Never auto-continue without checkpoint
- Never skip showing RED test failures
- Never implement multiple scenarios at once
- Never skip UX/Designer phase
