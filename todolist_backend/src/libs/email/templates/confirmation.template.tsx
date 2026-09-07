import { Body, Heading, Link, Text } from '@react-email/components';
import { Html } from '@react-email/html';

interface ConfirmationTemplateProps {
  domain: string;
  token: string;
}

export function ConfirmationTemplate({
  domain,
  token,
}: ConfirmationTemplateProps) {
  const confirmLink = `${domain}/c-auth/mail-verification?token=${token}`;

  return (
    <Html>
      <Body>
        <Heading>Підтвердження пошти</Heading>
        <Text>
          Привіт! Щоб підтвердити свій адрес електронної пошти, будь-ласка,
          перейди по наступному посиланню
        </Text>
        <Link href={confirmLink}>Підтвердити пошту</Link>
      </Body>
    </Html>
  );
}
