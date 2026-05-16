import { ResetPasswordPageContent } from "./reset-password-content";

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;
  return <ResetPasswordPageContent token={token ?? ""} />;
}
