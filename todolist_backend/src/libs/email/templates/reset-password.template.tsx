import {
  Body,
  Heading,
  Html,
  Link,
  Tailwind,
  Text,
} from '@react-email/components';

interface ResetPasswordTemplateProps {
  domain: string;
  token: string;
}

export function ResetPasswordTemplate({
  domain,
  token,
}: ResetPasswordTemplateProps) {
  const resetLink = `${domain}/c-auth/new-password?token=${token}`;

  return (
    <Tailwind
      children={
        <Html>
          <Body className="text-black">
            <Heading>Відновлення паролю</Heading>
            <Text>
              Вітаємо! Ви надіслали запит на відновлення паролю. Будь ласка,
              перейдіть за посиланням нижче, щоб створити новий пароль для
              вашого акаунта.
            </Text>
            <Link href={resetLink}>Створити новий пароль</Link>
            <Text>
              Якщо ви не надсилали запит на відновлення паролю, просто
              проігноруйте цей лист.
            </Text>
          </Body>
        </Html>
      }
    />
  );
}
