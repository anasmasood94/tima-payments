# Tima Payments

A warehouse services e-commerce and payment platform for **B612 Tima Inc.**, built with Next.js 15, PostgreSQL, and Prisma. The app provides a public marketing site, a product/service catalog with hosted payment checkout, a customer portal, and an admin dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Language | TypeScript 5 |
| Database | PostgreSQL via Prisma ORM |
| Styling | Tailwind CSS 3 |
| Auth | Custom JWT sessions (jose + bcryptjs) |
| Validation | Zod 4 |
| Payments | Airwallex (primary) + Adyen, Worldpay, CyberSource, Nuvei adapters |

## Features

- **Product Catalog** — browse warehouse services and products, set quantities, place orders or request quotes
- **Hosted Payment Checkout** — card data never touches the app (PCI DSS out of scope); gateway adapter pattern supports multiple PSPs
- **Customer Portal** — view orders, invoices, and payment status
- **Admin Dashboard** — manage products, orders, customers, invoices, payments, and refunds
- **Webhook Processing** — per-PSP webhook endpoints with HMAC signature verification and SHA-256 idempotency
- **i18n** — full English and Chinese (Simplified) localization with client-side locale switching
- **Role-Based Access** — middleware-protected admin and portal routes with JWT cookie auth

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Setup

1. **Install dependencies**

```bash
npm install
```

2. **Configure environment variables**

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Key variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | JWT signing secret (min 16 chars) |
| `NEXT_PUBLIC_APP_URL` | Public app URL (default `http://localhost:3000`) |
| `AIRWALLEX_CLIENT_ID` | Airwallex API client ID |
| `AIRWALLEX_API_KEY` | Airwallex API key |
| `AIRWALLEX_WEBHOOK_SECRET` | Airwallex webhook signing secret |

See `.env.example` for the full list including Adyen, Worldpay, CyberSource, and Nuvei credentials.

3. **Set up the database**

```bash
npx prisma migrate dev
```

4. **Seed the database** (optional — adds sample users and products)

```bash
npm run db:seed
```

Default seed accounts:

| Email | Password | Role |
|---|---|---|
| `admin@b612tima.com` | `admin123` | Admin |
| `customer@example.com` | `customer123` | Customer |

5. **Start the dev server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run dev:turbo` | Start with Turbopack |
| `npm run build` | Generate Prisma client and build for production |
| `npm start` | Start production server |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:push` | Push schema changes without migrations |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:seed` | Seed the database |

## Project Structure

```
src/
├── app/
│   ├── (app)/              # Main app shell (nav + footer)
│   │   ├── home/           # Marketing homepage
│   │   ├── about/          # About page
│   │   ├── services/       # Services page
│   │   ├── contact/        # Contact page
│   │   ├── catalog/        # Product catalog + [slug] detail
│   │   ├── portal/         # Customer portal (orders, invoices, payments)
│   │   └── admin/          # Admin dashboard
│   ├── (auth)/             # Login and register pages
│   └── api/webhooks/       # Webhook endpoints per PSP
├── actions/                # Server Actions (auth, orders, invoices, payments, etc.)
├── components/             # Shared UI components
└── lib/
    ├── auth/               # JWT session management, password hashing
    ├── payments/            # Gateway adapter pattern, webhook handling
    └── i18n/               # Translation dictionaries and language context
```

## Payment Architecture

The app uses a **gateway adapter pattern** where each PSP implements a unified `PaymentGatewayAdapter` interface:

- `createHostedCheckout` — redirect the customer to the PSP's hosted payment page
- `verifyWebhookRequest` — validate webhook signature
- `parseWebhookPayload` — normalize the PSP-specific payload
- `refundPayment` — initiate a refund

Airwallex is fully implemented. Adyen, Worldpay, CyberSource, and Nuvei have stub adapters with webhook verification in place. A mock gateway is available for local development without PSP credentials.

All monetary values are stored as integers (cents) in the database. Payment settlement is transactional — payment, order, and invoice statuses update atomically.
