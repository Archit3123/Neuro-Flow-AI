import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js loads .env.local for the application; Prisma CLI commands do not.
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx --env-file=.env.local prisma/seed.ts",
  },
  datasource: {
    // Keep generation and static validation available before a local database is provisioned.
    // Database commands still require a non-empty DATABASE_URL.
    url: process.env.DATABASE_URL,
  },
});
