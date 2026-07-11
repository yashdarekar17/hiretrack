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
import { deleteCandidate } from "@/server/actions/candidate";

interface DeleteCandidateButtonProps {
  id: string;
  name: string;
}

// ──────────────────────────────────────────────────────────────
// DeleteCandidateButton Component
// ──────────────────────────────────────────────────────────────
// Renders a delete confirmation dialog.
// Executes the delete server action upon confirmation.
// ──────────────────────────────────────────────────────────────
export function DeleteCandidateButton({ id, name }: DeleteCandidateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    try {
      const result = await deleteCandidate(id);
      if (result.success) {
        toast.success("Candidate deleted successfully.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to delete candidate.");
      }
    } catch {
      toast.error("Failed to delete candidate.");
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
            title={`Delete ${name}`}
          />
        }
      >
        <Trash2 className="w-4 h-4" />
        <span className="sr-only">Delete {name}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold">Delete Candidate</DialogTitle>
          <DialogDescription className="pt-2">
            Are you sure you want to permanently delete <strong>{name}</strong>? This action
            cannot be undone and will delete all associated interviews.
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
            Cancel
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
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
