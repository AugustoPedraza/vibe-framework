# Reusable Architecture Patterns

> Patterns discovered across projects via retrospective extraction

---

## How Patterns Are Organized

```
patterns/
├── backend/        # Backend patterns (Ash, Elixir, etc.)
├── frontend/       # Frontend patterns (Svelte, stores, etc.)
├── pwa/            # PWA patterns (offline, service worker, etc.)
└── ux/             # UX patterns (loading states, errors, etc.)
```

---

## How Patterns Are Added

1. **During retrospective** (`/vibe retro`)
2. AI detects reusable patterns in implementation
3. AI scores pattern reusability (HIGH/MEDIUM)
4. User approves patterns to extract
5. AI creates pattern file using TEMPLATE.md
6. File added to appropriate category folder
7. This README index is updated

---

## Pattern Reusability Scoring

| Factor | High Score | Low Score |
|--------|-----------|-----------|
| **Domain Independence** | Works with any domain | Tied to specific business logic |
| **Tech Generality** | Common framework use | Edge case workaround |
| **Repetition** | Same pattern appears 2+ times | One-off solution |
| **Complexity** | Non-obvious solution | Simple/obvious approach |

Only MEDIUM or HIGH patterns are extracted.

---

## Using Patterns

When implementing a feature:

1. Check relevant category folder for existing patterns
2. Reference pattern file for approach and example
3. Adapt to your domain (patterns use generic examples)
4. Follow the "When to Use" / "When NOT to Use" guidance

---

## Pattern Index

### Backend Patterns

| Pattern | Description | Tags |
|---------|-------------|------|
| [async-result-extraction](backend/async-result-extraction.md) | Safely extract status from assign_async results | `elixir` `liveview` |
| [ash-get-or-create](backend/ash-get-or-create.md) | Idempotent resource retrieval that creates if not found | `elixir` `ash` |

### Frontend Patterns

| Pattern | Description | Tags |
|---------|-------------|------|
| [liveview-navigation](frontend/liveview-navigation.md) | App-like navigation with LiveView WebSocket | `liveview` `svelte` `pwa` |
| [async-image-fade-in](frontend/async-image-fade-in.md) | Smooth fade-in when async images load | `svelte5` `css` `pwa` |

### PWA Patterns

| Pattern | Description | Tags |
|---------|-------------|------|
| [user-scoped-cache](pwa/user-scoped-cache.md) | LocalStorage cache with user isolation and TTL | `typescript` `pwa` |

### UX Patterns

| Pattern | Description | Tags |
|---------|-------------|------|
| [directional-transitions](ux/directional-transitions.md) | Direction-aware screen animations | `css` `pwa` `a11y` |
| [motion-presets](ux/motion-presets.md) | Centralized animation presets with reduced-motion support | `svelte5` `a11y` |

---

## Contributing Patterns Manually

If you discover a pattern outside of retrospective:

1. Create file using TEMPLATE.md format
2. Place in appropriate category folder
3. Update this README index
4. Commit to vibe-ash-svelte repo
