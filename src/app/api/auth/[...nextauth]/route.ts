import { handlers } from "@/lib/auth";

// ──────────────────────────────────────────────────────────────
// Next.js Route Handler for Auth.js API Endpoints
// ──────────────────────────────────────────────────────────────
// Any request to `/api/auth/*` (like sign-in, sign-out, session retrieval)
// is handled by this catch-all route.
// ──────────────────────────────────────────────────────────────
export const { GET, POST } = handlers;
