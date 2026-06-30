import { redirect } from "next/navigation";
import { getSession } from "@/lib/get-session";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <SignOutButton />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>You&apos;re signed in</CardTitle>
          <CardDescription>This route is protected by middleware.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="text-muted-foreground">Name:</span> {session.user.name ?? "—"}
          </p>
          <p>
            <span className="text-muted-foreground">Email:</span> {session.user.email}
          </p>
          <p>
            <span className="text-muted-foreground">Role:</span> {session.user.role ?? "USER"}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
