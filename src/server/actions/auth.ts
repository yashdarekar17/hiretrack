"use server";

import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { signupSchema, loginSchema } from "@/lib/validations/auth";

// ──────────────────────────────────────────────────────────────
// AUTHENTICATION SERVER ACTIONS
// ──────────────────────────────────────────────────────────────

export type AuthActionState = {
  error?: string | null;
  success?: boolean;
};

/**
 * Register a new recruiter account
 */
export async function signUp(
  prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  try {
    // 1. Extract and validate fields
    const rawName = formData.get("name");
    const rawEmail = formData.get("email");
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
    const hashedPassword = await bcrypt.hash(password, 10);

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
  try {
    const rawEmail = formData.get("email");
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
    if (error instanceof Error) {
      const message = error.message;
      if (message.includes("CredentialsSignin")) {
        return { error: "Invalid email or password.", success: false };
      }
    }
    return { error: "Something went wrong. Please try again.", success: false };
  }
}

/**
 * Log the user out and redirect to login
 */
export async function logout() {
  await signOut({ redirectTo: "/login" });
}
