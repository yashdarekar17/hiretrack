import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

// ──────────────────────────────────────────────────────────────
// Prisma Client Singleton with Neon Driver Adapter (Prisma 7+)
// ──────────────────────────────────────────────────────────────
// In Prisma 7, `@prisma/adapter-neon`'s constructor signature changed:
// It now takes a `PoolConfig` object (e.g., `{ connectionString }`)
// directly instead of a `Pool` instance. It handles pool lifecycle
// internally.
// ──────────────────────────────────────────────────────────────

if (typeof window === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is missing.");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize the Prisma Neon adapter by passing the pool configuration directly
const adapter = new PrismaNeon({ connectionString });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
