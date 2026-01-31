# Animation Anti-Patterns

> Motion mistakes that make UI feel broken.

## Quick Reference

| Don't | Do Instead | Why |
|-------|------------|-----|
| Same duration for enter/exit | Exit faster (67-85% of enter) | Users dismiss quickly |
| Arbitrary durations | Use motion tokens | Consistency |
| Ignore reduced motion | Check preference | Accessibility |
| Asymmetric transitions | Pair in/out or use transition | Visual glitches |
| Linear easing | ease-out enter, ease-in exit | Feels mechanical |
| Animate everything | Reserve for meaningful changes | Performance, annoyance |

---

## Same Duration for Enter/Exit

**Don't**: Use identical timing for showing and hiding.

**Do**: Exit should be 67-85% of enter duration.

```svelte
<!-- WRONG - Same duration -->
{#if open}
  <div
    in:fly={{ y: 100, duration: 300 }}
    out:fly={{ y: 100, duration: 300 }}
  />
{/if}

<!-- CORRECT - Faster exit -->
{#if open}
  <div
    in:fly={{ y: 100, duration: 300 }}
    out:fly={{ y: 100, duration: 200 }}
  />
{/if}
```

### Standard Ratios

| Component | Enter | Exit | Ratio |
|-----------|-------|------|-------|
| Modal | 300ms | 250ms | 83% |
| Sheet | 300ms | 200ms | 67% |
| Dropdown | 200ms | 150ms | 75% |
| Toast | 200ms | 150ms | 75% |

---

## Arbitrary Duration Values

**Don't**: Use random numbers like 275ms or 317ms.

**Do**: Use consistent tokens.

```svelte
<!-- WRONG - Magic numbers -->
<div transition:fly={{ duration: 275 }} />

<!-- CORRECT - Tokens -->
<script>
  const DURATION = {
    fast: 100,
    normal: 200,
    slow: 300
  };
</script>

<div transition:fly={{ duration: DURATION.slow }} />
```

---

## Ignoring Reduced Motion

**Don't**: Force animations on everyone.

**Do**: Respect `prefers-reduced-motion`.

```svelte
<!-- WRONG - No accessibility check -->
<div transition:fly={{ y: 100, duration: 300 }} />

<!-- CORRECT - Check preference -->
<script>
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
</script>

<div
  transition:fly={{
    y: 100,
    duration: prefersReducedMotion ? 0 : 300
  }}
/>
```

### CSS Alternative

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-normal: 0ms;
    --motion-slow: 0ms;
  }
}
```

---

## Asymmetric Transitions

**Don't**: Add `in:` transition without matching `out:`.

**Do**: Always pair in/out or use `transition:`.

```svelte
<!-- WRONG - Visual glitch on exit -->
{#if open}
  <div in:fly={{ y: 50 }}>
    <!-- Pops out abruptly -->
  </div>
{/if}

<!-- CORRECT - Symmetric -->
{#if open}
  <div
    in:fly={{ y: 50, duration: 200 }}
    out:fly={{ y: 50, duration: 150 }}
  />
{/if}

<!-- Or use transition: for same animation -->
{#if open}
  <div transition:fly={{ y: 50 }} />
{/if}
```

---

## Linear Easing

**Don't**: Use linear timing (feels robotic).

**Do**: ease-out for enter, ease-in for exit.

```svelte
<!-- WRONG - Linear feels mechanical -->
<div transition:fly={{ easing: linear }} />

<!-- CORRECT - Natural easing -->
<script>
  import { cubicOut, cubicIn } from 'svelte/easing';
</script>

<div
  in:fly={{ easing: cubicOut }}
  out:fly={{ easing: cubicIn }}
/>
```

### Standard Easings

```typescript
const EASING = {
  enter: 'cubic-bezier(0, 0, 0.2, 1)',    // ease-out
  exit: 'cubic-bezier(0.4, 0, 1, 1)',      // ease-in
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};
```

---

## Animating Everything

**Don't**: Add motion to every state change.

**Do**: Reserve animation for meaningful interactions.

```svelte
<!-- WRONG - Annoying over-animation -->
<script>
  let count = $state(0);
</script>

{#key count}
  <span transition:fade>{count}</span>
{/key}

<!-- CORRECT - Animate meaningful changes -->
<span>{count}</span>

<!-- Animate navigation, modals, important state changes -->
{#if showModal}
  <div transition:fly={{ y: 100 }}>
    Modal content
  </div>
{/if}
```

### When to Animate

| Animate | Don't Animate |
|---------|---------------|
| Modal open/close | Text changes |
| Page transitions | Counter updates |
| Toast notifications | Form field focus |
| Drawer toggle | Typing indicators |
| Confirmation feedback | Hover states (use CSS) |

---

## Spring Overuse

**Don't**: Use spring physics for every animation.

**Do**: Reserve spring for drag/gesture interactions.

```svelte
<!-- WRONG - Spring for simple fade -->
<script>
  import { spring } from 'svelte/motion';
  const opacity = spring(0);
</script>

<!-- CORRECT - Spring for physics-based interactions -->
<script>
  import { spring } from 'svelte/motion';

  const position = spring({ x: 0, y: 0 }, {
    stiffness: 0.15,
    damping: 0.8
  });
</script>

<div
  style="transform: translate({$position.x}px, {$position.y}px)"
  ondrag={(e) => position.set({ x: e.offsetX, y: e.offsetY })}
/>
```

---

## Wrong Animation Origin

**Don't**: Animate from unrelated direction.

**Do**: Motion should indicate source/destination.

```svelte
<!-- WRONG - Dropdown flies from right (unrelated to trigger) -->
<div in:fly={{ x: 100 }}>Menu items</div>

<!-- CORRECT - Flies from top (connected to trigger) -->
<div in:fly={{ y: -10 }}>Menu items</div>

<!-- Sheet from bottom -->
<div in:fly={{ y: '100%' }}>Sheet content</div>

<!-- Slide-in from right (forward navigation) -->
<div in:fly={{ x: 30 }}>Next page</div>
```

---

## View Transitions API with LiveView

**Don't**: Use View Transitions API (conflicts with LiveView).

**Do**: Use Svelte transitions.

```svelte
<!-- WRONG - View Transitions API -->
<script>
  document.startViewTransition(() => {
    // Conflicts with LiveView DOM management
  });
</script>

<!-- CORRECT - Svelte transitions -->
{#key currentRoute}
  <div
    in:fly={{ x: 30, duration: 300 }}
    out:fly={{ x: -30, duration: 250 }}
  >
    {@render children?.()}
  </div>
{/key}
```

---

## Checklist

- [ ] Exit duration < enter duration
- [ ] Using motion tokens (not magic numbers)
- [ ] Reduced motion preference checked
- [ ] All `in:` transitions have matching `out:`
- [ ] Using ease-out/ease-in (not linear)
- [ ] Only animating meaningful changes
- [ ] Animation direction matches context

---

## Related Docs

- [motion-presets.md](../patterns/ux/motion-presets.md) - Correct animation patterns
