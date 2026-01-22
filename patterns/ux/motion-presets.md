# Pattern: Motion Preset System

> Centralized animation presets with semantic naming and reduced-motion support

## Problem

Animations scattered across components lead to:
- Inconsistent timing and easing across the app
- Hardcoded duration values that are hard to tune
- No respect for `prefers-reduced-motion`
- Difficulty maintaining animation "rhythm"

## Solution

Create a layered motion system:
1. **Tokens** - Raw duration/easing values from CSS custom properties
2. **Presets** - Semantic animation configs (modal, listItem, collapse)
3. **Transitions** - Svelte transition wrappers that use presets
4. **Reduced Motion** - Automatic zero-duration when user prefers

## Example

### tokens.ts - Raw values

```typescript
export interface MotionTokens {
  duration: {
    fast: number;    // 100ms
    normal: number;  // 200ms
    slow: number;    // 300ms
  };
  easing: {
    in: EasingFunction;
    out: EasingFunction;
    inOut: EasingFunction;
  };
  stagger: {
    item: number;    // 50ms between list items
  };
}

// Reads from CSS custom properties with fallbacks
export const motion = {
  get tokens(): MotionTokens {
    return initTokens();
  }
};
```

### presets.ts - Semantic configs

```typescript
import { motion } from './tokens';
import type { FlyParams, SlideParams } from 'svelte/transition';

/**
 * List item animation with stagger
 * Enter: slide up with delay based on index
 * Exit: fast slide (no stagger - users expect quick dismissal)
 */
export const listItem = {
  enter: (index: number = 0): FlyParams => ({
    y: 16,
    duration: motion.tokens.duration.normal,
    delay: index * motion.tokens.stagger.item,
    easing: motion.tokens.easing.out,
  }),
  exit: (): FlyParams => ({
    y: 16,
    duration: motion.tokens.duration.fast,
    easing: motion.tokens.easing.in,
  }),
};

/**
 * Expand/collapse animation
 */
export const collapse = {
  enter: (): SlideParams => ({
    duration: motion.tokens.duration.normal,
    easing: motion.tokens.easing.out,
  }),
  exit: (): SlideParams => ({
    duration: motion.tokens.duration.fast,
    easing: motion.tokens.easing.in,
  }),
};
```

### transitions.ts - Svelte wrappers

```typescript
import { fly, slide } from 'svelte/transition';
import { presets } from './presets';
import type { TransitionConfig } from 'svelte/transition';

export function listItemIn(
  node: Element,
  params?: { index?: number }
): TransitionConfig {
  return fly(node, presets.listItem.enter(params?.index ?? 0));
}

export function listItemOut(node: Element): TransitionConfig {
  return fly(node, presets.listItem.exit());
}

export function collapseIn(node: Element): TransitionConfig {
  return slide(node, presets.collapse.enter());
}

export function collapseOut(node: Element): TransitionConfig {
  return slide(node, presets.collapse.exit());
}
```

### Usage in components

```svelte
<script>
  import { listItemIn, collapseIn, collapseOut } from '$lib/motion';
</script>

<!-- List with staggered entry -->
{#each items as item, i (item.id)}
  <div in:listItemIn={{ index: i }}>
    {item.name}
  </div>
{/each}

<!-- Expand/collapse section -->
{#if expanded}
  <div in:collapseIn out:collapseOut>
    Collapsible content
  </div>
{/if}
```

## Design Decisions

1. **Exit faster than enter** - Users expect quick dismissal
2. **No stagger on exit** - Staggered exits feel sluggish
3. **Semantic names** - `listItem` not `flyUp200msStagger50`
4. **Reduced motion automatic** - Token system returns 0 durations

## When to Use

- Any animation that appears in multiple places
- List item enter/exit animations
- Expand/collapse sections
- Modal/sheet/drawer animations

## When NOT to Use

- One-off micro-interactions
- CSS-only animations (use Tailwind animate-* classes)
- Gesture-driven animations (use springs instead)

## Tech Stack

`svelte5` `typescript` `css-custom-properties` `a11y`

## Source

Discovered in: Syna / CONV-001
Date: 2026-01-21
