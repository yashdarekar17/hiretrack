"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ──────────────────────────────────────────────────────────────
// CandidateFilters Component
// ──────────────────────────────────────────────────────────────
// client-side component handling search inputs (name/skills) and
// status pipeline filter.
// Dynamically pushes query parameters to the URL which triggers Next.js
// server data refetching.
// ──────────────────────────────────────────────────────────────
export function CandidateFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read initial query values from URL
  const initialSearch = searchParams.get("search") || "";
  const initialStatus = searchParams.get("status") || "ALL";

  const [search, setSearch] = React.useState(initialSearch);

  // Debounce search input to prevent database hammering on every keypress
  React.useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      router.push(`/candidates?${params.toString()}`);
    }, 400); // 400ms delay

    return () => clearTimeout(delayDebounce);
  }, [search, router, searchParams]);

  // Handle dropdown status filter updates
  const handleStatusChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    router.push(`/candidates?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* ── Search Bar ── */}
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search candidates by name or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-xl h-10 w-full bg-card border-border/80 focus:border-primary transition-colors"
        />
      </div>

      {/* ── Status Dropdown Filter ── */}
      <div className="w-full sm:w-48">
        <Select value={initialStatus} onValueChange={(val) => handleStatusChange(val || "ALL")}>
          <SelectTrigger className="rounded-xl h-10 w-full bg-card border-border/80">
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Stages</SelectItem>
            <SelectItem value="APPLIED">Applied</SelectItem>
            <SelectItem value="SCREENING">Screening</SelectItem>
            <SelectItem value="INTERVIEW">Interview</SelectItem>
            <SelectItem value="SELECTED">Selected</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
