import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
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
    status: o.status,
    userName: o.user.name,
    userEmail: o.user.email,
    lineCount: o.lines.length,
  }));

  return <OrdersTable orders={orders} />;
}
