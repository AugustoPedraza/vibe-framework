# Pattern: User-Scoped Cache with TTL

> LocalStorage cache with user isolation, TTL expiration, and silent failure handling.

## Problem

Client-side caching often has issues:
- Data from one user visible to another after logout
- Stale data persists indefinitely
- Storage quota errors crash the app
- SSR environments crash on `localStorage` access

## Solution

A TypeScript cache module that:
- Scopes cache data to specific user IDs
- Automatically expires data after configurable TTL
- Silently fails on storage errors (graceful degradation)
- Guards against SSR with `typeof localStorage` checks

## Example

```typescript
// Generic cache store with user scoping and TTL

interface CacheData<T> {
  data: T;
  timestamp: number;
  userId?: string;
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Load data from cache for a specific user.
 * Returns null if cache is missing, expired, or for different user.
 */
export function loadFromCache<T>(
  key: string,
  userId?: string,
  ttlMs: number = CACHE_TTL_MS
): T | null {
  // Guard against SSR
  if (typeof localStorage === 'undefined') return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const cache: CacheData<T> = JSON.parse(stored);

    // User scope check - reject if different user
    if (userId && cache.userId && cache.userId !== userId) {
      return null;
    }

    // TTL check - reject if expired
    const age = Date.now() - cache.timestamp;
    if (age > ttlMs) {
      return null;
    }

    return cache.data;
  } catch {
    // Parse error or corrupted data - fail silently
    return null;
  }
}

/**
 * Save data to cache for a specific user.
 */
export function saveToCache<T>(
  key: string,
  data: T,
  userId?: string
): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const cache: CacheData<T> = {
      data,
      timestamp: Date.now(),
      userId,
    };
    localStorage.setItem(key, JSON.stringify(cache));
  } catch {
    // Storage full or unavailable - fail silently
    // App continues to work without caching
  }
}

/**
 * Clear specific cache key.
 */
export function clearCache(key: string): void {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch {
    // Fail silently
  }
}

/**
 * Get cache age in milliseconds.
 */
export function getCacheAge(key: string): number | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;

    const cache: CacheData<unknown> = JSON.parse(stored);
    return Date.now() - cache.timestamp;
  } catch {
    return null;
  }
}
```

### Usage in Component (Stale-While-Revalidate)

```svelte
<script lang="ts">
  import { loadFromCache, saveToCache } from '$lib/stores/cache';

  interface Props {
    items: AsyncResult<Item[]>;
    currentUserId?: string;
  }
  let { items, currentUserId }: Props = $props();

  const CACHE_KEY = 'my_items_cache';
  let cachedItems = $state<Item[] | null>(null);

  // Load cache when data is loading
  $effect(() => {
    if (items.status === 'loading') {
      cachedItems = loadFromCache<Item[]>(CACHE_KEY, currentUserId);
    }
  });

  // Save to cache when fresh data arrives
  $effect(() => {
    if (items.status === 'ok' && items.data?.length) {
      saveToCache(CACHE_KEY, items.data, currentUserId);
      cachedItems = null; // Clear cached state
    }
  });

  // Display: prefer fresh data, fall back to cache
  const displayItems = $derived.by(() => {
    if (items.status === 'ok' && items.data) {
      return items.data;
    }
    if (items.status === 'loading' && cachedItems) {
      return cachedItems; // Show cached while loading
    }
    return [];
  });
</script>
```

## When to Use

- Offline-first PWA needing fast initial load
- Multi-user apps where logout should clear visible data
- Lists or data that can be stale for UX improvement
- Any client-side caching needing graceful degradation

## When NOT to Use

- Sensitive data that must never persist locally
- Real-time data where staleness causes issues
- When IndexedDB is more appropriate (large datasets)

## Critical Implementation Notes

### User Scoping Prevents Data Leaks

```typescript
// User A logs in, sees their homes
saveToCache('homes', userAHomes, 'user-a-id');

// User A logs out, User B logs in
loadFromCache('homes', 'user-b-id');
// Returns null - user ID mismatch, not User A's data!
```

### Silent Failure is Intentional

```typescript
try {
  localStorage.setItem(key, JSON.stringify(data));
} catch {
  // QuotaExceededError, SecurityError, etc.
  // App works without cache - this is fine
}
```

**Why:** Cache is an optimization, not a requirement. Users shouldn't see errors for cache failures.

### SSR Guard Pattern

```typescript
if (typeof localStorage === 'undefined') return null;
```

**Why:** Server-side rendering has no `localStorage`. This check prevents crashes during SSR hydration.

## Tech Stack

`typescript` `pwa` `offline` `localStorage` `caching`

## Source

Discovered in: Syna / HOME-002
Date: 2026-01-21
