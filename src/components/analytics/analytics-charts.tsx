"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsChartsProps {
  statusData: Array<{ status: string; count: number }>;
  interviewData: Array<{ name: string; count: number }>;
}

// ──────────────────────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; [key: string]: unknown }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover text-popover-foreground border border-border/80 px-3 py-2 rounded-xl shadow-md text-xs font-semibold">
        <p className="text-muted-foreground">{label}</p>
        <p className="text-sm font-bold text-primary mt-0.5">
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}

// ──────────────────────────────────────────────────────────────
// AnalyticsCharts Component (Client Component)
// ──────────────────────────────────────────────────────────────
// Receives database query outputs as props.
// Renders Responsive Recharts visual grids.
// ──────────────────────────────────────────────────────────────
export function AnalyticsCharts({ statusData, interviewData }: AnalyticsChartsProps) {
  // Theme styling constants (compatible with CSS oklch variables)
  const gridColor = "rgba(120, 120, 120, 0.1)";
  const labelColor = "#888888";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ── Candidates by Status (Bar Chart) ── */}
      <Card className="border border-border/60 shadow-xs rounded-2xl bg-card overflow-hidden">
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-lg font-bold">Candidates by Status</CardTitle>
          <CardDescription>Applicant volume spread across hiring funnel stages</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={statusData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="status"
                stroke={labelColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke={labelColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(120, 120, 120, 0.05)", radius: 8 }} />
              <Bar
                dataKey="count"
                fill="var(--color-primary, #0284c7)"
                radius={[8, 8, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Interviews Scheduled (Line Chart) ── */}
      <Card className="border border-border/60 shadow-xs rounded-2xl bg-card overflow-hidden">
        <CardHeader className="border-b border-border/30 pb-4">
          <CardTitle className="text-lg font-bold">Interviews This Month</CardTitle>
          <CardDescription>Daily interview workloads and scheduled meetings trend</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={interviewData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis
                dataKey="name"
                stroke={labelColor}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                // Only show a label every 5 days on XAxis to avoid overcrowding text on mobile
                interval={4}
              />
              <YAxis
                stroke={labelColor}
                fontSize={11}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="var(--color-primary, #6366f1)"
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 1 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
