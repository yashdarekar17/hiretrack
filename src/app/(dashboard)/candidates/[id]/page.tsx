import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  Briefcase,
  ExternalLink,
  Linkedin,
  FileText,
  Calendar,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCandidateById } from "@/server/queries/candidate";
import { StatusUpdater } from "@/components/candidates/status-updater";
import { DeleteCandidateButton } from "@/components/candidates/delete-candidate-button";
import { CandidateStatus } from "@prisma/client";

interface CandidateDetailPageProps {
  params: Promise<{ id: string }>;
}

const getStatusBadgeStyles = (status: CandidateStatus) => {
  switch (status) {
    case CandidateStatus.SELECTED:
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/55";
    case CandidateStatus.REJECTED:
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/55";
    case CandidateStatus.INTERVIEW:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200/55";
    case CandidateStatus.SCREENING:
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/55";
    default:
      return "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-400 border-sky-200/55";
  }
};

// ──────────────────────────────────────────────────────────────
// CandidateDetailPage (Server Component)
// ──────────────────────────────────────────────────────────────
// Resolves `params` asynchronously (Next.js 16 requirements).
// Queries candidate by ID, and handles 404s if missing.
// Displays contact information, skills, social links, statusupdater.
// ──────────────────────────────────────────────────────────────
export default async function CandidateDetailPage({ params }: CandidateDetailPageProps) {
  // 1. Await params Promise (Next.js 16 requirement)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Fetch candidate profile
  const candidate = await getCandidateById(id);

  if (!candidate) {
    notFound();
  }

  const skillTags = candidate.skills
    ? candidate.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Page Navigation Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/candidates"
            className={buttonVariants({
              variant: "ghost",
              size: "icon",
              className: "rounded-lg text-muted-foreground hover:text-foreground h-9 w-9",
            })}
            title="Back to candidates"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{candidate.name}</h2>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${getStatusBadgeStyles(
                  candidate.status
                )}`}
              >
                {candidate.status.charAt(0) + candidate.status.slice(1).toLowerCase()}
              </span>
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              Candidate profile details and pipeline stages
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Edit Profile Button */}
          <Link
            href={`/candidates/${candidate.id}/edit`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "rounded-xl font-semibold gap-2 border-border shadow-xs",
            })}
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Link>

          {/* Delete Button */}
          <div className="bg-card border border-border/60 hover:bg-destructive/5 rounded-xl transition-colors p-1 shadow-xs">
            <DeleteCandidateButton id={candidate.id} name={candidate.name} />
          </div>
        </div>
      </div>

      {/* ── Grid Layout ── */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Contact Cards & Info */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border border-border/60 shadow-xs rounded-2xl bg-card">
            <CardHeader className="border-b border-border/30 pb-4">
              <CardTitle className="text-lg font-bold">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 pt-6 sm:grid-cols-2">
              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Email Address</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5 break-all">
                    {candidate.email}
                  </span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Phone className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Phone Number</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {candidate.phone || "—"}
                  </span>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Briefcase className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Experience</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {candidate.experience} {candidate.experience === 1 ? "year" : "years"}
                  </span>
                </div>
              </div>

              {/* Registered date */}
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                  <Calendar className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block font-medium">Registered</span>
                  <span className="text-sm font-semibold text-foreground mt-0.5">
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                      candidate.createdAt
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Card */}
          <Card className="border border-border/60 shadow-xs rounded-2xl bg-card">
            <CardHeader className="border-b border-border/30 pb-4">
              <CardTitle className="text-lg font-bold">Professional Skill Sets</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {skillTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skillTags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-neutral-100 dark:bg-accent border border-border/40 text-muted-foreground px-3.5 py-1 rounded-xl font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No skills listed.</p>
              )}
            </CardContent>
          </Card>

          {/* Pipeline Stage Controller */}
          <Card className="border border-border/60 shadow-xs rounded-2xl bg-card overflow-hidden">
            <CardHeader className="border-b border-border/30 pb-4">
              <CardTitle className="text-lg font-bold">Pipeline Stage Controls</CardTitle>
              <CardDescription>Shift applicant stages in the recruitment funnel</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <StatusUpdater id={candidate.id} currentStatus={candidate.status} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Social Links & Attachments */}
        <div className="space-y-6">
          <Card className="border border-border/60 shadow-xs rounded-2xl bg-card">
            <CardHeader className="border-b border-border/30 pb-4">
              <CardTitle className="text-lg font-bold">Profiles & Links</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex flex-col gap-3">
              {/* Resume Link */}
              {candidate.resumeUrl ? (
                <a
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full justify-between rounded-xl h-10 px-4 border-border font-semibold shadow-xs select-none",
                  })}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    View Resume
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              ) : (
                <Button variant="outline" disabled className="w-full justify-start rounded-xl h-10 px-4 select-none">
                  <FileText className="w-4 h-4 text-muted-foreground mr-2" />
                  No resume provided
                </Button>
              )}

              {/* LinkedIn Link */}
              {candidate.linkedinUrl ? (
                <a
                  href={candidate.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full justify-between rounded-xl h-10 px-4 border-border font-semibold shadow-xs select-none",
                  })}
                >
                  <span className="flex items-center gap-2">
                    <Linkedin className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    LinkedIn Profile
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                </a>
              ) : (
                <Button variant="outline" disabled className="w-full justify-start rounded-xl h-10 px-4 select-none">
                  <Linkedin className="w-4 h-4 text-muted-foreground mr-2" />
                  No LinkedIn profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
