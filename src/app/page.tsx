import { redirect } from "next/navigation";

// ──────────────────────────────────────────────────────────────
// Root Page Redirection (App Router)
// ──────────────────────────────────────────────────────────────
// The entry point at `http://localhost:3000` redirects immediately
// to `/dashboard`.
//
// If the user is unauthenticated, the middleware intercepts the
// `/dashboard` request and redirects them to `/login`.
// If they are logged in, they see their actual dashboard panels.
// ──────────────────────────────────────────────────────────────
export default function Home() {
  redirect("/dashboard");
}
