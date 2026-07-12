import type { NextAuthConfig } from "next-auth";

// ──────────────────────────────────────────────────────────────
// Edge-Safe Auth.js Configuration (Middleware)
// ──────────────────────────────────────────────────────────────
// Since Next.js middleware runs on the Edge Runtime, it cannot
// import Node.js database adapters (Prisma) or libraries like bcrypt.
// We export a stripped config here, and specify actual providers
// inside auth.ts.
// ──────────────────────────────────────────────────────────────
export default {
  providers: [], // Empty list for Edge compatibility. Providers defined in auth.ts
} satisfies NextAuthConfig;
