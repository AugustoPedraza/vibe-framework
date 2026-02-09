# Accessibility Rules (WCAG 2.1 AA)

> Auto-loaded accessibility requirements for all UI work.

## Critical Requirements

| Element | Requirement | Standard |
|---------|-------------|----------|
| Images | `alt` text or `role="presentation"` | WCAG 1.1.1 |
| Icon buttons | `aria-label="Action"` | WCAG 4.1.2 |
| Form fields | Associated `<label>` or `aria-label` | WCAG 1.3.1 |
| Error messages | `role="alert"` | WCAG 4.1.3 |
| Modals | Trap focus, restore on close | WCAG 2.4.3 |
| Links | Descriptive text (not "click here") | WCAG 2.4.4 |
| Headings | Logical hierarchy (h1 > h2 > h3) | WCAG 1.3.1 |
| Color contrast | >= 4.5:1 (text), >= 3:1 (large text) | WCAG 1.4.3 |
| Focus visible | All interactive elements | WCAG 2.4.7 |
| Keyboard | All functionality via keyboard | WCAG 2.1.1 |
| Reduced motion | Respect `prefers-reduced-motion` | WCAG 2.3.3 |
| Touch targets | >= 44x44px on mobile | WCAG 2.5.5 |

## Focus Management

```svelte
<!-- WRONG: removes focus visibility -->
<button class="outline-none">

<!-- CORRECT: custom focus style -->
<button class="outline-none focus-visible:ring-2 focus-visible:ring-ring">

<!-- BEST: use component (handles focus correctly) -->
<Button>Click me</Button>
```

## Form Patterns

```svelte
<!-- Using FormField wrapper (preferred) -->
<FormField label="Email">
  <Input type="email" />
</FormField>

<!-- Using aria-label (for visually hidden labels) -->
<Input type="search" aria-label="Search messages" />
```

## Perceivable
- Color is not sole indicator of state
- Text can resize to 200% without loss
- Content meaningful without CSS

## Operable
- No keyboard traps
- Logical tab order
- Skip links available
- Time limits can be extended

## Understandable
- Page language set (`lang="en"`)
- Focus doesn't cause unexpected changes
- Error suggestions offered
- Consistent navigation
