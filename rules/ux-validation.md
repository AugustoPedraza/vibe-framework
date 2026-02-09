# UX Validation Rules

> Auto-loaded design system enforcement rules.

## Design Token Rules

### DT001: No Raw Tailwind Colors (Error)

| Invalid | Valid |
|---------|-------|
| `bg-blue-500` | `bg-primary` |
| `bg-red-500` | `bg-error` |
| `bg-green-500` | `bg-success` |
| `bg-yellow-500` | `bg-warning` |
| `bg-gray-100` | `bg-muted` |
| `bg-white` | `bg-background` |
| `text-gray-500` | `text-muted-foreground` |
| `text-gray-900` | `text-foreground` |
| `border-gray-200` | `border-border` |

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

Valid: `0, px, 0.5, 1, 2, 3, 4, 6, 8, 12, 16, 20, 24`
Invalid: `p-5, p-7, p-9, p-10, p-11, p-14, m-5, gap-5`

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

Valid: `rounded-none, rounded-sm, rounded-md, rounded-lg, rounded-full`
Invalid: `rounded-xl, rounded-2xl, rounded-3xl`

## UI State Rules

- **Loading**: Components with async operations MUST show skeleton/loading state
- **Error**: All async operations MUST handle error state with `role="alert"`
- **Empty**: Lists/data components MUST handle empty state with `EmptyState` component

## Alignment Rules

- No `top-1/2 -translate-y-1/2` in input icons. Use `inset-y-0 flex items-center`
- Icons in flex containers need `shrink-0`
- Use flex for alignment, not margin hacks
- Consistent icon gaps: sm=`gap-1.5`, md=`gap-2`, lg=`gap-2`, list=`gap-2`/`gap-3`
