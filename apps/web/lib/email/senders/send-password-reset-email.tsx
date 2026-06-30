import PasswordResetEmail from "@repo/transactional/emails/templates/password-reset-email";
import { sendEmail } from "../send-email";
import { createTranslator } from "../i18n";

const t = createTranslator({
  subject: "Reset your password",
  greeting: "Hello {name},",
  body: "We received a request to reset your password. Click the button below to choose a new one.",
  buttonText: "Reset Password",
  fallbackText: "If the button doesn't work, copy and paste this link into your browser:",
  expiryText: "This link will expire in 1 hour.",
  footerText: "If you didn't request this, please ignore this email.",
  ignoreText: "If you didn't request a password reset, you can safely ignore this email.",
});

export async function sendPasswordResetEmail(params: {
  email: string;
  name: string;
  resetUrl: string;
}) {
  return sendEmail(
    params.email,
    t("subject"),
    <PasswordResetEmail name={params.name} resetUrl={params.resetUrl} t={t} />,
  );
}
