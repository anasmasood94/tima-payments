import { notFound, redirect } from "next/navigation";
import { PaymentGatewayId } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { PayContent } from "./pay-content";

type Props = { params: Promise<{ paymentId: string }> };

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

  return (
    <PayContent
      paymentId={payment.id}
      orderId={payment.invoice.orderId}
      amountCents={payment.amountCents}
      invoiceId={payment.invoiceId}
      gateway={payment.gateway}
      useAirwallexHpp={payment.gateway === PaymentGatewayId.AIRWALLEX}
    />
  );
}
