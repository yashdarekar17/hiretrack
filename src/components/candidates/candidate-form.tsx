"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateStatus, Candidate } from "@prisma/client";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { candidateSchema } from "@/lib/validations/candidate";
import Link from "next/link";
import { z } from "zod";

type FormValues = z.input<typeof candidateSchema>;

interface CandidateFormProps {
  initialData?: Candidate; // If provided, we are editing
  onSubmitAction: (data: FormValues) => Promise<{ error?: string | null; success?: boolean }>;
  title: string;
  description: string;
}

// ──────────────────────────────────────────────────────────────
// CandidateForm Component
// ──────────────────────────────────────────────────────────────
// A reusable form component for creating/updating candidates.
// Integrates react-hook-form + Zod schemas for validation.
// ──────────────────────────────────────────────────────────────
export function CandidateForm({
  initialData,
  onSubmitAction,
  title,
  description,
}: CandidateFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  // Initialize form with react-hook-form and Zod resolver
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      experience: initialData?.experience ?? 0,
      skills: initialData?.skills || "",
      resumeUrl: initialData?.resumeUrl || "",
      linkedinUrl: initialData?.linkedinUrl || "",
      status: initialData?.status || CandidateStatus.APPLIED,
    },
  });

  // Watch status to bind select changes correctly
  const statusValue = watch("status");

  const onSubmit = async (data: FormValues) => {
    setIsPending(true);
    try {
      const result = await onSubmitAction(data);
      if (result.success) {
        toast.success(initialData ? "Candidate updated successfully!" : "Candidate registered successfully!");
        router.push("/candidates");
        router.refresh();
      } else {
        toast.error(result.error || "Something went wrong.");
      }
    } catch {
      toast.error("Failed to submit form.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl border border-border/60 shadow-lg rounded-2xl overflow-hidden bg-card">
      <CardHeader className="border-b border-border/30 pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/candidates"
            className={buttonVariants({
              variant: "ghost",
              size: "icon-sm",
              className: "rounded-lg text-muted-foreground hover:text-foreground",
            })}
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <CardTitle className="text-xl font-bold tracking-tight">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="grid gap-6 pt-6 md:grid-cols-2">
          {/* ── Name ── */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="e.g. Alex Morgan"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* ── Email ── */}
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. alex@morgan.com"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* ── Phone ── */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="e.g. +1 555-0199"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>

          {/* ── Experience ── */}
          <div className="space-y-2">
            <Label htmlFor="experience">Experience (Years) *</Label>
            <Input
              id="experience"
              type="number"
              min="0"
              placeholder="e.g. 3"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("experience", { valueAsNumber: true })}
            />
            {errors.experience && (
              <p className="text-xs text-destructive">{errors.experience.message}</p>
            )}
          </div>

          {/* ── Status Select ── */}
          <div className="space-y-2">
            <Label htmlFor="status">Pipeline Stage *</Label>
            <Select
              disabled={isPending}
              value={statusValue}
              onValueChange={(value) => setValue("status", value as CandidateStatus)}
            >
              <SelectTrigger id="status" className="rounded-xl h-10 w-full bg-background border-border">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CandidateStatus.APPLIED}>Applied</SelectItem>
                <SelectItem value={CandidateStatus.SCREENING}>Screening</SelectItem>
                <SelectItem value={CandidateStatus.INTERVIEW}>Interview</SelectItem>
                <SelectItem value={CandidateStatus.SELECTED}>Selected</SelectItem>
                <SelectItem value={CandidateStatus.REJECTED}>Rejected</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-xs text-destructive">{errors.status.message}</p>
            )}
          </div>

          {/* ── Skills ── */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="skills">Key Skills (Comma-separated)</Label>
            <Input
              id="skills"
              placeholder="e.g. React, Node.js, TypeScript, PostgreSQL"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("skills")}
            />
            {errors.skills && (
              <p className="text-xs text-destructive">{errors.skills.message}</p>
            )}
          </div>

          {/* ── Resume URL ── */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="resumeUrl">Resume URL (Drive, Dropbox, PDF link)</Label>
            <Input
              id="resumeUrl"
              placeholder="e.g. https://drive.google.com/file/d/..."
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("resumeUrl")}
            />
            {errors.resumeUrl && (
              <p className="text-xs text-destructive">{errors.resumeUrl.message}</p>
            )}
          </div>

          {/* ── LinkedIn URL ── */}
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
            <Input
              id="linkedinUrl"
              placeholder="e.g. https://linkedin.com/in/alexmorgan"
              disabled={isPending}
              className="rounded-xl h-10 px-3.5"
              {...register("linkedinUrl")}
            />
            {errors.linkedinUrl && (
              <p className="text-xs text-destructive">{errors.linkedinUrl.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="border-t border-border/30 px-6 py-4 flex justify-end gap-3 bg-neutral-50/50 dark:bg-background/10">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            className="rounded-xl"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="rounded-xl px-5 gap-2 shadow-xs">
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Candidate
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
