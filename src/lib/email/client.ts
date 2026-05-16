import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

let transporter: Transporter | null = null;

function getFromAddress(): string {
  return process.env.EMAIL_FROM ?? "noreply@localhost";
}

function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const from = getFromAddress();

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] SMTP not configured; skipped:", input.subject, "→", input.to);
      return;
    }
    console.info("[email] (dev — SMTP not configured)");
    console.info("  To:", input.to);
    console.info("  Subject:", input.subject);
    console.info("  Body:\n", input.text);
    return;
  }

  await getTransporter().sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

export function appBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
