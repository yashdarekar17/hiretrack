import NextAuth from "next-auth";
import authConfig from "./src/lib/auth.config";

// ──────────────────────────────────────────────────────────────
// Next.js Route Protection Middleware (Auth.js v5)
// ──────────────────────────────────────────────────────────────
// This middleware runs on the Edge Runtime before any request
// is served. It checks the session cookie.
//
// By using NextAuth with authConfig (which has no database adapter),
// we avoid edge runtime errors and keep authentication fast.
//
// Redirection logic:
//   - If NOT logged in and trying to access a protected route (dashboard)
//     → redirect to /login
//   - If logged in and trying to access auth pages (login/signup)
//     → redirect to /dashboard
// ──────────────────────────────────────────────────────────────

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Define route flags
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup");
  const isProtectedRoute =
    nextUrl.pathname.startsWith("/dashboard") ||
    nextUrl.pathname.startsWith("/candidates") ||
    nextUrl.pathname.startsWith("/interviews") ||
    nextUrl.pathname.startsWith("/analytics") ||
    nextUrl.pathname.startsWith("/settings");

  // 1. If accessing auth pages while logged in → go to dashboard
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", nextUrl));
    }
    return;
  }

  // 2. If accessing protected pages while logged out → go to login
  if (isProtectedRoute) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", nextUrl));
    }
    return;
  }
});

// Configure which paths trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.ico).*)",
  ],
};
