# `@repo/db`

Prisma schema and client for the monorepo.

```ts
import { prisma } from "@repo/db";
import { Prisma } from "@repo/db";
```

## Local setup

```bash
cp .env.example .env
pnpm docker:up        # start local Postgres (requires Docker)
pnpm prisma:generate  # generate the client
pnpm prisma:db-push   # push the schema
pnpm db:seed          # seed sample data
```

The generated client is emitted to `prisma/generated/` (git-ignored).
