"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { logout } from "@/server/actions/auth";
import { Menu, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sidebar } from "./sidebar";
import { ThemeToggle } from "./theme-toggle";

interface TopbarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

// Helper to extract page title from URL pathname
const getPageTitle = (pathname: string): string => {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/candidates")) return "Candidates";
  if (pathname.startsWith("/interviews")) return "Interviews";
  if (pathname.startsWith("/analytics")) return "Analytics";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Overview";
};

// ──────────────────────────────────────────────────────────────
// Topbar Component
// ──────────────────────────────────────────────────────────────
// Renders the header containing:
//   1. Mobile hamburger menu trigger (triggers mobile Sidebar sheet)
//   2. Dynamic Page Title
//   3. ThemeToggle
//   4. User dropdown profile menu
// ──────────────────────────────────────────────────────────────
export function Topbar({ user }: TopbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "HT";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="flex items-center justify-between px-6 h-16 bg-card border-b border-border shadow-xs shrink-0">
      <div className="flex items-center gap-4">
        {/* ── Mobile Sidebar Trigger ── */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              />
            }
          >
            <Menu className="w-5 h-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 border-r-0">
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* ── Page Title ── */}
        <h1 className="text-xl font-bold tracking-tight text-foreground transition-all duration-200">
          {getPageTitle(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* ── Theme Toggle ── */}
        <ThemeToggle />

        <div className="h-4 w-px bg-border" />

        {/* ── User Dropdown ── */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full select-none" />
            }
          >
            <Avatar className="h-9 w-9 border border-border shadow-xs hover:border-primary/50 transition-colors">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold leading-none">{user.name || "Recruiter"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{user.email || ""}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <a href="/settings" className="flex items-center gap-2 cursor-pointer w-full px-3 py-2 text-sm">
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer px-3 py-2 text-sm"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
