# Design System Policer Agent

> Validate code against project-specific design system tokens.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `haiku` | Pattern matching against parsed tokens |
| **Context Budget** | ~15k tokens | Design spec + files to check |
| **Report File** | `.claude/check-reports/design-system.json` | Violations tracking |

**Spawning configuration:**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku",
  run_in_background: true,
  prompt: "..." // See below
})
```

---

## Responsibility

Read project-specific design system specification and validate code against defined tokens:
- Parse token tables from `{{paths.design_system}}` (default: `architecture/design-system.md`)
- Extract all token definitions (colors, spacing, typography, etc.)
- Scan CSS/Svelte files for raw values
- Match raw values to appropriate tokens
- Report violations with suggested token alternatives

---

## Trigger Points

```
/vibe check <PR_NUMBER>
├── PHASE 1: SETUP
│   └── Verify design-system.md exists (HARD REQUIREMENT)
├── PHASE 2: VERIFY (all spawn in parallel)
│   ├── backend-checker
│   ├── frontend-checker
│   ├── best-practices-policer
│   ├── anti-pattern-detector
│   ├── code-smell-detector
│   └── design-system-policer  ←── THIS AGENT
└── PHASE 3: COLLECT
```

---

## Validation Categories

### Color Tokens

| Check | Detection Pattern | Severity |
|-------|-------------------|----------|
| Raw OKLCH | `oklch\([^)]+\)` | warning |
| Raw RGB/RGBA | `rgba?\([^)]+\)` | warning |
| Raw HSL/HSLA | `hsla?\([^)]+\)` | warning |
| Raw HEX | `#[0-9a-fA-F]{3,8}` | warning |

**Detection Commands:**
```bash
# Raw OKLCH colors
grep -rE "oklch\([^)]+\)" {PATH}/assets/

# Raw RGB colors
grep -rE "rgba?\([^)]+\)" {PATH}/assets/

# Raw HSL colors
grep -rE "hsla?\([^)]+\)" {PATH}/assets/

# Raw HEX colors (in CSS properties)
grep -rE "(color|background|border|fill|stroke):\s*#[0-9a-fA-F]+" {PATH}/assets/
```

**Expected Fix:**
```
current:  background: oklch(50% 0.12 250);
expected: background: var(--color-primary);
```

### Spacing Tokens

| Check | Detection Pattern | Severity |
|-------|-------------------|----------|
| Raw margin | `margin:\s*[0-9]+px` | warning |
| Raw padding | `padding:\s*[0-9]+px` | warning |
| Raw gap | `gap:\s*[0-9]+px` | warning |
| Raw top/right/bottom/left | `(top|right|bottom|left):\s*[0-9]+px` | warning |

**Detection Commands:**
```bash
# Raw spacing values
grep -rE "(margin|padding|gap):\s*[0-9]+px" {PATH}/assets/

# Individual spacing properties
grep -rE "(margin|padding)-(top|right|bottom|left):\s*[0-9]+px" {PATH}/assets/
```

**Expected Fix:**
```
current:  margin: 16px;
expected: margin: var(--space-4);
```

**Spacing Token Mapping:**
| Raw Value | Token |
|-----------|-------|
| 4px | `--space-1` |
| 8px | `--space-2` |
| 12px | `--space-3` |
| 16px | `--space-4` |
| 20px | `--space-5` |
| 24px | `--space-6` |
| 32px | `--space-8` |
| 40px | `--space-10` |
| 48px | `--space-12` |
| 64px | `--space-16` |

### Typography Tokens

| Check | Detection Pattern | Severity |
|-------|-------------------|----------|
| Raw font-size | `font-size:\s*[0-9]+px` | warning |
| Raw font-weight (numeric) | `font-weight:\s*[0-9]+` | info |
| Raw line-height | `line-height:\s*[0-9.]+` | info |

**Detection Commands:**
```bash
# Raw font sizes
grep -rE "font-size:\s*[0-9]+px" {PATH}/assets/

# Raw font weights
grep -rE "font-weight:\s*[0-9]+" {PATH}/assets/
```

**Expected Fix:**
```
current:  font-size: 24px;
expected: font-size: var(--font-2xl);
```

### Z-Index Tokens

| Check | Detection Pattern | Severity |
|-------|-------------------|----------|
| Raw z-index | `z-index:\s*[0-9]+` | warning |

**Detection Commands:**
```bash
# Raw z-index values
grep -rE "z-index:\s*[0-9]+" {PATH}/assets/
```

**Expected Fix:**
```
current:  z-index: 500;
expected: z-index: var(--z-modal);
```

