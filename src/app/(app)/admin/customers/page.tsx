import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { CustomersTable } from "./customers-table";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const raw = await prisma.user.findMany({
    where: { role: UserRole.CUSTOMER },
    orderBy: { createdAt: "desc" },
  });

  const customers = raw.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    companyName: c.companyName ?? "—",
    createdAt: c.createdAt.toLocaleDateString(),
  }));

  return <CustomersTable customers={customers} />;
}
