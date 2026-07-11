# HireTrack - Architecture & System Design

This document details the architectural decisions, folder structure, database design, and library stack for **HireTrack**, a modern Applicant Tracking System (ATS).

---

## 1. Stack and Core Technologies
*   **Framework:** Next.js (App Router, React 19).
*   **Database ORM:** Prisma Client.
*   **Database Engine:** PostgreSQL (Neon Serverless).
*   **Authentication:** Auth.js v5 (NextAuth Credentials Provider with JWT tokens).
*   **Styling & Theme:** TailwindCSS v4 with CSS variables mapping to a Corporate SaaS Indigo design theme.
*   **Form Management:** React Hook Form & Zod for schema validation.
*   **Charts Visualization:** Recharts (responsive wrapper).

---

## 2. Directory Structure
```
├── .github/
│   ├── workflows/ci.yml         # GitHub Actions CI for lint, typecheck, build
│   └── ISSUE_TEMPLATE/          # Bug & feature templates
├── docs/
│   └── architecture.md          # This file
├── prisma/
│   ├── schema.prisma            # Database schema definitions
│   └── migrations/              # DB migration logs
├── public/                      # Static assets & icons
├── src/
│   ├── app/                     # Route pages & layouts (App Router)
│   ├── components/              # Shared UI & specific feature components
│   ├── lib/                     # Auth configurations, Prisma client, validators
│   ├── server/                  # Server queries & Server actions mutations
│   └── types/                   # Shared TypeScript definitions
└── tests/                       # Unit & integration testing suites
```

---

## 3. Database Schema
*   **User:** Stores recruiter details (names, emails, encrypted passwords).
*   **Candidate:** Holds applicant records (experience, skills tags, resume URLs) linked to recruiters.
*   **Interview:** Tracks scheduled panel interviews linked to candidates and recruiters.
*   **Scorecard:** One-to-one relationship with interviews, holding ratings (1-5) and feedback comments.

---

## 4. Security Practices
*   **Hashing:** Passwords are encrypted using `bcryptjs` with 10 salt rounds.
*   **Database Multi-Tenancy:** Every database query and write operation is scoped strictly using the recruiter's active session ID (`userId`), preventing cross-tenant access.
*   **Strict Inputs:** All client inputs and Server Actions are validated via Zod validators before execution.
