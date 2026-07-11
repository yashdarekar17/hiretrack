"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { candidateSchema } from "@/lib/validations/candidate";
import { CandidateStatus } from "@prisma/client";
import { z } from "zod";

type CandidateInput = z.input<typeof candidateSchema>;

// ──────────────────────────────────────────────────────────────
// CANDIDATE SERVER ACTIONS (Mutations)
// ──────────────────────────────────────────────────────────────

export type CandidateActionState = {
  error?: string | null;
  success?: boolean;
};

/**
 * Helper to authenticate user and verify candidate ownership
 */
async function verifyCandidateOwnership(candidateId: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const candidate = await prisma.candidate.findFirst({
    where: { id: candidateId, userId },
  });

  if (!candidate) {
    throw new Error("Candidate not found or unauthorized");
  }

  return { userId, candidate };
}

/**
 * Create a new candidate profile
 */
export async function createCandidate(
  data: CandidateInput
): Promise<CandidateActionState> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return { error: "Unauthorized. Please log in.", success: false };
    }

    // 1. Validate inputs via Zod
    const validated = candidateSchema.safeParse(data);
    if (!validated.success) {
      console.error("ZOD_VALIDATION_FAILED:", validated.error.format());
      return {
        error: validated.error.issues[0]?.message || "Invalid inputs",
        success: false,
      };
    }

    // 2. Write to database
    await prisma.candidate.create({
      data: {
        ...validated.data,
        userId, // Associate with current recruiter
      },
    });

    // 3. Revalidate path to update the cache
    revalidatePath("/candidates");
    revalidatePath("/dashboard");

    return { success: true, error: null };
  } catch (error) {
    console.error("CREATE_CANDIDATE_ERROR:", error);
    return { error: "Failed to create candidate. Please try again.", success: false };
  }
}

/**
 * Update an existing candidate profile
 */
export async function updateCandidate(
  id: string,
  data: CandidateInput
): Promise<CandidateActionState> {
  try {
    // 1. Verify ownership
    await verifyCandidateOwnership(id);

    // 2. Validate inputs
    const validated = candidateSchema.safeParse(data);
    if (!validated.success) {
      console.error("ZOD_VALIDATION_FAILED_UPDATE:", validated.error.format());
      return {
        error: validated.error.issues[0]?.message || "Invalid inputs",
        success: false,
      };
    }

    // 3. Update database
    await prisma.candidate.update({
      where: { id },
      data: validated.data,
    });

    // 4. Revalidate cache
    revalidatePath("/candidates");
    revalidatePath(`/candidates/${id}`);
    revalidatePath("/dashboard");

    return { success: true, error: null };
  } catch (error) {
    console.error("UPDATE_CANDIDATE_ERROR:", error);
    return { error: "Failed to update candidate. Please try again.", success: false };
  }
}

/**
 * Update pipeline status of a candidate
 */
export async function updateCandidateStatus(
  id: string,
  status: CandidateStatus
): Promise<CandidateActionState> {
  try {
    // 1. Verify ownership
    await verifyCandidateOwnership(id);

    // 2. Perform simple status update
    await prisma.candidate.update({
      where: { id },
      data: { status },
    });

    // 3. Revalidate cache
    revalidatePath("/candidates");
    revalidatePath(`/candidates/${id}`);
    revalidatePath("/dashboard");

    return { success: true, error: null };
  } catch (error) {
    console.error("UPDATE_STATUS_ERROR:", error);
    return { error: "Failed to update status. Please try again.", success: false };
  }
}

/**
 * Delete a candidate profile
 */
export async function deleteCandidate(id: string): Promise<CandidateActionState> {
  try {
    // 1. Verify ownership
    await verifyCandidateOwnership(id);

    // 2. Delete candidate (related interviews cascade delete)
    await prisma.candidate.delete({
      where: { id },
    });

    // 3. Revalidate cache
    revalidatePath("/candidates");
    revalidatePath("/dashboard");

    return { success: true, error: null };
  } catch (error) {
    console.error("DELETE_CANDIDATE_ERROR:", error);
    return { error: "Failed to delete candidate. Please try again.", success: false };
  }
}
