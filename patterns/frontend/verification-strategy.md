# Frontend Verification Strategy

> Run the right checks at the right time. Not everything, every time.

---

## Problem

Running full verification after every change is slow and wasteful:
```bash
npm run verify  # format + lint + check + test = 30-60 seconds
```

During active development, this kills flow.

---

## Tiered Verification

| Tier | When | Commands | Time |
|------|------|----------|------|
| **0: None** | During editing | Let dev server catch errors | 0s |
| **1: Quick** | After file save | Type check only | ~3s |
| **2: Focused** | After implementation | Lint + check changed | ~5s |
| **3: Related** | After test written | Run related tests only | ~5s |
| **4: Full** | Before commit | Everything | ~30s |

---

## Recommended Scripts

Add to `assets/package.json`:

```json
{
  "scripts": {
    "verify:types": "svelte-check --threshold warning",
    "verify:quick": "svelte-check --threshold error",
    "lint:cached": "eslint --cache .",
    "lint:file": "eslint --cache",
    "test:related": "vitest related --run",
    "test:changed": "vitest --changed --run",
    "test:watch": "vitest --watch",
    "verify:staged": "lint-staged",
    "verify": "npm run format:check && npm run lint:all && npm run check && npm run test"
  }
}
```

---

## When to Use Each Tier

### Tier 0: During Active Editing
```
# Dev server running - it catches most errors
# Don't run anything manually
```

### Tier 1: Quick Check (After Completing a Logical Unit)
```bash
npm run verify:quick
```
- Runs svelte-check with error threshold only
- Catches type errors and missing imports
- Fast enough to run frequently

### Tier 2: Focused Check (After Implementing Feature)
```bash
npm run lint:cached && npm run verify:types
```
- Uses eslint cache (skips unchanged files)
- Full type checking
- Run after completing a component

### Tier 3: Related Tests (After Writing/Modifying Tests)
```bash
npm run test:related -- path/to/Component.svelte
# or
npm run test:changed
```
- Only runs tests that import the changed file
- Much faster than full test suite
- Use during TDD cycle

### Tier 4: Full Verification (Before Commit)
```bash
npm run verify
```
- Run everything
- Required before committing
- Catches cross-file issues

---

## Agent-Specific Guidance

### Frontend Agent During Implementation

```
FOR EACH acceptance criterion:
  1. Write test (Tier 0 - dev server catches syntax)
  2. Run test:related (Tier 3 - verify test fails)
  3. Implement component (Tier 0 - dev server feedback)
  4. Run test:related (Tier 3 - verify test passes)
  5. Quick check (Tier 1 - catch type issues)

AFTER all criteria complete:
  1. Run verify:types (Tier 2 - full type check)
  2. Run lint:cached (Tier 2 - full lint)
  3. Run test (full test suite)

BEFORE marking stream complete:
  1. Run verify (Tier 4 - everything)
```

### Integration Agent

```
# After wiring frontend to backend:
npm run test:related -- path/to/wired/Component.svelte

# After all wiring complete:
npm run verify
```

---

## Caching Optimization

### ESLint Cache
```bash
# First run creates cache
npm run lint:cached  # Slow

# Subsequent runs are fast (unchanged files skipped)
npm run lint:cached  # Fast
```

Cache location: `assets/.eslintcache`

### Vitest Related Files
```bash
# Only runs tests that import the changed file
npx vitest related src/components/LoginForm.svelte --run
```

### Svelte Check
```bash
# Threshold reduces noise during dev
svelte-check --threshold warning  # Errors only
svelte-check --threshold error    # Errors + warnings
```

---

## Common Patterns

### TDD Cycle (Fastest)
```bash
# Terminal 1: Watch mode
npm run test:watch

# Terminal 2: Dev server
npm run dev

# Edit files - tests auto-run, dev server auto-reloads
# Only run full verify before commit
```

### Single File Focus
```bash
# Check one file quickly
npx eslint src/components/LoginForm.svelte
npx svelte-check --threshold warning src/components/LoginForm.svelte
npx vitest related src/components/LoginForm.svelte --run
```

### Pre-commit Hook (Recommended)
```bash
# Install lint-staged
npm install -D lint-staged

# package.json
{
  "lint-staged": {
    "*.{ts,svelte}": ["eslint --cache --fix", "svelte-check"],
    "*.{ts,svelte,css,json}": "prettier --write"
  }
}
```

---

## Anti-Patterns

| Don't | Do Instead |
|-------|------------|
| Run `npm run verify` after every save | Let dev server catch errors |
| Run full test suite during TDD | Run `test:related` or `test:watch` |
| Skip verification before commit | Always run full `verify` |
| Ignore cache flags | Use `--cache` for eslint |
| Run format check during dev | Let prettier format on save |

---

## Time Savings

| Approach | Per-Change Time | 10 Changes |
|----------|-----------------|------------|
| Full verify every time | 30s | 5 minutes |
| Tiered (recommended) | 5s avg | 50 seconds |
| **Savings** | | **4+ minutes** |

For a typical feature with 20-30 file edits, this saves 10-15 minutes.
