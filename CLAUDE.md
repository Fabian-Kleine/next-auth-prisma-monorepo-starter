# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from the repo root unless noted. Turbo fans tasks out across all workspaces.

```bash
pnpm dev:web          # run the web app only (http://localhost:3000)
pnpm dev              # run every app's dev task
pnpm build            # build all (turbo: @repo/db's build = prisma generate runs first)
pnpm lint             # eslint across all packages
pnpm check-types      # tsc --noEmit across all packages

# Database (delegated to @repo/db)
pnpm db:docker:up     # start local Postgres 16 via docker compose
pnpm db:generate      # prisma generate -> packages/db/prisma/generated
pnpm db:push          # push schema without a migration
pnpm db:migrate       # prisma migrate dev (needs SHADOW_DATABASE_URL)
pnpm db:seed          # upsert admin@example.com / password123
pnpm db:studio        # Prisma Studio
```

There is **no test runner** configured. Lint a single package with `turbo run lint --filter=web`; same `--filter` pattern works for `build` / `check-types`.

First-run order: `pnpm install` → `pnpm db:docker:up` → `pnpm db:generate` → `pnpm db:push` → (optional) `pnpm db:seed` → `pnpm dev:web`.

## Environment setup

Two separate env files must agree on `DATABASE_URL`:
- `apps/web/.env.local` (copy from `.env.local.example`) — NextAuth + Resend + app URL.
- `packages/db/.env` (copy from `.env.example`) — Prisma connection strings.

Generate `NEXTAUTH_SECRET` with `openssl rand -base64 32`. Leave `RESEND_API_KEY` blank in dev — emails are logged to the server console instead of sent (see `lib/email/send-email.ts`).

## Architecture

Turborepo + pnpm monorepo. `apps/web` is the only app; everything else is a `@repo/*` package consumed via `workspace:*`.

```
apps/web                  Next.js 16 App Router app (auth UI, dashboard, API)
packages/db               Prisma 7 client + schema  (@repo/db)
packages/transactional    React Email templates     (@repo/transactional)
packages/eslint-config    shared flat ESLint config  (@repo/eslint-config)
packages/typescript-config shared tsconfigs          (@repo/typescript-config)
```

### Database layer (`@repo/db`) — read this before touching Prisma

- Uses the **new `prisma-client` generator** (not `prisma-client-js`). It emits TypeScript into `packages/db/prisma/generated/` with `importFileExtension = "ts"`, so the client is imported by relative path with a `.ts` extension. **The generated dir must exist** before typecheck/build/dev — run `pnpm db:generate` after a fresh clone or any schema change. `@repo/db`'s `build` task is literally `prisma generate`.
- `src/client.ts` always applies the **Prisma Accelerate extension**. `USE_ACCELERATE=false` (local dev) routes through the `@prisma/adapter-pg` driver against `DATABASE_URL`; otherwise it connects via `accelerateUrl` (`PRISMA_ACCELERATE_URL`). Either way the exported `prisma` type includes Accelerate methods.
- The app imports the client only through `apps/web/lib/db.ts`, which re-exports `prisma` from `@repo/db`. `next.config.ts` lists `@repo/db` and `@repo/transactional` in `transpilePackages` because they ship raw TS.
- Schema models: `User` (with `role` USER/ADMIN, `disabled`, optional `password`), NextAuth's `Account`/`Session`/`VerificationToken`, plus a custom `PasswordResetToken`.

### Auth (NextAuth v4)

- Config lives in `apps/web/lib/auth.ts`. **Credentials provider + bcrypt**, `session.strategy: "jwt"`. A `PrismaAdapter` is wired up, but because sessions are JWT the `Session` table is not used for session storage — the adapter mainly backs user/account records.
- `authorize()` throws specific string codes (`invalid_credentials`, `account_disabled`, `email_not_verified`). The login form maps these codes to user-facing copy in `components/auth/login-form.tsx` (`ERROR_MESSAGES`). When changing one, change both.
- `jwt` / `session` callbacks propagate `id` and `role` onto the token and session. The Session/JWT shapes are augmented in `apps/web/types/next-auth.d.ts`.
- Read the session server-side via `lib/get-session.ts` (`getServerSession(authOptions)`).
- Route protection is `apps/web/middleware.ts` (`withAuth`), matching `/dashboard/:path*`.

### Two ways auth mutations happen

- **Login is client-side**: `login-form.tsx` calls `signIn("credentials", { redirect: false })` then routes to `/dashboard`.
- **Everything else is a Server Action** in `apps/web/lib/actions/auth.actions.ts` (register, resend verification, forgot/reset password). All follow the `(_prev, formData) => Promise<AuthFormState>` signature for `useActionState`, and validate input with Zod schemas in `lib/validations/auth.ts`.
- **Security pattern**: register / forgot-password / resend-verification always return a generic success message regardless of whether the email exists, to avoid leaking which addresses are registered. Preserve this when editing those actions.

### Token flows (`apps/web/lib/tokens.ts`)

`randomUUID` tokens persisted via Prisma. Verification tokens live in `VerificationToken` (24h TTL), password-reset tokens in `PasswordResetToken` (1h TTL). `create*` deletes any existing token for that identifier first; `consume*` checks expiry, performs the side effect (mark `emailVerified` / allow reset), then deletes the token. The verify page (`app/(auth)/verify/page.tsx`) consumes the token in a Server Component during render.

### Email (`@repo/transactional` + `apps/web/lib/email`)

- `lib/email/send-email.ts` is the single send point: real send through Resend when `RESEND_API_KEY` is set, otherwise the rendered HTML is `console.log`'d (dev).
- `lib/email/senders/*` wrap each React Email template (from `@repo/transactional`) and inject a translator from `lib/email/i18n.ts` — a tiny `t(key, values)` helper doing `{placeholder}` substitution. Templates only depend on that `t` signature, so swapping in next-intl/i18next is a drop-in change.

## Conventions

- Path alias `@/*` maps to `apps/web/*` (see `apps/web/tsconfig.json`).
- UI is Tailwind v4 + shadcn/ui (`components.json`); primitives in `apps/web/components/ui`. Toasts use `sonner`.
- The shared Next ESLint config (`packages/eslint-config/next.js`) intentionally disables the `no-unsafe-*` / `no-explicit-any` rules and several `react-hooks` rules.
