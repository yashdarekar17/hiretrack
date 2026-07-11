import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Users,
  Calendar,
  UserCheck,
  UserX,
  Plus,
  ArrowRight,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// Helper to format date strings nicely
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

// Helper for candidate status badge styling
const getStatusStyles = (status: string) => {
  switch (status) {
    case "SELECTED":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400";
    case "REJECTED":
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400";
    case "INTERVIEW":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400";
    case "SCREENING":
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400";
    default: // APPLIED
      return "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-400";
  }
};

// ──────────────────────────────────────────────────────────────
// Dashboard Page Component (Server Component)
// ──────────────────────────────────────────────────────────────
// Fetches database stats server-side:
//   - Total Candidates
//   - Scheduled Interviews
//   - Selected Candidates
//   - Rejected Candidates
//   - Recent Candidates list
//   - Upcoming Interviews list
// ──────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // 1. Fetch statistics in parallel using Prisma
  const [
    totalCandidatesCount,
    interviewsScheduledCount,
    selectedCandidatesCount,
    rejectedCandidatesCount,
    recentCandidates,
    upcomingInterviews,
  ] = await Promise.all([
    // Total Candidates created by this user
    prisma.candidate.count({ where: { userId } }),
    // Total Interviews scheduled by this user
    prisma.interview.count({ where: { userId } }),
    // Selected Candidates
    prisma.candidate.count({ where: { userId, status: "SELECTED" } }),
    // Rejected Candidates
    prisma.candidate.count({ where: { userId, status: "REJECTED" } }),
    // Get latest 5 candidates
    prisma.candidate.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Get upcoming 5 interviews
    prisma.interview.findMany({
      where: {
        userId,
        scheduledAt: { gte: new Date() }, // Only future/now interviews
      },
      include: {
        candidate: {
          select: { name: true, email: true },
        },
      },
      orderBy: { scheduledAt: "asc" },
      take: 5,
    }),
  ]);

  const statCards = [
    {
      title: "Total Candidates",
      value: totalCandidatesCount,
      description: "Candidates registered",
      icon: Users,
      color: "text-sky-600 dark:text-sky-400",
      bgColor: "bg-sky-100/50 dark:bg-sky-950/20",
    },
    {
      title: "Interviews Scheduled",
      value: interviewsScheduledCount,
      description: "Total meetings arranged",
      icon: Calendar,
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100/50 dark:bg-indigo-950/20",
    },
    {
      title: "Selected Candidates",
      value: selectedCandidatesCount,
      description: "Passed all pipelines",
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-100/50 dark:bg-emerald-950/20",
    },
    {
      title: "Rejected Candidates",
      value: rejectedCandidatesCount,
      description: "Archived submissions",
      icon: UserX,
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100/50 dark:bg-rose-950/20",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Welcome Heading ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back, {session.user?.name || "Recruiter"}
          </h2>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what is happening in your hiring pipelines today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/candidates/new"
            className={buttonVariants({ size: "sm", className: "rounded-xl shadow-xs" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Candidate
          </Link>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="border border-border/60 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 rounded-2xl group overflow-hidden bg-card"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-xl transition-colors duration-200 ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground tracking-tight">
                  {card.value}
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Recent Activity Section ── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* ── Column 1: Upcoming Interviews ── */}
        <Card className="border border-border/60 shadow-xs rounded-2xl bg-card overflow-hidden">
          <CardHeader className="border-b border-border/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Upcoming Interviews</CardTitle>
                <CardDescription>Scheduled evaluations for candidates</CardDescription>
              </div>
              <Link
                href="/interviews"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "rounded-lg text-xs font-semibold flex items-center gap-1",
                })}
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {upcomingInterviews.length > 0 ? (
              <div className="divide-y divide-border/30">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="flex items-center justify-between p-4 hover:bg-accent/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">
                        {interview.candidate.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Interviewer: {interview.interviewer}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground bg-accent/60 dark:bg-accent/40 px-2.5 py-1 rounded-lg font-medium">
                        {formatDate(interview.scheduledAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-3 bg-muted rounded-full text-muted-foreground mb-3">
                  <Calendar className="w-6 h-6" />
                </div>
                <p className="font-medium text-sm text-foreground">No upcoming interviews</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                  Ready to schedule? Go to the interviews page to start.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Column 2: Recent Candidates ── */}
        <Card className="border border-border/60 shadow-xs rounded-2xl bg-card overflow-hidden">
          <CardHeader className="border-b border-border/30 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Candidates</CardTitle>
                <CardDescription>Applicants newly registered</CardDescription>
              </div>
              <Link
                href="/candidates"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "rounded-lg text-xs font-semibold flex items-center gap-1",
                })}
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {recentCandidates.length > 0 ? (
              <div className="divide-y divide-border/30">
                {recentCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className="flex items-center justify-between p-4 hover:bg-accent/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">{candidate.name}</p>
                      <p className="text-xs text-muted-foreground">{candidate.email}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${getStatusStyles(
                        candidate.status
                      )}`}
                    >
                      {candidate.status.charAt(0) + candidate.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="p-3 bg-muted rounded-full text-muted-foreground mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <p className="font-medium text-sm text-foreground">No candidates registered</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-[240px]">
                  Add your first candidate to start tracking them.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
