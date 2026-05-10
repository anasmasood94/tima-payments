import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";

export const metadata = { title: "Invoices" };

export default async function AdminInvoicesPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { order: { include: { user: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Invoices</h1>
        <Link href="/admin" className="text-sm text-zinc-600 underline">
          ← Admin
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase text-zinc-600">
            <tr>
              <th className="px-4 py-2">Number</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="px-4 py-2 font-mono text-xs">{inv.number}</td>
                <td className="px-4 py-2">
                  <p className="font-medium text-zinc-900">{inv.order.user.name}</p>
                  <p className="text-xs text-zinc-500">{inv.order.user.email}</p>
                </td>
                <td className="px-4 py-2">{formatUsd(inv.amountCents)}</td>
                <td className="px-4 py-2">{inv.status}</td>
                <td className="px-4 py-2 text-zinc-600">{inv.createdAt.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
