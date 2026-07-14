# HireTrack
> Applicant pipeline with scorecards and interview scheduling for recruiters.

![Hero Screenshot](https://raw.githubusercontent.com/your-username/hiretrack/main/docs/screenshots/hero.png)

[![CI](https://github.com/your-username/hiretrack/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/hiretrack/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE) **Live demo → https://hiretrack.vercel.app**

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
A preview grid showing the HireTrack recruitment dashboard interface.
*(Check screenshots folder under docs/screenshots/)*

## License
MIT — see [LICENSE](LICENSE) details.

---

### Demo Credentials
To evaluate the dashboard with pre-seeded metrics without registering a new account, use the following credentials:
* **Email:** `demo@demo.com`
* **Password:** `demo1234`
