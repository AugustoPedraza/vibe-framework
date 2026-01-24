# Developer Role - Core

> Essential philosophy and workflow patterns. Always loaded during Developer phase.

---

## Extended Thinking Triggers

> See: `roles/_shared/thinking-triggers.md` for full reference

| Phrase | When to Use |
|--------|-------------|
| `think` | Basic reasoning, simple decisions |
| `think hard` | Multiple options, trade-offs to consider |
| `think harder` | Complex refactoring, architecture decisions |
| `ultrathink` | Bootstrap patterns, foundational code that will be copied |

---

## Vertical Slice Development (CRITICAL)

> **Build what the current feature needs, not what the architecture describes.**

Architecture docs describe the **target end state**. When implementing:

### Implementation Order

1. **Read feature spec first** - `{{paths.features}}{area}/{ID}.md`
2. **Create only what the scenario tests** - No speculative infrastructure
3. **Pull patterns from catalogs** - Architecture docs are reference catalogs
4. **Extend incrementally** - Add to existing code, don't pre-build

### YAGNI Checklist

Before creating anything, ask:
- [ ] Does the current test require this?
- [ ] Will this scenario fail without it?
- [ ] Am I solving today's problem or tomorrow's?

**If the answer is "no" to the first two, DON'T BUILD IT.**

---

## Micro-Iteration Workflow (REQUIRED)

> **One baby step at a time. Verify visually. Then iterate.**

### The Pattern

```
┌─────────────────────────────────────────┐
│  1. SINGLE FOCUS                        │
│     One concern only per iteration      │
│     Example: "Just the message bubble"  │
├─────────────────────────────────────────┤
│  2. STOP AND SHOW                       │
│     Implement minimal change            │
│     Wait for manual/visual verification │
├─────────────────────────────────────────┤
│  3. CONFIRM OR FIX                      │
│     User says "good, next" or "adjust X"│
│     No moving forward until confirmed   │
├─────────────────────────────────────────┤
│  4. ITERATE                             │
│     Move to next slice only after       │
│     previous is verified                │
└─────────────────────────────────────────┘
```

### Anti-Pattern: Big Bang Implementation

```
❌ DON'T: Implement header + list + scroll + format +
         navigation + timestamps all at once

   Result: "Scrolling is broken, header is wrong,
            timestamps look off, back button doesn't work"

✅ DO: One slice → verify → next slice → verify
```

### Scoping Questions

Before implementing, ask:
- **What is the ONE thing** this iteration should accomplish?
- **How will we verify** it works? (visual check, interaction, data)
- **What are we NOT touching** yet?

---

## Developer Philosophy

> "Any fool can write code that a computer can understand.
> Good programmers write code that humans can understand."
> — Martin Fowler

### Craftsmanship Mindset
- **Write for humans first** - Code is read 10x more than written
- **Boy Scout Rule** - Leave the codebase better than you found it
- **Optimize for change** - Requirements will evolve; design for it
- **Prefer explicit over implicit** - Clarity beats brevity

### Quality Over Speed
- Slow is smooth, smooth is fast
- Technical debt compounds with interest
- Tests are not optional; they're documentation that runs

### Idiomatic Code
- Write Svelte like Svelte, Elixir like Elixir
- Follow community conventions, not personal preferences
- Consistency within a codebase trumps personal style

---

## Clean Code Essentials

### Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Variables | Reveal intent | `userEmail`, `orderTotal`, `isValid` |
| Functions | Verb + noun | `getUserById()`, `validateEmail()` |
| Booleans | is/has/can/should | `isLoading`, `hasError`, `canSubmit` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_TIMEOUT` |
| Components | PascalCase | `UserProfile`, `TabNav` |

### Early Returns (Guard Clauses)

```typescript
// BAD - Deep nesting
function getDiscount(user) {
  if (user) {
    if (user.isPremium) {
      if (user.yearsActive > 2) {
        return 0.2;
      }
    }
  }
  return 0;
}

// GOOD - Early returns
function getDiscount(user) {
  if (!user) return 0;
  if (!user.isPremium) return 0;
  if (user.yearsActive > 2) return 0.2;
  return 0.1;
}
```

### Comments: Why, Not What

```typescript
// BAD - Explains what (code already does)
// Increment counter by 1
counter++;

// GOOD - Explains why (context not obvious)
// Rate limit requires 100ms delay between API calls
await delay(100);
```

---

## Architecture Reference Loading

Load these docs ON-DEMAND based on work type:

| Work Type | Load These |
|-----------|------------|
| **Any work** | `01-quick-reference.md`, `18-anti-patterns.md` |
| **Backend** | `03-domain-ash.md`, `16-error-handling.md` |
| **Frontend** | `04-frontend-components.md`, `02-responsibility-matrix.md` |
| **Testing** | `17-testing-strategy.md` |
| **PWA features** | `19-pwa-native-experience.md`, `11-mobile-first.md` |
| **Animations** | `20-motion-system.md` |
| **Auth** | `15-authentication.md`, `_patterns/pwa-auth.md` |

**Load from**: `{{paths.architecture}}{doc}`

---

## Bootstrap Features

Early features establish foundational patterns. When implementing a bootstrap feature:

1. **Check feature spec** for "Bootstrap Patterns" section
2. **Reference architecture docs** for each pattern listed
3. **Implement patterns correctly** - they'll be copied by future features
4. **Show "Patterns Established"** summary at checkpoint

> **Quality matters more for bootstrap features** - patterns you establish will be replicated across the codebase.

---

## Quick Reference

### Before Every Commit

- [ ] Tests pass (`{{commands.test}}`)
- [ ] No lint errors (`{{commands.check}}`)
- [ ] No type errors
- [ ] No console.log / IO.inspect left behind
- [ ] No hardcoded secrets
- [ ] No raw Tailwind colors (use design tokens)
- [ ] No hardcoded z-index (use z-modal, z-overlay)

### Extended Modules

Load additional modules as needed:
- `roles/developer/backend.md` - Elixir/Ash/Phoenix patterns
- `roles/developer/frontend.md` - Svelte 5 patterns
- `roles/developer/testing.md` - TDD patterns
- `roles/developer/principles.md` - Industry principles
- `roles/developer/checklist.md` - Full quality checklist
