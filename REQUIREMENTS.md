# Warehouse service platform — Phase 1 MVP requirements

**Document purpose:** Single source of truth for scope, priorities, and delivery status. Updated to match the **simple warehouse services MVP** (not a full WMS/TMS/e‑commerce stack).

**Product goal:** Launch quickly with basic **service listing**, **customer registration**, **admin price control**, and **payment integration** via **hosted/redirect checkout** (no card data stored in-app).

---

## In scope for Phase 1 (MVP)

### Services / products to list

| Offering | Phase 1 expectation |
|----------|---------------------|
| Warehouse space rental / storage | Listed as catalog items (seed + admin CRUD) |
| Packing service | Same |
| LTL shipping service | Same |
| Other basic warehouse services | Admin can add from admin panel |

**Note:** Default **seed** now uses warehouse-oriented SKUs (storage, packing, LTL coordination, receiving/cross-dock); legacy demo products are **deactivated** on seed run.

### Explicitly out of scope (Phase 1)

- Full WMS, full inventory, full TMS  
- Complex carrier quoting, heavy automation  
- Multi-warehouse advanced management, full accounting  

**Priority:** Fast launch, stable core, **gateway adapter** pattern so providers can be added or switched without rewriting checkout/order flows.

---

## Customer requirements

| # | Requirement | Status | Notes |
|---|-------------|--------|--------|
| C1 | Register and log in | **Done** | Email + password; JWT session cookie; customer role on self-serve registration |
| C2 | View warehouse services/products | **Done** | Public catalog + detail by slug; inactive items hidden from catalog |
| C3 | Submit order or service request | **Done** | Catalog form: “Place order” (`CONFIRMED`) or “Request quote” (`QUOTE_REQUESTED`); optional notes |
| C4 | See quoted price or payment amount | **Done** | List prices + line totals; portal invoice shows **amount due** vs **line subtotal** when admin overrode the invoice total |
| C5 | Pay online through payment gateway | **Partial** | **MOCK** + **stub** hosted URL end-to-end; adapters for **Airwallex, Adyen, Worldpay, Cybersource, Nuvei**; **live** Payment Intent / Sessions API calls per PSP still to wire |

### Security (payments)

| # | Requirement | Status | Notes |
|---|-------------|--------|--------|
| S1 | Do **not** store PAN/CVV | **Done** | No card fields in UI or schema; checkout is provider-hosted or stub-hosted |
| S2 | 3DS / authentication at provider | **Done** | Copy + flow rely on PSP hosted pages; no in-app card capture |

---

## Admin requirements

| # | Requirement | Status | Notes |
|---|-------------|--------|--------|
| A1 | Add / edit services (products) | **Done** | Create + edit; **price** and **active** flag = price visibility control |
| A2 | Delete services | **Done** | **Remove from catalog** (soft delete: `active = false`) on admin products table; edit form still supports **Active** toggle |
| A3 | Adjust prices from backend | **Done** | Admin product form stores USD → cents |
| A4 | View customer accounts | **Done** | **`/admin/customers`** read-only directory + customer on order detail |
| A5 | View order / service requests | **Done** | Admin orders list + detail |
| A6 | Manually adjust order amounts | **Done** | On **Issue invoice**, optional **Invoice total (USD)** overrides line-item subtotal (quoted/adjusted amount) |
| A7 | Create payment orders / invoices | **Done** | “Issue invoice” on order → `ISSUED` invoice + order `INVOICED` |
| A8 | Payment status: Pending / Paid / Failed / **Refunded** | **Partial** | **`REFUNDED`** in schema + webhooks/settlement; **`/admin/payments`** list; confirm **refund** event → `providerPaymentId` mapping on each live PSP |

---

## Payment integration

