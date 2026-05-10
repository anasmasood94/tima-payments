import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";

export const metadata = { title: "Payments" };

export default async function AdminPaymentsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    take: 150,
    include: { invoice: { include: { order: { include: { user: true } } } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Payment activity</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Pending, paid, failed, and refunded attempts (provider-hosted checkout; no card data stored).
          </p>
        </div>
        <Link href="/admin" className="text-sm text-zinc-600 underline">
          ← Admin
        </Link>
      </div>

      <div className="overflow-x-auto overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase text-zinc-600">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Gateway</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Provider ref</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {payments.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-2 text-zinc-600">{p.createdAt.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <p className="font-medium text-zinc-900">{p.invoice.order.user.name}</p>
                  <p className="text-xs text-zinc-500">{p.invoice.order.user.email}</p>
                </td>
                <td className="px-4 py-2">{p.gateway}</td>
                <td className="px-4 py-2 font-medium text-zinc-900">{p.status}</td>
                <td className="px-4 py-2">{formatUsd(p.amountCents)}</td>
                <td className="px-4 py-2 font-mono text-xs text-zinc-600">{p.providerPaymentId ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
