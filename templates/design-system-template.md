# Design System Specification

> Machine-parseable design system tokens for {project.name}

---

## Platform & Device Target

| Property | Value | Notes |
|----------|-------|-------|
| **Primary Device** | Mobile | PWA-first design |
| **Viewport Width** | 320px - 428px | iPhone SE to iPhone Pro Max |
| **Touch Target** | 44px minimum | Apple HIG requirement |
| **Orientation** | Portrait primary | Lock in manifest if needed |
| **Safe Areas** | env(safe-area-inset-*) | Notch/home indicator support |

---

## Color Palette

> **AI guidance:** Prefer semantic tokens over raw color scales. Use `bg-primary` not `bg-blue-500`,
> `text-muted` not `text-gray-500`. Only use raw scales when no semantic token matches the intent.

### Primary Colors

| Token | OKLCH Value | When to Use |
|-------|-------------|-------------|
| `--color-primary` | `oklch(50% 0.12 250)` | Primary buttons, active nav, links, focus rings |
| `--color-primary-light` | `oklch(65% 0.10 250)` | Hover states, selected row backgrounds, badges |
| `--color-primary-dark` | `oklch(35% 0.14 250)` | Active/pressed states, text on light primary bg |

### Semantic Colors

| Token | OKLCH Value | When to Use |
|-------|-------------|-------------|
| `--color-success` | `oklch(55% 0.15 145)` | Form validation pass, save confirmations, online indicators |
| `--color-warning` | `oklch(70% 0.15 85)` | Approaching limits, unsaved changes, expiring items |
| `--color-error` | `oklch(50% 0.18 25)` | Form validation errors, delete confirmations, failed operations |
| `--color-info` | `oklch(55% 0.12 250)` | Help text, informational banners, feature hints |

### Surface Colors

| Token | OKLCH Value | When to Use |
|-------|-------------|-------------|
| `--color-surface` | `oklch(99% 0 0)` | Card backgrounds, panels, dropdown menus |
| `--color-surface-dim` | `oklch(95% 0.01 250)` | Subtle backgrounds, alternating table rows, disabled areas |
| `--color-surface-bright` | `oklch(100% 0 0)` | Elevated surfaces, floating cards, modals |
| `--color-background` | `oklch(98% 0.005 250)` | Page background, main content area |

### Text Colors

| Token | OKLCH Value | When to Use |
|-------|-------------|-------------|
| `--color-text-primary` | `oklch(20% 0.02 250)` | Primary text, headings, input values |
| `--color-text-secondary` | `oklch(40% 0.02 250)` | Secondary text, captions, timestamps |
| `--color-text-muted` | `oklch(55% 0.01 250)` | Disabled text, placeholder text, helper text |
| `--color-text-inverse` | `oklch(98% 0 0)` | Text on dark/colored backgrounds (buttons, badges) |

### Border Colors

| Token | OKLCH Value | When to Use |
|-------|-------------|-------------|
| `--color-border` | `oklch(85% 0.01 250)` | Default borders, input borders, card outlines |
| `--color-border-strong` | `oklch(70% 0.02 250)` | Focused inputs, emphasized sections, active states |
| `--color-border-subtle` | `oklch(92% 0.005 250)` | Subtle dividers, section separators, list dividers |

---

## Typography Scale

### Font Family

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `'Inter', system-ui, sans-serif` | Body text, UI |
| `--font-mono` | `'JetBrains Mono', monospace` | Code, numbers |

### Font Size Scale

| Token | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `--font-xs` | 12px | 1.5 | 400 | Captions, badges |
| `--font-sm` | 14px | 1.5 | 400 | Secondary text, labels |
| `--font-base` | 16px | 1.5 | 400 | Body text |
| `--font-lg` | 18px | 1.4 | 500 | Emphasized text |
| `--font-xl` | 20px | 1.3 | 600 | Section headings |
| `--font-2xl` | 24px | 1.25 | 600 | Page headings |
| `--font-3xl` | 30px | 1.2 | 700 | Hero headings |

### Font Weight

| Token | Value | Usage |
|-------|-------|-------|
| `--font-normal` | 400 | Body text |
| `--font-medium` | 500 | Emphasized text |
| `--font-semibold` | 600 | Headings |
| `--font-bold` | 700 | Strong emphasis |

---

## Spacing Scale

Base unit: **8px** (adjustable via density multiplier)

