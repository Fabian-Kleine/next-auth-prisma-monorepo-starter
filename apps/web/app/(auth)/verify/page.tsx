import Link from "next/link";
import { consumeVerificationToken } from "@/lib/tokens";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const email = token ? await consumeVerificationToken(token) : null;
  const verified = Boolean(email);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{verified ? "Email verified" : "Verification failed"}</CardTitle>
        <CardDescription>
          {verified
            ? "Your email address has been confirmed. You can now sign in."
            : "This verification link is invalid or has expired."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {verified ? (
          <p className="text-sm">
            Signed up as <span className="font-medium">{email}</span>.
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Request a new verification email from the sign-in page.
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-4">
        <Button asChild className="w-full">
          <Link href="/login">Go to sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
