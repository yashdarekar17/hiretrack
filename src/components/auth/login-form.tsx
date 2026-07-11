"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Briefcase, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signInCredentials, type AuthActionState } from "@/server/actions/auth";

// Initial state for form actions
const initialState: AuthActionState = {
  error: null,
  success: false,
};

// ──────────────────────────────────────────────────────────────
// LoginForm Component (Client Component)
// ──────────────────────────────────────────────────────────────
// Renders the login card.
// Uses React 19 native form action binding with `useActionState`.
// ──────────────────────────────────────────────────────────────
export function LoginForm() {
  const router = useRouter();
  
  // Hook up signInCredentials Server Action
  const [state, formAction, isPending] = useActionState(signInCredentials, initialState);

  // Trigger redirects or notifications on action resolution
  React.useEffect(() => {
    if (state?.success) {
      toast.success("Welcome back!");
      router.push("/dashboard");
      router.refresh();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, router]);

  return (
    <Card className="w-full max-w-md border border-border/60 shadow-xl rounded-2xl overflow-hidden bg-card transition-all duration-300">
      <CardHeader className="space-y-2 pb-6 text-center border-b border-border/30">
        <div className="flex justify-center mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground shadow-md">
            <Briefcase className="w-5 h-5" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription>
          Sign in to your HireTrack account to continue
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4 pt-6">
          {/* ── Email Input ── */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="recruiter@company.com"
              required
              disabled={isPending}
              className="rounded-xl h-10 px-3.5 border-border/80 focus:border-primary transition-colors"
            />
          </div>

          {/* ── Password Input ── */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
              className="rounded-xl h-10 px-3.5 border-border/80 focus:border-primary transition-colors"
            />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 pb-6 pt-2">
          {/* ── Submit Button ── */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl h-10 font-medium tracking-wide shadow-md transition-all duration-200"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* ── Redirect Link ── */}
          <div className="text-center text-xs text-muted-foreground mt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline transition-colors"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
