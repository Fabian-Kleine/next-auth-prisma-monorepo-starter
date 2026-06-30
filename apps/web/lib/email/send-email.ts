import { Resend } from "resend";
import type { ReactElement } from "react";
import { renderEmail } from "@repo/transactional/lib/render-email";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

/**
 * Send a React Email template through Resend. When RESEND_API_KEY is not set
 * (typical in local dev), the rendered HTML is logged to the console instead.
 */
export async function sendEmail(to: string, subject: string, react: ReactElement) {
  const from = process.env.EMAIL_FROM || "Next Auth Starter <onboarding@resend.dev>";

  if (!resend) {
    const html = await renderEmail(react);
    console.log(
      `\n──────── email (dev) ────────\nFrom: ${from}\nTo: ${to}\nSubject: ${subject}\n\n${html}\n─────────────────────────────\n`,
    );
    return { id: "dev-email" };
  }

  const { data, error } = await resend.emails.send({ from, to, subject, react });
  if (error) {
    console.error("Failed to send email:", error);
    throw new Error(error.message);
  }
  return data;
}
