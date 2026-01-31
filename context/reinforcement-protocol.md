# Context Reinforcement Protocol

> Rules for when and how to reload context to prevent mid-implementation drift.

## Problem

Claude forgets patterns mid-implementation, reverting to wrong syntax:
- Uses React patterns in Svelte 5
- Uses OOP patterns in Elixir
- Forgets design tokens for raw Tailwind
- Loses track of naming conventions

## Solution: Progress-Based Context Reload

### Reload Triggers

| Progress | Trigger | What to Reload |
|----------|---------|----------------|
| 25% | First file complete | Pattern syntax anchors |
| 50% | Midpoint | Anti-patterns reminder |
| 75% | Final stretch | Naming conventions, consistency check |
| 100% | Completion | Validation checklist |

### Syntax Anchors

Every pattern file MUST include a `<!-- AI:SYNTAX_ANCHOR -->` section with:

1. **Correct syntax** - Copy-paste examples
2. **Wrong syntax** - Common mistakes to avoid
3. **Key differences** - Why this pattern differs from similar ones

Example:
```markdown
<!-- AI:SYNTAX_ANCHOR -->
## Syntax Anchor

### Correct (Svelte 5)
```svelte
let count = $state(0);
const doubled = $derived(count * 2);
```

### Wrong (Svelte 4 / React)
```svelte
// WRONG: Svelte 4 syntax
let count = 0;
$: doubled = count * 2;

// WRONG: React syntax
const [count, setCount] = useState(0);
```

### Key Difference
Svelte 5 uses runes ($state, $derived, $effect) not reactive declarations ($:).
<!-- /AI:SYNTAX_ANCHOR -->
```

## Implementation Rules

### For Orchestrator

At each progress milestone, inject reminder:

```markdown
## Context Reinforcement (25% checkpoint)

You are implementing [feature]. Verify you are using:

1. **Svelte 5 runes** - $state, $derived, $effect (not $: or useState)
2. **Design tokens** - bg-surface, text-primary (not bg-gray-100, text-blue-500)
3. **Ash patterns** - Domain.action() (not Repo.insert)

Review syntax anchors in loaded patterns before continuing.
```

### For Pattern Files

Every pattern MUST include:

1. `<!-- AI:SYNTAX_ANCHOR -->` section (required)
2. Correct/Wrong comparison examples
3. "Key Difference" explanation

### For Interface Contracts

Add `pinned_context` field to contract schema:

```json
{
  "pinned_context": {
    "syntax_anchors": ["svelte5-runes", "ash-actions", "design-tokens"],
    "anti_patterns": ["react-hooks", "oop-classes", "raw-tailwind"],
    "naming": {
      "components": "PascalCase",
      "files": "kebab-case",
      "events": "noun:verb"
    }
  }
}
```

## Reinforcement Content Templates

### 25% Checkpoint (First File Complete)

```markdown
## Syntax Check

Before continuing, verify your last file uses:

✓ Svelte 5: `let x = $state()` not `let x = 0; $: ...`
✓ Ash: `Domain.action()` not `Repo.insert()`
✓ Tokens: `bg-surface` not `bg-gray-100`

If any are wrong, fix before proceeding.
```

### 50% Checkpoint (Midpoint)

```markdown
## Anti-Pattern Check

Common mistakes at this stage:

✗ Mixing React patterns (useState, useEffect)
✗ Adding unnecessary abstraction layers
✗ Using raw Tailwind colors
✗ Over-engineering simple features

Review anti-patterns/ docs if unsure.
```

### 75% Checkpoint (Final Stretch)

```markdown
## Consistency Check

Verify naming is consistent:

- Components: PascalCase (UserCard, not user-card)
- Files: kebab-case (user-card.svelte, not UserCard.svelte)
- Events: noun:verb (user:created, not userCreated)
- CSS: design tokens only

Cross-reference with existing code patterns.
```

### 100% Checkpoint (Completion)

```markdown
## Final Validation

Before marking complete:

- [ ] All syntax matches project patterns
- [ ] No anti-patterns introduced
- [ ] Naming is consistent throughout
- [ ] Tests pass
- [ ] Types check
```

## Measuring Effectiveness

Track these metrics:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Syntax drift | < 5% | Wrong syntax in reviews |
| Pattern violations | < 10% | Lint/validation failures |
| Naming inconsistency | 0 | Cross-file naming mismatches |

## Related

- `patterns/TEMPLATE.md` - Pattern template with syntax anchor
- `agents/orchestrator/core.md` - Orchestrator with checkpoints
- `anti-patterns/` - What to avoid
