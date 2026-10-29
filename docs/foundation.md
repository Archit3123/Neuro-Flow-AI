# Foundation conventions

## Request lifecycle

```text
Request → Zod validation → authentication → authorization → service → provider/database
```

Authentication and authorization are deliberately deferred to the next phase.
Until then, this application is single-user development only.

## API validation inventory

| Route | Current validation |
| --- | --- |
| `GET/POST /api/tasks` | POST uses `createTaskSchema`; GET has no input |
| `PATCH/DELETE /api/tasks/[id]` | PATCH uses `updateTaskSchema`; DELETE has no body |
| `POST /api/ai/plan` | Zod schema in route |
| `POST /api/ai/chat` | Zod schema in route |
| `POST /api/schedule` | No input in the current prototype |
| `POST /api/meetings/summarize` | Form input is checked, but file size/type policy is deferred with upload storage |

## Service layout

As a domain gains real operations, place its use cases in one of these modules:

```text
services/task/
services/goal/
services/planning/
services/notes/
services/meetings/
services/scheduler/
services/assistant/
services/automation/
```

Do not create placeholder services. Existing AI provider logic is centralized in
`lib/ai`, with the Groq-specific implementation isolated at
`lib/ai/groq-provider.ts`.
