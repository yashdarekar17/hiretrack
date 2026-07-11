"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteInterview } from "@/server/actions/interview";

interface DeleteInterviewButtonProps {
  id: string;
  candidateName: string;
}

// ──────────────────────────────────────────────────────────────
// DeleteInterviewButton Component (Client Component)
// ──────────────────────────────────────────────────────────────
// Renders delete confirmation dialog.
// Executes deleteInterview server action upon confirmation.
// ──────────────────────────────────────────────────────────────
export function DeleteInterviewButton({ id, candidateName }: DeleteInterviewButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const result = await deleteInterview(id);
      if (result.success) {
        toast.success("Interview cancelled successfully.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete interview.");
      }
    } catch {
      toast.error("Failed to delete interview.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg h-8 w-8"
            title={`Cancel interview for ${candidateName}`}
          >
            <Trash2 className="w-4 h-4" />
            <span className="sr-only">Cancel interview for {candidateName}</span>
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold">Cancel Interview</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to cancel the interview scheduled with <strong>{candidateName}</strong>?
            This will permanently delete the meeting records and any associated scorecards.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/20">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => setOpen(false)}
            className="rounded-xl"
          >
            Go Back
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isPending}
            onClick={handleDelete}
            className="rounded-xl gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Confirm Cancel"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
