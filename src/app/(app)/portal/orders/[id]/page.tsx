import { notFound, redirect } from "next/navigation";
import { OrderStatus, PaymentGatewayId, PaymentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { syncAirwallexPaymentsForOrderAction } from "@/actions/payments";
import { OrderDetailContent } from "./order-detail-content";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ paid?: string; checkout?: string }>;
};

function pendingHostedPayment(order: {
  status: OrderStatus;
  invoices: {
    payments: {
      status: PaymentStatus;
      hostedCheckoutUrl: string | null;
      gateway: PaymentGatewayId;
      providerPaymentId: string | null;
      amountCents: number;
    }[];
  }[];
}) {
  return order.invoices
    .flatMap((inv) => inv.payments)
    .find((p) => p.status === PaymentStatus.PENDING && p.hostedCheckoutUrl);
}

function shouldReconcileAirwallexOnLoad(order: {
  status: OrderStatus;
  invoices: { payments: { status: PaymentStatus; gateway: PaymentGatewayId; providerPaymentId: string | null }[] }[];
}) {
  if (order.status !== OrderStatus.PLACED) return false;
  return order.invoices
    .flatMap((inv) => inv.payments)
    .some(
      (p) =>
        (p.status === PaymentStatus.PENDING || p.status === PaymentStatus.PROCESSING) &&
        p.gateway === PaymentGatewayId.AIRWALLEX &&
        Boolean(p.providerPaymentId) &&
        !p.providerPaymentId!.startsWith("awx_stub_"),
    );
}

export default async function PortalOrderDetailPage({ params, searchParams }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { id } = await params;
  const sp = await searchParams;

  let order = await prisma.order.findFirst({
    where: { id, userId: session.sub },
    include: {
      lines: { include: { product: true } },
      invoices: { include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } } },
    },
  });

  if (!order) {
    notFound();
  }

  if (shouldReconcileAirwallexOnLoad(order)) {
    await syncAirwallexPaymentsForOrderAction(id);
    order = await prisma.order.findFirst({
      where: { id, userId: session.sub },
      include: {
        lines: { include: { product: true } },
        invoices: { include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } } },
      },
    });
    if (!order) {
      notFound();
    }
  }

  if (sp.checkout === "complete" && order.status === OrderStatus.PAID) {
    redirect(`/portal/orders/${id}?paid=1`);
  }

  const subtotal = order.lines.reduce((s, l) => s + l.quantity * l.unitPriceCents, 0);
  const pp = pendingHostedPayment(order);
  const checkoutReturned = sp.checkout === "complete" || sp.checkout === "cancelled";

  const pollAirwallex =
    checkoutReturned &&
    order.status === OrderStatus.PLACED &&
    pp != null &&
    pp.gateway === PaymentGatewayId.AIRWALLEX &&
    pp.providerPaymentId != null &&
    !pp.providerPaymentId.startsWith("awx_stub_");

  const hasAnyHostedCheckoutUrl = order.invoices
    .flatMap((inv) => inv.payments)
    .some((p) => Boolean(p.hostedCheckoutUrl));

  return (
    <OrderDetailContent
      orderId={order.id}
      orderStatus={order.status}
      createdAt={new Date(order.createdAt).toLocaleString()}
      notes={order.notes}
      lines={order.lines.map((l) => ({
        id: l.id,
        productName: l.product.name,
        quantity: l.quantity,
        unitPriceCents: l.unitPriceCents,
      }))}
      subtotalCents={subtotal}
      invoices={order.invoices.map((inv) => ({
        id: inv.id,
        number: inv.number,
        amountCents: inv.amountCents,
        status: inv.status,
      }))}
      pendingPayment={
        pp
          ? { hostedCheckoutUrl: pp.hostedCheckoutUrl!, amountCents: pp.amountCents, gateway: pp.gateway }
          : null
      }
      hasAnyHostedCheckoutUrl={hasAnyHostedCheckoutUrl}
      pollAirwallex={pollAirwallex}
      paid={!!sp.paid}
      checkoutComplete={sp.checkout === "complete"}
      checkoutCancelled={sp.checkout === "cancelled"}
    />
  );
}
