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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Payment activity</h1>
          <p className="mt-1 text-sm text-body">
            Pending, paid, failed, and refunded attempts (provider-hosted checkout; no card data stored).
          </p>
        </div>
      </div>
      <PaymentsTable payments={payments} />
    </div>
  );
}
