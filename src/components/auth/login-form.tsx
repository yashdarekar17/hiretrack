"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BriefcaseBusiness, Loader2, ArrowRight, AlertCircle, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = React.useState(false);

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
            <BriefcaseBusiness className="w-5 h-5" />
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
        <CardContent className="space-y-5 pt-6">
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
          <div className="space-y-3 pb-4">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                disabled={isPending}
                className="rounded-xl h-10 pl-3.5 pr-10 border-border/80 focus:border-primary transition-colors w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-hidden transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
                <span className="sr-only">Toggle password visibility</span>
              </button>
            </div>
          </div>

          {/* ── Rate Limit / Attempt Warnings ── */}
          {state && state.attemptsRemaining !== undefined && state.attemptsRemaining > 0 && state.attemptsRemaining < 5 && (
            <div className="flex items-center gap-2 p-3.5 text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50 rounded-xl animate-in fade-in duration-300">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Warning: <strong>{5 - state.attemptsRemaining}/5 attempts</strong> used. Your account will be locked for 15 minutes after 5 failed attempts.
              </span>
            </div>
          )}

          {state && state.isBlocked && (
            <div className="flex items-center gap-2 p-3.5 text-xs bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 rounded-xl animate-in fade-in duration-300">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>
                <strong>Account is blocked for 15 minutes.</strong> Please try again after 15 minutes.
              </span>
            </div>
          )}
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
