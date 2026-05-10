import { PrismaClient, ProductKind, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LEGACY_SLUGS = ["implementation-sprint", "managed-support-monthly", "hardware-gateway-kit"];

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 12);
  const testAdminPassword = await bcrypt.hash("Admin123@", 12);
  const customerPassword = await bcrypt.hash("Customer123!", 12);

  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {
      passwordHash: testAdminPassword,
      role: UserRole.ADMIN,
      name: "Test Admin",
    },
    create: {
      email: "admin@test.com",
      passwordHash: testAdminPassword,
      name: "Test Admin",
      role: UserRole.ADMIN,
      companyName: null,
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      name: "Admin User",
      role: UserRole.ADMIN,
      companyName: "Warehouse Demo",
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    update: {},
    create: {
      email: "customer@example.com",
      passwordHash: customerPassword,
      name: "Demo Customer",
      role: UserRole.CUSTOMER,
      companyName: "Acme LLC",
    },
  });

  const products = [
    {
      slug: "warehouse-storage-pallet-monthly",
      name: "Warehouse storage — pallet position (monthly)",
      description:
        "Climate-controlled pallet storage with inbound receiving and cycle-count on request. Minimum one pallet; prorated partial months at admin discretion.",
      sku: "WH-STOR-PALLET-M",
      priceCents: 75_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "packing-service",
      name: "Packing & materials service",
      description:
        "Pick, pack, and label for outbound orders. Includes standard materials; specialty packaging quoted separately.",
      sku: "WH-PACK-STD",
      priceCents: 45_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "ltl-shipping-coordination",
      name: "LTL shipping coordination",
      description:
        "Dock scheduling, BOL preparation, and carrier handoff for LTL moves. Freight charges billed pass-through per carrier AWB.",
      sku: "WH-LTL-COORD",
      priceCents: 125_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "receiving-cross-dock",
      name: "Receiving & cross-dock",
      description: "Unload, verify count, and cross-dock to outbound within 24–48h. Oversized or high-SKU loads may require custom quote.",
      sku: "WH-RCV-XDCK",
      priceCents: 95_00,
      kind: ProductKind.SERVICE,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        sku: p.sku,
        priceCents: p.priceCents,
        kind: p.kind,
        active: true,
      },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.description,
        sku: p.sku,
        priceCents: p.priceCents,
        kind: p.kind,
        active: true,
      },
    });
  }

  await prisma.product.updateMany({
    where: { slug: { in: LEGACY_SLUGS } },
    data: { active: false },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
