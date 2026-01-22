# Git Workflow Guide

> Version control practices for clean history and AI-friendly commits

## Purpose

Establish consistent version control practices that:
1. Create meaningful, atomic commits
2. Enable easy code review and bisection
3. Integrate with TDD checkpoints
4. Support AI-assisted development

---

## Commit Message Schema

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Type (Required)

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add login form` |
| `fix` | Bug fix | `fix(chat): resolve message ordering` |
| `refactor` | Code restructuring | `refactor(api): extract validation` |
| `test` | Adding/fixing tests | `test(user): add registration tests` |
| `docs` | Documentation only | `docs(readme): update setup steps` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `style` | Formatting only | `style(lint): fix eslint warnings` |
| `perf` | Performance improvement | `perf(query): add index for lookup` |

### Scope (Optional but Recommended)

Use feature ID or module name:

```
feat(AUTH-001): implement login flow
fix(chat): resolve message duplication
refactor(Accounts): extract email validation
```

### Subject (Required)

- Max 50 characters
- Imperative mood ("add" not "added")
- No period at end
- Lowercase start

```
# Good
feat(auth): add password reset endpoint

# Bad
feat(auth): Added password reset endpoint.
```

### Body (Optional)

- Explain WHY, not WHAT (code shows what)
- Wrap at 72 characters
- Separate from subject with blank line

```
feat(auth): add password reset endpoint

Users frequently forget passwords and need a self-service option.
This reduces support tickets and improves user experience.

Implements the reset flow described in AUTH-003.
```

### Footer (Optional)

- Reference issues: `Closes #123`, `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`
- Co-authors: `Co-authored-by: Name <email>`

---

## AI-Friendly Commit Schema

<!-- AI:SCHEMA commit_message -->
```json
{
  "type": {
    "enum": ["feat", "fix", "refactor", "test", "docs", "chore", "style", "perf"],
    "description": "Type of change"
  },
  "scope": {
    "type": "string",
    "pattern": "^[A-Z]+-[0-9]+$|^[a-z]+$",
    "description": "Feature ID or module name"
  },
  "subject": {
    "type": "string",
    "maxLength": 50,
    "pattern": "^[a-z].*[^.]$",
    "description": "Imperative mood, no period"
  },
  "body": {
    "type": "string",
    "description": "Explanation of why"
  },
  "footer": {
    "closes": { "type": "array", "items": { "type": "string" } },
    "breaking_change": { "type": "string" },
    "co_authors": { "type": "array", "items": { "type": "string" } }
  }
}
```
<!-- /AI:SCHEMA -->

---

## Branch Naming Convention

### Format

```
<type>/<scope>-<short-description>
```

### Examples

| Branch Name | Purpose |
|-------------|---------|
| `feat/AUTH-001-login-flow` | Feature implementation |
| `fix/chat-message-ordering` | Bug fix |
| `refactor/extract-validation` | Refactoring |
| `test/user-registration` | Adding tests |
| `chore/update-deps` | Maintenance |

### Rules

- Use lowercase and hyphens (no underscores)
- Include feature ID when applicable
- Keep short but descriptive
- Delete after merge

---

## TDD Commit Checkpoints

### Red-Green-Refactor Commits

```
# 1. RED: Write failing test
git commit -m "test(AUTH-001): add login validation tests (red)"

# 2. GREEN: Make test pass
git commit -m "feat(AUTH-001): implement login validation (green)"

# 3. REFACTOR: Clean up
git commit -m "refactor(AUTH-001): extract validation helper"
```

### Commit at Stable Points

<!-- AI:DECISION_TREE commit_timing -->
```yaml
commit_timing:
  description: "When to create a commit"
  rules:
    - condition: "test_state == 'red' AND test_is_complete"
      action: "commit"
      message_suffix: "(red)"
      reason: "Capture test intent before implementation"

    - condition: "test_state == 'green' AND all_tests_pass"
      action: "commit"
      message_suffix: "(green)"
      reason: "Capture working implementation"

    - condition: "refactoring_complete AND all_tests_pass"
      action: "commit"
      message_suffix: ""
      reason: "Capture clean code"

    - condition: "feature_milestone_reached"
      action: "commit"
      message_suffix: ""
      reason: "Logical checkpoint"

  never_commit_when:
    - "tests are failing (except red state)"
    - "code doesn't compile"
    - "work is half-done"
```
<!-- /AI:DECISION_TREE -->

---

## Pre-Commit Checklist

<!-- AI:CHECKLIST pre_commit -->
```yaml
pre_commit:
  items:
    - id: tests_pass
      description: All tests pass
      verification:
        type: command
        command: "{{commands.test}}"
        success_pattern: "0 failures"
      severity: blocker

    - id: no_debug
      description: No debug statements
      verification:
        type: grep_pattern
        pattern: "console\\.log|IO\\.inspect|debugger|binding\\.pry"
        should_match: false
      severity: blocker

    - id: no_secrets
      description: No hardcoded secrets
      verification:
        type: grep_pattern
        pattern: "password\\s*=\\s*[\"'][^\"']+[\"']|api_key\\s*=\\s*[\"']"
        should_match: false
      severity: blocker

    - id: formatted
      description: Code is formatted
      verification:
        type: command
        command: "mix format --check-formatted && npm run format:check"
        success_pattern: ""
      severity: warning

    - id: linted
      description: No lint errors
      verification:
        type: command
        command: "mix credo --strict && npm run lint"
        success_pattern: ""
      severity: warning

    - id: types_check
      description: Type checks pass
      verification:
        type: command
        command: "mix dialyzer && npm run check"
        success_pattern: ""
      severity: warning

    - id: commit_message
      description: Commit message follows convention
      verification:
        type: regex
        pattern: "^(feat|fix|refactor|test|docs|chore|style|perf)(\\([^)]+\\))?: .{1,50}$"
      severity: blocker
```
<!-- /AI:CHECKLIST -->

