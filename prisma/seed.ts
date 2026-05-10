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
    {
      slug: "forklift-container-unload",
      name: "Container unload — forklift labor (per hour)",
      description:
        "Certified forklift operators for container devanning and pallet staging. Minimum 2-hour bill; overtime rates apply outside business hours.",
      sku: "WH-FL-CONT-HR",
      priceCents: 185_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "inventory-cycle-count",
      name: "Inventory cycle count (per SKU band)",
      description:
        "WMS-assisted wall-to-wall or ABC cycle count with variance report. Bands: up to 250 / 500 / 1000 SKUs; larger footprints quoted.",
      sku: "WH-INV-CYCLE-250",
      priceCents: 320_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "kitting-assembly-bench",
      name: "Kitting & light assembly (per completed kit)",
      description:
        "BOM-driven pick, subassembly, QC photo on request, and pack-out to ship-ready carton. Serialized items supported.",
      sku: "WH-KIT-LASM",
      priceCents: 6_50,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "returns-inspection-restock",
      name: "Returns intake — inspection & restock",
      description:
        "RMA verification, disposition grading (A/B/C), photos for disputes, and restock or scrap per your policy. Hazmat returns excluded.",
      sku: "WH-RTN-INSP",
      priceCents: 18_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "same-day-rush-processing",
      name: "Same-day rush order processing",
      description:
        "Cutoff 11:00 local; prioritized pick/pack and carrier tender same business day. Subject to inventory availability and carrier pickup windows.",
      sku: "WH-RUSH-SD",
      priceCents: 199_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "pallet-stretch-wrap-machine",
      name: "Machine stretch wrap — per outbound pallet",
      description: "High-retention machine wrap for LTL/FTL stability. Includes two top sheets; corner posts extra.",
      sku: "WH-WRAP-MCH",
      priceCents: 12_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "barcode-relabel-compliance",
      name: "Barcode relabeling (GS1 / retailer compliance)",
      description:
        "Print-and-apply or hand-apply labels from your data file; scan verification and exception log included.",
      sku: "WH-LBL-GS1",
      priceCents: 2_25,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "cold-chain-pallet-weekly",
      name: "Cold chain pallet position (weekly)",
      description:
        "2–8 °C monitored storage with digital temp logs and alarm escalation. Minimum one week; pharma validation pack available on quote.",
      sku: "WH-CC-PALLET-W",
      priceCents: 189_00,
      kind: ProductKind.SERVICE,
    },
    {
      slug: "void-fill-dunnage-bundle",
      name: "Void fill supply bundle (per carton)",
      description: "Kraft paper + air pillows sized to your carton cube; billed per shipped order line.",
      sku: "WH-VF-BNDL",
      priceCents: 1_85,
      kind: ProductKind.PRODUCT,
    },
    {
      slug: "weekend-receiving-surcharge",
      name: "Weekend / holiday receiving surcharge",
      description:
        "Applies per inbound appointment starting Sat 00:00 through Sun 23:59 or recognized US holidays. Does not include base receiving labor.",
      sku: "WH-RCV-WKND",
      priceCents: 250_00,
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
