import React from "react";

/**
 * Shared Loading Skeleton for all Dashboard Routes
 * Renders instantly during route transitions to prevent the UI from feeling stuck.
 */
export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse p-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-xl bg-muted/80" />
          <div className="h-4 w-80 rounded-lg bg-muted/50" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-muted/80 shrink-0" />
      </div>

      {/* Grid of stats cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded-md bg-muted/70" />
              <div className="h-8 w-8 rounded-xl bg-muted/60" />
            </div>
            <div className="space-y-2 pt-2">
              <div className="h-8 w-14 rounded-lg bg-muted/80" />
              <div className="h-3.5 w-36 rounded-md bg-muted/50" />
            </div>
          </div>
        ))}
      </div>

      {/* Two column grid for list/detail skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/40 bg-card/50 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border/30 pb-4">
              <div className="space-y-2">
                <div className="h-5 w-44 rounded-md bg-muted/80" />
                <div className="h-3.5 w-56 rounded-md bg-muted/50" />
              </div>
              <div className="h-4 w-16 rounded-md bg-muted/60" />
            </div>
            <div className="space-y-4 pt-2">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0 last:pb-0">
                  <div className="space-y-2">
                    <div className="h-4.5 w-32 rounded-md bg-muted/70" />
                    <div className="h-3 w-44 rounded-md bg-muted/50" />
                  </div>
                  <div className="h-6 w-20 rounded-xl bg-muted/65" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
