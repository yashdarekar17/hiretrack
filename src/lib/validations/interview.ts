import { z } from "zod";

// ──────────────────────────────────────────────────────────────
// Zod Schema for Interview Scheduling
// ──────────────────────────────────────────────────────────────
export const interviewSchema = z.object({
  candidateId: z.string().min(1, "Please select a candidate"),
  scheduledAt: z.string().min(1, "Please select a date and time"),
  interviewer: z.string().min(2, "Interviewer name must be at least 2 characters"),
  meetingLink: z.string().url("Invalid URL format").optional().or(z.literal("")),
});

// ──────────────────────────────────────────────────────────────
// Zod Schema for Scorecards
// ──────────────────────────────────────────────────────────────
export const scorecardSchema = z.object({
  technicalRating: z.number().int().min(1, "Rating must be between 1 and 5").max(5),
  communicationRating: z.number().int().min(1, "Rating must be between 1 and 5").max(5),
  problemSolvingRating: z.number().int().min(1, "Rating must be between 1 and 5").max(5),
  comments: z.string().optional().or(z.literal("")),
});

export type InterviewInput = z.input<typeof interviewSchema>;
export type ScorecardInput = z.input<typeof scorecardSchema>;
