# Patterns Command

> `/vibe patterns [action]` - Search, browse, and manage patterns

## Purpose

Interact with the pattern library. List available patterns, search for specific solutions, view pattern details, check usage statistics, and manage pattern lifecycle.

## Usage

```
/vibe patterns                    # List all patterns
/vibe patterns search "form"      # Search patterns by keyword
/vibe patterns show <id>          # Show pattern details
/vibe patterns stats              # Show usage statistics
/vibe patterns deprecate <id>     # Mark pattern deprecated
/vibe patterns refresh            # Reload pattern index
```

---

## Actions

### List All Patterns

```
/vibe patterns

+======================================================================+
|  PATTERN LIBRARY                                                      |
|  Patterns: 24 | Categories: 4 | Last updated: 2026-01-28              |
+======================================================================+

BACKEND (8 patterns)
┌─────────────────────────────────────────────────────────────────────┐
│ ID                        │ Name                        │ Score │ Uses │
│---------------------------│-----------------------------│-------│------│
│ ash-async-notification    │ Ash Action with Async...    │ 6     │ 3    │
│ ash-custom-validation     │ Ash Custom Validation       │ 5     │ 7    │
│ ash-multi-step-action     │ Ash Multi-Step Action       │ 6     │ 2    │
│ phoenix-pubsub-channel    │ Phoenix PubSub Channel      │ 5     │ 4    │
│ ...                       │ ...                         │ ...   │ ...  │
└─────────────────────────────────────────────────────────────────────┘

FRONTEND (7 patterns)
┌─────────────────────────────────────────────────────────────────────┐
│ ID                        │ Name                        │ Score │ Uses │
│---------------------------│-----------------------------│-------│------│
│ svelte-form-validation    │ Form with Real-time...      │ 5     │ 5    │
│ svelte-optimistic-ui      │ Optimistic UI Updates       │ 4     │ 3    │
│ svelte-infinite-scroll    │ Infinite Scroll List        │ 5     │ 2    │
│ ...                       │ ...                         │ ...   │ ...  │
└─────────────────────────────────────────────────────────────────────┘

PWA (5 patterns)
┌─────────────────────────────────────────────────────────────────────┐
│ offline-first-data        │ Offline-First Data Sync     │ 6     │ 1    │
│ service-worker-cache      │ Service Worker Caching      │ 5     │ 2    │
│ ...                       │ ...                         │ ...   │ ...  │
└─────────────────────────────────────────────────────────────────────┘

UX (4 patterns)
┌─────────────────────────────────────────────────────────────────────┐
│ skeleton-loading          │ Skeleton Loading States     │ 5     │ 8    │
│ error-boundary            │ Error Boundary Pattern      │ 5     │ 4    │
│ ...                       │ ...                         │ ...   │ ...  │
└─────────────────────────────────────────────────────────────────────┘

[s] Search  [c] By category  [t] By tag  [Enter] Exit
```

---

### Search Patterns

```
/vibe patterns search "form validation"

+---------------------------------------------------------------------+
|  SEARCH: "form validation"                                           |
|  Results: 3 patterns                                                 |
+---------------------------------------------------------------------+

1. svelte-form-validation (Score: 5, Uses: 5)
   Form with real-time validation using $derived
   Tags: svelte, form, validation, runes
   Match: name, tags

2. ash-custom-validation (Score: 5, Uses: 7)
   Ash custom validation with changeset
   Tags: ash, validation, changeset
   Match: tags

3. liveview-form-binding (Score: 4, Uses: 3)
   LiveView form binding with Svelte
   Tags: liveview, form, svelte
   Match: tags

[1-3] Show details  [Enter] Exit
```

**Search targets:**
- Pattern name
- Description
- Tags
- Problem keywords
- Solution summary

---

### Show Pattern Details

```
/vibe patterns show svelte-form-validation

+======================================================================+
|  PATTERN: svelte-form-validation                                      |
+======================================================================+

NAME: Form with Real-time Validation

CATEGORY: frontend
TAGS: svelte, form, validation, runes, derived

PROBLEM:
Need to validate form inputs as user types, showing immediate feedback
without excessive re-renders or API calls.

SOLUTION:
Use $state for form values and $derived for validation results.
Debounce expensive validations. Show inline errors with proper
accessibility attributes.

EXAMPLE:
```svelte
<script>
  let { onSubmit } = $props();

  let email = $state('');
  let password = $state('');

  let emailError = $derived(
    email && !email.includes('@') ? 'Invalid email' : null
  );

  let isValid = $derived(
    email && password && !emailError
  );
