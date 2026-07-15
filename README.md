# HireTrack
> Applicant pipeline with scorecards and interview scheduling for recruiters.

![Hero Screenshot](https://raw.githubusercontent.com/your-username/hiretrack/main/docs/screenshots/hero.png)

[![CI](https://github.com/your-username/hiretrack/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/hiretrack/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

* **Live demo:** [https://hiretrack-psi-three.vercel.app](https://hiretrack-psi-three.vercel.app)
* **Video Walkthrough:** [Watch on Loom](https://www.loom.com/share/5c5a1eea38bc452f9e44618c6d1b8398)

## Features
- **Recruiter Authentication:** Secure signup and login powered by Auth.js v5 and hashed credentials using bcrypt (cost factor 12).
- **Candidate Pipeline (CRUD):** Complete control to register, view, update, and remove applicants through stages (Applied, Screening, Interview, Selected, Rejected).
- **Interview Scheduler:** Coordinate upcoming panels, assign specific interviewers, and link virtual meeting invites.
- **Scorecard Evaluations:** Star rating scoring (1-5) on Technical, Communication, and Problem Solving criteria, with descriptive written comments.
- **Analytics Dashboard:** Chart visualizations showing conversion ratios by candidate stages and total monthly interview volume.
- **Display Settings:** Toggle profile names, secure password credentials, and system-aware dark mode theme.
- **Brute-Force Rate Limiting:** Database-backed protection (max 5 failed sign-in/sign-up attempts per 15 minutes scoped to IP + Email identifier).
- **Password Visibility Toggle:** Eye icon visibility switcher for password inputs on both Login and Signup forms.

## Tech Stack
*   **Framework:** Next.js (App Router, React 19)
*   **TypeScript:** Strict type checks for full type safety
*   **Styling:** TailwindCSS v4 with CSS variables mapping
*   **Database:** PostgreSQL (Neon Serverless)
*   **ORM:** Prisma Client with Neon Driver Adapter
*   **Auth:** Auth.js v5 (NextAuth Credentials)
*   **Validation:** Zod schemas (forms, API, actions)
*   **Charts:** Recharts (responsive wrappers)

## Quick Start
```bash
# Clone the repository
git clone https://github.com/your-username/hiretrack.git && cd hiretrack

# Install dependency packages
npm install

# Setup environment variables
cp .env.example .env
# Edit .env and enter your PostgreSQL URLs and generate a secure AUTH_SECRET

# Create and apply database migrations
npx prisma migrate dev --name init

# Seed the database with the demo account credentials
npm run db:seed

# Run the local development server
npm run dev
```

## Environment Variables
| Variable | Description |
| --- | --- |
| `DATABASE_URL` | Neon Postgres connection string (pooled connection URL) |
| `DIRECT_URL` | Neon Postgres connection string (direct connection URL for migrations) |
| `AUTH_SECRET` | Secure key used by Auth.js to sign session cookies |
| `NEXT_PUBLIC_APP_URL` | Local application URL (default: `http://localhost:3000`) or production domain |

## Architecture
HireTrack is structured strictly following Next.js App Router guidelines, placing database entities and schema in `/prisma`, business logic queries and mutation actions in `/src/server`, and shared styling components under `/src/components`.
For a detailed look at the data model diagram, multi-tenancy controls, and architecture trade-offs, refer to [docs/architecture.md](docs/architecture.md).

## Testing
To run the project test suites:
```bash
# Runs the automated unit checks
npm run test
```

## Roadmap
- [x] Recruiter Authentication (bcrypt cost factor 12)
- [x] Candidate Pipeline CRUD
- [x] Interview Scheduler
- [x] Evaluation Scorecards
- [x] Analytics Charts
- [x] Database-backed Authentication Rate Limiting
- [ ] Role-Based Access Control (RBAC)
- [ ] Export Candidates to CSV/PDF

## Screenshots
Screenshots of the project's interfaces and workflows are available in the [public/screenshots](public/screenshots) folder.

These include:
- `login.png` — Recruiter Sign-In Form with password visibility toggle and warning banners.
- `dashboard.png` — Recruiter Pipeline Overview and statistics (Dark Mode).
- `dashboard-light.png` — Recruiter Pipeline Overview and statistics (Light Mode).
- `candidates.png` — Candidates Pipeline stage-tracking grid.
- `candidate-new.png` — Add Candidate form view.
- `interviews.png` — Upcoming Interviews list.
- `interviews-past.png` — Completed evaluations scorecard history.
- `schedule-interview.png` — Interview scheduling modal dialog.
- `evaluation-scorecard.png` — Star rating scoring and recruiter feedback panel.
- `analytics.png` — Funnel volume distribution and monthly workloads.
- `settings.png` — Recruiter Profile and Account Preferences.

## License
MIT — see [LICENSE](LICENSE) details.

---

### Demo Credentials
To evaluate the dashboard with pre-seeded metrics without registering a new account, use the following credentials:
* **Email:** `demo@demo.com`
* **Password:** `demo1234`
