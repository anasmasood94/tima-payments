import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { InvoicesTable } from "./invoices-table";

export const metadata = { title: "Invoices" };

export default async function AdminInvoicesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const raw = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { order: { include: { user: true } } },
  });

  const invoices = raw.map((inv) => ({
    id: inv.id,
    number: inv.number,
    customerName: inv.order.user.name,
    customerEmail: inv.order.user.email,
    amount: formatUsd(inv.amountCents),
    status: inv.status,
    createdAt: inv.createdAt.toLocaleString(),
  }));

  return <InvoicesTable invoices={invoices} />;
}
