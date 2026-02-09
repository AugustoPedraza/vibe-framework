# PWA Patterns

> Auto-loaded rules for Progressive Web App development.

## Core Rules

| Rule | Requirement |
|------|-------------|
| Offline | Design offline-first; queue actions with retry limits |
| Loading | Skeleton loaders, NOT spinners (0-100ms: nothing, 100-300ms: button spinner, 300ms+: skeleton) |
| Updates | Optimistic updates with rollback on error |
| States | Handle ALL states: loading, error, empty, success |
| Touch targets | Minimum 44x44px for all interactive elements |
| Safe areas | Use `env(safe-area-inset-*)` for edge layouts |
| Keyboard | Adjust layout when virtual keyboard appears |

## State Handling Template

```svelte
{#if loading}
  <Skeleton variant="list" count={3} />
{:else if error}
  <EmptyState preset="error" title="Failed to load">
    <Button onclick={retry}>Try again</Button>
  </EmptyState>
{:else if items.length === 0}
  <EmptyState preset="default" title="No items yet" />
{:else}
  {#each items as item}
    <ItemCard {item} />
  {/each}
{/if}
```

## Touch Target Sizes

| Element | Minimum Size | Spacing |
|---------|-------------|---------|
| Buttons | 44x44px | 8px apart |
| List items | 48px height | - |
| Form inputs | 44px height | 12px apart |

## Platform Limitations

| API | Android | iOS |
|-----|---------|-----|
| Background Sync | Yes | No |
| Background Fetch | Yes | No |
| Vibration | Yes | No |
| Service Worker (bg) | Continues | Stops in seconds |

## Offline Queue Limits

- Max retries: 3
- Max age: 24 hours
- Prune expired items before adding new ones
