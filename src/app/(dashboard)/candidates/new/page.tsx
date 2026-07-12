import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add New Candidate",
  description: "Input details, skills, and profile urls to create a new candidate entry on HireTrack.",
};
import { CandidateForm } from "@/components/candidates/candidate-form";
import { createCandidate } from "@/server/actions/candidate";

// ──────────────────────────────────────────────────────────────
// New Candidate Page (Server Component)
// ──────────────────────────────────────────────────────────────
// Renders the CandidateForm configured to call the `createCandidate`
// server action.
// ──────────────────────────────────────────────────────────────
export default function NewCandidatePage() {
  return (
    <div className="flex justify-center py-4 animate-in fade-in duration-300">
      <CandidateForm
        onSubmitAction={createCandidate}
        title="Add New Candidate"
        description="Register a new applicant to track them through the recruitment lifecycle."
      />
    </div>
  );
}
