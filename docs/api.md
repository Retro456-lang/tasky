# RetroTask — API Reference

Base URL: `http://localhost:3000/api`

---

## Health Check

```
GET /health
```

**Response** `200 OK`

```json
{ "status": "ok" }
```

---

## Tasks

### List all tasks

```
GET /api/tasks
```

**Response** `200 OK` — Array of `TaskDTO`

```json
[
  {
    "id": "664a...",
    "title": "Design Dashboard Wireframes",
    "description": "Create high-fidelity wireframes...",
    "assignedTo": "Rahul Dev",
    "status": "Completed",
    "priority": "High",
    "dueDate": "2026-06-19",
    "createdAt": "2026-06-16T09:00:00.000Z"
  }
]
```

---

### Create a task

```
POST /api/tasks
Content-Type: application/json
```

**Body**

| Field         | Type     | Required | Constraints                                        |
| ------------- | -------- | -------- | -------------------------------------------------- |
| `title`       | `string` | ✅        | 1–60 chars                                         |
| `description` | `string` | ❌        | max 600 chars, defaults to `""`                    |
| `assignedTo`  | `string` | ✅        | 1–60 chars                                         |
| `status`      | `string` | ✅        | `Pending` · `In Progress` · `Completed` · `Cancelled` |
| `priority`    | `string` | ✅        | `Low` · `Medium` · `High`                         |
| `dueDate`     | `string` | ✅        | `YYYY-MM-DD`                                       |

**Response** `201 Created` — `TaskDTO`

---

### Update a task

```
PUT /api/tasks/:id
Content-Type: application/json
```

**Body** — Same schema as Create.

**Response** `200 OK` — Updated `TaskDTO`

**Errors**

| Status | Message          |
| ------ | ---------------- |
| `404`  | Task not found   |
| `400`  | Validation error |

---

### Delete a task

```
DELETE /api/tasks/:id
```

**Response** `204 No Content`

**Errors**

| Status | Message        |
| ------ | -------------- |
| `404`  | Task not found |

---

## Error Responses

All error responses follow this shape:

```json
{
  "message": "Human-readable error description"
}
```

| Status | Cause                     |
| ------ | ------------------------- |
| `400`  | Zod validation failure    |
| `404`  | Resource not found        |
| `500`  | Unhandled server error    |
