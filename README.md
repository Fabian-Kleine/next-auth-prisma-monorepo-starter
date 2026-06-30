# Next Auth Starter

A Turborepo + pnpm monorepo: a **Next.js** web app with **Prisma** (PostgreSQL),
**NextAuth** credentials auth, and **Resend** email verification using a
`@repo/transactional` React Email package.

## Stack

- **Turborepo** + **pnpm workspaces**
- **Next.js 16** web app (`apps/web`) — App Router, Tailwind v4, shadcn/ui
- **Prisma 7** (PostgreSQL) via `@repo/db`
- **Auth**: NextAuth (credentials + bcrypt, JWT sessions)
- **Email**: Resend + React Email templates via `@repo/transactional`
- Shared `@repo/eslint-config` and `@repo/typescript-config`

## What's included

- A polished landing page (`/`)
- **Login** (`/login`) and **Register** (`/register`) pages
- **Email verification** flow (`/verify?token=…`) with a Resend-sent template
- **Forgot / reset password** flow
- A **protected dashboard** (`/dashboard`) gated by middleware

## Getting started

```bash
pnpm install

# 1. start a local Postgres (requires Docker)
pnpm db:docker:up

# 2. generate the Prisma client + push the schema
pnpm db:generate
pnpm db:push

# 3. (optional) seed an admin user — admin@example.com / password123
pnpm db:seed

# 4. run the web app
pnpm dev:web        # http://localhost:3000
```

### Environment

Copy the example env files and fill in values:

```bash
cp apps/web/.env.local.example apps/web/.env.local
cp packages/db/.env.example packages/db/.env
```

- Generate a `NEXTAUTH_SECRET` with `openssl rand -base64 32`.
- Leave `RESEND_API_KEY` blank in dev — emails (including the verification link)
  are printed to the server console instead of being sent.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run all apps |
| `pnpm dev:web` | Run the web app only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all packages |
| `pnpm check-types` | Type-check all packages |
| `pnpm db:generate` | Generate the Prisma client |
| `pnpm db:push` | Push the Prisma schema |
| `pnpm db:migrate` | Create & run a migration |
| `pnpm db:seed` | Seed sample data |
| `pnpm db:studio` | Open Prisma Studio |
| `pnpm db:docker:up` / `pnpm db:docker:down` | Start/stop local Postgres |

## Structure

```
next-auth-starter/
├── apps/
│   └── web/                 # Next.js app (auth UI, dashboard, API)
├── packages/
│   ├── db/                  # Prisma schema & client (@repo/db)
│   ├── transactional/       # React Email templates (@repo/transactional)
│   ├── eslint-config/       # Shared ESLint config (@repo/eslint-config)
│   └── typescript-config/   # Shared tsconfig (@repo/typescript-config)
```
