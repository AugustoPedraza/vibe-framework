# Pattern Discovery

> How vibe finds and loads UX/implementation patterns from framework and project sources.

## Pattern Sources

### 1. Framework Patterns

Built-in patterns shipped with the vibe framework.

- **Location**: `~/.claude/vibe-ash-svelte/patterns/`
- **Index**: `~/.claude/vibe-ash-svelte/patterns/manifest.json`
- **Contains**: Generic Ash+Svelte patterns (auth, CRUD, real-time, PWA, etc.)
- **Managed by**: Framework maintainers

### 2. Project Patterns

Project-specific patterns that extend or override framework patterns.

- **Location**: `{project}/{patterns.catalog_path}` (configured in `vibe.config.json`)
- **Default path**: `docs/domain/ui-ux/patterns/`
- **Index**: `{project}/{patterns.manifest_path}` (if configured)
- **Contains**: Domain-specific patterns (e.g., navigation, forms, media interactions)
- **Managed by**: Project team (typically via BMAD UX design workflows)

## Configuration

In your project's `.claude/vibe.config.json`:

```json
{
  "patterns": {
    "catalog_path": "docs/domain/ui-ux/patterns/",
    "screen_types_path": "docs/domain/ui-ux/patterns/screen-types.md",
    "manifest_path": "docs/domain/ui-ux/patterns/manifest.json"
  }
}
```

| Field | Description | Default |
|-------|-------------|---------|
| `catalog_path` | Directory containing project pattern `.md` files | `docs/domain/ui-ux/patterns/` |
| `screen_types_path` | Screen-types matrix for completeness intelligence | `docs/domain/ui-ux/patterns/screen-types.md` |
| `manifest_path` | Project-level manifest.json (optional) | `null` |

## Merge Strategy

When both framework and project patterns are available:

1. **Load framework patterns** from `manifest.json`
2. **Load project patterns** from `{patterns.manifest_path}` (if configured and file exists)
3. **Merge**: Project patterns **override** framework patterns when IDs collide
4. **Combined set** is used for pattern matching during `/vibe` execution

### ID Collision Example

```
Framework: { "id": "mobile-first-layout", "source": "patterns/ux/mobile-first.md" }
Project:   { "id": "mobile-first-layout", "source": "docs/domain/ui-ux/patterns/mobile-first.md" }
Result:    Project version wins — the project has a more specific implementation
```

### 3. Web Research (On-Demand)

When local patterns don't cover the spec's interaction requirements, vibe runs live web research.

- **Trigger**: Pattern matching yields <2 results OR no score ≥5, AND spec contains `research_triggers` keywords (see `manifest.json`)
- **Sources**: Multi-tier search across official docs, community (SO, GitHub), guides (Dev.to, Reddit), and framework-specific resources
- **Human gate**: Agent presents 2-3 distinct approaches with trade-offs. Human picks the approach before build proceeds.
- **Pattern capture**: After successful build, research-informed solutions that are reusable get saved as local patterns with `## Provenance` section tracking source tier, URL, and community signal.
- **Compounding**: Each captured pattern reduces future research needs — the catalog grows organically from real implementation challenges.

#### Source Tiers

| Tier | Sources | Why |
|------|---------|-----|
| **1. Official docs** | MDN, svelte.dev, hexdocs.pm, ash-hq.org | Canonical, correct, authoritative |
| **2. Community battle-tested** | Stack Overflow (highest-voted), GitHub issues/discussions | Real-world workarounds, edge cases covered |
| **3. Community guides** | Dev.to, Reddit (r/sveltejs, r/elixir), blog posts | Practical tutorials, opinionated but useful |
| **4. Framework-specific** | Svelte REPL examples, Ash cookbook, Phoenix forum | Stack-specific idioms |

#### Search Strategy

```
1. WebSearch "{stack} {keyword} best practice" → official/canonical approach
2. WebSearch "{stack} {keyword} site:stackoverflow.com OR site:github.com" → community solutions
3. WebFetch top 2-3 results across different tiers (not all from same source)
4. Synthesize into 2-3 distinct approaches → PAUSE for human selection
```

## Pattern Matching

During `/vibe [ID]` execution:

1. Parse the feature spec or screen spec for technology keywords
2. Score each pattern in the merged set against the keywords (using `triggers` and `stack` fields)
3. Load top-scoring patterns into agent prompts
4. Agents apply pattern guidance during implementation

### Matching Fields

From `manifest.json` entries:

| Field | Purpose |
|-------|---------|
| `triggers` | Keywords that activate this pattern (e.g., "auth", "login", "session") |
| `stack` | Technology filter (e.g., ["svelte5", "ash"]) |
| `score` | Base relevance score (higher = more likely to match) |
| `source` | Path to the full pattern file |

## Adding Project Patterns

1. Create a pattern `.md` file in your `{patterns.catalog_path}` following the template in `patterns/TEMPLATE.md`
2. Optionally create a `manifest.json` at `{patterns.manifest_path}` to index your patterns
3. If no project manifest exists, patterns are discovered by direct file reference from screen specs

## Screen-Types Matrix

The `screen_types_path` file maps screen types to required patterns, enabling completeness checking:

```markdown
| Screen Type | Required Patterns |
|-------------|-------------------|
| List View | card-based-list, pull-to-refresh, empty-state, error-state |
| Detail View | stack-navigation, bottom-sheet, error-state |
| Form | full-screen-form, modal-dialog, toast-notification |
```

This matrix is project-specific and loaded from the configured path.