| Token | Value | When to Use |
|-------|-------|-------------|
| `--space-0` | 0px | No spacing, flush alignment |
| `--space-1` | 4px | Icon-to-text gaps, tight inline spacing |
| `--space-2` | 8px | Small gaps, badge padding, inline element spacing |
| `--space-3` | 12px | Medium gaps, compact list item padding |
| `--space-4` | 16px | Default component padding, form field spacing |
| `--space-5` | 20px | Card content padding, between related groups |
| `--space-6` | 24px | Card outer padding, between form sections |
| `--space-8` | 32px | Large section gaps, page section spacing |
| `--space-10` | 40px | Section margins, hero content spacing |
| `--space-12` | 48px | Page margins, large section dividers |
| `--space-16` | 64px | Major page sections, header/footer spacing |

### Semantic Gaps

| Token | Maps To | When to Use |
|-------|---------|-------------|
| `--gap-form` | `var(--space-6)` | Between form fields in a form group |
| `--gap-section` | `var(--space-8)` | Between page sections |
| `--gap-inline` | `var(--space-2)` | Between inline elements (icon + text) |
| `--gap-stack` | `var(--space-4)` | Between stacked elements in a column |

### Density System

Spacing scales with a density multiplier (`--density: 1` default):

| Density | Multiplier | Use Case |
|---------|-----------|----------|
| Compact | `0.85` | Data-dense tables, admin panels |
| Default | `1.0` | Standard UI, forms, content |
| Comfortable | `1.15` | Touch-first interfaces, accessibility |

---

## Component Sizes

### Buttons

| Variant | Height | Padding X | Font Size | Touch Target |
|---------|--------|-----------|-----------|--------------|
| **sm** | 32px | 12px | 14px | 44px (with margin) |
| **md** | 40px | 16px | 16px | 44px |
| **lg** | 48px | 24px | 18px | 48px |

### Inputs

| Variant | Height | Padding X | Font Size |
|---------|--------|-----------|-----------|
| **sm** | 36px | 12px | 14px |
| **md** | 44px | 16px | 16px |
| **lg** | 52px | 20px | 18px |

### Avatars

| Variant | Size | Font Size | Border Radius |
|---------|------|-----------|---------------|
| **xs** | 24px | 10px | 50% |
| **sm** | 32px | 12px | 50% |
| **md** | 40px | 14px | 50% |
| **lg** | 56px | 18px | 50% |
| **xl** | 80px | 24px | 50% |

### Icons

