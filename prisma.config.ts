import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// ──────────────────────────────────────────────────────────────
// Prisma Configuration (Prisma 7+)
// ──────────────────────────────────────────────────────────────
// In Prisma 7, connection URLs moved from schema.prisma to here.
//
// This configuration file is used by the Prisma CLI for:
//   1. Running migrations (`prisma migrate dev`)
//   2. Generating the Prisma Client (`prisma generate`)
//
// For CLI operations (migrations), we must use the DIRECT connection
// (non-pooled) because database migrations require administrative
// locks that cannot be obtained through a connection pooler.
// ──────────────────────────────────────────────────────────────
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DIRECT_URL"),
  },
});
