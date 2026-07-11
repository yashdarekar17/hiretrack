# Contributing to HireTrack

Thank you for your interest in contributing to **HireTrack**! As an open-source project, we welcome contributions of all kinds: bug fixes, feature suggestions, UI polish, and architectural improvements.

---

## Code of Conduct

Please be respectful and helpful. We aim to foster an inclusive and productive collaboration workspace.

---

## Local Development Setup

To set up the project locally:

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/hiretrack.git
    cd hiretrack
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Setup Environment Variables:**
    *   Copy `.env.example` to `.env`.
    *   Input your PostgreSQL/Neon database URLs and generate a secure `AUTH_SECRET` key.
4.  **Database Migration:**
    ```bash
    npx prisma db push
    ```
5.  **Start Development Server:**
    ```bash
    npm run dev
    ```

---

## Contribution Guidelines

### Branch Naming Conventions
*   `feat/` for new features (e.g. `feat/email-notifications`)
*   `fix/` for bug fixes (e.g. `fix/select-dropdown-cuid`)
*   `docs/` for documentation updates (e.g. `docs/architecture-overview`)
*   `refactor/` for styling or codebase cleanup

### Pull Request (PR) Requirements
*   Ensure the code compiles with **no TypeScript errors** (`npx tsc --noEmit`).
*   Ensure the code runs with **no linter warnings** (`npm run lint`).
*   Verify the production build completes successfully (`npm run build`).
*   Update the `CHANGELOG.md` with a summary of the additions/fixes.
