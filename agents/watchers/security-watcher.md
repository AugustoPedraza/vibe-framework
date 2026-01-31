# Security Watcher

> Background agent that monitors security vulnerabilities and best practices.

---

## Agent Configuration

| Setting | Value | Rationale |
|---------|-------|-----------|
| **Model** | `haiku` | Security patterns are well-defined |
| **Context Budget** | ~15k tokens | Security rules + context |
| **Report File** | `.claude/qa/{FEATURE-ID}/security-watcher.json` | Issue tracking |

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

Monitors and validates:
- Elixir: Sobelow (security static analysis)
- Dependencies: mix_audit, npm audit
- Common vulnerability patterns
- Secrets detection

---

## Check Commands

### Elixir (Sobelow)

```bash
# Full scan
mix sobelow --config

# Specific file
mix sobelow --format json lib/accounts/

# Skip certain checks
mix sobelow --skip Config.HTTPS
```

### Dependency Audits

```bash
# Elixir dependencies
mix deps.audit

# Node dependencies
cd assets && npm audit
cd assets && npm audit --json
```

### Secrets Detection

```bash
# Check for hardcoded secrets (using grep patterns)
grep -r "password\s*=" lib/ --include="*.ex"
grep -r "secret_key" lib/ --include="*.ex"
grep -r "api_key\s*:" lib/ --include="*.ex"
```

---

## Watcher Behavior

```
ON FILE CHANGE (from progress report):
  1. Run Sobelow on changed Elixir files
  2. Check for common security anti-patterns
  3. Update watcher report
  4. Report to orchestrator (ADVISORY - not blocking by default)

ON DEPENDENCY CHANGE (mix.exs, package.json):
  1. Run dependency audit
  2. Flag known vulnerabilities

ON GATE (phase transition):
  1. Run full Sobelow scan
  2. Run full dependency audit
  3. BLOCK if critical vulnerabilities (per config)
```

---

## Vulnerability Categories

### Critical (May Block)

- SQL injection vulnerabilities
- XSS vulnerabilities
- Hardcoded secrets
- Insecure deserialization
- Known CVEs in dependencies

### High (Warning)

- Missing CSRF protection
- Insecure HTTP (vs HTTPS)
- Weak cryptography
- Directory traversal risks

### Medium/Low (Advisory)

- Missing security headers
- Verbose error messages
- Debug mode enabled
- Information disclosure

---

## Report Schema

Write to `.claude/qa/{FEATURE-ID}/security-watcher.json`:

```json
{
  "watcher": "security-watcher",
  "feature_id": "AUTH-001",
  "status": "watching",
  "last_check": "2026-01-23T10:30:00Z",
  "issues": [
    {
      "severity": "high",
      "tool": "sobelow",
      "category": "SQL.Injection",
      "file": "lib/accounts/queries.ex",
      "line": 45,
      "message": "Potential SQL injection in raw query",
      "recommendation": "Use parameterized queries with Ecto",
      "cwe": "CWE-89"
    },
    {
      "severity": "medium",
      "tool": "npm_audit",
      "category": "dependency",
      "package": "lodash",
      "version": "4.17.20",
      "message": "Prototype pollution vulnerability",
      "fix_available": true,
      "fix_version": "4.17.21",
      "cve": "CVE-2021-23337"
    }
  ],
  "metrics": {
    "checks_run": 5,
    "critical": 0,
    "high": 1,
    "medium": 1,
    "low": 2,
    "files_checked": ["lib/accounts/", "assets/svelte/"]
  },
  "dependency_status": {
    "elixir": {
      "total": 45,
      "vulnerable": 0
    },
    "npm": {
      "total": 120,
      "vulnerable": 1
    }
  }
}
```

---

## Common Patterns to Detect

### SQL Injection

```elixir
# VULNERABLE
Repo.query("SELECT * FROM users WHERE id = #{user_id}")

# SAFE
Repo.query("SELECT * FROM users WHERE id = $1", [user_id])
```

### XSS in Templates

```elixir
# VULNERABLE
<%= raw @user_input %>

# SAFE
<%= @user_input %>  # Auto-escaped
```

### Hardcoded Secrets

```elixir
# VULNERABLE
config :my_app, secret_key: "hardcoded_secret_123"

# SAFE
config :my_app, secret_key: System.get_env("SECRET_KEY")
```

