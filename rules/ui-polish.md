# UI Polish Rules

> Auto-loaded rules for interactive states, loading patterns, mobile/PWA, and forms.
> Source: Distilled from ui-ux-pro-max (99 UX guidelines, 54 Svelte guidelines).

## Interactive States

Every interactive element MUST have hover, active, and focus-visible states.

### Buttons

```css
/* Every button needs all three */
.btn {
  transition: transform var(--duration-fast) ease-out, box-shadow var(--duration-fast) ease-out;
}
.btn:hover { box-shadow: var(--shadow-md); }
.btn:active { transform: scale(0.97); }
```

### Cards

```css
/* Subtle lift on hover */
.card {
  transition: transform var(--duration-base) ease-out, box-shadow var(--duration-base) ease-out;
}
.card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
```

### Links

```css
/* Underline animation */
a { text-decoration-color: transparent; transition: text-decoration-color var(--duration-fast); }
a:hover { text-decoration-color: currentColor; }
```

### Focus

```css
/* ALWAYS use focus-visible, never outline:none */
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; }
```

**Rule:** `outline: none` is ONLY valid when immediately followed by a `:focus-visible` replacement. Bare `outline: none` is always a violation.

## Skeleton Loading

Use shimmer skeletons for content loading, NEVER spinners. Spinners are only for action feedback (submit, save).

```css
.skeleton {
  background: linear-gradient(90deg, var(--color-gray-200) 25%, var(--color-gray-100) 50%, var(--color-gray-200) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--radius-md);
}
@keyframes shimmer { to { background-position: -200% 0; } }
```

### When to use which

| Pattern | Use for |
|---------|---------|
| Skeleton shimmer | Content loading (lists, cards, profiles, data) |
| Spinner | Action feedback (form submit, save, delete) |
| Progress bar | File uploads, multi-step processes with known progress |

## Mobile / PWA

### Touch Targets

- **44x44px minimum** for all interactive elements
- **8px minimum gap** between adjacent targets
- Watch for: `h-8` (32px), `p-2` on small buttons — likely too small
- Use `min-h-11 min-w-11` (44px) as a baseline for touch targets

### Viewport

- Use `dvh` not `vh` for full-height layouts (iOS Safari address bar)
- No horizontal scroll — ever. If content overflows, it's a bug.
- Meta viewport: `width=device-width, initial-scale=1`

### Safe Areas

```css
/* Edge-to-edge layouts need safe area padding */
padding-top: env(safe-area-inset-top);
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

### Mobile Patterns

- Bottom sheets preferred over modals on mobile
- Pull-to-refresh: prevent on scrollable containers with `overscroll-behavior: contain`
- Navigation: bottom tab bar for primary nav, not hamburger menu
- Primary actions: bottom half of screen (thumb zone)

## Form Patterns

| Rule | Requirement |
|------|-------------|
| Error placement | Adjacent to field, not at top of form |
| Validation timing | On blur, not on every keystroke |
| Password fields | Always include visibility toggle |
| Autocomplete | Use `autocomplete` attributes (`email`, `current-password`, `name`, `tel`) |
| Multi-step forms | Show progress indicator |
| Submit button | Disable during submission, show loading state |
| Labels | Every input has a visible label or `aria-label` |
| Required fields | Mark with `aria-required="true"` + visual indicator |

### Form Error Pattern

```svelte
<div class="field">
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    autocomplete="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
  />
  {#if errors.email}
    <p id="email-error" role="alert" class="text-error text-sm mt-1">{errors.email}</p>
  {/if}
</div>
```

## Checklist (Quick Reference)

Before shipping any component, verify:

- [ ] All buttons have hover + active + focus-visible states
- [ ] All cards/links have hover feedback
- [ ] No bare `outline: none` without focus-visible replacement
- [ ] Async content uses skeleton shimmer (not spinner)
- [ ] Touch targets >= 44px with 8px gaps
- [ ] No `vh` units (use `dvh`)
- [ ] No horizontal scroll on mobile
- [ ] Form errors adjacent to fields
- [ ] Form inputs have autocomplete attributes
- [ ] Submit buttons disabled during submission
