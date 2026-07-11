import { DefaultSession } from "next-auth";

// ──────────────────────────────────────────────────────────────
// Module Augmentation for NextAuth Types
// ──────────────────────────────────────────────────────────────
// TypeScript does not know that we appended the `id` field to the
// session user object in our auth callbacks.
//
// By declaring module "next-auth", we merge our custom definitions
// with NextAuth's internal typings, ensuring autocomplete for
// `session.user.id` across the application.
// ──────────────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
  }
}
