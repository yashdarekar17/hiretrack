import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Update recruiter profile names, secure password credentials, and customize UI preferences.",
};
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsForms } from "@/components/settings/settings-forms";
import { Settings } from "lucide-react";

export default async function SettingsPage() {
  // 1. Authenticate user
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  // 2. Fetch fresh user details and stats in parallel
  const [userData, totalCandidates, totalInterviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, createdAt: true },
    }),
    prisma.candidate.count({ where: { userId } }),
    prisma.interview.count({ where: { userId } }),
  ]);

  if (!userData) {
    redirect("/login");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 text-primary rounded-xl">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Account Settings
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage recruiter profile credentials, password security, and theme preferences.
          </p>
        </div>
      </div>

      {/* ── Tabs & Forms Container ── */}
      <div className="pt-2">
        <SettingsForms
          user={{
            name: userData.name,
            email: userData.email,
            createdAt: userData.createdAt,
          }}
          stats={{
            totalCandidates,
            totalInterviews,
          }}
        />
      </div>
    </div>
  );
}
