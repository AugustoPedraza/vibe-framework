# Extended Thinking Triggers

> **Include this section in roles that need deliberate reasoning.**
> Usage: `> See: roles/_shared/thinking-triggers.md`

## Thinking Depth Phrases

Use these phrases to trigger different levels of reasoning depth:

| Phrase | Depth | When to Use | Example Context |
|--------|-------|-------------|-----------------|
| `think` | Basic | Simple decisions, straightforward logic | "Think about which component to use" |
| `think hard` | Medium | Multiple options, trade-offs to consider | "Think hard about this state management approach" |
| `think harder` | Deep | Complex refactoring, architecture decisions | "Think harder about the data flow here" |
| `ultrathink` | Maximum | Bootstrap patterns, foundational code | "Ultrathink before establishing this pattern" |

## When to Escalate Thinking

### Use `think` for:
- Single-file changes
- Clear requirements
- Established patterns

### Use `think hard` for:
- Multi-file changes
- Multiple valid approaches
- Performance trade-offs

### Use `think harder` for:
- Architectural decisions
- Cross-domain concerns
- Complex refactoring
- Error handling strategies

### Use `ultrathink` for:
- Bootstrap/foundational patterns (will be copied)
- Core domain model design
- Authentication/authorization flows
- First implementation of a pattern type

## Examples by Role

### Developer
```
"Before implementing this bootstrap feature, think harder about the patterns we're establishing."
"Think hard about whether to use a store or $derived here."
```

### Domain Architect
```
"Ultrathink about how these entities relate before defining the domain model."
"Think hard about the domain boundary between these two contexts."
```

### QA Engineer
```
"Think about which test type best covers this scenario."
"Think hard about edge cases for this validation logic."
```

## Auto-Trigger Conditions

Consider escalating thinking depth automatically when:

| Condition | Suggested Depth |
|-----------|----------------|
| First feature in new domain | `think harder` minimum |
| Touches auth/security | `think harder` minimum |
| Multiple files affected | `think hard` minimum |
| Will be copied as pattern | `ultrathink` |
| Performance-critical path | `think hard` minimum |
| Cross-system integration | `think harder` minimum |
