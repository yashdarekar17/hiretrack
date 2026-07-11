import { z } from "zod";

// ──────────────────────────────────────────────────────────────
// Zod schemas for user registration and authentication forms.
// These are used on BOTH:
//   1. Client (for immediate browser-side feedback)
//   2. Server (inside Server Actions to prevent malicious requests)
// ──────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
