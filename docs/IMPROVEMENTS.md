# Framework Improvements Backlog

> Actionable improvements from industry best practices and popular vibe coding repos.

---

## HIGH Priority

### 1. Extended Thinking Triggers
**Source**: [Anthropic Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)

Add thinking level triggers to complex phases:
- `think` - Basic reasoning
- `think hard` - More computation
- `think harder` - Complex problems
- `ultrathink` - Maximum reasoning (architecture decisions)

**Action**: Update `roles/developer.md` and `roles/domain-architect.md`

---

### 2. Context Clearing Protocol
**Source**: Anthropic Best Practices

Add explicit `/clear` guidance to prevent context degradation.

**Action**: Add to checkpoint templates:
```
After feature complete: /clear before next feature
Between sprint planning and implementation: /clear
```

---

### 3. Hooks for Quality Gates
**Source**: [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)

Pre-commit hooks that enforce:
- Tests pass before commit
- Lint clean
- No TODO without linked issue

**Action**: Create `hooks/` directory with templates

---

### 4. Visual Iteration Workflow
**Source**: Anthropic Best Practices

Screenshot-based iteration in Designer phase:
1. Implement UI
2. Screenshot result
3. Compare to wireframe
4. Iterate 2-3 times

**Action**: Update `roles/designer.md`

---

### 5. Multi-Agent Review
**Source**: Anthropic Best Practices, awesome-claude-code

Parallel Claude instances:
- One writes code
- One reviews code

**Action**: Add `/vibe review` command

---

## MEDIUM Priority

### 6. Task Decomposition
**Source**: [awesome-vibe-coding](https://github.com/filipecalegario/awesome-vibe-coding)

Auto-break complex features into subtasks.

**Action**: Add `/vibe breakdown [ID]` command

---

### 7. Headless/CI Mode
**Source**: Anthropic Best Practices

Support automated pipelines with `--output-format stream-json`

**Action**: Document in README

---

### 8. Cost/Token Tracking
**Source**: awesome-claude-code

Track usage per session/feature.

**Action**: Add to `/vibe retro` output

---

### 9. Git Worktree Support
**Source**: Anthropic Best Practices

Isolate features in separate worktrees.

**Action**: Add `/vibe worktree [ID]` command

---

### 10. Spec-Driven Missions
**Source**: awesome-claude-code

Problem decomposition with clear exit conditions.

**Action**: Enhance `/vibe discover` with mission format

---

## LOW Priority

### 11. Desktop Notifications
Notify on long-running task completion.

### 12. AGENTS.md Format
Generate interoperable agent guidance.

### 13. Multi-Model Support
Abstract prompts for Claude/Gemini/Codex.

### 14. Project Doc Generator
Auto-generate AI collaboration docs.

### 15. Screenshot-to-Code
Convert design screenshots to components.

---

## Quick Wins (Today)

- [ ] Add `think hard` to domain-architect complex scenarios
- [ ] Add `/clear` reminder to feature completion checkpoint
- [ ] Add visual iteration note to designer.md
- [ ] Document headless mode in README

---

## Sources

- [Anthropic: Claude Code Best Practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [awesome-vibe-coding](https://github.com/filipecalegario/awesome-vibe-coding)
- [awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [awesome-cursorrules](https://github.com/PatrickJS/awesome-cursorrules)