| Variant | Size | Stroke Width |
|---------|------|--------------|
| **sm** | 16px | 1.5px |
| **md** | 20px | 2px |
| **lg** | 24px | 2px |
| **xl** | 32px | 2px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | No rounding |
| `--radius-sm` | 4px | Small elements, badges |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, modals |
| `--radius-xl` | 16px | Large panels |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadow Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px oklch(0% 0 0 / 0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px oklch(0% 0 0 / 0.07)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px oklch(0% 0 0 / 0.10)` | Modals, popovers |
| `--shadow-xl` | `0 20px 25px oklch(0% 0 0 / 0.15)` | Dialogs, overlays |

---

## Z-Index Layers

> **AI guidance:** NEVER use numeric z-index (`z-50`, `z-[100]`). Always use named tokens.

| Token | Value | When to Use |
|-------|-------|-------------|
| `--z-base` | 0 | Default layer, normal document flow |
| `--z-raised` | 10 | Slightly raised elements (cards with hover) |
| `--z-dropdown` | 100 | Dropdown menus, select popups, autocomplete |
| `--z-sticky` | 200 | Sticky headers, floating action buttons |
| `--z-fixed` | 300 | Fixed navigation bars, bottom tabs |
| `--z-overlay` | 350 | Background overlays, dim layers |
| `--z-modal-backdrop` | 400 | Modal backdrop (click to dismiss) |
| `--z-modal` | 500 | Modal content, dialog boxes |
| `--z-popover` | 600 | Popovers, tooltips, context menus |
| `--z-toast` | 700 | Toast notifications (always on top of modals) |
| `--z-max` | 9999 | Emergency override only — avoid using |

---

## Motion / Animation

| Token | Value | When to Use |
|-------|-------|-------------|
| `--duration-fast` | 100ms | Button press, toggle, checkbox, micro-interactions |
| `--duration-base` | 200ms | Dropdown open, tab switch, default transitions |
| `--duration-slow` | 300ms | Modal open/close, page transitions, drawer slide |
| `--duration-slower` | 500ms | Complex animations, skeleton shimmer, progress |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most transitions, general purpose |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements entering the screen |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements leaving the screen |

### Motion Scale System

Respects user's `prefers-reduced-motion` preference:

| Setting | `--motion-scale` | Effect |
|---------|------------------|--------|
| Normal | `1.0` | Full animations |
| Reduced | `0` | Instant transitions, no animation |

Apply to all durations: `calc(var(--duration-base) * var(--motion-scale))`

---

## Mobile PWA Constraints

### Touch Targets

| Element | Minimum Size | Recommended | Spacing Between |
|---------|--------------|-------------|-----------------|
| **Buttons** | 44x44px | 48x48px | 8px |
| **Links (inline)** | 44px height | - | 8px |
| **List items** | 44px height | 48-56px | 1px border |
| **Icons (tappable)** | 44x44px (hit area) | - | 8px |

### Safe Areas

```css
/* Top safe area (notch) */
padding-top: env(safe-area-inset-top);

/* Bottom safe area (home indicator) */
padding-bottom: env(safe-area-inset-bottom);

/* Side safe areas (landscape) */
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

### Viewport Breakpoints

| Token | Value | Usage |
|-------|-------|-------|
| `--breakpoint-sm` | 320px | Small phones |
| `--breakpoint-md` | 375px | Standard phones |
| `--breakpoint-lg` | 428px | Large phones |
| `--breakpoint-tablet` | 768px | Tablet (if supported) |

---

## Usage Examples

### Correct Usage

```css
/* Colors - use tokens */
.button {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

/* Spacing - use scale */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

/* Typography - use tokens */
.heading {
  font-size: var(--font-2xl);
  font-weight: var(--font-semibold);
}

/* Z-index - use layers */
.modal {
  z-index: var(--z-modal);
}
```

### Incorrect Usage (Violations)

```css
/* RAW COLOR - should be var(--color-primary) */
.button {
  background: oklch(50% 0.12 250);
}

/* RAW SPACING - should be var(--space-4) */
.card {
  padding: 16px;
}

/* RAW FONT SIZE - should be var(--font-2xl) */
.heading {
  font-size: 24px;
}

/* RAW Z-INDEX - should be var(--z-modal) */
.modal {
  z-index: 500;
}
```

---

## Preset System

Design tokens support presets that change the visual personality without modifying individual tokens:

| Preset | Personality | Border Radius | Spacing Feel | Shadow Intensity |
|--------|------------|---------------|--------------|------------------|
| `linear` | Sharp, professional | Small (`--radius-sm`) | Tight | Minimal |
| `clean` | Balanced, modern | Medium (`--radius-md`) | Default | Moderate |
| `friendly` | Soft, approachable | Large (`--radius-lg`) | Generous | Prominent |

Set in `tokens.css`:
```css
:root { --preset: clean; }
```

Tokens reference the preset: `--radius-button: var(--radius-md)` (changes with preset).

---

## Customization Guide

To customize this template for your project:

1. **Colors**: Update OKLCH values to match your brand palette
2. **Typography**: Adjust font families and sizes for your design
3. **Spacing**: Modify base unit if not using 8px grid
4. **Density**: Adjust `--density` multiplier for your target audience
5. **Preset**: Choose `linear`, `clean`, or `friendly` personality
6. **Components**: Add project-specific component size specs
7. **Mobile**: Adjust breakpoints for your target devices
8. **Motion**: Set `--motion-scale` behavior for reduced motion

---

## Validation Rules

The design-system-policer validates against these rules:

| Category | Check | Severity |
|----------|-------|----------|
| **Color** | No raw oklch/rgb/hsl/hex values | warning |
| **Spacing** | No raw px for margin/padding/gap | warning |
| **Typography** | No raw font-size values | warning |
| **Z-Index** | No raw z-index numbers | warning |
| **Touch Targets** | Minimum 44px for interactive elements | blocker |
| **Safe Areas** | Use env() for edge-to-edge layouts | warning |

---

## Notes

- All color values use OKLCH for perceptual uniformity
- Spacing follows 8px base grid for alignment
- Touch targets follow Apple Human Interface Guidelines
- Z-index uses named layers to prevent conflicts