**Z-Index Token Mapping:**
| Raw Value Range | Token |
|-----------------|-------|
| 0 | `--z-base` |
| 1-100 | `--z-dropdown` |
| 101-200 | `--z-sticky` |
| 201-300 | `--z-fixed` |
| 301-400 | `--z-modal-backdrop` |
| 401-500 | `--z-modal` |
| 501-600 | `--z-popover` |
| 601-700 | `--z-toast` |
| 700+ | `--z-max` |

### Border Radius Tokens

| Check | Detection Pattern | Severity |
|-------|-------------------|----------|
| Raw border-radius | `border-radius:\s*[0-9]+px` | info |

**Detection Commands:**
```bash
# Raw border radius
grep -rE "border-radius:\s*[0-9]+px" {PATH}/assets/
```

### Component Size Compliance

| Check | Requirement | Severity |
|-------|-------------|----------|
| Button height | Minimum 32px, touch target 44px | warning |
| Input height | Minimum 36px, recommended 44px | warning |
| Touch targets | Minimum 44x44px for interactive | blocker |

**Detection Logic:**
```bash
# Check for small button heights
grep -rE "\.button.*height:\s*[0-2][0-9]px" {PATH}/assets/

# Check for small touch targets
grep -rE "(width|height):\s*[0-3][0-9]px" {PATH}/assets/ | grep -E "(button|link|icon)"
```

### Mobile PWA Compliance

| Check | Detection | Severity |
|-------|-----------|----------|
| Touch target minimum | Interactive elements < 44px | blocker |
| Safe area usage | Edge-to-edge without env() | warning |

---

## Report Schema

Write to `.claude/check-reports/design-system.json`:

```json
{
  "policer": "design-system",
  "spec_path": "architecture/design-system.md",
  "tokens_parsed": {
    "colors": 15,
    "spacing": 12,
    "typography": 10,
    "z_index": 9,
    "border_radius": 6
  },
  "violations": [
    {
      "id": "DS-001",
      "category": "color",
      "severity": "warning",
      "file": "assets/svelte/components/Button.svelte",
      "line": 45,
      "message": "Raw OKLCH color value",
      "current": "background: oklch(50% 0.12 250);",
      "expected": "background: var(--color-primary);",
      "token_match": {
        "token": "--color-primary",
        "value": "oklch(50% 0.12 250)"
      },
      "auto_fixable": true
    },
    {
      "id": "DS-002",
      "category": "spacing",
      "severity": "warning",
      "file": "assets/svelte/components/Card.svelte",
      "line": 12,
      "message": "Raw spacing value",
      "current": "margin: 12px;",
      "expected": "margin: var(--space-3);",
      "token_match": {
        "token": "--space-3",
        "value": "12px"
      },
      "auto_fixable": true
    },
    {
      "id": "DS-003",
      "category": "z-index",
      "severity": "warning",
      "file": "assets/svelte/components/Modal.svelte",
      "line": 8,
      "message": "Raw z-index value",
      "current": "z-index: 500;",
      "expected": "z-index: var(--z-modal);",
      "token_match": {
        "token": "--z-modal",
        "value": "500"
      },
      "auto_fixable": true
    },
    {
      "id": "DS-004",
      "category": "touch-target",
      "severity": "blocker",
      "file": "assets/svelte/components/IconButton.svelte",
      "line": 15,
      "message": "Touch target below 44px minimum",
      "current": "width: 32px; height: 32px;",
      "expected": "min-width: 44px; min-height: 44px;",
      "auto_fixable": false
    }
  ],
  "summary": {
    "total_violations": 4,
    "blockers": 1,
    "warnings": 3,
    "by_category": {
      "color": 1,
      "spacing": 1,
      "z-index": 1,
      "touch-target": 1
    },
    "auto_fixable": 3
  }
}
```

---

## Display Format

### In /vibe check Results

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN SYSTEM (4 issues)
  [DS1] WARN - Button.svelte:45
        oklch(50% 0.12 250) → var(--color-primary)
  [DS2] WARN - Card.svelte:12
        margin: 12px → var(--space-3)
  [DS3] WARN - Modal.svelte:8
        z-index: 500 → var(--z-modal)
  [DS4] BLOCKER - IconButton.svelte:15
        Touch target 32px < 44px minimum
```

### Issue Details View

```
+---------------------------------------------------------------------+
|  ISSUE DETAILS: DS1                                                  |
+---------------------------------------------------------------------+

Category: color
Severity: WARNING

File: assets/svelte/components/Button.svelte
Line: 45

Current:
  background: oklch(50% 0.12 250);

Expected:
  background: var(--color-primary);

Token Match:
  --color-primary = oklch(50% 0.12 250)

Auto-fixable: Yes

Why this matters:
  Using design tokens ensures visual consistency and makes
  theme changes/dark mode implementation easier.

