import React from "react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto pt-8 pb-4 border-t border-border/40 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-1">
        <span>© {currentYear}</span>
        <span className="font-semibold text-foreground">HireTrack</span>
        <span className="text-muted-foreground/40 px-1">|</span>
        <span>All rights reserved.</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">Made for</span>
        <span className="font-semibold text-emerald-600 dark:text-emerald-400 tracking-tight select-none">
          digital.heroes
        </span>
      </div>
    </footer>
  );
}
