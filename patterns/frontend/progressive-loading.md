# Progressive Loading Pattern

> Physical-metaphor loading where items "reveal" rather than "appear from nowhere".

## Quick Index

| If you need... | Section | Time |
|----------------|---------|------|
| Core concept | [#philosophy](#philosophy) | 2 min |
| Virtual list | [#skeleton-first-virtual-list](#skeleton-first-virtual-list) | 5 min |
| Intersection Observer | [#lazy-loading-with-observer](#lazy-loading-with-observer) | 3 min |
| **Critical gotchas** | [#critical-implementation-notes](#critical-implementation-notes) | 2 min |
| Cache integration | [#stale-while-revalidate](#stale-while-revalidate) | 3 min |

---

## Philosophy

**MUST follow**: All paginated/infinite lists use the **skeleton-first** pattern.

Traditional infinite scroll has UX friction:
- Content "jumps" when new items load
- User can't gauge list length
- "Load more" triggers feel interrupting
- Items "appear from nowhere"

The skeleton-first pattern creates a **physical metaphor**:
- All items exist from the start (as skeletons)
- Items "materialize" as user scrolls
- Scrollbar accurately reflects total content
- Smooth, predictable experience

### Industry Standard

Used by: Instagram, Facebook, Twitter/X, Pinterest, LinkedIn, Google

### Visual Comparison

```
Traditional Infinite Scroll
+-------------------+
| Item 1            |
| Item 2            |
| Item 3            |
| [Load More...]    |  <-- User must trigger
+-------------------+
     | click
+-------------------+
| Item 1            |
| Item 2            |
| Item 3            |
| Item 4            |  <-- Items appear suddenly
| Item 5            |
| [Load More...]    |
+-------------------+

Skeleton-First Progressive Loading
+-------------------+
| Item 1            |
| Item 2            |
| Item 3            |
| ################# |  <-- Skeletons show full extent
| ################# |
| ################# |
+-------------------+
     | scroll
+-------------------+
| Item 2            |
| Item 3            |
| Item 4            |  <-- Items materialize smoothly
| Item 5            |
| ################# |
| ################# |
+-------------------+
```

---

## Skeleton-First Virtual List

Create a virtual list with loaded items + skeleton placeholders.

### TypeScript Types

```typescript
// Virtual list item - either real data or skeleton placeholder
type VirtualItem<T> =
  | { type: 'data'; data: T }
  | { type: 'skeleton'; index: number };

interface PaginatedResult<T> {
  status: 'loading' | 'ok' | 'error';
  data?: T[];
  total?: number;
  hasMore?: boolean;
}
```

### Building the Virtual List

```svelte
<script lang="ts">
  interface Props {
    items: PaginatedResult<Item>;
  }
  let { items }: Props = $props();

  // Build virtual list: real items + skeleton placeholders
  const virtualList = $derived.by((): VirtualItem<Item>[] => {
    const loadedItems = items.data ?? [];

    // CRITICAL: Use || not ?? here!
    // Server sends total=0 during loading state, and ?? only catches null/undefined
    const total = items.total || loadedItems.length;

    if (total === 0) return [];

    const result: VirtualItem<Item>[] = [];

    for (let i = 0; i < total; i++) {
      if (i < loadedItems.length) {
        result.push({ type: 'data', data: loadedItems[i] });
      } else {
        result.push({ type: 'skeleton', index: i });
      }
    }

    return result;
  });
</script>

<!-- Render virtual list -->
<div class="divide-y divide-border">
  {#each virtualList as item, i (item.type === 'data' ? item.data.id : `skeleton-${item.index}`)}
    {#if item.type === 'data'}
      <ListItem data={item.data} />
    {:else}
      <ListItemSkeleton />
    {/if}
  {/each}
</div>
```

---

## Lazy Loading with Observer

Use Intersection Observer to trigger loading when skeletons become visible.

### Setup Observer

```svelte
<script lang="ts">
  let scrollContainer: HTMLDivElement | undefined = $state();
  let isLoadingMore = $state(false);
  let observer: IntersectionObserver | null = null;

  function setupObserver() {
    if (typeof IntersectionObserver === 'undefined') return;

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !isLoadingMore && items.hasMore) {
            loadMore();
            break; // Only trigger once per batch
          }
        }
      },
      {
        root: scrollContainer,
        rootMargin: '50px', // Pre-load slightly before visible
        threshold: 0,
      }
    );
  }

  // Svelte action to observe skeleton items
  function observeSkeleton(node: HTMLElement) {
    if (observer) {
      observer.observe(node);
    }
    return {
      destroy() {
        observer?.unobserve(node);
      },
    };
  }

  function loadMore() {
    if (isLoadingMore || !items.hasMore) return;
    isLoadingMore = true;
    live?.pushEvent('load_more', {});
  }

  // Reset loading state when data updates
  $effect(() => {
    if (items.status === 'ok') {
      isLoadingMore = false;
    }
  });

  // Setup/cleanup observer
  // CRITICAL: Use requestAnimationFrame to ensure DOM is ready
  $effect(() => {
    if (open && scrollContainer) {
      setupObserver();

      // Skeletons render BEFORE observer is ready, so query DOM after paint
      requestAnimationFrame(() => {
        if (observer && scrollContainer) {
          const skeletons = scrollContainer.querySelectorAll('[data-testid="skeleton"]');
          skeletons.forEach((el) => observer!.observe(el));
        }
      });
    }
    return () => {
      observer?.disconnect();
      observer = null;
    };
  });
</script>

<!-- Apply action to skeleton items -->
{#if item.type === 'skeleton'}
  <div use:observeSkeleton data-testid="skeleton">
    <ListItemSkeleton />
  </div>
{/if}
```

---

## Critical Implementation Notes

These gotchas were discovered through real debugging sessions. **Don't skip this section.**

### 1. Use `||` Not `??` for Total Fallback

```typescript
// BAD: ?? only catches null/undefined, NOT zero
const total = items.total ?? loadedItems.length;
// If server sends total=0 during loading, this stays 0!

// GOOD: || catches all falsy values including 0
const total = items.total || loadedItems.length;
```

**Why:** During loading state, the server typically sends `total: 0`. The `??` operator only triggers for `null`/`undefined`, so `0 ?? fallback` returns `0`, not the fallback.

### 2. Observer Timing: Skeletons Render Before Observer Exists

```
Timeline:
1. Component mounts
2. Svelte renders DOM (including skeletons)    <-- use:observeSkeleton runs, but observer is null!
3. $effect runs, creates observer              <-- Too late, skeletons already rendered
```

**Solution:** Use `requestAnimationFrame` to query DOM after skeletons are rendered:

```typescript
$effect(() => {
  if (open && scrollContainer) {
    setupObserver();

    // MUST use requestAnimationFrame - skeletons exist but observer wasn't ready
    requestAnimationFrame(() => {
      const skeletons = scrollContainer.querySelectorAll('[data-testid="skeleton"]');
      skeletons.forEach((el) => observer!.observe(el));
    });
  }
});
```

### 3. Add `data-testid` to Skeletons

Always add a testid for DOM queries:

```svelte
<div use:observeSkeleton data-testid="skeleton" data-index={item.index}>
  <Skeleton />
</div>
```

---

## Stale-While-Revalidate

Show cached data immediately while fetching fresh data.

### Cache Store

```typescript
// $lib/stores/listCache.ts
const STORAGE_KEY = 'my_list_cache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData<T> {
  items: T[];
  timestamp: number;
  userId?: string;
}

export function loadFromCache<T>(userId?: string): T[] | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: CacheData<T> = JSON.parse(stored);

    // Check user scope
    if (userId && data.userId && data.userId !== userId) return null;

    // Check TTL
    if (Date.now() - data.timestamp > CACHE_TTL_MS) return null;

    return data.items;
  } catch {
    return null;
  }
}

export function saveToCache<T>(items: T[], userId?: string): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const data: CacheData<T> = {
      items,
      timestamp: Date.now(),
      userId,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full - fail silently
  }
}
```

---

## Anti-Patterns

### DON'T: "Load More" Button

```svelte
<!-- BAD: Interrupts scroll flow -->
{#if hasMore}
  <button onclick={loadMore}>Load More</button>
{/if}
```

### DON'T: Scroll Position Trigger

```svelte
<!-- BAD: "Friction" at bottom of list -->
function handleScroll(e) {
  if (scrollBottom < 100) loadMore();
}
```

### DON'T: Unknown List Length

```svelte
<!-- BAD: User can't gauge content -->
{#each items as item}
  <Item {item} />
{/each}
<!-- No indication of remaining items -->
```

### DO: Skeleton-First with Observer

```svelte
<!-- GOOD: Physical metaphor -->
{#each virtualList as item}
  {#if item.type === 'data'}
    <Item data={item.data} />
  {:else}
    <div use:observeSkeleton>
      <Skeleton />
    </div>
  {/if}
{/each}
```

---

## Related Patterns

- [async-media.md](./async-media.md) - Media loading
- [native-mobile.md](./native-mobile.md) - Touch interactions
