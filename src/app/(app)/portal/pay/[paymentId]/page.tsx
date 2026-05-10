import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PaymentGatewayId } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { formatUsd } from "@/lib/format";
import { AirwallexHppBridge } from "./airwallex-hpp-bridge";
import { MockPayForm } from "./mock-pay-form";

type Props = { params: Promise<{ paymentId: string }> };

/** Any Airwallex payment uses the Airwallex bridge (HPP or a clear error)—never the generic MOCK simulator UI. */
function isAirwallexGatewayPayment(payment: { gateway: PaymentGatewayId }) {
  return payment.gateway === PaymentGatewayId.AIRWALLEX;
}

export default async function HostedPaySimulationPage({ params }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { paymentId } = await params;

  const payment = await prisma.payment.findFirst({
    where: { id: paymentId, invoice: { order: { userId: session.sub } } },
    include: { invoice: { select: { id: true, orderId: true } } },
  });

  if (!payment) {
    notFound();
  }

  if (payment.status === "SUCCEEDED") {
    redirect(`/portal/orders/${payment.invoice.orderId}?paid=1`);
  }

  const useAirwallexHpp = isAirwallexGatewayPayment(payment);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link href={`/portal/orders/${payment.invoice.orderId}`} className="text-sm text-body underline">
        ← Back to order
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-ink">Hosted checkout</h1>
        {useAirwallexHpp ? (
          <p className="mt-2 text-sm text-body">
            You will complete card entry on Airwallex&apos;s Hosted Payment Page. We only store your payment intent id and
            status—never card numbers.
          </p>
        ) : (
          <p className="mt-2 text-sm text-body">
            In production this URL is served by your payment provider (Airwallex, Adyen, etc.). Locally we simulate the
            hosted step so you can test order lifecycle without PSP credentials.
          </p>
        )}
      </div>
      <div className="rounded-lg border border-line bg-white p-4 text-sm">
        <p className="text-ink">
          Pay <span className="font-semibold">{formatUsd(payment.amountCents)}</span>{" "}
          <span className="font-mono text-xs text-muted">({payment.invoiceId})</span>
        </p>
        <p className="mt-2 text-xs text-muted">Gateway: {payment.gateway}</p>
      </div>
      {useAirwallexHpp ? <AirwallexHppBridge paymentId={payment.id} /> : <MockPayForm paymentId={payment.id} />}
    </div>
  );
}
