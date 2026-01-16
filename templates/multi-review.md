# Multi-Agent Review Request

## Context
Feature: {{FEATURE_ID}}
Files: {{FILES}}
Generated: {{TIMESTAMP}}

---

## Copilot Questions (IDE Focus)

Open these files in Neovim and review marked `// PERSPECTIVE:` sections.
Enter insert mode near each marker to see Copilot suggestions.

### 1. {{COPILOT_QUESTION_1_TITLE}} ({{FILE}}:{{LINES}})
**Question:** {{COPILOT_QUESTION_1}}
**Look for:** Syntax improvements, Svelte 5 idioms, edge cases

### 2. {{COPILOT_QUESTION_2_TITLE}} ({{FILE}}:{{LINES}})
**Question:** {{COPILOT_QUESTION_2}}
**Look for:** Type safety, memory leaks, lifecycle issues

---

## Codex Questions (Research Focus)

Run via `codex "prompt"` in terminal.

### 1. {{CODEX_TOPIC_1}}
**Prompt:**
```
codex "{{CODEX_PROMPT_1}}"
```
**Why:** {{CODEX_REASON_1}}

### 2. {{CODEX_TOPIC_2}}
**Prompt:**
```
codex "{{CODEX_PROMPT_2}}"
```
**Why:** {{CODEX_REASON_2}}

---

## Evaluation Criteria

When Claude evaluates suggestions, check:

- [ ] Does suggestion follow `architecture/18-anti-patterns.md`?
- [ ] Does suggestion use design tokens (not raw Tailwind)?
- [ ] Does suggestion align with GLOSSARY terms?
- [ ] Is suggestion simpler than current implementation?
- [ ] Does suggestion improve testability?
- [ ] Does suggestion handle all UI states (loading/error/empty/success)?

---

## Collected Suggestions

### From Copilot (Neovim)

| Location | Copilot Suggestion | Accept/Reject |
|----------|-------------------|---------------|
| {{FILE}}:{{LINE}} | | |
| {{FILE}}:{{LINE}} | | |

### From Codex CLI

| Topic | Codex Response Summary | Applicable? |
|-------|----------------------|-------------|
| {{TOPIC_1}} | | |
| {{TOPIC_2}} | | |

---

## Final Decision

### Summary
{{SUMMARY_OF_DECISION}}

### Rationale
{{WHY_THIS_APPROACH}}

### Changes Made
- [ ] {{CHANGE_1}}
- [ ] {{CHANGE_2}}

### Rejected Alternatives
| Alternative | Reason Rejected |
|-------------|-----------------|
| {{ALT_1}} | {{REASON_1}} |

---

## Review Complete

- [ ] All perspectives collected
- [ ] Claude evaluated against architecture
- [ ] Final implementation committed
- [ ] This file archived to `_reviews/` directory
