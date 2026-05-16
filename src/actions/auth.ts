"use server";

import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { clearSessionCookie, createSessionToken, getSession, setSessionCookie } from "@/lib/auth/session";
import { sendEmailVerification } from "@/lib/email/notifications";
import { rateLimit } from "@/lib/rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120),
  companyName: z.string().max(200).optional().or(z.literal("")),
});

export async function registerAction(_prev: unknown, formData: FormData) {
  const ip = await getClientIp();
  const rl = rateLimit("register", ip, 3, ONE_HOUR);
  if (!rl.allowed) {
    return { error: "Too many registration attempts. Please try again later." };
  }

  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
    companyName: formData.get("companyName"),
  });

  if (!parsed.success) {
    return { error: "Please check all fields. Password must be at least 8 characters." };
  }

  const { email, password, name, companyName } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "An account with this email already exists." };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      companyName: companyName || null,
      role: UserRole.CUSTOMER,
    },
  });

  try {
    await sendEmailVerification(user.id);
  } catch (e) {
    console.error("[auth] Failed to send verification email:", e);
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  await clearSessionCookie();
  await setSessionCookie(token);
  redirect("/catalog?verify=sent");
}

export async function resendVerificationAction() {
  const session = await getSession();
  if (!session) {
    return { error: "Please sign in first." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.sub } });
  if (!user) {
    return { error: "Account not found." };
  }
  if (user.emailVerifiedAt) {
    return { success: "Your email is already verified." };
  }

  const ip = await getClientIp();
  const rl = rateLimit("resend-verify", ip, 3, ONE_HOUR);
  if (!rl.allowed) {
    return { error: "Too many requests. Please try again later." };
  }

  try {
    await sendEmailVerification(user.id);
  } catch (e) {
    console.error("[auth] Failed to resend verification email:", e);
    return { error: "Could not send email. Please try again later." };
  }

  return { success: "Verification email sent. Check your inbox." };
}

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export async function loginAction(_prev: unknown, formData: FormData) {
  const ip = await getClientIp();
  const rl = rateLimit("login", ip, 5, FIFTEEN_MINUTES);
  if (!rl.allowed) {
    return { error: "Too many login attempts. Please try again in a few minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid email or password." };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) {
    return { error: "Invalid email or password." };
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { error: "Account is temporarily locked. Please try again later." };
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    const attempts = user.failedLoginAttempts + 1;
    const lockout = attempts >= 5 ? new Date(Date.now() + FIFTEEN_MINUTES) : null;
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: attempts, lockedUntil: lockout },
    });
    return { error: "Invalid email or password." };
  }

  if (user.failedLoginAttempts > 0) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  await clearSessionCookie();
  await setSessionCookie(token);

  const next = formData.get("next");
  if (typeof next === "string" && next.startsWith("/") && !next.startsWith("//")) {
    redirect(next);
  }

  redirect(user.role === "ADMIN" ? "/admin" : "/catalog");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
