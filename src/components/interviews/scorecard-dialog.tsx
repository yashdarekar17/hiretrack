"use client";

import React from "react";
import type { Scorecard } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Award, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { scorecardSchema } from "@/lib/validations/interview";
import { submitScorecard } from "@/server/actions/interview";
import { z } from "zod";

type FormValues = z.input<typeof scorecardSchema>;

interface ScorecardDialogProps {
  interviewId: string;
  candidateName: string;
  initialScorecard?: Scorecard | null; // If already filled
}

// ──────────────────────────────────────────────────────────────
// ScorecardDialog Component (Client Component)
// ──────────────────────────────────────────────────────────────
// Renders the interview feedback rating scorecard modal.
// Displays Star components for interactive 1-5 ratings.
// ──────────────────────────────────────────────────────────────
export function ScorecardDialog({
  interviewId,
  candidateName,
  initialScorecard,
}: ScorecardDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(scorecardSchema),
    defaultValues: {
      technicalRating: initialScorecard?.technicalRating ?? 1,
      communicationRating: initialScorecard?.communicationRating ?? 1,
      problemSolvingRating: initialScorecard?.problemSolvingRating ?? 1,
      comments: initialScorecard?.comments ?? "",
    },
  });

  const technicalRating = watch("technicalRating");
  const communicationRating = watch("communicationRating");
  const problemSolvingRating = watch("problemSolvingRating");

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const result = await submitScorecard(interviewId, data);
      if (result.success) {
        toast.success("Scorecard saved successfully!");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to save scorecard.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  // Helper to render interactive rating stars
  const renderStars = (fieldName: "technicalRating" | "communicationRating" | "problemSolvingRating", currentValue: number) => {
    return (
      <div className="flex items-center gap-1 mt-1.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={isPending}
            onClick={() => setValue(fieldName, star)}
            className="focus:outline-hidden"
          >
            <Star
              className={`w-6 h-6 transition-all cursor-pointer ${
                star <= currentValue
                  ? "fill-amber-400 text-amber-400 scale-105"
                  : "text-muted-foreground/30 hover:text-muted-foreground/60"
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant={initialScorecard ? "secondary" : "outline"}
            size="sm"
            className="rounded-xl font-semibold gap-1.5 shadow-xs"
          >
            <Award className="w-4 h-4 text-primary" />
            {initialScorecard ? "Edit Scorecard" : "Fill Scorecard"}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold">Evaluation Scorecard</DialogTitle>
          <DialogDescription>
            Submit feedback and rating scores (1-5 stars) for <strong>{candidateName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Technical Rating */}
          <div className="space-y-1">
            <Label>Technical Evaluation *</Label>
            {renderStars("technicalRating", technicalRating)}
            {errors.technicalRating && (
              <p className="text-xs text-destructive">{errors.technicalRating.message}</p>
            )}
          </div>

          {/* Communication Rating */}
          <div className="space-y-1">
            <Label>Communication Skills *</Label>
            {renderStars("communicationRating", communicationRating)}
            {errors.communicationRating && (
              <p className="text-xs text-destructive">{errors.communicationRating.message}</p>
            )}
          </div>

          {/* Problem Solving Rating */}
          <div className="space-y-1">
            <Label>Problem Solving Capability *</Label>
            {renderStars("problemSolvingRating", problemSolvingRating)}
            {errors.problemSolvingRating && (
              <p className="text-xs text-destructive">{errors.problemSolvingRating.message}</p>
            )}
          </div>

          {/* Comments Textarea */}
          <div className="space-y-2">
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Provide written evaluations, strength indicators, or final hiring recommendations..."
              disabled={isPending}
              className="rounded-xl min-h-[90px] px-3.5 border-border focus:border-primary"
              onChange={(e) => setValue("comments", e.target.value)}
              defaultValue={initialScorecard?.comments || ""}
            />
            {errors.comments && (
              <p className="text-xs text-destructive">{errors.comments.message}</p>
            )}
          </div>

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
            <Button type="submit" disabled={isPending} className="rounded-xl gap-2 shadow-xs">
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Scorecard"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
