# UX Validation Rules

> Auto-loaded design system enforcement rules.

## Design Token Rules

### DT001: No Raw Tailwind Colors (Error)

**Always invalid** (not in project config):
| Invalid | Valid |
|---------|-------|
| `bg-red-500` | `bg-error` |
| `bg-yellow-500` | `bg-warning` |
| `bg-purple-300` | `bg-primary` (or custom token) |
| `bg-pink-400` | Define semantic token |
| `bg-slate-*`, `bg-zinc-*` | Use `gray` scale or semantic |

**Project-allowed color scales** (explicitly in tailwind.config.css):
| Scale | Valid Values | Prefer Instead |
|-------|-------------|----------------|
| `gray-50..900` | `bg-gray-50`, `text-gray-900`, etc. | `bg-surface`, `text-foreground`, `text-muted` |
| `blue-50/500/900` | `bg-blue-500`, `text-blue-900` | `bg-primary`, `text-primary` |
| `green-50/500` | `bg-green-50`, `bg-green-500` | `bg-success`, `text-success` |

> **Prefer semantic tokens** (`bg-surface`, `text-muted`, `bg-primary`) over gray/blue/green scales
> when the semantic meaning is clear. Use raw scales only when no semantic token matches.

Foreground tokens for text ON colored backgrounds:
```svelte
<button class="bg-error text-error-foreground">Delete</button>
<button class="bg-success text-success-foreground">Confirm</button>
```

Disabled state:
```svelte
<!-- Form elements -->
<input class="disabled:bg-disabled disabled:text-disabled-foreground disabled:cursor-not-allowed" />
<!-- Buttons (keep brand visible) -->
<button class="disabled:opacity-60 disabled:cursor-not-allowed" />
```

### DT002: No Arbitrary Values (Error)

```svelte
<!-- INVALID: w-[300px] h-[50vh] p-[15px] text-[14px] -->
<!-- VALID: w-full max-w-sm p-4 text-sm -->
```

### DT003: Standard Spacing Only (Error)

Valid: `0, px, 0.5, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24`
Invalid: `p-7, p-9, p-11, p-13, p-14, p-15, m-7, gap-9`

> Project defines `--spacing-5` and `--spacing-10` in tailwind.config.css.

### DT004: Named Z-Index Only (Error)

| Token | Purpose |
|-------|---------|
| `z-base` | Base content |
| `z-raised` | Raised elements |
| `z-dropdown` | Dropdown menus |
| `z-sticky` | Sticky elements |
| `z-overlay` | Overlays |
| `z-modal` | Modals |
| `z-popover` | Popovers |
| `z-toast` | Toast notifications |
| `z-tooltip` | Tooltips |

### DT005: Standard Border Radius (Error)

Valid: `rounded-none, rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-full`
Invalid: `rounded-2xl, rounded-3xl`

> Project defines `--radius-xl` in tailwind.config.css and tokens.css.

## UI State Rules

- **Loading**: Components with async operations MUST show skeleton/loading state
- **Error**: All async operations MUST handle error state with `role="alert"`
- **Empty**: Lists/data components MUST handle empty state with `EmptyState` component

## Alignment Rules

- No `top-1/2 -translate-y-1/2` in input icons. Use `inset-y-0 flex items-center`
- Icons in flex containers need `shrink-0`
- Use flex for alignment, not margin hacks
- Consistent icon gaps: sm=`gap-1.5`, md=`gap-2`, lg=`gap-2`, list=`gap-2`/`gap-3`
