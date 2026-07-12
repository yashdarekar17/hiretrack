import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidates Directory",
  description: "Browse, filter, and manage applicant pipeline profiles on HireTrack.",
};
import { Plus, Users, Eye, Edit, FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCandidates } from "@/server/queries/candidate";
import { CandidateFilters } from "@/components/candidates/candidate-filters";
import { DeleteCandidateButton } from "@/components/candidates/delete-candidate-button";
import { CandidateStatus } from "@prisma/client";

// Helper for status badge colors
const getStatusStyles = (status: CandidateStatus) => {
  switch (status) {
    case CandidateStatus.SELECTED:
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/55";
    case CandidateStatus.REJECTED:
      return "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200/55";
    case CandidateStatus.INTERVIEW:
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-400 border-indigo-200/55";
    case CandidateStatus.SCREENING:
      return "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200/55";
    default: // APPLIED
      return "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-400 border-sky-200/55";
  }
};

// ──────────────────────────────────────────────────────────────
// CandidatesPage (Server Component)
// ──────────────────────────────────────────────────────────────
// Resolves searchParams asynchronously (Next.js 16/App Router).
// Fetches search-filtered list of candidates from Prisma.
// Renders dynamic data table or friendly empty states.
// ──────────────────────────────────────────────────────────────
export default async function CandidatesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; status?: string }>;
}) {
  // 1. Await async searchParams (Next.js 16 requirement)
  const resolvedParams = await searchParams;
  const search = resolvedParams.search;
  const status = resolvedParams.status as CandidateStatus | undefined;

  // 2. Query candidates from Prisma database
  const candidates = await getCandidates({ search, status });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Candidates Pipeline
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage applicant tracking pipelines, evaluate skill sets, and progress stages.
          </p>
        </div>
        <Link
          href="/candidates/new"
          className={buttonVariants({ size: "sm", className: "rounded-xl shadow-xs" })}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Candidate
        </Link>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex bg-card p-4 rounded-2xl border border-border/60 shadow-xs">
        <CandidateFilters />
      </div>

      {/* ── Candidates Data Table ── */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-xs overflow-hidden">
        {candidates.length > 0 ? (
          <Table>
            <TableHeader className="bg-neutral-50/50 dark:bg-background/25">
              <TableRow>
                <TableHead className="font-semibold text-foreground px-6 py-3.5">Candidate</TableHead>
                <TableHead className="font-semibold text-foreground px-4 py-3.5">Phone</TableHead>
                <TableHead className="font-semibold text-foreground px-4 py-3.5">Experience</TableHead>
                <TableHead className="font-semibold text-foreground px-4 py-3.5">Skills</TableHead>
                <TableHead className="font-semibold text-foreground px-4 py-3.5">Stage</TableHead>
                <TableHead className="font-semibold text-foreground px-6 py-3.5 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => {
                // Split comma-separated skills into list
                const skillTags = candidate.skills
                  ? candidate.skills
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0)
                  : [];

                return (
                  <TableRow
                    key={candidate.id}
                    className="hover:bg-accent/30 transition-colors"
                  >
                    {/* Name & Email */}
                    <TableCell className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-sm leading-tight">
                          {candidate.name}
                        </span>
                        <span className="text-xs text-muted-foreground mt-0.5">
                          {candidate.email}
                        </span>
                      </div>
                    </TableCell>

                    {/* Phone */}
                    <TableCell className="px-4 py-4 text-sm text-muted-foreground">
                      {candidate.phone || "—"}
                    </TableCell>

                    {/* Experience */}
                    <TableCell className="px-4 py-4 text-sm text-foreground">
                      {candidate.experience} {candidate.experience === 1 ? "year" : "years"}
                    </TableCell>

                    {/* Skills Tags */}
                    <TableCell className="px-4 py-4 max-w-[280px]">
                      <div className="flex flex-wrap gap-1">
                        {skillTags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="text-[0.68rem] bg-accent text-muted-foreground px-2 py-0.5 rounded-md font-medium border border-border/40"
                          >
                            {tag}
                          </span>
                        ))}
                        {skillTags.length > 3 && (
                          <span className="text-[0.68rem] text-muted-foreground/60 px-1 py-0.5">
                            +{skillTags.length - 3} more
                          </span>
                        )}
                        {skillTags.length === 0 && <span className="text-xs text-muted-foreground">—</span>}
                      </div>
                    </TableCell>

                    {/* Pipeline Stage Badge */}
                    <TableCell className="px-4 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getStatusStyles(
                          candidate.status
                        )}`}
                      >
                        {candidate.status.charAt(0) + candidate.status.slice(1).toLowerCase()}
                      </span>
                    </TableCell>

                    {/* Actions Panel */}
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Resume Shortcut */}
                        {candidate.resumeUrl && (
                          <a
                            href={candidate.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={buttonVariants({
                              variant: "ghost",
                              size: "icon",
                              className: "text-muted-foreground hover:text-foreground rounded-lg h-8 w-8",
                            })}
                            title="View Resume"
                          >
                            <FileText className="w-4 h-4" />
                          </a>
                        )}

                        {/* View Profile */}
                        <Link
                          href={`/candidates/${candidate.id}`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                            className: "text-muted-foreground hover:text-foreground rounded-lg h-8 w-8",
                          })}
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Edit Profile */}
                        <Link
                          href={`/candidates/${candidate.id}/edit`}
                          className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                            className: "text-muted-foreground hover:text-foreground rounded-lg h-8 w-8",
                          })}
                          title="Edit Candidate"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <DeleteCandidateButton id={candidate.id} name={candidate.name} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-4 bg-muted rounded-full text-muted-foreground mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg text-foreground">No candidates found</h3>
            <p className="text-muted-foreground mt-2 max-w-sm text-sm">
              {search || status
                ? "No candidates match your active search terms or status filters. Clear filters and try again."
                : "Your pipeline is currently empty. Get started by adding a candidate!"}
            </p>
            {!search && !status && (
              <Link
                href="/candidates/new"
                className={buttonVariants({ className: "rounded-xl mt-6 shadow-xs" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Candidate
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
