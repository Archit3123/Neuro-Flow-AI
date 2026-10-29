import "server-only";
import { PrismaClient } from "@/prisma/generated/client";
import { createMssqlAdapter } from "@/lib/mssql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getPrismaClient(): PrismaClient {
  const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter: createMssqlAdapter() });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

  return prisma;
}

// Next.js imports route modules while collecting page data. Defer database configuration
// validation until a route actually accesses a Prisma model or client method.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    const client = getPrismaClient();
    const value = Reflect.get(client, property);

    return typeof value === "function" ? value.bind(client) : value;
  },
});