| # | Requirement | Status | Notes |
|---|-------------|--------|--------|
| P1 | Gateway **adapter** design | **Done** | `PaymentGatewayAdapter` + registry; swap via `ORDER_CHECKOUT_GATEWAY` env |
| P2 | Airwallex | **Stub** | Adapter + webhook route; optional `X-Webhook-Signature` when `AIRWALLEX_WEBHOOK_SECRET` set; native Airwallex signature TBD for prod |
| P3 | Nuvei | **Stub** | Same pattern (legacy from earlier spec) |
| P4 | Worldpay | **Stub** | Adapter + webhook; XML body flattened to tags; optional standard HMAC header when secret set |
| P5 | Cybersource | **Stub** | Adapter + webhook; JSON + **XML** flattened to tags (`reasonCode`, `decision`, `requestID`, …); optional standard HMAC when secret set |
| P6 | Adyen | **Stub** | Adapter + webhook; standard HMAC header when `ADYEN_HMAC_KEY` set; native `hmacSignature` verification TBD for prod |
| P7 | Webhook-driven status updates | **Partial** | **Idempotency** on raw payload hash; staging **HMAC** header; terminal statuses applied via `applyPaymentStatusByProviderRef` |

**Target architecture (unchanged):** one interface for “create hosted checkout” + “parse webhook”; app stores **provider references and status only**.

---

## Server, domain, and operations (AWS-friendly)

| # | Topic | Status | Notes |
|---|--------|--------|--------|
| O1 | AWS server setup | **Doc** | **`docs/deployment.md`** — RDS, ECS/Beanstalk/Vercel, TLS, secrets, webhooks, idempotency |
| O2 | Database setup | **Done (app layer)** | PostgreSQL + Prisma schema, migrations, `DATABASE_URL` |
| O3 | Domain connection | **Doc** | DNS checklist in **`docs/deployment.md`** §3 |
| O4 | SSL / TLS | **Doc** | ACM / platform-managed certs described in **`docs/deployment.md`** §6 |
| O5 | Deployment environment | **Partial** | `npm run build` / `start`; production needs `SESSION_SECRET`, `DATABASE_URL`, `NEXT_PUBLIC_APP_URL`, PSP secrets |
| O6 | Backup / basic security | **Doc** | RDS backups, least-privilege DB user, secrets in SSM/Secrets Manager — **`docs/deployment.md`** §6 |

---

## Implementation summary (codebase today)

**Stack:** Next.js (App Router), PostgreSQL, Prisma, server actions, cookie-based sessions (no card storage).

**Implemented flows:**

1. Customer registers → browses catalog → submits order or quote request → sees orders in portal.  
2. Admin issues invoice from order → customer opens invoice → starts hosted checkout → (MOCK) completes payment → order **PAID**.  
3. Webhook endpoints normalize events; **duplicate payloads are ignored**; optional **HMAC** when secrets are configured.

**Gaps vs this requirements doc (highest impact next):**

1. **PSP-specific:** Real **hosted session** API calls + **native** webhook signature schemes (Airwallex, Adyen `hmacSignature`, Worldpay MAC, etc.).  
2. **Refunds:** Validate **REFUNDED** + `providerPaymentId` on live payloads (may differ from checkout reference).  
3. **Optional:** Per-line admin edits, hard-delete products with no references, richer accounting exports.

---

## Change log

| Date | Change |
|------|--------|
| 2026-05-09 | Rewritten for **warehouse MVP** scope; mapped to **implemented** vs **partial** vs **not started** |
| 2026-05-09 | Code alignment: gateways **Adyen/Worldpay/Cybersource**, **`REFUNDED`**, invoice **amount override**, **admin customers** + **payments**, product **soft remove**, warehouse **seed**, **`docs/deployment.md`**, Tailwind **v3** for Node 18 builds |
| 2026-05-09 | Webhook **idempotency** (`WebhookDelivery.idempotencyKey`), staging **HMAC** header, **XML** flattening for Cybersource/Worldpay, portal **invoice vs line subtotal**, ops doc expansion, **S2/C4** status updates |