### Missing CSRF

```elixir
# VULNERABLE
post "/api/action", MyController, :action

# SAFE (with plug)
post "/api/action", MyController, :action
# Ensure :protect_from_forgery in pipeline
```

---

## Gate Behavior

At phase transitions (when `blocking_at_gate: true`):

```
+---------------------------------------------------------------------+
|  SECURITY GATE CHECK                                                 |
|                                                                      |
|  Sobelow: 1 high, 0 critical                                         |
|  Dependency Audit: 1 medium vulnerability                            |
|                                                                      |
|  High Severity Issues:                                               |
|    [HIGH] lib/accounts/queries.ex:45                                 |
|           Potential SQL injection in raw query                       |
|           Recommendation: Use parameterized queries                  |
|                                                                      |
|  Dependency Issues:                                                  |
|    [MED] lodash@4.17.20 - Prototype pollution                        |
|          Fix: npm update lodash                                      |
|                                                                      |
|  Gate Status: ADVISORY (not blocking per config)                     |
|                                                                      |
|  These issues should be addressed before production release.         |
|                                                                      |
|  Options:                                                            |
|    [f] Show fix suggestions  [a] Acknowledge and continue            |
+---------------------------------------------------------------------+
```

---

## Blocking Configuration

In `watcher_config`:

```json
{
  "security-watcher": {
    "enabled": true,
    "blocking_at_gate": false,  // Advisory by default
    "block_on": ["critical"],   // Only critical blocks
    "auto_fix_deps": false      // Don't auto-update dependencies
  }
}
```

Can be configured to be more strict:

```json
{
  "security-watcher": {
    "blocking_at_gate": true,
    "block_on": ["critical", "high"],
    "auto_fix_deps": true
  }
}
```

---

## Integration with Orchestrator

The orchestrator:
1. Spawns security-watcher at start of implementation
2. Receives advisory reports (logged but not blocking)
3. At gates, checks severity against config
4. Includes security summary in final validation report

---

## Prompt Template

```
You are the Security Watcher for {FEATURE-ID}.

RESPONSIBILITY: Monitor security vulnerabilities and best practices

TOOLS:
- Elixir: Sobelow, mix deps.audit
- Node: npm audit

PATTERNS TO DETECT:
- SQL injection
- XSS vulnerabilities
- Hardcoded secrets
- Insecure dependencies
- Missing security headers

CONFIG:
- Blocking at gates: {true/false}
- Block on severity: {["critical"] or ["critical", "high"]}

REPORT FILE: .claude/qa/{FEATURE-ID}/security-watcher.json

ON FILE CHANGE: Run Sobelow on changed files
ON DEPENDENCY CHANGE: Run full audit
ON GATE: Full security scan

START WATCHING.
```

---

## Pre-computed Fixes

> Provide ready-to-apply fixes for security issues.

### Report Schema with Pre-computed Fix

```json
{
  "issues": [
    {
      "severity": "high",
      "file": "lib/accounts/queries.ex",
      "line": 45,
      "type": "sql_injection",
      "message": "Raw SQL with string interpolation",
      "precomputed_fix": {
        "type": "patch",
        "patch": {
          "line": 45,
          "old": "Repo.query(\"SELECT * FROM users WHERE id = #{id}\")",
          "new": "Repo.query(\"SELECT * FROM users WHERE id = $1\", [id])"
        }
      }
    },
    {
      "severity": "medium",
      "package": "lodash",
      "version": "4.17.20",
      "cve": "CVE-2021-23337",
      "precomputed_fix": {
        "type": "command",
        "command": "cd assets && npm update lodash",
        "new_version": "4.17.21"
      }
    }
  ]
}
```

### Fix Types for Security

| Vulnerability | Fix Type | Action |
|--------------|----------|--------|
| SQL injection | patch | Parameterize query |
| XSS | patch | Remove raw/escape properly |
| Hardcoded secret | patch | Move to env variable |
| Vulnerable dep | command | Update command |
| Missing header | patch | Add security header |

---

## Quality Checklist

Before gate pass (when blocking enabled):
- [ ] No critical vulnerabilities
- [ ] No high vulnerabilities (if configured to block)
- [ ] No known CVEs in dependencies
- [ ] No hardcoded secrets detected
- [ ] Report file updated with final status
- [ ] All fixable issues have precomputed_fix
