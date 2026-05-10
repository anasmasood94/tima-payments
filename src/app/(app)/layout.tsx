import { SiteNav } from "@/components/SiteNav";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl px-6 py-10">{children}</main>
    </>
  );
}
