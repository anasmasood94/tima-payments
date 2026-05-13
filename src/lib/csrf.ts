import { createHmac, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const CSRF_COOKIE = "csrf_secret";
export const CSRF_SECRET_LENGTH = 32;

export async function generateCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  const secret = cookieStore.get(CSRF_COOKIE)?.value;
  if (!secret) {
    return "";
  }
  const nonce = randomBytes(16).toString("hex");
  const signature = createHmac("sha256", secret).update(nonce).digest("hex");
  return `${nonce}.${signature}`;
}

export async function validateCsrfToken(token: string | null | undefined): Promise<boolean> {
  if (!token || typeof token !== "string") return false;

  const dotIdx = token.indexOf(".");
  if (dotIdx === -1) return false;

  const nonce = token.slice(0, dotIdx);
  const signature = token.slice(dotIdx + 1);
  if (!nonce || !signature) return false;

  const cookieStore = await cookies();
  const secret = cookieStore.get(CSRF_COOKIE)?.value;
  if (!secret) return false;

  const expected = createHmac("sha256", secret).update(nonce).digest("hex");
  return expected === signature;
}
