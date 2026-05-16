"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { AuthTokenType } from "@prisma/client";
import { consumeAuthToken } from "@/lib/auth/tokens";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email/notifications";
import { rateLimit } from "@/lib/rate-limit";

const ONE_HOUR = 60 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

const forgotSchema = z.object({
  email: z.email(),
});

export async function forgotPasswordAction(_prev: unknown, formData: FormData) {
  const ip = await getClientIp();
  const rl = rateLimit("forgot-password", ip, 5, ONE_HOUR);
  if (!rl.allowed) {
    return { error: "Too many requests. Please try again later." };
  }

  const parsed = forgotSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return { error: "Please enter a valid email address." };
  }

  await sendPasswordResetEmail(parsed.data.email.trim().toLowerCase());

  return {
    success: "If an account exists for that email, we sent password reset instructions.",
  };
}

const resetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

export async function resetPasswordAction(_prev: unknown, formData: FormData) {
  const ip = await getClientIp();
  const rl = rateLimit("reset-password", ip, 10, ONE_HOUR);
  if (!rl.allowed) {
    return { error: "Too many requests. Please try again later." };
  }

  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid request. Password must be at least 8 characters." };
  }

  const consumed = await consumeAuthToken(parsed.data.token, AuthTokenType.PASSWORD_RESET);
  if (!consumed) {
    return { error: "This reset link is invalid or has expired. Please request a new one." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.user.update({
    where: { id: consumed.userId },
    data: { passwordHash, failedLoginAttempts: 0, lockedUntil: null },
  });

  redirect("/login?reset=1");
}
