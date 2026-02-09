# Animation Patterns

> Auto-loaded rules for motion and transitions.

## Core Rules

| Rule | Requirement |
|------|-------------|
| Exit duration | 67-85% of enter duration |
| Duration values | Use tokens: fast (100ms), normal (200ms), slow (300ms) |
| Reduced motion | Always check `prefers-reduced-motion` |
| Symmetry | Every `in:` transition needs matching `out:` |
| Easing | ease-out for enter, ease-in for exit (never linear) |
| Selectivity | Only animate meaningful changes (navigation, modals, confirmations) |

## Standard Timing

| Component | Enter | Exit | Easing |
|-----------|-------|------|--------|
| Modal | 300ms | 250ms | cubicOut/cubicIn |
| Sheet | 300ms | 200ms | cubicOut/cubicIn |
| Dropdown | 200ms | 150ms | cubicOut/cubicIn |
| Toast | 200ms | 150ms | cubicOut/cubicIn |

## Motion Direction

- Dropdown: flies from top (connected to trigger), NOT from side
- Sheet: flies from bottom
- Forward navigation: slide from right
- Back navigation: slide from left

## Don't Animate

- Text content changes
- Counter updates
- Form field focus (use CSS transitions)
- Hover states (use CSS)
- Typing indicators

## Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-fast: 0ms;
    --motion-normal: 0ms;
    --motion-slow: 0ms;
  }
}
```

## Spring Physics

Reserve `spring()` for drag/gesture interactions only. Never use for simple fade/fly.
