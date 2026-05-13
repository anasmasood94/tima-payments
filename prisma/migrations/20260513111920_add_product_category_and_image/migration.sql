-- CreateEnum
CREATE TYPE "ServiceCategory" AS ENUM ('DROPSHIPPING', 'WAREHOUSING', 'OTR_TRUCKING', 'DRAYAGE', 'UPS_HUB_DIRECT', 'DISCOUNTED_SHIPPING', 'SHIPMENT_BOOKING', 'CUSTOMS_SERVICE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "ServiceCategory",
ADD COLUMN     "imageUrl" TEXT;

-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "Product_name_idx" ON "Product"("name");
