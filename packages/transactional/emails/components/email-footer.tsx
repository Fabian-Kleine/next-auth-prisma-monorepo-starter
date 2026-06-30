import { Section, Text } from "@react-email/components";

export default function EmailFooter() {
  return (
    <Section className="text-center">
      <table className="w-full">
        <tr className="w-full">
          <td align="center">
            <Text className="my-[8px] font-semibold text-[16px] text-gray-900 leading-[24px]">
              Next Auth Starter
            </Text>
          </td>
        </tr>
        <tr>
          <td align="center">
            <Text className="mt-[4px] mb-0 font-semibold text-[14px] text-gray-500 leading-[24px]">
              You are receiving this email because you have an account with Next Auth Starter.
            </Text>
          </td>
        </tr>
      </table>
    </Section>
  );
}