</script>

<form onsubmit={onSubmit}>
  <input bind:value={email} aria-invalid={!!emailError} />
  {#if emailError}
    <span role="alert">{emailError}</span>
  {/if}
  <button disabled={!isValid}>Submit</button>
</form>
```

WHEN TO USE:
- Forms with immediate validation feedback
- Complex validation rules
- Multi-field dependent validation

WHEN NOT TO USE:
- Simple forms with server-side validation only
- Forms where validation is expensive (use debounce)

USAGE STATS:
  Times used: 5
  Success rate: 92%
  Last used: 2026-01-27

FEEDBACK:
  - "Perfect for login forms"
  - "Needed to add debounce for email uniqueness check"

SOURCE:
  Discovered in: Syna / AUTH-001
  Date: 2026-01-15

[u] Use this pattern  [r] Rate usage  [e] Edit  [Enter] Back
```

---

### Show Statistics

```
/vibe patterns stats

+======================================================================+
|  PATTERN STATISTICS                                                   |
+======================================================================+

OVERVIEW
┌─────────────────────────────────────────────────────────────────────┐
│ Total patterns: 24                                                   │
│ Total uses: 87                                                       │
│ Average success rate: 84%                                            │
│ Patterns this month: 3 new, 2 deprecated                             │
└─────────────────────────────────────────────────────────────────────┘

TOP USED PATTERNS
┌─────────────────────────────────────────────────────────────────────┐
│ 1. skeleton-loading         │ 8 uses  │ 95% success                  │
│ 2. ash-custom-validation    │ 7 uses  │ 89% success                  │
│ 3. svelte-form-validation   │ 5 uses  │ 92% success                  │
│ 4. error-boundary           │ 4 uses  │ 88% success                  │
│ 5. phoenix-pubsub-channel   │ 4 uses  │ 85% success                  │
└─────────────────────────────────────────────────────────────────────┘

LOW SUCCESS PATTERNS (< 70%)
┌─────────────────────────────────────────────────────────────────────┐
│ ! async-result-extraction   │ 5 uses  │ 55% success │ Review needed  │
│ ~ svelte-store-migration    │ 2 uses  │ 65% success │ Consider update│
└─────────────────────────────────────────────────────────────────────┘

UNUSED PATTERNS (> 30 days)
┌─────────────────────────────────────────────────────────────────────┐
│ ? offline-queue-retry       │ Last used: 2025-12-15 │ Consider deprecate │
│ ? legacy-adapter-pattern    │ Last used: 2025-12-01 │ Consider deprecate │
└─────────────────────────────────────────────────────────────────────┘

BY CATEGORY
┌─────────────────────────────────────────────────────────────────────┐
│ backend:  8 patterns, 23 uses, 87% avg success                       │
│ frontend: 7 patterns, 32 uses, 89% avg success                       │
│ pwa:      5 patterns, 12 uses, 78% avg success                       │
│ ux:       4 patterns, 20 uses, 91% avg success                       │
└─────────────────────────────────────────────────────────────────────┘

[r] Review low success  [d] Deprecate unused  [Enter] Exit
```

---

### Deprecate Pattern

```
/vibe patterns deprecate async-result-extraction

+---------------------------------------------------------------------+
|  DEPRECATE PATTERN                                                   |
|                                                                      |
|  Pattern: async-result-extraction                                    |
|  Current status: active                                              |
|  Success rate: 55%                                                   |
|  Uses: 5                                                             |
|                                                                      |
|  Recent feedback:                                                    |
|  - "Needed heavy adaptation for list items"                          |
|  - "Pattern didn't fit pagination scenario"                          |
|  - "Works for single items only"                                     |
|                                                                      |
|  Deprecation will:                                                   |
|  - Mark pattern as deprecated in index                               |
|  - Hide from default search results                                  |
|  - Keep pattern file for reference                                   |
|  - Stop suggesting in implementations                                |
|                                                                      |
|  Reason for deprecation: _______________                             |
|                                                                      |
|  [d] Deprecate  [u] Update instead  [c] Cancel                       |
+---------------------------------------------------------------------+
```

After deprecation:

```json
{
  "id": "async-result-extraction",
  "status": "deprecated",
  "deprecated_at": "2026-01-28",
  "deprecated_reason": "Does not scale to list scenarios",
  "replacement": "async-batch-extraction"
}
```

---

### Refresh Index

```
/vibe patterns refresh

+---------------------------------------------------------------------+
|  REFRESHING PATTERN INDEX                                            |
|                                                                      |
|  Scanning patterns/...                                               |
|  [====================] 100%                                         |
|                                                                      |
|  Results:                                                            |
|  * Files scanned: 28                                                 |
|  * Active patterns: 24                                               |
|  * Deprecated patterns: 4                                            |
|  * New patterns found: 1                                             |
|  * Missing files: 0                                                  |
|                                                                      |
|  Index updated: patterns/index.json                                  |
+---------------------------------------------------------------------+
```

---

## Pattern Index Schema

`patterns/index.json`:

```json
{
  "version": "1.0",
  "last_updated": "2026-01-28T10:30:00Z",
  "patterns": [
    {
      "id": "svelte-form-validation",
      "name": "Form with Real-time Validation",
      "path": "frontend/svelte-form-validation.md",
      "category": "frontend",
      "tags": ["svelte", "form", "validation", "runes"],
      "triggers": ["form validation", "real-time", "input validation"],
      "problem_keywords": ["validate input", "form feedback", "inline errors"],
      "solution_summary": "Use $state and $derived for reactive validation",
      "reusability_score": 5,
      "status": "active",
      "usage_stats": {
        "times_used": 5,
        "success_rate": 0.92,
        "last_used": "2026-01-27",
        "feedback": ["Perfect for login forms", "Needed debounce addition"]
      },
      "related": ["liveview-form-binding", "ash-custom-validation"],
      "created": "2026-01-15",
      "created_from": "Syna / AUTH-001"
    }
  ],
  "categories": {
    "backend": { "count": 8, "path": "backend/" },
    "frontend": { "count": 7, "path": "frontend/" },
    "pwa": { "count": 5, "path": "pwa/" },
    "ux": { "count": 4, "path": "ux/" }
  }
}
```

---

## Flags

| Flag | Description |
|------|-------------|
| `--category <cat>` | Filter by category |
| `--tag <tag>` | Filter by tag |
| `--min-score <n>` | Filter by minimum score |
| `--include-deprecated` | Include deprecated patterns |
| `--json` | Output as JSON |

---

## Examples

### Find Pattern for Problem

```
/vibe patterns search "loading state"

Results: 2 patterns
1. skeleton-loading (95% success)
2. loading-boundary (88% success)

/vibe patterns show skeleton-loading
```

### Review Low Success Patterns

```
/vibe patterns stats
  ↓
[r] Review low success
  ↓
Shows patterns < 70% success with feedback
  ↓
[u] Update pattern  [d] Deprecate
```

### Add Pattern to Project

```
/vibe patterns show svelte-form-validation
  ↓
[u] Use this pattern
  ↓
Pattern context loaded into current session
AI will reference this pattern during implementation
```

---

## Integration

### With Implementation

During `/vibe [ID]`:
- AI searches patterns for relevant solutions
- Matches problem keywords to feature spec
- Suggests applicable patterns

### With Learn

After `/vibe learn`:
- New patterns added to index
- Usage stats updated
- Deprecated patterns flagged

### With Review

During `/vibe review`:
- Checks pattern compliance
- Flags deviations from used patterns
- Suggests pattern updates based on implementation

---

## Pattern Categories

| Category | Location | Content |
|----------|----------|---------|
| `backend` | `patterns/backend/` | Ash, Phoenix, Elixir patterns |
| `frontend` | `patterns/frontend/` | Svelte, TypeScript patterns |
| `pwa` | `patterns/pwa/` | Offline, service worker patterns |
| `ux` | `patterns/ux/` | Loading, error, animation patterns |

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Create patterns for one-off solutions | Wait for 2+ occurrences |
| Keep failing patterns active | Review and update or deprecate |
| Ignore pattern feedback | Use feedback to improve patterns |
| Skip pattern search before implementing | Always check for existing patterns |
