import { NextResponse } from "next/server";
import { AuthTokenType } from "@prisma/client";
import { consumeAuthToken } from "@/lib/auth/tokens";
import { prisma } from "@/lib/db";
import { appBaseUrl } from "@/lib/email/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");
  const base = appBaseUrl();

  if (!token) {
    return NextResponse.redirect(`${base}/login?verify=invalid`);
  }

  const consumed = await consumeAuthToken(token, AuthTokenType.EMAIL_VERIFICATION);
  if (!consumed) {
    return NextResponse.redirect(`${base}/login?verify=invalid`);
  }

  await prisma.user.update({
    where: { id: consumed.userId },
    data: { emailVerifiedAt: new Date() },
  });

  return NextResponse.redirect(`${base}/login?verified=1`);
}
