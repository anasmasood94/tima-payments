import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { orderStatusLabel } from "@/lib/order-status";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: true, lines: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-zinc-900">Orders</h1>
        <Link href="/admin" className="text-sm text-zinc-600 underline">
          ← Admin
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase text-zinc-600">
            <tr>
              <th className="px-4 py-2">When</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Lines</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-2 text-zinc-600">{o.createdAt.toLocaleString()}</td>
                <td className="px-4 py-2">
                  <p className="font-medium text-zinc-900">{o.user.name}</p>
                  <p className="text-xs text-zinc-500">{o.user.email}</p>
                </td>
                <td className="px-4 py-2">{orderStatusLabel(o.status)}</td>
                <td className="px-4 py-2">{o.lines.length}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/admin/orders/${o.id}`} className="font-medium text-zinc-900 underline">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
