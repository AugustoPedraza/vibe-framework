# Quick Phase

> Condensed 2-phase workflow for bugs and hotfixes.

---

## Phase Entry

```
+======================================================================+
|  ⚡ QUICK MODE                                                        |
|  Task: {description}                                                  |
|  Context: roles/developer/core.md                                     |
+======================================================================+
```

## When to Use

- Bug fixes
- Typo corrections
- Small enhancements
- Hotfixes
- Single-file changes

---

## Phase 1: Dev (Condensed)

### 1. Understand the Issue

1. Read relevant code
2. Identify the problem
3. Determine scope

### 2. Write Test (if applicable)

For bugs:
```
1. Write test that reproduces the bug
2. Run test to confirm failure
3. This proves the bug exists
```

### 3. Implement Fix

```
1. Make minimal change
2. Focus on the specific issue
3. Don't refactor adjacent code
```

### 4. Run Tests

```bash
{{commands.test}}
```

**Expected**: All tests pass

---

## Phase 2: Verify

### 1. Quality Checks

```bash
{{commands.check}}
```

### 2. Quick Checklist

- [ ] Tests pass
- [ ] No lint errors
- [ ] No type errors
- [ ] No debug statements left
- [ ] Change is minimal and focused

### 3. Commit (if requested)

```
fix({area}): {short description}

{longer explanation if needed}

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Context Loading

Quick mode uses minimal context:

```yaml
quick_mode:
  load:
    - prompts/vibe-core.md
    - prompts/phases/quick.md
    - roles/developer/core.md
    - Affected file(s)

  skip:
    - Full pattern matching
    - QA role modules
    - Designer role modules
    - Full architecture docs
```

---

## Skip Conditions

Quick mode is NOT for:
- New features
- Multi-file changes
- Architecture changes
- UX modifications
- Anything requiring design review

**If scope grows, transition to full `/vibe [ID]` workflow.**

---

## Output

```json
{
  "type": "quick",
  "description": "{task}",
  "files_modified": ["path/to/file.ex"],
  "tests": {
    "added": 1,
    "passing": true
  },
  "committed": true|false,
  "commit_sha": "abc123"
}
```
