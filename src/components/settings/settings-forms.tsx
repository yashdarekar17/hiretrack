"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  User,
  Shield,
  Palette,
  Check,
  Loader2,
  TrendingUp,
  Mail,
  Calendar,
  Lock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  profileSchema,
  passwordSchema,
  type ProfileInput,
  type PasswordInput,
} from "@/lib/validations/user";
import { updateProfile, changePassword } from "@/server/actions/user";

interface SettingsFormsProps {
  user: {
    name: string;
    email: string;
    createdAt: Date;
  };
  stats: {
    totalCandidates: number;
    totalInterviews: number;
  };
}

export function SettingsForms({ user, stats }: SettingsFormsProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "preferences">("profile");

  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  // ──────────────────────────────────────────────────────────────
  // Form 1: Recruiter Profile
  // ──────────────────────────────────────────────────────────────
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
    },
  });

  const onProfileSubmit = (data: ProfileInput) => {
    startProfileTransition(async () => {
      const res = await updateProfile(data.name);
      if (res.success) {
        toast.success("Profile name updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update profile name");
      }
    });
  };

  // ──────────────────────────────────────────────────────────────
  // Form 2: Recruiter Password
  // ──────────────────────────────────────────────────────────────
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors },
  } = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = (data: PasswordInput) => {
    startPasswordTransition(async () => {
      const res = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (res.success) {
        toast.success("Password updated successfully");
        resetPasswordForm();
      } else {
        toast.error(res.error || "Failed to change password");
      }
    });
  };

  // Format creation date nicely
  const memberSince = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* ── Left Navigation Column ── */}
      <div className="md:col-span-1 space-y-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "profile"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          <span>My Profile</span>
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "security"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security</span>
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            activeTab === "preferences"
              ? "bg-primary text-primary-foreground font-semibold shadow-xs"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Preferences</span>
        </button>
      </div>

      {/* ── Right Content Column ── */}
      <div className="md:col-span-3">
        {/* ── Tab Content: Profile Settings ── */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <Card className="border border-border/60 rounded-2xl shadow-xs bg-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Profile Details</CardTitle>
                <CardDescription>
                  Modify your public recruiter display name.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
                  {/* Name field */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g. Yash Darekar"
                      disabled={isProfilePending}
                      className="rounded-xl h-10 px-3.5"
                      {...registerProfile("name")}
                    />
                    {profileErrors.name && (
                      <p className="text-xs text-destructive">{profileErrors.name.message}</p>
                    )}
                  </div>

                  {/* Read-only Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        disabled
                        value={user.email}
                        className="rounded-xl h-10 pl-10 bg-muted/30 text-muted-foreground cursor-not-allowed border-dashed"
                      />
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground/60" />
                    </div>
                    <p className="text-xs text-muted-foreground/75 italic">
                      Email address cannot be changed to prevent session errors.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isProfilePending}
                      className="rounded-xl px-5 gap-2"
                    >
                      {isProfilePending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Recruiter Account Summary Card */}
            <Card className="border border-border/60 rounded-2xl shadow-xs bg-card">
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Account Summary
                </CardTitle>
                <CardDescription>
                  Tracking statistics registered to your recruiter workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-3">
                <div className="p-4 bg-muted/40 rounded-xl border border-border/30 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Member Since
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{memberSince}</span>
                  </div>
                </div>

                <div className="p-4 bg-muted/40 rounded-xl border border-border/30 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Total Candidates
                  </span>
                  <span className="text-2xl font-extrabold text-foreground mt-1">
                    {stats.totalCandidates}
                  </span>
                </div>

                <div className="p-4 bg-muted/40 rounded-xl border border-border/30 flex flex-col justify-between">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                    Interviews Arranged
                  </span>
                  <span className="text-2xl font-extrabold text-foreground mt-1">
                    {stats.totalInterviews}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ── Tab Content: Security Settings ── */}
        {activeTab === "security" && (
          <Card className="border border-border/60 rounded-2xl shadow-xs bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Change Password
              </CardTitle>
              <CardDescription>
                Ensure your workspace remains secure by updating passwords regularly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                {/* Current password */}
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    placeholder="••••••••"
                    disabled={isPasswordPending}
                    className="rounded-xl h-10 px-3.5"
                    {...registerPassword("currentPassword")}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-destructive">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                {/* New password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    disabled={isPasswordPending}
                    className="rounded-xl h-10 px-3.5"
                    {...registerPassword("newPassword")}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-destructive">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    disabled={isPasswordPending}
                    className="rounded-xl h-10 px-3.5"
                    {...registerPassword("confirmPassword")}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-destructive">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isPasswordPending}
                    className="rounded-xl px-5 gap-2"
                  >
                    {isPasswordPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* ── Tab Content: Theme Preferences Settings ── */}
        {activeTab === "preferences" && (
          <Card className="border border-border/60 rounded-2xl shadow-xs bg-card">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Workspace Preferences</CardTitle>
              <CardDescription>
                Customize theme settings and visual presets of your recruiter account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Theme Preference</Label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {/* Light Mode Selector Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition-all ${
                      theme === "light"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                        : "border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border bg-white flex items-center justify-center">
                      {theme === "light" && <Check className="w-3 h-3 text-primary" />}
                    </div>
                    <span className="text-sm font-semibold">Light Theme</span>
                  </button>

                  {/* Dark Mode Selector Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition-all ${
                      theme === "dark"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                        : "border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border bg-slate-950 flex items-center justify-center">
                      {theme === "dark" && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-semibold">Dark Theme</span>
                  </button>

                  {/* System Default Selector Card */}
                  <button
                    type="button"
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center justify-center p-4 border rounded-xl gap-2 transition-all ${
                      theme === "system"
                        ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                        : "border-border hover:bg-muted/30 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full border bg-linear-to-r from-white to-slate-950 flex items-center justify-center">
                      {theme === "system" && <Check className="w-3 h-3 text-primary" />}
                    </div>
                    <span className="text-sm font-semibold">System Default</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
