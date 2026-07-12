# Changelog

All notable changes to the **HireTrack** project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-11

### Added
- Recruiter Authentication (Login and Signup screens with secure `bcryptjs` hashing).
- Candidate Pipeline CRUD (create applicants, parse skills tags, edit details, delete modal checks).
- Candidate Stage Filters (toggle by stages APPLIED, SCREENING, INTERVIEW, SELECTED, REJECTED).
- Interview Scheduler (assign date/times, interviewer names, and videoconferencing meeting links).
- Scorecard Evaluation Forms (1-5 star ratings for Technical, Communication, and Problem Solving criteria with comments).
- Analytics Insights Dashboard (Recharts visual bar graph and monthly timelines).
- Account Settings Panel (update profile display names, security credentials, and dark mode togglers).
- GitHub Actions CI Pipeline (automated linting, typechecks, and Next.js builds).

### Fixed
- Re-routed form binding handler bugs to ensure candidate submissions successfully insert into the database.
- Fixed stage filter triggers so that select elements retain their query states.
- Corrected unmounted option bugs in `<SelectValue>` to display candidate names instead of raw database CUIDs in select boxes.
- Fixed a Tailwind CSS compilation bug by mapping the `--font-sans` variable to Geist Sans, eliminating browser Times New Roman typography.
- Resolved next-auth ClientFetchErrors by transitioning logout mechanisms to Next.js Server Actions.
- Resolved Vercel deployment module-not-found errors by converting `@prisma/client` imports in client components (`status-updater.tsx`, `candidate-form.tsx`, `scorecard-dialog.tsx`) to type-only imports (`import type`) and utilizing string literals instead of runtime enum values, completely stripping Prisma's server runtime from client bundles.
