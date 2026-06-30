import * as React from "react";
import DefaultEmailLayout from "../components/default-email-layout";
import EmailButton from "../components/email-button";
import { Heading, Text } from "@react-email/components";

export interface EmailVerificationEmailProps {
  name: string;
  verificationUrl: string;
  t: (key: string, values?: Record<string, string | number | Date>) => string;
}

export default function EmailVerificationEmail({ name, verificationUrl, t }: EmailVerificationEmailProps) {
  return (
    <DefaultEmailLayout
      title={t("subject")}
      headerClassName="bg-[#006fee] text-white"
      footerText={t("expiryText")}
      subFooterText={t("footerText")}
    >
      <Heading as="h2" className="mt-0 text-[20px] font-bold text-slate-600">
        {t("greeting", { name })}
      </Heading>
      <Text className="mb-[25px] text-[16px]">{t("body")}</Text>
      <EmailButton text={t("buttonText")} url={verificationUrl} />
      <Text className="mt-[25px] text-[14px] text-slate-500">{t("fallbackText")}</Text>
      <Text className="break-all rounded-md bg-slate-200 p-2.5 text-[14px]">{verificationUrl}</Text>
    </DefaultEmailLayout>
  );
}

// Mock translation function for preview
const mockT = (key: string, values?: Record<string, string | number | Date>): string => {
  const translations: Record<string, string> = {
    subject: "Verify Your Email",
    body: "Please verify your email address by clicking the button below.",
    buttonText: "Verify Email",
    expiryText: "This link will expire in 24 hours.",
    footerText: "If you didn't create an account, you can safely ignore this email.",
    fallbackText: "If the button doesn't work, copy and paste this link into your browser:",
    greeting: `Hello ${values?.name || "User"},`,
  };
  return translations[key] || key;
};

EmailVerificationEmail.PreviewProps = {
  name: "John Doe",
  verificationUrl: "https://example.com/verify?token=abc123",
  t: mockT,
} satisfies EmailVerificationEmailProps;