[b] Back to summary  [n] Next issue
```

---

## Token Parsing Logic

### Reading Design System Spec

The agent reads the design system markdown and extracts token tables:

```typescript
// Parse color table
const colorTable = parseMarkdownTable(spec, "Color Palette");
// Result: [{ token: "--color-primary", value: "oklch(50% 0.12 250)" }, ...]

// Parse spacing table
const spacingTable = parseMarkdownTable(spec, "Spacing Scale");
// Result: [{ token: "--space-4", value: "16px" }, ...]
```

### Matching Raw Values to Tokens

When a raw value is detected:

1. **Exact Match**: If raw value equals a token value exactly
   ```
   oklch(50% 0.12 250) → --color-primary (exact match)
   ```

2. **Nearest Match**: For spacing, find closest token
   ```
   15px → --space-4 (16px, nearest)
   ```

3. **Range Match**: For z-index, use layer ranges
   ```
   450 → --z-modal (range 401-500)
   ```

---

## Exclusions

Files/patterns to skip:

```yaml
exclusions:
  - "**/node_modules/**"
  - "**/vendor/**"
  - "**/*.min.css"
  - "**/tailwind.config.*"
  - "**/design-system.md"  # The spec itself
  - "**/tokens.css"        # CSS variable definitions
  - "**/*.d.ts"
```

---

## Integration with Pitfalls

Design system violations can be tracked in pitfalls.json:

```json
{
  "id": "PIT-DS-001",
  "category": "css",
  "description": "Raw OKLCH color instead of design token",
  "check": {
    "type": "grep_pattern",
    "pattern": "oklch\\([^)]+\\)",
    "paths": ["assets/"]
  },
  "severity": "warning",
  "fix_template": "Replace with var(--color-*) token"
}
```

---

## Prompt Template

```
You are the Design System Policer for PR #{PR_NUMBER}.

RESPONSIBILITY: Validate code against project design system tokens

SPEC FILE: {WORKTREE_PATH}/{{paths.design_system:-architecture/design-system.md}}

WORKFLOW:
1. Read and parse the design system spec file
2. Extract all token tables:
   - Colors (OKLCH values)
   - Spacing (px values mapped to --space-* tokens)
   - Typography (font sizes, weights)
   - Z-index layers
   - Border radius
3. Scan CSS/Svelte files in {WORKTREE_PATH}/assets/ for raw values
4. For each raw value found:
   - Match to appropriate token (exact, nearest, or range)
   - Record violation with file, line, current value, expected token
5. Check component sizes against mobile PWA requirements:
   - Touch targets minimum 44px
   - Safe area usage for edge layouts

DETECTION COMMANDS:
```bash
# Raw OKLCH colors
grep -rE "oklch\([^)]+\)" {WORKTREE_PATH}/assets/

# Raw RGB colors
grep -rE "rgba?\([^)]+\)" {WORKTREE_PATH}/assets/

# Raw HEX colors
grep -rE "(color|background|border):\s*#[0-9a-fA-F]+" {WORKTREE_PATH}/assets/

# Raw spacing
grep -rE "(margin|padding|gap):\s*[0-9]+px" {WORKTREE_PATH}/assets/

# Raw z-index
grep -rE "z-index:\s*[0-9]+" {WORKTREE_PATH}/assets/

# Raw font-size
grep -rE "font-size:\s*[0-9]+px" {WORKTREE_PATH}/assets/
```

SEVERITY RULES:
- blocker: Touch target violations (< 44px for interactive elements)
- warning: Raw color, spacing, typography, z-index values
- info: Border radius, line-height (lower priority)

OUTPUT: Write JSON report to {WORKTREE_PATH}/.claude/check-reports/design-system.json

Create the .claude/check-reports directory if it doesn't exist.

IMPORTANT: For each violation, include:
- Exact file path and line number
- The current raw value found
- The expected token to use
- Whether it's auto-fixable (most token replacements are)
```

---

## Auto-Fix Implementation

When user selects auto-fix for design system violations:

1. **Load violation** with file, line, current/expected values
2. **Apply transformation**:
   ```
   oklch(50% 0.12 250) → var(--color-primary)
   margin: 16px → margin: var(--space-4)
   z-index: 500 → z-index: var(--z-modal)
   ```
3. **Re-check** file for remaining violations
4. **Update report** with fixed count

---

## Quality Checklist

Before reporting:
- [ ] Design system spec file parsed successfully
- [ ] All token tables extracted
- [ ] CSS/Svelte files scanned
- [ ] Violations matched to tokens
- [ ] Touch target compliance checked
- [ ] Report written to correct path
- [ ] Auto-fixable status determined for each violation
