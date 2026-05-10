import Link from "next/link";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  if (session.role !== "ADMIN") {
    redirect("/portal");
  }

  const customers = await prisma.user.findMany({
    where: { role: UserRole.CUSTOMER },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Customer accounts</h1>
          <p className="mt-1 text-sm text-zinc-600">Read-only directory of registered customers.</p>
        </div>
        <Link href="/admin" className="text-sm text-zinc-600 underline">
          ← Admin
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 text-xs uppercase text-zinc-600">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Registered</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-2 font-medium text-zinc-900">{c.name}</td>
                <td className="px-4 py-2 text-zinc-700">{c.email}</td>
                <td className="px-4 py-2 text-zinc-600">{c.companyName ?? "—"}</td>
                <td className="px-4 py-2 text-zinc-600">{c.createdAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
