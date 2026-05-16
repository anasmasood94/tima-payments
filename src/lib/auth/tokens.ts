import { createHash, randomBytes } from "crypto";
import { AuthTokenType } from "@prisma/client";
import { prisma } from "@/lib/db";

const TOKEN_BYTES = 32;

export function hashAuthToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

export function generateAuthToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export async function createAuthToken(
  userId: string,
  type: AuthTokenType,
  expiresInMs: number,
): Promise<string> {
  await prisma.authToken.deleteMany({ where: { userId, type } });

  const raw = generateAuthToken();
  const tokenHash = hashAuthToken(raw);
  const expiresAt = new Date(Date.now() + expiresInMs);

  await prisma.authToken.create({
    data: { userId, type, tokenHash, expiresAt },
  });

  return raw;
}

export async function consumeAuthToken(
  raw: string,
  type: AuthTokenType,
): Promise<{ userId: string } | null> {
  const tokenHash = hashAuthToken(raw);
  const now = new Date();

  const record = await prisma.authToken.findFirst({
    where: { tokenHash, type, expiresAt: { gt: now } },
  });

  if (!record) return null;

  await prisma.authToken.delete({ where: { id: record.id } });
  return { userId: record.userId };
}
