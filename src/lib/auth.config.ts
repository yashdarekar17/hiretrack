import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "./validations/auth";

// ──────────────────────────────────────────────────────────────
// Auth.js Configuration Providers (Credentials)
// ──────────────────────────────────────────────────────────────
// This file is decoupled from the database adapter so it can
// be imported by middleware.ts (which runs in the edge runtime,
// where Prisma client and database driver operations are not
// supported).
// ──────────────────────────────────────────────────────────────

export default {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate inputs using Zod
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // 2. Fetch user from database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        // 3. Verify user exists and check password hash
        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        // 4. Return user object (stripped of password)
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
