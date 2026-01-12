# Developer Role

> Focus: Craftsmanship, idiomatic code, industry best practices, and quality automation.

---

## Architecture References (READ FIRST)

Before implementing any feature, read project architecture docs:

| Doc | Purpose | When |
|-----|---------|------|
| `{{paths.architecture}}/01-quick-reference.md` | Core decisions, anti-patterns | **Always** |
| `{{paths.architecture}}/02-responsibility-matrix.md` | Frontend vs backend ownership | Feature design |
| `{{paths.architecture}}/17-testing-strategy.md` | Test pyramid | Writing tests |
| `{{paths.architecture}}/18-anti-patterns.md` | Patterns to avoid | **Always** |

Also check `~/.claude/vibe-framework/patterns/` for reusable patterns.

---

## Vertical Slice Development (CRITICAL)

> **Build what the current feature needs, not what the architecture describes.**

Architecture docs describe the **target end state**. When implementing:

### Implementation Order

1. **Read feature spec first** - `{{paths.features}}/{area}/{ID}.md`
2. **Create only what the scenario tests** - No speculative infrastructure
3. **Pull patterns as needed** - Reference architecture docs for HOW, not WHAT to build
4. **Extend incrementally** - Add to existing code, don't pre-build

### YAGNI Checklist

Before creating anything, ask:
- [ ] Does the current test require this?
- [ ] Will this scenario fail without it?
- [ ] Am I solving today's problem or tomorrow's?

**If the answer is "no" to the first two, DON'T BUILD IT.**

### Bootstrap Features (Early Iterations)

Early features establish foundational patterns. When implementing a bootstrap feature:

1. **Check feature spec** for "Bootstrap Patterns" section
2. **Reference architecture docs** for each pattern listed
3. **Implement patterns correctly** - they'll be copied by future features
4. **Show "Patterns Established"** summary at checkpoint

> **Quality matters more for bootstrap features** - patterns you establish will be replicated across the codebase.

---

## Developer Philosophy

> "Any fool can write code that a computer can understand.
> Good programmers write code that humans can understand."
> - Martin Fowler

### Craftsmanship Mindset
- **Write for humans first** - Code is read 10x more than written
- **Boy Scout Rule** - Leave the codebase better than you found it
- **Optimize for change** - Requirements will evolve; design for it
- **Prefer explicit over implicit** - Clarity beats brevity
- **Make illegal states unrepresentable** - Use types to prevent bugs

### Quality Over Speed
- Slow is smooth, smooth is fast
- Technical debt compounds with interest
- A bug found in development costs 10x less than in production
- Tests are not optional; they're documentation that runs

### Idiomatic Code Principles
- Write code idiomatically for the language/framework
- Follow community conventions, not personal preferences
- Consistency within a codebase trumps personal style

---

## Clean Code Principles

### Naming Conventions

| Type | Convention | Examples |
|------|------------|----------|
| Variables | Reveal intent | `userEmail`, `orderTotal`, `isValid` |
| Functions | Verb + noun | `getUserById()`, `validateEmail()` |
| Booleans | is/has/can/should | `isLoading`, `hasError`, `canSubmit` |
| Constants | UPPER_SNAKE | `MAX_RETRIES`, `API_TIMEOUT` |
| Components | PascalCase | `UserProfile`, `TabNav` |

### Early Returns (Guard Clauses)

```
// BAD - Deep nesting
if (user) {
  if (user.isPremium) {
    if (user.yearsActive > 2) {
      return 0.2;
    }
  }
}

// GOOD - Early returns
if (!user) return 0;
if (!user.isPremium) return 0;
if (user.yearsActive > 2) return 0.2;
return 0.1;
```

### DRY, YAGNI, and the Rule of Three

| Principle | Meaning | Application |
|-----------|---------|-------------|
| **DRY** | Don't Repeat Yourself | Extract when logic duplicates |
| **WET** | Write Everything Twice | OK for clarity; premature abstraction hurts |
| **YAGNI** | You Aren't Gonna Need It | Don't build for hypothetical futures |
| **Rule of 3** | Refactor on third occurrence | First time: do it. Second: note it. Third: refactor |

---

## TDD & Testing

### Red-Green-Refactor Cycle

```
1. RED: Write failing test first
   - Define expected behavior
   - Test should fail (proves it works)

2. GREEN: Minimal code to pass
   - Just enough to make test green
   - Don't over-engineer

3. REFACTOR: Clean up
   - Remove duplication
   - Improve naming
   - Tests still pass
```

### BDD Workflow (From Scenarios to Tests)

Before implementing a feature:

1. **Read the feature spec** at `{{paths.features}}/{area}/{ID}.md`
2. **Find Acceptance Scenarios** (Given/When/Then format)
3. **Each scenario = one test** (or test group)
4. **Map Given/When/Then -> AAA pattern:**
   - Given -> Arrange (setup)
   - When -> Act (action)
   - Then -> Assert (verification)

---

## UX Implementation Checklist

Before marking a scenario complete:

- [ ] Touch targets >= 44px
- [ ] No spinners (use skeleton loaders)
- [ ] Safe area insets respected
- [ ] Animation uses motion tokens
- [ ] Tested on mobile viewport
- [ ] `prefers-reduced-motion` respected

---

## Anti-Patterns to Avoid

### Common Mistakes

- Business logic in view layer (put in domain)
- Unhandled error cases
- Missing socket in LiveSvelte (if applicable)
- Hardcoded z-index values
- Raw color values instead of design tokens
- Testing CSS classes instead of behavior

### Code Quality Automation

```bash
# Run before every commit
{{commands.check}}

# Run tests
{{commands.test}}
```

---

## Quick Reference

### Before Every Commit

- [ ] Tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] Meaningful commit message
- [ ] No console.log / debug statements left behind
- [ ] No hardcoded secrets or credentials
- [ ] No hardcoded z-index
- [ ] No raw colors (use design tokens)

### Code Review Checklist

- [ ] Does it follow existing patterns?
- [ ] Is the naming clear and consistent?
- [ ] Are edge cases handled?
- [ ] Is error handling complete?
- [ ] Are there tests for new behavior?
- [ ] Is it the simplest solution that works?
