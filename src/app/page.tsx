import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

export default async function RootPage() {
  const session = await getSession();
  if (session?.role === "ADMIN") {
    redirect("/admin");
  }
  if (session?.role === "CUSTOMER") {
    redirect("/portal");
  }
  redirect("/login");
}
