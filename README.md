# NeuroFlow AI

NeuroFlow AI is an AI-assisted productivity workspace built with Next.js App
Router, TypeScript, Tailwind CSS, Prisma, SQL Server/Azure SQL, and Groq.

> This repository is in its foundation-stabilization phase. It has no
> authentication yet and must not be deployed as a multi-user application.

## Requirements

- Node.js 20 LTS or newer
- A SQL Server or Azure SQL database
- A Groq API key

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`,
   `DB_PASSWORD`, `GROQ_API_KEY`, and optional `GROQ_MODEL`. Keep `.env.local`
   private; it is ignored by Git. `DATABASE_URL` is used by Prisma CLI commands;
   the `DB_*` values are used only by the server-side SQL Server driver adapter.
3. Install dependencies with `npm install`.
4. Generate and validate Prisma Client with `npm run db:generate` and
   `npx prisma validate`.
5. Start the development server with `npm run dev`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the development server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript without emitting files |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:seed` | Seed the configured SQL Server database |
| `npx prisma validate` | Validate the Prisma schema |
| `npm run build` | Create a production build |

## Current architecture

```text
app/           Next.js pages and route handlers
components/    Client-side UI components
services/      Application use cases and business logic
lib/           Shared infrastructure: Prisma, AI provider, validation, HTTP
prisma/        SQL Server schema and seed script
```

Route handlers validate inputs, call application services, and return safe API
responses. Groq is accessed only from server-side modules through the shared AI
service. The task, scheduler, meeting, and assistant features remain prototype
workflows and will be expanded incrementally.
