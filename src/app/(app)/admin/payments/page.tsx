import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { PaymentsTable } from "./payments-table";

export const metadata = { title: "Payments" };

export default async function AdminPaymentsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const raw = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { invoice: { include: { order: { include: { user: true } } } } },
  });

  const payments = raw.map((p) => ({
    id: p.id,
    createdAt: p.createdAt.toLocaleString(),
    customerName: p.invoice.order.user.name,
    customerEmail: p.invoice.order.user.email,
    gateway: p.gateway,
    status: p.status,
    amount: formatUsd(p.amountCents),
    providerRef: p.providerPaymentId ?? "—",
  }));

  return <PaymentsTable payments={payments} />;
}
