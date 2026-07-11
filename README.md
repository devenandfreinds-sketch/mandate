# Mandate

Mandate tracks whether emerging urban political movements deliver measurable results once they enter government, comparing governance through transparent, publicly-sourced statistics.

This is the initial vertical slice: a production-quality database schema, API, and four core pages (Landing, Dashboard, Governance Models, City/Metro Profiles), fully populated with clearly-marked placeholder data. The Pipeline Tracker UI, Compare tool, Timeline, Methodology, Sources, and API Docs pages are intentionally out of scope for this pass — the schema already supports them without migration.

## Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui-style components, Recharts, TanStack Query, React Router
- **Backend**: Node.js, Express
- **Database**: PostgreSQL, Prisma ORM
- **Monorepo**: npm workspaces (`shared`, `server`, `client`)

## Prerequisites

Installed via Homebrew for this environment: Node.js 22, PostgreSQL 16, Git. No Docker is used — Postgres runs as a native Homebrew service.

```bash
brew install node@22 postgresql@16 git
brew services start postgresql@16
```

## First-time setup

```bash
createdb mandate_dev
cp .env.example server/.env   # then edit DATABASE_URL to use your macOS username
npm install                   # installs all workspaces, builds @mandate/shared
npm run db:migrate             # applies the Prisma schema
npm run db:seed                 # populates placeholder data (~3,300 metric values)
```

## Running locally

```bash
npm run dev
```

- Server: http://localhost:3001 (API at `/api/v1/*`)
- Client: http://localhost:5173 (proxies `/api` to the server)

## Deploying elsewhere (Replit, Railway, Vercel, etc.)

The app is deploy-target-agnostic: set `DATABASE_URL` to the target's managed Postgres connection string, run `npm run build`, then `npm start` (which runs the Express server; in `NODE_ENV=production` it also serves the built client from `client/dist`). No code changes are needed to switch databases.

## Project structure

```
shared/   @mandate/shared — DTO types shared by client and server
server/   Express API + Prisma schema/migrations/seed
client/   Vite + React frontend
```

See [server/prisma/schema.prisma](server/prisma/schema.prisma) for the data model: `GovernanceModel → Jurisdiction → Administration`, and `Category → MetricDefinition → MetricValue`. Adding a new governance model, city, category, or metric is a data insert — never a schema migration.

## Placeholder data

All seeded data is flagged `isPlaceholder: true` end-to-end (database rows, API responses, and UI banners). It is synthetic, deterministically generated for demonstration, and is not sourced from real observations.
