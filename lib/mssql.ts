import "server-only";
import { PrismaMssql } from "@prisma/adapter-mssql";

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} must be configured for the SQL Server connection.`);
  }

  return value;
}

function portFromEnv(): number {
  const value = process.env.DB_PORT ?? "1433";
  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65_535) {
    throw new Error("DB_PORT must be a valid TCP port.");
  }

  return port;
}

/** Creates the direct, server-only Azure SQL / SQL Server Prisma 7 adapter. */
export function createMssqlAdapter(): PrismaMssql {
  return new PrismaMssql({
    server: requiredEnv("DB_HOST"),
    port: portFromEnv(),
    database: requiredEnv("DB_NAME"),
    user: requiredEnv("DB_USER"),
    password: requiredEnv("DB_PASSWORD"),
    // Preserve the former Prisma 6 timeout behavior during the migration.
    connectionTimeout: 5_000,
    pool: {
      idleTimeoutMillis: 300_000,
    },
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  });
}
