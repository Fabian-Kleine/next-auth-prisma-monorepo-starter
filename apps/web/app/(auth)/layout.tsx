import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-muted/40 flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <span className="bg-primary text-primary-foreground grid size-8 place-items-center rounded-lg">
          <ShieldCheck className="size-4" />
        </span>
        Next Auth Starter
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
