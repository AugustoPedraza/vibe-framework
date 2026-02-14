# Reusable Architecture Patterns

> Patterns discovered across projects via retrospective extraction

---

## Quick Pattern Matching (Performance Optimized)

For fast pattern matching, use the lightweight manifest:

```
1. Read manifest.json (~50 lines)
2. Match feature keywords against "triggers"
3. Filter by project stack
4. Load only matched pattern files
```

| File | Lines | Use For |
|------|-------|---------|
| `manifest.json` | ~50 | Quick matching (triggers + stack + score) |
| `index.json` | ~470 | Full details (anti-patterns, usage stats) |
| `{category}/{id}.md` | varies | Pattern implementation |

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

### From Retrospectives

1. **During retrospective** (`/vibe retro`)
2. AI detects reusable patterns in implementation
3. AI scores pattern reusability (HIGH/MEDIUM)
4. User approves patterns to extract
5. AI creates pattern file using TEMPLATE.md
6. File added to appropriate category folder
7. This README index is updated

### From Web Research (Automatic)

When `/vibe` encounters an interaction pattern not covered by local patterns, it runs multi-source web research and the human selects the best approach. If the chosen approach is pattern-worthy, it gets captured automatically:

1. **During build** — local patterns insufficient for the spec's interaction requirements
2. AI runs multi-source research across 4 tiers:
   - **Official docs** (MDN, svelte.dev, hexdocs.pm, ash-hq.org)
   - **Community battle-tested** (Stack Overflow highest-voted, GitHub issues/discussions)
   - **Community guides** (Dev.to, Reddit, blog posts)
   - **Framework-specific** (Svelte REPL, Ash cookbook, Phoenix forum)
3. AI presents 2-3 approaches with trade-offs to human
4. **Human selects** the approach to use
5. After successful build, AI evaluates if the solution is pattern-worthy
6. If yes: creates pattern file with `## Provenance` section (source tier, URL, community signal)
7. Pattern added to manifest.json — available for all future builds

This creates a **compounding effect**: each research investment grows the local catalog, reducing future research needs.

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
| [tab-navigation-shared-header](ux/tab-navigation-shared-header.md) | Tab navigation with constant header, switching content only | `svelte5` `liveview` `navigation` |

---

## Contributing Patterns Manually

If you discover a pattern outside of retrospective:

1. Create file using TEMPLATE.md format
2. Place in appropriate category folder
3. Update this README index
4. Commit to vibe-ash-svelte repo
