import { LoginPageContent } from "./login-page-content";

export const metadata = { title: "Sign in" };

type Props = { searchParams: Promise<{ next?: string; error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  return <LoginPageContent next={sp.next} hasError={!!sp.error} />;
}
