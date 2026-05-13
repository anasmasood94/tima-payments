import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { orderStatusLabel } from "@/lib/order-status";
import { OrdersTable } from "./orders-table";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const raw = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, lines: true },
  });

  const orders = raw.map((o) => ({
    id: o.id,
    createdAt: o.createdAt.toLocaleString(),
    status: orderStatusLabel(o.status),
    userName: o.user.name,
    userEmail: o.user.email,
    lineCount: o.lines.length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-ink">Orders</h1>
      </div>
      <OrdersTable orders={orders} />
    </div>
  );
}
