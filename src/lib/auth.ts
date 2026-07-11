import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

// ──────────────────────────────────────────────────────────────
// Main Auth.js Entrypoint
// ──────────────────────────────────────────────────────────────
// This exports:
//   - auth: Function to retrieve session in Server Components
//   - handlers: { GET, POST } route handlers for the API endpoint
//   - signIn, signOut: Auth triggers
// ──────────────────────────────────────────────────────────────

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // Required when using Credentials provider
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // ── JWT CALLBACK ──
    // Runs when a JWT is created or updated. We take the user id from
    // the database model and inject it into the token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // ── SESSION CALLBACK ──
    // Runs whenever a session is checked in the browser. We copy the
    // user id from the JWT token and attach it to the session object
    // so we can access `session.user.id` in our application.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  ...authConfig,
});
