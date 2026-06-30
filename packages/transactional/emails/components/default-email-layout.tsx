import * as React from "react";
import { Body, Container, Head, Heading, Html, Preview, Section, Tailwind, Text } from "@react-email/components";
import EmailFooter from "./email-footer";

export interface DefaultEmailLayoutProps {
  title?: string;
  previewText?: string;
  headerClassName?: string;
  headerBgCss?: React.CSSProperties;
  children: React.ReactNode;
  footerText?: string;
  subFooterText?: string;
}

export default function DefaultEmailLayout({
  title,
  previewText,
  headerClassName,
  headerBgCss,
  children,
  footerText,
  subFooterText,
}: DefaultEmailLayoutProps) {
  return (
    <Html>
      <Head />
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Tailwind>
        <Body className="m-0 bg-white p-0 font-sans leading-[1.6] text-slate-800">
          <Container className="mx-auto max-w-[600px] p-5">
            <Section
              className={`rounded-t-[10px] p-[30px] text-center ${headerClassName ?? ""}`}
              style={headerBgCss}
            >
              <Heading className="m-0 text-[28px]">{title}</Heading>
            </Section>

            <Section className="rounded-b-[10px] border border-slate-200 bg-slate-50 p-[30px]">
              {children}
              {footerText ? <Text className="mt-[25px] text-[14px] text-slate-500">{footerText}</Text> : null}
            </Section>

            {subFooterText ? (
              <Section className="mt-5 text-center">
                <Text className="m-0 text-[12px] text-slate-500">{subFooterText}</Text>
              </Section>
            ) : null}
            <EmailFooter />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
