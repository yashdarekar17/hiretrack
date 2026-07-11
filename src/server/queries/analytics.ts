import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CandidateStatus } from "@prisma/client";

// ──────────────────────────────────────────────────────────────
// ANALYTICS DATABASE QUERIES (Read Operations)
// ──────────────────────────────────────────────────────────────

/**
 * Fetch candidate counts grouped by status stage
 */
export async function getCandidatesStatusData() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized. Please log in.");
  }

  // Get count for every possible enum value (so we show 0 values too)
  const statuses = Object.values(CandidateStatus);

  const counts = await Promise.all(
    statuses.map(async (status) => {
      const count = await prisma.candidate.count({
        where: { userId, status },
      });
      return {
        // Format stage name nicely: APPLIED -> Applied
        status: status.charAt(0) + status.slice(1).toLowerCase(),
        count,
      };
    })
  );

  return counts;
}

/**
 * Fetch scheduled interviews grouped by day for the current calendar month
 */
export async function getInterviewsThisMonthData() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized. Please log in.");
  }

  // Calculate start and end dates of the current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  const startOfMonth = new Date(year, month, 1);
  const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

  // Fetch interviews in range
  const interviews = await prisma.interview.findMany({
    where: {
      userId,
      scheduledAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    select: {
      scheduledAt: true,
    },
  });

  // Calculate total days in the current month
  const totalDays = endOfMonth.getDate();

  // Create map of day -> count
  const dayCountsMap: Record<number, number> = {};
  for (let i = 1; i <= totalDays; i++) {
    dayCountsMap[i] = 0;
  }

  // Populate map with db values
  interviews.forEach((interview) => {
    const day = new Date(interview.scheduledAt).getDate();
    if (dayCountsMap[day] !== undefined) {
      dayCountsMap[day]++;
    }
  });

  // Convert to formatted array for Recharts: [{ date: "Jul 01", count: 2 }, ...]
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const formattedData = Object.entries(dayCountsMap).map(([dayStr, count]) => {
    const day = parseInt(dayStr, 10);
    const dayFormatted = day < 10 ? `0${day}` : `${day}`;
    return {
      name: `${monthNames[month]} ${dayFormatted}`,
      count,
    };
  });

  return formattedData;
}
