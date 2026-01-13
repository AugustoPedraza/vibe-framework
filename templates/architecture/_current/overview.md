# Current Architecture

> Document what exists NOW (before migration)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | {current_stack.backend} |
| Frontend | {current_stack.frontend} |
| Database | PostgreSQL |
| Auth | {describe current auth} |

## Application Structure

```
lib/
├── {app}/                    # Business logic
│   ├── {context_1}/          # Context modules
│   └── {context_2}/
└── {app}_web/
    ├── controllers/
    ├── live/                  # LiveView modules
    └── templates/
```

## Key Patterns

### Data Access
- {Describe how data is accessed - Ecto directly, contexts, etc.}

### State Management
- {Describe how state is managed - LiveView assigns, etc.}

### Authentication/Authorization
- {Describe auth patterns - plugs, guards, etc.}

## Known Technical Debt

| Issue | Impact | Notes |
|-------|--------|-------|
| {debt_1} | {high/medium/low} | {description} |
| {debt_2} | {high/medium/low} | {description} |

## Migration Motivations

Why are we migrating to Ash+Svelte?

1. {reason_1}
2. {reason_2}
3. {reason_3}
