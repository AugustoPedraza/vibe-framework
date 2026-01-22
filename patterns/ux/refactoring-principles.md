# Pattern: Refactoring Principles

> Semantic refactoring that improves code quality, NOT line count optimization.

## Problem

When lint rules warn about component size (e.g., "max 300 lines"), developers often:
- Remove documentation comments
- Compress multiple statements onto single lines
- Remove blank lines that aid readability
- Inline functions to save lines

This makes code **harder** to understand while technically passing the lint rule.

## Solution

Treat line count warnings as a **signal** that a component may be doing too much, not as a goal to minimize. Apply semantic refactoring principles instead.

## Anti-Patterns (NEVER DO)

### DON'T: Remove Documentation

```svelte
<!-- ❌ BAD: Removed docs to save 5 lines -->
<script lang="ts">
  /** HomeDetail (HOME-001) */
  import { ... }
</script>

<!-- ✅ GOOD: Keep valuable documentation -->
<script lang="ts">
  /**
   * HomeDetail Component (HOME-001, HOME-002)
   *
   * Main home detail view with hero, address, participants, and projects.
   * Uses Screen + custom header for mobile-native layout.
   *
   * Design Tokens (see docs/domain/ui-ux/DESIGN_TOKENS.md):
   * - Hero: 120px fixed height
   * - Address: body-lg + semibold (18px)
   */
  import { ... }
</script>
```

### DON'T: Compress Code

```typescript
// ❌ BAD: Compressed to save lines, hard to read
function handleClose() { searchQuery = ''; onClose(); }
function handleRetry() { live?.pushEvent('retry_homes', {}); }

// ✅ GOOD: Clear, readable structure
function handleClose() {
  searchQuery = '';
  onClose();
}

function handleRetry() {
  live?.pushEvent('retry_homes', {});
}
```

### DON'T: Remove Meaningful Blank Lines

```typescript
// ❌ BAD: No visual separation
const virtualList = $derived.by(() => { ... });
const filteredList = $derived.by(() => { ... });
const showingCachedData = $derived(...);
function handleHomeSelect(homeId: string) { ... }

// ✅ GOOD: Logical groupings with blank lines
// Derived state
const virtualList = $derived.by(() => { ... });
const filteredList = $derived.by(() => { ... });
const showingCachedData = $derived(...);

// Event handlers
function handleHomeSelect(homeId: string) { ... }
```

## Proper Refactoring Techniques

### 1. Extract Shared Types

**When:** Multiple components use the same interfaces.

```typescript
// ❌ BEFORE: Types duplicated in HomeDetail and AddressDrawer
interface HomeListItem { id: string; address: string; ... }

// ✅ AFTER: Shared types file
// lib/types/homes.ts
export interface HomeListItem { ... }

// Components import from shared location
import type { HomeListItem } from '$lib/types/homes';
```

### 2. Extract Reusable Actions

**When:** DOM behavior is reused across components.

```typescript
// ❌ BEFORE: Intersection Observer logic inline in component
let observer: IntersectionObserver | null = null;
function setupObserver() { ... }
$effect(() => { if (open) setupObserver(); ... });

// ✅ AFTER: Reusable action
// lib/actions/infiniteScroll.ts
export function infiniteScroll(node, options) { ... }

// Component usage
<div use:infiniteScroll={{ onLoadMore, hasMore }}>
```

### 3. Extract Compound Components

**When:** A group of elements always appears together with shared state.

```
// ❌ BEFORE: Search input + clear button inline
<div class="relative">
  <Input bind:value={searchQuery} ... />
  {#if searchQuery}
    <button onclick={clearSearch}>...</button>
  {/if}
</div>

// ✅ AFTER: Compound component
// components/ui/compounds/SearchInput.svelte
<SearchInput bind:value={searchQuery} placeholder="Search..." />
```

### 4. Extract Sub-Components (Semantic Split)

**When:** A component has distinct visual/logical sections.

```
// ❌ BEFORE: 400-line component with hero, info, projects all inline

// ✅ AFTER: Semantic sub-components
<HomeCover ... />      <!-- Hero section -->
<HomeInfo ... />       <!-- Participant avatars -->
<ProjectList ... />    <!-- Projects section -->
```

### 5. Extract State Logic to Stores

**When:** State management is complex and could be reused.

```typescript
// ❌ BEFORE: Cache logic inline in component
let cachedHomes = $state(null);
$effect(() => { cachedHomes = loadFromCache(); });
$effect(() => { if (data) saveToCache(data); });

// ✅ AFTER: Dedicated store
// lib/stores/homesCache.ts
export const homesCache = createCacheStore('homes');
```

## Decision Framework

When a component exceeds the line limit, ask:

| Question | If Yes → Action |
|----------|-----------------|
| Are types duplicated elsewhere? | Extract to `lib/types/` |
| Is DOM behavior reusable? | Extract to `lib/actions/` |
| Is state logic complex/reusable? | Extract to `lib/stores/` |
| Are there distinct UI sections? | Extract sub-components |
| Does a UI pattern repeat? | Create compound component |
| Is it just a big but cohesive component? | **Accept it or adjust lint config** |

## Folder Structure Convention

```
assets/svelte/
├── lib/
│   ├── actions/        # Svelte actions (DOM behaviors)
│   │   ├── asyncMedia.ts
│   │   ├── infiniteScroll.ts
│   │   └── index.ts
│   ├── stores/         # Svelte stores (state management)
│   │   ├── homesCache.ts
│   │   └── connection.ts
│   ├── types/          # Shared TypeScript types
│   │   └── homes.ts
│   ├── utils/          # Pure utility functions
│   │   └── gradients.ts
│   └── copy/           # UI copy/microcopy
│       └── features/
├── components/
│   ├── ui/
│   │   ├── primitives/   # Basic building blocks
│   │   ├── compounds/    # Composed UI patterns
│   │   └── patterns/     # Complex UI patterns (Drawer, Modal)
│   └── features/
│       └── homes/        # Feature-specific components
│           ├── HomeDetail.svelte
│           ├── HomeCover.svelte
│           └── AddressDrawer.svelte
```

## When to Accept Large Components

Sometimes a component is legitimately large:
- Feature components orchestrating many sub-components
- Components with many states (loading, error, empty, success)
- Components with comprehensive documentation

**In these cases:**
1. Ensure the component is cohesive (does one thing)
2. Document why it's large
3. Consider adjusting lint config for feature components

```javascript
// .eslintrc.js - Different limits for different component types
rules: {
  'max-lines': ['warn', {
    max: 300,
    skipBlankLines: true,
    skipComments: true  // Don't penalize documentation!
  }]
}
```

## Tech Stack

`svelte5` `typescript` `refactoring` `best-practices`

## Source

Discovered in: Syna / HOME-002
Date: 2026-01-21
Lesson: Line count is a signal, not a goal. Never sacrifice readability for metrics.
