# Pattern: Motion-Reduce Loading Spinner

> Accessible loading spinner that respects user's reduced motion preferences.

## Problem

Animated loading spinners can cause issues for users with:
- Vestibular disorders
- Motion sensitivity
- Cognitive load concerns
- Browser/OS reduced motion settings

## Solution

Use Tailwind's `motion-reduce:` modifier to disable animations when user prefers reduced motion.

## Example

```svelte
<!-- Standard spinner with motion-reduce support -->
<div class="flex items-center justify-center">
  <div
    class="animate-spin motion-reduce:animate-none rounded-full h-8 w-8 border-b-2 border-primary"
  ></div>
</div>
```

### Alternative: Static indicator for reduced motion

```svelte
<div class="flex items-center justify-center">
  <div
    class="animate-spin motion-reduce:animate-none rounded-full h-8 w-8 border-b-2 border-primary motion-reduce:border-2 motion-reduce:border-primary"
  ></div>
</div>
```

### With loading text fallback

```svelte
<div class="flex flex-col items-center justify-center gap-2">
  <div
    class="animate-spin motion-reduce:hidden rounded-full h-8 w-8 border-b-2 border-primary"
  ></div>
  <span class="hidden motion-reduce:block text-muted-foreground">Loading...</span>
</div>
```

## When to Use

- All loading spinners in user-facing screens
- Any animated loading indicators
- Progress indicators with animation
- Skeleton loaders (consider static version)

## When NOT to Use

- Non-animated loading states (already accessible)
- Server-side rendering contexts
- Background processes invisible to user

## Tailwind Classes

| Class | Effect |
|-------|--------|
| `animate-spin` | Standard rotation animation |
| `motion-reduce:animate-none` | Stops animation when reduced motion preferred |
| `motion-reduce:hidden` | Hides element completely |
| `motion-reduce:block` | Shows fallback element |

## Testing

1. In Chrome DevTools: Rendering → Emulate CSS media feature `prefers-reduced-motion`
2. In macOS: System Preferences → Accessibility → Display → Reduce motion
3. In Windows: Settings → Ease of Access → Display → Show animations

## Tech Stack

`tailwind` `accessibility` `a11y` `motion` `loading`

## Source

Discovered in: Syna / NAV-001
Date: 2026-01-22
