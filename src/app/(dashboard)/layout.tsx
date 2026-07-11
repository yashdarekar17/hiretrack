import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

// ──────────────────────────────────────────────────────────────
// Dashboard Layout (App Router)
// ──────────────────────────────────────────────────────────────
// Serves as the shell for all authenticated pages.
// Fetches user session server-side to guarantee authorization.
// Renders:
//   - Sidebar (Desktop: fixed left, Mobile: hidden)
//   - Topbar (Mobile menu button, Page Title, User dropdown)
//   - Main scrollable content body
// ──────────────────────────────────────────────────────────────
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Fetch user session
  const session = await auth();

  // 2. Guard: Redirect to login if unauthenticated
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* ── Sidebar (Desktop: Visible) ── */}
      <Sidebar className="hidden lg:flex shrink-0" />

      {/* ── Main Layout Viewport ── */}
      <div className="flex flex-col flex-1 h-full min-w-0">
        {/* ── Topbar (Sends logged in user profile details) ── */}
        <Topbar user={session.user} />

        {/* ── Page Content Container ── */}
        <main className="flex-1 overflow-y-auto bg-neutral-50/50 dark:bg-background/20 p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
