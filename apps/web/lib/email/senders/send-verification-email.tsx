import EmailVerificationEmail from "@repo/transactional/emails/templates/email-verification-email";
import { sendEmail } from "../send-email";
import { createTranslator } from "../i18n";

const t = createTranslator({
  subject: "Verify your email",
  greeting: "Hello {name},",
  body: "Thanks for signing up. Please confirm your email address by clicking the button below.",
  buttonText: "Verify Email",
  fallbackText: "If the button doesn't work, copy and paste this link into your browser:",
  expiryText: "This link will expire in 24 hours.",
  footerText: "If you didn't create an account, you can safely ignore this email.",
});

export async function sendVerificationEmail(params: {
  email: string;
  name: string;
  verificationUrl: string;
}) {
  return sendEmail(
    params.email,
    t("subject"),
    <EmailVerificationEmail name={params.name} verificationUrl={params.verificationUrl} t={t} />,
  );
}
