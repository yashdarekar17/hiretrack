"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { signupSchema, loginSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// ──────────────────────────────────────────────────────────────
// AUTHENTICATION SERVER ACTIONS
// ──────────────────────────────────────────────────────────────

export type AuthActionState = {
  error?: string | null;
  success?: boolean;
  attemptsRemaining?: number;
  isBlocked?: boolean;
  retryMinutes?: number;
};

/**
 * Register a new recruiter account
 */
export async function signUp(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  try {
    const rawEmail = String(formData.get("email") || "");

    // Rate limit signup requests (e.g. max 5 attempts per 15 minutes)
    const rateLimitResult = await checkRateLimit({
      keyPrefix: "signup",
      identifier: rawEmail,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimitResult.success) {
      const retryMinutes = Math.max(1, Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / (60 * 1000)));
      return {
        error: `Too many registration attempts. Please try again in ${retryMinutes} minute(s).`,
        success: false,
      };
    }

    // 1. Extract and validate fields
    const rawName = formData.get("name");
    const rawPassword = formData.get("password");

    const validated = signupSchema.safeParse({
      name: rawName,
      email: rawEmail,
      password: rawPassword,
    });

    if (!validated.success) {
      return {
        error: validated.error.issues[0]?.message || "Invalid inputs",
        success: false,
      };
    }

    const { name, email, password } = validated.data;

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        error: "An account with this email already exists.",
        success: false,
      };
    }

    // 3. Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Create user in the database
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 5. Automatically log the user in after registration
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, error: null };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    if (error instanceof AuthError) {
      return { error: "Failed to sign in after registration.", success: false };
    }
    return { error: "Something went wrong. Please try again.", success: false };
  }
}

/**
 * Authenticate with credentials (email/password)
 */
export async function signInCredentials(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const rawEmail = String(formData.get("email") || "");
  let rateLimitResult;
  try {
    // Rate limit sign-in requests (e.g. max 5 attempts per 15 minutes)
    rateLimitResult = await checkRateLimit({
      keyPrefix: "signin",
      identifier: rawEmail,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    });

    if (!rateLimitResult.success) {
      const retryMinutes = Math.max(1, Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / (60 * 1000)));
      return {
        error: `Too many login attempts. Account is blocked for 15 minutes. Try after ${retryMinutes} minute(s).`,
        success: false,
        isBlocked: true,
        retryMinutes,
        attemptsRemaining: 0,
      };
    }

    const rawPassword = formData.get("password");

    // 1. Validate fields with Zod
    const validated = loginSchema.safeParse({
      email: rawEmail,
      password: rawPassword,
    });

    if (!validated.success) {
      return {
        error: validated.error.issues[0]?.message || "Invalid inputs",
        success: false,
        attemptsRemaining: rateLimitResult.remaining,
      };
    }

    const { email, password } = validated.data;

    // 2. Call Auth.js signIn function
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, error: null };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    const currentRemaining = rateLimitResult ? (rateLimitResult.success ? rateLimitResult.remaining : 0) : 5;
    const isBlocked = rateLimitResult 
      ? (!rateLimitResult.success || rateLimitResult.remaining === 0) 
      : false;
    const retryMinutes = rateLimitResult && (isBlocked || !rateLimitResult.success)
      ? Math.max(1, Math.ceil((rateLimitResult.resetTime.getTime() - Date.now()) / (60 * 1000)))
      : undefined;

    const errorMessage = isBlocked
      ? `Too many login attempts. Account is blocked for 15 minutes. Try after ${retryMinutes} minute(s).`
      : "Invalid email or password.";

    return { 
      error: errorMessage, 
      success: false,
      attemptsRemaining: currentRemaining,
      isBlocked,
      retryMinutes,
    };
  }
}

/**
 * Log the user out and redirect to login
 */
export async function logout() {
  await signOut({ redirectTo: "/login" });
}
