"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CandidateStatus } from "@prisma/client";
import { z } from "zod";
import { interviewSchema, scorecardSchema } from "@/lib/validations/interview";

export type ActionState = {
  error?: string | null;
  success?: boolean;
};

type InterviewInput = z.input<typeof interviewSchema>;
type ScorecardInput = z.input<typeof scorecardSchema>;

/**
 * Schedule a new interview for a candidate
 */
export async function scheduleInterview(
  data: InterviewInput
): Promise<ActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized", success: false };
    }

    // 1. Validate inputs via Zod
    const validated = interviewSchema.safeParse(data);
    if (!validated.success) {
      return {
        error: validated.error.issues[0]?.message || "Invalid inputs",
        success: false,
      };
    }

    const { candidateId, scheduledAt, interviewer, meetingLink } = validated.data;

    // 2. Verify candidate belongs to recruiter
    const candidate = await prisma.candidate.findFirst({
      where: { id: candidateId, userId },
    });

    if (!candidate) {
      return { error: "Candidate not found", success: false };
    }

    // 3. Create interview in database
    await prisma.interview.create({
      data: {
        scheduledAt: new Date(scheduledAt),
        interviewer,
        meetingLink: meetingLink || null,
        candidateId,
        userId,
      },
    });

    // 4. AUTOMATIC PIPELINE PROGRESSION:
    // When an interview is scheduled, advance the candidate's status to INTERVIEW!
    await prisma.candidate.update({
      where: { id: candidateId },
      data: { status: CandidateStatus.INTERVIEW },
    });

    // 5. Revalidate cache paths
    revalidatePath("/interviews");
    revalidatePath("/candidates");
    revalidatePath(`/candidates/${candidateId}`);
    revalidatePath("/dashboard");

    return { success: true, error: null };
  } catch {
    return { error: "Failed to schedule interview.", success: false };
  }
}

/**
 * Delete a scheduled interview
 */
export async function deleteInterview(id: string): Promise<ActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized", success: false };
    }

    // Verify ownership
    const interview = await prisma.interview.findFirst({
      where: { id, userId },
    });

    if (!interview) {
      return { error: "Interview not found", success: false };
    }

    // Delete
    await prisma.interview.delete({
      where: { id },
    });

    revalidatePath("/interviews");
    revalidatePath(`/candidates/${interview.candidateId}`);
    revalidatePath("/dashboard");

    return { success: true, error: null };
  } catch {
    return { error: "Failed to delete interview.", success: false };
  }
}

/**
 * Create or update evaluation scorecard for an interview
 */
export async function submitScorecard(
  interviewId: string,
  data: ScorecardInput
): Promise<ActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized", success: false };
    }

    // 1. Verify interview belongs to recruiter
    const interview = await prisma.interview.findFirst({
      where: { id: interviewId, userId },
    });

    if (!interview) {
      return { error: "Interview not found", success: false };
    }

    // 2. Validate inputs
    const validated = scorecardSchema.safeParse(data);
    if (!validated.success) {
      return {
        error: validated.error.issues[0]?.message || "Invalid inputs",
        success: false,
      };
    }

    // 3. Upsert scorecard (insert if doesn't exist, update if it does)
    await prisma.scorecard.upsert({
      where: { interviewId },
      update: {
        ...validated.data,
      },
      create: {
        ...validated.data,
        interviewId,
      },
    });

    revalidatePath("/interviews");
    revalidatePath(`/candidates/${interview.candidateId}`);

    return { success: true, error: null };
  } catch {
    return { error: "Failed to save scorecard.", success: false };
  }
}
