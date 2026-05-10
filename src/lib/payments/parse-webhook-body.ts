import { PaymentGatewayId } from "@prisma/client";

/** Extract simple `tag>value</` pairs (handles namespaces in opening tag). */
export function flattenXmlTags(raw: string): Record<string, string> {
  const out: Record<string, string> = {};
  const re = /<([\w:-]+)[^>]*>([^<]*)<\//g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const local = m[1].split(":").pop() ?? m[1];
    const val = m[2].trim();
    if (val) {
      out[local] = val;
    }
  }
  return out;
}

export function parseWebhookBody(raw: string, gateway: PaymentGatewayId): unknown {
  const trimmed = raw.trim();
  if (!trimmed) return {};

  if (trimmed.startsWith("<")) {
    if (gateway === PaymentGatewayId.CYBERSOURCE || gateway === PaymentGatewayId.WORLDPAY) {
      const flat = flattenXmlTags(trimmed);
      return { ...flat, _source: "xml" as const };
    }
    return { ...flattenXmlTags(trimmed), _source: "xml" as const };
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}
