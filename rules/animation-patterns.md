# Animation Patterns

> Auto-loaded rules for motion and transitions with Svelte code examples.

## Core Rules

| Rule | Requirement |
|------|-------------|
| Exit duration | 67-85% of enter duration |
| Duration values | Use tokens: fast (100ms), normal (200ms), slow (300ms) |
| Reduced motion | Always check `prefers-reduced-motion` |
| Symmetry | Every `in:` transition needs matching `out:` |
| Easing | ease-out for enter, ease-in for exit (never linear) |
| Selectivity | Only animate meaningful changes (navigation, modals, confirmations) |
| Max animations | 1-2 per view. More causes distraction. |

## Standard Timing

| Component | Enter | Exit | Easing |
|-----------|-------|------|--------|
| Modal | 300ms | 250ms | cubicOut/cubicIn |
| Sheet | 300ms | 200ms | cubicOut/cubicIn |
| Dropdown | 200ms | 150ms | cubicOut/cubicIn |
| Toast | 200ms | 150ms | cubicOut/cubicIn |

## Svelte Transition Examples

### Modal — fly up + fade backdrop

```svelte
<script>
  import { fly, fade } from 'svelte/transition';
  import { cubicOut, cubicIn } from 'svelte/easing';

  let { open = $bindable(false) }: { open: boolean } = $props();
</script>

{#if open}
  <div class="backdrop" transition:fade={{ duration: 250 }}>
    <div
      class="modal"
      in:fly={{ y: 16, duration: 300, easing: cubicOut }}
      out:fade={{ duration: 200, easing: cubicIn }}
      role="dialog"
      aria-modal="true"
    >
      <slot />
    </div>
  </div>
{/if}
```

### Dropdown — fly from trigger

```svelte
{#if expanded}
  <ul
    role="listbox"
    in:fly={{ y: -8, duration: 200, easing: cubicOut }}
    out:fade={{ duration: 150, easing: cubicIn }}
  >
    {#each options as option}
      <li role="option">{option.label}</li>
    {/each}
  </ul>
{/if}
```

### Toast notification

```svelte
{#if visible}
  <div
    role="status"
    aria-live="polite"
    in:fly={{ x: 16, duration: 200, easing: cubicOut }}
    out:fade={{ duration: 150, easing: cubicIn }}
  >
    {message}
  </div>
{/if}
```

### Bottom sheet (mobile)

```svelte
{#if open}
  <div class="backdrop" transition:fade={{ duration: 250 }}>
    <div
      class="sheet"
      in:fly={{ y: 300, duration: 300, easing: cubicOut }}
      out:fly={{ y: 300, duration: 200, easing: cubicIn }}
    >
      <slot />
    </div>
  </div>
{/if}
```

### List stagger

```svelte
{#each items as item, i}
  <div in:fly={{ y: 8, duration: 200, delay: i * 50, easing: cubicOut }}>
    {item.name}
  </div>
{/each}
```

**Note:** Cap stagger at `delay: Math.min(i * 50, 500)` for long lists.

## Reduced Motion

### CSS approach

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-normal: 0ms;
    --motion-slow: 0ms;
  }
}
```

### Svelte approach — duration helper

```svelte
<script>
  import { fly, fade } from 'svelte/transition';
  import { cubicOut, cubicIn } from 'svelte/easing';

  const prefersReduced = $state(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const dur = (ms: number) => prefersReduced ? 0 : ms;
</script>

{#if open}
  <div in:fly={{ y: 16, duration: dur(300), easing: cubicOut }}>
    <!-- content -->
  </div>
{/if}
```

## Motion Direction

| Component | Direction | Rationale |
|-----------|-----------|-----------|
| Dropdown | Flies from top (y: -8) | Connected to trigger |
| Sheet | Flies from bottom (y: 300) | Thumb-reachable origin |
| Toast | Flies from right (x: 16) | Non-intrusive entry |
| Modal | Flies up (y: 16) | Draws attention upward |
| Forward nav | Slide from right | Mental model: forward = right |
| Back nav | Slide from left | Mental model: back = left |

## Performance Rules

**Only animate `transform` and `opacity`** — these are GPU-composited and maintain 60fps.

| Safe (GPU) | Unsafe (causes reflow) |
|------------|----------------------|
| `transform: translate/scale/rotate` | `width`, `height` |
| `opacity` | `top`, `left`, `right`, `bottom` |
| `filter` | `margin`, `padding` |
| `clip-path` | `border-width` |

## Don't Animate

- Text content changes
- Counter updates
- Form field focus (use CSS transitions, not Svelte transitions)
- Hover states (use CSS transitions)
- Typing indicators

## Spring Physics

Reserve `spring()` for drag/gesture interactions only. Never use for simple fade/fly.
