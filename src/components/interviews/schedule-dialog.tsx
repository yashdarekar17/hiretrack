"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Calendar, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { interviewSchema } from "@/lib/validations/interview";
import { scheduleInterview } from "@/server/actions/interview";
import { z } from "zod";

type FormValues = z.input<typeof interviewSchema>;

interface ScheduleDialogProps {
  candidates: Array<{ id: string; name: string; email: string }>;
}

// ──────────────────────────────────────────────────────────────
// ScheduleDialog Component (Client Component)
// ──────────────────────────────────────────────────────────────
// Renders the scheduling modal.
// Integrates Zod + React Hook Form. Calls scheduleInterview action.
// ──────────────────────────────────────────────────────────────
export function ScheduleDialog({ candidates }: ScheduleDialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(interviewSchema),
    defaultValues: {
      candidateId: "",
      scheduledAt: "",
      interviewer: "",
      meetingLink: "",
    },
  });

  const selectedCandidateId = watch("candidateId");

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const result = await scheduleInterview(data);
      if (result.success) {
        toast.success("Interview scheduled successfully!");
        setOpen(false);
        reset();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to schedule interview.");
      }
    } catch {
      toast.error("An error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) reset();
    }}>
      <DialogTrigger
        render={
          <Button className="rounded-xl shadow-xs">
            <Plus className="w-4 h-4 mr-2" />
            Schedule Interview
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-bold">Schedule Interview</DialogTitle>
          <DialogDescription>
            Arrange a technical evaluation or screening meeting for an applicant.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Candidate Select */}
          <div className="space-y-2">
            <Label htmlFor="candidateId">Select Candidate *</Label>
            <Select
              disabled={isPending}
              value={selectedCandidateId}
              onValueChange={(val) => setValue("candidateId", val || "")}
            >
              <SelectTrigger id="candidateId" className="rounded-xl h-10 w-full bg-background">
                <SelectValue placeholder="Choose a candidate">
                  {selectedCandidateId
                    ? candidates.find((c) => c.id === selectedCandidateId)?.name
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {candidates.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </SelectItem>
                ))}
                {candidates.length === 0 && (
                  <SelectItem value="none" disabled>
                    No candidates available.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.candidateId && (
              <p className="text-xs text-destructive">{errors.candidateId.message}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Date & Time *</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("scheduledAt")}
            />
            {errors.scheduledAt && (
              <p className="text-xs text-destructive">{errors.scheduledAt.message}</p>
            )}
          </div>

          {/* Interviewer */}
          <div className="space-y-2">
            <Label htmlFor="interviewer">Interviewer Name *</Label>
            <Input
              id="interviewer"
              placeholder="e.g. Marcus Aurelius"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("interviewer")}
            />
            {errors.interviewer && (
              <p className="text-xs text-destructive">{errors.interviewer.message}</p>
            )}
          </div>

          {/* Meeting Link */}
          <div className="space-y-2">
            <Label htmlFor="meetingLink">Meeting Link (optional)</Label>
            <Input
              id="meetingLink"
              placeholder="e.g. https://meet.google.com/..."
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("meetingLink")}
            />
            {errors.meetingLink && (
              <p className="text-xs text-destructive">{errors.meetingLink.message}</p>
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
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Confirm Schedule
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
