import * as React from "react";
import DefaultEmailLayout from "../components/default-email-layout";
import EmailButton from "../components/email-button";
import { Heading, Text } from "@react-email/components";

export interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}

export default function PasswordResetEmail({ name, resetUrl, t }: PasswordResetEmailProps) {
  return (
    <DefaultEmailLayout
      title={t("subject")}
      headerClassName="bg-[#ff6467] text-white"
      footerText={t("expiryText")}
      subFooterText={t("footerText")}
    >
      <Heading as="h2" className="mt-0 text-[20px] font-bold text-slate-600">
        {t("greeting", { name })}
      </Heading>
      <Text className="mb-[25px] text-[16px]">{t("body")}</Text>
      <EmailButton text={t("buttonText")} url={resetUrl} className="bg-[#ff6467] text-white" />
      <Text className="mt-[25px] text-[14px] text-slate-500">{t("fallbackText")}</Text>
      <Text className="break-all rounded-md bg-slate-200 p-2.5 text-[14px]">{resetUrl}</Text>
      <Text className="mt-[25px] text-[16px] text-slate-500">{t("ignoreText")}</Text>
    </DefaultEmailLayout>
  );
}

// Mock translation function for preview
const mockT = (key: string, values?: Record<string, string | number | Date>): string => {
  const translations: Record<string, string> = {
    subject: "Reset Your Password",
    body: "We received a request to reset your password. Click the button below to create a new password.",
    buttonText: "Reset Password",
    expiryText: "This link will expire in 1 hour.",
    footerText: "If you didn't request this, please ignore this email.",
    fallbackText: "If the button doesn't work, copy and paste this link into your browser:",
    ignoreText: "If you didn't request a password reset, you can safely ignore this email.",
    greeting: `Hello ${values?.name || "User"},`,
  };
  return translations[key] || key;
};

PasswordResetEmail.PreviewProps = {
  name: "John Doe",
  resetUrl: "https://example.com/reset-password?token=xyz789",
  t: mockT,
} satisfies PasswordResetEmailProps;
