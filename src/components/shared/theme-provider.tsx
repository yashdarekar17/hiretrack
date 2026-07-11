"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// ──────────────────────────────────────────────────────────────
// ThemeProvider Component (next-themes)
// ──────────────────────────────────────────────────────────────
// Provides dark mode / light mode context to client-side components.
// Configured with `attribute="class"` so that next-themes toggles
// the `.dark` class on the `<html>` element.
// ──────────────────────────────────────────────────────────────
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
