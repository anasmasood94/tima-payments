import { getSession } from "@/lib/auth/session";
import { NavContent } from "./NavContent";

export async function SiteNav() {
  const session = await getSession();
  return (
    <NavContent
      session={session ? { role: session.role } : null}
    />
  );
}
