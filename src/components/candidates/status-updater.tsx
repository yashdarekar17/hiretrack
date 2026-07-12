"use client";

import React from "react";
import { useRouter } from "next/navigation";
import type { CandidateStatus } from "@prisma/client";
import { toast } from "sonner";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateCandidateStatus } from "@/server/actions/candidate";

interface StatusUpdaterProps {
  id: string;
  currentStatus: CandidateStatus;
}

const stagesList = [
  { status: "APPLIED" as CandidateStatus, label: "Applied" },
  { status: "SCREENING" as CandidateStatus, label: "Screening" },
  { status: "INTERVIEW" as CandidateStatus, label: "Interview" },
  { status: "SELECTED" as CandidateStatus, label: "Selected" },
  { status: "REJECTED" as CandidateStatus, label: "Rejected" },
];

// Helper to get status colors
const getStatusColors = (status: CandidateStatus, isActive: boolean) => {
  if (!isActive) return "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-800";
  
  switch (status) {
    case "SELECTED":
      return "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-700 dark:border-emerald-700 hover:bg-emerald-700";
    case "REJECTED":
      return "bg-rose-600 text-white border-rose-600 dark:bg-rose-700 dark:border-rose-700 hover:bg-rose-700";
    case "INTERVIEW":
      return "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-700 dark:border-indigo-700 hover:bg-indigo-700";
    case "SCREENING":
      return "bg-amber-600 text-white border-amber-600 dark:bg-amber-700 dark:border-amber-700 hover:bg-amber-700";
    default:
      return "bg-sky-600 text-white border-sky-600 dark:bg-sky-700 dark:border-sky-700 hover:bg-sky-700";
  }
};

// ──────────────────────────────────────────────────────────────
// StatusUpdater Component (Client Component)
// ──────────────────────────────────────────────────────────────
// Renders pipeline buttons. Allows recruiters to move a candidate
// through stages with a single click, showing loading state.
// ──────────────────────────────────────────────────────────────
export function StatusUpdater({ id, currentStatus }: StatusUpdaterProps) {
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = React.useState<CandidateStatus | null>(null);

  const handleStatusChange = async (targetStatus: CandidateStatus) => {
    if (targetStatus === currentStatus) return;

    setPendingStatus(targetStatus);
    try {
      const result = await updateCandidateStatus(id, targetStatus);
      if (result.success) {
        toast.success(`Pipeline updated to ${targetStatus.toLowerCase()}`);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update status.");
      }
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {stagesList.map((stage, idx) => {
        const isActive = currentStatus === stage.status;
        const isChanging = pendingStatus === stage.status;

        return (
          <React.Fragment key={stage.status}>
            <Button
              type="button"
              variant="outline"
              disabled={isChanging || pendingStatus !== null}
              className={`rounded-xl px-4 py-1.5 h-auto text-xs font-semibold border transition-all duration-200 select-none ${getStatusColors(
                stage.status,
                isActive
              )}`}
              onClick={() => handleStatusChange(stage.status)}
            >
              {isChanging ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                stage.label
              )}
            </Button>
            {idx < stagesList.length - 1 && (
              <ArrowRight className="w-3 h-3 text-muted-foreground/40 hidden md:block shrink-0" />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
