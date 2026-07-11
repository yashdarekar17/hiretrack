import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CandidateStatus, Prisma } from "@prisma/client";

// ──────────────────────────────────────────────────────────────
// CANDIDATE DATABASE QUERIES (Read Operations)
// ──────────────────────────────────────────────────────────────

interface GetCandidatesParams {
  search?: string;
  status?: CandidateStatus;
}

/**
 * Fetch all candidates belonging to the logged-in user,
 * with support for search (name/skills) and status filters.
 */
export async function getCandidates({ search, status }: GetCandidatesParams = {}) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized. Please log in.");
  }

  // Build the dynamic where filter object
  const whereClause: Prisma.CandidateWhereInput = {
    userId, // Multi-tenancy guard: only load this user's candidates
  };

  // Add pipeline status filter if provided
  if (status) {
    whereClause.status = status;
  }

  // Add search filters (names OR skills) if provided
  if (search) {
    whereClause.OR = [
      {
        name: {
          contains: search,
          mode: "insensitive", // Case-insensitive database query
        },
      },
      {
        skills: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  return prisma.candidate.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Fetch a single candidate by ID, secured by recruiter userId ownership.
 */
export async function getCandidateById(id: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized. Please log in.");
  }

  return prisma.candidate.findFirst({
    where: {
      id,
      userId, // Security: candidate must belong to the logged-in user
    },
  });
}
