import React from "react";
import { notFound } from "next/navigation";
import { CandidateForm } from "@/components/candidates/candidate-form";
import { getCandidateById } from "@/server/queries/candidate";
import { updateCandidate } from "@/server/actions/candidate";

interface EditCandidatePageProps {
  params: Promise<{ id: string }>;
}

// ──────────────────────────────────────────────────────────────
// Edit Candidate Page (Server Component)
// ──────────────────────────────────────────────────────────────
// Resolves `params` asynchronously (Next.js 16 requirements).
// Queries candidate details by ID and handles 404s if missing.
// Pre-populates the CandidateForm and binds the update mutation.
// ──────────────────────────────────────────────────────────────
export default async function EditCandidatePage({ params }: EditCandidatePageProps) {
  // 1. Await params Promise (Next.js 16 requirement)
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 2. Fetch candidate details from database
  const candidate = await getCandidateById(id);

  if (!candidate) {
    notFound();
  }

  // 3. Bind the candidate ID to our update server action
  // This creates a self-contained action function that only expects form inputs
  const boundUpdateAction = updateCandidate.bind(null, id);

  return (
    <div className="flex justify-center py-4 animate-in fade-in duration-300">
      <CandidateForm
        initialData={candidate}
        onSubmitAction={boundUpdateAction}
        title="Edit Candidate Profile"
        description={`Update profiles details and evaluations for ${candidate.name}`}
      />
    </div>
  );
}
