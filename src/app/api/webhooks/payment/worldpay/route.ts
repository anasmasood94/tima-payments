import { PaymentGatewayId } from "@prisma/client";
import { handleProviderWebhook } from "@/lib/payments/handle-webhook";

export async function POST(req: Request) {
  return handleProviderWebhook(PaymentGatewayId.WORLDPAY, req);
}
