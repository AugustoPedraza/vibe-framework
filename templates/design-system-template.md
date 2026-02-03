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

### Primary Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-primary` | `oklch(50% 0.12 250)` | Primary brand color |
| `--color-primary-light` | `oklch(65% 0.10 250)` | Hover states, backgrounds |
| `--color-primary-dark` | `oklch(35% 0.14 250)` | Active states, text on light |

### Semantic Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-success` | `oklch(55% 0.15 145)` | Success states, confirmations |
| `--color-warning` | `oklch(70% 0.15 85)` | Warning states, cautions |
| `--color-error` | `oklch(50% 0.18 25)` | Error states, destructive actions |
| `--color-info` | `oklch(55% 0.12 250)` | Informational states |

### Surface Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-surface` | `oklch(99% 0 0)` | Card backgrounds, panels |
| `--color-surface-dim` | `oklch(95% 0.01 250)` | Subtle backgrounds |
| `--color-surface-bright` | `oklch(100% 0 0)` | Elevated surfaces |
| `--color-background` | `oklch(98% 0.005 250)` | Page background |

### Text Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-text-primary` | `oklch(20% 0.02 250)` | Primary text, headings |
| `--color-text-secondary` | `oklch(40% 0.02 250)` | Secondary text, captions |
| `--color-text-muted` | `oklch(55% 0.01 250)` | Disabled, placeholder |
| `--color-text-inverse` | `oklch(98% 0 0)` | Text on dark backgrounds |

### Border Colors

| Token | OKLCH Value | Usage |
|-------|-------------|-------|
| `--color-border` | `oklch(85% 0.01 250)` | Default borders |
| `--color-border-strong` | `oklch(70% 0.02 250)` | Emphasized borders |
| `--color-border-subtle` | `oklch(92% 0.005 250)` | Subtle dividers |

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

Base unit: **8px**

| Token | Value | Usage |
|-------|-------|-------|
| `--space-0` | 0px | No spacing |
| `--space-1` | 4px | Tight spacing, icon gaps |
| `--space-2` | 8px | Small gaps, inline spacing |
| `--space-3` | 12px | Medium gaps |
| `--space-4` | 16px | Default component padding |
| `--space-5` | 20px | Section gaps |
| `--space-6` | 24px | Card padding |
| `--space-8` | 32px | Large gaps |
| `--space-10` | 40px | Section margins |
| `--space-12` | 48px | Page margins |
| `--space-16` | 64px | Large sections |

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

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default layer |
| `--z-dropdown` | 100 | Dropdown menus |
| `--z-sticky` | 200 | Sticky headers |
| `--z-fixed` | 300 | Fixed navigation |
| `--z-modal-backdrop` | 400 | Modal backdrop |
| `--z-modal` | 500 | Modal content |
| `--z-popover` | 600 | Popovers, tooltips |
| `--z-toast` | 700 | Toast notifications |
| `--z-max` | 9999 | Maximum z-index |

---

## Motion / Animation

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 100ms | Micro-interactions |
| `--duration-base` | 200ms | Default transitions |
| `--duration-slow` | 300ms | Page transitions |
| `--duration-slower` | 500ms | Complex animations |
| `--ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard easing |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Entering elements |
| `--ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Exiting elements |

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

## Customization Guide

To customize this template for your project:

1. **Colors**: Update OKLCH values to match your brand palette
2. **Typography**: Adjust font families and sizes for your design
3. **Spacing**: Modify base unit if not using 8px grid
4. **Components**: Add project-specific component size specs
5. **Mobile**: Adjust breakpoints for your target devices

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
