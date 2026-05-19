import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

let transporter: Transporter | null = null;
let sesClient: SESClient | null = null;

function getFromAddress(): string {
  return process.env.EMAIL_FROM ?? "noreply@localhost";
}

function getAwsRegion(): string | undefined {
  return process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION;
}

function useSmtp(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

function useSes(): boolean {
  return Boolean(getAwsRegion() && process.env.EMAIL_FROM);
}

function isEmailConfigured(): boolean {
  return useSmtp() || useSes();
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

function getSesClient(): SESClient {
  if (!sesClient) {
    sesClient = new SESClient({ region: getAwsRegion()! });
  }
  return sesClient;
}

async function sendViaSmtp(input: SendEmailInput, from: string): Promise<void> {
  await getTransporter().sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

async function sendViaSes(input: SendEmailInput, from: string): Promise<void> {
  const result = await getSesClient().send(
    new SendEmailCommand({
      Source: from,
      Destination: { ToAddresses: [input.to] },
      Message: {
        Subject: { Data: input.subject, Charset: "UTF-8" },
        Body: {
          Text: { Data: input.text, Charset: "UTF-8" },
          Html: { Data: input.html, Charset: "UTF-8" },
        },
      },
    }),
  );
  console.info("[email] SES sent:", input.subject, "→", input.to, "MessageId:", result.MessageId);
}

export async function sendEmail(input: SendEmailInput): Promise<void> {
  const from = getFromAddress();

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[email] Not configured (set SMTP_* or EMAIL_FROM + AWS_REGION); skipped:",
        input.subject,
        "→",
        input.to,
      );
      return;
    }
    console.info("[email] (dev — email not configured)");
    console.info("  To:", input.to);
    console.info("  Subject:", input.subject);
    console.info("  Body:\n", input.text);
    return;
  }

  try {
    if (useSmtp()) {
      await sendViaSmtp(input, from);
      console.info("[email] SMTP sent:", input.subject, "→", input.to);
    } else {
      await sendViaSes(input, from);
    }
  } catch (e) {
    console.error("[email] Send failed:", input.subject, "→", input.to, e);
    throw e;
  }
}

export function appBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
