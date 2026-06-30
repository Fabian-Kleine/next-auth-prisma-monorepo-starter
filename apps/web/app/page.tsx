import Link from "next/link";
import {
  ArrowRight,
  Database,
  KeyRound,
  LayoutDashboard,
  MailCheck,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { getSession } from "@/lib/get-session";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: ShieldCheck,
    title: "NextAuth credentials",
    description:
      "Email + password auth with bcrypt hashing and 30-day JWT sessions, backed by the Prisma adapter.",
  },
  {
    icon: MailCheck,
    title: "Email verification",
    description:
      "Single-use tokens and a Resend-powered React Email template. Links print to the console in dev.",
  },
  {
    icon: Database,
    title: "Prisma + Postgres",
    description:
      "A shared @repo/db package on Prisma 7 with a pg adapter, ready for local Docker or Accelerate.",
  },
  {
    icon: KeyRound,
    title: "Password reset",
    description:
      "Forgot-password and reset flows with expiring tokens, wired through server actions end to end.",
  },
  {
    icon: LayoutDashboard,
    title: "Protected routes",
    description:
      "A dashboard gated by middleware and server-side session checks — copy the pattern anywhere.",
  },
  {
    icon: Zap,
    title: "Turborepo + shadcn/ui",
    description:
      "pnpm workspaces, Tailwind v4, and shadcn/ui primitives in the new-york style. Just add components.",
  },
];

const steps = [
  { label: "Register", href: "/register", text: "Create an account with email + password." },
  { label: "Verify", href: "/login", text: "Confirm your email from the link we send." },
  { label: "Sign in", href: "/login", text: "Land on a protected dashboard." },
];

export default async function Home() {
  const session = await getSession();

  return (
    <div className="bg-background text-foreground relative flex min-h-svh flex-col overflow-hidden">
      {/* decorative gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[480px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(99,102,241,0.18),transparent_70%)] blur-2xl"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
            <ShieldCheck className="size-4" />
          </span>
          Next Auth Starter
        </Link>
        <nav className="flex items-center gap-2">
          {session?.user ? (
            <Button asChild size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Get started</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6">
        {/* hero */}
        <section className="flex flex-col items-center gap-6 py-20 text-center md:py-28">
          <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
            <Sparkles className="size-3.5" />
            Next.js 16 · Prisma · NextAuth · Resend
          </Badge>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Authentication that&apos;s ready on{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              the first commit
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg text-pretty">
            A full-stack monorepo starter — credentials auth, email verification, password reset,
            and a protected dashboard. Wired up with Prisma, Resend, and shadcn/ui.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {session?.user ? (
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to dashboard <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild size="lg">
                  <Link href="/register">
                    Create your account <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
              </>
            )}
          </div>
          {session?.user ? (
            <p className="text-muted-foreground text-sm">
              Signed in as <span className="text-foreground font-medium">{session.user.email}</span>
            </p>
          ) : null}
        </section>

        {/* features */}
        <section className="grid gap-4 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card group rounded-xl border p-6 shadow-sm transition-colors hover:border-foreground/20"
            >
              <div className="bg-muted text-foreground mb-4 grid size-10 place-items-center rounded-lg">
                <feature.icon className="size-5" />
              </div>
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* flow */}
        <section className="border-t py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight">The full sign-up flow, included</h2>
            <p className="text-muted-foreground mt-2">Three pages, one source of truth.</p>
          </div>
          <ol className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, i) => (
              <li key={step.label} className="bg-card relative rounded-xl border p-6">
                <span className="text-muted-foreground/50 text-sm font-semibold">
                  0{i + 1}
                </span>
                <Link href={step.href} className="mt-1 block text-lg font-semibold hover:underline">
                  {step.label}
                </Link>
                <p className="text-muted-foreground mt-1 text-sm">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="text-muted-foreground mx-auto w-full max-w-6xl px-6 py-8 text-sm">
        Built with Next.js, Prisma, NextAuth &amp; Resend.
      </footer>
    </div>
  );
}
