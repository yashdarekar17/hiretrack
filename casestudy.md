# Case Study: HireTrack - Unified Recruiter Pipeline

A detailed write-up of the problem statement, solution design, technical schema challenge, open-source setup, and the branding context of the HireTrack project.

---

## 1. The Problem Statement

Recruitment teams managing hiring funnels at scale face significant operational hurdles:
*   **High Candidate Volume**: Manually tracking details, resumes, skills, and progress stages (Applied, Screening, Interview, Selected, Rejected) for hundreds of applicants becomes disorganized.
*   **Interview Scheduling & Meeting Invites**: Coordinating interviews and manually generating, linking, and managing virtual meeting invites for different candidates is disjointed.
*   **Pipeline Analytics**: Manually calculating and tracking recruitment statistics—how many candidates are selected, rejected, or currently being interviewed—is difficult to aggregate and visualize.

---

## 2. The Solution

We created **HireTrack**—a unified, single-interface web platform that consolidates all of these recruiter workflows into one application:
*   **Central Pipeline (CRUD)**: Recruiters can add, view, update, and progress candidates through stages in a structured pipeline.
*   **Scheduler & Meeting Invites**: Recruiters can coordinate interview times, assign interviewers, and attach virtual meeting links directly to candidates' interview schedules.
*   **Dashboard Analytics**: An analytics suite that automatically displays statistics, allowing recruiters to instantly see how many candidates are selected, rejected, and interviewed.

---

## 3. Key Technical Challenges & Learnings

### Designing the Prisma Schema
The primary difficulty in setting up the database layer was designing a robust, relational schema using Prisma that connects all recruitment entities correctly:
*   **Entity Relationships**: Mapping the connection between recruiters (`User`), applicants (`Candidate`), scheduled sessions (`Interview`), and feedback ratings (`Scorecard`) while enforcing correct constraints (such as a 1-to-many relationship for candidates, and a strict 1-to-1 relationship between an interview and its scorecard).
*   **Database Constraints**: Ensuring type-safety by using schema Enums (`CandidateStatus`) for pipeline stages, and creating indexes on commonly queried fields (like candidate status and user ID) to maintain high-performance search and statistics filtering as candidate volumes scale.

### Adding a License
To open-source the project, we added the **MIT License** by creating a root `LICENSE` file. This permissive license protects authors from liability and legally grants open-source contributors the right to run, modify, and distribute the software.

### Open-Sourcing the Repository
To ready the project for public contribution:
*   We published the repository as **Public** on GitHub.
*   We created a `CONTRIBUTING.md` defining branch naming patterns (e.g. `feat/`, `fix/`) and verification checks (linting, building, type checking) to ensure high code quality.
*   We structured the codebase documentation to allow easy onboarding for external developers.

---

## 4. Why We Added the Footer

We integrated the custom branding footer containing `"Made for digital.heroes"` to support the project's real-world context:
*   **Mentorship Context**: **digital.heroes** is a coding and digital integration academy where industry mentors guide junior developers in building software. The footer was added to explicitly credit the mentors and developers who built the application.
*   **Theme Visibility**: To make the transparent logo readable on both light and dark backgrounds, we used CSS filters (`invert dark:invert-0`). This automatically adjusts the text contrast depending on the active theme mode without duplicating image assets.
