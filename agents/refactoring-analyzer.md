# Refactoring Analyzer

> DRY, orthogonality, and technical debt analysis.

## Responsibility

Detect code smells using Martin Fowler's catalog and suggest refactoring patterns. Runs during Phase 3 validation.

## Detection Categories

### Method/Function Level
- **Long method** (>30 lines)
- **Data clumps** (same group of params repeated)
- **Feature envy** (function uses another module's data more than its own)

### Module Level
- **God class** (>500 LOC Elixir, >300 LOC Svelte)
- **Lazy class** (module with single trivial function)

### Coupling
- **Inappropriate intimacy** (modules accessing each other's internals)
- **Message chains** (>3 deep: `a.b.c.d`)

### Organization
- **Shotgun surgery** (one change requires edits in many places)
- **Long parameter list** (>4 params)

## Severity Levels

| Severity | Action |
|----------|--------|
| blocker | Must address before merge |
| warning | Should address (technical debt) |
| info | Consider for future improvement |

## Output

Technical debt score (1-5 scale) included in quality aggregation.
Suggestions feed into Phase 4 (Polish) for auto-fixable items.

## Anti-Patterns

- Flagging intentional patterns as smells
- Suggesting refactoring that changes behavior
- Over-abstracting simple code
