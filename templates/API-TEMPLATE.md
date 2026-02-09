# API Specification

> Authoritative specification for all API endpoints.

**Last Updated:** {date}
**Version:** 1.0
**Base URL:** `/api/v1`

---

## Authentication

### Method

{Bearer token | Session cookie | API key}

### Headers

```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### Error Responses

| Status | Meaning | Response |
|--------|---------|----------|
| 401 | Unauthorized | `{"error": "unauthorized"}` |
| 403 | Forbidden | `{"error": "forbidden", "reason": "..."}` |

---

## Endpoints by Domain

### {Domain} Domain

#### List {Resources}

```
GET /api/v1/{resources}
```

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | integer | 1 | Page number |
| per_page | integer | 20 | Items per page (max 100) |
| sort | string | created_at | Sort field |
| order | string | desc | Sort order (asc/desc) |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "type": "{resource}",
      "attributes": { }
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "per_page": 20
  }
}
```

#### Get {Resource}

```
GET /api/v1/{resources}/:id
```

**Response:**

```json
{
  "data": {
    "id": "uuid",
    "type": "{resource}",
    "attributes": { },
    "relationships": { }
  }
}
```

**Errors:**

| Status | Condition |
|--------|-----------|
| 404 | Resource not found |

#### Create {Resource}

```
POST /api/v1/{resources}
```

**Request Body:**

```json
{
  "data": {
    "type": "{resource}",
    "attributes": {
      "{field}": "{value}"
    }
  }
}
```

**Response:** `201 Created`

```json
{
  "data": {
    "id": "uuid",
    "type": "{resource}",
    "attributes": { }
  }
}
```

**Errors:**

| Status | Condition |
|--------|-----------|
| 400 | Invalid request body |
| 422 | Validation failed |

#### Update {Resource}

```
PATCH /api/v1/{resources}/:id
```

**Request Body:**

```json
{
  "data": {
    "type": "{resource}",
    "attributes": {
      "{field}": "{new_value}"
    }
  }
}
```

**Response:** `200 OK`

**Errors:**

| Status | Condition |
|--------|-----------|
| 404 | Resource not found |
| 422 | Validation failed |

#### Delete {Resource}

```
DELETE /api/v1/{resources}/:id
```

**Response:** `204 No Content`

**Errors:**

| Status | Condition |
|--------|-----------|
| 404 | Resource not found |
| 409 | Cannot delete (has dependencies) |

---

## Custom Endpoints

### {Action Name}

```
POST /api/v1/{resources}/:id/{action}
```

**Description:** {what this does}

**Request Body:**

```json
{
  "{field}": "{value}"
}
```

**Response:**

```json
{
  "data": { },
  "message": "{success message}"
}
```

---

## Webhooks (if applicable)

### {Event} Webhook

**Trigger:** {when this fires}

**Payload:**

```json
{
  "event": "{event_name}",
  "timestamp": "ISO8601",
  "data": { }
}
```

---

## Rate Limiting

| Tier | Requests | Window |
|------|----------|--------|
| Default | 100 | 1 minute |
| Authenticated | 1000 | 1 minute |

**Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
```

---

## Versioning

- API version in URL path: `/api/v1/...`
- Breaking changes require new version
- Old versions supported for 6 months after deprecation

---

## Change History

| Date | Version | Change | Feature |
|------|---------|--------|---------|
| {date} | 1.0 | Initial API specification | - |