---

## Atomic Commits

### Principle

Each commit should be:
- **Complete**: Feature works (or test fails as expected)
- **Focused**: One logical change
- **Reversible**: Can be reverted independently
- **Buildable**: Project compiles and runs

### Good Atomic Commits

```
feat(auth): add User resource with email field
feat(auth): add password hashing to User
feat(auth): add login action to Accounts domain
feat(auth): add LoginLive view
feat(auth): add LoginForm Svelte component
```

### Bad Non-Atomic Commits

```
# Too big - multiple unrelated changes
feat(auth): add login, registration, and password reset

# Too small - incomplete change
feat(auth): add email field
feat(auth): add validation to email field  # Should be one commit

# Not buildable
feat(auth): start working on login  # Incomplete, doesn't compile
```

---

## Git Commands Reference

### Daily Workflow

```bash
# Start new feature
git checkout main
git pull
git checkout -b feat/AUTH-001-login

# Work and commit
git add -p                    # Stage interactively
git commit -m "feat(AUTH-001): add login form"

# Keep up to date
git fetch origin
git rebase origin/main        # Keep history linear

# Push
git push -u origin feat/AUTH-001-login
```

### Before PR

```bash
# Squash fixup commits
git rebase -i origin/main

# Ensure tests pass
{{commands.test}}

# Push (force if rebased)
git push --force-with-lease
```

### Useful Commands

```bash
# See what changed
git diff --staged             # Staged changes
git log --oneline -10         # Recent commits
git log --oneline main..HEAD  # Commits in this branch

# Undo mistakes
git reset --soft HEAD~1       # Undo last commit, keep changes
git checkout -- <file>        # Discard file changes
git stash                     # Temporarily save changes

# Clean up
git branch -d feat/AUTH-001   # Delete merged branch
git fetch -p                  # Prune deleted remote branches
```

---

## Integration with Vibe Workflow

### During Feature Development

```
/vibe start AUTH-001
  -> Creates branch: feat/AUTH-001-description
  -> First commit: "chore(AUTH-001): initialize feature structure"

/vibe [phase transitions]
  -> Commits at each phase completion
  -> Uses conventional commit messages

/vibe done
  -> Final commit if needed
  -> Ready for PR
```

### Commit Messages by Phase

| Phase | Typical Commits |
|-------|-----------------|
| Domain Architect | `docs(AUTH-001): add feature spec` |
| QA Engineer | `test(AUTH-001): add login tests (red)` |
| Designer | `style(AUTH-001): add login form styles` |
| Developer | `feat(AUTH-001): implement login (green)` |
| Final | `refactor(AUTH-001): extract validation helper` |

---

## Pull Request Guidelines

### PR Title

Same format as commit message:

```
feat(AUTH-001): implement login flow
```

### PR Description Template

```markdown
## Summary
Brief description of changes.

## Changes
- Added User resource with email/password
- Implemented login action
- Added LoginLive and LoginForm

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
[If UI changes]

## Related
- Closes #123
- Relates to AUTH-001
```

### Review Checklist

Before requesting review:
- [ ] Tests pass
- [ ] No lint errors
- [ ] Commits are atomic and well-messaged
- [ ] PR description is complete
- [ ] Branch is up to date with main

---

## Common Scenarios

### Fixing a Previous Commit

```bash
# If last commit
git commit --amend -m "new message"

# If older commit, use fixup
git commit --fixup <sha>
git rebase -i --autosquash origin/main
```

### Splitting a Large Commit

```bash
git reset HEAD~1
git add -p                    # Stage parts interactively
git commit -m "first part"
git add -p
git commit -m "second part"
```

### Recovering from Mistakes

```bash
# Find lost commits
git reflog

# Restore to previous state
git reset --hard <sha>
```

---

## Anti-Patterns

### Commit Message Anti-Patterns

| Bad | Why | Good |
|-----|-----|------|
| `fix stuff` | Not descriptive | `fix(auth): resolve login redirect` |
| `WIP` | Incomplete work | Don't commit WIP |
| `asdf` | Meaningless | Take time to write good message |
| `Fixed bug` | No context | `fix(chat): prevent duplicate messages` |
| Very long subject | Hard to scan | Keep under 50 chars |

### Workflow Anti-Patterns

| Anti-Pattern | Problem | Solution |
|--------------|---------|----------|
| Committing broken code | Breaks bisect | Only commit at stable points |
| Giant commits | Hard to review | Keep commits atomic |
| Not pulling before starting | Merge conflicts | Always pull first |
| Force pushing to main | Destroys history | Never force push shared branches |
| Not cleaning up branches | Clutter | Delete after merge |
