import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recruiter Sign In",
  description: "Sign in to your HireTrack recruiter profile to manage candidate pipelines.",
};
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/login-form";

// ──────────────────────────────────────────────────────────────
// Login Page (App Router)
// ──────────────────────────────────────────────────────────────
// Renders the login viewport.
// If the user is already authenticated, redirects them directly to
// `/dashboard` (server-side guard).
// ──────────────────────────────────────────────────────────────
export default async function LoginPage() {
  const session = await auth();

  // If already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen px-4 py-12 bg-neutral-50/50 dark:bg-neutral-950/20">
      <div className="w-full flex justify-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        <LoginForm />
      </div>
    </div>
  );
}
