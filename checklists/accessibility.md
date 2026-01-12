# Accessibility Checklist

> WCAG 2.1 AA Compliance checklist for all UI work

---

## Perceivable

### Text Alternatives
- [ ] All images have alt text
- [ ] Decorative images have empty alt=""
- [ ] Icon buttons have aria-label
- [ ] Complex images have long descriptions

### Time-Based Media
- [ ] Videos have captions
- [ ] Audio has transcripts

### Adaptable
- [ ] Content is meaningful without CSS
- [ ] Reading order makes sense
- [ ] Instructions don't rely on sensory characteristics

### Distinguishable
- [ ] Color contrast >= 4.5:1 (text)
- [ ] Color contrast >= 3:1 (large text, graphics)
- [ ] Color is not sole indicator
- [ ] Text can resize to 200% without loss
- [ ] Text spacing can be adjusted

---

## Operable

### Keyboard Accessible
- [ ] All functionality via keyboard
- [ ] No keyboard traps
- [ ] Focus visible on all interactive elements
- [ ] Logical tab order
- [ ] Skip links available

### Enough Time
- [ ] Time limits can be extended
- [ ] Auto-playing content can be paused

### Seizures and Physical Reactions
- [ ] No content flashes more than 3 times/second
- [ ] Motion can be disabled (prefers-reduced-motion)

### Navigable
- [ ] Page has descriptive title
- [ ] Focus order preserves meaning
- [ ] Link purpose is clear
- [ ] Multiple ways to find pages

---

## Understandable

### Readable
- [ ] Page language is set (lang="en")
- [ ] Unusual words are defined
- [ ] Abbreviations are explained

### Predictable
- [ ] Focus doesn't cause unexpected changes
- [ ] Input doesn't cause unexpected changes
- [ ] Navigation is consistent
- [ ] Components are consistent

### Input Assistance
- [ ] Errors are identified
- [ ] Labels are provided
- [ ] Error suggestions offered
- [ ] Errors are preventable (confirm, review)

---

## Robust

### Compatible
- [ ] Valid HTML
- [ ] Proper ARIA usage
- [ ] Status messages are announced

---

## Quick Reference

| Element | Requirement |
|---------|-------------|
| Images | alt text or role="presentation" |
| Icon buttons | aria-label="Action" |
| Form fields | associated label |
| Error messages | role="alert" |
| Modals | trap focus, restore on close |
| Links | descriptive text (not "click here") |
| Headings | logical hierarchy (h1 -> h2 -> h3) |
