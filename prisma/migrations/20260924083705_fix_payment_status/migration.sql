-- AlterTable
ALTER TABLE "Payment"
ALTER COLUMN "status" TYPE "PaymentStatus"
USING COALESCE("status"[1], 'PENDING'::"PaymentStatus");

ALTER TABLE "Payment"
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "status" SET NOT NULL;
