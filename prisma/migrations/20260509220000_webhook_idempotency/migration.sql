-- AlterTable
ALTER TABLE "WebhookDelivery" ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "processingError" TEXT;

-- Backfill existing rows (one-off) so NOT NULL + unique index can apply
UPDATE "WebhookDelivery" SET "idempotencyKey" = "id" WHERE "idempotencyKey" IS NULL;

ALTER TABLE "WebhookDelivery" ALTER COLUMN "idempotencyKey" SET NOT NULL;

CREATE UNIQUE INDEX "WebhookDelivery_idempotencyKey_key" ON "WebhookDelivery"("idempotencyKey");
