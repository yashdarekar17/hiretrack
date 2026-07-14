"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BriefcaseBusiness, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp, type AuthActionState } from "@/server/actions/auth";

// Initial state for form actions
const initialState: AuthActionState = {
  error: null,
  success: false,
};

// ──────────────────────────────────────────────────────────────
// SignupForm Component (Client Component)
// ──────────────────────────────────────────────────────────────
// Renders the registration card.
// Uses React 19 native form action binding with `useActionState`.
// ──────────────────────────────────────────────────────────────
export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);

  // Hook up signUp Server Action
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  // Trigger redirects or notifications on action resolution
  React.useEffect(() => {
    if (state?.success) {
      toast.success("Account created successfully!");
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
            <BriefcaseBusiness className="w-5 h-5 animate-pulse" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
          Create an Account
        </CardTitle>
        <CardDescription>
          Sign up to manage your recruitment pipelines
        </CardDescription>
      </CardHeader>

      <form action={formAction}>
        <CardContent className="space-y-4 pt-6">
          {/* ── Name Input ── */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Alex Morgan"
              required
              disabled={isPending}
              className="rounded-xl h-10 px-3.5 border-border/80 focus:border-primary transition-colors"
            />
          </div>

          {/* ── Email Input ── */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alex@company.com"
              required
              disabled={isPending}
              className="rounded-xl h-10 px-3.5 border-border/80 focus:border-primary transition-colors"
            />
          </div>

          {/* ── Password Input ── */}
          <div className="space-y-2 pb-4">
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
            <p className="text-[0.7rem] text-muted-foreground mt-1">
              Must be at least 6 characters.
            </p>
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
                Creating account...
              </>
            ) : (
              <>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>

          {/* ── Redirect Link ── */}
          <div className="text-center text-xs text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline transition-colors"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
