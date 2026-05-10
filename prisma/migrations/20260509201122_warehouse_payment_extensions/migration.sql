-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PaymentGatewayId" ADD VALUE 'ADYEN';
ALTER TYPE "PaymentGatewayId" ADD VALUE 'WORLDPAY';
ALTER TYPE "PaymentGatewayId" ADD VALUE 'CYBERSOURCE';

-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';
