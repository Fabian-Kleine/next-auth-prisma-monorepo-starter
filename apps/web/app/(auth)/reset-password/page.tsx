import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <p className="text-center text-sm">
        Missing reset token.{" "}
        <Link href="/forgot-password" className="hover:underline">
          Request a new link
        </Link>
      </p>
    );
  }

  return <ResetPasswordForm token={token} />;
}
