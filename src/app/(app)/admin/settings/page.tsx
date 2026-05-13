import { redirect } from "next/navigation";

// Settings page disabled — redirect to admin dashboard.
// Uncomment the block below to re-enable the gateway selector.

export default function AdminSettingsPage() {
  redirect("/admin");
}

// import { getSession } from "@/lib/auth/session";
// import { getActiveGatewayId } from "@/actions/settings";
// import { GatewaySelector } from "./gateway-selector";
//
// export const metadata = { title: "Payment Settings" };
//
// export default async function AdminSettingsPage() {
//   const session = await getSession();
//   if (!session) redirect("/login");
//   if (session.role !== "ADMIN") redirect("/portal");
//
//   const activeGateway = await getActiveGatewayId();
//
//   return <GatewaySelector activeGateway={activeGateway} />;
// }
