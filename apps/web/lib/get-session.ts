import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/** Read the current session in Server Components, Route Handlers and Server Actions. */
export function getSession() {
  return getServerSession(authOptions);
}
