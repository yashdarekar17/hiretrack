import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// ──────────────────────────────────────────────────────────────
// INTERVIEW DATABASE QUERIES (Read Operations)
// ──────────────────────────────────────────────────────────────

/**
 * Fetch all interviews scheduled by the logged-in user,
 * ordered by date (most recent scheduled first).
 * Includes associated candidate name and scorecard details.
 */
export async function getInterviews() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized. Please log in.");
  }

  return prisma.interview.findMany({
    where: { userId },
    include: {
      candidate: {
        select: {
          name: true,
          email: true,
        },
      },
      scorecard: true,
    },
    orderBy: { scheduledAt: "desc" },
  });
}
