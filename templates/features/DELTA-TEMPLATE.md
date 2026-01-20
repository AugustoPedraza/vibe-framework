# {FEATURE-ID} Domain Changes

> Tracks modifications to authoritative domain specs for this feature.

## Affected Specs

| Spec | Changes |
|------|---------|
| `specs/domains/{domain}.md` | {summary} |

---

## ADDED Requirements

> New capabilities introduced by this feature.

### {Requirement Name}

The system SHALL {behavior description}.

#### Scenario: {Descriptive name}

- **Given** {precondition}
- **When** {action taken}
- **Then** {expected outcome}

#### Scenario: {Another scenario}

- **Given** {precondition}
- **When** {action taken}
- **Then** {expected outcome}

---

## MODIFIED Requirements

> Changes to existing behavior.

### {Requirement Name}

**Was:** {previous behavior}

**Now:** The system SHALL {new behavior}.

**Rationale:** {why the change is needed}

#### Updated Scenario: {name}

- **Given** {precondition}
- **When** {action taken}
- **Then** {new expected outcome}

---

## REMOVED Requirements

> Deprecated or removed capabilities.

### {Requirement Name}

**Removed because:** {rationale}

**Migration path:** {how existing users/data are handled}

---

## Verification Checklist

- [ ] All ADDED requirements have at least one scenario
- [ ] All MODIFIED requirements show before/after
- [ ] All REMOVED requirements have rationale
- [ ] Scenarios use SHALL/MUST language for testable assertions
- [ ] No orphaned references to removed requirements

---

## Notes

- **Breaking changes:** {list any breaking changes}
- **Dependencies:** {features that depend on these changes}
- **Rollback:** {considerations for reverting}
