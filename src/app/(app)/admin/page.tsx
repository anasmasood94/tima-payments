import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const metadata = { title: "Admin" };

export default async function AdminHomePage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const [orders, products, invoices, customers, payments] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.invoice.count(),
    prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
    prisma.payment.count(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Admin dashboard</h1>
        <p className="mt-2 text-sm text-body">
          Manage catalog, customers, orders, invoices, and payments.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard href="/admin/orders" label="Orders" value={orders} />
        <StatCard href="/admin/products" label="Products" value={products} />
        <StatCard href="/admin/invoices" label="Invoices" value={invoices} />
        <StatCard href="/admin/customers" label="Customers" value={customers} />
        <StatCard href="/admin/payments" label="Payments" value={payments} />
      </div>
    </div>
  );
}

function StatCard({ href, label, value }: { href: string; label: string; value: number }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-line bg-white p-5 shadow-sm transition hover:border-line"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-ink">{value}</p>
    </Link>
  );
}
