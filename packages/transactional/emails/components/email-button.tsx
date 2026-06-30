import * as React from "react";
import { Button, Section } from "@react-email/components";

export interface EmailButtonProps {
  text: string;
  url: string;
  className?: string;
  containerClassName?: string;
  css?: React.CSSProperties;
}

const baseContainerClassName = "my-[30px] text-center";
const baseButtonClassName =
  "inline-block rounded-[25px] bg-[#006fee] px-[30px] py-[12px] text-[16px] font-bold text-white no-underline";

export default function EmailButton({ text, url, className, containerClassName, css }: EmailButtonProps) {
  return (
    <Section className={`${baseContainerClassName}${containerClassName ? ` ${containerClassName}` : ""}`}>
      <Button href={url} className={`${baseButtonClassName}${className ? ` ${className}` : ""}`} style={css}>
        {text}
      </Button>
    </Section>
  );
}
