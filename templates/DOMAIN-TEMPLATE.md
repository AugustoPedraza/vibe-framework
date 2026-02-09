# {Domain} Domain Specification

> Authoritative specification for the {domain} domain.

**Last Updated:** {date}
**Version:** 1.0

---

## Overview

{Brief description of what this domain handles}

---

## Entities

### {EntityName}

> {One-line description}

**Attributes:**

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| id | UUID | Yes | Unique identifier |
| {attr} | {type} | {yes/no} | {description} |

**Relationships:**

| Relationship | Target | Type | Description |
|--------------|--------|------|-------------|
| {rel_name} | {Entity} | belongs_to/has_many | {description} |

**Constraints:**

- {constraint description}

---

## Actions

### {action_name}

> {One-line description}

**Type:** create | read | update | destroy | custom

**Arguments:**

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| {arg} | {type} | {yes/no} | {description} |

**Preconditions:**

- {precondition}

**Postconditions:**

- {postcondition}

**Errors:**

| Error | Condition | Message |
|-------|-----------|---------|
| {error_code} | {when} | {user message} |

---

## Business Rules

### {Rule Name}

**Rule:** {description of the rule}

**Rationale:** {why this rule exists}

**Enforcement:** {where/how enforced}

---

## Events

### {event_name}

> Emitted when {trigger}

**Payload:**

```elixir
%{
  {field}: {type},
  {field}: {type}
}
```

**Subscribers:**

- {who listens and why}

---

## Invariants

> Conditions that must always be true

- {invariant 1}
- {invariant 2}

---

## Scenarios

> Reference scenarios for this domain

### Scenario: {Happy path name}

- **Given** {precondition}
- **When** {action}
- **Then** {outcome}

### Scenario: {Error case name}

- **Given** {precondition}
- **When** {error condition}
- **Then** {graceful handling}

---

## API Surface

### Endpoints

| Method | Path | Action | Description |
|--------|------|--------|-------------|
| GET | /api/v1/{resource} | list | List all |
| GET | /api/v1/{resource}/:id | read | Get one |
| POST | /api/v1/{resource} | create | Create new |
| PATCH | /api/v1/{resource}/:id | update | Update existing |
| DELETE | /api/v1/{resource}/:id | destroy | Delete |

### GraphQL (if applicable)

```graphql
type {Entity} {
  id: ID!
  {field}: {Type}
}

type Query {
  {entity}(id: ID!): {Entity}
  {entities}: [{Entity}!]!
}

type Mutation {
  create{Entity}(input: Create{Entity}Input!): {Entity}
}
```

---

## Change History

| Date | Version | Change | Feature |
|------|---------|--------|---------|
| {date} | 1.0 | Initial specification | - |
