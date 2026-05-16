import { AuthTokenType, OrderStatus } from "@prisma/client";
import { createAuthToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db";
import { formatUsd } from "@/lib/format";
import { appBaseUrl, sendEmail } from "./client";

const EMAIL_VERIFY_TTL = 24 * 60 * 60 * 1000;
const PASSWORD_RESET_TTL = 60 * 60 * 1000;

function emailShell(title: string, body: string): { text: string; html: string } {
  const text = `${title}\n\n${body}\n\n— B612 Tima Inc.`;
  const html = `<motion style="font-family:Helvetica,Arial,sans-serif;max-width:560px;color:#111"><h2 style="margin:0 0 16px">${title}</h2><div style="line-height:1.5">${body.replace(/\n/g, "<br>")}</div><p style="margin-top:24px;font-size:12px;color:#666">B612 Tima Inc.</p></motion>`
    .replaceAll("<motion", "<div")
    .replaceAll("</motion>", "</motion>");
  return { text, html: html.replaceAll("</motion>", "</div>") };
}

export async function sendEmailVerification(userId: string): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (user.emailVerifiedAt) return;

  const raw = await createAuthToken(userId, AuthTokenType.EMAIL_VERIFICATION, EMAIL_VERIFY_TTL);
  const link = `${appBaseUrl()}/api/auth/verify-email?token=${encodeURIComponent(raw)}`;

  const body = `Hi ${user.name},\n\nPlease verify your email address by opening this link (valid for 24 hours):\n\n${link}\n\nIf you did not create an account, you can ignore this email.`;
  const { text, html } = emailShell("Verify your email", body);

  await sendEmail({
    to: user.email,
    subject: "Verify your B612 Tima account",
    text,
    html,
  });
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const raw = await createAuthToken(user.id, AuthTokenType.PASSWORD_RESET, PASSWORD_RESET_TTL);
  const link = `${appBaseUrl()}/reset-password?token=${encodeURIComponent(raw)}`;

  const body = `Hi ${user.name},\n\nWe received a request to reset your password. Open this link to choose a new password (valid for 1 hour):\n\n${link}\n\nIf you did not request this, you can ignore this email.`;
  const { text, html } = emailShell("Reset your password", body);

  await sendEmail({
    to: user.email,
    subject: "Reset your B612 Tima password",
    text,
    html,
  });
}

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      lines: { include: { product: true } },
    },
  });

  if (!order) return;

  const totalCents = order.lines.reduce((s, l) => s + l.quantity * l.unitPriceCents, 0);
  const lineItems = order.lines
    .map(
      (l) =>
        `  • ${l.product.name} (${l.product.sku}) × ${l.quantity} — ${formatUsd(l.quantity * l.unitPriceCents)}`,
    )
    .join("\n");

  const isQuote = order.status === OrderStatus.QUOTE_REQUESTED;
  const title = isQuote ? "Quote request received" : "Order received";
  const intro = isQuote
    ? "We received your quote request and will follow up shortly."
    : "Thank you for your order. Complete payment from your account if you have not already.";

  const portalLink = `${appBaseUrl()}/portal/orders/${order.id}`;
  const body = `Hi ${order.user.name},\n\n${intro}\n\nOrder ID: ${order.id}\nStatus: ${order.status}\nEstimated total: ${formatUsd(totalCents)}\n\nItems:\n${lineItems}\n\nView details: ${portalLink}`;
  const { text, html } = emailShell(title, body);

  await sendEmail({
    to: order.user.email,
    subject: isQuote ? `Quote request #${order.id.slice(-8)}` : `Order confirmation #${order.id.slice(-8)}`,
    text,
    html,
  });
}
