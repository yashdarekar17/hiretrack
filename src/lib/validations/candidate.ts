import { z } from "zod";

// ──────────────────────────────────────────────────────────────
// Zod Schema for Candidate Form Inputs
// ──────────────────────────────────────────────────────────────
// Validates candidate creation and edit forms.
// Links directly to the Prisma CandidateStatus enum.
// ──────────────────────────────────────────────────────────────
export const candidateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional().or(z.literal("")),
  experience: z.number().int().min(0, "Experience cannot be negative"),
  skills: z.string().default(""),
  resumeUrl: z
    .string()
    .url("Invalid URL format for resume")
    .optional()
    .or(z.literal("")),
  linkedinUrl: z
    .string()
    .url("Invalid URL format for LinkedIn")
    .optional()
    .or(z.literal("")),
  status: z.enum(["APPLIED", "SCREENING", "INTERVIEW", "SELECTED", "REJECTED"]).default("APPLIED"),
});

export type CandidateInput = z.infer<typeof candidateSchema>;
