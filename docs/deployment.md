# Deployment runbook (AWS-friendly)

This app is a **Next.js** service with **PostgreSQL**. Card data is **not** stored; production needs HTTPS, secrets, and a managed database.

## 1. Database (recommended: Amazon RDS PostgreSQL)

- Create an RDS PostgreSQL instance (multi-AZ optional for production).
- Enable **automated backups** and a sensible retention window.
- Place RDS in private subnets; allow inbound **only** from the app security group on the DB port.
- Create a database user with **least privilege** (schema migrations may need a separate migration role).
- Set `DATABASE_URL` to the JDBC-style URL Prisma expects, e.g.  
  `postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public&sslmode=require`

Run migrations from CI or a bastion:

```bash
npx prisma migrate deploy
```

## 2. Application hosting

**Option A — Vercel (simplest)**  
Connect the Git repo, set environment variables, use **Vercel Postgres** or external RDS. TLS is automatic.

**Option B — AWS ECS/Fargate or Elastic Beanstalk**  
- Build: `npm run build`  
- Run: `npm run start` (Node 20+ recommended; align with Tailwind/Next engine requirements).  
- Put the service behind an **Application Load Balancer**.  
- Use **ACM** for a public certificate on the ALB (HTTPS).  
- Store secrets in **AWS Secrets Manager** or SSM Parameter Store; inject as env at task start.

## 3. Domain and DNS

- In Route 53 (or your DNS provider), create an **A/AAAA alias** or **CNAME** to the load balancer / Vercel target.
- Avoid apex CNAME issues: use Route 53 alias records to ALB, or delegate `www` + redirect apex to `www`.
- After cutover, verify **HTTPS** in the browser (no mixed-content warnings on checkout return URLs).

## 4. Environment variables (minimum)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `SESSION_SECRET` | Long random string (≥16 chars) for session JWT |
| `NEXT_PUBLIC_APP_URL` | Public site URL for payment return/cancel links |
| `ORDER_CHECKOUT_GATEWAY` | `AIRWALLEX`, `ADYEN`, `WORLDPAY`, `CYBERSOURCE`, or `NUVEI` (catalog + invoice checkout; default Airwallex) |
| PSP-specific keys | As documented in `.env.example` |

## 5. Payment webhooks

Expose HTTPS routes (no IP allowlist substitute for signature verification):

- `/api/webhooks/payment/airwallex`
- `/api/webhooks/payment/adyen`
- `/api/webhooks/payment/worldpay`
- `/api/webhooks/payment/cybersource`
- `/api/webhooks/payment/nuvei`

Configure each provider’s dashboard to these URLs.

**Verification:** **Airwallex** uses `x-timestamp` + `x-signature` per [Airwallex webhook docs](https://www.airwallex.com/docs/developer-tools/webhooks/listen-for-webhook-events) (`HMAC_SHA256(secret, timestamp_string + raw_body)` as hex). Other PSPs in this repo still use `X-Webhook-Signature: sha256=<hex>` with `HMAC_SHA256(secret, raw_body)` when their `*_WEBHOOK_SECRET` (or `ADYEN_HMAC_KEY`) is set — see `src/lib/payments/verify-webhook-hmac.ts`.  
Without a secret in **development**, webhooks are accepted for local testing; **production** must set `AIRWALLEX_WEBHOOK_SECRET` (and other PSP secrets as wired) so signatures verify.

**Idempotency:** Each delivery is stored with a hash of `gateway + raw body` (`WebhookDelivery.idempotencyKey`). Retries with the same payload return `{ duplicate: true }` and do not re-apply payment status.

**Cybersource / Worldpay XML:** Bodies starting with `<` are flattened to tag → string pairs for parsing (SOAP-style payloads); JSON continues to work for tests.

## 6. Security and backups

- **TLS** everywhere (browser → ALB / Vercel, ALB → tasks if applicable). On AWS, attach an **ACM** certificate to the ALB listener (HTTPS :443); redirect HTTP → HTTPS. Vercel manages certs automatically.
- **Secrets**: never commit `.env`; use **AWS Secrets Manager** or **SSM Parameter Store** (encrypted) and inject at task/container start. Restrict IAM to read-only for the task role.
- **RDS**: enable **automated backups** with a retention window; optionally copy snapshots to another region for DR. Prefer placing RDS in **private subnets** with security groups allowing only the app tier.
- **Database user**: application role with least privilege (`SELECT`/`INSERT`/`UPDATE` on app tables); separate migration user if you run `prisma migrate` from CI.
- **WAF** (optional): rate-limit auth and webhook paths.  
- **Dependency updates**: enable Dependabot or equivalent.

## 7. Smoke test after deploy

1. Register a customer, place an order from the catalog.  
2. As admin, issue an invoice (optionally override total).  
3. Start checkout with your configured PSP, complete payment.  
4. Confirm **Admin → Payments** shows status transitions; refunds (when wired) show **REFUNDED**.
