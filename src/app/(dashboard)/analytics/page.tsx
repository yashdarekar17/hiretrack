import React from "react";
import { getCandidatesStatusData, getInterviewsThisMonthData } from "@/server/queries/analytics";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";

// ──────────────────────────────────────────────────────────────
// AnalyticsPage (Server Component)
// ──────────────────────────────────────────────────────────────
// Queries database metrics in parallel.
// Passes serializable results to the Client Charts container.
// ──────────────────────────────────────────────────────────────
export default async function AnalyticsPage() {
  // Query DB analytics data in parallel
  const [statusData, interviewData] = await Promise.all([
    getCandidatesStatusData(),
    getInterviewsThisMonthData(),
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* ── Page Header ── */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Recruitment Insights
        </h2>
        <p className="text-muted-foreground mt-1">
          Monitor pipeline volume distribution, funnel health, and evaluation trends for the month.
        </p>
      </div>

      {/* ── Recharts Graphs Container ── */}
      <AnalyticsCharts statusData={statusData} interviewData={interviewData} />
    </div>
  );
}
