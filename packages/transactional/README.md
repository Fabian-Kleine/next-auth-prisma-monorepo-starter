# `@repo/transactional`

React Email templates for the app, rendered with Resend.

```bash
pnpm --filter @repo/transactional dev   # preview server
```

Render a template to HTML:

```ts
import { renderEmail } from "@repo/transactional/lib/render-email";
import EmailVerificationEmail from "@repo/transactional/emails/templates/email-verification-email";
```
